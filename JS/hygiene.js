(function () {
  // Get DOM element
  const hygieneContent = document.getElementById("hygieneContent");

  // Read stall from URL query string
  const stallId = new URLSearchParams(window.location.search).get("stall");

  // Store all data as JSON in one object (for easy display)
  const hygieneData = {
    "golden-wok": {
      name: "Golden Wok",
      records: [
        { validFrom: "01.01.2024", validTo: "31.12.2024", grade: "B", remarks: "-" },
        { validFrom: "01.01.2025", validTo: "31.12.2026", grade: "B", remarks: "-" },
        { validFrom: "01.01.2027", validTo: "31.12.2027", grade: "A", remarks: "Improved cleanliness" }
      ]
    },

    "mak-cik-delights": {
      name: "Mak Cik Delights",
      records: [
        { validFrom: "01.01.2024", validTo: "31.12.2024", grade: "A", remarks: "-" },
        { validFrom: "01.01.2025", validTo: "31.12.2026", grade: "B", remarks: "Minor storage issue" },
        { validFrom: "01.01.2027", validTo: "31.12.2027", grade: "A", remarks: "Passed re-inspection" }
      ]
    },

    "little-india-express": {
      name: "Little India Express",
      records: [
        { validFrom: "01.01.2024", validTo: "31.12.2024", grade: "A", remarks: "-" },
        { validFrom: "01.01.2025", validTo: "31.12.2026", grade: "A", remarks: "Consistently clean" },
        { validFrom: "01.01.2027", validTo: "31.12.2027", grade: "B", remarks: "-" }
      ]
    },

    "tom-yum-house": {
      name: "Tom Yum House",
      records: [
        { validFrom: "01.01.2024", validTo: "31.12.2024", grade: "B", remarks: "-" },
        { validFrom: "01.01.2025", validTo: "31.12.2026", grade: "C", remarks: "Improvement required" },
        { validFrom: "01.01.2027", validTo: "31.12.2027", grade: "B", remarks: "Re-inspection passed" }
      ]
    },

    "western-bites": {
      name: "Western Bites",
      records: [
        { validFrom: "01.01.2024", validTo: "31.12.2024", grade: "A", remarks: "-" },
        { validFrom: "01.01.2025", validTo: "31.12.2026", grade: "A", remarks: "Clean and tidy" }
      ]
    },

    "kopi-teh-corner": {
      name: "Kopi & Teh Corner",
      records: [
        { validFrom: "01.01.2024", validTo: "31.12.2024", grade: "B", remarks: "Ice machine cleaning reminder" },
        { validFrom: "01.01.2025", validTo: "31.12.2026", grade: "A", remarks: "All issues resolved" },
        { validFrom: "01.01.2027", validTo: "31.12.2027", grade: "A", remarks: "-" }
      ]
    }
  };

  // Show specific tables after a stall is selected, or show all tables by default
  let stallsToRender;

  if (stallId && hygieneData[stallId]) {
    stallsToRender = {};
    stallsToRender[stallId] = hygieneData[stallId];
  } 
  else {
    stallsToRender = hygieneData;
  }

  // Make a row
  function buildRow(stallName, records) {
    let rowsHTML = "";

    for (let i = 0; i < records.length; i++) {
      const r = records[i];
      rowsHTML += `
        <tr>
          <td>${r.validFrom}</td>
          <td>${r.validTo}</td>
          <td class="grade grade-${r.grade}">${r.grade}</td>
          <td>${r.remarks ? r.remarks : "-"}</td>
        </tr>
      `;
    }

    // Build the table
    return `
      <section class="hygiene-section">
        <h3 class="hygiene-stall-title">${stallName}</h3>

        <table class="hygiene-table">
          <thead>
            <tr>
              <th>Valid From</th>
              <th>Valid To</th>
              <th>Hygiene Grade</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </section>
    `;
  }

  // Render all / selected stall tables into Hygiene.html
  function renderHygiene() {
    let html = "";

    const keys = Object.keys(stallsToRender);

    // If there are no records, display an error message
    if (keys.length === 0) {
      hygieneContent.innerHTML = "<p>No hygiene records available.</p>";
      return;
    }

    // Define stall info and load the HTML
    for (let k = 0; k < keys.length; k++) {
      const id = keys[k];
      const stall = stallsToRender[id];

      if (!stall || !stall.records || stall.records.length === 0) {
        html += `
          <section class="hygiene-section">
            <h3 class="hygiene-stall-title">${stall ? stall.name : "Stall"}</h3>
            <p>No hygiene records available.</p>
          </section>
        `;
      } else {
        html += buildRow(stall.name, stall.records);
      }
    }

    hygieneContent.innerHTML = html;
  }

  renderHygiene();
})();
