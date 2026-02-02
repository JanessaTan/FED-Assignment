/* assets/js/menu.js */
(function(){
  const stallId = qs('stall') || STALLS[0].id;
  store.set(KEYS.selectedStall, stallId);
  const stall = STALLS.find(s=>s.id===stallId);
  $('#stallName').textContent = `Menu – ${stall.name}`;

  const items = MENU[stallId]||[];
  const parent = $('#menuList');
  items.forEach(m=>{
    const el = document.createElement('div');
    el.className='card';
    el.innerHTML = `
      <h3>${m.name}</h3>
      <p class="muted">${fmt(m.price)}</p>
      <div class="row">
        <a class="btn" href="customize.html?stall=${stallId}&item=${m.id}">Customize</a>
        <button class="btn secondary" data-add="${m.id}">Add</button>
      </div>`;
    parent.appendChild(el);
  });

  parent.addEventListener('click', e=>{
    if(e.target.matches('button[data-add]')){
      const mid = e.target.dataset.add;
      const item = items.find(i=>i.id===mid);
      addToCart({ stallId, itemId:item.id, name:item.name, price:item.price, qty:1, notes:'' });
      e.target.textContent='Added!';
      setTimeout(()=>e.target.textContent='Add',900);
    }
  });
})();