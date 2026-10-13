/* CompassMatch — quiz engine: settings, state, flow & scoring */


/* ---------- Settings (Options tab) ---------- */
const SETTINGS_KEY = "compassmatch.settings.v1";
let settings = { animations: true, blackhole: true, flash: true };
try {
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  if (s && typeof s === "object") Object.assign(settings, s);
} catch { /* ignore */ }

function saveSettings() {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); } catch { /* ignore */ }
}
/* Master animation switch — also honours the OS reduced-motion preference. */
function animationsOn() { return settings.animations && !reducedMotion(); }
function blackholeOn() { return animationsOn() && settings.blackhole; }
function flashOn() { return animationsOn() && settings.flash; }
function applySettings() {
  document.body.classList.toggle("no-animations", !animationsOn());
}


/* ---------- State ---------- */

let current = 0;
const responses = new Array(QUESTIONS.length).fill(null);
let activeQuestions = QUESTIONS; // the subset chosen for the current run
let LAST = null;        // last computed results (for re-render on language change)
let activeScreen = "intro";

/* ---------- DOM ---------- */

const $ = (id) => document.getElementById(id);
const screens = {
  intro: $("screen-intro"),
  history: $("screen-history"),
  quiz: $("screen-quiz"),
  results: $("screen-results"),
  options: $("screen-options"),
};

function showScreen(key) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[key].classList.add("active");
  activeScreen = key;
  document.body.classList.toggle("results-active", key === "results");
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* ---------- Brief tint of the whole screen matching the answer's sentiment ---------- */
const FLASH_COLORS = {
  "-2": "#5a1414",  // strongly disagree — dark red
  "-1": "#7a2020",  // disagree — red
  "0": "#3a3d45",   // neutral — grey
  "1": "#1f5a37",   // agree — green
  "2": "#123f26",   // strongly agree — dark green
};

function flash(value) {
  const el = $("flash");
  if (!el) return;
  if (!flashOn()) return;
  el.style.background = FLASH_COLORS[String(value)] ?? "transparent";
  el.classList.remove("fire");
  void el.offsetWidth; // restart the CSS animation
  el.classList.add("fire");
}

/* ---------- Quiz flow (with level selection) ---------- */

function openLevelModal() {
  const m = $("level-modal");
  if (!m) { startQuiz(currentLevel); return; }
  syncLevelModal();
  m.hidden = false;
  document.body.classList.add("modal-open");
}
function closeLevelModal() {
  const m = $("level-modal");
  if (!m) return;
  m.hidden = true;
  document.body.classList.remove("modal-open");
}
function syncLevelModal() {
  document.querySelectorAll(".level-card").forEach((card) => {
    card.classList.toggle("active", Number(card.dataset.n) === currentLevel);
  });
}
function startQuiz(n) {
  currentLevel = n;
  activeQuestions = selectQuestions(n);
  current = 0;
  responses.fill(null);
  closeLevelModal();
  renderQuestion();
  showScreen("quiz");
}

$("btn-start").addEventListener("click", openLevelModal);

document.querySelectorAll(".level-card").forEach((card) => {
  card.addEventListener("click", () => startQuiz(Number(card.dataset.n)));
});
const levelModal = $("level-modal");
if (levelModal) {
  levelModal.addEventListener("click", (e) => { if (e.target === levelModal) closeLevelModal(); });
}
const btnLevelClose = $("btn-level-close");
if (btnLevelClose) btnLevelClose.addEventListener("click", closeLevelModal);

$("btn-back").addEventListener("click", () => {
  if (current > 0) {
    current--;
    renderQuestion();
  }
});

function renderQuestion() {
  const item = activeQuestions[current];
  const total = activeQuestions.length;

  $("progress-fill").style.width = `${(current / total) * 100}%`;
  $("progress-label").textContent = `${t("quiz.question")} ${current + 1} / ${total}`;
  $("question-text").innerHTML = highlightTerms(L(item.q));
  $("btn-back").textContent = t("quiz.back");
  $("btn-back").disabled = current === 0;

  const hintKey =
    Math.abs(item.econ) >= Math.abs(item.auth)
      ? item.econ < 0 ? "hint.econLeft" : "hint.econRight"
      : item.auth < 0 ? "hint.socialFree" : "hint.socialAuth";
  $("axis-hint").textContent = t(hintKey);

  const wrap = $("answers");
  wrap.innerHTML = "";
  ANSWERS.forEach((a) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `answer-btn ${a.cls}`;
    btn.innerHTML = `<span class="badge" aria-hidden="true">${ICONS[a.sym]}</span><span>${L(a.label)}</span>`;
    if (responses[current] === a.value) btn.classList.add("selected");
    btn.addEventListener("click", () => selectAnswer(a.value));
    wrap.appendChild(btn);
  });

  $("question-text").focus?.();
}

/* Wrap hard words in the question with a hover/tap tooltip.
   Matches the current language's surface forms (see GLOSSARY.words).
   Uses Unicode lookarounds so Greek (non-ASCII) and German (umlauts) match. */
function highlightTerms(text) {
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const surface = new Map(); // lowercased surface form → glossary key
  for (const key of Object.keys(GLOSSARY)) {
    const words = GLOSSARY[key].words[LANG] || GLOSSARY[key].words.en;
    for (const w of words) surface.set(w.toLowerCase(), key);
  }

  const pattern = [...surface.keys()]
    .sort((a, b) => b.length - a.length)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
  // \p{L}/\p{N} with the "u" flag = proper word boundary across scripts.
  const re = new RegExp(`(?<![\\p{L}\\p{N}])(${pattern})(?![\\p{L}\\p{N}])`, "giu");

  return esc(text).replace(re, (match) => {
    const key = surface.get(match.toLowerCase());
    if (!key) return match;
    return `<span class="q-term" tabindex="0" role="button" aria-label="${esc(match)}">${match}<span class="q-tip">${esc(L(GLOSSARY[key].def))}</span></span>`;
  });
}

/* Tap/click a term to toggle its tooltip (touch devices don't hover). */
document.addEventListener("click", (e) => {
  const term = e.target.closest(".q-term");
  document.querySelectorAll(".q-term.open").forEach((el) => { if (el !== term) el.classList.remove("open"); });
  if (term) term.classList.toggle("open");
});

function selectAnswer(value) {
  flash(value);
  responses[current] = value;
  if (current < activeQuestions.length - 1) {
    current++;
    renderQuestion();
  } else {
    $("progress-fill").style.width = "100%";
    showResults();
  }
}

/* ---------- Scoring ---------- */

function computeScores() {
  let econ = 0, auth = 0, maxE = 0, maxA = 0;
  activeQuestions.forEach((item, i) => {
    const a = responses[i] ?? 0;
    econ += a * item.econ;
    auth += a * item.auth;
    maxE += 2 * Math.abs(item.econ); // theoretical max for this subset
    maxA += 2 * Math.abs(item.auth);
  });
  // Normalise so 10 / 20 / 30-question levels all map onto the same −10..+10 scale
  const norm = (v, m) => clamp((v / (m || 1)) * 10, -10, 10);
  return { econ: norm(econ, maxE), auth: norm(auth, maxA) };
}

const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));
const dist = (a, b) => Math.hypot(a.econ - b.econ, a.auth - b.auth);
const MAX_DIST = Math.hypot(20, 20); // full diagonal of the compass
const similarity = (d) => Math.max(0, Math.round((1 - d / MAX_DIST) * 100));

const rankedFigures = (you) => FIGURES.map((f) => ({ ...f, d: dist(you, f) })).sort((a, b) => a.d - b.d);
const rankedCountries = (you) => COUNTRIES.map((c) => ({ ...c, d: dist(you, c) })).sort((a, b) => a.d - b.d);
const rankedIdeologies = (you) => IDEOLOGIES.map((i) => ({ ...i, d: dist(you, i) })).sort((a, b) => a.d - b.d);

function quadrantFor(you) {
  if (Math.abs(you.econ) < 1.5 && Math.abs(you.auth) < 1.5) return QUADRANTS.center;
  if (you.econ < 0 && you.auth >= 0) return QUADRANTS.tl;
  if (you.econ >= 0 && you.auth >= 0) return QUADRANTS.tr;
  if (you.econ < 0 && you.auth < 0) return QUADRANTS.bl;
  return QUADRANTS.br;
}
