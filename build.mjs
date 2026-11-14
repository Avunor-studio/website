import { readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import './generate-service-pages.mjs';
const types = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', svg: 'image/svg+xml', txt: 'text/plain; charset=utf-8', xml: 'application/xml; charset=utf-8', png: 'image/png' };
const assets = Object.fromEntries(readdirSync('public').map(name => {
  const extension = name.split('.').pop();
  const binary = extension === 'png';
  return ['/' + name, { body: readFileSync('public/' + name, binary ? 'base64' : 'utf8'), type: types[extension], ...(binary ? { encoding: 'base64' } : {}) }];
}));
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
writeFileSync('dist/server/index.js', 'const ASSETS = ' + JSON.stringify(assets) + ';\n' + readFileSync('worker.mjs', 'utf8'));
writeFileSync('dist/.openai/hosting.json', readFileSync('.openai/hosting.json'));
