-- ============================================================
-- NexStore E-Commerce — MySQL 8.0 Schema
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            CHAR(36)     NOT NULL DEFAULT (UUID()),
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('customer','seller','admin') NOT NULL DEFAULT 'customer',
  avatar_url    VARCHAR(500) NULL,
  phone         VARCHAR(20)  NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  reset_token   VARCHAR(255) NULL,
  reset_token_expires DATETIME NULL,
  PRIMARY KEY (id),
  INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ADDRESSES
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
  id          INT          NOT NULL AUTO_INCREMENT,
  user_id     CHAR(36)     NOT NULL,
  label       VARCHAR(50)  NOT NULL DEFAULT 'Home',
  line1       VARCHAR(255) NOT NULL,
  line2       VARCHAR(255) NULL,
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NULL,
  zip         VARCHAR(20)  NOT NULL,
  country     VARCHAR(100) NOT NULL DEFAULT 'India',
  is_default  TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CATEGORIES (self-referencing hierarchy)
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id          CHAR(36)     NOT NULL DEFAULT (UUID()),
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(120) NOT NULL UNIQUE,
  description TEXT         NULL,
  image_url   VARCHAR(500) NULL,
  parent_id   CHAR(36)     NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
  INDEX idx_categories_parent (parent_id),
  INDEX idx_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id           CHAR(36)      NOT NULL DEFAULT (UUID()),
  name         VARCHAR(255)  NOT NULL,
  slug         VARCHAR(255)  NOT NULL UNIQUE,
  description  TEXT          NULL,
  category_id  CHAR(36)      NULL,
  seller_id    CHAR(36)      NULL,
  brand        VARCHAR(120)  NULL,
  image_url    VARCHAR(500)  NULL,
  tags         VARCHAR(500)  NULL,  -- comma-separated for simplicity
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  avg_rating   DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  review_count INT           NOT NULL DEFAULT 0,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
  FULLTEXT INDEX ft_products_search (name, description, brand, tags),
  INDEX idx_products_category (category_id),
  INDEX idx_products_seller (seller_id),
  INDEX idx_products_slug (slug),
  INDEX idx_products_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS product_variants (
  sku          VARCHAR(100)   NOT NULL,
  product_id   CHAR(36)       NOT NULL,
  name         VARCHAR(120)   NULL,   -- e.g. "Red / XL"
  price        DECIMAL(10,2)  NOT NULL,
  compare_price DECIMAL(10,2) NULL,   -- for showing discounts
  image_url    VARCHAR(500)   NULL,
  attributes   JSON           NULL,   -- { color: "Red", size: "XL" }
  is_active    TINYINT(1)     NOT NULL DEFAULT 1,
  created_at   DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (sku),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_variants_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- INVENTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
  sku       VARCHAR(100) NOT NULL,
  stock     INT          NOT NULL DEFAULT 0,
  reserved  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (sku),
  FOREIGN KEY (sku) REFERENCES product_variants(sku) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CART
-- ============================================================
CREATE TABLE IF NOT EXISTS cart (
  id         CHAR(36)  NOT NULL DEFAULT (UUID()),
  user_id    CHAR(36)  NOT NULL UNIQUE,
  created_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME  NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CART ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT          NOT NULL AUTO_INCREMENT,
  cart_id    CHAR(36)     NOT NULL,
  sku        VARCHAR(100) NOT NULL,
  quantity   INT          NOT NULL DEFAULT 1,
  added_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_sku (cart_id, sku),
  FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
  FOREIGN KEY (sku) REFERENCES product_variants(sku) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id               CHAR(36)       NOT NULL DEFAULT (UUID()),
  user_id          CHAR(36)       NOT NULL,
  status           ENUM('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED')
                                  NOT NULL DEFAULT 'PENDING',
  shipping_line1   VARCHAR(255)   NOT NULL,
  shipping_line2   VARCHAR(255)   NULL,
  shipping_city    VARCHAR(100)   NOT NULL,
  shipping_state   VARCHAR(100)   NULL,
  shipping_zip     VARCHAR(20)    NOT NULL,
  shipping_country VARCHAR(100)   NOT NULL DEFAULT 'India',
  subtotal         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  shipping_fee     DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  discount         DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  total            DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  payment_method   VARCHAR(50)    NOT NULL DEFAULT 'card',
  payment_status   ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  notes            TEXT           NULL,
  created_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_orders_user (user_id),
  INDEX idx_orders_status (status),
  INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
  id                INT            NOT NULL AUTO_INCREMENT,
  order_id          CHAR(36)       NOT NULL,
  sku               VARCHAR(100)   NOT NULL,
  product_name      VARCHAR(255)   NOT NULL,
  variant_name      VARCHAR(120)   NULL,
  quantity          INT            NOT NULL,
  price_at_purchase DECIMAL(10,2)  NOT NULL,
  image_url         VARCHAR(500)   NULL,
  seller_id         CHAR(36)       NULL,
  fulfillment_status ENUM('PENDING','PROCESSING','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  tracking_number   VARCHAR(100)   NULL,
  carrier           VARCHAR(100)   NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_items_order (order_id),
  INDEX idx_order_items_seller (seller_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id          INT          NOT NULL AUTO_INCREMENT,
  product_id  CHAR(36)     NOT NULL,
  user_id     CHAR(36)     NOT NULL,
  rating      TINYINT      NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       VARCHAR(255) NULL,
  body        TEXT         NULL,
  is_verified TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_user_product (product_id, user_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_reviews_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- WISHLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
  id          INT      NOT NULL AUTO_INCREMENT,
  user_id     CHAR(36) NOT NULL,
  product_id  CHAR(36) NOT NULL,
  added_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wishlist (user_id, product_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SUPPORT TICKETS (CRM)
-- ============================================================
CREATE TABLE IF NOT EXISTS support_tickets (
  id          INT          NOT NULL AUTO_INCREMENT,
  user_id     CHAR(36)     NOT NULL,
  subject     VARCHAR(255) NOT NULL,
  message     TEXT         NOT NULL,
  status      ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  admin_reply TEXT         NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_tickets_user (user_id),
  INDEX idx_tickets_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- CHAT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id          INT          NOT NULL AUTO_INCREMENT,
  user_id     CHAR(36)     NOT NULL,
  sender_type ENUM('user','admin') NOT NULL,
  message     TEXT         NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_chat_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin accounts are provisioned explicitly with create_admin.js or guarded demo setup.

-- ============================================================
-- SEED: Sample Categories
-- ============================================================
INSERT IGNORE INTO categories (id, name, slug, description) VALUES
  ('cat-electronics', 'Electronics', 'electronics', 'Laptops, phones, gadgets and more'),
  ('cat-fashion',     'Fashion',     'fashion',     'Clothing, shoes, accessories'),
  ('cat-home',        'Home & Living','home-living', 'Furniture, decor, appliances'),
  ('cat-sports',      'Sports',       'sports',      'Fitness, outdoors, sports gear'),
  ('cat-books',       'Books',        'books',       'Fiction, non-fiction, academic');

-- Sub-categories
INSERT IGNORE INTO categories (id, name, slug, parent_id) VALUES
  ('cat-laptops',     'Laptops',      'laptops',      'cat-electronics'),
  ('cat-mobiles',     'Mobiles',      'mobiles',      'cat-electronics'),
  ('cat-headphones',  'Headphones',   'headphones',   'cat-electronics'),
  ('cat-men',         'Men',          'men',          'cat-fashion'),
  ('cat-women',       'Women',        'women',        'cat-fashion');

-- ============================================================
-- SEED: Sample Products
-- ============================================================
INSERT IGNORE INTO products (id, name, slug, description, category_id, brand, image_url, avg_rating, review_count) VALUES
  ('prod-1', 'MacBook Pro 16"', 'macbook-pro-16',
   'The ultimate pro laptop with M3 Max chip, 64GB RAM, and 2TB SSD. Perfect for developers and creators.',
   'cat-laptops', 'Apple',
   'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
   4.8, 124),
  ('prod-2', 'Sony WH-1000XM5', 'sony-wh-1000xm5',
   'Industry-leading noise canceling headphones with 30-hour battery life and crystal clear hands-free calling.',
   'cat-headphones', 'Sony',
   'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80',
   4.6, 89),
  ('prod-3', 'Keychron Q1 Pro', 'keychron-q1-pro',
   'Wireless QMK custom mechanical keyboard with gasket mount, per-key RGB and hot-swappable switches.',
   'cat-electronics', 'Keychron',
   'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80',
   4.7, 56),
  ('prod-4', 'iPhone 15 Pro Max', 'iphone-15-pro-max',
   'Titanium design, A17 Pro chip, 48MP main camera, Action button and USB-C.',
   'cat-mobiles', 'Apple',
   'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80',
   4.9, 312),
  ('prod-5', 'Nike Air Max 270', 'nike-air-max-270',
   'Inspired by two icons of big Air: the Air Max 180 and Air Maestro Flight.',
   'cat-men', 'Nike',
   'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
   4.3, 201),
  ('prod-6', 'Samsung 4K OLED TV 65"', 'samsung-oled-65',
   '65-inch 4K OLED Smart TV with Quantum HDR, 144Hz refresh rate and built-in Alexa.',
   'cat-home', 'Samsung',
   'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80',
   4.5, 78);

-- ============================================================
-- SEED: Product Variants
-- ============================================================
INSERT IGNORE INTO product_variants (sku, product_id, name, price, compare_price, attributes) VALUES
  ('MBP16-M3MAX-64-2T', 'prod-1', 'M3 Max / 64GB / 2TB',  3499.00, 3899.00, '{"color":"Space Black","ram":"64GB","storage":"2TB"}'),
  ('MBP16-M3PRO-18-512','prod-1', 'M3 Pro / 18GB / 512GB', 2499.00, 2799.00, '{"color":"Silver","ram":"18GB","storage":"512GB"}'),
  ('WH1000XM5-BLK',     'prod-2', 'Black',                  349.00,  398.00, '{"color":"Black"}'),
  ('WH1000XM5-WHT',     'prod-2', 'Midnight Blue',          349.00,  398.00, '{"color":"Midnight Blue"}'),
  ('KQ1PRO-RED',        'prod-3', 'Red / Brown Switch',     199.00,  229.00, '{"color":"Red","switch":"Brown"}'),
  ('KQ1PRO-BLK',        'prod-3', 'Black / Blue Switch',    199.00,  229.00, '{"color":"Black","switch":"Blue"}'),
  ('IP15PM-256-NAT',    'prod-4', '256GB / Natural Titanium',1199.00,1299.00, '{"color":"Natural Titanium","storage":"256GB"}'),
  ('IP15PM-512-BLK',    'prod-4', '512GB / Black Titanium', 1399.00,1499.00, '{"color":"Black Titanium","storage":"512GB"}'),
  ('NAM270-BLK-9',      'prod-5', 'Black / US 9',            150.00,  180.00, '{"color":"Black","size":"US 9"}'),
  ('NAM270-WHT-10',     'prod-5', 'White / US 10',           150.00,  180.00, '{"color":"White","size":"US 10"}'),
  ('SAM-OLED-65-BLK',   'prod-6', '65" / Black',           1499.00, 1799.00, '{"size":"65 inch","color":"Black"}');

-- ============================================================
-- SEED: Inventory
-- ============================================================
INSERT IGNORE INTO inventory (sku, stock, reserved) VALUES
  ('MBP16-M3MAX-64-2T',  15, 0),
  ('MBP16-M3PRO-18-512', 28, 0),
  ('WH1000XM5-BLK',      50, 0),
  ('WH1000XM5-WHT',      42, 0),
  ('KQ1PRO-RED',         35, 0),
  ('KQ1PRO-BLK',         30, 0),
  ('IP15PM-256-NAT',     60, 0),
  ('IP15PM-512-BLK',     45, 0),
  ('NAM270-BLK-9',       80, 0),
  ('NAM270-WHT-10',      75, 0),
  ('SAM-OLED-65-BLK',    20, 0);

-- ============================================================
-- PROMO CODES
-- ============================================================
CREATE TABLE IF NOT EXISTS promo_codes (
  code                VARCHAR(50)    NOT NULL,
  discount_percentage DECIMAL(5,2)   NOT NULL,
  is_active           TINYINT(1)     NOT NULL DEFAULT 1,
  created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- SEED: Sample Promo Codes
-- ============================================================
INSERT IGNORE INTO promo_codes (code, discount_percentage, is_active) VALUES
  ('WELCOME10', 10.00, 1),
  ('SUMMER20',  20.00, 1);

-- ============================================================
-- LIVE CHAT MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
  id          INT          NOT NULL AUTO_INCREMENT,
  user_id     CHAR(36)     NOT NULL,
  sender_type ENUM('user', 'admin') NOT NULL,
  message     TEXT         NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_chat_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;


-- Portfolio contact inbox
CREATE TABLE IF NOT EXISTS contact_messages (id INT PRIMARY KEY AUTO_INCREMENT,name VARCHAR(120) NOT NULL,email VARCHAR(254) NOT NULL,message TEXT NOT NULL,status ENUM('NEW','READ','RESOLVED') NOT NULL DEFAULT 'NEW',created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);
