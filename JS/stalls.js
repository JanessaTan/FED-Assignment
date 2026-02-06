(function () {

  const stallsEl = document.getElementById('stallList');

  function loadStalls() {

    stallsEl.innerHTML = '';

    STALLS.forEach(s => {

      const card = document.createElement('div');
      card.className = 'stall-card';

      card.innerHTML = `
        <div class="stall-top">
          <h3>${s.cuisine}</h3>
          <span class="stall-hours">
            Operating hours: ${s.hours}
          </span>
        </div>

        <div class="stall-desc">
          ${s.name} specialises in ${s.cuisine} cuisine. 
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
