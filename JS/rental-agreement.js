/* Hawker Centre — Rental Agreement
 * App script: cuisine dynamics, T&C chips, signature pad, validation, and PDF export.
 * Requires: jsPDF (window.jspdf.jsPDF) and html2canvas (already included in your HTML).
 */
(() => {
  'use strict';

  /*************************************************
   * DATA: Cuisines & Terms
   *************************************************/
  const CUISINES = {
    Western: {
      overview:
        "Western cuisine features grilled meats, pasta, baked goods, salads and sauces like béchamel or demi-glace. Expect dairy usage and oven-based cooking.",
      badges: ["Grill", "Baked", "Dairy"],
      popularDishes: [
        "Grilled steak with fries",
        "Spaghetti Bolognese",
        "Roast chicken",
        "Fish & chips",
        "Caesar salad",
      ],
      hygieneTips: [
        "Hold chilled items at ≤ 5°C; hot foods ≥ 60°C.",
        "Separate raw and cooked areas to avoid cross-contamination.",
        "Sanitise cutting boards and knives between meat and vegetables.",
      ],
    },
    Chinese: {
      overview:
        "Chinese cuisine spans stir-fry, steaming and braising with soy, ginger and garlic. Rice and noodles are staples.",
      badges: ["Wok", "Steam", "Rice"],
      popularDishes: [
        "Hainanese chicken rice",
        "Char kway teow",
        "Sweet & sour pork",
        "Mapo tofu",
        "Dumplings",
      ],
      hygieneTips: [
        "Keep raw poultry separate and use dedicated chopping boards.",
        "Regularly skim oil and clean woks/hoods to reduce grease build-up.",
        "Rapidly cool broths; store in shallow containers.",
      ],
    },
    Malay: {
      overview:
        "Malay cuisine highlights coconut milk, spices and sambal. Common techniques include stewing and grilling (bakar).",
      badges: ["Spiced", "Coconut", "Halal-friendly"],
      popularDishes: ["Nasi lemak", "Satay", "Rendang", "Mee rebus", "Ikan bakar"],
      hygieneTips: [
        "Use food thermometers for curries/stews to ensure safe core temperatures.",
        "Store sambal and coconut-based gravies chilled when not in service.",
        "Label prep dates for perishable rempah (spice pastes).",
      ],
    },
    Indian: {
      overview:
        "Indian cuisine uses layered spices, tandoor baking and curries with lentils or dairy. Vegetarian options are common.",
      badges: ["Spices", "Tandoor", "Veg options"],
      popularDishes: [
        "Butter chicken",
        "Biryani",
        "Masala dosa",
        "Paneer tikka",
        "Chana masala",
      ],
      hygieneTips: [
        "Cool rice quickly to prevent Bacillus cereus growth; avoid keeping rice warm for long periods.",
        "Dedicate ladles for veg and non-veg gravies.",
        "Manage allergen info for nuts, milk and gluten.",
      ],
    },
    Thai: {
      overview:
        "Thai cuisine balances sweet, sour, salty and spicy with herbs like lemongrass and basil. Quick stir-fries and salads are common.",
      badges: ["Herbal", "Spicy-sour", "Seafood"],
      popularDishes: ["Pad Thai", "Green curry", "Tom yum", "Som tam", "Mango sticky rice"],
      hygieneTips: [
        "Keep raw seafood under strict cold chain; thaw in chiller, not at room temp.",
        "Rinse herbs thoroughly to remove soil and pests.",
        "Use gloves for ready-to-eat salads; change regularly.",
      ],
    },
  };

  const TERMS = {
    "Lease duration": `
      <p><strong>Term:</strong> The lease commences on the Start Date and ends on the End Date stated in Rental Details.</p>
      <p><strong>Renewal:</strong> Renewal is subject to performance, compliance, and written approval by the management at least 60 days before expiry.</p>
      <p><strong>Early termination:</strong> See <em>Termination</em> for rules and fees.</p>
    `,
    "Hygiene Rules": `
      <p><strong>Compliance:</strong> Tenant must comply with NEA food hygiene regulations and maintain A-grade cleanliness during inspections.</p>
      <p><strong>Segregation:</strong> Raw and cooked food handling must be strictly separated. Provide dedicated tools and colour-coded boards.</p>
      <p><strong>Waste:</strong> Dispose waste daily; oil and grease to be collected and handled via approved contractors.</p>
    `,
    "Termination": `
      <p><strong>By Landlord:</strong> Landlord may terminate for material breach, unpaid rent (≥14 days), or repeated hygiene failures.</p>
      <p><strong>By Tenant:</strong> Tenant may terminate with 60 days' written notice subject to settlement of outstanding charges.</p>
      <p><strong>Vacant Possession:</strong> Stall must be returned clean with fixtures in good condition, fair wear and tear excepted.</p>
    `,
    "Rental Fees": `
      <p><strong>Due Date:</strong> Rent is payable monthly in advance by the 1st business day via the Payment Method stated.</p>
      <p><strong>Late Charges:</strong> Late payment attracts a <em>1.5% monthly</em> interest or as permitted by law.</p>
      <p><strong>Adjustments:</strong> Utilities and cleaning fees may be separately billed based on usage.</p>
    `,
    "Insurance": `
      <p><strong>Coverage:</strong> Tenant shall maintain public liability insurance of at least SGD 1,000,000 and provide certificate upon request.</p>
      <p><strong>Food Safety:</strong> Recommend product liability coverage for foodborne incidents.</p>
    `,
    "Inspections": `
      <p><strong>Access:</strong> Landlord and authorities may conduct inspections during operating hours with reasonable notice, or without notice in emergencies.</p>
      <p><strong>Rectification:</strong> Non-compliances must be rectified within the stipulated timeline from written notice.</p>
    `,
  };

  /*************************************************
   * Helper: DOM references
   *************************************************/
  const $id = (x) => document.getElementById(x);

  const cuisineSelect   = $id('cuisineSelect');
  const cuisineSearch   = $id('cuisineSearch');
  const cuisineList     = $id('cuisineList');
  const cuisineBadges   = $id('cuisineBadges');
  const cuisineOverview = $id('cuisineOverview');
  const popularDishes   = $id('popularDishes');
  const hygieneTips     = $id('hygieneTips');

  const tcChips      = $id('tcChips');
  const termContent  = $id('termContent');

  const agreeCheck   = $id('agreeCheck');
  const signature    = $id('signature');
  const clearSigBtn  = $id('clearSig');
  const invertSigBtn = $id('invertSig');
  const signDate     = $id('signDate');
  const notes        = $id('notes');

  const acceptBtn    = $id('acceptBtn');
  const cancelBtn    = $id('cancelBtn');
  const downloadBtn  = $id('downloadPdf');
  const toast        = $id('toast');

  // Tenant/Rental fields used in PDF
  const tenantName   = $id('tenantName');
  const stallNumber  = $id('stallNumber');
  const hawkerCenter = $id('hawkerCenter');
  const agreementId  = $id('agreementId');
  const startDate    = $id('startDate');
  const endDate      = $id('endDate');
  const monthlyRent  = $id('monthlyRent');
  const deposit      = $id('deposit');
  const paymentMethod= $id('paymentMethod');
  const tenantEmail  = $id('tenantEmail');

  /*************************************************
   * State
   *************************************************/
  const state = {
    activeCuisine: null,
    activeTerm: null,
    accepted: false,
    blankSigDataURL: null, // to compare & detect blank signature
  };

  /*************************************************
   * Utilities
   *************************************************/
  const todayISO = () => {
    const d = new Date();
    const off = d.getTimezoneOffset();
    const local = new Date(d.getTime() - off * 60000);
    return local.toISOString().slice(0, 10);
  };

  const formatCurrency = (val) => {
    if (val === '' || val == null || isNaN(val)) return '';
    const num = Number(val);
    return `SGD ${num.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const showToast = (msg, tone = 'muted') => {
    toast.textContent = msg;
    toast.style.color =
      tone === 'ok' ? 'var(--ok)' :
      tone === 'warn' ? 'var(--warn)' :
      tone === 'danger' ? 'var(--danger)' :
      'var(--muted)';
    if (!msg) return;
    // Auto-clear after a while
    setTimeout(() => { if (toast.textContent === msg) toast.textContent = ''; }, 3500);
  };

  const setInvalid = (el, invalid) => {
    el.classList.toggle('invalid', !!invalid);
  };

  const emailValid = (email) => {
    if (!email) return false;
    // Simple, robust email pattern
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /*************************************************
   * Cuisine UI
   *************************************************/
  function initCuisineControls() {
    const names = Object.keys(CUISINES).sort();
    // <select>
    cuisineSelect.innerHTML = names.map(n => `<option value="${n}">${n}</option>`).join('');
    // datalist
    cuisineList.innerHTML = names.map(n => `<option value="${n}"></option>`).join('');

    // default
    setCuisine(names[0]);

    cuisineSelect.addEventListener('change', () => {
      setCuisine(cuisineSelect.value);
      cuisineSearch.value = cuisineSelect.value;
    });

    cuisineSearch.addEventListener('change', () => {
      const v = cuisineSearch.value.trim();
      if (CUISINES[v]) {
        setCuisine(v);
        cuisineSelect.value = v;
      } else if (v) {
        showToast('Cuisine not found. Choose from the list.', 'warn');
      }
    });
  }

  function setCuisine(name) {
    const data = CUISINES[name];
    if (!data) return;
    state.activeCuisine = name;

    // Overview
    cuisineOverview.textContent = data.overview || '';

    // Badges
    cuisineBadges.innerHTML = '';
    (data.badges || []).forEach(b => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = b;
      cuisineBadges.appendChild(span);
    });

    // Popular dishes
    popularDishes.innerHTML = '';
    (data.popularDishes || []).forEach(dish => {
      const li = document.createElement('li');
      li.textContent = dish;
      popularDishes.appendChild(li);
    });

    // Hygiene tips
    hygieneTips.innerHTML = '';
    (data.hygieneTips || []).forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      hygieneTips.appendChild(li);
    });
  }

  /*************************************************
   * Terms & Conditions Tabs
   *************************************************/
  function initTerms() {
    const keys = Object.keys(TERMS);
    tcChips.innerHTML = '';
    keys.forEach((k, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip' + (i === 0 ? ' active' : '');
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.textContent = k;
      btn.addEventListener('click', () => setActiveTerm(k));
      tcChips.appendChild(btn);
    });
    // default to first
    setActiveTerm(keys[0]);
  }

  function setActiveTerm(key) {
    state.activeTerm = key;
    // Active style
    [...tcChips.children].forEach(ch => {
      const isActive = ch.textContent === key;
      ch.classList.toggle('active', isActive);
      ch.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    // Content
    termContent.innerHTML = TERMS[key] || '<em class="muted">No content.</em>';
  }

  /*************************************************
   * Signature Pad
   *************************************************/
  const sig = {
    ctx: null,
    drawing: false,
    last: { x: 0, y: 0 },
    strokeStyle: '#000000',
    bg: '#ffffff',
    lineWidth: 2.2
  };

  function initSignaturePad() {
    const ctx = signature.getContext('2d');
    sig.ctx = ctx;
    setupCanvasResolution();

    // Pointer events for mouse/pen/touch
    signature.addEventListener('pointerdown', onPointerDown);
    signature.addEventListener('pointermove', onPointerMove);
    signature.addEventListener('pointerup', onPointerUp);
    signature.addEventListener('pointerleave', onPointerUp);
    signature.addEventListener('pointercancel', onPointerUp);

    // Buttons
    clearSigBtn.addEventListener('click', clearSignature);
    invertSigBtn.addEventListener('click', invertSignature);

    // Record a "blank" snapshot for comparison
    state.blankSigDataURL = signature.toDataURL('image/png');

    // Resize handling (optional): warn that resizing will clear signature
    window.addEventListener('resize', () => {
      const hadInk = !isSignatureBlank();
      setupCanvasResolution();
      if (hadInk) {
        showToast('Canvas resized. Please re-sign.', 'warn');
      }
      state.blankSigDataURL = signature.toDataURL('image/png');
      updateButtonsState();
    });
  }

  function setupCanvasResolution() {
    const dpr = window.devicePixelRatio || 1;
    const rect = signature.getBoundingClientRect();

    // Set internal pixel size
    signature.width  = Math.round(rect.width * dpr);
    signature.height = Math.round(rect.height * dpr);

    // Normalize drawing units to CSS pixels
    sig.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill background white
    sig.ctx.fillStyle = sig.bg;
    sig.ctx.fillRect(0, 0, rect.width, rect.height);

    // Stroke style
    sig.ctx.lineCap = 'round';
    sig.ctx.lineJoin = 'round';
    sig.ctx.lineWidth = sig.lineWidth;
    sig.ctx.strokeStyle = sig.strokeStyle;
  }

  function pointerPos(evt) {
    const rect = signature.getBoundingClientRect();
    return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
  }

  function onPointerDown(evt) {
    evt.preventDefault();
    signature.setPointerCapture(evt.pointerId);
    sig.drawing = true;
    sig.last = pointerPos(evt);
  }

  function onPointerMove(evt) {
    if (!sig.drawing) return;
    const p = pointerPos(evt);
    sig.ctx.beginPath();
    sig.ctx.moveTo(sig.last.x, sig.last.y);
    sig.ctx.lineTo(p.x, p.y);
    sig.ctx.stroke();
    sig.last = p;
  }

  function onPointerUp(evt) {
    if (!sig.drawing) return;
    sig.drawing = false;
    signature.releasePointerCapture?.(evt.pointerId);
    updateButtonsState();
  }

  function clearSignature() {
    const rect = signature.getBoundingClientRect();
    sig.ctx.fillStyle = sig.bg;
    sig.ctx.fillRect(0, 0, rect.width, rect.height);
    state.blankSigDataURL = signature.toDataURL('image/png');
    updateButtonsState();
    showToast('Signature cleared.');
  }

  function invertSignature() {
    const rect = signature.getBoundingClientRect();
    const img = sig.ctx.getImageData(0, 0, rect.width, rect.height);
    const data = img.data;
    for (let i = 0; i < data.length; i += 4) {
      data[i]   = 255 - data[i];     // R
      data[i+1] = 255 - data[i+1];   // G
      data[i+2] = 255 - data[i+2];   // B
      // alpha unchanged
    }
    sig.ctx.putImageData(img, 0, 0);
    updateButtonsState();
    showToast('Signature colors inverted.');
  }

  function isSignatureBlank() {
    // Compare current canvas PNG to the stored blank snapshot
    try {
      const now = signature.toDataURL('image/png');
      return now === state.blankSigDataURL;
    } catch {
      // Fallback: treat as not blank if any error
      return false;
    }
  }

  /*************************************************
   * Validation & Button Enablement
   *************************************************/
  const requiredFields = [
    tenantName, stallNumber, hawkerCenter,
    startDate, endDate, monthlyRent, deposit,
    paymentMethod, tenantEmail, signDate
  ];

  function validateFields() {
    let ok = true;

    requiredFields.forEach(el => {
      const empty = !el.value || el.value.toString().trim() === '';
      setInvalid(el, empty);
      if (empty) ok = false;
    });

    // Email
    const emailOK = emailValid(tenantEmail.value);
    setInvalid(tenantEmail, !emailOK);
    ok = ok && emailOK;

    // Dates: start <= end
    const s = startDate.value ? new Date(startDate.value) : null;
    const e = endDate.value ? new Date(endDate.value) : null;
    if (s && e && s > e) {
      setInvalid(startDate, true);
      setInvalid(endDate, true);
      ok = false;
      showToast('Start Date cannot be after End Date.', 'warn');
    } else {
      // If they were flagged before, clear flags
      if (s && e) {
        setInvalid(startDate, false);
        setInvalid(endDate, false);
      }
    }

    // Numbers >= 0
    const numOK = (el) => el.value !== '' && !isNaN(Number(el.value)) && Number(el.value) >= 0;
    setInvalid(monthlyRent, !numOK(monthlyRent));
    setInvalid(deposit, !numOK(deposit));
    ok = ok && numOK(monthlyRent) && numOK(deposit);

    return ok;
  }

  function updateButtonsState() {
    const formOK = validateFields();
    const hasSignature = !isSignatureBlank();
    const agreed = agreeCheck.checked;

    // Accept enabled only when all are satisfied
    acceptBtn.disabled = !(formOK && hasSignature && agreed);

    // Download is enabled only after acceptance
    downloadBtn.disabled = !state.accepted;
  }

  /*************************************************
   * PDF Export
   *************************************************/
  async function downloadPDF() {
    try {
      const { jsPDF } = window.jspdf || {};
      if (!jsPDF) {
        showToast('jsPDF not loaded. Check script includes.', 'danger');
        return;
      }
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const margin = 40;
      const pageWidth = doc.internal.pageSize.getWidth();
      const maxWidth = pageWidth - margin * 2;

      let y = margin;

      // Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Hawker Centre — Rental Agreement', margin, y);
      y += 20;

      // Agreement meta
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(11);

      const idVal = (agreementId.value && agreementId.value.trim()) || `AG-${Date.now()}`;
      if (!agreementId.value) agreementId.value = idVal; // backfill in form if empty

      const meta = [
        `Agreement ID: ${idVal}`,
        `Tenant: ${tenantName.value}`,
        `Email: ${tenantEmail.value}`,
        `Stall: ${stallNumber.value}`,
        `Hawker Centre: ${hawkerCenter.value}`,
        `Start Date: ${startDate.value}`,
        `End Date: ${endDate.value}`,
        `Monthly Rent: ${formatCurrency(monthlyRent.value)}`,
        `Deposit: ${formatCurrency(deposit.value)}`,
        `Payment Method: ${paymentMethod.value}`,
        `Cuisine: ${state.activeCuisine || ''}`,
        `Sign Date: ${signDate.value}`,
      ];

      meta.forEach(line => {
        doc.text(line, margin, y);
        y += 16;
      });

      y += 6;

      // Cuisine overview
      doc.setFont('Helvetica', 'bold');
      doc.text('Cuisine Overview', margin, y);
      y += 14;
      doc.setFont('Helvetica', 'normal');
      y = drawWrappedText(doc, CUISINES[state.activeCuisine]?.overview || '', margin, y, maxWidth, 14);

      // Popular dishes & hygiene tips
      y += 6;
      doc.setFont('Helvetica', 'bold');
      doc.text('Popular Dishes', margin, y);
      y += 14;
      doc.setFont('Helvetica', 'normal');
      (CUISINES[state.activeCuisine]?.popularDishes || []).forEach(d => {
        y = drawWrappedText(doc, `• ${d}`, margin, y, maxWidth, 14);
      });

      y += 6;
      doc.setFont('Helvetica', 'bold');
      doc.text('Hygiene Tips', margin, y);
      y += 14;
      doc.setFont('Helvetica', 'normal');
      (CUISINES[state.activeCuisine]?.hygieneTips || []).forEach(t => {
        y = drawWrappedText(doc, `• ${t}`, margin, y, maxWidth, 14);
      });

      // Notes
      if (notes.value && notes.value.trim()) {
        y += 10;
        doc.setFont('Helvetica', 'bold');
        doc.text('Notes', margin, y);
        y += 14;
        doc.setFont('Helvetica', 'normal');
        y = drawWrappedText(doc, notes.value.trim(), margin, y, maxWidth, 14);
      }

      // Signature
      y += 16;
      doc.setFont('Helvetica', 'bold');
      doc.text('Signature', margin, y);
      y += 8;
      const sigImg = signature.toDataURL('image/png');
      const sigW = Math.min(260, maxWidth);
      const sigH = 90;
      doc.addImage(sigImg, 'PNG', margin, y, sigW, sigH);
      y += sigH + 12;
      doc.setFont('Helvetica', 'normal');
      doc.text(`${tenantName.value}`, margin, y);

      // Save
      const filename = `Rental_Agreement_${idVal}.pdf`;
      doc.save(filename);
      showToast('PDF downloaded.', 'ok');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PDF. See console.', 'danger');
    }
  }

  function drawWrappedText(doc, text, x, y, maxWidth, lineHeight = 14) {
    if (!text) return y;
    const lines = doc.splitTextToSize(text, maxWidth);
    lines.forEach(line => {
      doc.text(line, x, y);
      y += lineHeight;
    });
    return y;
  }

  /*************************************************
   * Events: Accept / Cancel / Inputs
   *************************************************/
  function bindFormEvents() {
    // Default sign date = today
    signDate.value = signDate.value || todayISO();

    // Toggle enablement when things change
    [
      tenantName, stallNumber, hawkerCenter, agreementId,
      startDate, endDate, monthlyRent, deposit,
      paymentMethod, tenantEmail, signDate, notes, agreeCheck
    ].forEach(el => {
      el.addEventListener('input', updateButtonsState);
      el.addEventListener('change', updateButtonsState);
    });

    acceptBtn.addEventListener('click', () => {
      if (acceptBtn.disabled) return;
      state.accepted = true;
      updateButtonsState();
      showToast('Agreement accepted.', 'ok');
    });

    downloadBtn.addEventListener('click', downloadPDF);

    cancelBtn.addEventListener('click', () => {
      const go = confirm('Cancel and reset the agreement? This will clear the signature.');
      if (!go) return;
      resetForm();
    });
  }

  function resetForm() {
    [
      tenantName, stallNumber, hawkerCenter, agreementId,
      startDate, endDate, monthlyRent, deposit,
      paymentMethod, tenantEmail, notes
    ].forEach(el => { el.value = ''; setInvalid(el, false); });

    signDate.value = todayISO();
    agreeCheck.checked = false;
    state.accepted = false;

    // Reset cuisine to first
    const names = Object.keys(CUISINES).sort();
    setCuisine(names[0]);
    cuisineSelect.value = names[0];
    cuisineSearch.value = names[0];

    // Clear signature
    clearSignature();

    updateButtonsState();
    showToast('Form reset.', 'ok');
  }

  /*************************************************
   * Boot
   *************************************************/
  function init() {
    initCuisineControls();
    initTerms();
    initSignaturePad();
    bindFormEvents();
    updateButtonsState();
  }

  // DOM ready (defer ensures this runs after DOM construction)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();