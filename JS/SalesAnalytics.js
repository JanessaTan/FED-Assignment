/* assets/js/analytics.js */
// Summarize from local order history for demo
(function(){
  const hist = store.get(KEYS.ordersHistory,[]);
  const rev = hist.filter(h=>h.status==='paid').reduce((s,h)=>s+h.total,0);
  const cnt = hist.length;
  const avg = cnt? rev/cnt : 0;

  $('#cards').innerHTML = `
    <div class="card">
      <h3>Total Revenue</h3>
      <p>${fmt(rev)}</p>
    </div>

    <div class="card">
      <h3># Orders</h3>
      <p>${cnt}</p>
    </div>

    <div class="card">
      <h3>Avg Order Value</h3>
      <p>${fmt(avg)}</p>
    </div>
  `;
})();
