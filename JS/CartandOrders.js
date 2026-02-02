// assets/js/cart.js
function getCart(){ return store.get(KEYS.cart, []); }
function setCart(c){ store.set(KEYS.cart, c); }
function addToCart(item){ const c=getCart(); c.push(item); setCart(c); }
function clearCart(){ setCart([]); }

function cartTotals(){
  const cart=getCart();
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  return { cart, subtotal };
}

function saveOrder(name='Saved Order'){
  const list = store.get(KEYS.savedOrders,[]);
  const id = 'so_' + Date.now();
  list.push({ id, name, items:getCart(), createdAt:new Date().toISOString() });
  store.set(KEYS.savedOrders, list);
  return id;
}

function addHistory({status,total,items,scheduledAt}){
  const hist = store.get(KEYS.ordersHistory,[]);
  hist.push({ id:'ord_'+Date.now(), status,total,items,scheduledAt, createdAt:new Date().toISOString() });
  store.set(KEYS.ordersHistory, hist);
}
``