/*
  File: js/destinations.js
  Purpose: Render destination cards from JSON, live search with debounce,
           category filters, sort, pagination (6/page), and a details
           modal that pre-fills the booking form via localStorage.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const grid = $("#destGrid");
  if (!grid) return; // not on destinations page

  const PER_PAGE = 6;
  let all = [];
  let filtered = [];
  let activeCat = "All";
  let query = "";
  let sortMode = "az";
  let page = 1;

  /* ---------- Render a single card ---------- */
  const cardHTML = (d) => `
    <article class="col-12 col-sm-6 col-lg-4">
      <div class="kingdom-card reveal">
        <div class="card-media">
          <span class="category-badge">${d.category}</span>
          <button class="fav-btn" data-fav-id="${d.id}" aria-label="Save ${d.name} to favourites">
            <i class="bi bi-heart"></i><i class="bi bi-heart-fill"></i>
          </button>
          <img src="${d.img}" alt="${d.name} in ${d.district} district, Lesotho" loading="lazy" onerror="this.src=window.IMG_FALLBACK">
        </div>
        <div class="card-body">
          <h3 class="card-title">${d.name}</h3>
          <p class="card-text mb-0"><i class="bi bi-geo-alt text-secondary"></i> ${d.district} district</p>
          <p class="card-text">${highlight(d.short, query)}</p>
          <div class="card-foot">
            <button class="btn btn-outline-kingdom btn-sm" data-details="${d.id}">Details</button>
            <button class="btn btn-link btn-sm p-0" data-book="${d.id}"><i class="bi bi-bookmark-plus"></i> Book this</button>
          </div>
        </div>
      </div>
    </article>`;

  /* ---------- Apply search + filter + sort ---------- */
  const applyFilters = () => {
    filtered = all.filter((d) => {
      const matchCat = activeCat === "All" || d.category === activeCat;
      const q = query.toLowerCase();
      const matchQ = !q || d.name.toLowerCase().includes(q) || d.district.toLowerCase().includes(q) || d.short.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    if (sortMode === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === "za") filtered.sort((a, b) => b.name.localeCompare(a.name));
    page = 1;
    render();
  };

  /* ---------- Render grid + pagination + empty state ---------- */
  const render = () => {
    const start = (page - 1) * PER_PAGE;
    const slice = filtered.slice(start, start + PER_PAGE);
    if (!filtered.length) {
      grid.innerHTML = `<div class="empty-state col-12">
        <i class="bi bi-search"></i>
        <h3>No destinations found</h3>
        <p>Try a different search term or category filter.</p>
      </div>`;
      $("#pagination").innerHTML = "";
      return;
    }
    grid.innerHTML = slice.map(cardHTML).join("");
    // restore favourite heart state
    $$(".fav-btn", grid).forEach((b) => { if (kingdomFav.has(b.dataset.favId)) b.classList.add("active"); });
    // pagination
    const pages = Math.ceil(filtered.length / PER_PAGE);
    const pag = $("#pagination");
    pag.innerHTML = pages <= 1 ? "" : Array.from({ length: pages }, (_, i) => `
      <li class="page-item ${i + 1 === page ? "active" : ""}">
        <a class="page-link" href="#" data-page="${i + 1}">${i + 1}</a>
      </li>`).join("");
    // reveal new cards
    $$(".reveal", grid).forEach((el) => el.classList.add("visible"));
    bindCardEvents();
  };

  /* ---------- Bind card buttons (delegated manually per render) ---------- */
  const bindCardEvents = () => {
    $$("[data-details]", grid).forEach((b) =>
      b.addEventListener("click", () => openDetails(b.dataset.details))
    );
    $$("[data-book]", grid).forEach((b) =>
      b.addEventListener("click", () => {
        const d = all.find((x) => x.id === b.dataset.book);
        localStorage.setItem("kingdom-booking", JSON.stringify({ destination: d.name }));
        kingdomToast(`${d.name} added to your booking. Redirecting…`);
        setTimeout(() => (location.href = "contact.html#booking"), 700);
      })
    );
    $$(".fav-btn", grid).forEach((b) =>
      b.addEventListener("click", () => {
        const d = all.find((x) => x.id === b.dataset.favId);
        const added = kingdomFav.toggle({ id: d.id, name: d.name, img: d.img, type: "destination", link: "destinations.html" });
        b.classList.toggle("active", added);
        kingdomToast(added ? `${d.name} saved to favourites` : `${d.name} removed`, added ? "success" : "warning");
      })
    );
  };

  /* ---------- Details modal ---------- */
  const openDetails = (id) => {
    const d = all.find((x) => x.id === id);
    if (!d) return;
    const body = `
      <img src="${d.img}" alt="${d.name}" class="img-fluid rounded mb-3" onerror="this.src=window.IMG_FALLBACK">
      <p>${d.desc}</p>
      <h5 class="mt-3">Best time to visit</h5><p>${d.best}</p>
      <h5>How to get there</h5><p>${d.getting}</p>
      <h5>Activities</h5>
      <ul>${d.activities.map((a) => `<li>${a}</li>`).join("")}</ul>
      <button class="btn btn-kingdom w-100 mt-2" id="modalBookBtn">Book this trip</button>`;
    $("#destModalTitle").textContent = `${d.name} — ${d.district} District`;
    $("#destModalBody").innerHTML = body;
    const modal = new bootstrap.Modal($("#destModal"));
    modal.show();
    $("#modalBookBtn").addEventListener("click", () => {
      localStorage.setItem("kingdom-booking", JSON.stringify({ destination: d.name }));
      modal.hide();
      kingdomToast(`${d.name} added to your booking. Redirecting…`);
      setTimeout(() => (location.href = "contact.html#booking"), 700);
    });
  };

  /* ---------- Event wiring ---------- */
  const init = async () => {
    grid.innerHTML = `<div class="col-12 text-center"><div class="spinner-ring" role="status" aria-label="Loading destinations"></div><p class="text-muted">Loading destinations…</p></div>`;
    all = await loadData("destinations");
    applyFilters();

    // Live search (debounced)
    $("#destSearch").addEventListener("input", debounce((e) => {
      query = e.target.value.trim();
      applyFilters();
    }, 250));

    // Category filter buttons
    $$("#filterBtns button").forEach((b) =>
      b.addEventListener("click", () => {
        activeCat = b.dataset.cat;
        $$("#filterBtns button").forEach((x) => x.classList.replace("btn-kingdom", "btn-outline-kingdom"));
        b.classList.replace("btn-outline-kingdom", "btn-kingdom");
        applyFilters();
      })
    );

    // Sort dropdown
    $("#sortSelect").addEventListener("change", (e) => {
      sortMode = e.target.value;
      applyFilters();
    });

    // Pagination clicks
    $("#pagination").addEventListener("click", (e) => {
      e.preventDefault();
      if (e.target.dataset.page) {
        page = parseInt(e.target.dataset.page, 10);
        render();
        grid.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    // Hero search (home page) deep link
    const qs = new URLSearchParams(location.search).get("q");
    if (qs) { query = qs; $("#destSearch").value = qs; applyFilters(); }
  };
  init();
})();
