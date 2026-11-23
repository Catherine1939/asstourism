/*
  File: js/data.js
  Purpose: Central data access. Loads JSON via fetch() with a loading
           spinner + error fallback, and falls back to embedded sample
           data when fetch fails (e.g. opened via file://).
           Also exposes helper utils for rendering cards.
  Author: [Student Name] — BSc IT, Web Design BIWD2110
  Date: 2026-11
*/

/* Shared image fallback so we never ship a broken <img>.
 * Uses an inline SVG data URI showing a Basotho-coloured placeholder. */
const IMG_FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='450' viewBox='0 0 600 450'>
      <rect width='600' height='450' fill='#0B2A4A'/>
      <text x='50%' y='50%' fill='#C8872E' font-family='serif' font-size='28' text-anchor='middle'>Kingdom in the Sky</text>
    </svg>`
  );
window.IMG_FALLBACK = IMG_FALLBACK;

/* ---------- Embedded fallback data (used if fetch fails) ---------- */
const FALLBACK = {
  destinations: [
    { id:"maletsunyane", name:"Maletsunyane Falls", district:"Maseru", category:"Waterfalls",
      img:"https://upload.wikimedia.org/wikipedia/commons/8/8d/Maletsunyanefalls.JPG",
      short:"A 204-metre single-drop waterfall near Semonkong — one of the highest in Southern Africa.",
      desc:"Maletsunyane Falls plunges 204 metres into a basalt gorge near the town of Semonkong ('Place of Smoke'). The mist created by the fall gives the settlement its name. It is the site of the world's longest commercially operated single-drop abseil.",
      best:"Summer (Nov–Mar) for full flow; winter for clear views.", getting:"4x4 from Maseru (~2 hrs) then a short hike to the viewpoint.", activities:["Abseiling","Hiking","Photography","Pony trekking"] },
    { id:"thababosiu", name:"Thaba-Bosiu", district:"Maseru", category:"Culture & History",
      img:"https://upload.wikimedia.org/wikipedia/commons/6/67/685_Thaba_Bosiu.jpg",
      short:"King Moshoeshoe I's mountain fortress — the cradle of the Basotho nation.",
      desc:"Thaba-Bosiu ('Mountain at Night') is the mountain stronghold where Moshoeshoe I gathered his people in 1824 and repelled repeated attacks. It is considered the birthplace of Lesotho and remains a sacred site.",
      best:"Year-round; mornings are clearest.", getting:"45 min drive east of Maseru on a paved road.", activities:["Guided cultural tour","Hiking","Heritage walk"] },
    { id:"katse", name:"Katse Dam", district:"Mokhotlong", category:"Dams & Lakes",
      img:"https://upload.wikimedia.org/wikipedia/commons/4/47/Katse_Dam.jpg",
      short:"Africa's second-highest dam — an engineering marvel on the Malibamatso River.",
      desc:"Part of the Lesotho Highlands Water Project, Katse Dam stands 185 m high and forms a vast reservoir at 2,000 m. The dam transfers water to South Africa and generates hydropower for Lesotho.",
      best:"Summer for water levels; spring for wildflowers.", getting:"~3 hrs from Maseru via good mountain roads.", activities:["Dam tour","Boat cruise","Birdwatching","Scenic drive"] },
    { id:"sanipass", name:"Sani Pass", district:"Mokhotlong", category:"Mountains",
      img:"https://upload.wikimedia.org/wikipedia/commons/f/f0/Lesotho_-_South_Africa_Border_-_Sani_Pass.jpg",
      short:"The legendary 4x4 pass climbing to 2,876 m into Lesotho's highlands.",
      desc:"Sani Pass is the dramatic dirt road linking Underberg (South Africa) with Mokhotlong. It twists up the escarpment to the highest pub in Africa at the top. A 4x4 is essential.",
      best:"Summer/autumn; winter can be snow-bound.", getting:"4x4 from Underberg (~2.5 hrs up).", activities:["4x4 adventure","Photography","Mountain biking","Sightseeing"] },
    { id:"afriski", name:"Afriski Mountain Resort", district:"Butha-Buthe", category:"Mountains",
      img:"https://upload.wikimedia.org/wikipedia/commons/a/a0/AfriSki.jpg",
      short:"Lesotho's only ski resort at 3,222 m — snow sports in the heart of Africa.",
      desc:"Afriski sits high in the Maluti Mountains and offers skiing and snowboarding from June to August, plus year-round hiking, mountain biking and an adventure park.",
      best:"Jun–Aug for snow; Sep–May for hiking/biking.", getting:"~4.5 hrs from Maseru; 1.5 hrs from Ficksburg.", activities:["Skiing","Snowboarding","Mountain biking","Hiking"] },
    { id:"tsehlanyane", name:"Tsehlanyane National Park", district:"Butha-Buthe", category:"Nature Reserves",
      img:"https://upload.wikimedia.org/wikipedia/commons/2/20/Ts%27ehlanyane_National_Park.JPG",
      short:"Alpine wilderness of indigenous forest, rivers and peaks above 2,000 m.",
      desc:"Tsehlanyane protects a rare patch of indigenous berg forest, with crystal rivers, eland and bearded vultures. Hiking, fly fishing and camping are the drawcards.",
      best:"Summer for greenery; winter for crisp clear days.", getting:"~3.5 hrs from Maseru via Oxbow Lodge.", activities:["Hiking","Fly fishing","Camping","Birdwatching"] },
    { id:"sehlaba", name:"Sehlabathebe National Park", district:"Qacha's Nek", category:"Nature Reserves",
      img:"https://upload.wikimedia.org/wikipedia/commons/f/f4/Panoramic_view_from_a_mountain_in_Lesotho.jpg",
      short:"A remote UNESCO World Heritage park of sandstone arches and alpine tarns.",
      desc:"Sehlabathebe is Lesotho's oldest national park and a UNESCO site. Its rolling sandstone plateau holds rare plants, rock art and the endemic Maloti minnow.",
      best:"Summer for wildflowers; spring/autumn for hiking.", getting:"Remote — 4x4 via Qacha's Nek (~5 hrs).", activities:["Hiking","Birdwatching","Rock art","Photography"] },
    { id:"malealea", name:"Malealea", district:"Maseru", category:"Mountains",
      img:"https://upload.wikimedia.org/wikipedia/commons/9/92/LS_Malealea_0112_001_%2817250892035%29.jpg",
      short:"A famed pony-trekking lodge in the foothills of the Maluti Mountains.",
      desc:"Malealea is a beloved lodge and village offering Basotho pony treks through rural villages, waterfalls and mountain paths — a quintessential Lesotho experience.",
      best:"Year-round; summer for green hills.", getting:"~1.5 hrs south-west of Maseru.", activities:["Pony trekking","Hiking","Village tour","Cultural evening"] },
    { id:"hakome", name:"Ha Kome Cave Dwellings", district:"Berea", category:"Culture & History",
      img:"https://upload.wikimedia.org/wikipedia/commons/8/81/Kome_Cave_Dwellings_%28Ha_Kome%29_in_Lesotho_-_2382.jpg",
      short:"A living cave village where families still inhabit sandstone shelters.",
      desc:"The Ha Kome caves have been home to Basotho families for generations, carved under a sandstone overhang. Guided visits explain the history and daily life of the residents.",
      best:"Year-round.", getting:"~1 hr from Maseru, near Teyateyaneng.", activities:["Cultural tour","Photography","Heritage walk"] },
    { id:"morija", name:"Morija Museum & Archives", district:"Maseru", category:"Culture & History",
      img:"https://upload.wikimedia.org/wikipedia/commons/d/d6/Kome_Cave_Dwellings_%28Ha_Kome%29_in_Lesotho_-_2386.jpg",
      short:"Lesotho's oldest museum with dinosaur footprints and Basotho heritage.",
      desc:"Founded in 1956, Morija Museum holds artefacts of Basotho culture, missionary history, and fossilised dinosaur footprints found nearby. It hosts the annual Morija Arts & Cultural Festival.",
      best:"Year-round; festival in spring.", getting:"~45 min south of Maseru.", activities:["Museum visit","Fossil walk","Cultural festival","Crafts shopping"] },
    { id:"liphofung", name:"Liphofung Cave Cultural Heritage Site", district:"Butha-Buthe", category:"Culture & History",
      img:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Gorge_in_Lesotho_-_Flickr_-_Tjeerd.jpg",
      short:"A historic cave used by Moshoeshoe I, with San rock art and exhibits.",
      desc:"Liphofung ('Place of the eland') is a large sandstone cave with San rock art, a natural spring and a cultural centre. Moshoeshoe I used it as a gathering place.",
      best:"Year-round.", getting:"~2.5 hrs from Maseru on the A1.", activities:["Cultural tour","Rock art viewing","Heritage walk"] },
    { id:"thabana", name:"Thabana Ntlenyana", district:"Mokhotlong", category:"Mountains",
      img:"https://upload.wikimedia.org/wikipedia/commons/0/09/Lesotho%2C_Drakenberg_mountains_%2850182014816%29.jpg",
      short:"Southern Africa's highest peak at 3,482 m — a strenuous summit hike.",
      desc:"Thabana Ntlenyana ('Beautiful little mountain') is the highest point in Southern Africa at 3,482 m, located in the Drakensberg/Maluti range. A multi-day trek rewards with epic views.",
      best:"Summer/autumn; avoid winter snow unless experienced.", getting:"5+ hrs from Maseru, then hike from Sani top.", activities:["Mountaineering","Hiking","Photography"] },
    { id:"maseru", name:"Maseru — Capital City", district:"Maseru", category:"Culture & History",
      img:"https://upload.wikimedia.org/wikipedia/commons/5/58/Maseru_Town.jpg",
      short:"Lesotho's capital: markets, the Basotho Cultural Village and Mohokare River.",
      desc:"Maseru is Lesotho's largest city and gateway. Visit the Basotho Cultural Village, Makoanyane Square, the Lesotho Evangelical Church and stroll the banks of the Mohokare (Caledon) River.",
      best:"Year-round.", getting:"Moshoeshoe I International Airport; road from South Africa.", activities:["City tour","Crafts shopping","Cultural village","Markets"] },
  ],

  accommodation: [
    { id:"ac1", name:"Maliba Mountain Lodge", type:"Lodge", location:"Tsehlanyane", price:2800, rating:5,
      img:"https://upload.wikimedia.org/wikipedia/commons/b/b3/T%C5%A1ehlanyane_National_Park.jpg",
      amenities:["Wi-Fi","Breakfast","Fireplace","Pony trekking"],
      desc:"Five-star chalets inside Tsehlanyane National Park with river views." },
    { id:"ac2", name:"Sani Mountain Lodge", type:"Lodge", location:"Sani Pass", price:2200, rating:4.5,
      img:"https://upload.wikimedia.org/wikipedia/commons/7/7f/Ditaba_Sani_Pass.jpg",
      amenities:["Breakfast","Fireplace","Wi-Fi","Bar"],
      desc:"Highest pub in Africa; stone chalets at the top of Sani Pass." },
    { id:"ac3", name:"Malealea Lodge", type:"Lodge", location:"Malealea", price:1200, rating:4,
      img:"https://upload.wikimedia.org/wikipedia/commons/e/eb/LS_Malealea_0112_002_%2817043459867%29.jpg",
      amenities:["Wi-Fi","Pony trekking","Breakfast","Camping"],
      desc:"The classic Basotho pony-trekking lodge in the Maluti foothills." },
    { id:"ac4", name:"Afriski Resort", type:"Hotel", location:"Butha-Buthe", price:1900, rating:4,
      img:"https://upload.wikimedia.org/wikipedia/commons/d/d9/Lesotho_sky_%281569745050%29.jpg",
      amenities:["Wi-Fi","Breakfast","Bar","Restaurant"],
      desc:"Slopeside hotel rooms and chalets at 3,222 m." },
    { id:"ac5", name:"Avani Maseru Hotel", type:"Hotel", location:"Maseru", price:1600, rating:4,
      img:"https://upload.wikimedia.org/wikipedia/commons/d/d5/LS_Maseru_01101_%2818675631220%29.jpg",
      amenities:["Wi-Fi","Pool","Restaurant","Breakfast"],
      desc:"Central Maseru hotel with pool, restaurant and conference rooms." },
    { id:"ac6", name:"Maseru Sun", type:"Hotel", location:"Maseru", price:1450, rating:4,
      img:"https://upload.wikimedia.org/wikipedia/commons/f/f9/LS_Maseru_0112_001_%2817063326610%29.jpg",
      amenities:["Wi-Fi","Pool","Restaurant","Bar"],
      desc:"Comfortable city-centre hotel near the Mohokare River." },
    { id:"ac7", name:"Semonkong Lodge", type:"Backpackers", location:"Semonkong", price:650, rating:4,
      img:"https://upload.wikimedia.org/wikipedia/commons/4/49/A_typical_village_in_Lesotho%2C_Africa.jpg",
      amenities:["Breakfast","Bar","Camping","Pony trekking"],
      desc:"Cosy backpackers at the gateway to Maletsunyane Falls." },
    { id:"ac8", name:"Roma Trading Post", type:"Guesthouse", location:"Roma", price:850, rating:4,
      img:"https://upload.wikimedia.org/wikipedia/commons/d/df/Typical_Houses_in_Lesotho.jpg",
      amenities:["Wi-Fi","Breakfast","Fireplace","Bar"],
      desc:"Friendly guesthouse near NUL university campus." },
    { id:"ac9", name:"Matsi Fall", type:"Guesthouse", location:"Leribe", price:750, rating:3.5,
      img:"https://upload.wikimedia.org/wikipedia/commons/e/ec/Dibuka.jpg",
      amenities:["Breakfast","Parking","Fireplace"],
      desc:"Family-run guesthouse close to the Hlotse river." },
    { id:"ac10", name:"Oxbow Lodge", type:"Lodge", location:"Oxbow", price:1100, rating:3.5,
      img:"https://upload.wikimedia.org/wikipedia/commons/0/09/Lesotho%2C_Drakenberg_mountains_%2850182014816%29.jpg",
      amenities:["Bar","Fireplace","Breakfast","Parking"],
      desc:"High-altitude lodge near the Oxbow ski and trout area." },
    { id:"ac11", name:"Katse Lodge", type:"Lodge", location:"Katse", price:1300, rating:4,
      img:"https://upload.wikimedia.org/wikipedia/commons/0/0f/Katse_Dam%2CLesotho%2CAfrica.jpg",
      amenities:["Wi-Fi","Restaurant","Bar","Breakfast"],
      desc:"Lodge overlooking the Katse Dam reservoir." },
    { id:"ac12", name:"Highland Camping Mokhotlong", type:"Camping", location:"Mokhotlong", price:250, rating:3,
      img:"https://upload.wikimedia.org/wikipedia/commons/2/2a/Wandelen_door_Lesotho_%286353356555%29.jpg",
      amenities:["Camping","Showers","Fireplace","Parking"],
      desc:"Riverside campsite in the highland town of Mokhotlong." },
  ],

  activities: [
    { id:"pony", name:"Pony Trekking", icon:"bi-horse", difficulty:"Moderate", duration:"2 hrs – 5 days", season:"Year-round", price:450,
      desc:"Explore the mountains Basotho-style on the sure-footed Basotho pony. Treks range from short village rides to multi-day expeditions." },
    { id:"hiking", name:"Hiking & Trekking", icon:"bi-geo-alt", difficulty:"Hard", duration:"1–7 days", season:"Sep–May", price:300,
      desc:"From gentle foothill walks to a Thabana Ntlenyana summit — Lesotho's trails are endless and uncrowded." },
    { id:"abseil", name:"Abseiling — Maletsunyane", icon:"bi-arrows-vertical", difficulty:"Hard", duration:"Half day", season:"Year-round", price:1200,
      desc:"Abseil 204 m down the Maletsunyane Falls — the world's longest commercial single-drop abseil." },
    { id:"ski", name:"Skiing & Snowboarding", icon:"bi-snow", difficulty:"Moderate", duration:"1–3 days", season:"Jun–Aug", price:900,
      desc:"Afriski Mountain Resort offers real snow sports in the heart of Southern Africa." },
    { id:"4x4", name:"4x4 Sani Pass", icon:"bi-truck", difficulty:"Hard", duration:"Full day", season:"Oct–May", price:1500,
      desc:"Drive the legendary Sani Pass to the highest pub in Africa — 4x4 essential." },
    { id:"bird", name:"Birdwatching", icon:"bi-binoculars", difficulty:"Easy", duration:"2–4 hrs", season:"Year-round", price:200,
      desc:"Spot the endangered Bearded Vulture and Cape Vulture soaring over the Maluti." },
    { id:"fish", name:"Fly Fishing & Trout", icon:"bi-water", difficulty:"Easy", duration:"Half day", season:"Sep–May", price:350,
      desc:"Cast for wild trout in the clear rivers of Tsehlanyane and the Bokong plateau." },
    { id:"village", name:"Cultural Village Tour", icon:"bi-people", difficulty:"Easy", duration:"2–3 hrs", season:"Year-round", price:250,
      desc:"Visit a traditional Basotho village: meet families, taste local food, hear oral history." },
    { id:"bike", name:"Mountain Biking", icon:"bi-bicycle", difficulty:"Moderate", duration:"Half–full day", season:"Sep–May", price:500,
      desc:"Ride high-altitude singletrack at Afriski or scenic district roads across the highlands." },
    { id:"stars", name:"Stargazing", icon:"bi-stars", difficulty:"Easy", duration:"2 hrs", season:"Apr–Sep", price:150,
      desc:"Lesotho's dark, high-altitude skies reveal the Milky Way like few places on Earth." },
  ],
};

/* ---------- DataLoader ----------
 * Fetches /data/<name>.json, shows a spinner, and falls back to the
 * embedded data above on any error (network, file://, bad JSON).
 * @param {string} name - dataset key (destinations|accommodation|activities)
 * @returns {Promise<Array>}
 */
window.loadData = async function (name) {
  const out = FALLBACK[name];
  try {
    const res = await fetch(`data/${name}.json`, { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    // fetch failed (often file://) — use embedded fallback
    return out;
  }
};

/* ---------- Tiny debounce helper used by search inputs ---------- */
window.debounce = function (fn, ms = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
};

/* ---------- Highlight matching search text ---------- */
window.highlight = function (text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return text.replace(re, '<mark style="background:rgba(200,135,46,0.35);border-radius:3px;">$1</mark>');
};

/* ---------- Render a star rating string ---------- */
window.renderStars = function (rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let out = "";
  for (let i = 0; i < full; i++) out += '<i class="bi bi-star-fill"></i>';
  if (half) out += '<i class="bi bi-star-half"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) out += '<i class="bi bi-star empty"></i>';
  return `<span class="stars">${out}</span>`;
};
