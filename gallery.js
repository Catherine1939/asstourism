/*
  File: js/gallery.js
  Purpose: Render a CSS-grid masonry gallery, category filters, and a
           custom lightbox with prev/next, keyboard arrows, Esc to close,
           swipe on touch devices, and an image counter.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const grid = $("#galleryGrid");
  if (!grid) return;

  /* 18 real Lesotho photos (Wikimedia Commons, free licence) across 4
   * categories. tall images span 2 grid rows for a masonry effect. */
  const IMAGES = [
    { id:1, cat:"Landscapes", tall:true,  src:"https://upload.wikimedia.org/wikipedia/commons/0/09/Lesotho%2C_Drakenberg_mountains_%2850182014816%29.jpg", cap:"Drakensberg mountains, Lesotho" },
    { id:2, cat:"Landscapes", tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/f/f0/Lesotho_-_South_Africa_Border_-_Sani_Pass.jpg", cap:"Sani Pass border road" },
    { id:3, cat:"Landscapes", tall:true,  src:"https://upload.wikimedia.org/wikipedia/commons/4/47/Katse_Dam.jpg", cap:"Katse Dam reservoir" },
    { id:4, cat:"Landscapes", tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/2/20/Ts%27ehlanyane_National_Park.JPG", cap:"Tsehlanyane river valley" },
    { id:5, cat:"Culture",    tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/4/49/A_typical_village_in_Lesotho%2C_Africa.jpg", cap:"A typical Basotho village" },
    { id:6, cat:"Culture",    tall:true,  src:"https://upload.wikimedia.org/wikipedia/commons/6/68/16%2206%2207_first_time_wearing_Lesotho_hat.jpg", cap:"Wearing the mokorotlo hat" },
    { id:7, cat:"Culture",    tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/d/d6/Kome_Cave_Dwellings_%28Ha_Kome%29_in_Lesotho_-_2386.jpg", cap:"Ha Kome cave dwellings" },
    { id:8, cat:"Culture",    tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/6/67/685_Thaba_Bosiu.jpg", cap:"Thaba-Bosiu heritage plateau" },
    { id:9, cat:"Wildlife",   tall:true,  src:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Wandelen_door_Lesotho_%286353356555%29.jpg", cap:"Highland ponies &amp; shepherds" },
    { id:10,cat:"Wildlife",   tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/d/df/Typical_Houses_in_Lesotho.jpg", cap:"Highland homesteads" },
    { id:11,cat:"Wildlife",   tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Gorge_in_Lesotho_-_Flickr_-_Tjeerd.jpg", cap:"Gorge and river habitat" },
    { id:12,cat:"Wildlife",   tall:true,  src:"https://upload.wikimedia.org/wikipedia/commons/9/92/LS_Malealea_0112_001_%2817250892035%29.jpg", cap:"Basotho ponies at Malealea" },
    { id:13,cat:"Adventure",  tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/7/7f/Ditaba_Sani_Pass.jpg", cap:"4x4 on Sani Pass" },
    { id:14,cat:"Adventure",  tall:true,  src:"https://upload.wikimedia.org/wikipedia/commons/e/eb/LS_Malealea_0112_002_%2817043459867%29.jpg", cap:"Pony trek near Malealea" },
    { id:15,cat:"Adventure",  tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/a/a0/AfriSki.jpg", cap:"Skiing at Afriski" },
    { id:16,cat:"Adventure",  tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/d/d9/Lesotho_sky_%281569745050%29.jpg", cap:"Highland sky &amp; trails" },
    { id:17,cat:"Landscapes", tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/8/8d/Maletsunyanefalls.JPG", cap:"Maletsunyane Falls, Semonkong" },
    { id:18,cat:"Culture",    tall:false, src:"https://upload.wikimedia.org/wikipedia/commons/e/ec/Dibuka.jpg", cap:"Basotho cultural gathering" },
  ];

  let shown = IMAGES;
  let idx = 0;

  const render = () => {
    grid.innerHTML = shown.map((im) => `
      <figure class="gallery-item ${im.tall ? "tall" : ""}" data-id="${im.id}" role="button" tabindex="0" aria-label="Open ${im.cap}">
        <img src="${im.src}" alt="${im.cap}, Lesotho" loading="lazy" onerror="this.src=window.IMG_FALLBACK">
        <figcaption class="caption"><small>${im.cat}</small><br>${im.cap}</figcaption>
      </figure>`).join("");
    $$(".gallery-item", grid).forEach((el) => {
      el.addEventListener("click", () => open(parseInt(el.dataset.id, 10)));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter") open(parseInt(el.dataset.id, 10)); });
    });
  };

  /* ---------- Lightbox ---------- */
  const lb = $("#lightbox");
  const lbImg = $("#lbImage");
  const lbCap = $("#lbCaption");
  const lbCount = $("#lbCounter");

  const update = () => {
    const im = shown[idx];
    lbImg.src = im.src;
    lbImg.alt = im.cap;
    lbCap.textContent = im.cap;
    lbCount.textContent = `${idx + 1} / ${shown.length}`;
  };
  const open = (id) => {
    idx = shown.findIndex((x) => x.id === id);
    if (idx < 0) idx = 0;
    update();
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };
  const next = () => { idx = (idx + 1) % shown.length; update(); };
  const prev = () => { idx = (idx - 1 + shown.length) % shown.length; update(); };

  $("#lbNext").addEventListener("click", next);
  $("#lbPrev").addEventListener("click", prev);
  $("#lbClose").addEventListener("click", close);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  });

  /* Touch swipe support */
  let touchX = 0;
  lb.addEventListener("touchstart", (e) => (touchX = e.changedTouches[0].clientX), { passive: true });
  lb.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
  }, { passive: true });

  /* ---------- Category filter ---------- */
  $$("#galleryFilters button").forEach((b) =>
    b.addEventListener("click", () => {
      const cat = b.dataset.cat;
      $$("#galleryFilters button").forEach((x) => x.classList.replace("btn-kingdom", "btn-outline-kingdom"));
      b.classList.replace("btn-outline-kingdom", "btn-kingdom");
      shown = cat === "All" ? IMAGES : IMAGES.filter((i) => i.cat === cat);
      render();
    })
  );

  render();
})();
