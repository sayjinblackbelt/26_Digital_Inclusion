document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{const id=a.getAttribute('href');if(id&&id.length>1){const el=document.querySelector(id);if(el)el.scrollIntoView({behavior:'smooth'})}}));

  const progressKey='26_Digital_Inclusion_progress_v1';
  const readProgress=()=>{try{return JSON.parse(localStorage.getItem(progressKey)||'{}')}catch{return{}}};
  const writeProgress=data=>localStorage.setItem(progressKey,JSON.stringify(data));
  const cards=[...document.querySelectorAll('.lesson[href*="aula-"]')];

  if(cards.length){
    const progress=readProgress();
    const panel=document.createElement('div');
    panel.className='callout';
    panel.id='learning-progress';
    panel.style.margin='0 0 28px';
    const updatePanel=()=>{
      const done=cards.filter(card=>progress[card.getAttribute('href')]).length;
      panel.innerHTML=`<strong>Progresso local:</strong> ${done} de ${cards.length} aulas marcadas como concluídas. Este registro fica apenas neste dispositivo e não envia dados ao servidor.`;
    };
    updatePanel();
    const grid=cards[0].parentElement;
    if(grid&&grid.parentElement)grid.parentElement.insertBefore(panel,grid);

    cards.forEach(card=>{
      const href=card.getAttribute('href');
      const tag=card.querySelector('.tag');
      const button=document.createElement('button');
      button.type='button';
      button.className='tag progress-toggle';
      button.textContent=progress[href]?'Concluída ✓':'Marcar concluída';
      button.setAttribute('aria-pressed',String(Boolean(progress[href])));
      button.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        if(progress[href])delete progress[href];else progress[href]=new Date().toISOString();
        writeProgress(progress);
        const done=Boolean(progress[href]);
        button.textContent=done?'Concluída ✓':'Marcar concluída';
        button.setAttribute('aria-pressed',String(done));
        card.classList.toggle('completed',done);
        updatePanel();
      });
      card.classList.toggle('completed',Boolean(progress[href]));
      if(tag)tag.replaceWith(button);else card.appendChild(button);
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click()}});
    });
  }
});