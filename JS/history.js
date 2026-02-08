document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const root = document.getElementById("root");
  const listContainer = root ? root.querySelector("div.container") : null;
  if (!listContainer) return;

  // Parse the storage
  function cartParse(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(key);
    } catch (e) {
      return null;
    }
  }

  function saveJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function formatDate(dateValue) {
    if (!dateValue) return "Unknown date";
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    return d.toLocaleDateString(undefined, { day: "2-digit", month: "short", year: "numeric" });
  }

  function makeId() {
    return "ord_" + Date.now() + "_" + Math.random().toString(16).slice(2);
  }

  // Make data format consistent
  function normaliseItems(items) {
    const arr = Array.isArray(items) ? items : [];
    const out = [];

    for (let i = 0; i < arr.length; i++) {
      const it = arr[i] || {};
      out.push({
        name: it.name || it.itemName || "Item",
        qty: Number(it.qty || it.quantity || 1),
        price: Number(it.price || 0),
        notes: it.notes || it.customisation || it.customized || it.remark || "",
        stallName: it.stallName || it.stall || it.stallTitle || ""
      });
    }

    return out;
  }

  function buildOrderLine(items) {
    const parts = [];
    for (let i = 0; i < items.length; i++) {
      parts.push(items[i].name + " (x" + items[i].qty + ")");
    }
    return parts.join(", ");
  }

  function buildCustomisedLine(items) {
    for (let i = 0; i < items.length; i++) {
      const n = items[i].notes;
      if (n && String(n).trim() !== "") return n;
    }
    return "";
  }

  function guessStallName(orderEntry) {
    // If ordered from 1 stall only
    if (orderEntry && orderEntry.stallName && String(orderEntry.stallName).trim() !== "") {
      return orderEntry.stallName;
    }

    // Try first item's stallName
    if (orderEntry && Array.isArray(orderEntry.items)) {
      for (let i = 0; i < orderEntry.items.length; i++) {
        const sn = orderEntry.items[i].stallName;
        if (sn && String(sn).trim() !== "") return sn;
      }
    }

    return "Mixed Stalls";
  }

  function orderSignature(entry) {
    // push items in list so that it doesn't save the save thing repeatedly
    const items = entry.items || [];
    const parts = [];
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      parts.push(it.name + "|" + it.qty + "|" + it.price);
    }
    const pickup = entry.pickupType + "|" + (entry.pickupTime || "");
    return parts.join(";") + "||" + pickup;
  }

  // Load existing order history
  let history = cartParse("hc.orderHistory");
  if (!Array.isArray(history)) history = [];

  // Pull data from storage
  const store = cartParse("store") || { cart: [], order: null };
  const cart = Array.isArray(store.cart) ? store.cart : [];
  const order = store.order || { type: "now" };

  // Only create a history entry if there is a cart with items
  if (cart.length > 0) {
    const items = normaliseItems(cart);

    // Build an entry for history
    const entry = {
      id: makeId(),
      placedAt: Date.now(),
      pickupType: order.type === "later" ? "later" : "now",
      pickupTime: order.pickupTime || "",
      stallName: order.stallName || "",
      items: items
    };

    // remove copies against the last inserted entry
    const sig = orderSignature(entry);
    const lastSig = localStorage.getItem("hc.lastOrderSig");

    if (sig !== lastSig) {
      // Put newest at the top
      history.unshift(entry);
      saveJSON("hc.orderHistory", history);
      localStorage.setItem("hc.lastOrderSig", sig);
    }
  }

  // If no history, show message
  if (history.length === 0) {
    listContainer.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  // Sort newest first
  history.sort(function (a, b) {
    const ta = new Date(a.placedAt || 0).getTime();
    const tb = new Date(b.placedAt || 0).getTime();
    return tb - ta;
  });

  // Render history cards
  let html = "";

  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    const items = normaliseItems(entry.items || []);
    const stallTitle = guessStallName(entry);
    const orderLine = buildOrderLine(items);
    const customised = buildCustomisedLine(items);
    const dateText = formatDate(entry.placedAt);

    html += `
      <div class="history-card">
        <div class="info">
          <h3>${stallTitle}</h3>
          <p>Order: ${orderLine || "-"}</p>
          ${customised ? `<p>Customised: ${customised}</p>` : ""}
          <h5>Ordered on: ${dateText}</h5>
        </div>

        <a href="saved-order.html" class="btn" onclick="saveOrderFromHistory(${i});">
          <img src="../img/bookmark.png" style="width:30px;height:30px;" alt="bookmark">
        </a>
      </div>
    `;
  }

  listContainer.innerHTML = html;

  // Save order button (bookmark)
  window.saveOrderFromHistory = function (historyIndex) {
    const entry = history[historyIndex];
    if (!entry) return;

    const items = normaliseItems(entry.items || []);
    if (items.length === 0) return;

    let savedOrders = cartParse("hc.savedOrders");
    if (!Array.isArray(savedOrders)) savedOrders = [];

    const stallTitle = guessStallName(entry);
    const dateText = formatDate(entry.placedAt);

    const defaultName = guessStallName(entry);
    const userName = prompt("Name this saved order:", defaultName);

    // If user presses cancel or leaves blank, use default name
    const finalName = (userName && userName.trim() !== "") ? userName.trim() : defaultName;

    const savedObj = {
    id: makeId(),
    name: finalName,
    items: items.map(function (it) {
        return {
        name: it.name,
        qty: it.qty,
        price: Number(it.price) || 0,
        notes: it.notes || ""
    };
  })
};


    savedOrders.push(savedObj);
    saveJSON("hc.savedOrders", savedOrders);
  };
});
