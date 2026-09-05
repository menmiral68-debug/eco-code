(() => {
  'use strict';

  const MISSIONS = [
    { id:'camp', title:'Нулевая искра', meta:'ПОХОД · СТОЯНКА', icon:'⛺', intro:'Найди три сигнала, оцени обстановку и не дай группе начать опасный сценарий.', clues:['Сухая трава подходит к зоне отдыха.','Порывы ветра усиливаются.','На въезде указано ограничение на открытый огонь.'], rounds:[
      ['План','Друзья уже достают спички. Условия никто не проверял.',[['Сначала проверить место, ветер и ограничения',12],['Поторопиться поставить костёр',-12],['Выбрать самый сухой участок',-16]]],
      ['Ветер','Порывы усилились, а вокруг сухая растительность.',[['Изменить план и отказаться от открытого огня',14],['Оставить всё как есть',-14],['Попробовать быстро',-16]]],
      ['Ограничение','На месте действует ограничение на открытый огонь.',[['Отказаться от открытого огня',16],['Сделать огонь меньше',-18],['Решить, что запрет не важен',-12]]],
      ['Дым','Между деревьями появляется дым, но пламени не видно.',[['Не приближаться, предупредить взрослого и сообщить 101/112',18],['Пойти посмотреть ближе',-20],['Подождать, пока станет очевиднее',-15]]],
      ['Финал','Кто-то говорит: «Раз пламени не видно, всё нормально».', [['Оставить место безопасным и не приближаться к дыму',18],['Пойти искать источник',-18],['Решить голосованием',-10]]]
    ]},
    { id:'storm', title:'Перехват погоды', meta:'ТУНДРА · РЫБАЛКА', icon:'◒', intro:'Погода меняется. Вовремя изменить план — тоже навык.', clues:['В прогнозе предупреждение о сильном ветре.','Порывы над водой становятся резкими.','В группе предлагают горючую жидкость для розжига.'], rounds:[
      ['Прогноз','Перед выездом выбираем данные, которые влияют на безопасность.',[['Проверить предупреждения, ветер, осадки и ограничения',12],['Посмотреть только температуру',-8],['Ориентироваться только на время',-8]]],
      ['Снаряжение','Кто-то предлагает горючую жидкость «на всякий случай».', [['Отказаться и выбрать безопасный формат отдыха',15],['Взять немного',-16],['Проверить свойства экспериментом',-20]]],
      ['Перелом','Через час ветер стал значительно сильнее.',[['Признать, что план больше не подходит, и изменить его',16],['Продолжить, ведь всё уже готово',-14],['Спросить, кто готов рискнуть',-15]]],
      ['Дым','На горизонте появляется дым неизвестного происхождения.',[['Остаться на расстоянии, предупредить взрослого и сообщить',18],['Пойти к дыму',-19],['Сначала снять видео',-15]]],
      ['Код маршрута','Что переносится из игры в любую поездку?',[['Сначала условия и последствия, потом действие',18],['Если раньше получилось, получится снова',-10],['План нельзя менять',-12]]]
    ]},
    { id:'picnic', title:'Смена сценария', meta:'ПИКНИК · КОМАНДА', icon:'▱', intro:'Заметь риск и сумей объяснить группе, почему план нужно изменить.', clues:['Сухая трава и низкие ветви рядом.','Кто-то говорит: «Мы всегда здесь так делаем».','Младшие дети бегают рядом с зоной отдыха.'], rounds:[
      ['Место','Семья выбирает место для отдыха.',[['Сначала проверить правила, место и условия',11],['Выбрать самое красивое место',-8],['Попросить самого смелого решить',-9]]],
      ['Риск','Рядом сухая трава и низкие ветви.',[['При таких условиях отказаться от открытого огня',16],['Согласиться, если огонь маленький',-16],['Согласиться, если рядом взрослый',-12]]],
      ['Люди','Дети бегают между вещами, взрослые заняты едой.',[['Попросить взрослого организовать безопасную зону',14],['Назначить ребёнка ответственным за огонь',-20],['Ничего не менять',-14]]],
      ['Диалог','Родственник не хочет менять привычный отдых.',[['Объяснить конкретный риск и предложить безопасный вариант',17],['Сказать «потому что я решил»',-7],['Промолчать',-12]]],
      ['Финал','Группа теперь смотрит на ситуацию твоими глазами.',[['Замечать изменение условий и вовремя менять решение',18],['Никогда не отдыхать на природе',-6],['Всегда делать только то, что говорит старший',-8]]]
    ]}
  ];

  const STORE='ecocode_game_v5';
  const state={xp:0,done:[],best:0,badges:[]};
  try{Object.assign(state,JSON.parse(localStorage.getItem(STORE)||'{}'));}catch(e){}
  const $=(s,r=document)=>r.querySelector(s);
  const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state));}catch(e){}};

  function showView(id){
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='view-'+id));
    document.querySelectorAll('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
    if(id==='sim') renderMissions();
    if(id==='progress') renderProgress();
    window.scrollTo(0,0);
  }

  function renderMissions(){
    const box=$('#scenarioList'); if(!box)return;
    box.innerHTML='';
    MISSIONS.forEach((m,i)=>{
      const unlocked=i===0||state.done.includes(MISSIONS[i-1].id);
      const b=document.createElement('button'); b.type='button'; b.className='scenario-card '+(unlocked?'':'locked'); b.disabled=!unlocked;
      b.innerHTML='<span class="sc-icon">'+m.icon+'</span><span><span class="sc-title">'+esc(m.title)+'</span><span class="sc-desc">'+esc(m.intro)+'</span><span class="sc-meta">'+esc(m.meta)+' · 5 этапов · 3 сигнала</span></span><span class="status '+(state.done.includes(m.id)?'done':'open')+'">'+(state.done.includes(m.id)?'пройдено':unlocked?'доступно':'закрыто')+'</span>';
      b.addEventListener('click',()=>startMission(m)); box.appendChild(b);
    });
    const t=$('#overallProgressText'),p=$('#overallProgressBar');
    if(t)t.textContent=state.done.length+' / 3';
    if(p)p.style.width=(state.done.length/3*100)+'%';
  }

  function renderProgress(){
    const xp=$('#totalXP'),done=$('#doneCount'),best=$('#safeStreak'),badges=$('#badges');
    if(xp)xp.textContent=state.xp+' XP'; if(done)done.textContent=state.done.length+' / 3'; if(best)best.textContent=state.best;
    if(badges)badges.innerHTML=state.badges.length?state.badges.map(x=>'<div class="badge">✦ '+esc(x)+'</div>').join(''):'<div class="card"><p>Пройди первую миссию, чтобы открыть первое достижение.</p></div>';
  }

  function startMission(m){
    const game=$('#game'); if(!game)return;
    game.hidden=false; let found=0,round=0,score=0,risk=18,streak=0,bestStreak=0;
    const draw=()=>{
      game.innerHTML='<div class="mission-hud"><div><div class="mission-sub">Миссия · '+esc(m.meta)+'</div><div class="mission-title">'+esc(m.title)+'</div></div><div class="hud-right"><span class="chip">✦ <b>'+state.xp+'</b> XP</span><span class="chip">🔥 <b>'+bestStreak+'</b></span></div></div><div class="intel"><div class="intel-title"><b>РАЗВЕДДАННЫЕ</b><span>'+found+' / 3</span></div><div class="intel-track">'+m.clues.map((c,i)=>'<button type="button" class="intel-dot '+(i<found?'found':'')+'" data-intel="'+i+'">'+(i<found?'✓ ':'')+'Сигнал '+(i+1)+'</button>').join('')+'</div></div><div class="mission-stage"><div class="world '+(m.id==='storm'?'storm':m.id==='picnic'?'picnic':'sun')+'"><div class="sun"></div><div class="mountain m1"></div><div class="mountain m2"></div><div class="trees"></div><div class="ground"></div><div class="tent"></div><div class="fire"></div><div class="person"></div><div class="rain"></div><div class="wind-lines"></div></div><div class="riskbar"><label><span>ЭКОРИСК</span><b id="riskLabel">'+riskLabel(risk)+'</b></label><div class="riskline"><i id="riskFill"></i></div></div><div class="scan-panel" id="scan"></div><div class="decision" id="decision"></div></div>';
      updateRisk(); renderScan();
    };
    const riskLabel=r=>r<30?'низкий':r<60?'контролируемый':'высокий';
    const updateRisk=()=>{const f=$('#riskFill'),l=$('#riskLabel');if(f)f.style.width=risk+'%';if(l)l.textContent=riskLabel(risk);};
    const renderScan=()=>{
      const p=$('#scan');if(!p)return;
      p.innerHTML='<div class="scan-kicker">ШАГ 1 · НАБЛЮДЕНИЕ</div><div class="scan-title">Собери три сигнала</div><div class="scan-copy">Сигналы — это факты о месте, погоде и группе. Нажимай по порядку: сначала собираем картину, потом открываем решение.</div><div class="scan-grid">'+m.clues.map((c,i)=>'<button type="button" class="scan-btn" data-scan="'+i+'" '+(i!==found?'disabled':'')+'><small>СИГНАЛ '+(i+1)+'</small><b>'+(i<found?'✓ Найдено':'Проверить')+'</b></button>').join('')+'</div>';
      p.querySelectorAll('[data-scan]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.scan);if(i!==found)return;found++;risk=Math.max(5,risk+(i===1?5:-3));updateRisk();renderScan();if(found===3)renderDecision();}));
    };
    const renderDecision=()=>{
      const d=$('#decision'),r=m.rounds[round];if(!d)return;
      d.innerHTML='<div class="phase">ШАГ 2 · РЕШЕНИЕ '+(round+1)+' / '+m.rounds.length+'</div><h3>'+esc(r[0])+'</h3><p>'+esc(r[1])+'</p><div class="choice-grid">'+r[2].map((c,i)=>'<button type="button" class="choice" data-choice="'+i+'"><span class="num">ВАРИАНТ '+(i+1)+'</span>'+esc(c[0])+'</button>').join('')+'</div><div class="outcome" id="outcome"></div>';
      d.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.choice))));
    };
    const choose=i=>{
      const c=m.rounds[round][2][i],good=c[1]>0;score+=c[1];
      if(good){risk=Math.max(5,risk-10);streak++;bestStreak=Math.max(bestStreak,streak);state.xp+=c[1];}
      else{risk=Math.min(96,risk+Math.abs(c[1]));streak=0;state.xp+=2;}
      save();updateRisk();
      const d=$('#decision'),o=$('#outcome');d.querySelectorAll('.choice').forEach(x=>x.disabled=true);
      o.className='outcome show '+(good?'good':'bad');o.innerHTML='<strong>'+(good?'✓ Безопасное решение':'⚠ Риск вырос')+'</strong><br>'+esc(c[0]);
      const next=document.createElement('button');next.type='button';next.className='btn primary next';next.textContent=round===m.rounds.length-1?'Завершить миссию →':'Следующий этап →';next.addEventListener('click',()=>{round++;found=0;if(round>=m.rounds.length)finish();else draw();});d.appendChild(next);
    };
    const finish=()=>{
      if(!state.done.includes(m.id))state.done.push(m.id);state.best=Math.max(state.best,bestStreak);if(!state.badges.includes('Разведчик'))state.badges.push('Разведчик');if(bestStreak>=3&&!state.badges.includes('Серия решений'))state.badges.push('Серия решений');save();
      game.innerHTML='<div class="finish"><div class="finish-card"><div class="finish-medal">✦</div><div class="eyebrow">Миссия завершена</div><h2>'+ (score>=60?'Сильный результат':'Миссия пройдена') +'</h2><p>Ты прошёл все этапы и увидел, как наблюдение влияет на решение.</p><div class="score-grid"><div class="score-box"><b>'+score+'</b><span>очки</span></div><div class="score-box"><b>'+risk+'</b><span>экориск</span></div><div class="score-box"><b>'+bestStreak+'</b><span>серия</span></div><div class="score-box"><b>3 / 3</b><span>сигнала</span></div></div><div class="finish-actions"><button type="button" class="btn primary" id="again">Повторить миссию</button><button type="button" class="btn secondary" id="backSim">К миссиям</button></div></div></div>';
      $('#again').addEventListener('click',()=>startMission(m));$('#backSim').addEventListener('click',()=>{game.hidden=true;renderMissions();});
    };
    draw();game.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function bind(){
    document.addEventListener('click',e=>{
      const view=e.target.closest('[data-view]');if(view){e.preventDefault();showView(view.dataset.view);return;}
      const action=e.target.closest('[data-action]');if(action){if(action.dataset.action==='start')showView('sim');if(action.dataset.action==='how')alert('Как играть:\n\n1. Выбери миссию.\n2. Найди три сигнала — это факты о месте, погоде и группе.\n3. После трёх сигналов откроется решение.\n4. Выбор изменит экориск и твой результат.');}
    });
    showView('home');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})();