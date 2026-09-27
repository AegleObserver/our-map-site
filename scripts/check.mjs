import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = ['index.html', 'config.js', 'assets/site.css', 'assets/site.js', 'content/project.json'];
for (const relative of requiredFiles) {
  try {
    await readFile(path.join(root, relative));
  } catch {
    throw new Error(`Missing required site file: ${relative}`);
  }
}

const html = await readFile(path.join(root, 'index.html'), 'utf8');
for (const marker of ['#capabilities', '#method', '#trust', '#roadmap', 'data-config-link="demoUrl"']) {
  if (!html.includes(marker)) throw new Error(`Missing required page marker: ${marker}`);
}
if (/BAIDU_[A-Z_]*AK\s*[:=]/i.test(html)) throw new Error('A service key must not be embedded in the site source');
console.log('Static site checks passed');
