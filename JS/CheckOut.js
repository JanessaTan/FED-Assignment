/* assets/js/checkout.js */

window.addEventListener("load", function() {
    const backBtn = document.querySelector(".back-btn");
    if (backBtn) {
        backBtn.style.cursor = "pointer";
        backBtn.addEventListener("click", function() {
            window.location.href = "Menu.html";
        });
    }

    const promoLink = document.querySelector(".promo-link");
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

   // Read cart from store
  const store = JSON.parse(localStorage.getItem("store")) || { cart: [], order: { type: "now" } };
  const cart = store.cart || [];
  const order = store.order || { type: "now" };

  // subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
// order info
  if (order.type === "later" && order.pickupTime) {
    let d = new Date(order.pickupTime);
    orderDiv.innerHTML =  "<p><strong>Pickup Time:</strong> " + d.toLocaleString() + "</p>";
  } else {
    orderDiv.innerHTML = "<p><strong>Pickup:</strong> ASAP</p>";
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
        const item = currentCart[index];
        if (item.qty > 1) {
          item.qty -= 1;  //minus 1
        } else {
          currentCart.splice(index, 1); //remove if only 1 item
        }
        setCart(currentCart);
        displayCheckout();
      })
})
//promotion discount
const promoResult = computeDiscount(cart, subtotal);
const finalTotal = Math.max(0, subtotal - promoResult.discount);
const totalHTML = "<h3>Subtotal: $" + subtotal.toFixed(2) + "</h3>";
if (promoResult.discount > 0) {
  totalHTML += "<p style='color:green; font-weight:bold;'>Discount: -$" + promoResult.discount.toFixed(2) + "</p>";
  totalHTML += "<p style='font-size:0.9em; color:#666;'>" + promoResult.reason + "</p>";
} else if (promoResult.reason !== "No promotion selected") {
  totalHTML += "<p style='font-size:0.9em; color:#666;'>" + promoResult.reason + "</p>";
}

totalHTML += "<h2 style='color:red; margin-top:10px;'>Final Total: $" + finalTotal.toFixed(2) + "</h2>";

totalDiv.innerHTML = totalHTML;
}

//saves promo to store.selectedPromo
document.querySelectorAll('.promo-card').forEach(card => {
  card.addEventListener('click', function(e) {
    e.preventDefault();
    const id = card.dataset.id;
    pickPromo(id);
    window.location.href = "Checkout.html";
  });
});