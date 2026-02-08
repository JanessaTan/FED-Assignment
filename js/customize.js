/* assets/js/customize.js */

// FUNCTION TO HANDLE CUSTOMIZE BUTTON CLICKS
function handleCustomizeClick(cartIndex) {
  console.log('Customize button clicked for cart index:', cartIndex);
  localStorage.setItem('editingCartIndex', JSON.stringify(cartIndex));
  window.location.href = 'customize.html';
}
window.handleCustomizeClick = handleCustomizeClick;

(function(){
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
  
  const MENU = {
    wok: [
      { id: '1', name: 'Chicken Fried Rice', price: 4.50 },
      { id: '2', name: 'Beef Noodles', price: 5.00 }
    ]
  };
  
  const KEYS = {
    selectedStall: 'selectedStall'
  };
  
  function getStore() {
    return JSON.parse(localStorage.getItem('store')) || { cart: [], order: { type: 'now' } };
  }
  
  function saveStore(store) {
    localStorage.setItem('store', JSON.stringify(store));
  }
  
  function addToCart(item) {
    const store = getStore();
    store.cart = store.cart || [];
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

  const editingIndexStr = localStorage.getItem('editingCartIndex');
  let editingIndex = null;
  
  if (editingIndexStr !== null && editingIndexStr !== '') {
    try {
      editingIndex = JSON.parse(editingIndexStr);
    } catch(e) {
      editingIndex = null;
    }
  }
  
  const isEditMode = editingIndex !== null && editingIndex !== '';
  
  let item, stallId, itemId;
  
  if (isEditMode) {
    console.log('Edit mode: Loading cart item at index', editingIndex);
    const store = getStore();
    const cart = store.cart || [];
    const cartItem = cart[editingIndex];
    
    if (!cartItem) {
      alert('Cart item not found. Redirecting to checkout...');
      localStorage.removeItem('editingCartIndex');
      location.href = 'Checkout.html';
      return;
    }
    
    item = {
      id: cartItem.itemId || cartItem.id,
      name: cartItem.name,
      price: cartItem.price
    };
    stallId = cartItem.stallId || cartItem.stall;
    itemId = cartItem.itemId || cartItem.id;
    
    console.log('Editing cart item:', cartItem);
  } else {
    stallId = qs('stall') || localStorage.getItem(KEYS.selectedStall);
    itemId = qs('item');
    item = (MENU[stallId] || []).find(i => i.id === itemId) || (MENU[stallId] || [])[0];

    if (!item) {
      alert('No item selected. Redirecting to menu...');
      location.href = 'Menu.html?stall=' + stallId;
      return;
    }
  }

  const itemNameEl = $('itemName');
  const itemPriceEl = $('itemPrice');
  const totalPriceEl = $('totalprice');
  const qtyEl = $('qty');
  const notesEl = $('notes');
  const spiceLevelEl = $('spiceLevel');

  if (itemNameEl) itemNameEl.value = item.name;
  if (itemPriceEl) itemPriceEl.value = fmt(item.price);

  if (isEditMode) {
    const store = getStore();
    const cart = store.cart || [];
    const cartItem = cart[editingIndex];
    
    if (qtyEl) qtyEl.value = cartItem.qty || 1;
    
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
    
    const form = $('cf');
    if (form) {
      const banner = document.createElement('div');
      banner.id = 'editModeBanner';
      banner.style.cssText = 'background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center; color: #000;';
      banner.innerHTML = '<strong>✏️ Editing Order:</strong> Update your customization below';
      form.insertBefore(banner, form.firstChild);
    }
  }

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

  const form = $('cf');
  if (form && isEditMode) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Save Changes';
    }
    
    const buttonGroup = form.querySelector('.button-group');
    if (buttonGroup && !buttonGroup.querySelector('.cancel-edit-btn')) {
      const cancelBtn = document.createElement('a');
      cancelBtn.className = 'btn secondary cancel-edit-btn';
      cancelBtn.href = '#';
      cancelBtn.textContent = 'Cancel';
      cancelBtn.style.cssText = 'background: #666; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px;';
      cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('editingCartIndex');
        location.href = 'Checkout.html';
      });
      buttonGroup.insertBefore(cancelBtn, buttonGroup.lastElementChild);
    }
  }

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
      const customizations = [];
      
      const spiceLevel = spiceLevelEl ? spiceLevelEl.value : 'normal';
      if (spiceLevel !== 'normal') {
        const spiceText = {
          'mild': 'Less Spicy',
          'extra': 'Extra Spicy',
          'none': 'No Spice'
        };
        customizations.push(spiceText[spiceLevel]);
      }
      
      if (notesEl && notesEl.value.trim()) {
        customizations.push(notesEl.value.trim());
      }
      
      const notes = customizations.length > 0 
        ? customizations.join('; ') 
        : '';
      
      const orderItem = {
        stallId: stallId,
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty: qty,
        notes: notes
      };
      
      if (isEditMode) {
        updateCartItem(editingIndex, orderItem);
        localStorage.removeItem('editingCartIndex');
        alert(`✓ Updated ${qty}x ${item.name}!`);
        location.href = 'Checkout.html';
      } else {
        addToCart(orderItem);
        alert(`✓ Added ${qty}x ${item.name} to cart!`);
        location.href = 'Checkout.html';
      }
    });
  }
})();