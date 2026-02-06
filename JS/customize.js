/* assets/js/customize.js */
(function(){
  const stallId = qs('stall') || store.get(KEYS.selectedStall);
  const itemId  = qs('item');
  const item = (MENU[stallId]||[]).find(i=>i.id===itemId) || (MENU[stallId]||[])[0];

  $('#itemName').value = item.name + ` (${fmt(item.price)})`;

  $('#cf').addEventListener('submit', e=>{
    e.preventDefault();
    const qty = Math.max(1, parseInt($('#qty').value||'1',10));
    const notes = $('#notes').value.trim();
    addToCart({ stallId, itemId:item.id, name:item.name, price:item.price, qty, notes });
    location.href='order.html';
  });
})();