/* CompassMatch — results: match rendering, history & ideology guide */


/* ---------- Results ---------- */

const toPercent = (value) => ((value + 10) / 20) * 100;

/* Easter egg: the 30-question level answered strongly agree on the first 15
   then strongly disagree on the last 15 ALWAYS yields Marios Strifths + the
   Greek flag. Tolerates a few slips (e.g. an accidental "Agree" instead of
   "Strongly agree") so a human clicking through 30 answers still triggers it. */
function isStrifthsPattern() {
  if (currentLevel !== 30 || activeQuestions.length !== 30) return false;
  const first = responses.slice(0, 15);
  const last = responses.slice(15, 30);
  const strongFirst = first.filter((v) => v === 2).length;   // strongly agree
  const strongLast = last.filter((v) => v === -2).length;    // strongly disagree
  return strongFirst >= 12 && strongLast >= 12;              // allow up to 3 slips per half
}

function showResults() {
  const you = computeScores();
  let ranked = rankedFigures(you);
  let best = ranked[0];
  let country = rankedCountries(you)[0];
  const ideology = rankedIdeologies(you)[0];
  const q = quadrantFor(you);

  if (isStrifthsPattern()) {
    best = { ...STRIFTHS, d: 0 };                    // 100% match
    ranked = [best, ...ranked];                      // real figures stay as runners-up
    const greece = COUNTRIES.find((c) => c.name.en === "Greece");
    if (greece) country = { ...greece, d: dist(you, greece) }; // force the Greek flag
  }

  LAST = { you, ranked, best, country, ideology, q };
  saveHistoryEntry(you, LAST.best, similarity(LAST.best.d));
  renderResults();
  showScreen("results");
}

function renderResults() {
  if (!LAST) return;
  const { you, ranked, best, country, ideology, q } = LAST;

  const axisLabel = (v, negKey, posKey) => {
    const lean = Math.abs(v) < 1.5 ? t("coords.center") : t(v < 0 ? negKey : posKey);
    return `${v > 0 ? "+" : ""}${v.toFixed(1)} · ${lean}`;
  };
  $("coord-econ").textContent = axisLabel(you.econ, "coords.left", "coords.right");
  $("coord-social").textContent = axisLabel(you.auth, "coords.libertarian", "coords.authoritarian");

  $("quadrant-name").textContent = L(q.name);
  $("quadrant-desc").textContent = L(q.desc);

  const dots = $("figure-dots");
  dots.innerHTML = "";
  FIGURES.forEach((f) => {
    const dot = document.createElement("div");
    dot.className = "fig-dot";
    dot.title = f.name;
    dot.style.left = `${toPercent(f.econ)}%`;
    dot.style.top = `${100 - toPercent(f.auth)}%`;
    dots.appendChild(dot);
  });

  const youDot = $("you-dot");
  youDot.hidden = false;
  youDot.style.left = "50%";
  youDot.style.top = "50%";
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      youDot.style.left = `${toPercent(you.econ)}%`;
      youDot.style.top = `${100 - toPercent(you.auth)}%`;
    })
  );

  const avatar = $("match-avatar");
  avatar.innerHTML = "";
  avatar.appendChild(photoOrInitials(best, "match-avatar"));
  $("match-name").textContent = best.name;
  $("match-years").innerHTML = best.years;
  $("match-similarity").textContent = `${similarity(best.d)}% ${t("similarity")}`;
  $("match-blurb").textContent = L(best.blurb);

  // Closest country — also paints the full-screen flag background
  const flag = $("country-flag");
  flag.innerHTML = "";
  flag.style.background = country.flag;
  flag.style.backgroundSize = "cover";
  if (country.emblem) {
    const em = document.createElement("div");
    em.className = "emblem";
    em.innerHTML = country.emblem;
    const svg = em.querySelector("svg");
    if (svg) { svg.setAttribute("width", "100%"); svg.setAttribute("height", "100%"); }
    flag.appendChild(em);
  }
  $("country-name").textContent = L(country.name);
  $("country-similarity").textContent = `${similarity(country.d)}% ${t("similarity")}`;
  $("country-blurb").textContent = L(country.blurb);
  paintCountryBackground(country);

  $("ideology-name").textContent = L(ideology.name);
  $("ideology-desc").textContent = L(ideology.desc);

  const runners = $("runners");
  runners.innerHTML = "";
  ranked.slice(1, 5).forEach((f, i) => {
    const li = document.createElement("li");
    const rank = document.createElement("span");
    rank.className = "runner-rank";
    rank.textContent = `${i + 1}.`;
    const name = document.createElement("span");
    name.className = "runner-name";
    name.textContent = f.name;
    const sim = document.createElement("span");
    sim.className = "runner-sim";
    sim.textContent = `${similarity(f.d)}%`;
    li.append(rank, photoOrInitials(f, "runner-photo"), name, sim);
    runners.appendChild(li);
  });

  const list = $("breakdown");
  list.innerHTML = "";
  activeQuestions.forEach((item, i) => {
    const a = responses[i];
    const answer = ANSWERS.find((x) => x.value === a);
    const label = answer ? L(answer.label) : t("breakdown.noAnswer");
    const cls = a > 0 ? "agree" : a < 0 ? "disagree" : "neutral";
    const li = document.createElement("li");
    li.innerHTML = `<span class="b-q">${L(item.q)}</span><span class="b-a ${cls}">${label}</span>`;
    list.appendChild(li);
  });

  window.lastResult = LAST;
  $("copy-note").textContent = "";
}

/* Full-screen flag background behind the results (e.g. Japan → red & white). */
function paintCountryBackground(country) {
  const bg = $("country-bg");
  if (!bg) return;
  bg.innerHTML = "";
  bg.style.background = country.flag || "";
  bg.style.backgroundSize = "cover";
  bg.style.backgroundPosition = "center";
  if (country.emblem) {
    const em = document.createElement("div");
    em.className = "bg-emblem";
    em.innerHTML = country.emblem;
    const svg = em.querySelector("svg");
    if (svg) { svg.setAttribute("width", "100%"); svg.setAttribute("height", "100%"); }
    bg.appendChild(em);
  }
}

function initials(name) {
  const clean = name.replace(/&amp;.*/, "").trim().split(/\s+/);
  return (clean[0][0] + (clean[1]?.[0] ?? "")).toUpperCase();
}

/* Portrait with graceful fallback to initials if the image fails to load. */
function photoOrInitials(fig, cls) {
  const makeFallback = () => {
    const fb = document.createElement("span");
    if (cls === "runner-photo") {
      fb.className = "runner-initials";
    } else {
      fb.style.cssText = "font-size:1.3rem;font-weight:700;color:var(--text-dim)";
    }
    fb.textContent = initials(fig.name);
    return fb;
  };

  if (!fig.img) return makeFallback(); // easter-egg / photo-less figures → initials

  const img = document.createElement("img");
  img.src = fig.img;
  img.alt = fig.name;
  if (cls !== "match-avatar") img.className = cls;

  img.addEventListener("error", () => img.replaceWith(makeFallback()));

  return img;
}

/* ---------- Actions ---------- */

$("btn-restart").addEventListener("click", () => {
  responses.fill(null);
  current = 0;
  showScreen("intro");
});

$("btn-copy").addEventListener("click", async () => {
  const r = window.lastResult;
  if (!r) return;
  const leanEcon = t(r.you.econ < 0 ? "coords.left" : "coords.right");
  const leanSocial = t(r.you.auth < 0 ? "coords.libertarian" : "coords.authoritarian");
  const text =
    `${t("copy.header")} (v${VERSION}).\n` +
    `${t("copy.economic")}: ${r.you.econ.toFixed(1)} (${leanEcon}) · ` +
    `${t("copy.social")}: ${r.you.auth.toFixed(1)} (${leanSocial})\n` +
    `${t("copy.figure")}: ${r.best.name} (${r.best && similarity(r.best.d)}% ${t("similarity")})\n` +
    `${t("copy.country")}: ${L(r.country.name)} (${similarity(r.country.d)}% ${t("similarity")})\n` +
    `${t("copy.ideology")}: ${L(r.ideology.name)}`;
  try {
    await navigator.clipboard.writeText(text);
    $("copy-note").textContent = t("results.copied");
  } catch {
    $("copy-note").textContent = t("results.copyFailed") + text;
  }
});

/* ---------- History (stored locally in this browser) ---------- */

const HISTORY_KEY = "compassmatch.history.v1";
const HISTORY_MAX = 30;

function loadHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(HISTORY_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

function saveHistoryEntry(you, best, sim) {
  try {
    const list = loadHistory();
    list.unshift({
      t: Date.now(),
      econ: Number(you.econ.toFixed(1)),
      auth: Number(you.auth.toFixed(1)),
      name: best.name,
      img: best.img,
      quadrant: quadrantFor(you).name.en,
      ideology: rankedIdeologies(you)[0].name.en,
      country: rankedCountries(you)[0].name.en,
      sim,
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, HISTORY_MAX)));
  } catch {
    /* storage unavailable (private mode etc.) — history just won't persist */
  }
}

function renderIdeologyGuide() {
  const ul = $("ideology-guide-list");
  if (!ul) return;
  ul.innerHTML = "";
  IDEOLOGIES.forEach((ide) => {
    const li = document.createElement("li");
    li.className = "guide-item";
    const n = document.createElement("span");
    n.className = "guide-name";
    n.textContent = L(ide.name);
    const d = document.createElement("span");
    d.className = "guide-desc";
    d.textContent = L(ide.desc);
    li.append(n, d);
    ul.appendChild(li);
  });
}

function renderHistory() {
  const list = loadHistory();
  const wrap = $("history-list");
  wrap.innerHTML = "";
  $("history-empty").hidden = list.length > 0;

  list.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "history-item";

    const fig = FIGURES.find((f) => f.name === entry.name) || { name: entry.name, img: entry.img };
    row.appendChild(photoOrInitials(fig, "runner-photo"));

    const who = document.createElement("div");
    who.className = "history-who";
    const nameEl = document.createElement("div");
    nameEl.textContent = entry.name;
    const meta = document.createElement("div");
    meta.className = "history-meta";
    meta.textContent =
      `${t("coords.center") === "Center" ? entry.quadrant : (QUADRANTS[Object.keys(QUADRANTS).find((k) => QUADRANTS[k].name.en === entry.quadrant)] ? L(QUADRANTS[Object.keys(QUADRANTS).find((k) => QUADRANTS[k].name.en === entry.quadrant)].name) : entry.quadrant)} · ` +
      `${entry.econ > 0 ? "+" : ""}${entry.econ} ${t("coord.economic").toLowerCase()} · ${entry.auth > 0 ? "+" : ""}${entry.auth} ${t("coord.social").toLowerCase()}`;

    const tags = document.createElement("div");
    tags.className = "history-tags";
    const addTag = (labelKey, enValue, lookup) => {
      if (!enValue) return; // older entries may lack these fields
      const found = lookup ? lookup.find((o) => o.name.en === enValue) : null;
      const chip = document.createElement("span");
      chip.className = "history-tag";
      chip.innerHTML = `<b>${t(labelKey)}</b> ${found ? L(found.name) : enValue}`;
      if (found) chip.title = L(found.desc ?? found.blurb ?? "");
      tags.appendChild(chip);
    };
    addTag("history.ideology", entry.ideology, IDEOLOGIES);
    addTag("history.country", entry.country, COUNTRIES);

    who.append(nameEl, meta, tags);

    const sim = document.createElement("div");
    sim.className = "history-sim";
    const d = new Date(entry.t);
    sim.innerHTML =
      `<span class="sim-value">${entry.sim}%</span>` +
      `<span class="sim-date">${d.toLocaleDateString(LANG)} ${d.toLocaleTimeString(LANG, { hour: "2-digit", minute: "2-digit" })}</span>`;

    row.append(who, sim);
    wrap.appendChild(row);
  });

  renderIdeologyGuide();
}

$("btn-history").addEventListener("click", () => {
  renderHistory();
  showScreen("history");
});

$("btn-history-back").addEventListener("click", () => showScreen("intro"));

$("btn-history-start").addEventListener("click", openLevelModal);

$("btn-clear-history").addEventListener("click", () => {
  if (!loadHistory().length) return;
  if (confirm(t("history.clear") + "?")) {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }
});

/* ---------- Animated "What do ideologies mean?" panel ---------- */

(function wireIdeologyGuide() {
  const guide = $("ideology-guide");
  if (!guide) return;
  const summary = guide.querySelector("summary");
  const body = guide.querySelector(".guide-body");
  if (!summary || !body) return;
  let animating = false;

  summary.addEventListener("click", (e) => {
    e.preventDefault();
    if (animating) return;               // ignore clicks mid-animation
    const opening = !guide.open;
    if (!animationsOn()) { guide.open = opening; body.style.height = ""; return; }
    animating = true;
    if (opening) {
      guide.open = true;
      body.style.height = "0px";
      void body.offsetHeight;                         // commit the 0 height
      body.style.height = body.scrollHeight + "px";   // → animate open
      setTimeout(() => { body.style.height = ""; animating = false; }, 360);
    } else {
      body.style.height = body.scrollHeight + "px";
      void body.offsetHeight;
      body.style.height = "0px";                      // → animate closed
      setTimeout(() => { guide.open = false; body.style.height = ""; animating = false; }, 360);
    }
  });
})();
