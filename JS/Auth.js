// assets/js/auth.js
if(!store.get(KEYS.role)) store.set(KEYS.role,'guest');
``
//click social icons
document.querySelector('.social-icons a').forEach(icon => {
    icon.addEventListerner('click', function(e)
{
    e.preventDefault();
    window.open(this.href, '_blank');
})})

document.querySelectorAll('.top-bar .contact span').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
        window.location.href = 'Contact.html';
    })
})