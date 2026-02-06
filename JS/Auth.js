// assets/js/auth.js
if(!store.get(KEYS.role)) store.set(KEYS.role,'guest');
``
//click social icons
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'Dummy.html';
})})

// contact info leads to contact page
document.querySelectorAll('.top-bar .contact span').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        window.location.href = 'Contact.html';
    })
})
//explore section clickable
document.querySelectorAll('.About-explore p').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        window.location.href = 'Contact.html';
    })
})
//click fllw insta
document.querySelectorAll('.footer-brand h3').addEventListener('click', () => {
    window.location.href = 'Dummy.html';
  })
//nav bar 
let navLinks = document.querySelectorAll('.nav-links a');
let pages = ["Home.html", "About.html", "Stalls.html", "Promotion.html", "Contact.html"]
navLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
        e.preventDefault()
        window.location.href = pages[i];
    })
})
document.querySelector('.order-btn button').addEventListener('click', () => {
    window.location.href = 'Order.html'
})
//more btn
document.querySelector('.more-btn button').addEventListener('click', () => {
    window.location.href = 'feedback.html'
})
