// assets/js/cart.js

let store = JSON.parse(localStorage.getItem("store")) || {
  cart: [],
  order: null
};
function saveStore() {
  localStorage.setItem("store", JSON.stringify(store));
}
function getCart(){ return store.cart }
function setCart(cart){ store.cart = cart; saveStore();}
function addToCart(item){ store.cart.push(item); saveStore(); }
function clearCart(){ store.cart = []; saveStore(); }

function cartTotals(){
  let subtotal = store.cart.reduce(function(sum, item) {
    return sum + item.price * item.qty
  }, 0)
  return { cart: store.cart, subtotal: subtotal };
}
function getOrder() {
  return store.order;
}
function setOrder(order) {
  store.order = order;
  saveStore();
}
function clearOrder() {
  store.order = null;
  saveStore();
}