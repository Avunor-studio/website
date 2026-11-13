import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');
const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'exports');
const files = await fs.readdir(dir);
assert.equal(files.filter(n=>n.endsWith('.svg')).length,7);
assert.equal(files.filter(n=>n.endsWith('.png')).length,17);
for (const name of files.filter(n=>n.endsWith('.svg'))) {
  const svg = await fs.readFile(path.join(dir,name),'utf8');
  assert(!/NaN|undefined|<text|<image|<use|font-family|href=/.test(svg),name);
  assert(svg.includes('<path'),name);
  assert(svg.includes('AVUNOR'),name);
  if(name.includes('tagline')) assert(svg.includes('Your vision. Built.'),name);
}
for (const name of files.filter(n=>n.endsWith('.png'))) {
  const file = path.join(dir,name);
  const meta = await sharp(file).metadata();
  const opaque = name.includes('-on-white');
  if(!opaque) assert(meta.hasAlpha,name);
  const {data,info} = await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let minX=info.width,minY=info.height,maxX=-1,maxY=-1;
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    if(data[(y*info.width+x)*4+3]>0) {minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  }
  assert(maxX>=0,name+' is not blank');
  if(!opaque) assert(minX>0&&minY>0&&maxX<info.width-1&&maxY<info.height-1,name+' has unclipped clear space');
  else { assert.equal(data[0],255); assert.equal(data[1],255); assert.equal(data[2],255); for(let i=3;i<data.length;i+=4)assert.equal(data[i],255); }
  const match=name.match(/-(16|32|64|128|256)\.png$/);
  if(match) assert.equal(info.width,Number(match[1]));
  if(name.includes('-black') && !opaque) {
    const white=await sharp(path.join(dir,name.replace('-black','-white'))).ensureAlpha().raw().toBuffer();
    for(let i=3;i<data.length;i+=4) assert.equal(data[i],white[i],name+' matches reversed geometry');
  }
}
console.log('PASS: 7 font-independent SVGs; 16 transparent PNGs and one opaque white-background PNG; nonempty, unclipped artwork; matching black/white geometry; correct icon sizes.');
