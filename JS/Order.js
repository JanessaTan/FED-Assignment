
document.addEventListener('DOMContentLoaded', function () {
  let ordernow = document.getElementById("order-now")
  let orderlater =document.getElementById("order-later")
  let promo = document.querySelector(".Check-promo span")
  let navOrderBtn = document.querySelector(".order-btn button")

  if (navOrderBtn) {
    navOrderBtn.style.cursor = 'pointer';
    navOrderBtn.addEventListener('click', function() {
      window.location.href = 'Order.html'
  })
}
  if (ordernow) {
    ordernow.style.cursor = "pointer";
    ordernow.addEventListener('click', function() {
      if (typeof setOrder === "function") {
        setOrder({
          type: "now",
          pickupTime: null
        });
      }
      window.location.href = "Stalls.html";
    });
  }
 if (orderlater){
  orderlater.style.cursor = 'pointer'
  orderlater.addEventListener('click', function() {
  window.location.href = 'order-later.html'
})
 }
if (promo){
  promo.style.cursor = "pointer"
  promo.addEventListener('click', function() {
    window.location.href = 'Promotion.html'
  })
}
let saveBtn = document.querySelector('.saveOrder-btn');
if (saveBtn) {
  saveBtn.style.cursor = 'pointer';
  saveBtn.addEventListener("click", saveCurrentOrder);
}
  })

//saved order feature
function saveCurrentOrder() {
  const store = JSON.parse(localStorage.getItem("store")) || { cart: [], order: null };
  const cart = store.cart || [];

  if (cart.length === 0) {
    alert("There is no order to save yet.");
    return;
  }

  const savedOrders = JSON.parse(localStorage.getItem("hc.savedOrders")) || [];

  const orderName = prompt("Enter a name for this order:", "My Usual Order");
  if (!orderName) return;

  const newOrder = {
    id: "so_" + Date.now(),
    name: orderName,
    items: cart,
    createdAt: new Date().toISOString()
  };

  savedOrders.push(newOrder);
  localStorage.setItem("hc.savedOrders", JSON.stringify(savedOrders));

  alert("Order saved successfully!");
}
