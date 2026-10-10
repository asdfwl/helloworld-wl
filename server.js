/**
 * 我的第一个 AI 开发的网站
 * 一个零依赖的 Node.js HTTP 服务器：
 *   1. GET /                 返回欢迎页面（public/index.html）
 *   2. GET /api/server-time  返回当前服务器时间（JSON）
 *
 * 运行：node server.js（或 npm start）
 * 访问：http://localhost:3000
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;          // 服务端口，可按需修改
const HOST = '127.0.0.1';   // 监听本机回环地址，避免 Windows 防火墙弹窗
const INDEX_FILE = path.join(__dirname, 'public', 'index.html'); // 首页文件路径

// 把日期格式化为 "YYYY-MM-DD HH:mm:ss"（北京时间，UTC+8，24 小时制）
// 做法：先把时间戳加 8 小时，再取 UTC 值，这样即使服务器在 UTC 时区（如 Vercel），显示的也是北京时间
function formatTime(date) {
  const pad = (n) => String(n).padStart(2, '0');
  const beijing = new Date(date.getTime() + 8 * 60 * 60 * 1000);
  return (
    `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())} ` +
    `${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}:${pad(beijing.getUTCSeconds())}`
  );
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 接口 1：服务器时间（页面每秒调用一次，用于实时刷新）
  if (req.url === '/api/server-time') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store' // 禁止缓存，保证每次拿到的都是最新时间
    });
    res.end(JSON.stringify({ time: formatTime(new Date()) }));
    return;
  }

  // 页面：首页
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(INDEX_FILE, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('读取页面文件失败：' + err.message);
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    });
    return;
  }

  // 其他路径：404
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

// 启动服务器
server.listen(PORT, HOST, () => {
  console.log('================================================');
  console.log('  服务器启动成功！');
  console.log(`  请在浏览器中打开： http://localhost:${PORT}`);
  console.log(`  （或 http://127.0.0.1:${PORT}）`);
  console.log('  停止服务器：按 Ctrl + C');
  console.log('================================================');
});

// 端口被占用等错误处理
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`启动失败：端口 ${PORT} 已被占用。`);
    console.error(`请关闭占用该端口的程序，或修改 server.js 中的 PORT（例如改成 3001）。`);
  } else {
    console.error('服务器启动失败：', err.message);
  }
  process.exit(1);
});
