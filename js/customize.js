/* assets/js/customize.js */
(function(){
  // Helper functions
  function $(id) {
    return document.getElementById(id);
  }
  
  function qs(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }
  
  function fmt(num) {
    if (!num) return '$0.00';
    return '$' + parseFloat(num).toFixed(2);
  }
  
  // Sample menu data (replace with your actual data)
  const MENU = {
    wok: [
      { id: '1', name: 'Chicken Fried Rice', price: 4.50 },
      { id: '2', name: 'Beef Noodles', price: 5.00 }
    ]
  };
  
  const KEYS = {
    selectedStall: 'selectedStall'
  };
  
  const store = {
    get: function(key, defaultValue = null) {
      const value = localStorage.getItem(key);
      if (value === null) return defaultValue;
      try {
        return JSON.parse(value);
      } catch(e) {
        return value;
      }
    }
  };
  
  function addToCart(item) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Get item details from URL or storage
  const stallId = qs('stall') || store.get(KEYS.selectedStall);
  const itemId = qs('item');
  const item = (MENU[stallId] || []).find(i => i.id === itemId) || (MENU[stallId] || [])[0];

  if (!item) {
    alert('No item selected. Redirecting to menu...');
    location.href = 'menu.html?stall=' + stallId;
    return;
  }

  // Set item details
  const itemNameEl = $('itemName');
  const itemPriceEl = $('itemPrice');
  const totalPriceEl = $('totalprice');
  const qtyEl = $('qty');
  const notesEl = $('notes');

  if (itemNameEl) itemNameEl.value = item.name;
  if (itemPriceEl) itemPriceEl.value = fmt(item.price);

  // Update total price function
  function updateTotalPrice() {
    const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
    const total = item.price * qty;
    if (totalPriceEl) {
      totalPriceEl.value = fmt(total);
    }
  }

  // Initial total price
  updateTotalPrice();

  // Update on quantity change
  if (qtyEl) {
    qtyEl.addEventListener('change', updateTotalPrice);
    qtyEl.addEventListener('input', updateTotalPrice);
  }

  // Form submission
  const form = $('cf');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
      const customizations = [];
      
      // Get spice level
      const spiceLevel = $('spiceLevel').value;
      if (spiceLevel !== 'normal') {
        const spiceText = {
          'mild': 'Less Spicy',
          'extra': 'Extra Spicy',
          'none': 'No Spice'
        };
        customizations.push(spiceText[spiceLevel]);
      }
      
      // Get special notes
      if (notesEl && notesEl.value.trim()) {
        customizations.push(notesEl.value.trim());
      }
      
      const notes = customizations.length > 0 
        ? customizations.join('; ') 
        : '';
      
      addToCart({
        stallId,
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty,
        notes
      });
    // Show success message 
    showToast(`✓ Added ${qty}x ${item.name} to cart!`);
    
    //Redirect after a short delay
    setTimeout(() => {
      location.href = 'order.html';
    }, 1500);
  });
  }
})();