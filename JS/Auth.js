//abput js
document.addEventListener('DOMContentLoaded', function () {
    //click social icons
    document.querySelectorAll('.social-icons img').forEach(icon => {
        icon.style.cursor = 'pointer'
        icon.addEventListener('click', () => {
            window.location.href = 'Dummy.html'
        })
    })

    //contact
     document.querySelectorAll(".top-bar .contact span").forEach(link => {
        link.style.cursor = 'pointer'
        link.addEventListener('click', () => {
            window.location.href = "Contact.html"
    })
  })
  /*explore section clickable*/
    document.querySelectorAll('.About-explore h3').forEach(a => {
        a.style.cursor ='pointer'
    })
    document.querySelector('.About-explore h3').addEventListener('click', () => {
        window.location.href = 'Stalls.html'
})
    document.querySelectorAll('.About-explore p').forEach(item => {
        item.style.cursor = 'pointer'
        item.addEventListener('click', () => {
            window.location.href = 'Contact.html'})

    })
    //6 stalls
    document.querySelectorAll('.info-box').forEach(box => {
        if (box.textContent.includes('Stalls')) {
            box.style.cursor = 'pointer'
            box.addEventListener('click', () => {
                window.location.href = 'Stalls.html'})
            }})
    //more btn
    document.querySelector('.more-btn button').style.cursor ='pointer'
    document.querySelector('.more-btn button').addEventListener('click', function() {
        window.location.href = 'feedback.html'
    });
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

})

// order-later js
    document.addEventListener('DOMContentLoaded', function() {
        let orderForm = document.getElementById('ol')
        let pickupInput = document.getElementById('pickupTime')
        let scheduleBtn = document.querySelector('.scheduleBtn')

        //form submission
        if (orderForm) {
            orderForm.addEventListener('submit', function(e) {
                e.preventDefault()

                let time= pickupInput.value

                if (!time) {
                alert("Please select a pickup time!")
                return }
                //save to localstorage
                setOrder({
                type: "later",
                pickupTime: time    })
                window.location.href = 'Stalls.html'
            })
        }
        // click schedule to stalls
        if (scheduleBtn) {
        scheduleBtn.style.cursor = 'pointer'
        scheduleBtn.addEventListener('click', function(e) {
            e.preventDefault()
            window.location.href = 'Stalls.html'
        })}
    })