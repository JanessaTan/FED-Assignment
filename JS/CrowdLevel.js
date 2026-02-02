/* assets/js/crowd.js */
(function(){
  function crowdTag(n){ 
    return n>70? `<span class="badge" style="background:#fee2e2;color:#991b1b">Busy (${n}%)</span>` :
           n>30? `<span class="badge" style="background:#fef9c3;color:#92400e">Moderate (${n}%)</span>` :
                 `<span class="badge" style="background:#dcfce7;color:#166534">Quiet (${n}%)</span>`;
  }
  const root = $('#root');
  root.innerHTML = `<h2>Crowd Level by Stall</h2>` + STALLS.map(s=>{
    const n = Math.floor(Math.random()*100); // demo
    return `<div class="row" style="justify-content:space-between;border-bottom:1px solid #eee;padding:8px 0">
      <div><strong>${s.name}</strong> • ${s.cuisine}</div>
      <div>${crowdTag(n)}</div>
    </div>`;
  }).join('');
})();