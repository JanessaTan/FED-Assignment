/* assets/js/customize.js - SIMPLIFIED VERSION (NO URL PARAMETERS) */

// FUNCTION TO HANDLE CUSTOMIZE BUTTON CLICKS FROM CHECKOUT
function handleCustomizeClick(cartIndex) {
  console.log('Customize button clicked for cart index:', cartIndex);
  localStorage.setItem('editingCartIndex', cartIndex);
  localStorage.setItem('customizeMode', 'edit');
  window.location.href = 'customize.html';
}
window.handleCustomizeClick = handleCustomizeClick;

(function(){
  console.log('=== Customize Page Loaded ===');
  
  function $(id) {
    return document.getElementById(id);
  }
  
  function fmt(num) {
    if (!num) return '$0.00';
    return '$' + parseFloat(num).toFixed(2);
  }
  
  // Get store data
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

  // Get the menu from localStorage
  const menuData = localStorage.getItem('hawkerMenu');
  if (!menuData) {
    alert('Menu data not found. Please go back to the menu page first.');
    window.location.href = 'Menu.html';
    return;
  }

  const MENU = JSON.parse(menuData);
  console.log('Loaded menu data:', MENU);

  // Determine if we're in edit mode or add mode
  const customizeMode = localStorage.getItem('customizeMode') || 'add';
  const isEditMode = (customizeMode === 'edit');
  
  console.log('Customize mode:', customizeMode);

  let item = null;
  let editingIndex = null;

  // EDIT MODE - Loading existing cart item
  if (isEditMode) {
    const editingIndexStr = localStorage.getItem('editingCartIndex');
    
    if (editingIndexStr === null || editingIndexStr === '') {
      alert('No item to edit. Redirecting to checkout...');
      window.location.href = 'Checkout.html';
      return;
    }

    try {
      editingIndex = parseInt(editingIndexStr, 10);
    } catch(e) {
      alert('Invalid edit index. Redirecting to checkout...');
      window.location.href = 'Checkout.html';
      return;
    }

    const store = getStore();
    const cart = store.cart || [];
    const cartItem = cart[editingIndex];
    
    if (!cartItem) {
      alert('Cart item not found. Redirecting to checkout...');
      localStorage.removeItem('editingCartIndex');
      window.location.href = 'Checkout.html';
      return;
    }

    // Use the cart item data
    item = {
      id: cartItem.itemId || cartItem.id,
      name: cartItem.name,
      price: cartItem.price,
      stallId: cartItem.stallId
    };
    
    console.log('Editing cart item:', cartItem);
  } 
  // ADD MODE - Adding new item from menu
  else {
    const selectedItemId = localStorage.getItem('selectedItemId');
    
    if (!selectedItemId) {
      alert('No item selected. Please select an item from the menu.');
      window.location.href = 'Menu.html';
      return;
    }

    console.log('Looking for item ID:', selectedItemId);

    // Search through all stalls to find the item
    let foundItem = null;
    let foundStallId = null;

    for (const stallId in MENU) {
      const stall = MENU[stallId];
      if (stall.items) {
        const matchingItem = stall.items.find(i => i.id === selectedItemId);
        if (matchingItem) {
          foundItem = matchingItem;
          foundStallId = stallId;
          break;
        }
      }
    }

    if (!foundItem) {
      console.error('Item not found with ID:', selectedItemId);
      alert('Item not found. Please select an item from the menu.');
      window.location.href = 'Menu.html';
      return;
    }

    item = {
      id: foundItem.id,
      name: foundItem.name,
      price: foundItem.price,
      stallId: foundStallId
    };

    console.log('Found item:', item);
  }

  // Now we have the item - populate the form
  const itemNameEl = $('itemName');
  const itemPriceEl = $('itemPrice');
  const totalPriceEl = $('totalprice');
  const qtyEl = $('qty');
  const notesEl = $('notes');
  const spiceLevelEl = $('spiceLevel');

  if (itemNameEl) itemNameEl.value = item.name;
  if (itemPriceEl) itemPriceEl.value = fmt(item.price);

  // If editing, load the existing customization
  if (isEditMode) {
    const store = getStore();
    const cart = store.cart || [];
    const cartItem = cart[editingIndex];
    
    if (qtyEl) qtyEl.value = cartItem.qty || 1;
    
    // Parse notes to restore customization
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
    if (form) {
      const existingBanner = document.getElementById('editModeBanner');
      if (!existingBanner) {
        const banner = document.createElement('div');
        banner.id = 'editModeBanner';
        banner.style.cssText = 'background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center; color: #000;';
        banner.innerHTML = '<strong>✏️ Editing Order:</strong> Update your customization below';
        form.insertBefore(banner, form.firstChild);
      }
    }
  } else {
    // Add mode - default quantity is 1
    if (qtyEl) qtyEl.value = 1;
  }

  // Update total price function
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

  // Update form buttons for edit mode
  const form = $('cf');
  if (form && isEditMode) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Save Changes';
    }
    
    // Add cancel button
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
        localStorage.removeItem('customizeMode');
        window.location.href = 'Checkout.html';
      });
      buttonGroup.insertBefore(cancelBtn, buttonGroup.lastElementChild);
    }
  }

  // Handle form submission
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
      const customizations = [];
      
      // Get spice level
      const spiceLevel = spiceLevelEl ? spiceLevelEl.value : 'normal';
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
      
      const notes = customizations.length > 0 ? customizations.join('; ') : '';
      
      // Create order item
      const orderItem = {
        stallId: item.stallId,
        itemId: item.id,
        name: item.name,
        price: item.price,
        qty: qty,
        notes: notes
      };
      
      if (isEditMode) {
        // Update existing cart item
        updateCartItem(editingIndex, orderItem);
        localStorage.removeItem('editingCartIndex');
        localStorage.removeItem('customizeMode');
        alert(`✓ Updated ${qty}x ${item.name}!`);
        window.location.href = 'Checkout.html';
      } else {
        // Add new item to cart
        addToCart(orderItem);
        localStorage.removeItem('selectedItemId');
        localStorage.removeItem('customizeMode');
        alert(`✓ Added ${qty}x ${item.name} to cart!`);
        window.location.href = 'Checkout.html';
      }
    });
  }

  console.log('=== Customize Page Initialized Successfully ===');

})();