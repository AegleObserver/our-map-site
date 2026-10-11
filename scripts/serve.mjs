import { createReadStream, statSync } from 'node:fs';
import { access } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const port = Number(process.env.PORT || 4173);
const contentTypes = { '.css': 'text/css; charset=utf-8', '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8' };

try {
  await access(path.join(root, 'index.html'));
} catch {
  console.error('dist/ does not exist. Run npm run build first.');
  process.exit(1);
}

http.createServer(async (request, response) => {
  const requested = decodeURIComponent((request.url || '/').split('?')[0]);
  const relative = requested === '/' ? '/index.html' : requested;
  let file = path.resolve(root, `.${relative}`);
  try {
    // 目录按 GitHub Pages 的行为落到它的 index.html：站点里有 `./help/` 这样的链接，
    // 而这里过去会把目录当文件读，ReadStream 抛 EISDIR 直接把预览服务打挂 —— 于是
    // "本地预览点帮助就崩"，而部署到 Pages 上却是好的。预览要和线上一致才验得准。
    if (statSync(file).isDirectory()) file = path.join(file, 'index.html');
  } catch {
    response.writeHead(404).end('Not found');
    return;
  }
  if (!file.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end();
    return;
  }
  try {
    await access(file);
    response.writeHead(200, { 'content-type': contentTypes[path.extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404).end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Site preview: http://127.0.0.1:${port}`));
