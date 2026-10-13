/* CompassMatch — app bootstrap: options, background & init */


/* ---------- Language switcher wiring ---------- */

document.querySelectorAll(".lang-btn").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));

/* ---------- Options tab ---------- */

function syncOptions() {
  [["opt-animations", "animations"], ["opt-blackhole", "blackhole"], ["opt-flash", "flash"]].forEach(([id, key]) => {
    const el = $(id);
    if (!el) return;
    el.checked = settings[key];
    const row = el.closest(".option-row");
    if (row) row.classList.toggle("on", settings[key]);
  });
}

$("btn-options").addEventListener("click", () => { syncOptions(); showScreen("options"); });
$("btn-options-back").addEventListener("click", () => showScreen("intro"));

[["opt-animations", "animations"], ["opt-blackhole", "blackhole"], ["opt-flash", "flash"]].forEach(([id, key]) => {
  const el = $(id);
  if (!el) return;
  el.addEventListener("change", () => {
    settings[key] = el.checked;
    saveSettings();
    applySettings();
    const row = el.closest(".option-row");
    if (row) {
      row.classList.toggle("on", el.checked);
      if (el.checked) { // glow pulse only when enabling
        row.classList.remove("pulse");
        void row.offsetWidth;   // force reflow so the animation can replay
        row.classList.add("pulse");
        setTimeout(() => row.classList.remove("pulse"), 560);
      }
    }
  });
});

/* ---------- Background: grid warped toward the cursor (gravity well) ---------- */

(function initBackground() {
  const bg = document.getElementById("bg-canvas");
  const warp = document.getElementById("warp-canvas");
  if (!bg && !warp) return;
  const bctx = bg ? bg.getContext("2d") : null;
  const wctx = warp ? warp.getContext("2d") : null;

  const SPACING = 34;          // grid cell size
  const INFLUENCE = 240;       // how far the warp reaches
  const STRENGTH = 0.42;       // how hard points bend inward
  const SWIRL = 0.55;          // tangential twist, black-hole style

  let w = 0, h = 0, dpr = 1;
  let mx = -9999, my = -9999, active = false;

  function sizeCanvas(c) {
    if (!c) return;
    c.width = w * dpr;
    c.height = h * dpr;
    c.style.width = w + "px";
    c.style.height = h + "px";
    c.getContext("2d").setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    sizeCanvas(bg);
    sizeCanvas(warp);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; active = true; }, { passive: true });
  document.addEventListener("pointerleave", () => { active = false; });
  window.addEventListener("blur", () => { active = false; });
  resize();

  // Shared gravity-well grid; hot() styles points near the cursor.
  function drawGrid(ctx, baseAlpha, hot, glowColor) {
    ctx.clearRect(0, 0, w, h);
    const fade = (y) => {
      const f = 1 - Math.min(1, (y / h) * 1.15);
      return baseAlpha + f * baseAlpha * 1.7;
    };

    for (let y = SPACING / 2; y < h; y += SPACING) {
      for (let x = SPACING / 2; x < w; x += SPACING) {
        let px = x, py = y, glow = 0;

        if (active && animationsOn()) {
          const dx = mx - x, dy = my - y;
          const d = Math.hypot(dx, dy);
          if (d < INFLUENCE) {
            const pull = (1 - d / INFLUENCE) ** 2;
            const bend = pull * STRENGTH * INFLUENCE;
            const ang = Math.atan2(dy, dx) + SWIRL * pull;
            px = x + Math.cos(ang) * bend;
            py = y + Math.sin(ang) * bend;
            glow = pull;
          }
        }

        const a = fade(y) + glow * 0.5;
        ctx.fillStyle = glow > 0.15 ? hot(a) : `rgba(255, 255, 255, ${a})`;
        const size = 1.4 + glow * 1.6;
        ctx.fillRect(px - size / 2, py - size / 2, size, size);
      }
    }

    if (active && animationsOn() && glowColor) {
      const g = ctx.createRadialGradient(mx, my, 0, mx, my, INFLUENCE * 0.55);
      g.addColorStop(0, glowColor);
      g.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(mx, my, INFLUENCE * 0.55, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function draw() {
    if (!blackholeOn()) {
      // Effect removed — clear both canvases so only the base gradient shows
      if (bctx) bctx.clearRect(0, 0, w, h);
      if (wctx) wctx.clearRect(0, 0, w, h);
      requestAnimationFrame(draw);
      return;
    }
    const onResults = document.body.classList.contains("results-active");
    if (onResults && wctx) {
      // Black-hole warp blended over the flag (overlay → lensing shimmer)
      drawGrid(wctx, 0.06, (a) => `rgba(255, 255, 255, ${Math.min(0.85, a + 0.3)})`, "rgba(255, 255, 255, 0.14)");
    } else if (bctx) {
      drawGrid(bctx, 0.028, (a) => `rgba(91, 141, 239, ${Math.min(0.65, a + 0.18)})`, "rgba(91, 141, 239, 0.10)");
    }
    requestAnimationFrame(draw);
  }

  draw();
})();

/* ---------- Init ---------- */

document.addEventListener("DOMContentLoaded", () => {
  const chip = document.querySelector("[data-version-chip]");
  if (chip) chip.textContent = `v${VERSION}`;
  const foot = $("footer-version");
  if (foot) foot.textContent = `v${VERSION}`;
  applyLanguage();
});

// The script is at the end of <body>, so the DOM is already parsed — run now too.
(() => {
  const chip = document.querySelector("[data-version-chip]");
  if (chip) chip.textContent = `v${VERSION}`;
  const foot = $("footer-version");
  if (foot) foot.textContent = `v${VERSION}`;
  applyLanguage();
  applySettings();
  syncOptions();
})();
