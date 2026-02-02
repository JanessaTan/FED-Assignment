// assets/js/promo.js
function pickPromo(id){ store.set(KEYS.selectedPromo,{id}); }
function getPickedPromo(){ return store.get(KEYS.selectedPromo,null); }

// Compute discount based on cart and chosen promo; also auto-apply eligibility.
function computeDiscount(cart, subtotal){
  const chosen = getPickedPromo();
  if(!chosen) return { discount:0, applied:null, reason:'No promotion selected' };
  const promo = PROMOTIONS.find(p=>p.id===chosen.id);
  if(!promo) return { discount:0, applied:null, reason:'Invalid promotion' };

  let discount = 0, reason='';

  if(promo.type==='order'){
    if(subtotal >= (promo.minSpend??0)){ discount = promo.amount; reason = `Applied: ${promo.title}`; }
    else reason = `Needs min spend ${fmt(promo.minSpend)}`
  }
  if(promo.type==='stall'){
    const stallSum = cart.filter(i=>i.stallId===promo.stallId).reduce((s,i)=>s+i.price*i.qty,0);
    if(stallSum>0){ discount = stallSum * (promo.percent/100); reason = `Applied: ${promo.title}`; }
    else reason = `Buy from target stall to apply`;
  }
  if(promo.type==='bundle'){
    const qty = cart.filter(i=>i.stallId===promo.stallId && i.itemId===promo.itemId).reduce((s,i)=>s+i.qty,0);
    if(qty>=promo.thresholdQty){ discount = promo.amount; reason = `Applied: ${promo.title}`; }
    else reason = `Add ${promo.thresholdQty} of the bundle item`;
  }
  discount = Math.min(discount, subtotal); // guard
  return { discount, applied: promo, reason };
}
``