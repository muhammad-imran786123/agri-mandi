-- ============================================
--  AGRI MANDI DATABASE SCHEMA
--  Run this file in MySQL to create everything
-- ============================================

CREATE DATABASE IF NOT EXISTS agri_mandi;
USE agri_mandi;

-- ─────────────────────────────────────────────
--  TABLE: admin_users
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,   -- stored as bcrypt hash
  full_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(100),
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin  →  username: admin  |  password: mandi123
INSERT INTO admin_users (username, password, full_name, email) VALUES
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uue5sXqoK', 'Super Admin', 'admin@agrimandi.pk');
-- NOTE: The hash above is bcrypt of "mandi123". Change it after first login.

-- ─────────────────────────────────────────────
--  TABLE: categories
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id    INT AUTO_INCREMENT PRIMARY KEY,
  name  VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO categories (name) VALUES
('Grain'), ('Cash Crop'), ('Vegetable'), ('Fruit'), ('Pulse'), ('Oilseed');

-- ─────────────────────────────────────────────
--  TABLE: crops
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS crops (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name_en       VARCHAR(100) NOT NULL,
  name_ur       VARCHAR(100),
  category_id   INT NOT NULL,
  season        ENUM('Rabi (Winter)', 'Kharif (Summer)', 'Year-round') DEFAULT 'Year-round',
  icon          VARCHAR(10)  DEFAULT '🌾',
  is_active     TINYINT(1)   DEFAULT 1,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

INSERT INTO crops (name_en, name_ur, category_id, season, icon) VALUES
('Wheat',       'گندم',            1, 'Rabi (Winter)',   '🌾'),
('Sugarcane',   'گنا',             2, 'Kharif (Summer)', '🎋'),
('Basmati Rice','باسمتی چاول',     1, 'Kharif (Summer)', '🍚'),
('IRRI Rice',   'آئی آر آر آئی',   1, 'Kharif (Summer)', '🌾'),
('Cotton',      'کپاس',            2, 'Kharif (Summer)', '🌸'),
('Maize',       'مکئی',            1, 'Kharif (Summer)', '🌽'),
('Mustard',     'سرسوں',           6, 'Rabi (Winter)',   '🌻'),
('Potato',      'آلو',             3, 'Rabi (Winter)',   '🥔'),
('Onion',       'پیاز',            3, 'Rabi (Winter)',   '🧅'),
('Tomato',      'ٹماٹر',           3, 'Year-round',      '🍅'),
('Chickpea',    'چنا',             5, 'Rabi (Winter)',   '🫘'),
('Sunflower',   'سورج مکھی',       6, 'Kharif (Summer)', '🌻');

-- ─────────────────────────────────────────────
--  TABLE: daily_rates
--  One row per crop per day
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_rates (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  crop_id     INT NOT NULL,
  rate_date   DATE NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  min_price   DECIMAL(10,2),
  max_price   DECIMAL(10,2),
  unit        VARCHAR(30) DEFAULT 'per 40kg',
  remarks     VARCHAR(255),
  updated_by  INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (crop_id)    REFERENCES crops(id),
  FOREIGN KEY (updated_by) REFERENCES admin_users(id),
  UNIQUE KEY unique_crop_date (crop_id, rate_date)
);

-- Seed today's rates
INSERT INTO daily_rates (crop_id, rate_date, price, min_price, max_price, unit) VALUES
(1,  CURDATE(), 3200, 3050, 3300, 'per 40kg'),
(2,  CURDATE(),  420,  400,  450, 'per 40kg'),
(3,  CURDATE(), 4800, 4500, 5000, 'per 40kg'),
(4,  CURDATE(), 2600, 2400, 2700, 'per 40kg'),
(5,  CURDATE(), 8500, 8000, 9000, 'per 40kg'),
(6,  CURDATE(), 2200, 2100, 2300, 'per 40kg'),
(7,  CURDATE(), 6200, 5900, 6400, 'per 40kg'),
(8,  CURDATE(), 1800, 1500, 2200, 'per 40kg'),
(9,  CURDATE(), 2400, 1800, 3000, 'per 40kg'),
(10, CURDATE(), 3200, 2500, 4000, 'per 40kg'),
(11, CURDATE(), 8800, 8400, 9200, 'per 40kg'),
(12, CURDATE(), 5500, 5200, 5800, 'per 40kg');

-- ─────────────────────────────────────────────
--  TABLE: customers
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  city        VARCHAR(50),
  type        ENUM('Farmer','Trader','Buyer','Commission Agent') DEFAULT 'Farmer',
  status      ENUM('active','pending','inactive') DEFAULT 'active',
  notes       TEXT,
  added_by    INT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES admin_users(id)
);

INSERT INTO customers (full_name, phone, city, type, status) VALUES
('Muhammad Arif Khan',    '0300-1234567', 'Lahore',     'Farmer',           'active'),
('Abdul Rehman Malik',    '0321-9876543', 'Faisalabad', 'Trader',           'active'),
('Zubair Ahmed Chaudhry', '0333-4567890', 'Gujranwala', 'Commission Agent', 'active'),
('Naseem Akhtar',         '0345-6543210', 'Multan',     'Buyer',            'pending'),
('Hassan Ali Bhatti',     '0311-2223344', 'Sargodha',   'Farmer',           'active'),
('Tariq Mehmood Rana',    '0322-5556677', 'Lahore',     'Trader',           'inactive');

-- ─────────────────────────────────────────────
--  TABLE: contact_messages
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  phone       VARCHAR(20),
  subject     VARCHAR(100),
  message     TEXT,
  is_read     TINYINT(1) DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─────────────────────────────────────────────
--  USEFUL VIEWS
-- ─────────────────────────────────────────────

-- Today's rates joined with crop & category info
CREATE OR REPLACE VIEW v_today_rates AS
SELECT
  dr.id,
  c.id           AS crop_id,
  c.name_en,
  c.name_ur,
  c.icon,
  c.season,
  cat.name       AS category,
  dr.price,
  dr.min_price,
  dr.max_price,
  dr.unit,
  dr.remarks,
  dr.rate_date,
  -- price change vs previous day
  (dr.price - COALESCE(prev.price, dr.price)) AS price_change
FROM daily_rates dr
JOIN crops        c   ON dr.crop_id   = c.id
JOIN categories   cat ON c.category_id = cat.id
LEFT JOIN daily_rates prev
  ON prev.crop_id   = dr.crop_id
  AND prev.rate_date = DATE_SUB(dr.rate_date, INTERVAL 1 DAY)
WHERE dr.rate_date = CURDATE()
  AND c.is_active = 1;
