const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors()); // Cho phép Frontend gọi API mà không bị chặn

// Khóa bí mật để tạo Token (Trong thực tế nên đổi thành chuỗi phức tạp hơn)
const JWT_SECRET = 'khoa_bi_mat_game_nha_hang_123';

// Cấu hình Pool kết nối Cơ sở dữ liệu (Tối ưu hiệu suất hơn so với kết nối đơn lẻ)
const dbPool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456', // Thay bằng mật khẩu của bạn
    database: 'restaurant_game',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ==========================================
// API 1: ĐĂNG KÝ TÀI KHOẢN (REGISTER)
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu!' });
        }

        // Kiểm tra tài khoản trùng lặp
        const [existingUsers] = await dbPool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Lưu tài khoản mới
        const [userResult] = await dbPool.execute(
            'INSERT INTO users (username, password_hash) VALUES (?, ?)',
            [username, hashedPassword]
        );
        const newUserId = userResult.insertId;

        // Tự động tạo 4 bàn ăn mặc định cho nhà hàng
        const tableQueries = [];
        for (let i = 1; i <= 4; i++) {
            tableQueries.push(dbPool.execute(
                'INSERT INTO restaurant_tables (user_id, table_number, seat_count) VALUES (?, ?, ?)',
                [newUserId, i, 4]
            ));
        }
        await Promise.all(tableQueries);

        res.status(201).json({ message: 'Đăng ký thành công! Bạn nhận được 1000 vàng và 4 bàn ăn.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng ký!' });
    }
});

// ==========================================
// API 2: ĐĂNG NHẬP (LOGIN)
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Tìm người dùng
        const [users] = await dbPool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }

        const user = users[0];

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu!' });
        }

        // Tạo Token có hạn 1 ngày (24h)
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Đăng nhập thành công!',
            token: token,
            data: { id: user.id, username: user.username, coin_balance: user.coin_balance }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server khi đăng nhập!' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server Game Nhà Hàng đang chạy tại http://localhost:${PORT}`);
});