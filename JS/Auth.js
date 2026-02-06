// assets/js/auth.js
if(!store.get(KEYS.role)) store.set(KEYS.role,'guest');
``
//click social icons
document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = 'Dummy.html';
})})

document.querySelectorAll('.top-bar .contact span').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        window.location.href = 'Contact.html';
    })
})