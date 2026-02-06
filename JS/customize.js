/* assets/js/customize.js */
(function(){
  const stallId = qs('stall') || store.get(KEYS.selectedStall);
  const itemId  = qs('item');
  const stallMenu = MENU[stallId] || [];
  const item = (MENU[stallId]||[]).find(i=>i.id===itemId) || (MENU[stallId]||[])[0];

  if (!item) {
    alert('No item selected. Redirecting to menu...');
    location.href = 'menu.html?stall=' + stallId;
    return;
  }

  $('#itemName').value = item.name + ` (${fmt(item.price)})`;

  function updateTotalPrice() {
    const qty = Math.max(1, parseInt($('#qty').value || '1', 10));
    const total = item.price * qty;
    $('#totalPrice').value = fmt(total);
  }

  function updateTotalPrice() {
    const qty = Math.max(1, parseInt($('#qty').value || '1', 10));
    const total = item.price * qty;
    $('#totalPrice').value = fmt(total);
  }

  updateTotalPrice();

  $('#cf').addEventListener('submit', e=>{
    e.preventDefault();
    const qty = Math.max(1, parseInt($('#qty').value||'1',10));
    const customizations = [];
    const spiceLevel = $('#spiceLevel').value;
    if (spiceLevel !== 'normal') {
      const spiceText = {
        'mild': 'Less Spicy',
        'extra': 'Extra Spicy',
        'none': 'No Spice'
      };
      customizations.push(spiceText[spiceLevel]);
    }
    const checkboxes = [
      $('#noOnions'),
      $('#noPeanuts'),
      $('#extraSauce'),
      $('#lessOil')
    ];

    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        customizations.push(checkbox.value);
      }
    });

       const specialNotes = notesField.value.trim();
    if (specialNotes) {
      customizations.push(specialNotes);
    }
    
    const notes = customizations.length > 0 
      ? customizations.join('; ') 
      : '';
    
    addToCart({ 
      stallId, 
      itemId:item.id, 
      name:item.name, 
      price:item.price, 
      qty, 
      notes });

      alert(`✓ Added ${qty}x ${item.name} to cart!`);
      
    location.href='order.html';
  });
})();