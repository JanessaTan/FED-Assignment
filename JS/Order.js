
document.addEventListener('DOMContentLoaded', function () {
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
    //footer pages
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
  if (ordernow){
    ordernow.style.cursor = 'pointer'
    ordernow.addEventListener('click', function()  {
    window.location.href = 'Stalls.html';
})}
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
