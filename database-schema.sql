-- ============================================
-- AirStore Bulgaria - Database Schema
-- For Neon PostgreSQL
-- ============================================

-- ============================================
-- 1. ORDERS TABLE
-- Stores all customer orders
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    courier VARCHAR(50) NOT NULL,
    delivery_type VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    qty INTEGER NOT NULL DEFAULT 1,
    total_eur DECIMAL(10,2) NOT NULL,
    total_bgn DECIMAL(10,2) NOT NULL,
    promo_code VARCHAR(20) DEFAULT '',
    status VARCHAR(20) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries by status
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- ============================================
-- 2. REVIEWS TABLE
-- Stores customer reviews
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    text TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============================================
-- 3. VISITORS TABLE
-- Tracks website visitors for analytics
-- ============================================
CREATE TABLE IF NOT EXISTS visitors (
    id SERIAL PRIMARY KEY,
    ip_address VARCHAR(50),
    user_agent TEXT,
    visited_at TIMESTAMP DEFAULT NOW()
);

-- Create index for date-based queries
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_date ON visitors(DATE(visited_at));

-- ============================================
-- 4. INSERT SAMPLE REVIEWS (Optional)
-- Add some initial reviews to get started
-- ============================================
INSERT INTO reviews (name, rating, text, verified, created_at) VALUES
('Иван П.', 5, 'Много чист звук и шумопотискането е топ. Дойдоха бързо слушалките, супер са!', true, NOW() - INTERVAL '2 days'),
('Мария К.', 5, 'Удобни за носене и батерията държи много. Преглед и тест при куриера - всичко ок!', true, NOW() - INTERVAL '5 days'),
('Георги Д.', 4, 'Добро качество за цената. Доставката беше бърза. Препоръчвам!', true, NOW() - INTERVAL '7 days'),
('Петър С.', 5, 'Страхотен продукт! Звукът е невероятен за тази цена.', true, NOW() - INTERVAL '10 days'),
('Анна М.', 5, 'Много съм доволна! Благодаря за бързата доставка!', true, NOW() - INTERVAL '14 days');

-- ============================================
-- 5. CREATE VIEWS (Optional but useful)
-- Pre-defined queries for common reports
-- ============================================

-- View: Daily order summary
CREATE OR REPLACE VIEW daily_orders AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) as order_count,
    SUM(total_eur) as total_revenue
FROM orders
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- View: Review statistics
CREATE OR REPLACE VIEW review_stats AS
SELECT 
    rating,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 1) as percentage
FROM reviews
GROUP BY rating
ORDER BY rating DESC;

-- ============================================
-- 6. SETUP COMPLETE!
-- ============================================
-- Your database is now ready to use with the Netlify Functions
-- 
-- Tables created:
--   - orders: Stores all customer orders
--   - reviews: Stores customer reviews  
--   - visitors: Tracks website visitors
--
-- Sample data: 5 reviews added
-- ============================================
