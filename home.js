/*
  File: js/home.js
  Purpose: Home-page only — render featured destinations from JSON,
           newsletter signup validation, and itinerary quick-add demo.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Featured destinations (first 4) ---------- */
  const feat = $("#featuredGrid");
  if (feat) {
    (async () => {
      const data = await loadData("destinations");
      feat.innerHTML = data.slice(0, 4).map((d) => `
        <article class="col-12 col-sm-6 col-lg-3">
          <a href="destinations.html" class="text-decoration-none text-reset d-block h-100">
            <div class="kingdom-card reveal">
              <div class="card-media">
                <span class="category-badge">${d.category}</span>
                <img src="${d.img}" alt="${d.name}, ${d.district} district" loading="lazy" onerror="this.src=window.IMG_FALLBACK">
              </div>
              <div class="card-body">
                <h3 class="card-title">${d.name}</h3>
                <p class="card-text">${d.short}</p>
                <span class="btn btn-link p-0 text-primary">Explore <i class="bi bi-arrow-right"></i></span>
              </div>
            </div>
          </a>
        </article>`).join("");
      $$(".reveal", feat).forEach((el) => el.classList.add("visible"));
    })();
  }

  /* ---------- Activities preview (first 6) ---------- */
  const act = $("#actPreview");
  if (act) {
    (async () => {
      const data = await loadData("activities");
      act.innerHTML = data.slice(0, 6).map((a) => `
        <div class="col-6 col-md-4 col-lg-2 text-center reveal">
          <a href="activities.html" class="text-decoration-none text-reset d-block">
            <div class="feature-icon mb-2"><i class="bi ${a.icon}"></i></div>
            <span class="small fw-semibold">${a.name}</span>
          </a>
        </div>`).join("");
      $$(".reveal", act).forEach((el) => el.classList.add("visible"));
    })();
  }

  /* ---------- Newsletter signup ---------- */
  const nl = $("#newsletterForm");
  if (nl) {
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("#nlEmail");
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRe.test(email.value.trim())) {
        email.classList.add("is-invalid");
        return;
      }
      email.classList.remove("is-invalid");
      email.classList.add("is-valid");
      kingdomToast(`Subscribed! We'll send deals to ${email.value.trim()}.`);
      nl.reset();
      setTimeout(() => email.classList.remove("is-valid"), 2000);
    });
  }

  /* ---------- Hero quick search ---------- */
  const hs = $("#heroSearchForm");
  if (hs) {
    hs.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = $("#heroSearchInput").value.trim();
      location.href = "destinations.html?q=" + encodeURIComponent(q);
    });
  }
})();
