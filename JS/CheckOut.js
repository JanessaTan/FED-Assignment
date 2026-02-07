/* assets/js/checkout.js */
(function(){
  const s = $('#summary');
  const {cart, subtotal} = cartTotals();
  if(cart.length===0){ s.innerHTML='<p>Cart empty.</p>'; }

  const {discount, applied, reason} = computeDiscount(cart, subtotal);
  const total = Math.max(0, subtotal - discount);

  s.innerHTML = `
    <p>Items: ${cart.length}</p>
    <p>Subtotal: <strong>${fmt(subtotal)}</strong></p>
    <p>Promotion: <strong>${applied?applied.title:'None'}</strong> <span class="muted">(${reason})</span></p>
    <p>Discount: <strong>-${fmt(discount)}</strong></p>
    <p>Total: <strong>${fmt(total)}</strong></p>
  `;

  $('#pay').addEventListener('submit', e=>{
    e.preventDefault();
    // Mock payment: success if total>0
    const ok = total >= 0;
    if(ok){ addHistory({status:'paid', total, items:cart}); clearCart(); }
    location.href = `success.html?ok=${ok?'1':'0'}&total=${total}`;
  });
})();

document.addEventListener("DOMContentLoaded", function() {
  displayCheckout();
  //submit payment
  document.querySelector(".payment-form").addEventListener('submit', function(e) {
    e.preventDefault();
    clearCart();
    clearOrder();

    alert('Payment successful!');
    window.location.href ='Home.html'
  })
})
function displayCheckout() {
  let cartDiv = document.querySelector('.cart-list')
  let totalDiv = document.querySelector('.cart-total')
  let orderDiv = document.querySelector('order-info')
}