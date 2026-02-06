/* assets/js/promotions.js */
(function(){
  const root = $('#promoList');
  PROMOTIONS.forEach(p=>{
    const el=document.createElement('div');
    el.className='card';
    el.innerHTML=`<h3>${p.title}</h3>
      <p class="muted">${p.type==='order'?'Order-wide':p.type==='stall'?'Specific stall':'Bundle deal'}</p>
      <button class="btn" data-pick="${p.id}">Select</button>`;
    root.appendChild(el);
  });
  root.addEventListener('click', e=>{
    if(e.target.matches('button[data-pick]')){
      pickPromo(e.target.dataset.pick);
      alert('Promotion selected. It will be auto-applied at Checkout.');
    }
  });
})();