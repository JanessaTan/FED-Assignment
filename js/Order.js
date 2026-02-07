
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
  })