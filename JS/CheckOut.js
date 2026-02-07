/* assets/js/checkout.js */
//click fllw insta
    document.querySelectorAll('.footer-brand h3').forEach(f => {
        f.style.cursor='pointer'
        f.addEventListener('click', function() {
            window.location.href = 'Dummy.html'
        })
    })
    //utility
    document.querySelectorAll('.FooterUtility p').forEach(p => {
        p.style.cursor = 'pointer'
        p.addEventListener('click', () => {
            window.location.href = 'Dummy.html'
        })
    })
    //order btn
    let orderbtn = document.querySelector('.order-btn button')
    orderbtn.style.cursor ='pointer'
    orderbtn.addEventListener('click', function() {
        window.location.href = 'Order.html'})
    //nav bar
    let navLinks = document.querySelectorAll('.nav-links a')
    let pages = ["Home.html", "About.html", "Stalls.html", "Promotion.html", "Contact.html"]
    navLinks.forEach((link, i) => {
        link.addEventListener('click', (e) => {
            e.preventDefault()
            window.location.href = pages[i]
        })})
    let pageMap = ["Home.html",
                    "About.html",
                    "Stalls.html",
                    "Menu.html",
                    "feedback.html",
                    "Promotion.html",
                    "Contact.html"]
        let footerPages =document.querySelectorAll('.footerPage p')
        footerPages.forEach((p, i) =>{
            p.style.cursor ='pointer'
            p.addEventListener('click', function() {
                window.location.href = pageMap[i]
            })
        })


        
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
  let backbtn = document.querySelector('.back-btn');
  if (backbtn) {
    backbtn.style.cursor ='pointer'
    backbtn.addEventListener('click', function() {
      window.location.href = 'Menu.html'
  })
}
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
