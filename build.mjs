import { readFileSync, readdirSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
const types = { html: 'text/html; charset=utf-8', css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', svg: 'image/svg+xml' };
const assets = Object.fromEntries(readdirSync('public').map(name => ['/' + name, { body: readFileSync('public/' + name, 'utf8'), type: types[name.split('.').pop()] }]));
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist/server', { recursive: true });
mkdirSync('dist/.openai', { recursive: true });
writeFileSync('dist/server/index.js', 'const ASSETS = ' + JSON.stringify(assets) + ';\n' + readFileSync('worker.mjs', 'utf8'));
writeFileSync('dist/.openai/hosting.json', readFileSync('.openai/hosting.json'));
