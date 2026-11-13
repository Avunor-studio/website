import http from 'node:http';
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const worker=(await import(pathToFileURL(process.cwd()+'/dist/server/index.js'))).default;
const path='.review-preview-data.json';let records;try{records=new Map(JSON.parse(await fs.readFile(path,'utf8')));}catch{records=new Map();}
const BUCKET={get:async key=>records.has(key)?{json:async()=>JSON.parse(records.get(key))}:null,put:async(key,value)=>{records.set(key,value);await fs.writeFile(path,JSON.stringify([...records]));},list:async()=>({objects:[...records.keys()].map(key=>({key}))})};
http.createServer(async(req,res)=>{try{let body='';for await(const chunk of req)body+=chunk;const response=await worker.fetch(new Request('http://127.0.0.1:4173'+req.url,{method:req.method,headers:req.headers,...(body?{body}: {})}),{BUCKET});res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch(error){res.writeHead(500).end(String(error));}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));
