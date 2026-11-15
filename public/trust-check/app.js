/*
 * Trust Check app. Plain JavaScript, no build step, no network calls.
 * Copy lives in content.js. Saved data lives only in localStorage under
 * "trustCheck.v1".
 */
(function () {
  "use strict";

  var C = window.TC_CONTENT;
  var KEY = "trustCheck.v1";
  var ZONES = ["Build", "Grow", "Sustain"];
  var SIZES = ["small", "medium", "big"];
  var N = C.statements.length;

  var main = document.getElementById("main");
  var foot = document.getElementById("site-foot");
  var announcer = document.getElementById("announce");
  var dialog = document.getElementById("dialog");

  /* ---------------- Helpers ---------------- */

  // Escaped text with any quoted speech in italics ("..." becomes an italic quote).
  function rich(s) {
    return esc(s).replace(/&quot;(.+?)&quot;/g, '<em>\u201c$1\u201d</em>');
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  // Scores run 1 (Rarely) to 4 (Almost always), so totals run 11 to 44.
  // Build: on average Sometimes or lower. Sustain: on average Often or higher.
  var MAX = 4, TOP = 11 * MAX;
  var RANGES = { Build: [11, 22], Grow: [23, 32], Sustain: [33, 44] };
  function zoneFor(total) { return total <= RANGES.Build[1] ? "Build" : total <= RANGES.Grow[1] ? "Grow" : "Sustain"; }
  // Where the meter marker sits (0 to 1). The meter shows three equal parts,
  // so the marker goes to the middle of its score's slot inside its zone.
  // Moved to Grow by the fairness rules: the nearest edge of Grow.
  function meterAt(total, zone) {
    var raw = zoneFor(total);
    var shown = raw === zone ? total : raw === "Sustain" ? RANGES.Grow[1] : RANGES.Grow[0];
    var k = ZONES.indexOf(zone), r = RANGES[zone];
    return (k + (shown - r[0] + 0.5) / (r[1] - r[0] + 1)) / 3;
  }
  // Fairness rules on top of the total, so one area can't decide the zone:
  //  An area is low when its average is under 2.5 (it leans Rarely or Sometimes).
  //  - Sustain needs no low areas. Any low area: Grow, with every low area named.
  //  - Build needs at least two low areas. A low total that comes from
  //    just one area: Grow, with that area named.
  function zoneInfo(scores) {
    var base = zoneFor(sum(scores)), low = [], lowest = "", lowestAvg = MAX + 1;
    C.groups.forEach(function (g) {
      var avg = g.items.reduce(function (a, i) { return a + scores[i]; }, 0) / g.items.length;
      if (avg < 2.5) low.push(g.name);
      if (avg < lowestAvg) { lowest = g.name; lowestAvg = avg; }
    });
    if (base === "Sustain" && low.length) return { zone: "Grow", from: "Sustain", area: lowest, low: low };
    if (base === "Build" && low.length < 2) return { zone: "Grow", from: "Build", area: lowest };
    return { zone: base, from: "", area: "" };
  }
  function zoneOf(scores) { return zoneInfo(scores).zone; }
  function zoneNote(scores) {
    var z = zoneInfo(scores);
    if (!z.from) return "";
    if (z.from === "Sustain" && z.low.length > 1) return C.results.capNoteMany.replace("{count}", ["", "one", "two", "three", "four"][z.low.length]).replace("{areas}", listAnd(z.low));
    return (z.from === "Sustain" ? C.results.capNote : C.results.liftNote).replace(/\{area\}/g, z.area);
  }
  // "A", "A, and B", "A, B, and C". The comma before "and" keeps area names
  // that contain "and" readable.
  function listAnd(a) {
    return a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + ", and " + a[a.length - 1];
  }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function zClass(z) { return "z-" + z.toLowerCase(); }

  function longDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  function shortDate(iso) {
    var d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  function isoLocal(d) {
    function p(n) { return (n < 10 ? "0" : "") + n; }
    var off = -d.getTimezoneOffset();
    var sign = off >= 0 ? "+" : "-";
    off = Math.abs(off);
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) +
      "T" + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()) +
      sign + p(Math.floor(off / 60)) + ":" + p(off % 60);
  }
  function ymd(iso) {
    var d = new Date(iso);
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }
  // Time of a take, so same-day PDFs are told apart: "7:42 PM" and "1942".
  function timeLabel(iso) {
    return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  }
  function hhmm(iso) {
    var d = new Date(iso);
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return p(d.getHours()) + p(d.getMinutes());
  }
  function signed(n) { return n > 0 ? "+" + n : n < 0 ? "−" + Math.abs(n) : "0"; }

  function announce(msg) {
    announcer.textContent = "";
    window.setTimeout(function () { announcer.textContent = msg; }, 60);
  }

  var ICON_BACK = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>';
  var ICON_DOWN = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>';
  var ICON_EYE = '<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#c4673a" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';

  /* ---------------- Storage (every access wrapped) ---------------- */

  function storageWorks() {
    try {
      var k = "trustCheck.__probe";
      window.localStorage.setItem(k, "1");
      window.localStorage.removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  function cleanTake(t) {
    if (!t || typeof t !== "object") return null;
    if (typeof t.date !== "string" || isNaN(Date.parse(t.date))) return null;
    if (!Array.isArray(t.scores) || t.scores.length !== N) return null;
    for (var i = 0; i < N; i++) {
      var v = t.scores[i];
      if (typeof v !== "number" || v !== Math.floor(v) || v < 1 || v > MAX) return null;
    }
    var total = sum(t.scores);
    var size = SIZES.indexOf(t.askSize) >= 0 ? t.askSize : null;
    var zone = zoneOf(t.scores);
    return {
      date: t.date,
      ask: typeof t.ask === "string" ? t.ask.slice(0, C.ask.max) : "",
      askSize: size,
      tried: typeof t.tried === "string" ? t.tried.slice(0, C.tried.max) : "",
      scores: t.scores.slice(),
      total: total,
      zone: zone,
      gridResult: size ? C.grid.cells[zone][size] : null,
      pdfDownloaded: t.pdfDownloaded === true
    };
  }

  function readStore() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return null;
      var d = JSON.parse(raw);
      if (!d || d.version !== 2 || !Array.isArray(d.takes) || !d.takes.length) return null;
      var takes = [];
      for (var i = 0; i < d.takes.length; i++) {
        var t = cleanTake(d.takes[i]);
        if (!t) return null; // wrong shape: ignore it all, run first-time path
        takes.push(t);
      }
      return takes;
    } catch (e) { return null; }
  }

  function writeStore(takes) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify({ version: 2, takes: takes }));
      return true;
    } catch (e) { return false; }
  }

  function clearStore() {
    try { window.localStorage.removeItem(KEY); } catch (e) { /* nothing to clear */ }
  }

  /* ---------------- State ---------------- */

  var S;
  function freshState() {
    var saved = readStore();
    return {
      saved: saved,             // takes found on load (null if none)
      canSave: storageWorks(),
      mode: "first",            // first | retake | cleared
      ask: "",
      tried: "",
      scores: new Array(N).fill(0),
      cardShown: new Array(N).fill(false),
      takes: null,              // all takes once results are reached
      saveOk: false,
      finished: false,
      downloaded: false,
      screen: null,
      index: 0,
      visited: {},              // screens seen this take (for the Steps menu)
      reached: -1,              // furthest statement reached
      editing: false            // changing answers after results: update the same take
    };
  }

  function homeScreen() { return "welcome"; } // one front door; returning people use "Coming back to retake it?"

  /* ---------------- Navigation ---------------- */

  function go(screen, opts) {
    opts = opts || {};
    S.screen = screen;
    if (typeof opts.index === "number") S.index = opts.index;
    var state = { s: screen, i: S.index };
    try {
      if (opts.replace) history.replaceState(state, "");
      else history.pushState(state, "");
    } catch (e) { /* history may be unavailable in some sandboxes */ }
    render(opts.focus);
  }

  window.addEventListener("popstate", function (e) {
    var st = e.state;
    if (!st || !st.s) return;
    if (S.finished) {
      // Leaving results through browser Back.
      if (S.screen === "results" && !S.downloaded) {
        try { history.pushState({ s: "results", i: 0 }, ""); } catch (err) {}
        openLeave(function () { goHome(); });
        return;
      }
      goHome();
      return;
    }
    if (st.s === "results") { try { history.back(); } catch (err) {} return; }
    S.screen = st.s;
    S.index = st.i || 0;
    render();
  });

  window.addEventListener("beforeunload", function (e) {
    if (S && S.screen === "results" && !S.downloaded) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  function goHome() {
    S = freshState();
    go(homeScreen(), { replace: true });
  }

  /* ---------------- Rendering ---------------- */

  function render(focusSel) {
    document.body.setAttribute("data-screen", S.screen);
    // Browser and phone status bar color follows the top of the screen.
    var tealTop = BANDED[S.screen] || S.screen === "welcome" || S.screen === "welcomeBack";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", tealTop ? "#1f5050" : "#faf8f4");
    S.visited[S.screen] = true;
    if (S.screen === "statement") S.reached = Math.max(S.reached, S.index);
    var html = SCREENS[S.screen]();
    var isSplash = S.screen === "welcome" || S.screen === "welcomeBack";
    // Inner screens carry the same mark as the splash, with progress on the right.
    // The statement screen draws its own bar inside its teal band.
    // Banded screens draw the bar inside their teal band.
    var bar = (isSplash || BANDED[S.screen]) ? "" : appbar("");
    main.innerHTML = bar + html;
    renderFooter();
    bind[S.screen] && bind[S.screen]();
    applyVars(main);
    animateScreen(isSplash);
    window.scrollTo(0, 0);
    var target = (focusSel && $(focusSel, main)) || $("h1", main);
    if (target) {
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }
    document.title = titleFor() + " · Trust Check";
  }

  /* ---------------- Motion: one system for every screen ----------------
     1. Splash headline: words rise one at a time from behind a mask, then each
        detail rises in sequence (the opening moment).
     2. Every other screen: the main heading rises line by line from behind a
        mask, then the rest of the screen rises once as a group.
     3. Things that appear on tap (Why card, dialogs) rise briefly (CSS).
     Same easing everywhere; reduced motion turns all of it off (CSS). */
  var MOTION = { start: 120, word: 65, line: 110, settle: 180, item: 140, stage: 220 };

  // Wrap each word of a heading in a mask, keeping any inline styling (accent
  // words, the zone word). Returns the inner spans in reading order.
  function maskWords(h) {
    var walker = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), nodes = [], node, out = [];
    while ((node = walker.nextNode())) { if (!node.parentNode.closest(".sr-only")) nodes.push(node); }
    nodes.forEach(function (t) {
      var frag = document.createDocumentFragment();
      t.data.split(/(\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        var mask = document.createElement("span"), inner = document.createElement("span");
        mask.className = "mw"; inner.className = "mw-in";
        inner.textContent = part;
        mask.appendChild(inner); frag.appendChild(mask); out.push(inner);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return out;
  }

  function animateScreen(isSplash) {
    var h = isSplash ? $(".splash-h", main) : $("h1", main);
    if (!h) return;
    // Reduced motion: no masks, no delays, nothing to wait for.
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var words = maskWords(h), last = 0;
    if (isSplash) {
      words.forEach(function (w, k) { last = MOTION.start + k * MOTION.word; w.style.setProperty("--d", last + "ms"); });
    } else {
      // Words on the same line share a delay, so each line rises as one.
      var line = -1, top = null;
      words.forEach(function (w) {
        var t = w.parentNode.offsetTop;
        if (top === null || Math.abs(t - top) > 4) { line++; top = t; }
        last = MOTION.start + line * MOTION.line;
        w.style.setProperty("--d", last + "ms");
      });
    }
    var after = last + MOTION.settle;
    // The brush stroke under the accent word draws in once its words have risen.
    h.style.setProperty("--brush-delay", (last + 450) + "ms");
    if (isSplash) {
      var items = $all(".splash-lede, .splash-intro > p:not(.splash-lede), .facts li, .splash-body .actions .btn", main);
      items.forEach(function (el, k) { el.classList.add("enter"); el.style.setProperty("--d", (after + k * MOTION.item) + "ms"); });
      // On the welcome, the brush under "tell you?" is the last thing: it draws
      // once every detail has risen, as the final beat.
      h.style.setProperty("--brush-delay", (after + items.length * MOTION.item + 400) + "ms");
    } else {
      // Everything after the title block rises once, together.
      $all(".band-text, .below, .screen > :not(.topbar):not(h1):not(.titleblock), .overview > :not(.stack), .overview > .stack > :not(.titleblock)", main)
        .forEach(function (el) {
          if (el.closest(".enter") || el.querySelector("h1")) return;
          el.classList.add("enter"); el.style.setProperty("--d", after + "ms");
        });
      // Stages: Build, then Grow, then Sustain rise one after another, then the rest.
      var blocks = $all(".field-block", main), next = after + 120;
      blocks.forEach(function (el, k) {
        next = after + 120 + k * MOTION.stage;
        el.classList.add("enter"); el.style.setProperty("--d", next + "ms");
      });
      var foot = $(".stages-foot", main);
      if (foot) { foot.classList.add("enter"); foot.style.setProperty("--d", (next + MOTION.stage) + "ms"); }
    }
  }

  // CSP blocks inline style attributes, so sizes are set through the CSSOM.
  function applyVars(root) {
    $all("[data-v]", root).forEach(function (el) { el.style.setProperty("--v", el.getAttribute("data-v")); });
    $all("[data-at]", root).forEach(function (el) { el.style.setProperty("--at", el.getAttribute("data-at")); });
    $all("[data-p]", root).forEach(function (el) { el.style.setProperty("--p", el.getAttribute("data-p")); });
  }

  function titleFor() {
    switch (S.screen) {
      case "statement": return (S.index + 1) + " of " + N;
      case "results": return "Results";
      case "welcomeBack": return C.welcomeBack.headline.replace(/\.$/, "");
      case "stages": return "Three stages";
      case "cleared": return "No saved results";
      case "tried": return "What you've tried";
      default: return "Welcome";
    }
  }

  function renderFooter() {
    // On every screen. Mid-take, LinkedIn opens in a new tab so answers aren't lost.
    var midTake = !!BANDED[S.screen];
    foot.hidden = false;
    foot.innerHTML = '<span>' + esc(C.footer.owner) + '</span><span aria-hidden="true">·</span><a href="' + esc(C.linkedIn) + '" rel="noopener noreferrer"' + (midTake ? ' target="_blank"' : ' data-leave') + '>LinkedIn</a>' +
      '<span class="site-foot-sep2" aria-hidden="true">·</span><span class="site-foot-privacy">' + esc(C.footer.privacy) + '</span>';
  }

  foot.addEventListener("click", function (e) {
    var a = e.target.closest("a[data-leave]");
    if (!a) return;
    if (S.screen === "results" && !S.downloaded) {
      e.preventDefault();
      openLeave(function () { S.downloaded = true; window.location.href = a.href; }, true);
    }
  });

  function backBtn(label) {
    return '<button type="button" class="linkbtn" data-back>' + ICON_BACK + esc(label || C.cleared.back) + '</button>';
  }

  function bindBack(fn) {
    var b = $("[data-back]", main);
    if (b) b.addEventListener("click", fn || function () { history.back(); });
  }

  var SCREENS = {};
  var bind = {};

  /* 1. Welcome (first time): full-screen teal splash */
  var ICON_CLOCK = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var ICON_LOCK = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';
  var ICON_SCREEN = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="12" rx="1"/><path d="M8 20h8M12 16v4"/></svg>';

  var BANDED = { statement: true, ask: true, tried: true, stages: true };

  // Deep teal band shared by the question screens: mark, Back, optional progress,
  // then the eyebrow and heading as one title block.
  function band(o) {
    // o.stripTitle: the band collapses as you scroll to a slim pinned strip,
    // and the statement shrinks to fit it (see collapseBand).
    var strip = "";
    return '<section class="band' + (o.stripTitle ? " band--collapse" : "") + '"' + (o.stripTitle ? " data-collapse" : "") + '>' +
      appbar(o.count || "") +
      '<div class="wrap wrap--wide band-inner">' +
        '<div class="topbar">' + backBtn() + '</div>' +
        (o.progress || "") +
        '<div class="titleblock">' +
          (o.eyebrow ? '<p class="eyebrow"' + (o.eyebrowId ? ' id="' + o.eyebrowId + '"' : "") + '>' + esc(o.eyebrow) + '</p>' : "") +
          o.title +
        '</div>' +
        (o.after || "") +
      '</div>' +
      strip +
    '</section>';
  }

  // Optional text step: the button says "Skip" until something is typed.
  function bindOptional(ta, btn, skipLabel) {
    function sync() { btn.textContent = ta.value.trim() ? C.card.next : skipLabel; }
    ta.addEventListener("input", sync);
    sync();
  }

  var STEP_SCREENS = { ask: true, tried: true, stages: true, statement: true, results: true };
  var ICON_LIST = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3.5" cy="6" r="1"/><circle cx="3.5" cy="12" r="1"/><circle cx="3.5" cy="18" r="1"/></svg>';
  var ICON_LOCK_SM = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="1"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

  function appbar(right) {
    var steps = STEP_SCREENS[S.screen]
      ? '<button type="button" class="steps-btn" data-steps aria-haspopup="dialog">' + ICON_LIST + '<span>' + esc(C.steps.button) + '</span></button>'
      : "";
    return '<header class="appbar wrap wrap--wide">' + mark(true) +
      '<span class="appbar-right">' + (right || "") + steps + '</span></header>';
  }

  // Steps menu: jump to anything already seen; later statements stay locked.
  function openSteps() {
    var k = C.steps, items = [];
    function item(label, enabled, target, extra, current) {
      return '<li><button type="button" class="step' + (current ? " is-current" : "") + '"' +
        (enabled ? ' data-go="' + target + '"' : ' disabled') + (current ? ' aria-current="step"' : "") + '>' +
        '<span class="step-label">' + label + '</span>' +
        '<span class="step-meta">' + (enabled ? (extra || "") : ICON_LOCK_SM + '<span class="sr-only">' + esc(k.locked) + '</span>') + '</span>' +
      '</button></li>';
    }
    // The stages intro only shows up in the menu if they saw it this time (retakes skip it).
    if (S.visited.stages) items.push(item(esc(C.stages.headlineLead + C.stages.headlineAccent), true, "stages", "", S.screen === "stages"));
    // Statements grouped under their four areas, each with a small heading.
    C.groups.forEach(function (g, gi) {
      var rows = g.items.map(function (i) {
        var st = C.statements[i], v = S.scores[i];
        return item(esc(st.text), i <= S.reached, "statement:" + i, // no numbers: the area headings do the grouping
          v ? esc(k.answer) + ' <em>' + esc(C.ratings[v - 1]) + '</em>' : "", S.screen === "statement" && S.index === i);
      }).join("");
      items.push('<li class="step-group"><p class="step-group-h" id="sg-' + gi + '">' + (gi + 1) + '. ' + esc(g.name) + '</p>' +
        '<ol class="steps-list steps-sub" aria-labelledby="sg-' + gi + '">' + rows + '</ol></li>');
    });
    items.push(item(esc(k.results), !!S.takes && (S.finished || S.editing), "results", "", S.screen === "results"));
    openDialog(
      '<div class="stack">' +
        '<div class="drawer-head"><h2 class="h3" id="dialog-h">' + esc(k.heading) + '</h2>' +
          '<button type="button" class="drawer-close" data-d-cancel aria-label="' + esc(k.close) + '">' +
            '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
        '<p class="small muted">' + esc(k.intro) + '</p>' +
        '<ol class="steps-list">' + items.join("") + '</ol>' +
      '</div>',
      function (d) {
        $("[data-d-cancel]", d).addEventListener("click", closeDialog);
        $all("[data-go]", d).forEach(function (b) {
          b.addEventListener("click", function () {
            var t = b.getAttribute("data-go");
            closeDialog();
            if (t === "results") {
              if (S.editing) { finish(); return; }
              go("results"); return;
            }
            if (S.finished) { S.finished = false; S.editing = true; } // reopen the take to change answers
            if (t.indexOf("statement:") === 0) go("statement", { index: Number(t.split(":")[1]) });
            else go(t);
          });
        });
      },
      { drawer: true }
    );
  }
  main.addEventListener("click", function (e) {
    if (e.target.closest("[data-steps]")) openSteps();
    if (e.target.closest("[data-home]")) requestHome();
  });

  function mark(linked) {
    var inner = '<span class="mark-sq" aria-hidden="true"><i></i><i></i><i></i></span>Trust Check';
    // On inner screens the mark is a way home; on the splash it's just the name.
    return linked
      ? '<p class="mark"><button type="button" class="mark-btn" data-home aria-label="' + esc(C.home.label) + '">' + inner + '</button></p>'
      : '<p class="mark">' + inner + '</p>';
  }

  // Going home: protect unsaved work first.
  function requestHome() {
    if (S.screen === "results" && !S.downloaded) { openLeave(goHome); return; }
    var midTake = !S.finished && (S.editing || S.ask || S.tried || S.scores.some(function (v) { return v > 0; }));
    if (!midTake) { goHome(); return; }
    var h = C.home;
    openDialog(
      '<div class="stack">' +
        '<h2 class="h2" id="dialog-h">' + esc(h.heading) + '</h2>' +
        '<p>' + esc(h.body) + '</p>' +
        '<div class="actions">' +
          '<button type="button" class="btn" data-d-stay>' + esc(h.stay) + '</button>' +
          '<button type="button" class="btn btn--secondary" data-d-go>' + esc(h.go) + '</button>' +
        '</div>' +
      '</div>',
      function (d) {
        $("[data-d-stay]", d).addEventListener("click", closeDialog);
        $("[data-d-go]", d).addEventListener("click", function () { closeDialog(); goHome(); });
      }
    );
  }
  // Puts the closing "speak up?" (or the last two words) in the accent style.
  function accentEnd(text) {
    var m = String(text).match(/^(.*\s)(\S+\s\S+)$/);
    return m ? esc(m[1]) + '<em>' + esc(m[2]) + '</em>' : esc(text);
  }
  // Sets a headline one phrase per line (phrase ragging). Falls back to plain
  // text if the phrases don't add up to the headline exactly.
  function phraseLines(text, lines) {
    if (!Array.isArray(lines) || lines.join(" ") !== text) return accentEnd(text);
    return lines.map(function (ln, i) {
      // Outer span is the mask; the inner span rises into it.
      return '<span class="ph"><span class="ph-in">' + (i === lines.length - 1 ? accentEnd(ln) : esc(ln)) + '</span></span>' + (i < lines.length - 1 ? " " : "");
    }).join("");
  }
  function splash(title, body) {
    return '<section class="splash">' +
      '<div class="splash-inner wrap wrap--wide">' +
        '<div class="splash-title">' + mark() + title + '</div>' +
        '<div class="splash-body">' + body + '</div>' +
      '</div>' +
    '</section>';
  }

  SCREENS.welcome = function () {
    var w = C.welcome;
    // Pick each detail's icon by what it says, so the list can be edited freely.
    var facts = w.details.split(" · ").map(function (f) {
      var icon = /minute/i.test(f) ? ICON_CLOCK : /browser|saved/i.test(f) ? ICON_SCREEN : ICON_LOCK;
      return '<li>' + icon + esc(f) + '</li>';
    }).join("");
    return splash(
      '<h1 class="splash-h">' + phraseLines(w.hook, w.hookLines) + '</h1>',
      // Lede sits right on top of the paragraph it introduces.
      '<div class="splash-intro">' +
        '<p class="splash-lede">' + esc(w.headlineLead + w.headlineAccent) + '</p>' +
        '<p>' + esc(w.body) + '</p>' +
        '<p>' + esc(w.use + " " + w.pdf) + '</p>' +
      '</div>' +
      '<ul class="facts">' + facts + '</ul>' +
      '<div class="actions">' +
        '<button type="button" class="btn" data-start>' + esc(w.start) + '</button>' +
        '<button type="button" class="btn btn--outline-light" data-previous>' + esc(w.viewPrevious) + '</button>' +
      '</div>'
    );
  };
  bind.welcome = function () {
    $("[data-start]", main).addEventListener("click", function () {
      // Saved results: one confirm (download first, or clear and start).
      if (S.saved) { openStartFresh(function () { S.mode = "first"; go("stages", { replace: true }); }); return; }
      S.mode = "first"; S.ask = ""; S.tried = "";
      go("stages");
    });
    $("[data-previous]", main).addEventListener("click", function () {
      if (S.saved) showPrevious();
      else go("cleared");
    });
  };

  /* 2. Welcome back: same splash */
  SCREENS.welcomeBack = function () {
    var last = S.saved[S.saved.length - 1];
    var askLine = last.ask ? " You were working toward: " + last.ask : "";
    return splash(
      '<h1 class="splash-h splash-h--short">Welcome <em>back.</em></h1>',
      '<div class="splash-intro">' +
        '<p class="splash-lede">' + esc("Last time, on " + longDate(last.date) + ", you landed in " + last.zone + ".") + '</p>' +
        (askLine ? '<p>' + esc(askLine.trim()) + '</p>' : "") +
      '</div>' +
      '<div class="actions">' +
        '<button type="button" class="btn" data-retake>' + esc(C.welcomeBack.retake) + '</button>' +
        '<button type="button" class="btn btn--outline-light" data-fresh>' + esc(C.welcomeBack.startFresh) + '</button>' +
      '</div>'
    );
  };
  bind.welcomeBack = function () {
    $("[data-retake]", main).addEventListener("click", function () {
      var last = S.saved[S.saved.length - 1];
      S.mode = "retake"; S.ask = last.ask || ""; S.tried = "";
      go("statement", { index: 0 });
    });
    $("[data-fresh]", main).addEventListener("click", function () { openStartFresh(); });
  };

  /* 11. Coming back, nothing saved */
  SCREENS.cleared = function () {
    var c = C.cleared;
    return '<section class="screen wrap">' +
      '<div class="topbar">' + backBtn(c.back) + '</div>' +
      '<h1 class="h2">' + esc(c.heading) + '</h1>' +
      '<p class="measure">' + esc(c.body) + '</p>' +
      '<div class="actions actions--start"><button type="button" class="btn" data-again>' + esc(c.button) + '</button></div>' +
    '</section>';
  };
  bind.cleared = function () {
    bindBack();
    $("[data-again]", main).addEventListener("click", function () {
      S.mode = "cleared"; S.ask = ""; S.tried = "";
      go("statement", { index: 0 });
    });
  };

  // Hints sit above the field, never inside it as placeholder text, so they
  // stay visible while someone types.
  function field(id, value, max, labelledby, describedby, hint) {
    var hintId = id + "-hint";
    var described = [describedby, hint ? hintId : ""].filter(Boolean).join(" ");
    return '<div class="field">' +
      (hint ? '<p class="field-hint" id="' + hintId + '">' + esc(hint) + '</p>' : "") +
      '<textarea id="' + id + '" maxlength="' + max + '" rows="4" aria-labelledby="' + labelledby + '"' +
        (described ? ' aria-describedby="' + described + '"' : "") + '>' + esc(value) + '</textarea>' +
      '<span class="counter" aria-hidden="true"><span data-count>' + value.length + '</span> / ' + max + '</span>' +
    '</div>';
  }
  function bindCounter(id) {
    var ta = document.getElementById(id);
    var out = $("[data-count]", main);
    ta.addEventListener("input", function () { out.textContent = ta.value.length; });
    return ta;
  }

  /* 3. Your ask */
  SCREENS.ask = function () {
    var a = C.ask;
    return '<form class="statement-screen" data-form novalidate>' +
      band({ eyebrow: a.optional, title: '<h1 class="statement" id="ask-h">' + esc(a.headline) + '</h1>' }) +
      '<div class="wrap wrap--wide below">' +
        // Two groups: the explanation, then the answer area (hint, box, button).
        '<div class="stack">' +
          '<p class="measure" id="ask-d">' + esc(a.body) + '</p>' +
          '<div class="titleblock"><p class="eyebrow" id="ask-ex">For example</p>' +
          '<ul class="examples" aria-labelledby="ask-ex">' + a.examples.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join("") + '</ul></div>' +
        '</div>' +
        '<div class="answer">' + field("ask-input", S.ask, a.max, "ask-h", "ask-d", a.hint) +
        '<div class="actions actions--start"><button type="submit" class="btn" data-next>' + esc(C.card.next) + '</button></div></div>' +
      '</div>' +
    '</form>';
  };
  bind.ask = function () {
    var ta = bindCounter("ask-input");
    ta.addEventListener("input", function () { S.ask = ta.value; });
    bindOptional(ta, $("[data-next]", main), C.ask.skip);
    bindBack();
    $("[data-form]", main).addEventListener("submit", function (e) {
      e.preventDefault();
      S.ask = ta.value.trim();
      if (S.mode === "first") go("stages");
      else go("tried");
    });
  };

  /* 4. What have you tried? */
  SCREENS.tried = function () {
    var t = C.tried;
    return '<form class="statement-screen" data-form novalidate>' +
      band({ eyebrow: t.optional, title: '<h1 class="statement" id="tried-h">' + esc(t.headline) + '</h1>' }) +
      '<div class="wrap wrap--wide below">' +
        '<div class="answer">' + field("tried-input", S.tried, t.max, "tried-h", "", t.hint) +
        '<div class="actions actions--start"><button type="submit" class="btn" data-next>' + esc(C.card.next) + '</button></div></div>' +
      '</div>' +
    '</form>';
  };
  bind.tried = function () {
    var ta = bindCounter("tried-input");
    ta.addEventListener("input", function () { S.tried = ta.value; });
    bindOptional(ta, $("[data-next]", main), C.tried.skip);
    bindBack();
    $("[data-form]", main).addEventListener("submit", function (e) {
      e.preventDefault();
      S.tried = ta.value.trim();
      go("statement", { index: 0 });
    });
  };

  /* 5. Three stages: full-bleed color fields */
  SCREENS.stages = function () {
    var st = C.stages;
    return '<section class="stages-screen">' +
      band({
        title: '<h1 class="statement">' + esc(st.headlineLead) + '<span class="accent">' + esc(st.headlineAccent) + '</span></h1>',
        after: '<div class="band-text stack">' +
          '<p>' + esc(st.rateLead) + ' ' + C.groups.map(function (g, k) {
            return (k === C.groups.length - 1 ? "and " : "") + '<strong>' + esc(g.name) + '</strong>';
          }).join(", ") + '.</p>' +
          '<p>' + esc(st.intro) + '</p>' +
        '</div>'
      }) +
      '<ol class="fields">' + st.list.map(function (s, i) {
        return '<li class="field-block f-' + s.zone.toLowerCase() + '">' +
          '<p class="field-n">Stage ' + (i + 1) + '</p>' +
          '<div class="field-body">' +
            '<h2 class="field-word">' + esc(s.zone) + '</h2>' +
            '<p class="field-where">' + esc(s.where) + '</p>' +
            '<p class="field-what">' + esc(s.what) + '</p>' +
          '</div>' +
        '</li>';
      }).join("") + '</ol>' +
      // Closing teal band: mirrors the band at the top, so Begin has a home.
      '<div class="stages-close"><div class="wrap wrap--wide stages-foot">' +
        '<p class="stages-ready">' + esc(st.ready) + '</p>' +
        '<div class="actions actions--start"><button type="button" class="btn" data-begin>' + esc(st.button) + '</button></div>' +
      '</div></div>' +
      // A quiet hint that there's more below; a picture, not a control.
      '<div class="scroll-hint" data-scroll-hint aria-hidden="true" hidden>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></div>' +
    '</section>';
  };
  bind.stages = function () {
    bindBack();
    $all("[data-begin]", main).forEach(function (b) {
      b.addEventListener("click", function () { go("statement", { index: 0 }); });
    });
    // Show the scroll hint only when Begin starts below the fold; hide it on the first scroll.
    var hint = $("[data-scroll-hint]", main), begin = $(".stages-foot [data-begin]", main);
    if (hint && begin && begin.getBoundingClientRect().bottom > window.innerHeight) {
      hint.hidden = false;
      var off = function () {
        if (window.scrollY > 24) { hint.classList.add("is-gone"); window.removeEventListener("scroll", off); }
      };
      window.addEventListener("scroll", off, { passive: true });
    }
  };

  /* 6 + 7. Statement and Why card */
  function whyCard(i) {
    var s = C.statements[i], v = S.scores[i], k = C.card;
    if (!v) return "";
    var there = '<div class="impact"><p class="eyebrow there">' + esc(k.there) + '</p><p>' + rich(s.there) + '</p></div>';
    var missing = '<div class="impact"><p class="eyebrow">' + esc(k.missing) + '</p><p>' + rich(s.missing) + '</p></div>';
    // Always both sides, always in the same order, whatever the rating.
    var tryIt = '<div class="impact impact--try"><p class="eyebrow">' + esc(k.tryThis) + '</p><p>' + rich(s.try) + '</p></div>';
    var impact = there + missing + tryIt;
    // Heading and its paragraph are one unit, spaced like each impact label and its text.
    return '<div class="why-head"><h2 class="h3" id="why-h" tabindex="-1">' + esc(k.heading) + '</h2>' +
      '<p>' + esc(s.why) + '</p></div>' +
      '<div data-impact class="stack">' + impact + '</div>' +
      '<div class="actions actions--start"><button type="submit" class="btn">' + esc(i === N - 1 ? k.last : k.next) + '</button>' +
        // Changing an answer after seeing results: one click back to updated results.
        (S.editing ? '<button type="button" class="btn btn--secondary" data-update-results>' + esc(C.results.updateResults) + '</button>' : "") +
      '</div>';
  }

  SCREENS.statement = function () {
    var i = S.index, s = C.statements[i];
    var pct = ((i + 1) / N * 100).toFixed(1) + "%";
    // Teal band: mark, progress and the statement, sized as a statement (not a hero).
    return '<form class="statement-screen" data-form novalidate>' +
      band({
        count: '<span class="count" aria-hidden="true">' + (i + 1) + ' of ' + N + '</span>',
        progress: '<div class="progress" role="progressbar" aria-label="Progress" aria-valuemin="1" aria-valuemax="' + N + '" aria-valuenow="' + (i + 1) + '" aria-valuetext="' + (i + 1) + ' of ' + N + '"><span data-p="' + pct + '"></span></div>',
        eyebrow: s.group, eyebrowId: "grp-" + i, stripTitle: s.text,
        title: '<h1 class="statement" id="stmt-h" tabindex="-1"><span class="sr-only">' + (i + 1) + ' of ' + N + '. </span>' + esc(s.text) + '</h1>'
      }) +
      '<div class="wrap wrap--wide below">' +
      '<fieldset class="rating">' +
        '<legend>How often is this true?</legend>' +
        '<div class="rating-options">' + C.ratings.map(function (label, r) {
          var val = r + 1, on = S.scores[i] === val;
          return '<label class="opt' + (on ? " is-checked" : "") + '"><input type="radio" name="rate" value="' + val + '"' + (on ? " checked" : "") + '>' +
            '<span class="num">' + val + '</span><span class="word">' + esc(label) + '</span></label>';
        }).join("") + '</div>' +
      '</fieldset>' +
      '<section class="panel panel--white why" data-why aria-labelledby="why-h"' + (S.scores[i] ? "" : " hidden") + '>' + whyCard(i) + '</section>' +
      '</div>' +
    '</form>';
  };
  // Statement screens, collapsing-band pattern: the band is sticky with a
  // negative top, so it scrolls up naturally (the big statement leaves off the
  // top, never under anything) until only its bottom strip is left pinned. The
  // strip fades in a small copy of the statement. The band never changes size,
  // so nothing on the page reflows.
  // Statement screens: once the progress meter scrolls off, the area name and
  // statement stick to the top at their normal size (no shrinking). The band is
  // sticky with a negative top, so the logo, Back and progress scroll away first.
  var bandScroll = null;
  function collapseBand() {
    if (bandScroll) { window.removeEventListener("scroll", bandScroll); window.removeEventListener("resize", bandScroll.measure); bandScroll = null; }
    var band = $("[data-collapse]", main), eb = band && $(".titleblock .eyebrow", band);
    if (!band || !eb) return;
    var travel = 1;
    bandScroll = function () {
      if (!document.contains(band)) { window.removeEventListener("scroll", bandScroll); return; }
      band.classList.toggle("is-collapsed", band.classList.contains("is-pinnable") && window.scrollY >= travel - 1);
    };
    bandScroll.measure = function () {
      // Phones only, and only when the page actually scrolls. Desktop screens
      // often fit without scrolling, and a statement that never leaves the
      // screen doesn't need pinning.
      var pin = window.innerWidth < 768 && document.documentElement.scrollHeight > window.innerHeight + 4;
      band.classList.toggle("is-pinnable", pin);
      if (!pin) { band.classList.remove("is-collapsed"); document.documentElement.style.removeProperty("--pin-h"); return; }
      var P = Math.min(28, Math.max(16, window.innerWidth * 0.018));   // room above the area name
      travel = Math.max(0, eb.getBoundingClientRect().top - band.getBoundingClientRect().top - P);
      band.style.setProperty("--band-top", (-travel) + "px");
      document.documentElement.style.setProperty("--pin-h", (band.offsetHeight - travel) + "px");
      bandScroll();
    };
    window.addEventListener("scroll", bandScroll, { passive: true });
    window.addEventListener("resize", bandScroll.measure);
    bandScroll.measure();
  }
  bind.statement = function () {
    var i = S.index;
    collapseBand();
    var form = $("[data-form]", main);
    var why = $("[data-why]", main);
    bindBack(function () { history.back(); });
    $all('input[name="rate"]', main).forEach(function (inp) {
      inp.addEventListener("change", function () {
        var first = !S.scores[i];
        S.scores[i] = Number(inp.value);
        $all(".opt", main).forEach(function (l) { l.classList.toggle("is-checked", l.contains(inp)); });
        if (first) {
          why.innerHTML = whyCard(i);
          why.hidden = false;
          if (bandScroll) bandScroll.measure(); // the page may scroll now that the card is there
          S.cardShown[i] = true;
          // No jump: the page stays where it is and the card appears below the
          // ratings. Focus moves to the card for screen readers without scrolling.
          $("#why-h", why).focus({ preventScroll: true });
        } else {
          // Keep focus in the group; just update the impact shown.
          var tmp = document.createElement("div");
          tmp.innerHTML = whyCard(i);
          $("[data-impact]", why).innerHTML = $("[data-impact]", tmp).innerHTML;
        }
      });
    });
    why.addEventListener("click", function (e) {
      if (e.target.closest("[data-update-results]")) finish();
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!S.scores[i]) return;
      if (i < N - 1) go("statement", { index: i + 1 });
      else finish();
    });
    announce((i + 1) + " of " + N + ". " + C.statements[i].group);
  };

  /* ---------------- Finish: build and save the take ---------------- */

  function finish() {
    var total = sum(S.scores);
    var zone = zoneOf(S.scores);
    var prev, lastSize, ask = S.ask, tried = S.mode === "first" ? "" : S.tried;
    if (S.editing && S.takes) {
      // Changed answers after seeing results: replace this take, don't add another,
      // and keep what they typed on results (the planned change) and before.
      var cur = S.takes[S.takes.length - 1];
      prev = S.takes.slice(0, -1);
      lastSize = cur.askSize; ask = cur.ask || ""; tried = cur.tried || "";
    } else {
      prev = S.saved || [];
      lastSize = prev.length ? prev[prev.length - 1].askSize : null;
    }
    var take = {
      date: isoLocal(new Date()),
      ask: ask,
      askSize: lastSize,
      tried: tried,
      scores: S.scores.slice(),
      total: total,
      zone: zone,
      gridResult: lastSize ? C.grid.cells[zone][lastSize] : null,
      pdfDownloaded: false
    };
    S.takes = prev.concat([take]);
    S.editing = false;
    S.downloaded = false; // any earlier PDF no longer matches these answers
    S.saveOk = S.canSave && writeStore(S.takes);
    if (S.saveOk) S.saved = S.takes;
    S.finished = true;
    go("results", { replace: true });
  }

  function current() { return S.takes[S.takes.length - 1]; }

  function persist() {
    if (S.canSave && S.saveOk) S.saveOk = writeStore(S.takes);
  }

  /* ---------------- Results ---------------- */

  function sparkline(values, dates, min, max, label, cls) {
    var w = 120, h = 36, pad = 4;
    var n = values.length;
    var pts = values.map(function (v, k) {
      var x = n === 1 ? w / 2 : pad + (w - 2 * pad) * k / (n - 1);
      var y = h - pad - (h - 2 * pad) * (v - min) / (max - min);
      return [x, y];
    });
    var id = "sp-" + Math.random().toString(36).slice(2, 8);
    var list = values.map(function (v, k) { return shortDate(dates[k]) + ": " + v; }).join(" · ");
    return '<span class="spark ' + (cls || "") + '">' +
      '<button type="button" class="spark-btn" aria-expanded="false" aria-controls="' + id + '" data-spark title="' + esc(list) + '">' +
        '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true" focusable="false">' +
          '<polyline points="' + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"/>' +
          pts.map(function (p, k) { return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="2.6"' + (k === n - 1 ? ' class="last"' : "") + '><title>' + esc(shortDate(dates[k]) + ": " + values[k]) + '</title></circle>'; }).join("") +
        '</svg>' +
        '<span class="spark-label">' + esc(label) + '</span>' +
      '</button>' +
      '<span class="spark-dates" id="' + id + '" hidden>' + esc(list) + '</span>' +
    '</span>';
  }

  function zoneBar(total, zone) {
    // Moved to Grow by the fairness rules: the marker sits at the nearest edge of Grow.
    var at = (meterAt(total, zone) * 100).toFixed(1) + "%";
    var raw = zoneFor(total);
    var label = raw === zone
      ? total + " out of " + TOP + ", in " + zone + ", " + C.zones[zone].range.replace("–", " to ")
      : C.results.meterMoved.replace("{n}", total).replace("{max}", TOP).replace("{from}", raw).replace("{zone}", zone);
    return '<div class="zonebar">' +
      '<div class="zonebar-track" role="img" aria-label="' + esc(label) + '">' +
        ZONES.map(function (z) { return '<span class="' + zClass(z) + (z === zone ? " on" : "") + '"></span>'; }).join("") +
        '<span class="zonebar-marker" data-at="' + at + '"></span>' +
      '</div>' +
      '<div class="zonebar-labels" aria-hidden="true">' + ZONES.map(function (z) {
        return '<span class="' + (z === zone ? "on" : "") + '">' + z + ' ' + C.zones[z].range + '</span>';
      }).join("") + '</div>' +
    '</div>';
  }

  function gridTable(zone, size) {
    var g = C.grid;
    var cls = { "Go ahead": "c-go", "Create it together": "c-together", "Build trust first": "c-first" };
    return '<table class="grid-table' + (size ? " has-pick" : "") + '">' +
      '<caption class="sr-only">Decision grid: trust stage by how much the change affects your team</caption>' +
      '<thead><tr><td class="corner"></td>' + g.sizes.map(function (s) { return '<th scope="col">' + esc(s.label) + '<span class="th-change"> change</span></th>'; }).join("") + '</tr></thead>' +
      '<tbody>' + ZONES.map(function (z) {
        return '<tr><th scope="row"><span class="row"><span class="swatch ' + zClass(z) + '" aria-hidden="true"></span>' + z + '</span></th>' +
          SIZES.map(function (s) {
            var txt = g.cells[z][s];
            var pick = size && z === zone && s === size;
            return '<td class="' + cls[txt] + (pick ? " pick" : "") + '"' + (pick ? ' aria-current="true"' : "") + '>' + esc(txt) +
              (pick ? '<span class="pick-tag">You</span>' : "") + '</td>';
          }).join("") + '</tr>';
      }).join("") + '</tbody></table>';
  }

  // Escape a line and give the zone name its brush underline (static).
  function markZone(text, zone) {
    var e = esc(text), z = esc(zone);
    var i = e.lastIndexOf(z);
    return i < 0 ? e : e.slice(0, i) + '<span class="zone-mark">' + z + '</span>' + e.slice(i + z.length);
  }

  function sizeLabel(id) {
    for (var i = 0; i < C.grid.sizes.length; i++) if (C.grid.sizes[i].id === id) return C.grid.sizes[i].label;
    return cap(id);
  }

  function verdict(zone, size) {
    if (!size) return "";
    var r = C.grid.cells[zone][size];
    var act = C.grid.actions && C.grid.actions[r];
    return '<p><strong>' + esc(zone + " + " + sizeLabel(size) + " change → " + r) + '</strong></p><p>' + esc(C.grid.lines[r]) + '</p>' +
      (act ? '<div class="verdict-next"><p class="eyebrow">' + esc(C.results.nextStepLabel) + '</p><p>' + esc(act) + '</p></div>' : "");
  }

  function cueRows(takes) {
    var t = takes[takes.length - 1], first = takes[0], compare = takes.length > 1, trend = takes.length >= 3;
    return '<div class="cue-groups">' + C.groups.map(function (g, gi) {
      // Each area is numbered and boxed so the four themes stand out when skimming.
      return '<div class="cue-group"><h3 class="t-bold">' + (gi + 1) + '. ' + esc(g.name) + '</h3><ul class="cues">' + g.items.map(function (i) {
        var s = C.statements[i], v = t.scores[i], f = first.scores[i];
        var bars;
        if (compare) {
          bars = '<div class="bars">' +
            '<span class="lbl">First take</span><span class="track first"><span data-v="' + (f / MAX * 100) + '%"></span></span><span class="val">' + f + '</span>' +
            '<span class="lbl">Today</span><span class="track"><span data-v="' + (v / MAX * 100) + '%"></span></span><span class="val">' + v + '</span>' +
          '</div>';
        } else {
          bars = '<div class="bars bars--single"><span class="track" aria-hidden="true"><span data-v="' + (v / MAX * 100) + '%"></span></span><span class="val">' + v + '<span class="sr-only"> of ' + MAX + ', ' + esc(C.ratings[v - 1]) + '</span></span></div>';
        }
        var footer = "";
        if (compare) {
          footer = '<div class="cue-foot"><span class="change"><span class="sr-only">Change: </span>' + signed(v - f) + '</span>' +
          '</div>';
        }
        // The same "Why this matters" and both stories as the statement screen and the
        // PDF, so this page holds everything the PDF does (the accessible version).
        var k = C.card;
        var more = '<details class="cue-more"><summary>' + esc(k.heading) + '<span class="sr-only">: ' + esc(s.text) + '</span></summary>' +
          '<div class="cue-more-body">' +
            '<p>' + rich(s.why) + '</p>' +
            '<div class="impact"><p class="eyebrow there">' + esc(k.there) + '</p><p>' + rich(s.there) + '</p></div>' +
            '<div class="impact"><p class="eyebrow">' + esc(k.missing) + '</p><p>' + rich(s.missing) + '</p></div>' +
            '<div class="impact impact--try"><p class="eyebrow">' + esc(k.tryThis) + '</p><p>' + rich(s.try) + '</p></div>' +
          '</div></details>';
        return '<li class="cue"><p class="cue-text">' + (i + 1) + '. ' + esc(s.text) + '</p>' + bars + footer + more + '</li>';
      }).join("") + '</ul></div>';
    }).join("") + '</div>';
  }

  function cueTable(takes) {
    var t = takes[takes.length - 1], first = takes[0], compare = takes.length > 1;
    return '<details class="table-alt"><summary>Show as a table</summary><div class="table-scroll"><table class="data-table">' +
      '<thead><tr><th scope="col">Statement</th>' + (compare ? '<th scope="col" class="n">First take</th>' : "") + '<th scope="col" class="n">' + esc(C.results.pdfYourAnswer) + '</th>' + (compare ? '<th scope="col" class="n">Change</th>' : "") + '</tr></thead><tbody>' +
      C.statements.map(function (s, i) {
        return '<tr><th scope="row">' + (i + 1) + '. ' + esc(s.text) + '</th>' +
          (compare ? '<td class="n">' + first.scores[i] + '</td>' : "") +
          '<td class="n">' + t.scores[i] + ' (' + esc(C.ratings[t.scores[i] - 1]) + ')</td>' +
          (compare ? '<td class="n">' + signed(t.scores[i] - first.scores[i]) + '</td>' : "") + '</tr>';
      }).join("") +
      '<tr class="total-row"><th scope="row">Total</th>' + (compare ? '<td class="n">' + first.total + '</td>' : "") + '<td class="n">' + t.total + ' out of ' + TOP + '</td>' + (compare ? '<td class="n">' + signed(t.total - first.total) + '</td>' : "") + '</tr>' +
      '</tbody></table></div></details>';
  }

  // The table as a CSV file (opens in Excel, Numbers, or Sheets). Built in the
  // browser, nothing is sent anywhere.
  function downloadCsv(t) {
    function cell(v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    var rows = [["Area", "Statement", "Rating (1-" + MAX + ")", "Answer"]];
    C.statements.forEach(function (s, i) {
      rows.push([s.group, (i + 1) + ". " + s.text, t.scores[i], C.ratings[t.scores[i] - 1]]);
    });
    rows.push(["", "Total", t.total + " out of " + TOP, "You're in " + t.zone]);
    var csv = "\ufeff" + rows.map(function (r) { return r.map(cell).join(","); }).join("\r\n");
    var url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    var a = document.createElement("a");
    a.href = url; a.download = "trust-check-table-" + ymd(t.date) + "-" + hhmm(t.date) + ".csv";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  SCREENS.results = function () {
    var takes = S.takes, t = current(), first = takes[0], z = C.zones[t.zone], r = C.results;
    var compare = takes.length > 1, trend = takes.length >= 3;
    var dateStr = longDate(t.date);
    var zoneChange = compare ? "First take, " + longDate(first.date) + ": " + first.zone + " → Today: " + t.zone : "";
    var focusHtml = esc(z.focus);

    // Your 11 cues sit right under the score: the heading and why they matter,
    // with the full chart in a closed accordion for anyone who wants detail.
    var cues =
      '<section class="stack chart cues-section" aria-labelledby="chart-h">' +
        '<div class="why-head"><h2 class="card-title" id="chart-h">' + esc(r.cuesHeading) + '</h2>' +
        '<p class="measure">' + esc(r.bigReason) + '</p></div>' +
        '<details class="cues-acc">' +
          '<summary>' + esc(r.cuesToggle) + '</summary>' +
          '<div class="stack cues-body">' +
            // Today's answers only; earlier takes will get their own view later.
            cueRows([t]) +
            // No on-screen table (the bars carry the numbers for screen readers too);
            // the same data downloads as a spreadsheet.
            '<p><button type="button" class="icon-link" data-csv>' + ICON_DOWN + esc(C.results.tableDownload) + '</button></p>' +
            '<p class="small" role="status" data-csv-status></p>' +
          '</div>' +
        '</details>' +
      '</section>';

    var summary =
      '<div class="stack">' +
        (S.mode === "cleared" ? '<p class="note note--alert">' + esc(r.comparePdf) + '</p>' : "") +
        // Eyebrow and heading form one title block (label sits tight to its heading).
        // Title, zone change and meaning are one group (heading to its text: tight).
        '<div class="why-head">' +
          '<div class="titleblock"><p class="eyebrow">' + esc(dateStr) + '</p>' +
          '<h1 class="h1" id="results-h">You’re in <span class="zone-word">' + esc(t.zone) + '.</span></h1></div>' +
          '<p class="measure">' + esc(z.meaning) + '</p>' +
        '</div>' +
        '<div class="stack stack--tight">' +
          '<div class="score-line"><p class="t-bold">' + esc(r.scoreLine.replace("{n}", t.total)) + '</p>' +
          '</div>' +
          // A strong total with one weak area: explain before the scale, so the
          // marker sitting in Sustain doesn't contradict "You're in Grow."
          (zoneNote(t.scores) ? '<p class="measure">' + esc(zoneNote(t.scores)) + '</p>' : "") +
          zoneBar(t.total, t.zone) +
        '</div>' +
        // One sentence that sets up the page.
        '<div class="results-intro">' +
          '<p class="measure">' + esc(r.intro.split("{planner}")[0].replace("{tips}", r.tipsLabel[t.zone].charAt(0).toLowerCase() + r.tipsLabel[t.zone].slice(1))) +
            esc(r.plannerLink) +
            esc(r.intro.split("{planner}")[1] || "") + '</p>' +
        '</div>' +
      '</div>';
    var tried = t.tried ? '<div class="why-head"><h2 class="subhead">' + esc(r.triedLabel) + '</h2><p class="reflect-quote">' + esc(t.tried) + '</p></div>' : "";

    var decide =
      '<section class="card decide" aria-labelledby="change-h">' +
        // Start from their own change; if they skipped it, ask them to picture one.
        // Their change is the panel's main heading; the size question sits under it.
        // Part 2: optional planning. Title says what it's for; their change sits under it.
        // Heading and its opening text are one group (tight), like Part 1.
        '<div class="why-head"><h2 class="card-title" id="change-h" tabindex="-1">' + markZone(r.part2Heading.replace("{zone}", t.zone), t.zone) + '</h2>' +
        // The change box lives here now: optional, saved with the results and in the PDF.
        '<p id="plan-h">' + esc(C.grid.changeQuestion) + '</p>' +
          '<p id="plan-d">' + esc(C.grid.reflect) + '</p></div>' +
        field("plan-input", t.ask || "", C.ask.max, "plan-h", "plan-d", C.grid.changeHint) +
        '<div class="why-head"><h3 class="t-bold" id="grid-h">' + esc(C.grid.question) + '</h3>' +
        // Why the size matters, then the instruction, right under the question.
        '<p>' + esc((C.grid.note ? C.grid.note + " " : "") + C.grid.choose.replace("{zone}", t.zone)) + '</p></div>' +
        '<fieldset class="sizes"><legend class="sr-only">' + esc(C.grid.question) + '</legend>' +
          C.grid.sizes.map(function (s) {
            var on = t.askSize === s.id;
            return '<label class="size' + (on ? " is-checked" : "") + '"><input type="radio" name="size" value="' + s.id + '"' + (on ? " checked" : "") + '>' +
              '<span class="size-name">' + esc(s.label) + '</span><span class="size-desc">' + esc(s.desc) + '</span></label>';
          }).join("") +
        '</fieldset>' +
        '<div data-grid>' + gridTable(t.zone, t.askSize) + '</div>' +
        '<div class="verdict panel panel--white" data-verdict aria-live="polite">' + verdict(t.zone, t.askSize) + '</div>' +
      '</section>';

    var tips =
      // The tips are the next step after the result, so they sit in a panel
      // topped with the zone's color and are labeled as next steps for that zone.
      '<section class="card tips-card" aria-labelledby="tips-h">' +
        // Part 1 heading names the section; the focus line sits under it as bold body text.
        '<div class="why-head"><h2 class="card-title" id="tips-h">' + markZone(r.part1Heading.replace("{tips}", r.tipsLabel[t.zone]), t.zone) + '</h2>' +
        '<p class="focus-line">' + focusHtml + '</p>' +
        '<p>' + esc(r.tipsScope.replace("{zone}", t.zone)) + '</p></div>' +
        '<div class="tips-layout"><ol class="tips">' + z.tips.map(function (tp, k) {
          return '<li class="tip"><span class="tip-n" aria-hidden="true">' + (k + 1) + '</span><p><strong>' + esc(tp[0]) + '</strong> ' + rich(tp[1]) + '</p></li>';
        }).join("") + '</ol>' +
        '<div class="watch stack stack--tight"><h3 id="watch-h" class="row-icon">' + ICON_EYE + esc(z.watchTitle) + '</h3><p>' + rich(z.watch) + '</p></div></div>' +
        (z.note ? '<p class="measure">' + esc(z.note) + '</p>' : "") +
      '</section>';

    var after =
      '<nav class="after" aria-label="More options">' +
        '<button type="button" class="btn btn--secondary" data-done>Done</button>' +
        '<button type="button" class="btn btn--secondary" data-fresh>' + esc(r.startFresh) + '</button>' +
      '</nav>';

    var download =
      // Saving and leaving live together in one card, same style as the others.
      '<section class="card save-card" aria-labelledby="save-h">' +
        '<div class="why-head"><h2 class="card-title" id="save-h">' + esc(S.saveOk ? r.saveHeading : r.noStorageHeading) + '</h2>' +
        '<p class="measure">' + esc(S.saveOk ? r.downloadNote : r.noStorage) + '</p></div>' +
        '<div class="actions actions--start"><button type="button" class="btn btn--green" data-pdf>' + ICON_DOWN + esc(r.download) + '</button></div>' +
        '<p class="small" data-pdf-status role="status"></p>' +
        after +
      '</section>';


    // Part 1, your results: zone and score, the 11 cues behind it, then what to do (tips).
    // Part 2, planning a change (optional). Then save.
    return '<div class="screen wrap wrap--mid results ' + zClass(t.zone) + '">' +
      summary +
      cues +
      tips +
      tried +
      decide +
      download +
    '</div>';
  };

  bind.results = function () {
    $all("[data-csv]", main).forEach(function (b) {
      b.addEventListener("click", function () {
        downloadCsv(current());
        var st = $("[data-csv-status]", main);
        if (st) st.textContent = "Spreadsheet downloaded.";
      });
    });
    // Save the planned change as they type (it goes in the PDF too).
    var plan = document.getElementById("plan-input");
    if (plan) {
      bindCounter("plan-input");
      var saveTimer = null;
      plan.addEventListener("input", function () {
        var cur = current();
        cur.ask = plan.value.trim();
        S.ask = cur.ask;
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(persist, 400);
      });
    }
    $all("[data-jump]", main).forEach(function (b) {
      b.addEventListener("click", function () {
        var target = document.getElementById(b.getAttribute("data-jump"));
        if (!target) return;
        var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      });
    });
    var t = current();
    $all('input[name="size"]', main).forEach(function (inp) {
      inp.addEventListener("change", function () {
        t.askSize = inp.value;
        t.gridResult = C.grid.cells[t.zone][inp.value];
        persist();
        $all(".size", main).forEach(function (l) { l.classList.toggle("is-checked", l.contains(inp)); });
        $("[data-grid]", main).innerHTML = gridTable(t.zone, t.askSize);
        $("[data-verdict]", main).innerHTML = verdict(t.zone, t.askSize);
      });
    });
    $all("[data-pdf]", main).forEach(function (b) {
      b.addEventListener("click", function () { downloadPdf(S.takes, S.takes.length - 1); });
    });
    $("[data-fresh]", main).addEventListener("click", function () { openStartFresh(); });
    $("[data-done]", main).addEventListener("click", function () {
      if (S.downloaded) goHome();
      else openLeave(goHome);
    });
  };

  main.addEventListener("click", sparkToggle);
  function sparkToggle(e) {
    var b = e.target.closest("[data-spark]");
    if (!b) return;
    var box = document.getElementById(b.getAttribute("aria-controls"));
    var open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", String(open));
    box.hidden = !open;
  }

  /* ---------------- Dialogs ---------------- */

  var dialogReturn = null;
  function openDialog(html, onBind, opts) {
    dialogReturn = document.activeElement;
    // Same accessible modal; "drawer" slides in from the side instead of centering.
    dialog.classList.toggle("dialog--drawer", !!(opts && opts.drawer));
    dialog.innerHTML = html;
    onBind(dialog);
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    var h = $("#dialog-h", dialog);
    h.setAttribute("tabindex", "-1");
    h.focus();
  }
  function closeDialog() {
    if (dialog.open && typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }
  dialog.addEventListener("close", function () {
    if (dialogReturn && document.contains(dialogReturn)) dialogReturn.focus();
    dialogReturn = null;
  });
  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeDialog(); // click on backdrop
  });

  // Show the latest saved results as they were.
  function showPrevious() {
    S.takes = S.saved; S.scores = S.saved[S.saved.length - 1].scores.slice();
    S.reached = N - 1; S.finished = true; S.editing = false; S.saveOk = true; // these came from storage
    go("results");
  }

  function openStartFresh(then) {
    var f = C.startFresh;
    openDialog(
      '<div class="stack">' +
        '<h2 class="h2" id="dialog-h">' + esc(f.heading) + '</h2>' +
        '<p>' + esc(f.body) + '</p>' +
        '<p class="note">' + esc(f.note) + '</p>' +
        '<div class="actions">' +
          '<button type="button" class="btn" data-d-pdf>' + ICON_DOWN + esc(f.download) + '</button>' +
          '<button type="button" class="btn btn--danger" data-d-clear>' + esc(f.clear) + '</button>' +
        '</div>' +
        '<div><button type="button" class="linkbtn" data-d-cancel>' + esc(f.cancel) + '</button></div>' +
        '<p class="small" role="status" data-d-status></p>' +
      '</div>',
      function (d) {
        $("[data-d-pdf]", d).addEventListener("click", function () {
          var takes = S.takes || S.saved;
          if (takes && takes.length) {
            downloadPdf(takes, takes.length - 1);
            $("[data-d-status]", d).textContent = "PDF downloaded.";
          }
        });
        $("[data-d-clear]", d).addEventListener("click", function () {
          clearStore();
          S = freshState();
          S.saved = null;
          closeDialog();
          if (then) then(); else go("welcome", { replace: true });
        });
        $("[data-d-cancel]", d).addEventListener("click", closeDialog);
      }
    );
  }

  function openLeave(proceed, external) {
    var l = C.leave;
    openDialog(
      '<div class="stack">' +
        '<h2 class="h2" id="dialog-h">' + esc(l.heading) + '</h2>' +
        '<div class="actions">' +
          '<button type="button" class="btn" data-d-pdf>' + ICON_DOWN + esc(l.download) + '</button>' +
          '<button type="button" class="btn btn--secondary" data-d-leave>' + esc(l.leave) + '</button>' +
        '</div>' +
      '</div>',
      function (d) {
        $("[data-d-pdf]", d).addEventListener("click", function () {
          downloadPdf(S.takes, S.takes.length - 1);
          closeDialog();
          // Navigating away right away can cancel a download on iPhone,
          // so external links wait for a second tap.
          if (!external) window.setTimeout(proceed, 400);
        });
        $("[data-d-leave]", d).addEventListener("click", function () {
          closeDialog();
          S.downloaded = true; // they chose to leave; don't ask twice
          proceed();
        });
      }
    );
  }

  /* ---------------- PDF ---------------- */

  // The standard PDF fonts cover Latin-1 only.
  function pdfText(s) {
    return String(s || "")
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-").replace(/−/g, "-")
      .replace(/→/g, "->").replace(/…/g, "...")
      .replace(/[^\x09\x0a\x0d\x20-\x7e\xa0-\xff]/g, "");
  }

  var RGB = {
    ink: [26, 24, 20], muted: [74, 72, 69], purple: [66, 49, 169],
    Build: [212, 137, 90], Grow: [74, 158, 158], Sustain: [157, 146, 224], line: [220, 216, 208]
  };
  // Light tints of each zone (same as the results page boxes).
  var RGB_TINT = { Build: [246, 229, 218], Grow: [220, 236, 236], Sustain: [235, 232, 249] };

  function downloadPdf(takes, idx) {
    if (!window.jspdf || !window.jspdf.jsPDF) return;
    var t = takes[idx], first = takes[0], compare = idx > 0;
    var doc = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
    // Accessibility basics jsPDF supports: a real title shown in the window,
    // the document language, and real (selectable) text in reading order.
    doc.setProperties({ title: "Trust Check results, " + longDate(t.date), subject: "You're in " + t.zone + ". Score " + t.total + " out of " + TOP + ".", author: "Trust Check by Mel Milloway", creator: "Trust Check" });
    if (doc.setLanguage) doc.setLanguage("en-US");
    if (doc.viewerPreferences) doc.viewerPreferences({ DisplayDocTitle: true });
    var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    var M = 56, CW = W - 2 * M, y = M, BOTTOM = H - M - 10;
    var zc = RGB[t.zone], tint = RGB_TINT[t.zone], r = C.results, z = C.zones[t.zone];

    // Five text styles, used everywhere. Hierarchy comes from size, weight and
    // space, with the zone color as the one accent.
    var ST = {
      h1:    { font: "times", style: "normal", size: 30, lh: 1.15, color: RGB.ink },
      h2:    { font: "helvetica", style: "bold", size: 14, lh: 1.3, color: RGB.ink },
      h3:    { font: "helvetica", style: "bold", size: 10.5, lh: 1.4, color: RGB.ink },
      body:  { font: "helvetica", style: "normal", size: 10.5, lh: 1.5, color: RGB.ink },
      label: { font: "helvetica", style: "bold", size: 7.5, lh: 1.5, color: RGB.muted, caps: true, cs: 0.7 }
    };

    function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function fill(c) { doc.setFillColor(c[0], c[1], c[2]); }
    function ensure(h) { if (y + h > BOTTOM) { doc.addPage(); y = M; } }
    function setStyle(st, italic, c) {
      doc.setFont(st.font, italic ? (st.style === "bold" ? "bolditalic" : "italic") : st.style);
      doc.setFontSize(st.size); color(c || st.color);
    }

    // Write wrapped text in one style; quoted speech is set in italics.
    // o: x, width, after, color, dry (measure only). Returns the height used.
    function write(txt, st, o) {
      o = o || {};
      var x0 = o.x == null ? M : o.x, width = o.width || (M + CW - x0);
      txt = pdfText(txt); if (st.caps) txt = txt.toUpperCase();
      var words = [];
      txt.split(/("[^"]*")/).forEach(function (seg) {
        if (!seg) return;
        var it = seg.length > 1 && seg.charAt(0) === '"' && seg.charAt(seg.length - 1) === '"';
        seg.split(/\s+/).forEach(function (w) { if (w) words.push({ w: w, i: it }); });
      });
      var lines = [[]], lw = 0;
      words.forEach(function (wd) {
        setStyle(st, wd.i);
        var ww = doc.getTextWidth(wd.w) + (st.cs || 0) * wd.w.length;
        var cur = lines[lines.length - 1], sp = cur.length ? doc.getTextWidth(" ") + (st.cs || 0) : 0;
        if (cur.length && lw + sp + ww > width) { lines.push([]); cur = lines[lines.length - 1]; lw = 0; sp = 0; }
        wd.width = ww; wd.sp = sp; cur.push(wd); lw += sp + ww;
      });
      var lh = st.size * st.lh, h = lines.length * lh + (o.after || 0);
      if (o.dry) return h;
      lines.forEach(function (ln) {
        ensure(lh);
        // Draw each run of same-style words as one string, so the font's own
        // spacing is used (placing word by word drifts in some viewers).
        var runs = [];
        ln.forEach(function (wd) {
          var last = runs[runs.length - 1];
          if (last && last.i === wd.i) last.t += " " + wd.w;
          else runs.push({ i: wd.i, t: wd.w, lead: runs.length ? 1 : 0 });
        });
        var x = x0, prevItalic = false;
        runs.forEach(function (rn) {
          setStyle(st, rn.i, o.color);
          // A slanted closing quote leans into the next word: give it a little more room.
          if (rn.lead) x += doc.getTextWidth(" ") + (st.cs || 0) + (prevItalic ? st.size * 0.15 : 0);
          prevItalic = rn.i;
          doc.text(rn.t, x, y + st.size, { charSpace: st.cs || 0 });
          x += doc.getTextWidth(rn.t) + (st.cs || 0) * rn.t.length;
        });
        y += lh;
      });
      y += o.after || 0;
      return h;
    }

    // A tinted box sized to its content. items: [text, style, opts]
    function panel(items) {
      var pad = 14, inner = { x: M + pad, width: CW - 2 * pad };
      var h = pad * 2;
      items.forEach(function (it) { h += write(it[0], it[1], Object.assign({}, inner, it[2], { dry: true })); });
      ensure(h);
      fill(tint); doc.rect(M, y, CW, h, "F");
      y += pad;
      items.forEach(function (it) { write(it[0], it[1], Object.assign({}, inner, it[2])); });
      y += pad;
    }

    // Section: a short bar in the zone color, then the heading.
    function section(title) {
      y += 26; ensure(90);
      fill(zc); doc.rect(M, y, 28, 3, "F");
      y += 12;
      write(title, ST.h2, { after: 10 });
    }
    // Right-aligned label: measured by hand, since letter spacing throws off "align: right".
    function labelRight(txt, xr, yy) {
      setStyle(ST.label); txt = pdfText(txt).toUpperCase();
      var w = doc.getTextWidth(txt) + ST.label.cs * (txt.length - 1);
      doc.text(txt, xr - w, yy, { charSpace: ST.label.cs });
    }
    function hr(c, w) { doc.setDrawColor(c[0], c[1], c[2]); doc.setLineWidth(w || 0.5); doc.line(M, y, M + CW, y); }

    // ---- 1. Result ----
    write("Trust Check  ·  " + longDate(t.date) + ", " + timeLabel(t.date), ST.label, { after: 10 });
    setStyle(ST.h1);
    var lead = "You're in ", word = t.zone + ".";
    var leadW = doc.getTextWidth(lead), wordW = doc.getTextWidth(word);
    var h1Top = y;
    write(lead + word, ST.h1, { after: 0 });
    fill(zc); doc.rect(M + leadW, h1Top + ST.h1.size + 5, wordW - 4, 3, "F"); // brush under the zone word
    y += 12;
    write(z.meaning, ST.body, { after: 16 });

    write(r.scoreLine.replace("{n}", t.total), ST.h3, { after: 8 });
    var note = zoneNote(t.scores);
    if (note) write(note, ST.body, { after: 10 });
    // Zone bar: three equal ranges, marker at the score (or the edge of Grow if moved).
    ensure(40);
    var gap = 2, segW = (CW - 2 * gap) / 3;
    ZONES.forEach(function (zn, k) { fill(RGB[zn]); doc.rect(M + k * (segW + gap), y + 4, segW, 7, "F"); });
    fill(RGB.ink); doc.rect(M + meterAt(t.total, t.zone) * CW - 1, y, 2.5, 15, "F");
    y += 22;
    ZONES.forEach(function (zn, k) {
      var keep = y;
      write(zn + " " + C.zones[zn].range, ST.label, { x: M + k * (segW + gap), width: segW, color: zn === t.zone ? RGB.ink : RGB.muted });
      if (k < 2) y = keep;
    });
    if (compare) { y += 6; write(r.pdfFirstTake + ", " + longDate(first.date) + ": " + first.zone + "  ->  Today: " + t.zone, ST.body); }

    // ---- 2. Cues table ----
    section(r.cuesHeading);
    var cols = compare ? [CW - 216, 72, 72, 72] : [CW - 150, 150];
    var heads = compare ? ["Statement", r.pdfFirstTake, r.pdfYourAnswer, "Change"] : ["Statement", r.pdfYourAnswer];
    function rowCells(vals, st, rowY) {
      var cx = M + cols[0];
      vals.forEach(function (v, k) {
        setStyle(st);
        doc.text(pdfText(v), cx + cols[k + 1], rowY + st.size, { align: "right", charSpace: 0 });
        cx += cols[k + 1];
      });
    }
    var hy = y;
    write(heads[0], ST.label, { width: cols[0] });
    heads.slice(1).forEach(function (hd, k) {
      var cx = M + cols.slice(0, k + 2).reduce(function (a, b) { return a + b; }, 0);
      labelRight(hd, cx, hy + ST.label.size);
    });
    y += 4; hr(RGB.ink, 1); y += 8;
    C.groups.forEach(function (g, gi) {
      ensure(60);
      y += gi ? 8 : 0;
      write((gi + 1) + ". " + g.name, ST.h3, { after: 4 });
      g.items.forEach(function (i) {
        var s = C.statements[i];
        var rh = write((i + 1) + ". " + s.text, ST.body, { width: cols[0] - 16, dry: true });
        ensure(rh + 8 + (i === N - 1 ? 36 : 0)); // the last row keeps the Total with it
        var rowY = y;
        write((i + 1) + ". " + s.text, ST.body, { width: cols[0] - 16 });
        rowCells(compare
          ? [String(first.scores[i]), String(t.scores[i]), signed(t.scores[i] - first.scores[i])]
          : [C.ratings[t.scores[i] - 1] + " (" + t.scores[i] + ")"], ST.body, rowY);
        y += 4; hr(RGB.line); y += 4;
      });
    });
    ensure(30);
    y += 4;
    fill(tint); doc.rect(M, y, CW, 24, "F"); hr(RGB.ink, 1);
    var ty = y + 6;
    setStyle(ST.h3); doc.text("Total", M + 8, ty + ST.h3.size, { charSpace: 0 });
    var cx0 = M + cols[0];
    (compare ? [String(first.total), String(t.total), signed(t.total - first.total)] : [t.total + " out of " + TOP]).forEach(function (v, k) {
      setStyle(ST.h3); doc.text(pdfText(v), cx0 + cols[k + 1] - (k === cols.length - 2 ? 8 : 0), ty + ST.h3.size, { align: "right", charSpace: 0 });
      cx0 += cols[k + 1];
    });
    y += 24;

    // ---- 3. Part 1: tips ----
    section(r.part1Heading.replace("{tips}", r.tipsLabel[t.zone]));
    write(z.focus, ST.body, { after: 6 });
    write(r.tipsScope.replace("{zone}", t.zone), ST.body, { after: 14 });
    z.tips.forEach(function (tp, k) {
      var need = write(tp[0], ST.h3, { x: M + 20, dry: true }) + write(tp[1], ST.body, { x: M + 20, dry: true });
      ensure(need);
      setStyle(ST.h3); doc.text(String(k + 1), M, y + ST.h3.size, { charSpace: 0 }); // ink, not zone color: zone colors are too light for text
      write(tp[0], ST.h3, { x: M + 20, after: 2 });
      write(tp[1], ST.body, { x: M + 20, after: 12 });
    });
    y += 2;
    panel([[z.watchTitle, ST.h3, { after: 4 }], [z.watch, ST.body]]);
    if (z.note) { y += 10; write(z.note, ST.body); }

    // ---- 4. Part 2: planning a change (only if they used it) ----
    if (t.ask || t.askSize) {
      section(r.part2Heading.replace("{zone}", t.zone));
      if (t.ask) { write(r.askLabel, ST.label, { after: 2 }); write(t.ask, ST.body, { after: 12 }); }
      if (t.askSize) {
        var items = [
          [t.zone + " + " + sizeLabel(t.askSize) + " change  ->  " + t.gridResult, ST.h3, { after: 4 }],
          [C.grid.lines[t.gridResult], ST.body, { after: 10 }]
        ];
        if (C.grid.actions && C.grid.actions[t.gridResult]) {
          items.push([r.nextStepLabel, ST.label, { after: 2 }]);
          items.push([C.grid.actions[t.gridResult], ST.body]);
        }
        panel(items);
      }
    }

    // ---- 5. What they tried (retakes) ----
    if (t.tried) {
      section(r.triedLabel);
      write(t.tried, ST.body);
    }

    // ---- 6. Every answer, with why it matters and both stories ----
    section(r.pdfAnswersTitle);
    C.groups.forEach(function (g, gi) {
      y += gi ? 10 : 0; ensure(80);
      write((gi + 1) + ". " + g.name, ST.label, { color: RGB.ink, after: 8 });
      g.items.forEach(function (i) {
        var s = C.statements[i], v = t.scores[i];
        ensure(110);
        write((i + 1) + ". " + s.text, ST.h3, { after: 2 });
        var ans = r.pdfYourAnswer + ": " + C.ratings[v - 1] + " (" + v + ")";
        if (compare) ans += "    " + r.pdfFirstTake + ": " + C.ratings[first.scores[i] - 1] + " (" + first.scores[i] + ")";
        write(ans, ST.body, { color: RGB.muted, after: 8 });
        [[C.card.heading, s.why], [C.card.there, s.there], [C.card.missing, s.missing], [C.card.tryThis, s.try]].forEach(function (b) {
          ensure(40);
          write(b[0], ST.label, { x: M + 14, after: 1 });
          write(b[1], ST.body, { x: M + 14, after: 8 });
        });
        y += 4; hr(RGB.line); y += 12;
      });
    });

    // ---- Footer on every page ----
    var pages = doc.internal.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      setStyle(ST.label);
      doc.text("TRUST CHECK", M, H - M + 18, { charSpace: ST.label.cs });
      if (pages > 1) labelRight("Page " + p + " of " + pages, M + CW, H - M + 18);
    }

    doc.save("trust-check-" + ymd(t.date) + "-" + hhmm(t.date) + ".pdf");

    // Record the download.
    if (S.takes === takes || S.saved === takes) {
      t.pdfDownloaded = true;
      if (S.takes === takes) { S.downloaded = true; persist(); }
      else if (S.canSave) writeStore(takes);
    }
    var status = $("[data-pdf-status]", main);
    if (status && S.screen === "results") status.textContent = "PDF downloaded.";
  }

  /* ---------------- Start ---------------- */

  S = freshState();
  go(homeScreen(), { replace: true });
})();
