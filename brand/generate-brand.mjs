import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, 'exports');
await fs.mkdir(out, { recursive: true });
const round = n => Number(n.toFixed(3));

// Clip outlined contours against two parallel diagonals to produce the cut.
function clip(points, boundary, upper) {
  const result = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i], b = points[(i + 1) % points.length];
    const va = a[1] + .28 * a[0] - boundary;
    const vb = b[1] + .28 * b[0] - boundary;
    const insideA = upper ? va <= 0 : va >= 0;
    const insideB = upper ? vb <= 0 : vb >= 0;
    if (insideA) result.push(a);
    if (insideA !== insideB) {
      const t = va / (va - vb);
      result.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return result;
}
const contour = pts => pts.length ? 'M' + pts.map(p => p.map(round).join(' ')).join('L') + 'Z' : '';
const outer = [[8,128],[58,16],[84,16],[134,128],[104,128],[94,104],[48,104],[38,128]];
const counter = [[58,80],[84,80],[71,47]];
const markPath = [true, false].map(upper => [outer, counter].map(shape => contour(clip(shape, upper ? 112 : 123, upper))).join('')).join('');
const mark = `<path fill-rule="evenodd" d="${markPath}"/>`;

const glyphs = {
  A: [78, 'M0 90 31 0H47L78 90H59L52 69H25L18 90ZM31 52H46L38.5 28Z'],
  V: [78, 'M0 0H19L39 63 59 0H78L47 90H31Z'],
  U: [76, 'M0 0H18V54C18 68 24 75 38 75S58 68 58 54V0H76V55C76 80 62 92 38 92S0 80 0 55Z'],
  N: [78, 'M0 90V0H18L60 59V0H78V90H60L18 31V90Z'],
  O: [80, 'M40-1C13-1 0 17 0 45S13 91 40 91 80 73 80 45 67-1 40-1ZM40 16C55 16 62 27 62 45S55 74 40 74 18 63 18 45 25 16 40 16Z'],
  R: [81, 'M0 90V0H39C64 0 77 12 77 31C77 45 70 55 57 59L81 90H59L36 61H18V90ZM18 16V45H38C52 45 59 41 59 31S52 16 38 16Z'],
};
let cursor = 0;
const wordmark = [...'AVUNOR'].map(letter => {
  const [width,d] = glyphs[letter];
  const value = `<path transform="translate(${cursor} 0)" fill-rule="evenodd" d="${d}"/>`;
  cursor += width + 14;
  return value;
}).join('');

const raw = JSON.parse((await fs.readFile(path.join(dir, 'tagline-outline.json'), 'utf8')).replace(/^\uFEFF/, ''));
const points = raw.points;
const minX = Math.min(...points.map(p=>p[0]));
const minY = Math.min(...points.map(p=>p[1]));
const point = i => `${round(points[i][0]-minX)} ${round(points[i][1]-minY)}`;
let tagline = '';
for (let i = 0; i < points.length; i++) {
  const type = raw.types[i] & 7;
  if (type === 0) tagline += `M${point(i)}`;
  else if (type === 1) tagline += `L${point(i)}`;
  else if (type === 3) {
    tagline += `C${point(i)} ${point(i+1)} ${point(i+2)}`;
    i += 2;
  }
  if (raw.types[i] & 128) tagline += 'Z';
}
const art = {
  primary: { w:864,h:240, paths:`<g transform="translate(48 48)">${mark}</g><g transform="translate(236 72) scale(1.05)">${wordmark}</g>` },
  tagline: { w:864,h:260, paths:`<g transform="translate(48 48)">${mark}</g><g transform="translate(236 64) scale(1.05)">${wordmark}</g><path transform="translate(238 183) scale(.9)" d="${tagline}"/>` },
  symbol: { w:160,h:160, paths:`<g transform="translate(9 8)">${mark}</g>` },
};
function svg(type, colour) {
  const {w,h,paths} = art[type];
  const title = `AVUNOR${type==='tagline'?' — Your vision. Built.':type==='symbol'?' — A symbol':''}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}"><title>${title}</title><g fill="${colour}">${paths}</g></svg>`;
}
for (const [variant,colour] of [['black','#111111'],['white','#ffffff']]) {
  for (const type of Object.keys(art)) {
    const name = `avunor-${type}-${variant}`;
    const content = svg(type,colour);
    await fs.writeFile(path.join(out,name+'.svg'),content);
    const width = type==='symbol'?1024:2400;
    await sharp(Buffer.from(content)).resize({width}).png().toFile(path.join(out,name+'.png'));
  }
  for (const size of [16,32,64,128,256]) {
    await sharp(Buffer.from(svg('symbol',colour))).resize(size,size).png().toFile(path.join(out,`avunor-symbol-${variant}-${size}.png`));
  }
}

const onWhite = svg('primary','#111111').replace('</title>','</title><rect width="864" height="240" fill="#ffffff"/>');
await fs.writeFile(path.join(out,'avunor-primary-black-on-white.svg'),onWhite);
await sharp(Buffer.from(onWhite)).resize({width:2400}).flatten({background:'#ffffff'}).png().toFile(path.join(out,'avunor-primary-black-on-white.png'));

const label = (text,x,y,colour='#777',size=14) => `<text x="${x}" y="${y}" fill="${colour}" font-family="Segoe UI, sans-serif" font-size="${size}">${text}</text>`;
const placed = (type,colour,x,y,w) => `<g transform="translate(${x} ${y}) scale(${w/art[type].w})" fill="${colour}">${art[type].paths}</g>`;
let preview = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1380" viewBox="0 0 1600 1380"><rect width="1600" height="1380" fill="#f4f3f0"/>`;
preview += label('AVUNOR / VISUAL IDENTITY',60,65,'#111',20)+label('MONOCHROME • 01',1370,65,'#777',12);
preview += `<rect x="40" y="105" width="760" height="410" rx="8" fill="#fff"/><rect x="800" y="105" width="760" height="410" rx="8" fill="#111"/>`;
preview += label('PRIMARY / LIGHT',72,148)+label('PRIMARY / DARK',832,148,'#aaa');
preview += placed('primary','#111',65,235,710)+placed('primary','#fff',825,235,710);
preview += `<rect x="40" y="535" width="760" height="340" rx="8" fill="#fff"/><rect x="800" y="535" width="760" height="340" rx="8" fill="#111"/>`;
preview += label('WITH TAGLINE',72,578)+label('REVERSED / WITH TAGLINE',832,578,'#aaa');
preview += placed('tagline','#111',120,610,600)+placed('tagline','#fff',880,610,600);
preview += `<rect x="40" y="895" width="1520" height="300" rx="8" fill="#fff"/>`+label('SYMBOL / SMALL-SIZE CHECKS',72,940);
preview += placed('symbol','#111',92,970,160)+placed('symbol','#111',340,1015,64)+placed('symbol','#111',490,1031,32)+placed('symbol','#111',620,1039,16);
preview += label('160 px',135,1160)+label('64 px',353,1135)+label('32 px',486,1135)+label('16 px',610,1135);
preview += `<rect x="790" y="955" width="250" height="215" rx="8" fill="#111"/>`+placed('symbol','#fff',835,977,160);
preview += label('Diagonal cut. Forward intent.',1110,1020,'#111',23)+label('Solid shapes. One clear signature.',1110,1060,'#777',17);
preview += label('HEADER SCALE / 240 PX',72,1240)+placed('primary','#111',400,1195,240);
preview += label('SVG masters + transparent PNGs',1050,1300,'#777',17)+label('Your vision. Built.',72,1310,'#111',20)+'</svg>';
await fs.writeFile(path.join(dir,'avunor-brand-preview.svg'),preview);
await sharp(Buffer.from(preview)).png().toFile(path.join(dir,'avunor-brand-preview.png'));
console.log('Created 7 SVG files, 16 transparent PNGs, a white-background PNG, and the preview sheet.');
