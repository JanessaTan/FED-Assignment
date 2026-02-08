/* assets/js/checkout.js */

// Wait until the page is fully loaded before running anything
document.addEventListener("DOMContentLoaded", function () {

  console.log("Checkout page loaded");

  // Show all cart items when the page opens
  displayCheckout();

  // If user clicks back, go back to menu page
  const backBtn = document.querySelector(".back-btn");
  if (backBtn) {
    backBtn.addEventListener("click", function () {
      window.location.href = "Menu.html";
    });
  }

  // If user wants to change promotion
  const promoLink = document.querySelector(".promo-link");
  if (promoLink) {
    promoLink.addEventListener("click", function () {
      window.location.href = "Promotion.html";
    });
  }

  // Handle payment form submission
  const paymentForm = document.querySelector(".payment-form");

  if (paymentForm) {
    paymentForm.addEventListener("submit", function (e) {

      // Stop page from refreshing
      e.preventDefault();

      const cardNumber = document.querySelector("#card-number").value.trim();
      const expiry = document.querySelector("#expiry").value.trim();
      const cvc = document.querySelector("#cvc").value.trim();

      // Basic validation patterns
      const cardRegex = /^\d{16}$/;
      const expiryRegex = /^\d{2}\/\d{2}$/;
      const cvcRegex = /^\d{3}$/;

      // If input format is wrong, show error
      if (!cardRegex.test(cardNumber) ||
          !expiryRegex.test(expiry) ||
          !cvcRegex.test(cvc)) {

        alert("Invalid payment details. Please check again.");
        return;
      }

      // If payment is valid, clear everything
      clearCart();
      clearOrder();

      alert("Payment successful!");
      window.location.href = "Success.html";
    });
  }

});


// This function displays everything inside the checkout page
function displayCheckout() {

  const cartDiv = document.querySelector(".cart-list");
  const totalDiv = document.querySelector(".cart-total");
  const orderDiv = document.querySelector(".order-info");

  // Safety check (in case HTML elements are missing)
  if (!cartDiv || !totalDiv || !orderDiv) {
    console.log("Checkout section not found in HTML");
    return;
  }

  // Get saved data from localStorage
  const store = JSON.parse(localStorage.getItem("store")) || {
    cart: [],
    order: { type: "now" }
  };

  const cart = store.cart || [];
  const order = store.order || { type: "now" };

  console.log("Current cart:", cart);

  // ------------------------------
  // Show pickup type (ASAP or scheduled)
  // ------------------------------
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

  // ------------------------------
  // If cart is empty
  // ------------------------------
  if (cart.length === 0) {
    cartDiv.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.innerHTML = "";
    return;
  }

  cartDiv.innerHTML = "";

  let subtotal = 0;

  // ------------------------------
  // Display each item in the cart
  // ------------------------------
  cart.forEach(function (item, index) {

    subtotal += Number(item.price) * item.qty;

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    // Build customization details if available
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

    // Create the item layout
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

    // ------------------------------
    // Remove button logic
    // ------------------------------
    const removeBtn = itemDiv.querySelector(".delete-btn");

    removeBtn.addEventListener("click", function () {

      const store = JSON.parse(localStorage.getItem("store")) || { cart: [] };
      const currentCart = store.cart || [];

      // If quantity more than 1, reduce by 1
      if (currentCart[index].qty > 1) {
        currentCart[index].qty -= 1;
      } else {
        // If only 1 left, remove the item
        currentCart.splice(index, 1);
      }

      store.cart = currentCart;

      // Save updated cart
      localStorage.setItem("store", JSON.stringify(store));

      // Refresh display
      displayCheckout();
    });

    // ------------------------------
    // Customize button logic
    // ------------------------------
    const customizeBtn = itemDiv.querySelector(".customize-btn");

    customizeBtn.addEventListener("click", function () {

      // Save which item we want to edit
      localStorage.setItem("editingCartIndex", JSON.stringify(index));

      // Go to customize page
      window.location.href = "customize.html";
    });

  });

  // ------------------------------
  // Apply promotion (if any)
  // ------------------------------
  let discount = 0;
  let reason = "";

  if (typeof computeDiscount === "function") {
    const promoResult = computeDiscount(cart, subtotal);
    discount = promoResult.discount || 0;
    reason = promoResult.reason || "";
  }

  const finalTotal = Math.max(0, subtotal - discount);

  // Build total section
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