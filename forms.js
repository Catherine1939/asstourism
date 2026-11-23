/*
  File: js/forms.js
  Purpose: Validate three contact-page forms (booking, contact, register),
           live booking cost calculator with currency switch + printable
           summary, password strength meter, and welcome-back + booking
           pre-fill from localStorage. Shows a confirmation modal with a
           reference number.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  const isContact = document.body.dataset.page === "contact";
  const RATE = 18.5; // sample M -> USD rate

  /* ---------- Validation helpers ---------- */
  // Lesotho phone: +266 followed by 8 digits (5/6/2 prefix common)
  const phoneRe = /^(\+?266|0)?\s?[256]\d{7}$/;
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const setValid = (el, ok, msg = "") => {
    el.classList.remove("is-valid", "is-invalid");
    el.classList.add(ok ? "is-valid" : "is-invalid");
    const fb = el.nextElementSibling?.classList.contains("invalid-feedback")
      ? el.nextElementSibling
      : el.parentElement.querySelector(".invalid-feedback, .valid-feedback");
    if (fb && msg) fb.textContent = msg;
  };

  const validateField = (el) => {
    if (el.tagName === "BUTTON" || el.type === "checkbox") return true;
    const val = el.value.trim();
    if (el.required && !val) { setValid(el, false, "This field is required."); return false; }
    if (!val) { el.classList.remove("is-valid", "is-invalid"); return true; }
    if (el.type === "email" && !emailRe.test(val)) { setValid(el, false, "Enter a valid email address."); return false; }
    if (el.type === "tel" && !phoneRe.test(val.replace(/\s/g, ""))) { setValid(el, false, "Use a Lesotho number e.g. +266 5XXX XXXX."); return false; }
    if (el.dataset.match) {
      const other = document.getElementById(el.dataset.match);
      if (other && val !== other.value) { setValid(el, false, "Values do not match."); return false; }
    }
    setValid(el, true, "Looks good!");
    return true;
  };

  const validateForm = (form) => {
    let ok = true;
    $$("input, select, textarea", form).forEach((el) => {
      if (el.type === "hidden" || el.disabled) return;
      if (!validateField(el)) ok = false;
    });
    return ok;
  };

  /* ---------- Password strength meter ---------- */
  const scorePassword = (pw) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0..4
  };
  const initPwMeter = () => {
    const pw = $("#regPassword");
    const meter = $("#pwMeter");
    const label = $("#pwLabel");
    if (!pw) return;
    pw.addEventListener("input", () => {
      const s = scorePassword(pw.value);
      const pct = [10, 35, 60, 80, 100][s];
      const cls = ["pw-weak", "pw-weak", "pw-medium", "pw-medium", "pw-strong"][s];
      const txt = ["Very weak", "Weak", "Fair", "Good", "Strong"][s];
      meter.querySelector(".bar").style.width = pct + "%";
      meter.querySelector(".bar").className = "bar " + cls;
      label.textContent = pw.value ? `Strength: ${txt}` : "";
    });
  };

  /* ---------- Date validation: no past, checkout after checkin ---------- */
  const initDates = () => {
    const ci = $("#checkinDate");
    const co = $("#checkoutDate");
    if (!ci || !co) return;
    const today = new Date().toISOString().split("T")[0];
    ci.min = today;
    ci.addEventListener("change", () => {
      if (ci.value && ci.value < today) { setValid(ci, false, "Check-in cannot be in the past."); return; }
      co.min = ci.value;
      if (co.value && co.value <= ci.value) { co.value = ""; setValid(co, false, "Select a date after check-in."); }
      validateField(ci);
    });
    co.addEventListener("change", () => {
      if (ci.value && co.value && co.value <= ci.value) { setValid(co, false, "Check-out must be after check-in."); return; }
      validateField(co);
      recalc();
    });
    ci.addEventListener("change", recalc);
  };

  /* ---------- Booking cost calculator ----------
   * total = nights × pricePerNight × rooms + activities × people + extras
   * Extras: airport transfer, guide, meals (checkboxes with data-cost).
   */
  const recalc = () => {
    const out = $("#costBreakdown");
    if (!out) return;
    const ci = $("#checkinDate").value;
    const co = $("#checkoutDate").value;
    const nights = ci && co && co > ci ? Math.max(1, (new Date(co) - new Date(ci)) / 86400000) : 0;
    const rooms = parseInt($("#rooms").value, 10) || 1;
    const people = (parseInt($("#adults").value, 10) || 0) + (parseInt($("#children").value, 10) || 0);
    const pricePerNight = parseInt($("#accPrice").value, 10) || 0;
    const activityCost = $$("[name=activities]:checked").reduce((s, c) => s + parseInt(c.dataset.cost || 0, 10), 0) * people;
    const extras = $$("[data-extra]:checked").reduce((s, c) => s + parseInt(c.dataset.extra, 10), 0) * (people || 1);

    const sub = nights * pricePerNight * rooms + activityCost + extras;
    const currency = $("#currency").value;
    const fmt = (n) => (currency === "USD" ? "$" : "M ") + Math.round(n).toLocaleString();

    const rows = [
      ["Rooms × nights", `${rooms} × ${nights} × ${pricePerNight}`, fmt(rooms * nights * pricePerNight)],
      ["Activities", `${activityCost ? people : 0} guests`, fmt(activityCost)],
      ["Extras", "", fmt(extras)],
    ];
    out.innerHTML = `
      <table class="table kingdom-table mb-0">
        <tbody>
          ${rows.map((r) => `<tr><td>${r[0]}</td><td class="text-muted">${r[1]}</td><td class="text-end fw-semibold">${r[2]}</td></tr>`).join("")}
          <tr><th colspan="2" class="text-end">Estimated total</th><td class="text-end"><strong>${fmt(sub)}</strong></td></tr>
        </tbody>
      </table>`;
    out.dataset.total = sub;
  };

  /* ---------- Currency switch ---------- */
  const initCurrency = () => {
    const cur = $("#currency");
    if (!cur) return;
    cur.addEventListener("change", () => {
      const isUSD = cur.value === "USD";
      $$("[data-price-m]").forEach((el) => {
        const m = parseFloat(el.dataset.priceM);
        el.textContent = isUSD ? "$" + Math.round(m / RATE) : "M " + Math.round(m);
      });
      recalc();
    });
  };

  /* ---------- Pre-fill booking from localStorage ---------- */
  const prefillBooking = () => {
    if (!isContact) return;
    const saved = JSON.parse(localStorage.getItem("kingdom-booking") || "{}");
    if (saved.destination && $("#bookDestination")) {
      const opt = $$(`#bookDestination option`).find((o) => o.value === saved.destination);
      if (opt) opt.selected = true;
    }
    if (saved.accommodation && $("#bookAccommodation")) {
      $$(`#bookAccommodation option`).find((o) => o.text.includes(saved.accommodation))?.setAttribute("selected", "selected");
      if (saved.price) $("#accPrice").value = saved.price;
    }
  };

  /* ---------- Show confirmation modal with reference number ---------- */
  const showConfirmation = (name, ref, summary) => {
    $("#confName").textContent = name;
    $("#confRef").textContent = ref;
    $("#confSummary").innerHTML = summary;
    new bootstrap.Modal($("#confirmModal")).show();
  };

  /* ---------- Submit handlers ---------- */
  const initBookingForm = () => {
    const f = $("#bookingForm");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(f)) { kingdomToast("Please fix the highlighted fields.", "error"); return; }
      const name = $("#bookFullName").value.trim();
      const ref = "LT-2026-" + Math.floor(10000 + Math.random() * 89999);
      const total = $("#costBreakdown").dataset.total || "0";
      const cur = $("#currency").value;
      const summary = `
        <p><strong>Destination:</strong> ${$("#bookDestination").value}</p>
        <p><strong>Dates:</strong> ${$("#checkinDate").value} → ${$("#checkoutDate").value}</p>
        <p><strong>Guests:</strong> ${parseInt($("#adults").value || 0) + parseInt($("#children").value || 0)}</p>
        <p><strong>Estimated total:</strong> ${cur === "USD" ? "$" : "M "}${Math.round(total).toLocaleString()}</p>`;
      localStorage.setItem("kingdom-booking", JSON.stringify({ ref, destination: $("#bookDestination").value, total }));
      showConfirmation(name, ref, summary);
      f.reset();
      f.classList.remove("was-validated");
      $$(".is-valid, .is-invalid", f).forEach((el) => el.classList.remove("is-valid", "is-invalid"));
      recalc();
    });
    // live recalc on any input
    f.addEventListener("input", recalc);
    f.addEventListener("change", recalc);
  };

  const initContactForm = () => {
    const f = $("#contactForm");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(f)) { kingdomToast("Please fix the highlighted fields.", "error"); return; }
      kingdomToast(`Thanks ${$("#contactName").value.trim()} — we'll reply within 48 hours.`);
      f.reset();
      $$(".is-valid, .is-invalid", f).forEach((el) => el.classList.remove("is-valid", "is-invalid"));
    });
  };

  const initRegisterForm = () => {
    const f = $("#registerForm");
    if (!f) return;
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm(f)) { kingdomToast("Please fix the highlighted fields.", "error"); return; }
      if (!$("#agreeTerms").checked) { kingdomToast("Please accept the terms.", "error"); return; }
      const name = $("#regFullName").value.trim();
      localStorage.setItem("kingdom-user-name", name);
      localStorage.setItem("kingdom-reg", JSON.stringify({ name, email: $("#regEmail").value, country: $("#regCountry").value }));
      kingdomToast(`Account created — welcome, ${name}!`);
      f.reset();
      $$(".is-valid, .is-invalid", f).forEach((el) => el.classList.remove("is-valid", "is-invalid"));
      $("#pwLabel").textContent = "";
      $("#pwMeter .bar").style.width = "0";
    });
  };

  /* ---------- Printable summary ---------- */
  const initPrint = () => {
    const btn = $("#printSummary");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const html = `<html><head><title>Booking summary — Kingdom in the Sky</title>
        <style>body{font-family:sans-serif;padding:2rem;line-height:1.6}h1{color:#0B2A4A}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:.5rem}</style></head>
        <body><h1>Kingdom in the Sky — Booking</h1>${$("#confSummary").innerHTML}<p>Reference: <strong>${$("#confRef").textContent}</strong></p></body></html>`;
      const w = window.open("", "_blank");
      w.document.write(html);
      w.document.close();
      w.print();
    });
  };

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    if (!isContact) return;
    initPwMeter();
    initDates();
    initCurrency();
    prefillBooking();
    initBookingForm();
    initContactForm();
    initRegisterForm();
    initPrint();
    // live validation as user types
    $$("#bookingForm input, #bookingForm select, #contactForm input, #contactForm textarea, #registerForm input, #registerForm select").forEach((el) => {
      el.addEventListener("blur", () => validateField(el));
      el.addEventListener("input", () => { if (el.classList.contains("is-invalid")) validateField(el); });
    });
    recalc();
  });
})();
