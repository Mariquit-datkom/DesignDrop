-- ─── Create & Select Database ─────────────────────────────
CREATE DATABASE IF NOT EXISTS `designdrop`;
USE `designdrop`;

-- ─── Users Table ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `name`        VARCHAR(100)  NOT NULL,
  `email`       VARCHAR(100)  UNIQUE NOT NULL,
  `password`    VARCHAR(255)  NOT NULL,
  `role`        ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer',
  `created_at`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Products Table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  seller_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  preview_image VARCHAR(255),
  file_path VARCHAR(255), -- downloadable file
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- ─── Orders Table ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  buyer_id INT NOT NULL,
  product_id INT NOT NULL,
  amount DECIMAL(10,2),
  status ENUM('pending','paid','cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ─── Seed Admin User ───────────────────────
INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin', 'admin@email.com', 'adminpassword', 'admin');