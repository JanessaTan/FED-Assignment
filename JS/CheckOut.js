/* assets/js/checkout.js */

// ===============================
// INITIAL LOAD
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  console.log("Checkout page loaded");

  displayCheckout();

  // Back button
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "Menu.html";
    });
  }

  // Promo link
  const promoLink = document.querySelector(".promo-link");
  if (promoLink) {
    promoLink.addEventListener("click", function () {
      window.location.href = "Promotion.html";
    });
  }

  // Payment form
  const paymentForm = document.querySelector(".payment-form");

  if (paymentForm) {
    paymentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const cardNumber = document.querySelector("#card-number").value.trim();
      const expiry = document.querySelector("#expiry").value.trim();
      const cvc = document.querySelector("#cvc").value.trim();

      const cardRegex = /^\d{16}$/;
      const expiryRegex = /^\d{2}\/\d{2}$/;
      const cvcRegex = /^\d{3}$/;

      if (!cardRegex.test(cardNumber) ||
          !expiryRegex.test(expiry) ||
          !cvcRegex.test(cvc)) {

        alert("Invalid payment details.");
        return;
      }

      clearCart();
      clearOrder();

      alert("Payment successful!");
      window.location.href = "Success.html";
    });
  }

});


// ===============================
// DISPLAY CHECKOUT
// ===============================
function displayCheckout() {

  const cartDiv = document.querySelector(".cart-list");
  const totalDiv = document.querySelector(".cart-total");
  const orderDiv = document.querySelector(".order-info");

  if (!cartDiv || !totalDiv || !orderDiv) {
    console.log("Checkout elements missing in HTML");
    return;
  }

  const store = JSON.parse(localStorage.getItem("store")) || {
    cart: [],
    order: { type: "now" }
  };

  const cart = store.cart || [];
  const order = store.order || { type: "now" };

  console.log("Cart data:", cart);

  // ===============================
  // ORDER INFO
  // ===============================
  if (order.type === "later" && order.pickupTime) {
    const d = new Date(order.pickupTime);
    orderDiv.innerHTML =
      "<p><strong>Pickup Time:</strong> " +
      d.toLocaleString() +
      "</p>";
  } else {
    orderDiv.innerHTML =
      "<p><strong>Pickup:</strong> ASAP</p>";
  }

  // ===============================
  // EMPTY CART
  // ===============================
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.innerHTML = "";
    return;
  }

  cartDiv.innerHTML = "";

  let subtotal = 0;

  // ===============================
  // DISPLAY ITEMS
  // ===============================
  cart.forEach(function (item, index) {

    subtotal += Number(item.price) * item.qty;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    let customizationHTML = "";

    if (item.size) {
      customizationHTML += "<p><strong>Size:</strong> " + item.size + "</p>";
    }

    if (item.spice) {
      customizationHTML += "<p><strong>Spice:</strong> " + item.spice + "</p>";
    }

    if (item.addons && item.addons.length > 0) {
      customizationHTML +=
        "<p><strong>Add-ons:</strong> " +
        item.addons.join(", ") +
        "</p>";
    }

    if (item.notes) {
      customizationHTML +=
        "<p><strong>Notes:</strong> " +
        item.notes +
        "</p>";
    }

    itemDiv.innerHTML =
      "<div class='item-info'>" +
      "<h4>" + item.name + "</h4>" +
      "<p>$" + item.price + " x " + item.qty + "</p>" +
      customizationHTML +
      "</div>" +
      "<div class='item-actions'>" +
      "<span class='item-price'>$" +
      (item.price * item.qty).toFixed(2) +
      "</span>" +
      "<button class='delete-btn'>Remove</button>" +
      "<button class='customize-btn'>Customize</button>" +
      "</div>";

    cartDiv.appendChild(itemDiv);

    // Remove button
    const removeBtn = itemDiv.querySelector(".delete-btn");
    removeBtn.addEventListener("click", function () {

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

    // Customize button
    const customizeBtn = itemDiv.querySelector(".customize-btn");
    customizeBtn.addEventListener("click", function () {

      localStorage.setItem("editingCartIndex", JSON.stringify(index));

      window.location.href = "customize.html";
    });

  });

  // ===============================
  // PROMO CALCULATION
  // ===============================
  let discount = 0;
  let reason = "";

  if (typeof computeDiscount === "function") {
    const promoResult = computeDiscount(cart, subtotal);
    discount = promoResult.discount || 0;
    reason = promoResult.reason || "";
  }

  const finalTotal = Math.max(0, subtotal - discount);

  let totalHTML =
    "<h3>Subtotal: $" + subtotal.toFixed(2) + "</h3>";

  if (discount > 0) {
    totalHTML +=
      "<p style='color:green;'>Discount: -$" +
      discount.toFixed(2) +
      "</p>";
  }

  if (reason) {
    totalHTML +=
      "<p style='font-size:0.9em;color:#666;'>" +
      reason +
      "</p>";
  }

  totalHTML +=
    "<h2 style='color:red;'>Final Total: $" +
    finalTotal.toFixed(2) +
    "</h2>";

  totalDiv.innerHTML = totalHTML;
}