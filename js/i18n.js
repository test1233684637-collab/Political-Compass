/* CompassMatch — i18n: languages, translations & locale flags */

const VERSION = "1.4.5";

/* ---------- Language ---------- */

const LANGS = { en: "English", el: "Ελληνικά", de: "Deutsch" };

/* Flag of Greece (royal standard style): white cross on blue with a golden
   crown at the centre. Rendered with `slice` so it fills any container. */
const GREEK_FLAG_SVG =
  `<svg viewBox="0 0 27 18" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">` +
  `<rect width="27" height="18" fill="#00549D"/>` +
  `<rect x="11.5" y="0" width="4" height="18" fill="#fff"/>` +
  `<rect x="0" y="7" width="27" height="4" fill="#fff"/>` +
  `<path d="M10.3 11 L11.2 7 L12.1 9.2 L13.5 5.6 L14.9 9.2 L15.8 7 L16.7 11 Z" fill="#F3C233" stroke="#C9971B" stroke-width="0.22"/>` +
  `<rect x="10" y="11" width="7" height="1.3" rx="0.3" fill="#F3C233" stroke="#C9971B" stroke-width="0.22"/>` +
  `<circle cx="11.7" cy="11.65" r="0.32" fill="#C0392B"/>` +
  `<circle cx="13.5" cy="11.65" r="0.32" fill="#2E6DB4"/>` +
  `<circle cx="15.3" cy="11.65" r="0.32" fill="#C0392B"/>` +
  `<circle cx="11.2" cy="6.8" r="0.34" fill="#F3C233" stroke="#C9971B" stroke-width="0.18"/>` +
  `<circle cx="13.5" cy="5.4" r="0.38" fill="#F3C233" stroke="#C9971B" stroke-width="0.18"/>` +
  `<circle cx="15.8" cy="6.8" r="0.34" fill="#F3C233" stroke="#C9971B" stroke-width="0.18"/>` +
  `</svg>`;

/* Simple flag + badge shown in the language-switch cutscene. */
const LANG_FLAGS = {
  en: { code: "EN", bg: "#fff",
    emblem: `<svg viewBox="0 0 40 40"><rect x="16" width="8" height="40" fill="#C8102E"/><rect y="16" width="40" height="8" fill="#C8102E"/></svg>` },
  el: { code: "ΕΛ", bg: "#00549D", emblem: GREEK_FLAG_SVG },
  de: { code: "DE", bg: "linear-gradient(180deg,#000 33.3%,#DD0000 33.3% 66.6%,#FFCE00 66.6%)", emblem: "" },
};

let LANG = "en";
try {
  const saved = localStorage.getItem("compassmatch.lang");
  if (saved && LANGS[saved]) LANG = saved;
} catch { /* storage unavailable */ }

/* Static UI strings, keyed by language. */
const UI = {
  en: {
    "lang.label": "Language",
    "intro.h1": `Where do you <span class="gradient-text">really</span> stand?`,
    "intro.lede": `Answer <strong>10 to 30 questions</strong> about the economy, authority, and personal freedom. We'll plot you on the two-axis political compass and find the public figure whose positions match yours most closely.`,
    "intro.feat1": "Two-axis scoring (economic + social freedom)",
    "intro.feat2": "30 political figures + 30 countries ranked by similarity",
    "intro.feat3": "Your closest ideology explained (communism, fascism & more)",
    "intro.feat4": "Takes about 3 minutes — no sign-up, nothing stored",
    "intro.btnHistory": "View past results",
    "intro.btnStart": "Start the quiz →",
    "intro.fineprint": "For entertainment and self-reflection. Figures' positions are simplified approximations.",
    "history.title": "Your past results",
    "history.clear": "Clear history",
    "history.empty1": "No saved results yet.",
    "history.empty2": "Take the quiz and your matches will appear here — stored only in this browser.",
    "history.start": "Start the quiz →",
    "history.back": "← Back",
    "history.guideSummary": "What do ideologies mean?",
    "history.guideIntro": "A plain-language guide to the ideologies this quiz can match you with.",
    "quiz.question": "Question",
    "quiz.back": "← Back",
    "card.compass": "Your compass position",
    "card.quadrant": "Your quadrant",
    "card.figure": "Your closest political figure",
    "card.country": "Your closest country",
    "card.ideology": "Your closest ideology",
    "card.runners": "Also similar to",
    "card.breakdown": "Your answers, summarized",
    "quad.tl": `Authoritarian<br>Left`,
    "quad.tr": `Authoritarian<br>Right`,
    "quad.bl": `Libertarian<br>Left`,
    "quad.br": `Libertarian<br>Right`,
    "legend.you": "You",
    "legend.fig": "Public figures",
    "coord.economic": "Economic",
    "coord.social": "Social",
    "results.restart": "↺ Retake the quiz",
    "results.copy": "Copy results",
    "results.copied": "✓ Copied to clipboard!",
    "results.copyFailed": "Couldn't copy automatically — here it is: ",
    "coords.left": "Left",
    "coords.right": "Right",
    "coords.center": "Center",
    "coords.libertarian": "Libertarian",
    "coords.authoritarian": "Authoritarian",
    "hint.econLeft": "Leans economic left if you agree",
    "hint.econRight": "Leans economic right if you agree",
    "hint.socialFree": "Leans social freedom if you agree",
    "hint.socialAuth": "Leans social authority if you agree",
    "similarity": "similarity",
    "breakdown.noAnswer": "No answer",
    "history.ideology": "Ideology",
    "history.country": "Country",
    "copy.header": "I took the CompassMatch political compass quiz",
    "copy.economic": "Economic",
    "copy.social": "Social",
    "copy.figure": "Closest figure",
    "copy.country": "Closest country",
    "copy.ideology": "Closest ideology",
    "footer.tag": "· a lightweight political compass quiz · Positions of public figures are approximate and for entertainment only. Portrait photos from Wikimedia Commons.",
    "options.title": "Options",
    "options.lead": "Customise how the app looks and moves.",
    "options.anim": "Animations",
    "options.animDesc": "Turn off every transition, cutscene and effect",
    "options.blackhole": "Background effect",
    "options.blackholeDesc": "The cursor black-hole / gravity-well background",
    "options.flash": "Answer flash",
    "options.flashDesc": "Colored screen flash when you answer a question",
    "options.back": "← Back",
    "options.button": "Options",
    "level.title": "Choose your quiz",
    "level.lead": "More questions = a more accurate result.",
    "level.quick": "Quick",
    "level.standard": "Standard",
    "level.deep": "Deep",
    "level.questions": "questions",
    "level.warn": "This would probably be inaccurate — so few questions only give a rough estimate.",
    "level.start": "Start →",
  },
  el: {
    "lang.label": "Γλώσσα",
    "intro.h1": `Πού βρίσκεσαι <span class="gradient-text">στην πραγματικότητα</span>;`,
    "intro.lede": `Απαντήστε σε <strong>10 έως 30 ερωτήσεις</strong> για την οικονομία, την εξουσία και την προσωπική ελευθερία. Θα σας τοποθετήσουμε στη διάσταση πυξίδα και θα βρούμε τη δημόσια προσωπικότητα που ταιριάζει περισσότερο σε εσάς.`,
    "intro.feat1": "Βαθμολόγηση σε δύο άξονες (οικονομικό + κοινωνική ελευθερία)",
    "intro.feat2": "30 πολιτικές προσωπικότητες + 30 χώρες κατάταξη κατ' ομοιότητα",
    "intro.feat3": "Η ιδεολογία που σας ταιριάζει (κομμουνισμός, φασισμός & περισσότερα)",
    "intro.feat4": "Διαρκεί περίπου 3 λεπτά — χωρίς εγγραφή, χωρίς αποθήκευση",
    "intro.btnHistory": "Δείτε προηγούμενα αποτελέσματα",
    "intro.btnStart": "Ξεκινήστε το κουίζ →",
    "intro.fineprint": "Για ψυχαγωγία και αυτανάλυση. Οι θέσεις των προσωπικοτήτων είναι аπλοποιημένες εκτιμήσεις.",
    "history.title": "Τα προηγούμενα αποτελέσματά σας",
    "history.clear": "Καθαρισμός ιστορικού",
    "history.empty1": "Δεν υπάρχουν αποθηκευμένα αποτελέσματα ακόμη.",
    "history.empty2": "Κάντε το κουίζ και τα αποτελέσματά σας θα εμφανιστούν εδώ — αποθηκεύονται μόνο σε αυτόν τον browser.",
    "history.start": "Ξεκινήστε το κουίζ →",
    "history.back": "← Πίσω",
    "history.guideSummary": "Τι σημαίνουν οι ιδεολογίες;",
    "history.guideIntro": "Οδηγός με απλά λόγια για τις ιδεολογίες με τις οποίες μπορεί να σας ταιριάξει το κουίζ.",
    "quiz.question": "Ερώτηση",
    "quiz.back": "← Πίσω",
    "card.compass": "Η θέση σας στην πυξίδα",
    "card.quadrant": "Το τεταρτημόριό σας",
    "card.figure": "Η πιο κοντινή πολιτική προσωπικότητα",
    "card.country": "Η πιο κοντινή χώρα",
    "card.ideology": "Η πιο κοντινή ιδεολογία",
    "card.runners": "Επίσης παρόμοιοι με",
    "card.breakdown": "Οι απαντήσεις σας, συνοπτικά",
    "quad.tl": `Αυταρχική<br>Αριστερά`,
    "quad.tr": `Αυταρχική<br>Δεξιά`,
    "quad.bl": `Ελεύθερη<br>Αριστερά`,
    "quad.br": `Ελεύθερη<br>Δεξιά`,
    "legend.you": "Εσείς",
    "legend.fig": "Δημόσιες προσωπικότητες",
    "coord.economic": "Οικονομικό",
    "coord.social": "Κοινωνικό",
    "results.restart": "↺ Επανάληψη του κουίζ",
    "results.copy": "Αντιγραφή αποτελεσμάτων",
    "results.copied": "✓ Αντιγράφηκε στο πρόχειρο!",
    "results.copyFailed": "Δεν ήταν δυνατή η αυτόματη αντιγραφή — ακολουθεί: ",
    "coords.left": "Αριστερά",
    "coords.right": "Δεξιά",
    "coords.center": "Κέντρο",
    "coords.libertarian": "Ελεύθερο",
    "coords.authoritarian": "Αυταρχικό",
    "hint.econLeft": "Κλίνει προς την οικονομική αριστερά αν συμφωνήσετε",
    "hint.econRight": "Κλίνει προς την οικονομική δεξιά αν συμφωνήσετε",
    "hint.socialFree": "Κλίνει προς την κοινωνική ελευθερία αν συμφωνήσετε",
    "hint.socialAuth": "Κλίνει προς την κοινωνική αυταρχικότητα αν συμφωνήσετε",
    "similarity": "ομοιότητα",
    "breakdown.noAnswer": "Χωρίς απάντηση",
    "history.ideology": "Ιδεολογία",
    "history.country": "Χώρα",
    "copy.header": "Έκανα το πολιτικό κουίζ CompassMatch",
    "copy.economic": "Οικονομικό",
    "copy.social": "Κοινωνικό",
    "copy.figure": "Πιο κοντινή προσωπικότητα",
    "copy.country": "Πιο κοντινή χώρα",
    "copy.ideology": "Πιο κοντινή ιδεολογία",
    "footer.tag": "· ένα ελαφρύ πολιτικό κουίζ πυξίδα · Οι θέσεις των δημοσίων προσωπικοτήτων είναι προσεγγιστικές και μόνο για ψυχαγωγία. Φωτογραφίες από τα Wikimedia Commons.",
    "options.title": "Επιλογές",
    "options.lead": "Προσαρμόστε την εμφάνιση και την κίνηση της εφαρμογής.",
    "options.anim": "Κινήσεις",
    "options.animDesc": "Απενεργοποίηση κάθε μετάβασης, σκηνικού και εφέ",
    "options.blackhole": "Εφέ φόντου",
    "options.blackholeDesc": "Το εφέ μαύρης οπής / βαρυτικού πηδαλίου του δρομέα",
    "options.flash": "Αναλαμπή απάντησης",
    "options.flashDesc": "Έγχρωμη αναλαμπή στην οθόνη όταν απαντάτε",
    "options.back": "← Πίσω",
    "options.button": "Επιλογές",
    "level.title": "Επιλέξτε κουίζ",
    "level.lead": "Περισσότερες ερωτήσεις = πιο ακριβές αποτέλεσμα.",
    "level.quick": "Γρήγορο",
    "level.standard": "Τυπικό",
    "level.deep": "Βαθύ",
    "level.questions": "ερωτήσεις",
    "level.warn": "Αυτό θα ήταν πιθανότατα ανακριβές — τόσες λίγες ερωτήσεις δίνουν μόνο μια προσεγγιστική εικόνα.",
    "level.start": "Έναρξη →",
  },
  de: {
    "lang.label": "Sprache",
    "intro.h1": `Wo stehst du <span class="gradient-text">wirklich</span>?`,
    "intro.lede": `Beantworte <strong>10 bis 30 Fragen</strong> zu Wirtschaft, Autorität und persönlicher Freiheit. Wir platzieren Sie auf dem zweiaxeligen politischen Kompass und finden die öffentliche Persönlichkeit, deren Positionen am besten zu Ihnen passen.`,
    "intro.feat1": "Zwei-Achsen-Bewertung (wirtschaftlich + soziale Freiheit)",
    "intro.feat2": "30 politische Persönlichkeiten + 30 Länder nach Ähnlichkeit sortiert",
    "intro.feat3": "Ihre nächste Ideologie erklärt (Kommunismus, Faschismus & mehr)",
    "intro.feat4": "Dauert etwa 3 Minuten — keine Anmeldung, nichts gespeichert",
    "intro.btnHistory": "Vergangene Ergebnisse ansehen",
    "intro.btnStart": "Quiz starten →",
    "intro.fineprint": "Zur Unterhaltung und Selbstreflexion. Die Positionen der Persönlichkeiten sind vereinfachte Näherungen.",
    "history.title": "Ihre vergangenen Ergebnisse",
    "history.clear": "Verlauf löschen",
    "history.empty1": "Noch keine gespeicherten Ergebnisse.",
    "history.empty2": "Mach das Quiz und deine Treffer erscheinen hier — nur in diesem Browser gespeichert.",
    "history.start": "Quiz starten →",
    "history.back": "← Zurück",
    "history.guideSummary": "Was bedeuten Ideologien?",
    "history.guideIntro": "Ein Leitfaden in einfacher Sprache zu den Ideologien, mit denen dieses Quiz Sie abgleichen kann.",
    "quiz.question": "Frage",
    "quiz.back": "← Zurück",
    "card.compass": "Deine Kompassposition",
    "card.quadrant": "Dein Quadrant",
    "card.figure": "Dein nächster politischer Mensch",
    "card.country": "Dein nächstes Land",
    "card.ideology": "Dein nächste Ideologie",
    "card.runners": "Ähnlich auch",
    "card.breakdown": "Deine Antworten, zusammengefasst",
    "quad.tl": `Autoritäre<br>Linke`,
    "quad.tr": `Autoritäre<br>Rechte`,
    "quad.bl": `Libertäre<br>Linke`,
    "quad.br": `Libertäre<br>Rechte`,
    "legend.you": "Du",
    "legend.fig": "Öffentliche Persönlichkeiten",
    "coord.economic": "Wirtschaftlich",
    "coord.social": "Sozial",
    "results.restart": "↺ Quiz wiederholen",
    "results.copy": "Ergebnisse kopieren",
    "results.copied": "✓ In die Zwischenablage kopiert!",
    "results.copyFailed": "Konnte nicht automatisch kopiert werden — hier ist es: ",
    "coords.left": "Links",
    "coords.right": "Rechts",
    "coords.center": "Mitte",
    "coords.libertarian": "Libertär",
    "coords.authoritarian": "Autoritär",
    "hint.econLeft": "Neigt bei Zustimmung zur wirtschaftlichen Linken",
    "hint.econRight": "Neigt bei Zustimmung zur wirtschaftlichen Rechten",
    "hint.socialFree": "Neigt bei Zustimmung zur sozialen Freiheit",
    "hint.socialAuth": "Neigt bei Zustimmung zur sozialen Autorität",
    "similarity": "Ähnlichkeit",
    "breakdown.noAnswer": "Keine Antwort",
    "history.ideology": "Ideologie",
    "history.country": "Land",
    "copy.header": "Ich habe den CompassMatch politischen Kompass-Quiz gemacht",
    "copy.economic": "Wirtschaftlich",
    "copy.social": "Sozial",
    "copy.figure": "Nächste Figur",
    "copy.country": "Nächstes Land",
    "copy.ideology": "Nächste Ideologie",
    "footer.tag": "· ein leichtgewichtiger politischer Kompass-Quiz · Die Positionen öffentlicher Persönlichkeiten sind Näherungen und nur zur Unterhaltung. Porträtfotos von Wikimedia Commons.",
    "options.title": "Optionen",
    "options.lead": "Passe Aussehen und Bewegung der App an.",
    "options.anim": "Animationen",
    "options.animDesc": "Alle Übergänge, Effekte und Einspielungen ausschalten",
    "options.blackhole": "Hintergrundeffekt",
    "options.blackholeDesc": "Der Schwerkraft- / Schwarzloch-Hintergrund des Cursors",
    "options.flash": "Antwort-Blitz",
    "options.flashDesc": "Farbiger Bildschirmblitz beim Beantworten",
    "options.back": "← Zurück",
    "options.button": "Optionen",
    "level.title": "Wähle dein Quiz",
    "level.lead": "Mehr Fragen = genaueres Ergebnis.",
    "level.quick": "Schnell",
    "level.standard": "Standard",
    "level.deep": "Tief",
    "level.questions": "Fragen",
    "level.warn": "Das wäre wahrscheinlich ungenau — so wenige Fragen geben nur eine grobe Schätzung.",
    "level.start": "Start →",
  },
};

const t = (k) => (UI[LANG] && UI[LANG][k]) || UI.en[k] || k;
/* Localize a data field that may be a string or an {en, el, de} object. */
const L = (o) => (o == null ? "" : typeof o === "string" ? o : (o[LANG] ?? o.en ?? ""));

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Language switching (with wipe animation) ---------- */

function applyLanguage() {
  document.documentElement.lang = LANG;
  document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
  document.querySelectorAll("[data-lang-name]").forEach((el) => { el.textContent = LANGS[LANG]; });
  document.querySelectorAll(".lang-btn").forEach((b) => b.classList.toggle("active", b.dataset.lang === LANG));
}

/* Briefly animate the current-language name as it changes. */
function playNameSwap() {
  document.querySelectorAll("[data-lang-name]").forEach((el) => {
    el.removeAttribute("data-swap"); void el.offsetWidth; el.setAttribute("data-swap", "");
    setTimeout(() => el.removeAttribute("data-swap"), 420);
  });
}

/* Show the target language's flag + code badge during the switch cutscene. */
function playLangFlag(lang) {
  const el = $("lang-flag");
  if (!el || !animationsOn()) return; // no cutscene when animations are off
  const f = LANG_FLAGS[lang];
  if (!f) return;
  el.style.background = f.bg;
  el.querySelector(".lang-flag-emblem").innerHTML = f.emblem || "";
  el.querySelector(".lang-flag-code").textContent = f.code;
  el.classList.remove("show"); void el.offsetWidth; el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 760);
}

function rerenderActive() {
  if (activeScreen === "quiz") renderQuestion();
  else if (activeScreen === "results") renderResults();
  else if (activeScreen === "history") renderHistory();
}

function setLang(lang) {
  if (!LANGS[lang] || lang === LANG) return;

  const finish = () => {
    LANG = lang;
    try { localStorage.setItem("compassmatch.lang", lang); } catch { /* ignore */ }
    applyLanguage();
    rerenderActive();
    playNameSwap();
  };

  // spin the globe icons right away (only when animations are on)
  if (animationsOn()) {
    document.querySelectorAll(".lang-globe").forEach((g) => {
      g.classList.remove("spin"); void g.offsetWidth; g.classList.add("spin");
    });
  }
  playLangFlag(lang); // pop the target language's flag in the cutscene

  if (!animationsOn()) { finish(); return; }

  const wipe = $("lang-wipe");
  if (!wipe) { finish(); return; }
  // sweep a colored panel across the screen, swap text at the midpoint, then sweep away
  wipe.classList.remove("wipe-out");
  wipe.classList.add("wipe-in");
  setTimeout(() => {
    finish();
    wipe.classList.remove("wipe-in");
    wipe.classList.add("wipe-out");
    setTimeout(() => wipe.classList.remove("wipe-out"), 450);
  }, 270);
}

