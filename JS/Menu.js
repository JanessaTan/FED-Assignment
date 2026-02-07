(function(){

  const menuList = document.getElementById("menuList");

  const stallId = new URLSearchParams(window.location.search).get("stall");

  let menuItems = [];

  // Golden Wok
  if (stallId === "golden-wok") {
    menuItems = [
      {
        name: "Egg Fried Rice",
        description: "Classic wok fried rice with egg.",
        price: 5.00,
        img: "../img/chinese.jpg"
      },
      {
        name: "Char Kway Teow",
        description: "Flat noodles stir fried with prawns.",
        price: 5.50,
        img: "../img/charkwayteow.jpg"
      }
    ];
  }

  // Mak Cik Delights
  else if (stallId === "mak-cik-delights") {
    menuItems = [
      {
        name: "Nasi Lemak",
        description: "Coconut rice with sambal and egg.",
        price: 4.50,
        img: "../img/malay.jpg"
      },
      {
        name: "Beef Rendang",
        description: "Spicy slow cooked beef.",
        price: 6.00,
        img: "../img/sambal.jpg"
      }
    ];
  }

  // Little India Express
  else if (stallId === "little-india-express") {
    menuItems = [
      {
        name: "Chicken Biryani",
        description: "Fragrant basmati rice with chicken.",
        price: 6.50,
        img: "../img/indian.jpg"
      },
      {
        name: "Roti Prata",
        description: "Crispy prata served with curry.",
        price: 2.00,
        img: "../img/roti.jpg"
      }
    ];
  }

  // Tom Yum House
  else if (stallId === "tom-yum-house") {
    menuItems = [
      {
        name: "Tom Yum Soup",
        description: "Spicy and sour Thai soup.",
        price: 6.00,
        img: "../img/thai.jpg"
      },
      {
        name: "Pad Thai",
        description: "Stir fried Thai noodles.",
        price: 5.50,
        img: "../img/thai.jpg"
      }
    ];
  }

  // Western Bites
  else if (stallId === "western-bites") {
    menuItems = [
      {
        name: "Grilled Chicken Chop",
        description: "Juicy grilled chicken with fries.",
        price: 8.00,
        img: "../img/western.jpg"
      },
      {
        name: "Fish & Chips",
        description: "Crispy battered fish with fries.",
        price: 7.50,
        img: "../img/western.jpg"
      }
    ];
  }

  // Kopi & Teh Corner
  else if (stallId === "kopi-teh-corner") {
    menuItems = [
      {
        name: "Kopi O",
        description: "Traditional black coffee.",
        price: 1.50,
        img: "../img/drink.jpg"
      },
      {
        name: "Teh Tarik",
        description: "Pulled milk tea.",
        price: 1.80,
        img: "../img/drink.jpg"
      }
    ];
  }

  // Render
  function renderMenu(){
    menuList.innerHTML = "";

    menuItems.forEach(item => {

      const card = document.createElement("div");
      card.className = "menu-card";

      card.innerHTML = `
        <img src="${item.img}" class="menu-img" alt="${item.name}">
        <div class="menu-content">
          <div class="menu-item-title">${item.name}</div>
          <div class="menu-description">${item.description}</div>
          <div class="menu-price">$${item.price.toFixed(2)}</div>
          <button class="menu-btn">Add to Cart</button>
        </div>
      `;

      card.querySelector(".menu-btn").addEventListener("click", function(){
        window.location.href = "Checkout.html";
      });

      menuList.appendChild(card);
    });
  }

  renderMenu();

})();
