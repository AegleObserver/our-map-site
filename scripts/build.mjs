import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

function configuredUrl(name, fallback = '') {
  const value = process.env[name] ?? fallback;
  if (!value) return '';
  if (!/^https:\/\//i.test(value) && !/^\.?\//.test(value)) {
    throw new Error(`${name} must be an https URL or a relative path`);
  }
  return value;
}

const config = {
  demoUrl: configuredUrl('PUBLIC_DEMO_URL', 'https://aegleobserver.github.io/our-map-demo/'),
  repositoryUrl: configuredUrl('PUBLIC_REPOSITORY_URL', 'https://github.com/PennEwan/Baidu-map'),
  releasesUrl: configuredUrl('PUBLIC_RELEASES_URL', 'https://github.com/PennEwan/Baidu-map/releases')
};

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'index.html'), path.join(dist, 'index.html'));
await cp(path.join(root, 'config.js'), path.join(dist, 'config.js'));
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'content'), path.join(dist, 'content'), { recursive: true });
await cp(path.join(root, 'help'), path.join(dist, 'help'), { recursive: true });
await cp(path.join(root, 'figure'), path.join(dist, 'figure'), { recursive: true });
await writeFile(path.join(dist, 'config.js'), `window.SITE_CONFIG = ${JSON.stringify(config, null, 2)};\n`, 'utf8');
console.log(`Built static site in ${path.relative(root, dist)}`);
