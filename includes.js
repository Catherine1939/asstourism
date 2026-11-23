/*
  File: js/includes.js
  Purpose: Inject the shared navbar and footer markup into every page so
           the layout is consistent and there is no duplicated HTML.
           Runs before main.js boot so nav/theme behave identically.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

(() => {
  "use strict";

  const NAV_HTML = `
  <header>
    <a href="#main" class="skip-link">Skip to main content</a>
    <nav class="navbar navbar-expand-lg kingdom-nav fixed-top" aria-label="Primary navigation">
      <div class="container-x d-flex w-100 align-items-center justify-content-between">
        <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
          <span class="brand-mark"><i class="bi bi-triangle-fill"></i></span>
          <span>Kingdom in the Sky
            <span class="brand-tag">Discover Lesotho</span>
          </span>
        </a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="destinations.html">Destinations</a></li>
            <li class="nav-item"><a class="nav-link" href="accommodation.html">Stay</a></li>
            <li class="nav-item"><a class="nav-link" href="activities.html">Activities</a></li>
            <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
            <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
            <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
          </ul>
          <div class="nav-actions ms-lg-auto">
            <button type="button" class="fav-btn-icon" style="background:transparent;border:0;color:#fff;position:relative;" aria-label="Open favourites" data-bs-toggle="offcanvas" data-bs-target="#favOffcanvas">
              <i class="bi bi-heart" style="font-size:1.2rem"></i>
              <span class="fav-count">0</span>
            </button>
            <button type="button" class="theme-toggle" aria-label="Toggle dark mode">
              <i class="bi bi-sun d-none" data-theme="light"></i>
              <i class="bi bi-moon-stars" data-theme="dark"></i>
            </button>
            <a href="contact.html#booking" class="btn btn-accent d-none d-lg-inline-flex">Book Your Trip</a>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <!-- Favourites offcanvas (saved items from any page) -->
  <div class="offcanvas offcanvas-end kingdom-modal" tabindex="-1" id="favOffcanvas" aria-labelledby="favTitle">
    <div class="offcanvas-header">
      <h2 class="offcanvas-title h5" id="favTitle">Your Favourites</h2>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body" id="favBody">
      <p class="text-muted">No favourites yet. Tap the heart on any card to save it here.</p>
    </div>
  </div>
  `;

  const FOOT_HTML = `
  <footer class="kingdom-footer">
    <div class="container-x">
      <div class="row g-4">
        <!-- Breakpoints used in this grid: col-12 (mobile) col-sm-6 (tablet) col-lg-3 (desktop) -->
        <div class="col-12 col-sm-6 col-lg-3">
          <h5>Kingdom in the Sky</h5>
          <p class="small">Discover Lesotho. Walk above the clouds. The official student-built tourism guide to the Mountain Kingdom.</p>
          <div class="d-flex gap-2 mt-3">
            <a href="#" class="social-btn" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="#" class="social-btn" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            <a href="#" class="social-btn" aria-label="X (Twitter)"><i class="bi bi-twitter-x"></i></a>
            <a href="#" class="social-btn" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
          </div>
        </div>
        <div class="col-6 col-sm-3 col-lg-2">
          <h5>Explore</h5>
          <ul class="list-unstyled small">
            <li class="mb-1"><a href="destinations.html">Destinations</a></li>
            <li class="mb-1"><a href="accommodation.html">Where to stay</a></li>
            <li class="mb-1"><a href="activities.html">Activities</a></li>
            <li class="mb-1"><a href="gallery.html">Gallery</a></li>
            <li class="mb-1"><a href="about.html">About Lesotho</a></li>
          </ul>
        </div>
        <div class="col-6 col-sm-3 col-lg-2">
          <h5>Plan</h5>
          <ul class="list-unstyled small">
            <li class="mb-1"><a href="contact.html#booking">Book a trip</a></li>
            <li class="mb-1"><a href="contact.html#contact">Contact us</a></li>
            <li class="mb-1"><a href="contact.html#register">Create account</a></li>
            <li class="mb-1"><button type="button" class="btn btn-link p-0 text-decoration-none small" data-action="clear-data">Clear my data</button></li>
          </ul>
        </div>
        <div class="col-12 col-sm-12 col-lg-5">
          <h5>Stay in touch</h5>
          <address class="small mb-2">
            <i class="bi bi-geo-alt"></i> Kingsway Rd, Maseru, Lesotho<br>
            <i class="bi bi-telephone"></i> <a href="tel:+26658000000">+266 5800 0000</a><br>
            <i class="bi bi-envelope"></i> <a href="mailto:hello@kingdominthesky.ls">hello@kingdominthesky.ls</a>
          </address>
          <p class="small text-muted mb-0">Image credits: Wikimedia Commons (free-licence photos of Lesotho). Built for a BSc IT Web Design assignment — sample data.</p>
        </div>
      </div>
      <div class="footer-bottom d-flex flex-wrap justify-content-between gap-2">
        <span>© <span data-year></span> Kingdom in the Sky — BIWD2110 assignment</span>
        <span>Made with HTML5, CSS3, Bootstrap 5 &amp; vanilla JS</span>
      </div>
    </div>
  </footer>
  `;

  /* Insert navbar at the very top of <body>, footer at the bottom.
   * main.js boot runs on DOMContentLoaded so the injected markup exists. */
  const inject = (name, html, where) => {
    const slot = document.createElement("div");
    slot.innerHTML = html.trim();
    document.body[where === "before" ? "prepend" : "append"](slot.firstElementChild);
    // append any subsequent siblings (offcanvas lives after header)
    while (slot.firstElementChild) document.body.appendChild(slot.firstElementChild);
  };

  document.body.insertAdjacentHTML("afterbegin", NAV_HTML);
  document.body.insertAdjacentHTML("beforeend", FOOT_HTML);

  /* Populate favourites offcanvas each time it opens */
  const renderFav = () => {
    const body = document.getElementById("favBody");
    if (!body) return;
    const items = window.kingdomFav ? window.kingdomFav.list() : [];
    if (!items.length) {
      body.innerHTML = '<p class="text-muted">No favourites yet. Tap the heart on any card to save it here.</p>';
      return;
    }
    body.innerHTML =
      '<div class="list-group">' +
      items
        .map(
          (it) => `
        <div class="list-group-item d-flex gap-2 align-items-center bg-transparent border-0 border-bottom p-2">
          <img src="${it.img}" alt="" width="48" height="48" style="object-fit:cover;border-radius:8px" onerror="this.src=window.IMG_FALLBACK">
          <div class="flex-fill">
            <strong class="d-block small">${it.name}</strong>
            <span class="text-muted" style="font-size:.78rem;text-transform:capitalize">${it.type}</span>
          </div>
          <button class="btn btn-sm btn-outline-danger" data-fav-remove="${it.id}" aria-label="Remove ${it.name}"><i class="bi bi-trash"></i></button>
        </div>`
        )
        .join("") +
      "</div>" +
      '<button class="btn btn-outline-kingdom w-100 mt-3" data-action="clear-favs">Clear all</button>';
    body.querySelectorAll("[data-fav-remove]").forEach((b) =>
      b.addEventListener("click", () => {
        window.kingdomFav.remove(b.dataset.favRemove);
        renderFav();
      })
    );
    body.querySelector("[data-action=clear-favs]")?.addEventListener("click", () => {
      localStorage.removeItem("kingdom-favourites");
      location.reload();
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    const oc = document.getElementById("favOffcanvas");
    oc?.addEventListener("show.bs.offcanvas", renderFav);
  });
})();
