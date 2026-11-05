import fs from 'node:fs/promises';
for(const family of ['inter','notosansarabic']){const r=await fetch(`https://raw.githubusercontent.com/google/fonts/main/ofl/${family}/OFL.txt`);if(!r.ok)throw Error(family+' license '+r.status);await fs.writeFile(`dist/fonts/${family}-OFL.txt`,await r.text());console.log('Saved license',family)}
