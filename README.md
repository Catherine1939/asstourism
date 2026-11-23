# Kingdom in the Sky — Lesotho Tourism

A premium, production-quality tourism website for Lesotho, the Mountain Kingdom.
Built with **HTML5, CSS3, Bootstrap 5 and vanilla JavaScript** (no frameworks,
no build tools required — just open `index.html`).

**Brand:** Kingdom in the Sky
**Tagline:** Discover Lesotho. Walk above the clouds.

This is a BSc Information Technology university assignment for the module
Web Design (**BIWD2110**, 100 marks). All content, prices, testimonials and
listings are **sample data** written for the assignment.

---

## Features mapped to the rubric

| Area | Marks | Where it's covered |
| --- | --- | --- |
| HTML5 semantic structure | 15 | Semantic tags on every page (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, `figure`/`figcaption`); one `h1` per page; ordered/unordered lists; tables (best-time-to-visit, price comparison, Sesotho phrases); three forms with `text/email/tel/date/number/password/select/textarea/radio/checkbox/range`; meta tags; per-page `<title>`; favicon; `label for`; `abbr`, `time`, `address`; `aria-label` on landmarks |
| CSS3 custom design | 15 | `css/style.css` with 19 numbered sections; CSS custom properties (`:root` variables); dark mode token set; Flexbox + CSS Grid; gradients; keyframe animations; `position: sticky`; `clamp()` fluid type; custom scrollbar & `::selection`; hover/zoom/underline; `prefers-reduced-motion`; responsive `@media` queries |
| Bootstrap 5 & responsiveness | 20 | Navbar, cards, carousel, modal, accordion, alerts, buttons, forms (floating labels + validation), pagination, dropdowns, badges, tabs/pills, offcanvas, toasts; breakpoints `sm md lg xl xxl` each used at least once (commented in HTML) |
| JavaScript & DOM | 25 | 10+ features: form validation, gallery lightbox, live search with debounce + highlight, filtering + sorting + pagination, dynamic JSON `fetch()` with spinner + fallback, dark/light toggle, sticky navbar + scroll-spy + back-to-top, booking cost calculator with currency switch + print, favourites/wishlist, animated counters + scroll reveal, weather widget (Open-Meteo), trip planner |
| Forms & validation | 10 | Three forms with HTML5 + JS validation; real-time error/success states; password strength meter; date logic (no past, checkout > checkin); Lesotho phone pattern; confirmation modal with reference `LT-2026-XXXXX` |
| UX & accessibility | 10 | Skip link, focus outlines, keyboard nav, ARIA on modal/carousel/accordion/tabs, alt text, 16px+ body, consistent layout, empty states, loading spinners, tested at 360/768/1366/1920px |
| Code organisation & docs | 5 | Header comment on every file, section + function comments, 2-space indent, README, clean folder structure |

---

## Technologies

- HTML5 (semantic markup)
- CSS3 (custom properties, Grid, Flexbox, animations)
- Bootstrap 5.3 + Bootstrap Icons (CDN)
- Google Fonts: Playfair Display + Inter
- Vanilla JavaScript (ES6+, modules via IIFEs, `async/await`, `IntersectionObserver`)
- JSON data + `fetch()` with embedded fallback
- Open-Meteo API (weather widget, no API key required)

No npm install or build step is needed to view the site.

---

## Folder structure

```
lesotho-tourism/
├── index.html              Home
├── destinations.html       Destinations + filters + modal
├── accommodation.html      Stays + price slider + comparison
├── activities.html         Activities + quiz + timeline
├── gallery.html            Masonry gallery + lightbox
├── about.html              Story + timeline + phrases
├── contact.html            Booking + contact + register (tabs)
├── 404.html                Friendly not-found page
├── css/
│   └── style.css           Single themed stylesheet
├── js/
│   ├── includes.js         Shared navbar/footer injector
│   ├── data.js             JSON loader + fallback data + utils
│   ├── main.js             Theme, navbar, counters, weather, toasts
│   ├── home.js             Home page features
│   ├── destinations.js     Cards, search, filter, sort, pagination
│   ├── accommodation.js    Cards, type + price filter
│   ├── activities.js       Cards + trip-planner quiz
│   ├── gallery.js          Masonry + lightbox
│   └── forms.js            3 forms + calculator + validation
├── data/
│   ├── destinations.json
│   ├── accommodation.json
│   └── activities.json
└── README.md
```

---

## How to run locally

### Option A — open the file (simplest)
1. Download/clone this folder.
2. Double-click `index.html`. It opens in your browser.

> Some browsers block `fetch()` of local JSON from `file://`. The site
> handles this automatically with embedded fallback data, so all cards
> still render — but to see the JSON load live, use Option B.

### Option B — run a tiny local server
```bash
# Python 3 (built in)
python3 -m http.server 8000
# then visit http://localhost:8000

# or Node
npx serve
```


---

## How to deploy on GitHub Pages (step by step)

1. Create a free GitHub account at https://github.com if you don't have one.
2. Click **New repository**. Name it e.g. `lesotho-tourism`. Set it **Public**.
3. Upload all project files (you can drag-and-drop the folder in the GitHub
   web UI, or use git):
   ```bash
   git init
   git add .
   git commit -m "Lesotho tourism assignment"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/lesotho-tourism.git
   git push -u origin main
   ```
4. In the repo on GitHub, go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Select the **main** branch and the **/ (root)** folder, then **Save**.
7. Wait ~1 minute. GitHub shows your live URL, e.g.
   `https://YOUR-USERNAME.github.io/lesotho-tourism/`.
8. Open the URL — every page, link and feature works exactly as locally.

---

## Browser support

Tested in current Chrome, Edge, Firefox and Safari. Uses standard ES6+,
CSS Grid and `IntersectionObserver`, all widely supported since 2020.

---

## Credits

- **Images:** Real photographs of Lesotho from
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Lesotho)
  (free licence, no attribution required for most). The Maletsunyane Falls
  photo is via kanaga-at.com. A credits line appears in the footer.
- **Weather data:** [Open-Meteo](https://open-meteo.com) (free, no API key).
- **Framework:** [Bootstrap 5.3](https://getbootstrap.com) +
  [Bootstrap Icons](https://icons.getbootstrap.com).
- **Fonts:** [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
  & [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts.

## Author

**[Student Name]** — Student ID: [STUDENT-ID]
BSc Information Technology — Web Design (BIWD2110)
Date: November 2026
