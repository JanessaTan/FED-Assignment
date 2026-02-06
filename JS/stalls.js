/* assets/js/stalls.js */
(function(){
  const centresEl = $('#centres'), stallsEl = $('#stallList');

  HAWKER_CENTRES.forEach(c=>{
    const card = document.createElement('div');
    card.className='card';
    card.innerHTML = `<h3>${c.name}</h3><p>${c.address}</p>
      <button class="btn" data-center="${c.id}">Select</button>`;
    centresEl.appendChild(card);
  });

  centresEl.addEventListener('click', e=>{
    if(e.target.matches('button[data-center]')){
      store.set(KEYS.selectedCenter, e.target.dataset.center);
      loadStalls(); // Show same stall list per requirement
    }
  });

  function loadStalls(){
    stallsEl.innerHTML='';
    STALLS.forEach(s=>{
      const card=document.createElement('div');
      card.className='card';
      card.innerHTML=`
        <h3>${s.name}</h3>
        <p>${s.cuisine} • ${s.hours} • ⭐ ${s.rating}</p>
        <div class="row">
          <a class="btn" href="menu.html?stall=${s.id}">View Menu</a>
          <a class="btn muted" href="rating.html?stall=${s.id}">Ratings</a>
          <a class="btn secondary" href="hygiene.html?stall=${s.id}">Hygiene</a>
        </div>`;
      stallsEl.appendChild(card);
    });
  }

  // Initial render (no centre yet still shows same list after user clicks any)
  if(store.get(KEYS.selectedCenter)) loadStalls();
})();