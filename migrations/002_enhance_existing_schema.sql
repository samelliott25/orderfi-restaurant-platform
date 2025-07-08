-- OrderFi Database Enhancement - Non-destructive optimization for existing schema
-- Adds Woolworths/Coles self-checkout UX principles to current database

-- 1) Enable extensions for advanced search capabilities
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Note: Vector extension may not be available in all PostgreSQL environments
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 2) Add voice aliases and enhanced search to existing menu_items table
-- Check if columns already exist before adding
DO $$
BEGIN
    -- Add voice_aliases column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'menu_items' AND column_name = 'voice_aliases') THEN
        ALTER TABLE menu_items ADD COLUMN voice_aliases JSONB DEFAULT '[]';
    END IF;
    
    -- Add search vectors if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'menu_items' AND column_name = 'name_tsv') THEN
        ALTER TABLE menu_items ADD COLUMN name_tsv TSVECTOR;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'menu_items' AND column_name = 'desc_tsv') THEN
        ALTER TABLE menu_items ADD COLUMN desc_tsv TSVECTOR;
    END IF;
    
    -- Add item_uuid for stable identification if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'menu_items' AND column_name = 'item_uuid') THEN
        ALTER TABLE menu_items ADD COLUMN item_uuid UUID DEFAULT gen_random_uuid();
    END IF;
END $$;

-- 3) Create trigger to maintain tsvector columns
CREATE OR REPLACE FUNCTION update_menu_items_tsv() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.name_tsv := to_tsvector('simple', NEW.name);
  NEW.desc_tsv := to_tsvector('simple', COALESCE(NEW.description, ''));
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS tsv_menu_items ON menu_items;
CREATE TRIGGER tsv_menu_items BEFORE INSERT OR UPDATE
  ON menu_items FOR EACH ROW EXECUTE FUNCTION update_menu_items_tsv();

-- 4) Update existing records with search vectors
UPDATE menu_items SET 
  name_tsv = to_tsvector('simple', name),
  desc_tsv = to_tsvector('simple', COALESCE(description, ''))
WHERE name_tsv IS NULL OR desc_tsv IS NULL;

-- 5) Performance indexes for voice search and filtering
CREATE INDEX IF NOT EXISTS idx_menu_items_voice_aliases ON menu_items USING GIN (voice_aliases jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_tsv ON menu_items USING GIN (name_tsv);
CREATE INDEX IF NOT EXISTS idx_menu_items_desc_tsv ON menu_items USING GIN (desc_tsv);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_trgm ON menu_items USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_menu_items_dietary_tags ON menu_items USING GIN (dietary_tags);

-- Manager-friendly filtering indexes
CREATE INDEX IF NOT EXISTS idx_menu_items_stock ON menu_items (restaurant_id, current_stock);
CREATE INDEX IF NOT EXISTS idx_menu_items_availability ON menu_items (restaurant_id, is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_price ON menu_items (restaurant_id, price);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (restaurant_id, category);
CREATE INDEX IF NOT EXISTS idx_menu_items_uuid ON menu_items (item_uuid);

-- 6) Create materialized view for unified search (Woolworths-style instant search)
DROP MATERIALIZED VIEW IF EXISTS menu_search_view;
CREATE MATERIALIZED VIEW menu_search_view AS
SELECT
  mi.id,
  mi.item_uuid,
  mi.restaurant_id,
  mi.name,
  mi.price,
  mi.current_stock,
  mi.is_available,
  mi.category,
  mi.dietary_tags,
  to_tsvector('simple',
    mi.name || ' ' ||
    COALESCE(mi.description, '') || ' ' ||
    COALESCE(mi.category, '') || ' ' ||
    COALESCE(array_to_string(mi.voice_aliases::text[], ' '), '') || ' ' ||
    COALESCE(array_to_string(mi.dietary_tags, ' '), '') || ' ' ||
    COALESCE(array_to_string(mi.aliases, ' '), '') || ' ' ||
    COALESCE(array_to_string(mi.keywords, ' '), '')
  ) AS search_doc
FROM menu_items mi
WHERE mi.is_available = true;

CREATE UNIQUE INDEX idx_menu_search_view_id ON menu_search_view (id);
CREATE INDEX idx_menu_search_view_doc ON menu_search_view USING GIN (search_doc);
CREATE INDEX idx_menu_search_view_restaurant ON menu_search_view (restaurant_id);
CREATE INDEX idx_menu_search_view_category ON menu_search_view (restaurant_id, category);

-- 7) Auto-refresh search view when menu changes
CREATE OR REPLACE FUNCTION refresh_menu_search_view() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY menu_search_view;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_menu_search ON menu_items;
CREATE TRIGGER trg_refresh_menu_search
  AFTER INSERT OR UPDATE OR DELETE ON menu_items
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_menu_search_view();

-- 8) Voice search function for instant lookups (supermarket-style)
CREATE OR REPLACE FUNCTION search_menu_items_voice(
  p_restaurant_id INTEGER,
  p_query TEXT,
  p_limit INT DEFAULT 10
) RETURNS TABLE (
  id INTEGER,
  item_uuid UUID,
  name TEXT,
  price NUMERIC,
  category TEXT,
  current_stock INTEGER,
  is_available BOOLEAN,
  similarity_score REAL
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    msv.id,
    msv.item_uuid,
    msv.name,
    msv.price,
    msv.category,
    msv.current_stock,
    msv.is_available,
    ts_rank(msv.search_doc, plainto_tsquery('simple', p_query)) as similarity_score
  FROM menu_search_view msv
  WHERE msv.restaurant_id = p_restaurant_id
    AND (
      msv.search_doc @@ plainto_tsquery('simple', p_query)
      OR msv.name % p_query  -- trigram similarity for fuzzy matching
    )
  ORDER BY similarity_score DESC, msv.name
  LIMIT p_limit;
END;
$$;

-- 9) Category-based browsing (Woolworths department-style)
CREATE OR REPLACE FUNCTION get_menu_items_by_category(
  p_restaurant_id INTEGER,
  p_category TEXT DEFAULT NULL
) RETURNS TABLE (
  id INTEGER,
  item_uuid UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  category TEXT,
  current_stock INTEGER,
  is_available BOOLEAN,
  dietary_tags TEXT[]
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mi.id,
    mi.item_uuid,
    mi.name,
    mi.description,
    mi.price,
    mi.category,
    mi.current_stock,
    mi.is_available,
    mi.dietary_tags
  FROM menu_items mi
  WHERE mi.restaurant_id = p_restaurant_id
    AND (p_category IS NULL OR mi.category = p_category)
    AND mi.is_available = true
  ORDER BY mi.category, mi.name;
END;
$$;

-- 10) Manager-friendly low stock alerts with predictive insights
CREATE OR REPLACE FUNCTION get_low_stock_items(
  p_restaurant_id INTEGER
) RETURNS TABLE (
  id INTEGER,
  item_uuid UUID,
  name TEXT,
  current_stock INTEGER,
  threshold INTEGER,
  category TEXT,
  days_until_out INTEGER
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mi.id,
    mi.item_uuid,
    mi.name,
    mi.current_stock,
    mi.low_stock_threshold as threshold,
    mi.category,
    CASE 
      WHEN mi.current_stock <= 0 THEN 0
      WHEN avg_usage.daily_usage > 0 THEN GREATEST(1, mi.current_stock / avg_usage.daily_usage)
      ELSE 999
    END as days_until_out
  FROM menu_items mi
  LEFT JOIN (
    SELECT 
      sd.item_id,
      AVG(sd.quantity)::INTEGER as daily_usage
    FROM sales_data sd
    WHERE sd.restaurant_id = p_restaurant_id
      AND sd.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY sd.item_id
  ) avg_usage ON mi.id = avg_usage.item_id
  WHERE mi.restaurant_id = p_restaurant_id
    AND mi.track_inventory = true
    AND mi.current_stock <= COALESCE(mi.low_stock_threshold, 10)
  ORDER BY days_until_out ASC, mi.current_stock ASC;
END;
$$;

-- 11) Popular items analysis (supermarket best-sellers style)
CREATE OR REPLACE FUNCTION get_popular_items(
  p_restaurant_id INTEGER,
  p_days INTEGER DEFAULT 7,
  p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
  id INTEGER,
  item_uuid UUID,
  name TEXT,
  category TEXT,
  total_sold INTEGER,
  revenue NUMERIC,
  trend TEXT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mi.id,
    mi.item_uuid,
    mi.name,
    mi.category,
    COALESCE(SUM(sd.quantity), 0)::INTEGER as total_sold,
    COALESCE(SUM(sd.total_price), 0) as revenue,
    CASE 
      WHEN COALESCE(SUM(sd.quantity), 0) > mi.popularity_score THEN 'up'
      WHEN COALESCE(SUM(sd.quantity), 0) < mi.popularity_score THEN 'down'
      ELSE 'stable'
    END as trend
  FROM menu_items mi
  LEFT JOIN sales_data sd ON mi.id = sd.item_id 
    AND sd.restaurant_id = p_restaurant_id
    AND sd.created_at >= NOW() - INTERVAL '1 day' * p_days
  WHERE mi.restaurant_id = p_restaurant_id
    AND mi.is_available = true
  GROUP BY mi.id, mi.item_uuid, mi.name, mi.category, mi.popularity_score
  ORDER BY total_sold DESC, revenue DESC
  LIMIT p_limit;
END;
$$;

-- 12) Quick filter functions for visual filter chips
CREATE OR REPLACE FUNCTION get_filtered_items(
  p_restaurant_id INTEGER,
  p_filters JSONB DEFAULT '{}'
) RETURNS TABLE (
  id INTEGER,
  item_uuid UUID,
  name TEXT,
  description TEXT,
  price NUMERIC,
  category TEXT,
  current_stock INTEGER,
  is_available BOOLEAN,
  dietary_tags TEXT[]
) LANGUAGE plpgsql AS $$
DECLARE
  v_low_stock BOOLEAN := (p_filters->>'low_stock')::BOOLEAN;
  v_under_10 BOOLEAN := (p_filters->>'under_10')::BOOLEAN;
  v_vegan BOOLEAN := (p_filters->>'vegan')::BOOLEAN;
  v_gluten_free BOOLEAN := (p_filters->>'gluten_free')::BOOLEAN;
  v_high_value BOOLEAN := (p_filters->>'high_value')::BOOLEAN;
BEGIN
  RETURN QUERY
  SELECT 
    mi.id,
    mi.item_uuid,
    mi.name,
    mi.description,
    mi.price,
    mi.category,
    mi.current_stock,
    mi.is_available,
    mi.dietary_tags
  FROM menu_items mi
  WHERE mi.restaurant_id = p_restaurant_id
    AND mi.is_available = true
    AND (NOT v_low_stock OR (mi.track_inventory AND mi.current_stock <= COALESCE(mi.low_stock_threshold, 10)))
    AND (NOT v_under_10 OR mi.price < 10)
    AND (NOT v_vegan OR 'vegan' = ANY(mi.dietary_tags))
    AND (NOT v_gluten_free OR 'gluten-free' = ANY(mi.dietary_tags))
    AND (NOT v_high_value OR mi.price > 15)
  ORDER BY mi.category, mi.name;
END;
$$;

-- 13) Recent activity tracking for manager dashboard
CREATE OR REPLACE VIEW recent_menu_activity AS
SELECT 
  mi.id,
  mi.item_uuid,
  mi.name,
  mi.category,
  mi.updated_at,
  CASE 
    WHEN mi.updated_at > NOW() - INTERVAL '1 hour' THEN 'just updated'
    WHEN mi.updated_at > NOW() - INTERVAL '1 day' THEN 'recently modified'
    ELSE 'older change'
  END as activity_type,
  CASE
    WHEN mi.current_stock <= COALESCE(mi.low_stock_threshold, 10) AND mi.track_inventory THEN 'low stock'
    WHEN NOT mi.is_available THEN 'unavailable'
    ELSE 'active'
  END as status
FROM menu_items mi
WHERE mi.updated_at > NOW() - INTERVAL '7 days'
ORDER BY mi.updated_at DESC;

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW menu_search_view;

-- Performance monitoring
CREATE OR REPLACE VIEW search_performance_stats AS
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
  AND tablename IN ('menu_items', 'menu_search_view')
  AND indexname LIKE '%trgm%' OR indexname LIKE '%tsv%' OR indexname LIKE '%voice%'
ORDER BY tablename, indexname;

-- Add helpful comments
COMMENT ON MATERIALIZED VIEW menu_search_view IS 'Unified search index for voice commands and instant filtering - inspired by Woolworths self-checkout UX';
COMMENT ON FUNCTION search_menu_items_voice IS 'Voice-first search with fuzzy matching and semantic ranking for restaurant managers';
COMMENT ON FUNCTION get_menu_items_by_category IS 'Fast category browsing like supermarket self-checkout departments';
COMMENT ON FUNCTION get_low_stock_items IS 'Manager-friendly inventory alerts with predictive insights and days-until-out calculations';
COMMENT ON FUNCTION get_popular_items IS 'Popular items analysis showing trends like supermarket best-sellers displays';
COMMENT ON FUNCTION get_filtered_items IS 'Quick filtering for visual filter chips replacing complex dropdown interfaces';

-- Show completion status
SELECT 'Database optimization complete! Voice search, fuzzy matching, and manager-friendly functions are now available.' as status;