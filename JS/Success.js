(function () {
  // Get DOM elements
  const root = document.getElementById("root");

  // Read storage
  const store = JSON.parse(localStorage.getItem("store")) || { cart: [], order: null, selectedPromo: null };
  const cart = store.cart || [];
  const order = store.order || null;
  const selectedPromo = store.selectedPromo || null;

  // Some CSS to align numbers on the receipt
  const style = document.createElement("style");
  style.textContent = `
    .receipt-section { margin-top: 12px; }
    .receipt-stall { margin: 14px 0 6px; display:block; }
    .receipt-list { list-style: none; padding-left: 0; margin: 0; }
    .receipt-line {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 4px 0;
    }
    .receipt-right {
      min-width: 90px;
      text-align: right;
      padding-right: 50px;
    }
    .receipt-meta { margin-top: 10px; color: #555; font-size: 0.95rem; }
    .receipt-total { margin-top: 12px; font-weight: 700; text-align: right; }
    .receipt-discount { text-align: right; color: green; font-weight: 700; margin-top: 6px; }
    .receipt-final { text-align: right; color: red; font-weight: 800; margin-top: 8px; }
    .receipt-empty { padding: 12px 0; }
  `;
  document.head.appendChild(style);

  function money(n) {
    const num = Number(n) || 0;
    return "$" + num.toFixed(2);
  }

  // Find a stall name for each cart item
  function getStallLabel(item) {
    return (
      item.stallName ||
      item.stall ||
      item.stallTitle ||
      item.stallId ||
      "Items"
    );
  }

  // Group cart items by stall
  function groupByStall(items) {
    const groups = {};
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      const key = getStallLabel(it);
      if (!groups[key]) groups[key] = [];
      groups[key].push(it);
    }
    return groups;
  }

  // Discount (optional)
  function getDiscount(cartItems, subtotal) {
    if (typeof window.computeDiscount === "function") {
      const result = window.computeDiscount(cartItems, subtotal);
      return {
        discount: Number(result.discount) || 0,
        reason: result.reason || ""
      };
    }
    return { discount: 0, reason: "" };
  }

  function renderReceipt() {
    // Receipt body
    if (!cart.length) {
      root.innerHTML = `
        <h3>Receipt:</h3>
        <p class="receipt-empty">No items found. Please place an order first.</p>
      `;
      return;
    }

    // Subtotal
    let subtotal = 0;
    for (let i = 0; i < cart.length; i++) {
      const it = cart[i];
      const lineTotal = (Number(it.price) || 0) * (Number(it.qty) || 0);
      subtotal += lineTotal;
    }

    const grouped = groupByStall(cart);

    // Build receipt HTML
    let receiptHTML = `<h3>Receipt:</h3><section class="receipt-section">`;

    // Pickup (opitonal)
    if (order && order.type === "later" && order.pickupTime) {
      const d = new Date(order.pickupTime);
      receiptHTML += `<div class="receipt-meta"><strong>Pickup Time:</strong> ${d.toLocaleString()}</div>`;
    } else {
      receiptHTML += `<div class="receipt-meta"><strong>Pickup:</strong> ASAP</div>`;
    }

    // Promotion (optional)
    if (selectedPromo && selectedPromo.id) {
      receiptHTML += `<div class="receipt-meta"><strong>Promotion Selected:</strong> ${selectedPromo.id}</div>`;
    }

    // Stall sections
    const stallKeys = Object.keys(grouped);
    for (let s = 0; s < stallKeys.length; s++) {
      const stallKey = stallKeys[s];
      const items = grouped[stallKey];

      receiptHTML += `<strong class="receipt-stall">${stallKey}:</strong>`;
      receiptHTML += `<ul class="receipt-list">`;

      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        const qty = Number(it.qty) || 0;
        const price = Number(it.price) || 0;
        const lineTotal = price * qty;

        // Build left text
        const leftText = `${it.name} (x${qty})`;

        receiptHTML += `
          <li class="receipt-line">
            <span class="receipt-left">${leftText}</span>
            <span class="receipt-right">${money(lineTotal)}</span>
          </li>
        `;

        // Customisation (optional)
        if (it.customisation) {
          receiptHTML += `
            <li class="receipt-line">
              <span class="receipt-left">(customised) ${it.customisation}</span>
              <span class="receipt-right"></span>
            </li>
          `;
        } else if (it.customized) {
          receiptHTML += `
            <li class="receipt-line">
              <span class="receipt-left">(customised) ${it.customized}</span>
              <span class="receipt-right"></span>
            </li>
          `;
        }
      }

      receiptHTML += `</ul>`;
    }

    // Discount (if has promo)
    const disc = getDiscount(cart, subtotal);
    const finalTotal = Math.max(0, subtotal - disc.discount);

    receiptHTML += `<div class="receipt-total">Subtotal: ${money(subtotal)}</div>`;

    if (disc.discount > 0) {
      receiptHTML += `<div class="receipt-discount">Discount: -${money(disc.discount)}</div>`;
      if (disc.reason) {
        receiptHTML += `<div class="receipt-meta">${disc.reason}</div>`;
      }
    }

    receiptHTML += `<div class="receipt-final">Total: ${money(finalTotal)}</div>`;
    receiptHTML += `</section>`;

    root.innerHTML = receiptHTML;
  }

  renderReceipt();
})();
