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

  const cartDiv = document.querySelector('.cart-list');
  const totalDiv = document.querySelector('.cart-total');
  const orderDiv = document.querySelector('.order-info');

  const store = JSON.parse(localStorage.getItem("store")) || { cart: [], order: { type: "now" } };
  const cart = store.cart || [];
  const order = store.order || { type: "now" };

  const subtotal = cart.reduce((sum, item) => {
    return sum + (Number(item.price) * item.qty);
  }, 0);

  // Order Info
  if (order.type === "later" && order.pickupTime) {
    let d = new Date(order.pickupTime);
    orderDiv.innerHTML = "<p><strong>Pickup Time:</strong> " + d.toLocaleString() + "</p>";
  } else {
    orderDiv.innerHTML = "<p><strong>Pickup:</strong> ASAP</p>";
  }

  // Empty Cart
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.innerHTML = "";
    return;
  }

  cartDiv.innerHTML = "";

  cart.forEach(function(item, index) {

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    itemDiv.innerHTML =
      "<div class='item-info'>" +
      "<h4>" + item.name + "</h4>" +
      "<p>$" + item.price + " x " + item.qty + "</p>" +
      "</div>" +
      "<div class='item-actions'>" +
      "<span class='item-price'>$" + (item.price * item.qty).toFixed(2) + "</span>" +
      "<button class='delete-btn'>Remove</button>" +
      "<button class='customize-btn'>Customize</button>" +
      "</div>";

    cartDiv.appendChild(itemDiv);

    const removeBtn = itemDiv.querySelector(".delete-btn");

    removeBtn.style.cursor = "pointer";
    removeBtn.style.backgroundColor = "white";
    removeBtn.style.color = "red";
    removeBtn.style.border = "1px solid blue";
    removeBtn.style.borderRadius = "5px";
    removeBtn.style.padding = "3px 6px";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.fontWeight = "bold";

    removeBtn.addEventListener("click", function() {

      const store = JSON.parse(localStorage.getItem("store")) || { cart: [] };
      const currentCart = store.cart || [];

      if (currentCart[index].qty > 1) {
        currentCart[index].qty -= 1;
      } else {
        currentCart.splice(index, 1);
      }

      store.cart = currentCart;
      localStorage.setItem("store", JSON.stringify(store));

      displayCheckout();
    });

  });

  const promoResult = computeDiscount(cart, subtotal);
  const finalTotal = Math.max(0, subtotal - promoResult.discount);

  let totalHTML = "<h3>Subtotal: $" + subtotal.toFixed(2) + "</h3>";

  if (promoResult.discount > 0) {
    totalHTML += "<p style='color:green; font-weight:bold;'>Discount: -$" + promoResult.discount.toFixed(2) + "</p>";
    totalHTML += "<p style='font-size:0.9em; color:#666;'>" + promoResult.reason + "</p>";
  } else if (promoResult.reason !== "No promotion selected") {
    totalHTML += "<p style='font-size:0.9em; color:#666;'>" + promoResult.reason + "</p>";
  }

  totalHTML += "<h2 style='color:red; margin-top:10px;'>Final Total: $" + finalTotal.toFixed(2) + "</h2>";

  totalDiv.innerHTML = totalHTML;
}


// Promo click handler
document.querySelectorAll('.promo-card').forEach(card => {
  card.addEventListener('click', function(e) {
    e.preventDefault();
    const id = card.dataset.id;
    pickPromo(id);
    window.location.href = "Checkout.html";
  });
});
