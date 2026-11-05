import fs from 'node:fs/promises';
let s=await fs.readFile('dist/showcase.js','utf8');
s=s.replace('const featured=[9,15,20,21,22,23].map(id=>products[id]);','const featured=[9,15,20,21,22,23].map(id=>products[id]);\nconst fullName=p=>p.name.toLowerCase().startsWith(p.brand.toLowerCase())?p.name:`${p.brand} ${p.name}`;');
s=s.replace('`${p.brand} ${p.name} ${p.model}`','`${fullName(p)} ${p.model}`').replace('textContent=`${p.brand} ${p.name}`','textContent=fullName(p)').replace('`${p.brand} ${p.name} · ${t(\'showcaseDetails\')}`','`${fullName(p)} · ${t(\'showcaseDetails\')}`').replace("[p.cpu,p.ram,p.storage]","[p.gpu.includes('Integrated')?p.cpu:p.gpu,p.ram,p.storage]").replace('`${t(\'showcaseChoose\')} ${featured[i].brand} ${featured[i].name}`','`${t(\'showcaseChoose\')} ${fullName(featured[i])}`');
await fs.writeFile('dist/showcase.js',s);
