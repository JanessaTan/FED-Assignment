/* assets/js/autopromo.js */
(function() {
  const {cart, subtotal} = cartTotals();
  const picked = getPickedPromo();
  const result = computeDiscount(cart, subtotal);
  
  const rootEl = $('#root');
  const detailsEl = $('#promoDetails');
  
  if (cart.length === 0) {
    rootEl.innerHTML = `
      <div class="promo-status warning">
        <h3>⚠️ Cart is Empty</h3>
        <p>Add items to your cart to see promotion eligibility.</p>
      </div>
      <div class="button-group mt-16">
        <a class="btn" href="menu.html">Browse Menu</a>
      </div>
    `;
    return;
  }
  
  const promoName = picked 
    ? PROMOTIONS.find(x => x.id === picked.id).title 
    : 'None';
  
  const isApplied = result.discount > 0;
  const newTotal = Math.max(0, subtotal - result.discount);
  
  let statusClass = isApplied ? 'success' : 'info';
  let statusIcon = isApplied ? '✓' : 'ℹ️';
  
  rootEl.innerHTML = `
    <div class="promo-summary">
      <div class="promo-item">
        <span class="promo-label">Selected Promotion:</span>
        <span class="promo-value"><strong>${promoName}</strong></span>
      </div>
      
      <div class="promo-status ${statusClass}">
        <h3>${statusIcon} ${isApplied ? 'Promotion Applied!' : 'Eligibility Check'}</h3>
        <p>${result.reason}</p>
      </div>
      
      <div class="price-breakdown">
        <div class="price-row">
          <span>Subtotal:</span>
          <span>${fmt(subtotal)}</span>
        </div>
        
        <div class="price-row discount">
          <span>Promotion Discount:</span>
          <span>-${fmt(result.discount)}</span>
        </div>
        
        <hr>
        
        <div class="price-row total">
          <span>New Total:</span>
          <span>${fmt(newTotal)}</span>
        </div>
      </div>
      
      ${isApplied ? `
        <div class="savings-badge">
          🎉 You're saving ${fmt(result.discount)}!
        </div>
      ` : ''}
    </div>
  `;
  
  if (picked) {
    const promo = PROMOTIONS.find(x => x.id === picked.id);
    detailsEl.classList.remove('hidden');
    
    let detailsHTML = `
      <h3>Promotion Details</h3>
      <div class="promo-details-content">
        <p><strong>Type:</strong> ${
          promo.type === 'order' ? 'Order-wide discount' :
          promo.type === 'stall' ? 'Stall-specific discount' :
          'Bundle deal'
        }</p>
    `;
    
    if (promo.minSpend) {
      detailsHTML += `<p><strong>Minimum Spend:</strong> ${fmt(promo.minSpend)}</p>`;
    }
    
    if (promo.percent) {
      detailsHTML += `<p><strong>Discount:</strong> ${promo.percent}% off</p>`;
    }
    
    if (promo.amount) {
      detailsHTML += `<p><strong>Discount:</strong> ${fmt(promo.amount)} off</p>`;
    }
    
    detailsHTML += `</div>`;
    detailsEl.innerHTML = detailsHTML;
  }
})();