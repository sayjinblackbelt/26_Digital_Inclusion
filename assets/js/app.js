document.addEventListener('DOMContentLoaded',()=>{
  document.documentElement.classList.add('js');

  const script=document.querySelector('script[src*="assets/js/app.js"]');
  const base=script?script.src.replace(/assets\/js\/app\.js(?:\?.*)?$/,''):'';
  const polish=base+'assets/css/polish.css';
  if(!document.querySelector('link[data-ui-polish]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.dataset.uiPolish='true';
    link.href=polish;
    document.head.appendChild(link);
  }

  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id&&id.length>1){const el=document.querySelector(id);if(el){e.preventDefault();el.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});history.replaceState(null,'',id);}}}));

  const sections=[...document.querySelectorAll('main section[id]')];
  const navLinks=[...document.querySelectorAll('.nav-links a[href^="#"]')];
  if(sections.length&&navLinks.length&&'IntersectionObserver' in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      navLinks.forEach(link=>link.removeAttribute('aria-current'));
      const active=navLinks.find(link=>link.getAttribute('href')==='#'+entry.target.id);
      if(active)active.setAttribute('aria-current','page');
    }),{rootMargin:'-25% 0px -60% 0px',threshold:0});
    sections.forEach(section=>observer.observe(section));
  }

  const progressKey='26_Digital_Inclusion_progress_v1';
  const readProgress=()=>{try{return JSON.parse(localStorage.getItem(progressKey)||'{}')}catch{return{}}};
  const writeProgress=data=>{try{localStorage.setItem(progressKey,JSON.stringify(data))}catch{}};
  const cards=[...document.querySelectorAll('.lesson[href*="aula-"]')];

  if(cards.length){
    const progress=readProgress();
    const panel=document.createElement('div');
    panel.className='callout';
    panel.id='learning-progress';
    const updatePanel=(flash=false)=>{
      const done=cards.filter(card=>progress[card.getAttribute('href')]).length;
      const pct=Math.round((done/cards.length)*100);
      panel.innerHTML=`<strong>Seu progresso:</strong> ${done} de ${cards.length} aulas visitadas · ${pct}%<br><small>Registro local deste dispositivo; nenhum dado é enviado ao servidor.</small>`;
      if(flash){
        panel.classList.remove('updated');
        requestAnimationFrame(()=>panel.classList.add('updated'));
        window.setTimeout(()=>panel.classList.remove('updated'),700);
      }
    };
    updatePanel();
    const grid=cards[0].parentElement;
    if(grid&&grid.parentElement)grid.parentElement.insertBefore(panel,grid);

    cards.forEach(card=>{
      const href=card.getAttribute('href');
      if(progress[href])card.classList.add('completed');
      card.addEventListener('click',()=>{
        progress[href]=new Date().toISOString();
        writeProgress(progress);
        card.classList.add('completed');
        updatePanel(true);
      });
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click()}});
    });
  }
});