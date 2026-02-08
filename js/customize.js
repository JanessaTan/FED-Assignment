/* customize.js - ZERO DEPENDENCY VERSION */

// ==========================================
// MENU DATA - EDIT YOUR ITEMS HERE
// ==========================================
const MENU_DATA = {
  wok: [
    { id: '1', name: 'Chicken Fried Rice', price: 4.50 },
    { id: '2', name: 'Beef Noodles', price: 5.00 },
    { id: '3', name: 'Vegetable Chow Mein', price: 4.00 },
    { id: '4', name: 'Sweet and Sour Pork', price: 5.50 },
    { id: '5', name: 'Kung Pao Chicken', price: 5.20 }
  ],
  noodles: [
    { id: '1', name: 'Laksa', price: 5.50 },
    { id: '2', name: 'Char Kway Teow', price: 5.00 },
    { id: '3', name: 'Hokkien Mee', price: 4.50 },
    { id: '4', name: 'Wonton Noodles', price: 4.80 }
  ],
  rice: [
    { id: '1', name: 'Chicken Rice', price: 4.00 },
    { id: '2', name: 'Nasi Lemak', price: 4.50 },
    { id: '3', name: 'Claypot Rice', price: 5.50 }
  ],
  drinks: [
    { id: '1', name: 'Iced Tea', price: 2.00 },
    { id: '2', name: 'Soft Drink', price: 2.50 },
    { id: '3', name: 'Fresh Juice', price: 3.00 },
    { id: '4', name: 'Coffee', price: 2.20 }
  ],
  desserts: [
    { id: '1', name: 'Ice Kacang', price: 3.00 },
    { id: '2', name: 'Chendol', price: 3.20 },
    { id: '3', name: 'Mango Sticky Rice', price: 3.50 }
  ]
};

// ==========================================
// HANDLE CUSTOMIZE FROM CHECKOUT
// ==========================================
function handleCustomizeClick(cartIndex) {
  try {
    localStorage.setItem('editingCartIndex', cartIndex);
    localStorage.setItem('customizeMode', 'edit');
  } catch(e) {
    console.error('Cannot save to localStorage');
  }
  window.location.href = 'customize.html';
}
window.handleCustomizeClick = handleCustomizeClick;

// ==========================================
// MAIN CUSTOMIZE LOGIC
// ==========================================
(function(){
  
  // Helper functions
  function $(id) { return document.getElementById(id); }
  function fmt(num) { return '$' + parseFloat(num || 0).toFixed(2); }
  
  function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  function getStore() {
    try {
      return JSON.parse(localStorage.getItem('store')) || { cart: [], order: { type: 'now' } };
    } catch(e) {
      return { cart: [], order: { type: 'now' } };
    }
  }
  
  function saveStore(store) {
    try {
      localStorage.setItem('store', JSON.stringify(store));
    } catch(e) {
      console.error('Cannot save to localStorage');
    }
  }
  
  function addToCart(item) {
    const store = getStore();
    store.cart.push(item);
    saveStore(store);
  }
  
  function updateCartItem(index, item) {
    const store = getStore();
    if (index >= 0 && index < store.cart.length) {
      store.cart[index] = item;
      saveStore(store);
    }
  }

  // ==========================================
  // DETERMINE MODE & GET ITEM
  // ==========================================
  
  let isEditMode = false;
  let editingIndex = null;
  let item = null;
  let stallId = 'wok'; // default stall

  // Check if editing from cart
  try {
    const editIndexStr = localStorage.getItem('editingCartIndex');
    const mode = localStorage.getItem('customizeMode');
    
    if (mode === 'edit' && editIndexStr !== null && editIndexStr !== '') {
      isEditMode = true;
      editingIndex = parseInt(editIndexStr, 10);
      console.log('Edit mode - cart index:', editingIndex);
    }
  } catch(e) {
    // localStorage not available, continue in add mode
  }

  if (isEditMode) {
    // EDIT MODE - Load from cart
    const store = getStore();
    const cartItem = store.cart[editingIndex];
    
    if (cartItem) {
      item = {
        id: cartItem.itemId || cartItem.id,
        name: cartItem.name,
        price: cartItem.price
      };
      stallId = cartItem.stallId || 'wok';
      console.log('Editing item:', item.name);
    } else {
      console.warn('Cart item not found, switching to add mode');
      isEditMode = false;
    }
  }

  if (!item) {
    // ADD MODE - Get from URL or localStorage or use default
    
    // Try URL parameters first
    stallId = getUrlParam('stall');
    let itemId = getUrlParam('item');
    
    console.log('URL params - stall:', stallId, 'item:', itemId);
    
    // Try localStorage if no URL params
    if (!stallId || !itemId) {
      try {
        const storedStall = localStorage.getItem('selectedStall');
        const storedItemId = localStorage.getItem('selectedItemId');
        
        if (storedStall) stallId = storedStall;
        
        if (storedItemId) {
          // Parse "wok_1" format
          const parts = storedItemId.split('_');
          if (parts.length === 2) {
            stallId = parts[0];
            itemId = parts[1];
          } else {
            itemId = storedItemId;
          }
        }
        
        console.log('localStorage - stall:', stallId, 'item:', itemId);
      } catch(e) {
        // localStorage not available
      }
    }

    // Default to wok if still no stall
    if (!stallId || !MENU_DATA[stallId]) {
      stallId = 'wok';
    }
    
    // Find item in menu data
    if (MENU_DATA[stallId]) {
      const items = MENU_DATA[stallId];
      
      if (itemId) {
        // Try to find specific item
        item = items.find(i => i.id === itemId);
        console.log('Looking for item ID', itemId, '- Found:', item ? item.name : 'not found');
      }
      
      // If not found or no itemId specified, use first item
      if (!item && items.length > 0) {
        item = items[0];
        console.log('Using default item:', item.name);
      }
    }
    
    // Last resort: use first item from any stall
    if (!item) {
      for (const sid in MENU_DATA) {
        if (MENU_DATA[sid].length > 0) {
          item = MENU_DATA[sid][0];
          stallId = sid;
          console.log('Using fallback item:', item.name, 'from', sid);
          break;
        }
      }
    }
  }

  // If STILL no item (shouldn't happen with built-in data)
  if (!item) {
    alert('Error: No menu items available. Please contact support.');
    console.error('CRITICAL: No items found in MENU_DATA');
    return;
  }

  console.log('Final item:', item.name, 'from stall:', stallId);

  // ==========================================
  // POPULATE FORM
  // ==========================================
  
  const itemNameEl = $('itemName');
  const itemPriceEl = $('itemPrice');
  const totalPriceEl = $('totalprice');
  const qtyEl = $('qty');
  const notesEl = $('notes');
  const spiceLevelEl = $('spiceLevel');

  if (!itemNameEl || !qtyEl) {
    console.error('Form elements not found! Check HTML has id="itemName" and id="qty"');
    alert('Form error. Please refresh the page.');
    return;
  }

  // Set item details
  itemNameEl.value = item.name;
  if (itemPriceEl) itemPriceEl.value = fmt(item.price);

  // Load existing customization if editing
  if (isEditMode) {
    const store = getStore();
    const cartItem = store.cart[editingIndex];
    
    if (cartItem) {
      // Set quantity
      if (qtyEl) qtyEl.value = cartItem.qty || 1;
      
      // Parse and restore customization
      if (cartItem.notes) {
        const noteParts = cartItem.notes.split('; ');
        let specialNotes = [];
        
        noteParts.forEach(part => {
          if (part === 'Less Spicy') {
            if (spiceLevelEl) spiceLevelEl.value = 'mild';
          } else if (part === 'Extra Spicy') {
            if (spiceLevelEl) spiceLevelEl.value = 'extra';
          } else if (part === 'No Spice') {
            if (spiceLevelEl) spiceLevelEl.value = 'none';
          } else {
            specialNotes.push(part);
          }
        });
        
        if (notesEl && specialNotes.length > 0) {
          notesEl.value = specialNotes.join('; ');
        }
      }
      
      // Add edit mode banner
      const form = $('cf');
      if (form && !document.getElementById('editModeBanner')) {
        const banner = document.createElement('div');
        banner.id = 'editModeBanner';
        banner.style.cssText = 'background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center; color: #000; font-weight: bold;';
        banner.textContent = '✏️ Editing Order';
        form.insertBefore(banner, form.firstChild);
        
        // Update button text
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Save Changes';
      }
    }
  } else {
    // Add mode - default quantity
    if (qtyEl) qtyEl.value = 1;
  }

  // ==========================================
  // UPDATE TOTAL PRICE
  // ==========================================
  
  function updateTotalPrice() {
    const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
    const total = item.price * qty;
    if (totalPriceEl) {
      totalPriceEl.value = fmt(total);
    }
  }

  updateTotalPrice();
  
  if (qtyEl) {
    qtyEl.addEventListener('change', updateTotalPrice);
    qtyEl.addEventListener('input', updateTotalPrice);
  }

  // ==========================================
  // FORM SUBMISSION
  // ==========================================
  
  const form = $('cf');
  if (!form) {
    console.error('Form not found! Check HTML has id="cf"');
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
    const customizations = [];
    
    // Get spice level
    if (spiceLevelEl) {
      const spiceLevel = spiceLevelEl.value;
      if (spiceLevel !== 'normal') {
        const spiceText = {
          'mild': 'Less Spicy',
          'extra': 'Extra Spicy',
          'none': 'No Spice'
        };
        customizations.push(spiceText[spiceLevel]);
      }
    }
    
    // Get special notes
    if (notesEl && notesEl.value.trim()) {
      customizations.push(notesEl.value.trim());
    }
    
    const notes = customizations.join('; ');
    
    // Create order item
    const orderItem = {
      stallId: stallId,
      itemId: item.id,
      name: item.name,
      price: item.price,
      qty: qty,
      notes: notes
    };
    
    console.log('Order item:', orderItem);
    
    if (isEditMode) {
      // Update existing cart item
      updateCartItem(editingIndex, orderItem);
      
      try {
        localStorage.removeItem('editingCartIndex');
        localStorage.removeItem('customizeMode');
      } catch(e) {}
      
      alert(`✅ Updated ${qty}x ${item.name}!`);
      window.location.href = 'Checkout.html';
    } else {
      // Add new item to cart
      addToCart(orderItem);
      
      try {
        localStorage.removeItem('selectedItemId');
        localStorage.removeItem('customizeMode');
      } catch(e) {}
      
      alert(`✅ Added ${qty}x ${item.name} to cart!`);
      window.location.href = 'Checkout.html';
    }
  });

  console.log('✅ Customize page ready!');

})();