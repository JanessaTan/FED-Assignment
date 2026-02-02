/* assets/js/order.js */
(function(){
  const root = $('#cart');
  function render(){
    const {cart, subtotal} = cartTotals();
    if(cart.length===0){ root.innerHTML='<p>Your cart is empty.</p>'; return; }
    root.innerHTML = `
      <table><thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Notes</th><th></th></tr></thead>
      <tbody>
      ${cart.map((i,idx)=>`
        <tr>
          <td>${i.name}</td>
          <td><input type="number" min="1" data-qty="${idx}" value="${i.qty}"/></td>
          <td>${fmt(i.price*i.qty)}</td>
          <td>${i.notes||''}</td>
          <td><button class="btn danger" data-del="${idx}">Remove</button></td>
        </tr>`).join('')}
      </tbody></table>
      <p><strong>Subtotal: ${fmt(subtotal)}</strong></p>
    `;
  }
  root.addEventListener('input', e=>{
    if(e.target.matches('input[type="number"][data-qty]')){
      const idx=+e.target.dataset.qty; const cart=getCart();
      cart[idx].qty=Math.max(1,parseInt(e.target.value||'1',10)); setCart(cart); render();
    }
  });
  root.addEventListener('click', e=>{
    if(e.target.matches('button[data-del]')){
      const idx=+e.target.dataset.del; const cart=getCart(); cart.splice(idx,1); setCart(cart); render();
    }
  });
  $('#save').addEventListener('click', ()=>{
    const id = saveOrder('Saved Order '+new Date().toLocaleTimeString());
    alert('Saved to list: '+id); 
    location.href='saved-orders.html';
  });
  render();
})();