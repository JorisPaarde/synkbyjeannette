import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = new URL('../', import.meta.url).pathname;
const dist = join(root, 'dist');
const base = (process.env.BASE_PATH || '').replace(/^\/?/, '/').replace(/\/$/, '');
const expectedPages = [
  'index.html',
  'diensten/index.html',
  'veelgestelde-vragen/index.html',
  'privacy-policy/index.html',
  'algemene-voorwaarden-synk-by-jeanette/index.html',
  'en/index.html',
  'en/diensten/index.html',
  'en/veelgestelde-vragen/index.html',
  'en/privacy-policy/index.html',
  'en/algemene-voorwaarden-synk-by-jeanette/index.html',
];

const missingPages = expectedPages.filter((page) => !existsSync(join(dist, page)));
if (missingPages.length) {
  throw new Error(`Ontbrekende pagina's: ${missingPages.join(', ')}`);
}

const walk = (directory) => readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
  const target = join(directory, entry.name);
  return entry.isDirectory() ? walk(target) : target;
});

const outputFiles = walk(dist);
const references = [];

for (const file of outputFiles) {
  const extension = extname(file);
  if (extension !== '.html' && extension !== '.css') continue;

  const contents = readFileSync(file, 'utf8');
  const matcher = extension === '.html'
    ? /(?:href|src)=["']([^"']+)["']/g
    : /url\(["']?([^)'"\s]+)["']?\)/g;

  for (const match of contents.matchAll(matcher)) {
    references.push({ file, value: match[1] });
  }
}

const failures = [];
for (const { file, value } of references) {
  if (!value.startsWith('/') || value.startsWith('//')) continue;

  const pathOnly = value.split(/[?#]/, 1)[0];
  if (base && pathOnly !== base && !pathOnly.startsWith(`${base}/`)) {
    failures.push(`${relative(dist, file)} verwijst buiten BASE_PATH: ${value}`);
    continue;
  }

  let target = base ? pathOnly.slice(base.length) : pathOnly;
  target = target.replace(/^\/+/, '');
  if (!target || target.endsWith('/')) target += 'index.html';

  if (!existsSync(join(dist, target))) {
    failures.push(`${relative(dist, file)} mist ${value}`);
  }
}

if (failures.length) {
  throw new Error(`Ongeldige build-referenties:\n${failures.join('\n')}`);
}

console.log(`Build gecontroleerd: ${expectedPages.length} pagina's en ${references.length} referenties.`);
