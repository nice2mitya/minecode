const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = Number(process.env.PORT || 80);
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
};

function sendNotFound(res) {
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>404</h1>');
}

function withSafePath(urlPath) {
  let decoded = urlPath;
  try {
    decoded = decodeURIComponent(urlPath);
  } catch {
    decoded = urlPath;
  }

  decoded = decoded.replace(/\\/g, '/');
  if (decoded === '/') decoded = '/index.html';
  if (decoded === '/es') decoded = '/es/index.html';
  if (decoded.endsWith('/')) decoded = `${decoded}index.html`;

  const normalized = path.normalize(decoded).replace(/^\/+/, '');
  const filePath = path.join(PUBLIC_DIR, normalized);

  if (!filePath.startsWith(PUBLIC_DIR)) {
    return null;
  }

  return filePath;
}

function cacheHeaderFor(ext) {
  const staticAsset = ['.css', '.js', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2'].includes(ext);
  return staticAsset ? 'public, max-age=86400' : 'no-cache';
}

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback: route without explicit extension
      if (!ext) {
        const htmlFallback = `${filePath}.html`;
        fs.readFile(htmlFallback, (err2, data2) => {
          if (err2) return sendNotFound(res);
          res.writeHead(200, {
            'Content-Type': MIME['.html'],
            'Cache-Control': cacheHeaderFor('.html'),
          });
          res.end(data2);
        });
        return;
      }
      return sendNotFound(res);
    }

    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': cacheHeaderFor(ext),
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Method Not Allowed');
  }

  const urlPath = (req.url || '/').split('?')[0];

  if (urlPath === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ ok: true, port: PORT }));
  }

  const filePath = withSafePath(urlPath);
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Forbidden');
  }

  serveFile(filePath, res);
});

server.listen(PORT, () => console.log(`MineCode running on :${PORT}`));
