// Get DOM elements
document.addEventListener("DOMContentLoaded", function () {
  var promoList = document.getElementById("promoList");
  if (!promoList) return;

  // Define KEYS
  if (typeof window.KEYS === "undefined") {
    window.KEYS = {
      selectedPromo: "selectedPromo"
    };
  }

  // Simple store wrapper for localStorage if missing
  if (typeof window.store === "undefined") {
    window.store = {
      set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
      },
      get: function (key, defaultValue) {
        var val = localStorage.getItem(key);
        return val ? JSON.parse(val) : defaultValue;
      }
    };
  }

  // Format helper if missing
  if (typeof window.fmt === "undefined") {
    window.fmt = function (amount) {
      return "$" + Number(amount).toFixed(2);
    };
  }

  // Promotions list
  if (typeof window.PROMOTIONS === "undefined") {
    window.PROMOTIONS = [
      { id: "promo1", title: "Spend $20, get $5 off", description: "Applies $5 discount when subtotal is at least $20.", type: "order", minSpend: 20, amount: 5 },
      { id: "promo2", title: "10% off Stall A", description: "10% off items from Stall A.", type: "stall", stallId: "stallA", percent: 10 },
      { id: "promo3", title: "Buy 2 Laksa, get $3 off", description: "Get $3 off when you buy 2 Laksa from Stall B.", type: "bundle", stallId: "stallB", itemId: "laksa", thresholdQty: 2, amount: 3 }
    ];
  }

  // pickPromo/getPickedPromo
  if (typeof window.pickPromo === "undefined") {
    window.pickPromo = function (id) {
      window.store.set(window.KEYS.selectedPromo, { id: id });

      // Store into localStorage["store"]
      var storeObj = JSON.parse(localStorage.getItem("store")) || { cart: [], order: { type: "now" } };
      storeObj.selectedPromo = { id: id };
      localStorage.setItem("store", JSON.stringify(storeObj));
    };
  }

  if (typeof window.getPickedPromo === "undefined") {
    window.getPickedPromo = function () {
      // Prefer KEYS storage
      var picked = window.store.get(window.KEYS.selectedPromo, null);
      if (picked && picked.id) return picked;

      // Fallback to localStorage["store"].selectedPromo if anything goes wrong
      var storeObj = JSON.parse(localStorage.getItem("store")) || {};
      if (storeObj.selectedPromo && storeObj.selectedPromo.id) return storeObj.selectedPromo;

      return null;
    };
  }

  // computeDiscount
  if (typeof window.computeDiscount === "undefined") {
    window.computeDiscount = function (cart, subtotal) {
      var chosen = window.getPickedPromo();
      if (!chosen) return { discount: 0, applied: null, reason: "No promotion selected" };

      var promo = null;
      for (var i = 0; i < window.PROMOTIONS.length; i++) {
        if (window.PROMOTIONS[i].id === chosen.id) {
          promo = window.PROMOTIONS[i];
          break;
        }
      }
      if (!promo) return { discount: 0, applied: null, reason: "Invalid promotion" };

      var discount = 0;
      var reason = "";

      if (promo.type === "order") {
        var minSpend = (typeof promo.minSpend === "number") ? promo.minSpend : 0;
        if (subtotal >= minSpend) {
          discount = promo.amount || 0;
          reason = "Applied: " + promo.title;
        } else {
          reason = "Needs min spend " + window.fmt(minSpend);
        }
      }

      if (promo.type === "stall") {
        var stallSum = 0;
        for (var s = 0; s < cart.length; s++) {
          var it = cart[s];
          if (it.stallId === promo.stallId) {
            stallSum += (Number(it.price) * Number(it.qty));
          }
        }
        if (stallSum > 0) {
          discount = stallSum * ((promo.percent || 0) / 100);
          reason = "Applied: " + promo.title;
        } else {
          reason = "Buy from target stall to apply";
        }
      }

      if (promo.type === "bundle") {
        var qty = 0;
        for (var b = 0; b < cart.length; b++) {
          var bi = cart[b];
          if (bi.stallId === promo.stallId && bi.itemId === promo.itemId) {
            qty += Number(bi.qty);
          }
        }
        if (qty >= (promo.thresholdQty || 0)) {
          discount = promo.amount || 0;
          reason = "Applied: " + promo.title;
        } else {
          reason = "Add " + promo.thresholdQty + " of the bundle item";
        }
      }

      if (discount > subtotal) discount = subtotal;
      return { discount: discount, applied: promo, reason: reason };
    };
  }

  // UI cards
  function getSelectedId() {
    var picked = window.getPickedPromo();
    return picked && picked.id ? picked.id : null;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderPromotions() {
    var selectedId = getSelectedId();
    var html = "";

    for (var i = 0; i < window.PROMOTIONS.length; i++) {
      var p = window.PROMOTIONS[i];
      var isSelected = selectedId === p.id;

      // Simple label to show which stall it targets (or "All Stalls")
      var target = "All Stalls";
      if (p.type === "stall" || p.type === "bundle") target = p.stallId || "Target Stall";

      html +=
        "<div class='promo-card" + (isSelected ? " promo-selected" : "") + "' data-id='" + escapeHtml(p.id) + "'>" +
          "<h3>" + escapeHtml(p.title) + "</h3>" +
          "<p>" + escapeHtml(p.description || "") + "</p>" +
          "<p style='font-size:0.9em; color:#666; margin-top:8px;'>" + escapeHtml(target) + "</p>" +
          (isSelected ? "<p style='color:green; font-weight:bold; margin-top:10px;'>Selected</p>" : "") +
        "</div>";
    }

    promoList.innerHTML = html;

    // Add event listeners to the buttons and bind to function
    var cards = promoList.querySelectorAll(".promo-card");
    for (var c = 0; c < cards.length; c++) {
      cards[c].style.cursor = "pointer";
      cards[c].addEventListener("click", function () {
        var id = this.getAttribute("data-id");
        window.pickPromo(id);

        // After choosing a promo, go back to Checkout so it applies there
        window.location.href = "Checkout.html";
      });
    }
  }

  renderPromotions();
});
