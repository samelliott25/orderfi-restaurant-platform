-- OrderFi Database Optimization Migration
-- Implementing UUID-based stable IDs, voice search, and performance enhancements

-- 1) Enable extensions for advanced search capabilities
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- 2) Add UUID column to existing restaurants table if not exists
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS uuid_id UUID DEFAULT gen_random_uuid();
UPDATE restaurants SET uuid_id = gen_random_uuid() WHERE uuid_id IS NULL;

-- 3) Optimize menu items table with stable UUIDs and search features
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS item_uuid UUID DEFAULT gen_random_uuid();
UPDATE menu_items SET item_uuid = gen_random_uuid() WHERE item_uuid IS NULL;

-- Add voice search and embedding columns
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS voice_aliases JSONB DEFAULT '[]';
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS embedding VECTOR(1536);
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS name_tsv TSVECTOR;
ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS desc_tsv TSVECTOR;

-- Populate voice_aliases from existing aliases array
UPDATE menu_items 
SET voice_aliases = to_jsonb(COALESCE(aliases, ARRAY[]::text[])) 
WHERE voice_aliases = '[]'::jsonb;

-- 4) Create function to maintain tsvector columns automatically
CREATE OR REPLACE FUNCTION menu_items_tsv_trigger() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.name_tsv := to_tsvector('simple', NEW.name);
  NEW.desc_tsv := to_tsvector('simple', COALESCE(NEW.description, ''));
  RETURN NEW;
END;
$$;

-- Apply trigger to keep search vectors current
DROP TRIGGER IF EXISTS tsv_menu_items ON menu_items;
CREATE TRIGGER tsv_menu_items BEFORE INSERT OR UPDATE
  ON menu_items FOR EACH ROW EXECUTE FUNCTION menu_items_tsv_trigger();

-- Update existing rows with tsvector data
UPDATE menu_items SET 
  name_tsv = to_tsvector('simple', name),
  desc_tsv = to_tsvector('simple', COALESCE(description, ''));

-- 5) Create performance indexes for voice search and analytics
CREATE INDEX IF NOT EXISTS idx_menu_items_voice_aliases ON menu_items USING GIN (voice_aliases jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_tsv ON menu_items USING GIN (name_tsv);
CREATE INDEX IF NOT EXISTS idx_menu_items_desc_tsv ON menu_items USING GIN (desc_tsv);
CREATE INDEX IF NOT EXISTS idx_menu_items_name_trgm ON menu_items USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_menu_items_stock ON menu_items (restaurant_id, current_stock);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (restaurant_id, category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items (restaurant_id, is_available);

-- Add embedding index when we start using vector search
-- CREATE INDEX IF NOT EXISTS idx_menu_items_embedding ON menu_items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- 6) Optimize orders table for high volume
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_created ON orders (restaurant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_created ON orders (customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status_created ON orders (status, created_at DESC);

-- 7) Create unified search materialized view for instant voice queries
CREATE MATERIALIZED VIEW IF NOT EXISTS menu_search AS
SELECT
  mi.id,
  mi.item_uuid,
  mi.restaurant_id,
  mi.name,
  mi.category,
  mi.price,
  mi.is_available,
  mi.current_stock,
  to_tsvector('simple',
    mi.name || ' ' ||
    COALESCE(array_to_string(mi.aliases, ' '), '') || ' ' ||
    COALESCE(mi.description, '') || ' ' ||
    mi.category
  ) AS search_doc
FROM menu_items mi
WHERE mi.is_available = true;

CREATE INDEX IF NOT EXISTS idx_menu_search_doc ON menu_search USING GIN (search_doc);
CREATE INDEX IF NOT EXISTS idx_menu_search_restaurant ON menu_search (restaurant_id);

-- Function to refresh search view
CREATE OR REPLACE FUNCTION refresh_menu_search() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY menu_search;
  RETURN NULL;
END;
$$;

-- Trigger to keep search view current
DROP TRIGGER IF EXISTS trg_refresh_menu_search ON menu_items;
CREATE TRIGGER trg_refresh_menu_search
  AFTER INSERT OR UPDATE OR DELETE ON menu_items
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_menu_search();

-- 8) Add chat message search optimization
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages (session_id, created_at DESC);

-- 9) Performance settings (optional - may require superuser)
-- ALTER SYSTEM SET shared_preload_libraries = 'pg_stat_statements';
-- ALTER SYSTEM SET max_connections = 200;
-- ALTER SYSTEM SET shared_buffers = '256MB';

-- Initial refresh of materialized view
REFRESH MATERIALIZED VIEW menu_search;

-- Analyze tables for optimal query planning
ANALYZE restaurants;
ANALYZE menu_items;
ANALYZE orders;
ANALYZE chat_messages;

COMMIT;