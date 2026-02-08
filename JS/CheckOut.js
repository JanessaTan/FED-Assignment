/* assets/js/checkout.js */

window.addEventListener("load", function() {
    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.style.cursor = "pointer";
        backBtn.addEventListener("click", function() {
            window.location.href = "Menu.html";
        });
    }

    const promoLink = document.querySelector(".checkout p");
    if (promoLink) {
        promoLink.style.cursor = "pointer";
        promoLink.addEventListener("click", function() {
            window.location.href = "Promotion.html";
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
  displayCheckout();

  const paymentForm = document.querySelector(".payment-form");
  if (paymentForm) {
    paymentForm.addEventListener("submit", function(e) {
      e.preventDefault();
      clearCart();
      clearOrder();
      alert("Payment successful!");
      window.location.href = "Home.html";
    });
  }
});
function displayCheckout() {
  const cartDiv = document.querySelector('.cart-list')
  const totalDiv = document.querySelector('.cart-total')
  const orderDiv = document.querySelector('.order-info')

  const { cart, subtotal } = typeof cartTotals === "function" ? cartTotals() : {cart: [], subtotal: 0};
  const order = typeof getOrder === "function" ? getOrder() : { type: "now" };

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
cartDiv.innerHTML = "";
  cart.forEach(function(item, index) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = "<div class='item-info'>" +
      "<h4>" + item.name + "</h4>" +
      "<p>$" + item.price + " x " + item.qty + "</p>" +
      "</div>" +
      "<div class='item-actions'>" +
      "<span class='item-price'>$" + (item.price * item.qty).toFixed(2) + "</span>" +
      "<button class='delete-btn'>Remove</button>" +
      "</div>";
    cartDiv.appendChild(itemDiv);
    
      //remove btn
      const removeBtn = itemDiv.querySelector(".delete-btn");
      removeBtn.addEventListener("click", function(){
        const currentCart = getCart();
        currentCart.splice(index, 1);
        setCart(currentCart);
        displayCheckout();
      })
})

totalDiv.innerHTML ="<h3>Total: $" + subtotal.toFixed(2) + "</h3>"
}