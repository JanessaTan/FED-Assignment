/* Student ID - S10275480F 
Student Name -Nicole Agnes Sim Hui En */

// Customize Order Page - Lets customers add items to cart and adjust quantities, spice levels, and special requests

//  Menu Data- All The Items Available At Each Stall Menu Data
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

// When customer clicks "Customize" on an item already in their cart, save which item they're editing
function handleCustomizeClick(cartIndex) {
  try {
    localStorage.setItem('editingCartIndex', cartIndex);
    localStorage.setItem('customizeMode', 'edit');
  } catch(e) {
    console.error('Cannot save to localStorage');
  }
  window.location.href = 'customize.html';
}
// Make this function available globally so HTML buttons can call it
window.handleCustomizeClick = handleCustomizeClick;

// MAIN CUSTOMIZE PAGE LOGIC
(function(){
  
  // Helper function to get an element by ID (shorthand)
  function $(id) { return document.getElementById(id); }
  
  // Helper function to format numbers as currency (e.g., 5.5 becomes "$5.50")
  function fmt(num) { return '$' + parseFloat(num || 0).toFixed(2); }
  
  // Helper to get URL parameters (e.g., ?stall=wok&item=1)
  function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Get the cart data from browser storage
  function getStore() {
    try {
      return JSON.parse(localStorage.getItem('store')) || { cart: [], order: { type: 'now' } };
    } catch(e) {
      return { cart: [], order: { type: 'now' } };
    }
  }
  
  // Save the cart data back to browser storage
  function saveStore(store) {
    try {
      localStorage.setItem('store', JSON.stringify(store));
    } catch(e) {
      console.error('Cannot save to localStorage');
    }
  }
  
  // Add a new item to the cart
  function addToCart(item) {
    const store = getStore();
    store.cart.push(item);
    saveStore(store);
  }
  
  // Update an existing item in the cart (for editing)
  function updateCartItem(index, item) {
    const store = getStore();
    if (index >= 0 && index < store.cart.length) {
      store.cart[index] = item;
      saveStore(store);
    }
  }

  // ===== DETERMINE IF WE'RE ADDING A NEW ITEM OR EDITING AN EXISTING ONE =====
  
  let isEditMode = false;
  let editingIndex = null;
  let item = null;
  let stallId = 'wok'; // default stall if none specified

  // Check if we're in "edit mode" (customer is modifying something already in cart)
  try {
    const editIndexStr = localStorage.getItem('editingCartIndex');
    const mode = localStorage.getItem('customizeMode');
    
    if (mode === 'edit' && editIndexStr !== null && editIndexStr !== '') {
      isEditMode = true;
      editingIndex = parseInt(editIndexStr, 10);
      console.log('Edit mode - cart index:', editingIndex);
    }
  } catch(e) {
    // localStorage not available, continue in "add new" mode
  }

  // If editing, load the item from the cart
  if (isEditMode) {
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

  // If NOT editing (adding new item), figure out which stall and item to show
  if (!item) {
    // Try URL parameters first (e.g., ?stall=wok&item=1)
    stallId = getUrlParam('stall');
    let itemId = getUrlParam('item');
    
    console.log('URL params - stall:', stallId, 'item:', itemId);
    
    // If no URL params, try to get from browser storage
    if (!stallId || !itemId) {
      try {
        const storedStall = localStorage.getItem('selectedStall');
        const storedItemId = localStorage.getItem('selectedItemId');
        
        if (storedStall) stallId = storedStall;
        
        if (storedItemId) {
          // Parse "wok_1" format (stall_itemId)
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

    // If still no stall, default to wok
    if (!stallId || !MENU_DATA[stallId]) {
      stallId = 'wok';
    }
    
    // Find the specific item in the menu
    if (MENU_DATA[stallId]) {
      const items = MENU_DATA[stallId];
      
      if (itemId) {
        // Try to find item with the given ID
        item = items.find(i => i.id === itemId);
        console.log('Looking for item ID', itemId, '- Found:', item ? item.name : 'not found');
      }
      
      // If item not found or no ID specified, use the first item as default
      if (!item && items.length > 0) {
        item = items[0];
        console.log('Using default item:', item.name);
      }
    }
    
    // Last resort: grab the first item from any stall that has items
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

  // Safety check - if STILL no item, something went wrong
  if (!item) {
    alert('Error: No menu items available. Please contact support.');
    console.error('CRITICAL: No items found in MENU_DATA');
    return;
  }

  console.log('Final item:', item.name, 'from stall:', stallId);

  // ===== FILL IN THE FORM WITH ITEM DETAILS =====
  
  const itemNameEl = $('itemName');
  const itemPriceEl = $('itemPrice');
  const totalPriceEl = $('totalprice');
  const qtyEl = $('qty');
  const notesEl = $('notes');
  const spiceLevelEl = $('spiceLevel');

  // Make sure all form fields exist
  if (!itemNameEl || !qtyEl) {
    console.error('Form elements not found! Check HTML has id="itemName" and id="qty"');
    alert('Form error. Please refresh the page.');
    return;
  }

  // Display the item name and price
  itemNameEl.value = item.name;
  if (itemPriceEl) itemPriceEl.value = fmt(item.price);

  // If we're editing an existing item, load its current settings
  if (isEditMode) {
    const store = getStore();
    const cartItem = store.cart[editingIndex];
    
    if (cartItem) {
      // Set the quantity they had before
      if (qtyEl) qtyEl.value = cartItem.qty || 1;
      
      // Parse the notes and restore spice level and special instructions
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
        
        // Show the special instructions they typed before
        if (notesEl && specialNotes.length > 0) {
          notesEl.value = specialNotes.join('; ');
        }
      }
      
      // Add a banner to show they're editing
      const form = $('cf');
      if (form && !document.getElementById('editModeBanner')) {
        const banner = document.createElement('div');
        banner.id = 'editModeBanner';
        banner.style.cssText = 'background: #fef3c7; border: 2px solid #f59e0b; padding: 12px; border-radius: 8px; margin-bottom: 16px; text-align: center; color: #000; font-weight: bold;';
        banner.textContent = '✏️ Editing Order';
        form.insertBefore(banner, form.firstChild);
        
        // Change the submit button text to "Save Changes"
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Save Changes';
      }
    }
  } else {
    // Adding a new item - start with quantity of 1
    if (qtyEl) qtyEl.value = 1;
  }

  // ===== CALCULATE AND UPDATE THE TOTAL PRICE =====
  
  function updateTotalPrice() {
    const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
    const total = item.price * qty;
    if (totalPriceEl) {
      totalPriceEl.value = fmt(total);
    }
  }

  // Calculate total immediately when page loads
  updateTotalPrice();
  
  // Recalculate when quantity changes
  if (qtyEl) {
    qtyEl.addEventListener('change', updateTotalPrice);
    qtyEl.addEventListener('input', updateTotalPrice);
  }

  // ===== HANDLE FORM SUBMISSION (SAVE OR ADD TO CART) =====
  
  const form = $('cf');
  if (!form) {
    console.error('Form not found! Check HTML has id="cf"');
    return;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get the quantity and build the customization notes
    const qty = Math.max(1, parseInt(qtyEl.value || '1', 10));
    const customizations = [];
    
    // Add spice level preference if they picked one
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
    
    // Add any special instructions they typed
    if (notesEl && notesEl.value.trim()) {
      customizations.push(notesEl.value.trim());
    }
    
    // Combine all notes into one string
    const notes = customizations.join('; ');
    
    // Create the order item with all details
    const orderItem = {
      stallId: stallId,
      itemId: item.id,
      name: item.name,
      price: item.price,
      qty: qty,
      notes: notes
    };
    
    console.log('Order item:', orderItem);
    
    // Either update the existing cart item or add a new one
    if (isEditMode) {
      // Update the item in cart
      updateCartItem(editingIndex, orderItem);
      
      // Clean up temporary storage
      try {
        localStorage.removeItem('editingCartIndex');
        localStorage.removeItem('customizeMode');
      } catch(e) {}
      
      alert(`✅ Updated ${qty}x ${item.name}!`);
      window.location.href = 'Checkout.html';
    } else {
      // Add new item to cart
      addToCart(orderItem);
      
      // Clean up temporary storage
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