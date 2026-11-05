(()=>{
const host=document.querySelector('#showcase');if(!host)return;
const featured=[9,15,20,21,22,23].map(id=>products[id]);
const fullName=p=>p.name.toLowerCase().startsWith(p.brand.toLowerCase())?p.name:`${p.brand} ${p.name}`;
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let index=0,userPaused=reduceMotion.matches,hovered=false,focused=false,elapsed=0,lastTick=performance.now();
const byId=id=>document.getElementById(id);
function stopped(){return userPaused||hovered||focused||document.hidden||!!document.querySelector('dialog[open]')}
function state(){const pause=byId('showcase-pause');pause.setAttribute('aria-label',t(userPaused?'showcasePlay':'showcasePause'));pause.title=t(userPaused?'showcasePlay':'showcasePause');pause.firstElementChild.textContent=userPaused?'▶':'Ⅱ';pause.setAttribute('aria-pressed',String(userPaused));host.classList.toggle('is-paused',stopped())}
byId('showcase-selector').innerHTML=featured.map((p,i)=>`<button type="button" data-show-index="${i}"><img src="${photos(p)[0].src}" alt="" width="70" height="50" loading="lazy"><span dir="ltr">${p.brand}</span></button>`).join('');
function render(){const p=featured[index],img=byId('showcase-image');img.src=photos(p)[0].src;img.alt=`${fullName(p)} ${p.model}`;byId('showcase-brand').textContent=p.brand.toUpperCase();byId('showcase-model').textContent=p.model;byId('showcase-name').textContent=fullName(p);byId('showcase-price').innerHTML=`${money(p.price)} <small>USD</small>`;byId('showcase-specs').innerHTML=[p.gpu.includes('Integrated')?p.cpu:p.gpu,p.ram,p.storage].map(s=>`<span>${esc(s)}</span>`).join('');byId('showcase-product').dataset.detail=p.id;byId('showcase-product').setAttribute('aria-label',`${fullName(p)} · ${t('showcaseDetails')}`);byId('showcase-detail').dataset.detail=p.id;byId('showcase-detail').firstElementChild.textContent=t('showcaseDetails');byId('showcase-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(featured.length).padStart(2,'0')}`;host.setAttribute('aria-label',t('showcaseLabel'));byId('showcase-selector').setAttribute('aria-label',t('showcaseLabel'));host.querySelector('.showcase-prev').setAttribute('aria-label',t('showcasePrevious'));host.querySelector('.showcase-next').setAttribute('aria-label',t('showcaseNext'));host.querySelectorAll('[data-show-index]').forEach((button,i)=>{button.classList.toggle('active',i===index);button.setAttribute('aria-pressed',String(i===index));button.setAttribute('aria-label',`${t('showcaseChoose')} ${fullName(featured[i])}`)});img.classList.remove('entering');void img.offsetWidth;img.classList.add('entering');state()}
function change(next){index=(next+featured.length)%featured.length;elapsed=0;byId('showcase-progress').style.width='0%';render()}
host.addEventListener('click',e=>{const choice=e.target.closest('[data-show-index]'),step=e.target.closest('[data-show-step]');if(choice)change(Number(choice.dataset.showIndex));if(step)change(index+Number(step.dataset.showStep));if(e.target.closest('#showcase-pause')){userPaused=!userPaused;elapsed=0;state()}});
host.addEventListener('pointerenter',()=>{hovered=true;state()});host.addEventListener('pointerleave',()=>{hovered=false;state()});
host.addEventListener('focusin',()=>{focused=true;state()});host.addEventListener('focusout',e=>{focused=host.contains(e.relatedTarget);state()});
host.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();change(index+(e.key==='ArrowRight'?1:-1))});
document.addEventListener('visibilitychange',()=>{lastTick=performance.now();state()});
window.updateLaptopShowcase=render;
window.setInterval(()=>{const now=performance.now(),delta=Math.min(now-lastTick,500);lastTick=now;state();if(stopped())return;elapsed+=delta;byId('showcase-progress').style.width=`${Math.min(100,elapsed/6500*100)}%`;if(elapsed>=6500)change(index+1)},100);
render();
})();
