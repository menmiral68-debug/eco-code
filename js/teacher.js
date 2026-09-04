'use strict';
const printTeacher=()=>window.print();
const printButton=document.getElementById('printTeacher');
if(printButton)printButton.addEventListener('click',printTeacher);
const feedbackLink=document.getElementById('teacherFeedbackLink');
if(feedbackLink){feedbackLink.href='https://forms.yandex.ru/u/6a9998a7eb61464b2bcfaf7f';feedbackLink.target='_blank';feedbackLink.rel='noopener noreferrer';feedbackLink.textContent='Открыть форму обратной связи →';feedbackLink.classList.remove('secondary');feedbackLink.classList.add('primary');feedbackLink.removeAttribute('aria-disabled');}
