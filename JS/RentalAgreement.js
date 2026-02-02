/* assets/js/rental.js */
(function(){
  const s = STALLS.find(x=>x.id===RENTAL.stallId);
  $('#root').innerHTML = `
    <h2>Rental Agreement – ${s.name}</h2>
    <table>
      <tr><th>Monthly Rent</th><td>${fmt(RENTAL.monthlyRent)}</td></tr>
      <tr><th>Start</th><td>${RENTAL.start}</td></tr>
      <tr><th>End</th><td>${RENTAL.end}</td></tr>
      <tr><th>Terms</th><td>${RENTAL.terms}</td></tr>
    </table>
  `;
})();
``