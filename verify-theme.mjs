import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('dist/theme.js','utf8');
function setup(saved,systemDark=false,blocked=false,lang='en'){
 const events={},root={lang,dataset:{}},attrs={},meta={},button={setAttribute(k,v){attrs[k]=v},addEventListener(k,fn){events[k]=fn}},store={value:saved};let change;
 vm.runInNewContext(source,{document:{documentElement:root,querySelector:s=>s==='#theme-toggle'?button:meta,addEventListener:(k,fn)=>events[k]=fn},window:{matchMedia:()=>({matches:systemDark,addEventListener:(k,fn)=>change=fn})},localStorage:{getItem(){if(blocked)throw Error();return store.value},setItem(k,v){if(blocked)throw Error();store.value=v}}});
 events.DOMContentLoaded();return{root,attrs,button,store,events,change};
}
const a=setup(null,true);assert.equal(a.root.dataset.theme,'dark');assert.equal(a.attrs['aria-pressed'],'true');a.change({matches:false});assert.equal(a.root.dataset.theme,'light');a.events.click();assert.equal(a.store.value,'dark');a.change({matches:false});assert.equal(a.root.dataset.theme,'dark');
assert.equal(setup('light',true).root.dataset.theme,'light');assert.equal(setup('invalid',true).root.dataset.theme,'dark');const b=setup(null,false,true,'ar');b.events.click();assert.equal(b.root.dataset.theme,'dark');assert.ok(b.attrs['aria-label'].includes('الفاتح'));
for(const page of ['index.html','ar.html']){const html=fs.readFileSync('dist/'+page,'utf8');assert.equal((html.match(/id="theme-toggle"/g)||[]).length,1);assert.ok(html.includes('src="theme.js"'));assert.ok(html.includes('href="themes.css"'));}
console.log('Passed: system preference, manual toggle, saved preference, blocked storage, Arabic labels, and integration on both pages.');
