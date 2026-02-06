/* assets/js/saved-orders.js */
(function(){
  const root = $('#list');
  function render(){
    const saved = store.get(KEYS.savedOrders,[]);
    if(saved.length===0){ root.innerHTML='<p>No saved orders yet.</p>'; return; }
    root.innerHTML = saved.map(s=>`
      <div class="card">
        <h3>${s.name} <small class="muted">(${new Date(s.createdAt).toLocaleString()})</small></h3>
        <p>${s.items.length} items</p>
        <div class="row">
          <button class="btn" data-load="${s.id}">Load into Cart</button>
          <button class="btn danger" data-del="${s.id}">Delete</button>
        </div>
      </div>`).join('');
  }
  root.addEventListener('click', e=>{
    const saved = store.get(KEYS.savedOrders,[]);
    if(e.target.matches('button[data-load]')){
      const id=e.target.dataset.load; const s=saved.find(x=>x.id===id);
      setCart(s.items); location.href='order.html';
    }
    if(e.target.matches('button[data-del]')){
      const id=e.target.dataset.del; const next=saved.filter(x=>x.id!==id);
      store.set(KEYS.savedOrders,next); render();
    }
  });
  render();
})();