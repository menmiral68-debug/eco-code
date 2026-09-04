'use strict';

const printTeacher=()=>window.print();
const printButton=document.getElementById('printTeacher');
if(printButton)printButton.addEventListener('click',printTeacher);

const feedbackLink=document.getElementById('teacherFeedbackLink');
if(feedbackLink){feedbackLink.href='https://forms.yandex.ru/u/6a9998a7eb61464b2bcfaf7f';feedbackLink.target='_blank';feedbackLink.rel='noopener noreferrer';feedbackLink.textContent='Открыть форму обратной связи →';feedbackLink.classList.remove('secondary');feedbackLink.classList.add('primary');feedbackLink.removeAttribute('aria-disabled');}

/* Keep the simulator focused: remove legacy controls that the new game builds contextually. */
const cleanLegacyGameUI=()=>{
  ['spotBag','spotFire','spotSky'].forEach(id=>{const el=document.getElementById(id);if(el)el.remove();});
  document.querySelectorAll('.actionbar').forEach(el=>el.remove());
  const old=document.getElementById('waterBtn');if(old)old.remove();
};
cleanLegacyGameUI();

const newsData=[
 ['ЯНАО','28 августа 2026','В округе сохранялась сложная лесопожарная обстановка','МЧС ЯНАО сообщало о действующих очагах природных пожаров и режимах ЧС. Вывод для туриста: перед поездкой проверь официальные ограничения и не приближайся к очагу из любопытства.','https://89.mchs.gov.ru/deyatelnost/press-centr/novosti/5817696'],
 ['ПОМОЩЬ','26 августа 2026','К тушению пожаров в ЯНАО направили дополнительные силы','Рослесхоз сообщил о направлении ещё 98 десантников-пожарных. В регионе уже работали более тысячи специалистов лесопожарных служб и «Авиалесоохраны».','https://rosleshoz.gov.ru/news/federal/rosleskhoz-na-pomoshch-yanao-v-tushenii-lesnykh-pozharov-dopolnitelno-napravlyat-98-desantnikov-pozharnykh/'],
 ['ЗАДЫМЛЕНИЕ','17 августа 2026','МЧС напомнило, как вести себя при сильном дыме','При сильном задымлении МЧС ЯНАО рекомендовало ограничить пребывание на улице и следить за официальными сообщениями. Дым — повод уйти из опасной зоны, а не искать источник самостоятельно.','https://89.mchs.gov.ru/deyatelnost/press-centr/novosti/5811615'],
 ['РОССИЯ','июль 2026','Оперативные сводки по лесным пожарам обновляются ежедневно','Рослесхоз показывает, как быстро меняется лесопожарная обстановка по регионам. Поэтому безопасный план нельзя строить только на прошлом опыте.','https://rosleshoz.gov.ru/activity/forest-security-and-protection/fires/operative-information/?PAGEN_25=6']
];

function injectNews(){
 const home=document.getElementById('view-home');if(!home||home.querySelector('.news-section'))return;
 const sec=document.createElement('section');sec.className='section news-section';
 sec.innerHTML='<div class="section-head"><div><div class="eyebrow">Лента безопасности</div><h2>Что происходит<br>в лесах сейчас</h2></div><p class="section-note">Короткие карточки по сообщениям МЧС России и Рослесхоза. В каждой — факт, контекст и практический вывод.</p></div>';
 const grid=document.createElement('div');grid.className='news-grid';
 newsData.forEach((n,i)=>{const card=document.createElement('article');card.className='news-card'+(i===0?' featured':'');const top=document.createElement('div');top.className='news-top';const tag=document.createElement('span');tag.textContent=n[0];const date=document.createElement('time');date.textContent=n[1];top.append(tag,date);const h=document.createElement('h3');h.textContent=n[2];const p=document.createElement('p');p.textContent=n[3];const a=document.createElement('a');a.target='_blank';a.rel='noopener noreferrer';a.href=n[4];a.textContent='Источник →';card.append(top,h,p,a);grid.append(card)});
 sec.append(grid);const principle=document.createElement('div');principle.className='news-principle';principle.innerHTML='<div class="principle-card"><span class="eyebrow">Формула «ЭкоКода»</span><h3>Факт → смысл → действие</h3><p>Сначала первичный источник, затем понятное объяснение и вывод, который можно применить в реальной поездке.</p></div>';sec.append(principle);home.append(sec);
}
injectNews();
