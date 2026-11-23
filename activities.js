/*
  File: js/activities.js
  Purpose: Render activity cards from JSON and power the "Plan Your Trip"
           quiz that recommends an activity based on 3 answers.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

(() => {
  "use strict";
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Render activity cards ---------- */
  const grid = $("#actGrid");
  if (grid) {
    (async () => {
      const data = await loadData("activities");
      const diffClass = (d) => (d === "Easy" ? "diff-easy" : d === "Moderate" ? "diff-mod" : "diff-hard");
      grid.innerHTML = data
        .map(
          (a) => `
        <article class="col-12 col-sm-6 col-lg-4 col-xl-6">
          <div class="kingdom-card reveal h-100">
            <div class="card-body d-flex flex-column gap-2">
              <div class="d-flex justify-content-between align-items-start">
                <span class="feature-icon" style="width:54px;height:54px;font-size:1.3rem"><i class="bi ${a.icon}"></i></span>
                <span class="badge kingdom-badge ${diffClass(a.difficulty)}">${a.difficulty}</span>
              </div>
              <h3 class="card-title h5">${a.name}</h3>
              <p class="card-text">${a.desc}</p>
              <ul class="list-unstyled small text-muted mb-0">
                <li><i class="bi bi-clock"></i> Duration: ${a.duration}</li>
                <li><i class="bi bi-calendar3"></i> Best season: ${a.season}</li>
                <li><i class="bi bi-tag"></i> From <strong>M ${a.price.toLocaleString()}</strong> pp</li>
              </ul>
              <div class="card-foot mt-2">
                <button class="btn btn-outline-kingdom btn-sm" data-add-itin="${a.id}"><i class="bi bi-plus-circle"></i> Add to trip</button>
                <a href="contact.html#booking" class="btn btn-link btn-sm p-0">Book this</a>
              </div>
            </div>
          </div>
        </article>`
        )
        .join("");
      $$(".reveal", grid).forEach((el) => el.classList.add("visible"));

      // Add to itinerary (localStorage) — bonus trip planner
      $$("[data-add-itin]", grid).forEach((b) =>
        b.addEventListener("click", () => {
          const a = data.find((x) => x.id === b.dataset.addItin);
          const it = JSON.parse(localStorage.getItem("kingdom-itinerary") || "[]");
          if (!it.find((x) => x.id === a.id)) it.push({ id: a.id, name: a.name, price: a.price });
          localStorage.setItem("kingdom-itinerary", JSON.stringify(it));
          kingdomToast(`${a.name} added to your trip plan (${it.length} item${it.length > 1 ? "s" : ""}).`);
        })
      );
    })();
  }

  /* ---------- Plan Your Trip quiz ----------
   * Simple rule-based recommendation from 3 selects. */
  const quiz = $("#tripQuiz");
  if (quiz) {
    quiz.addEventListener("submit", (e) => {
      e.preventDefault();
      const diff = $("#q1").value;
      const season = $("#q2").value;
      const vibe = $("#q3").value;
      if (!diff || !season || !vibe) {
        $("#quizResult").innerHTML = `<div class="alert kingdom-alert alert-warning">Please answer all three questions.</div>`;
        return;
      }
      let rec = "";
      if (season === "Snow") rec = "Skiing &amp; Snowboarding at Afriski (Jun–Aug).";
      else if (vibe === "Adrenaline" && diff !== "Easy") rec = "Abseiling the 204 m Maletsunyane Falls — the world's longest single-drop abseil.";
      else if (vibe === "Culture") rec = "A Cultural Village Tour, ideally paired with pony trekking from Malealea.";
      else if (vibe === "Wildlife") rec = "Birdwatching for the Bearded Vulture in the Maluti highlands.";
      else if (vibe === "Quiet") rec = "Stargazing on a clear highland night — April to September is best.";
      else if (diff === "Hard") rec = "A multi-day trek to summit Thabana Ntlenyana (3,482 m).";
      else if (diff === "Moderate") rec = "Pony trekking from Malealea — a half or full day through villages and foothills.";
      else rec = "Fly fishing for wild trout in Tsehlanyane National Park.";
      $("#quizResult").innerHTML = `
        <div class="alert kingdom-alert alert-info">
          <strong>Your match:</strong> ${rec}
          <br><a href="contact.html#booking" class="btn btn-kingdom btn-sm mt-2">Book this activity</a>
        </div>`;
    });
  }
})();
