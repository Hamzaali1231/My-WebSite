(()=>{
  const root=document.documentElement;
  const system=window.matchMedia('(prefers-color-scheme: dark)');
  let preference;
  try{preference=localStorage.getItem('laptop-house-theme')}catch{}
  if(!['light','dark'].includes(preference))preference=null;
  function apply(theme){
    root.dataset.theme=theme;
    const meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=theme==='dark'?'#101125':'#5146cb';
    const button=document.querySelector('#theme-toggle');
    if(!button)return;
    const ar=root.lang==='ar',dark=theme==='dark';
    const label=ar?(dark?'التبديل إلى الوضع الفاتح':'التبديل إلى الوضع الداكن'):(dark?'Switch to light mode':'Switch to dark mode');
    button.setAttribute('aria-label',label);
    button.title=label;
    button.setAttribute('aria-pressed',String(dark));
    button.innerHTML=`<span aria-hidden="true">${dark?'☀':'☾'}</span><span>${ar?(dark?'فاتح':'داكن'):(dark?'Light':'Dark')}</span>`;
  }
  let activeTransition;
  function transitionTo(theme){
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced||typeof document.startViewTransition!=='function'){
      apply(theme);
      return;
    }
    if(activeTransition)activeTransition.skipTransition();
    try{
      const transition=document.startViewTransition(()=>apply(theme));
      activeTransition=transition;
      transition.finished.catch(()=>{}).finally(()=>{
        if(activeTransition===transition)activeTransition=null;
      });
    }catch{apply(theme)}
  }
  apply(preference|| (system.matches?'dark':'light'));
  system.addEventListener('change',e=>{if(!preference)transitionTo(e.matches?'dark':'light')});
  document.addEventListener('DOMContentLoaded',()=>{
    apply(root.dataset.theme);
    root.dataset.themeReady='true';
    document.querySelector('#theme-toggle').addEventListener('click',()=>{
      preference=root.dataset.theme==='dark'?'light':'dark';
      try{localStorage.setItem('laptop-house-theme',preference)}catch{}
      transitionTo(preference);
    });
  });
})();
