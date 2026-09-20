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

  const progressKey='26_Digital_Inclusion_progress_v2';
  const readProgress=()=>{try{return JSON.parse(localStorage.getItem(progressKey)||'{}')}catch{return{}}};
  const writeProgress=data=>{try{localStorage.setItem(progressKey,JSON.stringify(data))}catch{}};
  const progress=readProgress();

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

  const lessons=[...document.querySelectorAll('.lesson[href*="aula-"]')];
  const updateLessonCards=()=>lessons.forEach(card=>{
    const id=card.dataset.lesson || card.getAttribute('href');
    if(progress[id]?.visited){
      card.classList.add('completed');
      card.dataset.status='visitada';
    }
  });
  updateLessonCards();

  if(lessons.length){
    const panel=document.createElement('div');
    panel.className='learning-dashboard';
    panel.id='learning-progress';
    const render=()=>{
      const done=lessons.filter(l=>progress[l.dataset.lesson||l.getAttribute('href')]?.completed).length;
      const visited=lessons.filter(l=>progress[l.dataset.lesson||l.getAttribute('href')]?.visited).length;
      const pct=Math.round((done/lessons.length)*100);
      panel.innerHTML=
        '<div class="dashboard-copy"><span class="eyebrow dark-eyebrow">MEU PROGRESSO</span>'+
        '<strong>'+done+' de '+lessons.length+' aulas concluídas</strong>'+
        '<small>'+visited+' aula(s) visitada(s) · registro local deste dispositivo</small></div>'+
        '<div class="dashboard-meter" aria-label="Progresso das aulas"><span style="width:'+pct+'%"></span></div>';
    };
    render();
    const grid=lessons[0]?.parentElement;
    if(grid?.parentElement)grid.parentElement.insertBefore(panel,grid);

    lessons.forEach(card=>{
      const id=card.dataset.lesson||card.getAttribute('href');
      card.addEventListener('click',()=>{progress[id]={...(progress[id]||{}),visited:new Date().toISOString()};writeProgress(progress);card.classList.add('completed');render();});
    });
  }

  document.querySelectorAll('[data-complete-lesson]').forEach(button=>button.addEventListener('click',()=>{
    const id=button.dataset.completeLesson;
    progress[id]={...(progress[id]||{}),visited:progress[id]?.visited||new Date().toISOString(),completed:new Date().toISOString()};
    writeProgress(progress);
    button.classList.add('is-done');
    button.textContent='✓ Aula concluída';
    const status=document.querySelector('[data-lesson-status]');
    if(status){status.textContent='Concluída';status.classList.add('success');}
    window.dispatchEvent(new CustomEvent('learning-progress-updated',{detail:{id}}));
  }));

  document.querySelectorAll('[data-quiz]').forEach(quiz=>{
    quiz.querySelectorAll('[data-answer]').forEach(option=>option.addEventListener('click',()=>{
      const expected=quiz.dataset.quiz;
      const actual=option.dataset.answer;
      const feedback=quiz.querySelector('[data-feedback]');
      const correct=actual===expected;
      quiz.querySelectorAll('[data-answer]').forEach(o=>o.classList.remove('selected','correct','wrong'));
      option.classList.add('selected',correct?'correct':'wrong');
      if(feedback){feedback.textContent=correct?'Muito bem. Você conseguiu.':'Vamos tentar novamente. Pense na ação antes de clicar.';feedback.className='quiz-feedback '+(correct?'success':'help');}
      if(correct){quiz.dataset.completed='true';}
    }));
  });

  document.querySelectorAll('[data-checklist]').forEach(list=>{
    const id=list.dataset.checklist;
    list.querySelectorAll('input[type="checkbox"]').forEach(box=>box.addEventListener('change',()=>{
      const all=[...list.querySelectorAll('input[type="checkbox"]')];
      const done=all.length>0&&all.every(x=>x.checked);
      const status=list.querySelector('[data-check-status]');
      if(status)status.textContent=done?'✓ Concluído':'Continue praticando';
      if(done){progress[id]={completed:new Date().toISOString()};writeProgress(progress);list.classList.add('completed');}
    }));
  });

  if('IntersectionObserver' in window){
    const reveal=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}}),{threshold:.12});
    document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));
  }
});