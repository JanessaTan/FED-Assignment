(function(){

  const menuList = document.getElementById("menuList");

  const MENU_DATA = [
    {
      id: "chicken-rice",
      name: "Hainanese Chicken Rice",
      description: "Tender poached chicken served with fragrant rice.",
      price: 5.50,
      img: "../img/chicken rice.jpg"
    },
    {
      id: "laksa",
      name: "Laksa",
      description: "Rich and spicy coconut noodle soup.",
      price: 6.50,
      img: "../img/laksa.jpg"
    },
    {
      id: "char-kway-teow",
      name: "Char Kway Teow",
      description: "Stir-fried flat noodles with egg and prawns.",
      price: 5.00,
      img: "../img/charkwayteow.jpg"
    },
    {
      id: "satay",
      name: "Satay",
      description: "Grilled skewered meat served with peanut sauce.",
      price: 0.90,
      img: "../img/satay.jpg"
    },
    {
      id: "sambal",
      name: "Sambal Stingray",
      description: "Grilled stingray topped with spicy sambal.",
      price: 12.00,
      img: "../img/sambal.jpg"
    },
    {
      id: "kaya-toast",
      name: "Kaya Toast",
      description: "Traditional toast with kaya and butter.",
      price: 2.20,
      img: "../img/kaya-toast.jpg"
    }
  ];

  function renderMenu(){
    menuList.innerHTML = "";

    MENU_DATA.forEach(item => {

      const card = document.createElement("div");
      card.className = "menu-card";

      card.innerHTML = `
        <img src="${item.img}" class="menu-img" alt="${item.name}">

        <div class="menu-content">
          <div class="menu-item-title">${item.name}</div>
          <div class="menu-description">${item.description}</div>
          <div class="menu-price">$${item.price.toFixed(2)}</div>
          <button class="menu-btn" data-id="${item.id}">
            Add to Cart
          </button>
        </div>
      `;

      menuList.appendChild(card);
    });
  }

  menuList.addEventListener("click", function(e){
    if(e.target.classList.contains("menu-btn")){

      const id = e.target.dataset.id;
      const selectedItem = MENU_DATA.find(i => i.id === id);
      if(!selectedItem) return;

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cart.push(selectedItem);
      localStorage.setItem("cart", JSON.stringify(cart));

      // Redirect to Checkout
      window.location.href = "Checkout.html";
    }
  });

  renderMenu();

})();
