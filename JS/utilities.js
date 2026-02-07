// assets/js/utils.js
const $ = (sel, el=document)=>el.querySelector(sel);
const $$ = (sel, el=document)=>[...el.querySelectorAll(sel)];
const fmt = n => '$' + (Math.round(n*100)/100).toFixed(2);

const store = {
  get(k, d=null){ try{return JSON.parse(localStorage.getItem(k)) ?? d}catch{ return d }},
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); },
  remove(k){ localStorage.removeItem(k); }
};

function qs(name, url=window.location.search){
  const p=new URLSearchParams(url); return p.get(name);
}

function renderHeader(active=''){
  const role = store.get(KEYS.role,'guest');
  const links = `
    <a href="index.html" class="badge">Hub</a>
    <a href="home.html" ${active==='home'?'style="text-decoration:underline"':''}>Home</a>
    <a href="stalls.html" ${active==='stalls'?'style="text-decoration:underline"':''}>Stalls</a>
    <a href="crowd.html" ${active==='crowd'?'style="text-decoration:underline"':''}>Crowd</a>
    <a href="promotions.html" ${active==='promotions'?'style="text-decoration:underline"':''}>Promotions</a>
    <a href="order.html" ${active==='order'?'style="text-decoration:underline"':''}>Cart</a>
    <a href="history.html" ${active==='history'?'style="text-decoration:underline"':''}>History</a>
    ${ (role==='owner'||role==='operator') ? <a href="analytics.html">Analytics</a>:''}
    ${ (role==='owner'||role==='operator') ? <a href="rental.html">Rental</a>:''}
  `;
  const right = `
    <span class="badge">Role: ${role}</span>
    <select id="roleSel" title="switch role">
      <option ${role==='guest'?'selected':''}>guest</option>
      <option ${role==='customer'?'selected':''}>customer</option>
      <option ${role==='owner'?'selected':''}>owner</option>
      <option ${role==='operator'?'selected':''}>operator</option>
    </select>
  `;
  document.body.insertAdjacentHTML('afterbegin', 
   <header class="nav">
     <div class="nav-inner">
       <strong>HawkerHub</strong>
       <nav class="grow row" style="gap:12px">${links}</nav>
       <div class="row">${right}</div>
     </div>
   </header>
  );
  $('#roleSel').addEventListener('change', e=>{
    store.set(KEYS.role, e.target.value);
    location.reload();
  });
}

function requireRole(roles=['owner']){
  const role = store.get(KEYS.role,'guest');
  if(!roles.includes(role)){
    alert('This page is restricted. Switch role in header to proceed.');
    location.href = 'index.html';
  }
}
