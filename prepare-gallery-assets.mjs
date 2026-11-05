import fs from 'node:fs/promises';
const old=JSON.parse(await fs.readFile('outputs/gallery-candidates.json','utf8'));
const more=JSON.parse(await fs.readFile('outputs/extra-candidates.json','utf8'));
const plan={};
plan.vivobook=old.vivobook.images.filter(u=>u.includes('1200_1200')).slice(0,9);
plan.fa506=old.fa506.images.filter(u=>u.includes('width=1800')).slice(1);
plan.acer=old.acer.images.filter(u=>u.includes('/2025/10/acer-nitro-v-15-anv15-52'));
plan.slim8=old.slim8.images.filter(u=>u.includes('/img/lenovo/2025/42834/')&&!u.includes('/cache/'));
plan.slim10=old.slim10.images.filter(u=>u.includes('15irh10')&&u.endsWith('.jpg'));
plan.hp15=old.hp15.images.filter(u=>u.startsWith('https://product.hstatic')&&u.includes('_grande'));
plan.dell=old.dell.images.filter(u=>u.includes('/thumb_800x0/webhook'));
plan.hp255=more.hp255.images.filter(u=>u.includes('/hp_255_g10/')&&/move\d_full/.test(u));
plan.victus=more.victus.images.filter(u=>/photo_gallery\d_full/.test(u));
plan.msi=more.msi.images.filter(u=>/msithingf6312ve454vn-\d\.jpg$/.test(u));
for(const k of ['fa608','fx608']){const h=await fs.readFile('outputs/pages/'+k+'-extra.html','utf8');const images=h.match(/"image":\[(.*?)\]/)?.[1];plan[k]=images?[...images.matchAll(/"(https[^" ]+)"/g)].map(m=>m[1]):[];}
for(const [k,url] of Object.entries({fx607:'https://www.asus.com/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-f16-2024/',fa607:'https://www.asus.com/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-a16-2024/'})){try{const h=await (await fetch(url)).text();const images=h.match(/"image":\[(.*?)\]/)?.[1];plan[k]=images?[...images.matchAll(/"(https[^" ]+)"/g)].map(m=>m[1]):[];}catch(e){console.log(k,e.message)}}
const loqPage=await (await fetch('https://psrefstuff.lenovo.com/Product/LOQ/LOQ_15ARP10E')).text();await fs.writeFile('outputs/pages/loq-stuff.html',loqPage);
plan.loq=[...loqPage.matchAll(/(?:src|href)=["']([^"']+\.(?:jpg|png))["']/gi)].map(m=>new URL(m[1],'https://psrefstuff.lenovo.com').href);
await fs.writeFile('outputs/gallery-plan.json',JSON.stringify(plan,null,2));
await fs.mkdir('outputs/raw-gallery',{recursive:true});
const jobs=Object.entries(plan).flatMap(([key,urls])=>urls.slice(0,10).map((url,i)=>({key,url,i})));
let next=0;async function worker(){while(next<jobs.length){const a=jobs[next++];try{const r=await fetch(a.url,{signal:AbortSignal.timeout(30000)});if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw Error('Not image '+r.status);await fs.writeFile(`outputs/raw-gallery/${a.key}-${a.i}.jpg`,Buffer.from(await r.arrayBuffer()));console.log('OK',a.key,a.i)}catch(e){console.log('FAILED',a.key,a.i,e.message)}}}
await Promise.all(Array.from({length:8},worker));
console.log(Object.fromEntries(Object.entries(plan).map(([k,v])=>[k,v.length])));
