import fs from 'node:fs/promises';
const keys=process.argv.slice(2);
const assets=JSON.parse(await fs.readFile('dist/photo-sources.json','utf8')).filter(a=>!keys.length||keys.includes(a.key));
await fs.mkdir('dist/images',{recursive:true});
await Promise.allSettled(assets.map(async a=>{try{const r=await fetch(a.url,{headers:{'User-Agent':'Mozilla/5.0'},signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error('HTTP '+r.status);const type=r.headers.get('content-type');if(!type?.startsWith('image/'))throw Error('Not an image: '+type);const bytes=Buffer.from(await r.arrayBuffer());await fs.writeFile('dist/images/'+a.key+'.jpg',bytes);console.log('OK',a.key,type,bytes.length)}catch(e){console.log('FAILED',a.key,e.message)}}));
