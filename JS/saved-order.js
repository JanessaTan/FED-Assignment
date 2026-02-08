document.addEventListener("DOMContentLoaded", function(){

  const container = document.getElementById("savedList");

  let savedOrders = JSON.parse(localStorage.getItem("hc.savedOrders")) || [];
  if(savedOrders.length === 0){
    savedOrders = [
      {
        id: "demo1",
        name: "My Usual Chicken Rice",
        items: [
          { name: "Hainanese Chicken Rice", qty: 1, notes: "Less rice, extra chilli" }
        ]
      },
      {
        id: "demo2",
        name: "Friday Treat",
        items: [
          { name: "Laksa", qty: 1, notes: "More sambal" },
          { name: "Kopi O", qty: 1, notes: "Less sugar" }
        ]
      }
    ];

    localStorage.setItem("hc.savedOrders", JSON.stringify(savedOrders));
  }

  render();

  function render(){
    savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];

    container.innerHTML = savedOrders.map(order => `
      <div style="background:white;padding:20px;margin:20px 0;border-radius:15px;">
        <h3 style="color:#1e5cc8;">${order.name}</h3>

        <div id="view-${order.id}">
          <ul>
            ${order.items.map((item,i) => `
              <li>
                ${item.name} (x${item.qty})<br/>
                <small>${item.notes || ""}</small>
              </li>
            `).join("")}
          </ul>
        </div>

        <div id="edit-${order.id}" style="display:none;">
          ${order.items.map((item,i) => `
            <div style="margin-bottom:15px;">
              <strong>${item.name}</strong><br/>
              Qty:
              <input type="number" min="1" value="${item.qty}" 
                     id="qty-${order.id}-${i}" style="width:60px;"><br/>
              Notes:<br/>
              <input type="text" value="${item.notes}" 
                     id="notes-${order.id}-${i}" style="width:250px;">
            </div>
          `).join("")}
          <button onclick="saveEdit('${order.id}')">Save Changes</button>
        </div>

        <button onclick="orderAgain('${order.id}')">Order Again</button>
        <button onclick="toggleEdit('${order.id}')">Edit</button>
        <button onclick="deleteOrder('${order.id}')">Delete</button>
      </div>
    `).join("");
  }

});

// edit function
function orderAgain(id){
  let savedOrders = JSON.parse(localStorage.getItem("hc.savedOrders")) || [];
  const selected = savedOrders.find(o => o.id === id);
  if(!selected) return;

  // Use store object
  let store = JSON.parse(localStorage.getItem("store")) || { cart: [], order: null };
  store.cart = selected.items;
  localStorage.setItem("store", JSON.stringify(store));

  window.location.href = "Checkout.html";
}


function toggleEdit(id){
  const viewDiv = document.getElementById("view-" + id);
  const editDiv = document.getElementById("edit-" + id);

  if(editDiv.style.display === "none"){
    editDiv.style.display = "block";
    viewDiv.style.display = "none";
  } else {
    editDiv.style.display = "none";
    viewDiv.style.display = "block";
  }
}

function saveEdit(id){
  let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];
  const order = savedOrders.find(o => o.id === id);
  if(!order) return;

  order.items.forEach((item, i) => {
    const qtyInput = document.getElementById(`qty-${id}-${i}`);
    const notesInput = document.getElementById(`notes-${id}-${i}`);

    item.qty = parseInt(qtyInput.value);
    item.notes = notesInput.value;
  });

  localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
  location.reload();
}

function deleteOrder(id){
  let savedOrders = JSON.parse(localStorage.getItem("savedOrders")) || [];
  savedOrders = savedOrders.filter(o => o.id !== id);

  localStorage.setItem("savedOrders", JSON.stringify(savedOrders));
  location.reload();
}