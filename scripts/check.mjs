import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requiredFiles = ['index.html', 'config.js', 'assets/site.css', 'assets/site.js', 'content/project.json', 'help/index.html'];
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
if (html.includes('data-config-link="appUrl"')) throw new Error('An online workbench link is not part of this site plan');
for (const relative of ['config.js', 'scripts/build.mjs', '.github/workflows/deploy-pages.yml', 'assets/site.js']) {
  if (/PUBLIC_APP_URL|\bappUrl\b/.test(await readFile(path.join(root, relative), 'utf8'))) {
    throw new Error(`The site plan must not configure an online workbench URL: ${relative}`);
  }
}

const imageSources = [...html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/g)].map(match => match[1]);
const requiredScreenshots = [
  '01-select-location.png',
  '02-walkable-area.png',
  '03-facilities.png',
  '04-report.png'
];
for (const name of requiredScreenshots) {
  const source = `./figure/${name}`;
  if (!imageSources.includes(source)) throw new Error(`Missing relative screenshot reference: ${source}`);
}
for (const source of imageSources) {
  if (/^(?:https?:|data:|blob:)/i.test(source)) continue;
  if (source.startsWith('/')) throw new Error(`Root-relative image paths break on project Pages: ${source}`);
  const relative = source.replace(/^\.\//, '');
  try {
    await readFile(path.join(root, relative));
  } catch {
    throw new Error(`Missing local image asset: ${source}`);
  }
}
console.log('Static site checks passed');
