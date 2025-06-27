-- Performance optimization indexes based on audit findings
-- Add indexes for frequently queried columns

-- Restaurants table indexes
CREATE INDEX IF NOT EXISTS idx_restaurants_active ON restaurants(is_active);
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine_type);

-- Menu items table indexes  
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_available ON menu_items(restaurant_id, is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_price ON menu_items(price);

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status ON orders(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_created ON orders(restaurant_id, created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_payment_method ON orders(payment_method);

-- Chat messages table indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_created ON chat_messages(session_id, created_at);

-- FAQs table indexes
CREATE INDEX IF NOT EXISTS idx_faqs_restaurant ON faqs(restaurant_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_menu_items_search ON menu_items USING gin(to_tsvector('english', name || ' ' || description));
CREATE INDEX IF NOT EXISTS idx_orders_recent ON orders(restaurant_id, created_at DESC) WHERE created_at > NOW() - INTERVAL '7 days';

-- Partial indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_pending ON orders(restaurant_id, created_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_orders_today ON orders(restaurant_id, total) WHERE created_at >= CURRENT_DATE;

-- Update table statistics for better query planning
ANALYZE restaurants;
ANALYZE menu_items;
ANALYZE orders;
ANALYZE chat_messages;
ANALYZE faqs;