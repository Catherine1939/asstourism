
(() => {
  "use strict";

  /* ---------- DOM helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  window.kingdomToast = function (msg, type = "success") {
    let host = $("#toastHost");
    if (!host) {
      host = document.createElement("div");
      host.id = "toastHost";
      host.className = "toast-container position-fixed bottom-0 end-0 p-3";
      host.style.zIndex = "2100";
      document.body.appendChild(host);
    }
    const id = "t" + Date.now();
    const color = type === "error" ? "var(--error)" : type === "warning" ? "var(--warning)" : "var(--success)";
    const icon = type === "error" ? "bi-x-circle" : type === "warning" ? "bi-exclamation-triangle" : "bi-check-circle";
    host.insertAdjacentHTML("beforeend", `
      <div id="${id}" class="kingdom-toast toast align-items-center" role="alert" aria-live="polite">
        <div class="d-flex">
          <div class="toast-body"><i class="bi ${icon} me-2" style="color:${color}"></i>${msg}</div>
          <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>`);
    const el = document.getElementById(id);
    const t = new bootstrap.Toast(el, { delay: 4000 });
    t.show();
    el.addEventListener("hidden.bs.toast", () => el.remove());
  };

  const initTheme = () => {
    const root = document.documentElement;
    const saved = localStorage.getItem("kingdom-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    root.setAttribute("data-theme", theme);
    updateThemeIcon(theme);
  };
  const updateThemeIcon = (theme) => {
    $$(".theme-toggle .bi").forEach((i) => {
      i.classList.toggle("d-none", !i.dataset.theme === (theme !== i.dataset.theme));
    });
    $$(".theme-toggle").forEach((btn) => {
      const isDark = theme === "dark";
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.querySelector(".bi-sun")?.classList.toggle("d-none", !isDark);
      btn.querySelector(".bi-moon-stars")?.classList.toggle("d-none", isDark);
    });
  };
  const toggleTheme = () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("kingdom-theme", next);
    updateThemeIcon(next);
  };

  
  const initNavbar = () => {
    const nav = $(".navbar.kingdom-nav");
    if (!nav) return;
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

   $$(".navbar-collapse .nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        const collapse = $(".navbar-collapse");
        if (collapse.classList.contains("show")) {
          bootstrap.Collapse.getInstance(collapse)?.hide();
        }
      });
    });

  
    const path = window.location.pathname.split("/").pop() || "index.html";
    $$(".navbar-nav .nav-link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) link.classList.add("active");
    });
  };

  
  const initBackToTop = () => {
    const btn = document.createElement("button");
    btn.className = "back-to-top";
    btn.setAttribute("aria-label", "Back to top");
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(btn);
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 500), { passive: true });
  };

  
  const initReveal = () => {
    const items = $$(".reveal");
    if (!items.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach((i) => obs.observe(i));
  };

 
  const initCounters = () => {
    const counters = $$("[data-target]");
    if (!counters.length) return;
    const animate = (el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || "";
      const dec = target % 1 !== 0 ? 1 : 0;
      const dur = 1600;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target.toFixed(dec) + suffix;
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => obs.observe(c));
  };

  
  window.kingdomFav = (() => {
    const KEY = "kingdom-favourites";
    const get = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
    const set = (arr) => localStorage.setItem(KEY, JSON.stringify(arr));
    return {
      list: get,
      add(item) { const a = get(); if (!a.find((x) => x.id === item.id)) a.push(item); set(a); syncBadge(); },
      remove(id) { set(get().filter((x) => x.id !== id)); syncBadge(); },
      has(id) { return get().some((x) => x.id === id); },
      toggle(item) { if (this.has(item.id)) { this.remove(item.id); return false; } this.add(item); return true; },
    };
  })();
  const syncBadge = () => {
    const count = window.kingdomFav.list().length;
    $$(".fav-count").forEach((b) => {
      b.textContent = count;
      b.classList.toggle("show", count > 0);
    });
  };

  
  const initWelcome = () => {
    const name = localStorage.getItem("kingdom-user-name");
    if (!name) return;
    const bar = document.createElement("div");
    bar.className = "welcome-bar";
    bar.innerHTML = `Welcome back, <strong>${name}</strong> — ready to explore the Mountain Kingdom?`;
    document.body.prepend(bar);
  };

 
  const initWeather = async () => {
    const box = $("#weatherWidget");
    if (!box) return;
    const places = [
      { name: "Maseru", lat: -29.31, lon: 27.48 },
      { name: "Semonkong", lat: -29.28, lon: 28.01 },
    ];
    try {
      const results = await Promise.all(places.map(async (p) => {
        const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&current=temperature_2m,weathercode`);
        if (!r.ok) throw new Error("weather fetch failed");
        const d = await r.json();
        return { ...p, temp: Math.round(d.current.temperature_2m), code: d.current.weathercode };
      }));
      box.innerHTML = results.map((r) => `
        <span class="me-3"><i class="bi bi-geo-alt-fill text-warning"></i> ${r.name}: <strong>${r.temp}°C</strong></span>
      `).join("");
      box.removeAttribute("aria-busy");
    } catch {
      box.innerHTML = '<span class="text-muted"><i class="bi bi-cloud-slash"></i> Weather unavailable</span>';
    }
  };


  const initYear = () => $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  
  const initClearData = () => {
    $$("[data-action=clear-data]").forEach((btn) =>
      btn.addEventListener("click", () => {
        ["kingdom-user-name", "kingdom-theme", "kingdom-favourites", "kingdom-booking", "kingdom-itinerary", "kingdom-reg"].forEach((k) => localStorage.removeItem(k));
        kingdomToast("Your saved data has been cleared.", "warning");
        setTimeout(() => location.reload(), 900);
      })
    );
  };

 
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initNavbar();
    initBackToTop();
    initReveal();
    initCounters();
    syncBadge();
    initWelcome();
    initWeather();
    initYear();
    initClearData();
    $$(".theme-toggle").forEach((b) => b.addEventListener("click", toggleTheme));
  });
})();
s