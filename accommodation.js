/*
  File: js/accommodation.js
  Purpose: Render accommodation cards, filter by type + price range,
           comparison table, FAQ accordion is static in HTML. "Book now"
           saves choice to localStorage and routes to the booking form.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const grid = $("#accGrid");
  if (!grid) return;

  let all = [];
  let activeType = "All";
  let maxPrice = 3000;

  const cardHTML = (a) => `
    <article class="col-12 col-sm-6 col-lg-4 col-xxl-3">
      <div class="kingdom-card reveal">
        <div class="card-media">
          <span class="category-badge accent">${a.type}</span>
          <button class="fav-btn" data-fav-id="${a.id}" aria-label="Save ${a.name}">
            <i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i>
          </button>
          <img src="${a.img}" alt="${a.name}, a ${a.type} in ${a.location}, Lesotho" loading="lazy" onerror="this.src=window.IMG_FALLBACK">
        </div>
        <div class="card-body">
          <h3 class="card-title">${a.name}</h3>
          <p class="card-text mb-1"><i class="bi bi-geo-alt text-secondary"></i> ${a.location}</p>
          ${renderStars(a.rating)}
          <div class="d-flex flex-wrap gap-1 my-2">
            ${a.amenities.map((m) => `<span class="amenity-badge"><i class="bi bi-check2-circle"></i> ${m}</span>`).join("")}
          </div>
          <div class="card-foot">
            <strong class="text-primary">M ${a.price.toLocaleString()}<small class="text-muted fw-normal">/night</small></strong>
            <button class="btn btn-kingdom btn-sm" data-acc-book="${a.id}">Book now</button>
          </div>
        </div>
      </div>
    </article>`;

  const applyFilters = () => {
    const list = all.filter((a) =>
      (activeType === "All" || a.type === activeType) && a.price <= maxPrice
    );
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state col-12"><i class="bi bi-house-x"></i><h3>No stays match</h3><p>Try a higher budget or different type.</p></div>`;
      return;
    }
    grid.innerHTML = list.map(cardHTML).join("");
    $$(".fav-btn", grid).forEach((b) => { if (kingdomFav.has(b.dataset.favId)) b.classList.add("active"); });
    $$(".reveal", grid).forEach((el) => el.classList.add("visible"));
    $$("[data-acc-book]", grid).forEach((b) =>
      b.addEventListener("click", () => {
        const a = all.find((x) => x.id === b.dataset.accBook);
        localStorage.setItem("kingdom-booking", JSON.stringify({ accommodation: a.name, price: a.price }));
        kingdomToast(`${a.name} selected. Redirecting to booking…`);
        setTimeout(() => (location.href = "contact.html#booking"), 700);
      })
    );
    $$(".fav-btn", grid).forEach((b) =>
      b.addEventListener("click", () => {
        const a = all.find((x) => x.id === b.dataset.favId);
        const added = kingdomFav.toggle({ id: a.id, name: a.name, img: a.img, type: "stay", link: "accommodation.html" });
        b.classList.toggle("active", added);
        kingdomToast(added ? `${a.name} saved` : `${a.name} removed`, added ? "success" : "warning");
      })
    );
  };

  const init = async () => {
    grid.innerHTML = `<div class="col-12 text-center"><div class="spinner-ring" role="status"></div><p class="text-muted">Loading accommodation…</p></div>`;
    all = await loadData("accommodation");

    // price slider setup
    const slider = $("#priceSlider");
    const label = $("#priceLabel");
    const cap = Math.max(...all.map((a) => a.price));
    slider.max = Math.ceil(cap / 100) * 100;
    slider.value = slider.max;
    maxPrice = parseInt(slider.value, 10);
    label.textContent = `Up to M ${maxPrice.toLocaleString()}`;
    slider.addEventListener("input", () => {
      maxPrice = parseInt(slider.value, 10);
      label.textContent = `Up to M ${maxPrice.toLocaleString()}`;
      applyFilters();
    });

    // type filter buttons
    $$("#typeBtns button").forEach((b) =>
      b.addEventListener("click", () => {
        activeType = b.dataset.type;
        $$("#typeBtns button").forEach((x) => x.classList.replace("btn-kingdom", "btn-outline-kingdom"));
        b.classList.replace("btn-outline-kingdom", "btn-kingdom");
        applyFilters();
      })
    );
    applyFilters();
  };
  init();
})();
