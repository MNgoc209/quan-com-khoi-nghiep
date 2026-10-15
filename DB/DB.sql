-- 1. Tạo Cơ sở dữ liệu cho game và sử dụng nó
CREATE DATABASE IF NOT EXISTS restaurant_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE restaurant_game;

-- 2. Tạo bảng Người chơi (users)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    coin_balance INT DEFAULT 1000,
    level INT DEFAULT 1,
    work_hours_per_day INT DEFAULT 8,
    overtime_hours INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tạo bảng Hàng hóa/Món ăn (items)
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    import_price INT NOT NULL,
    unlock_level INT DEFAULT 1,
    unlock_cost INT DEFAULT 0,
    description TEXT
);

-- 4. Tạo bảng Kho hàng (user_inventory)
CREATE TABLE user_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT DEFAULT 0,
    custom_selling_price INT,
    is_unlocked BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    UNIQUE(user_id, item_id)
);

-- 5. Tạo bảng Dữ liệu gốc về Nhân viên (employees)
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    job_scope TEXT,
    hire_cost INT NOT NULL,
    daily_wage INT NOT NULL
);

-- 6. Tạo bảng Nhân viên đã thuê (user_employees)
CREATE TABLE user_employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    employee_id INT NOT NULL,
    status ENUM('working', 'resting') DEFAULT 'working',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- 7. Tạo bảng Bàn ăn (restaurant_tables)
CREATE TABLE restaurant_tables (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    table_number INT NOT NULL,
    seat_count INT DEFAULT 4,
    status ENUM('available', 'occupied', 'reserved') DEFAULT 'available',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, table_number)
);

-- 8. Tạo bảng Quản lý Đặt bàn (reservations)
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    table_id INT NOT NULL,
    npc_customer_name VARCHAR(100),
    reservation_time DATETIME NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE CASCADE
);

-- 9. Tạo bảng Đơn hàng (orders)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    table_id INT,
    order_type ENUM('dine_in', 'takeaway', 'delivery') NOT NULL,
    status ENUM('pending', 'cooking', 'delivering', 'completed', 'cancelled') DEFAULT 'pending',
    total_price INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (table_id) REFERENCES restaurant_tables(id) ON DELETE SET NULL
);

-- 10. Tạo bảng Chi tiết Đơn hàng (order_details)
CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price_at_time INT NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);