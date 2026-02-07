/* assets/js/checkout.js */
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
  const cartDiv = document.querySelector('.cart-list')
  const totalDiv = document.querySelector('.cart-total')
  const orderDiv = document.querySelector('.order-info')

  const { cart, subtotal} = cartTotals();
  const order = getOrder();

//order info
if (order.type === "later" && order.pickupTime) {
  let d = new Date(order.pickupTime);
  orderDiv.innerHTML =  "<p><strong>Pickup Time:</strong> " + d.toLocaleString() + "</p>"
} else {
  orderDiv.innerHTML = "<p><strong>Pickup:</strong> ASAP</p>"
}
//cart is empty
if (cart.length ===0) {
  cartDiv.innerHTML ="<p>Your cart is empty.</p>"
  totalDiv.innerHTML = ""
  return;
}
//cart items
let html = "";

for (let i = 0; i < cart.length; i++) {
  let item = cart[i];
  html += "<div class='cart-item'>" + 
    "<div class='item-info'>" + "<h4>" + item.name + "</h4>" +
    "<p>$" + item.price + " x " + item.qty + "</p>" +
    "</div>" + 
    "<div class='item-actions'>" + 
    "<span class='item-price'>$" + (item.price * item.qty).toFixed(2) + "</span>" +

    "<button class='delete-btn' onclick='removeItem(" + i + ")'>" +
      "Remove" +
    "</button>" +
    "</div>" +
    "</div>";
}
cartDiv.innerHTML = html;

totalDiv.innerHTML ="<h3>Total: $" + subtotal.toFixed(2) + "</h3>"
}
//remove item
function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  setCart(cart);
  displayCheckout();
}
