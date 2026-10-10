/**
 * Cloudflare Pages Function：GET /api/server-time
 * 返回当前服务器时间（北京时间，UTC+8，24 小时制），JSON 格式与本地 server.js 完全一致：
 *   { "time": "YYYY-MM-DD HH:mm:ss" }
 *
 * 说明：部署到 Cloudflare Pages 后，functions/api/server-time.js 会自动映射到 /api/server-time 路径，
 * 首页 public/index.html 里的 fetch('/api/server-time') 无需任何改动即可正常工作。
 */
export async function onRequestGet() {
  const pad = (n) => String(n).padStart(2, '0');
  // 把时间戳加 8 小时再取 UTC 值，这样无论边缘节点在哪个时区，显示的都是北京时间
  const now = new Date();
  const beijing = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  const time =
    `${beijing.getUTCFullYear()}-${pad(beijing.getUTCMonth() + 1)}-${pad(beijing.getUTCDate())} ` +
    `${pad(beijing.getUTCHours())}:${pad(beijing.getUTCMinutes())}:${pad(beijing.getUTCSeconds())}`;

  return new Response(JSON.stringify({ time }), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store' // 禁止缓存，保证每次拿到的都是最新时间
    }
  });
}
