'use strict';

const printTeacher=()=>window.print();
const printButton=document.getElementById('printTeacher');
if(printButton)printButton.addEventListener('click',printTeacher);

const feedbackLink=document.getElementById('teacherFeedbackLink');
if(feedbackLink)feedbackLink.addEventListener('click',event=>{
  event.preventDefault();
  window.alert('Ссылка на форму обратной связи ещё не добавлена. Вставьте URL вашей Яндекс Формы или Google Формы в этот блок.');
});
