import React, { useState } from 'react';

function App() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLoginMode
      ? 'http://localhost:3000/api/login'
      : 'http://localhost:3000/api/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`🎉 ${data.message}`);
        if (isLoginMode) {
          localStorage.setItem('game_token', data.token);
          console.log('Dữ liệu người chơi:', data.data);
        } else {
          setTimeout(() => setIsLoginMode(true), 2000);
        }
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Không thể kết nối. Hãy chắc chắn Backend (cổng 3000) đang chạy!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 font-sans">
      <div className="bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 w-96 relative overflow-hidden">
        <h1 className="text-3xl font-bold text-center mb-2 text-amber-500">
          QUÁN CƠM KHỞI NGHIỆP
        </h1>
        <p className="text-center text-slate-400 mb-6 text-sm">
          {isLoginMode ? 'Đăng nhập để tiếp tục quản lý' : 'Tạo hồ sơ chủ quán mới'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-1">Tài khoản</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              placeholder="Tên chủ quán"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-semibold mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 text-white font-bold py-2 px-4 rounded hover:bg-amber-500 transition shadow-lg"
          >
            {isLoginMode ? 'VÀO GAME' : 'BẮT ĐẦU KHỞI NGHIỆP'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setMessage('');
            }}
            className="text-amber-500 hover:text-amber-400 text-sm underline transition"
          >
            {isLoginMode
              ? 'Chưa có nhà hàng? Mở quán mới ngay!'
              : 'Đã có nhà hàng? Đăng nhập tại đây'}
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded bg-slate-700 border border-slate-600 text-center">
            <span className="text-white text-sm">{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;