-- OrderFi Database Optimization - Paste-Ready SQL Migration
-- Based on Woolworths/Coles self-checkout UX principles and voice-first design

-- 1) Enable extensions for advanced search and vector capabilities
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS vector;

-- 2) Core venues table with timezone and settings support
CREATE TABLE IF NOT EXISTS venues (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  timezone      TEXT NOT NULL DEFAULT 'Australia/Sydney',
  settings      JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) Enhanced categories with voice aliases for supermarket-style navigation
CREATE TABLE IF NOT EXISTS categories (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id       UUID REFERENCES venues(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  position       INT  NOT NULL DEFAULT 0,
  voice_aliases  JSONB NOT NULL DEFAULT '[]',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4) Optimized items table with stable UUIDs and voice-first design
CREATE TABLE IF NOT EXISTS items (
  item_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),   -- stable unique ID (replaces PLU system)
  venue_id       UUID REFERENCES venues(id) ON DELETE CASCADE,
  category_id    UUID REFERENCES categories(id) ON DELETE SET NULL,
  name           TEXT NOT NULL,
  description    TEXT,
  price_cents    INT  NOT NULL,
  cost_cents     INT  DEFAULT 0,
  stock_level    INT  NOT NULL DEFAULT 0,
  low_stock_threshold INT DEFAULT 10,
  track_inventory BOOLEAN DEFAULT true,
  is_available   BOOLEAN DEFAULT true,
  voice_aliases  JSONB NOT NULL DEFAULT '[]',       -- Voice commands like "wings", "buffalo chicken"
  dietary_tags   TEXT[] DEFAULT '{}',               -- "vegan", "gluten-free", etc.
  popularity_score INT DEFAULT 0,
  embedding      VECTOR(1536),                      -- OpenAI embeddings for semantic search
  name_tsv       TSVECTOR,                          -- Full-text search on name
  desc_tsv       TSVECTOR,                          -- Full-text search on description
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5) Modifiers table for upsells and customizations
CREATE TABLE IF NOT EXISTS modifiers (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id        UUID REFERENCES items(item_id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  price_cents    INT NOT NULL DEFAULT 0,
  voice_aliases  JSONB NOT NULL DEFAULT '[]'
);

-- 6) Keep tsvector columns up to date automatically
CREATE OR REPLACE FUNCTION items_tsv_trigger() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.name_tsv := to_tsvector('simple', NEW.name);
  NEW.desc_tsv := to_tsvector('simple', COALESCE(NEW.description, ''));
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tsv_items ON items;
CREATE TRIGGER tsv_items BEFORE INSERT OR UPDATE
  ON items FOR EACH ROW EXECUTE FUNCTION items_tsv_trigger();

-- 7) Performance indexes for instant voice search and filtering
CREATE INDEX IF NOT EXISTS idx_items_voice_aliases ON items USING GIN (voice_aliases jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_categories_voice_aliases ON categories USING GIN (voice_aliases jsonb_path_ops);
CREATE INDEX IF NOT EXISTS idx_items_name_tsv ON items USING GIN (name_tsv);
CREATE INDEX IF NOT EXISTS idx_items_desc_tsv ON items USING GIN (desc_tsv);
CREATE INDEX IF NOT EXISTS idx_items_name_trgm ON items USING GIN (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_items_dietary_tags ON items USING GIN (dietary_tags);

-- Vector similarity search (when embeddings are populated)
CREATE INDEX IF NOT EXISTS idx_items_embedding ON items USING ivfflat (embedding vector_l2_ops) WITH (lists = 100);

-- Fast filtering for manager interface
CREATE INDEX IF NOT EXISTS idx_items_stock ON items (venue_id, stock_level);
CREATE INDEX IF NOT EXISTS idx_items_availability ON items (venue_id, is_available);
CREATE INDEX IF NOT EXISTS idx_items_price ON items (venue_id, price_cents);
CREATE INDEX IF NOT EXISTS idx_items_category ON items (venue_id, category_id);

-- 8) Partition orders by month for scalability
CREATE TABLE IF NOT EXISTS orders (
  id            BIGSERIAL PRIMARY KEY,
  session_id    UUID NOT NULL,
  venue_id      UUID REFERENCES venues(id) ON DELETE CASCADE,
  customer_id   TEXT,
  status        TEXT NOT NULL DEFAULT 'pending',
  total_cents   INT NOT NULL DEFAULT 0,
  payment_method TEXT DEFAULT 'cash',
  table_number  INT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Create current month partition
CREATE TABLE IF NOT EXISTS orders_2025_07 PARTITION OF orders
  FOR VALUES FROM ('2025-07-01') TO ('2025-08-01');

-- Create next month partition
CREATE TABLE IF NOT EXISTS orders_2025_08 PARTITION OF orders
  FOR VALUES FROM ('2025-08-01') TO ('2025-09-01');

-- 9) Order line items for detailed tracking
CREATE TABLE IF NOT EXISTS order_items (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT REFERENCES orders(id) ON DELETE CASCADE,
  item_id       UUID REFERENCES items(item_id) ON DELETE RESTRICT,
  quantity      INT NOT NULL DEFAULT 1,
  unit_price_cents INT NOT NULL,
  modifiers     JSONB DEFAULT '[]'
);

-- 10) Sessions for customer interaction tracking
CREATE TABLE IF NOT EXISTS sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id      UUID REFERENCES venues(id) ON DELETE CASCADE,
  table_id      INT,
  wallet_address TEXT,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at      TIMESTAMPTZ,
  total_spent_cents INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_sessions_lookup ON sessions (venue_id, table_id, wallet_address, started_at);

-- 11) Unified search materialized view (Woolworths-style instant search)
CREATE MATERIALIZED VIEW IF NOT EXISTS menu_search AS
SELECT
  i.item_id,
  i.venue_id,
  i.name,
  i.price_cents,
  i.stock_level,
  i.is_available,
  c.name as category_name,
  to_tsvector('simple',
    i.name || ' ' ||
    COALESCE(i.description, '') || ' ' ||
    COALESCE(c.name, '') || ' ' ||
    COALESCE(array_to_string(i.voice_aliases::text[], ' '), '') || ' ' ||
    COALESCE(array_to_string(i.dietary_tags, ' '), '') || ' ' ||
    COALESCE((
      SELECT string_agg(m.name, ' ')
      FROM modifiers m 
      WHERE m.item_id = i.item_id
    ), '')
  ) AS search_doc
FROM items i
LEFT JOIN categories c ON i.category_id = c.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_menu_search_item_id ON menu_search (item_id);
CREATE INDEX IF NOT EXISTS idx_menu_search_doc ON menu_search USING GIN (search_doc);
CREATE INDEX IF NOT EXISTS idx_menu_search_venue ON menu_search (venue_id);

-- 12) Auto-refresh search view when menu changes
CREATE OR REPLACE FUNCTION refresh_menu_search() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY menu_search;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_refresh_menu_search_items ON items;
CREATE TRIGGER trg_refresh_menu_search_items
  AFTER INSERT OR UPDATE OR DELETE ON items
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_menu_search();

DROP TRIGGER IF EXISTS trg_refresh_menu_search_categories ON categories;
CREATE TRIGGER trg_refresh_menu_search_categories
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_menu_search();

DROP TRIGGER IF EXISTS trg_refresh_menu_search_modifiers ON modifiers;
CREATE TRIGGER trg_refresh_menu_search_modifiers
  AFTER INSERT OR UPDATE OR DELETE ON modifiers
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_menu_search();

-- 13) Voice search functions for instant lookups
CREATE OR REPLACE FUNCTION search_items_voice(
  p_venue_id UUID,
  p_query TEXT,
  p_limit INT DEFAULT 10
) RETURNS TABLE (
  item_id UUID,
  name TEXT,
  price_cents INT,
  category_name TEXT,
  stock_level INT,
  is_available BOOLEAN,
  similarity_score REAL
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ms.item_id,
    ms.name,
    ms.price_cents,
    ms.category_name,
    ms.stock_level,
    ms.is_available,
    ts_rank(ms.search_doc, plainto_tsquery('simple', p_query)) as similarity_score
  FROM menu_search ms
  WHERE ms.venue_id = p_venue_id
    AND (
      ms.search_doc @@ plainto_tsquery('simple', p_query)
      OR ms.name % p_query  -- trigram similarity
    )
  ORDER BY similarity_score DESC, ms.name
  LIMIT p_limit;
END;
$$;

-- 14) Fast category-based browsing (supermarket-style)
CREATE OR REPLACE FUNCTION get_items_by_category(
  p_venue_id UUID,
  p_category_name TEXT DEFAULT NULL
) RETURNS TABLE (
  item_id UUID,
  name TEXT,
  description TEXT,
  price_cents INT,
  category_name TEXT,
  stock_level INT,
  is_available BOOLEAN
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.item_id,
    i.name,
    i.description,
    i.price_cents,
    c.name as category_name,
    i.stock_level,
    i.is_available
  FROM items i
  LEFT JOIN categories c ON i.category_id = c.id
  WHERE i.venue_id = p_venue_id
    AND (p_category_name IS NULL OR c.name = p_category_name)
    AND i.is_available = true
  ORDER BY c.position, i.name;
END;
$$;

-- 15) Low stock alerts for manager interface
CREATE OR REPLACE FUNCTION get_low_stock_items(
  p_venue_id UUID
) RETURNS TABLE (
  item_id UUID,
  name TEXT,
  current_stock INT,
  threshold INT,
  days_until_out INT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.item_id,
    i.name,
    i.stock_level as current_stock,
    i.low_stock_threshold as threshold,
    CASE 
      WHEN i.stock_level <= 0 THEN 0
      ELSE GREATEST(1, i.stock_level / GREATEST(1, COALESCE(avg_daily_usage.usage, 1)))
    END as days_until_out
  FROM items i
  LEFT JOIN (
    SELECT 
      oi.item_id,
      AVG(oi.quantity) as usage
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    WHERE o.venue_id = p_venue_id
      AND o.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY oi.item_id
  ) avg_daily_usage ON i.item_id = avg_daily_usage.item_id
  WHERE i.venue_id = p_venue_id
    AND i.track_inventory = true
    AND i.stock_level <= i.low_stock_threshold
  ORDER BY days_until_out ASC, i.stock_level ASC;
END;
$$;

-- Initial data refresh
REFRESH MATERIALIZED VIEW menu_search;

-- Performance monitoring view
CREATE OR REPLACE VIEW performance_stats AS
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE schemaname = 'public'
  AND tablename IN ('items', 'orders', 'categories', 'menu_search')
ORDER BY tablename, attname;

COMMENT ON MATERIALIZED VIEW menu_search IS 'Unified search index for voice commands and instant filtering - inspired by Woolworths self-checkout UX';
COMMENT ON FUNCTION search_items_voice IS 'Voice-first search with fuzzy matching and semantic ranking';
COMMENT ON FUNCTION get_items_by_category IS 'Fast category browsing like supermarket self-checkout departments';
COMMENT ON FUNCTION get_low_stock_items IS 'Manager-friendly inventory alerts with predictive insights';