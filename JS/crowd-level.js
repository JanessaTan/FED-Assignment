// Clean, student-friendly JavaScript
(function(){

  // ===== 1. Crowd Data (demo) =====
  const crowdData = {
    chinese: [2,9,3.5,4.5,6,8.5,1],
    indian:  [3,6,5,7,8,4,2],
    malay:   [1,4,6,5,7,3,2],
    thai:    [2,5,4,6,8,7,3],
    drink:   [5,6,7,8,6,5,4],
    western: [3,5,4,6,7,5,3]
  };

  const stallNames = {
    chinese: "Chinese Cuisine",
    indian: "Indian Cuisine",
    malay: "Malay Cuisine",
    thai: "Thai Cuisine",
    drink: "Drink Store",
    western: "Western Cuisine"
  };

  const chartTitle = document.getElementById("chart-title");
  const chartBars = document.getElementById("chart-bars");

  // ===== 2. Function to render chart =====
  function renderChart(stall){
    chartTitle.textContent = "Average Crowd Level of " + stallNames[stall];
    chartBars.innerHTML = "";

    const hours = ["10am","12pm","2pm","4pm","6pm","8pm","10pm"];

    crowdData[stall].forEach((value, index) => {
      const bar = document.createElement("div");
      bar.classList.add("hc-bar");
      bar.style.setProperty("--v", value);
      bar.setAttribute("aria-label", `${hours[index]} crowd level ${value}`);

      const label = document.createElement("span");
      label.classList.add("hc-bar__label");
      label.textContent = hours[index];

      const val = document.createElement("span");
      val.classList.add("hc-bar__value");
      val.textContent = value;

      bar.appendChild(label);
      bar.appendChild(val);

      chartBars.appendChild(bar);
    });
  }

  // ===== 3. Attach click event to stall names =====
  const stallElements = document.querySelectorAll(".hc-card__title.clickable");
  stallElements.forEach(titleEl => {
    titleEl.addEventListener("click", function(){
      const stall = this.closest(".hc-card").dataset.stall;
      renderChart(stall);
    });
  });

  // ===== 4. Load default chart =====
  renderChart("chinese");

})();
