(function () {

  const stallsEl = document.getElementById('stallList');

  const LOCAL_STALLS = [
    { id: 'gw', name: 'Golden Wok', cuisine: 'Chinese Cuisine', hours: '7:00am - 3:00pm', rating: 4.6 },
    { id: 'mcd', name: 'Mak Cik Delights', cuisine: 'Malay Cuisine', hours: '10:00am - 9:00pm', rating: 4.4 },
    { id: 'lie', name: 'Little India Express', cuisine: 'Indian Cuisine', hours: '8:00am - 9:00pm', rating: 4.3 },
    { id: 'tyh', name: 'Tom Yum House', cuisine: 'Thai Cuisine', hours: '11:00am - 10:00pm', rating: 4.5 },
    { id: 'wb', name: 'Western Bites', cuisine: 'Western Cuisine', hours: '8:00am - 10:00pm', rating: 4.2 },
    { id: 'ktc', name: 'Kopi & Teh Corner', cuisine: 'Beverages', hours: '8:00am - 10:00pm', rating: 4.7 }
  ];

  function loadStalls() {

    stallsEl.innerHTML = '';

    LOCAL_STALLS.forEach(s => {

      const card = document.createElement('div');
      card.className = 'stall-card';

      card.innerHTML = `
        <div class="stall-top">
          <h3>${s.name}</h3>
          <span class="stall-hours">
            Operating hours: ${s.hours}
          </span>
        </div>

        <div class="stall-desc">
          ${s.name} specialises in ${s.cuisine}. 
          Rated ⭐ ${s.rating}.
        </div>

        <div class="stall-actions">
          <a class="btn primary" href="menu.html?stall=${s.id}">
            View Menu
          </a>

          <a class="btn secondary" href="rating.html?stall=${s.id}">
            Ratings
          </a>

          <a class="btn muted" href="hygiene.html?stall=${s.id}">
            Hygiene
          </a>
        </div>
      `;

      stallsEl.appendChild(card);

    });
  }

  loadStalls();

})();
