-- ============================================================
-- Ocean View Resort – Online Room Reservation System
-- Database Schema v1.0.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS ocean_view_resort
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE ocean_view_resort;

-- ============================================================
-- Table: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    user_id   INT          AUTO_INCREMENT PRIMARY KEY,
    username  VARCHAR(100) NOT NULL UNIQUE,
    password  VARCHAR(255) NOT NULL COMMENT 'SHA-256 hashed password',
    role      VARCHAR(50)  NOT NULL DEFAULT 'staff',
    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Table: reservations
-- ============================================================
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id  INT          AUTO_INCREMENT PRIMARY KEY,
    guest_name      VARCHAR(150) NOT NULL,
    address         TEXT,
    contact_number  VARCHAR(20)  NOT NULL,
    room_type       VARCHAR(50)  NOT NULL COMMENT 'Single | Double | Deluxe',
    check_in        DATE         NOT NULL,
    check_out       DATE         NOT NULL,
    total_amount    DOUBLE       NOT NULL DEFAULT 0.0,
    created_at      TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_check_in  (check_in),
    INDEX idx_check_out (check_out),
    INDEX idx_room_type (room_type)
);

-- ============================================================
-- Seed Data: Default Admin User
-- Password: admin123 (SHA-256 hashed)
-- ============================================================
INSERT INTO users (username, password, role) VALUES
('admin', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin')
ON DUPLICATE KEY UPDATE username = username;

-- ============================================================
-- Seed Data: Sample Staff User
-- Password: staff123 (SHA-256 hashed)
-- ============================================================
INSERT INTO users (username, password, role) VALUES
('staff1', 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f', 'staff')
ON DUPLICATE KEY UPDATE username = username;

-- ============================================================
-- Sample Reservations (for testing)
-- ============================================================
INSERT INTO reservations (guest_name, address, contact_number, room_type, check_in, check_out, total_amount) VALUES
('Kasun Perera', 'No. 12, Main Street, Colombo', '0771234567', 'Single',  '2026-03-01', '2026-03-03', 16000.00),
('Nimali Fernando', '45/A, Lake Road, Kandy',   '0752345678', 'Double',  '2026-03-05', '2026-03-08', 36000.00),
('Roshan Silva', '78, Galle Road, Matara',       '0763456789', 'Deluxe', '2026-03-10', '2026-03-15', 90000.00);
