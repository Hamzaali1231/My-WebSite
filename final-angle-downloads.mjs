import fs from 'node:fs/promises';
const extra=JSON.parse(await fs.readFile('outputs/extra-candidates.json','utf8'));
const last=JSON.parse(await fs.readFile('outputs/last-candidates.json','utf8'));
const plan={fx608more:last.fx608.images.filter(u=>u.includes('width=1800')).slice(1),loq:[
'https://img.advice.co.th/images_nas/pic_product4/A0181526/A0181526OK_BIG_3.jpg',
'https://powerup.ua/content/images/4/1400x1224l95nn0/23131055699232.jpg',
'https://www.fabritec.pe/assets/media/producto/2792-LENOVO-LOQ-15ARP10E-%28-83S0004HLM-%29__6.jpg',
'https://www.fabritec.pe/assets/media/producto/2792-LENOVO-LOQ-15ARP10E-%28-83S0004HLM-%29___4.jpg'],msimore:[
'https://www.laptoparena.net/images/MSI_Gaming_GF63_12VE-029_Thin_GF63_12VE-029_image_4.jpg',
'https://kvshop.com.ua/users/products/292/292065/big/43l84sfqtcy2yz9m84xn4ohel7b2xshz-webp.jpg',
'https://techcare.vn/image/msi-gaming-gf63-thin-12ve-6-9jioefw.jpg']};
const hpurl='https://jp.ext.hp.com/notebooks/personal/hp_15_fd/';
const h=await(await fetch(hpurl)).text();await fs.writeFile('outputs/pages/hp15-official.html',h);
plan.hp15more=[...h.matchAll(/(?:src|href)=["']([^"']+\.(?:jpg|png))["']/gi)].map(m=>new URL(m[1],hpurl).href).filter(u=>u.includes('/hp_15_fd/')&&/gallery|move\d|view\d|photo\d/i.test(u));
plan.victusmore=extra.victus.images.filter(u=>u.includes('/victus_15_fb/')&&/move\d|gallery\d+\.png|product|view\d/.test(u));
let jobs=Object.entries(plan).flatMap(([key,urls])=>[...new Set(urls)].slice(0,12).map((url,i)=>({key,url,i})));let next=0;
async function worker(){while(next<jobs.length){const a=jobs[next++];try{const r=await fetch(a.url,{signal:AbortSignal.timeout(25000)});if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw Error('Not image '+r.status);await fs.writeFile(`outputs/raw-gallery/${a.key}-${a.i}.jpg`,Buffer.from(await r.arrayBuffer()));console.log('OK',a.key,a.i)}catch(e){console.log('FAILED',a.key,a.i,e.message)}}}await Promise.all(Array.from({length:6},worker));await fs.writeFile('outputs/final-plan.json',JSON.stringify(plan,null,2));
