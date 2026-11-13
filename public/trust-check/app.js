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

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function zoneFor(total) { return total <= 25 ? "Build" : total <= 40 ? "Grow" : "Sustain"; }
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
      if (typeof v !== "number" || v !== Math.floor(v) || v < 1 || v > 5) return null;
    }
    var total = sum(t.scores);
    var size = SIZES.indexOf(t.askSize) >= 0 ? t.askSize : null;
    var zone = zoneFor(total);
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
      if (!d || d.version !== 1 || !Array.isArray(d.takes) || !d.takes.length) return null;
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
      window.localStorage.setItem(KEY, JSON.stringify({ version: 1, takes: takes }));
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
  var MOTION = { start: 120, word: 65, line: 110, settle: 180, item: 140 };

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
      $all(".splash-lede, .splash-intro > p:not(.splash-lede), .facts li, .splash-body .actions .btn", main)
        .forEach(function (el, k) { el.classList.add("enter"); el.style.setProperty("--d", (after + k * MOTION.item) + "ms"); });
    } else {
      // Everything after the title block rises once, together.
      $all(".band-text, .below, .fields, .stages-foot, .screen > :not(.topbar):not(h1):not(.titleblock), .overview > :not(.stack), .overview > .stack > :not(.titleblock)", main)
        .forEach(function (el) {
          if (el.closest(".enter") || el.querySelector("h1")) return;
          el.classList.add("enter"); el.style.setProperty("--d", after + "ms");
        });
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
      default: return "Welcome";
    }
  }

  function renderFooter() {
    var show = S.screen === "welcome" || S.screen === "welcomeBack" || S.screen === "results" || S.screen === "cleared";
    foot.hidden = !show;
    foot.innerHTML = '<span>Mel Milloway</span><span aria-hidden="true">·</span><a href="' + esc(C.linkedIn) + '" rel="noopener noreferrer" data-leave>LinkedIn</a>';
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
    return '<section class="band">' +
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
    if (S.mode === "first") items.push(item(esc(C.stages.headlineLead + C.stages.headlineAccent), !!S.visited.stages, "stages", "", S.screen === "stages"));
    else items.push(item(esc(C.tried.headline), !!S.visited.tried, "tried", "", S.screen === "tried"));
    C.statements.forEach(function (st, i) {
      var v = S.scores[i];
      items.push(item((i + 1) + '. ' + esc(st.text), i <= S.reached, "statement:" + i,
        v ? esc(C.ratings[v - 1]) : "", S.screen === "statement" && S.index === i));
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
        '<p>' + esc(w.body + " " + w.pdf) + '</p>' +
      '</div>' +
      '<ul class="facts">' + facts + '</ul>' +
      '<div class="actions">' +
        '<button type="button" class="btn" data-start>' + esc(w.start) + '</button>' +
        '<button type="button" class="btn btn--outline-light" data-coming>' + esc(w.comingBack) + '</button>' +
      '</div>'
    );
  };
  bind.welcome = function () {
    $("[data-start]", main).addEventListener("click", function () {
      S.mode = "first"; S.ask = ""; S.tried = "";
      go("stages"); // the change question now lives on results (Part 2)
    });
    $("[data-coming]", main).addEventListener("click", function () {
      if (S.saved) {
        // Saved results on this browser: go straight into the retake.
        var last = S.saved[S.saved.length - 1];
        S.mode = "retake"; S.ask = last.ask || ""; S.tried = "";
        go("tried");
      } else {
        go("cleared");
      }
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
      go("tried");
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
      go("tried");
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
        after: st.intro ? '<p class="band-text">' + esc(st.intro) + '</p>' : ""
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
      '<div class="wrap wrap--wide stages-foot">' +
        '<div class="why-head"><p>' + esc(st.footer) + '</p>' +
          '<ul class="areas">' + C.groups.map(function (g) { return '<li>' + esc(g.name) + '</li>'; }).join("") + '</ul></div>' +
        '<div class="actions actions--start"><button type="button" class="btn" data-begin>' + esc(st.button) + '</button></div>' +
      '</div>' +
    '</section>';
  };
  bind.stages = function () {
    bindBack();
    $("[data-begin]", main).addEventListener("click", function () { go("statement", { index: 0 }); });
  };

  /* 6 + 7. Statement and Why card */
  function whyCard(i) {
    var s = C.statements[i], v = S.scores[i], k = C.card;
    if (!v) return "";
    var there = '<div class="impact"><p class="eyebrow there">' + esc(k.there) + '</p><p>' + esc(s.there) + '</p></div>';
    var missing = '<div class="impact"><p class="eyebrow">' + esc(k.missing) + '</p><p>' + esc(s.missing) + '</p></div>';
    var impact = v >= 4 ? there : v <= 2 ? missing : there + missing;
    // Heading and its paragraph are one unit, spaced like each impact label and its text.
    return '<div class="why-head"><h2 class="h3" id="why-h" tabindex="-1">' + esc(k.heading) + '</h2>' +
      '<p>' + esc(s.why) + '</p></div>' +
      '<div data-impact class="stack">' + impact + '</div>' +
      '<div class="actions actions--start"><button type="submit" class="btn">' + esc(i === N - 1 ? k.last : k.next) + '</button></div>';
  }

  SCREENS.statement = function () {
    var i = S.index, s = C.statements[i];
    var pct = ((i + 1) / N * 100).toFixed(1) + "%";
    // Teal band: mark, progress and the statement, sized as a statement (not a hero).
    return '<form class="statement-screen" data-form novalidate>' +
      band({
        count: '<span class="count" aria-hidden="true">' + (i + 1) + ' of ' + N + '</span>',
        progress: '<div class="progress" role="progressbar" aria-label="Progress" aria-valuemin="1" aria-valuemax="' + N + '" aria-valuenow="' + (i + 1) + '" aria-valuetext="' + (i + 1) + ' of ' + N + '"><span data-p="' + pct + '"></span></div>',
        eyebrow: s.group, eyebrowId: "grp-" + i,
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
  bind.statement = function () {
    var i = S.index;
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
          S.cardShown[i] = true;
          $("#why-h", why).focus();
        } else {
          // Keep focus in the group; just update the impact shown.
          var tmp = document.createElement("div");
          tmp.innerHTML = whyCard(i);
          $("[data-impact]", why).innerHTML = $("[data-impact]", tmp).innerHTML;
        }
      });
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
    var zone = zoneFor(total);
    var prev, lastSize;
    if (S.editing && S.takes) {
      // Changed answers after seeing results: replace this take, don't add another.
      prev = S.takes.slice(0, -1);
      lastSize = S.takes[S.takes.length - 1].askSize;
    } else {
      prev = S.saved || [];
      lastSize = prev.length ? prev[prev.length - 1].askSize : null;
    }
    var take = {
      date: isoLocal(new Date()),
      ask: S.ask,
      askSize: lastSize,
      tried: S.mode === "first" ? "" : S.tried,
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
    var at = ((total - 11) / 44 * 100).toFixed(1) + "%";
    return '<div class="zonebar">' +
      '<div class="zonebar-track" role="img" aria-label="' + esc(total + " out of 55, in the " + zone + " range, " + C.zones[zone].range.replace("–", " to ")) + '">' +
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
            '<span class="lbl">First take</span><span class="track first"><span data-v="' + (f / 5 * 100) + '%"></span></span><span class="val">' + f + '</span>' +
            '<span class="lbl">Today</span><span class="track"><span data-v="' + (v / 5 * 100) + '%"></span></span><span class="val">' + v + '</span>' +
          '</div>';
        } else {
          bars = '<div class="bars bars--single"><span class="track" aria-hidden="true"><span data-v="' + (v / 5 * 100) + '%"></span></span><span class="val">' + v + '<span class="sr-only"> of 5, ' + esc(C.ratings[v - 1]) + '</span></span></div>';
        }
        var footer = "";
        if (compare) {
          footer = '<div class="cue-foot"><span class="change"><span class="sr-only">Change: </span>' + signed(v - f) + '</span>' +
          '</div>';
        }
        return '<li class="cue"><p class="cue-text">' + (i + 1) + '. ' + esc(s.text) + '</p>' + bars + footer + '</li>';
      }).join("") + '</ul></div>';
    }).join("") + '</div>';
  }

  function cueTable(takes) {
    var t = takes[takes.length - 1], first = takes[0], compare = takes.length > 1;
    return '<details class="table-alt"><summary>Show as a table</summary><div class="table-scroll"><table class="data-table">' +
      '<thead><tr><th scope="col">Statement</th>' + (compare ? '<th scope="col" class="n">First take</th>' : "") + '<th scope="col" class="n">Today</th>' + (compare ? '<th scope="col" class="n">Change</th>' : "") + '</tr></thead><tbody>' +
      C.statements.map(function (s, i) {
        return '<tr><th scope="row">' + (i + 1) + '. ' + esc(s.text) + '</th>' +
          (compare ? '<td class="n">' + first.scores[i] + '</td>' : "") +
          '<td class="n">' + t.scores[i] + ' (' + esc(C.ratings[t.scores[i] - 1]) + ')</td>' +
          (compare ? '<td class="n">' + signed(t.scores[i] - first.scores[i]) + '</td>' : "") + '</tr>';
      }).join("") +
      '<tr><th scope="row">Total</th>' + (compare ? '<td class="n">' + first.total + '</td>' : "") + '<td class="n">' + t.total + ' out of 55</td>' + (compare ? '<td class="n">' + signed(t.total - first.total) + '</td>' : "") + '</tr>' +
      '</tbody></table></div></details>';
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
            cueTable([t]) +
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
          zoneBar(t.total, t.zone) +
        '</div>' +
        // One sentence that sets up the page; the planner phrase jumps to Part 2.
        '<div class="results-intro">' +
          '<p class="measure">' + esc(r.intro.split("{planner}")[0].replace("{tips}", r.tipsLabel[t.zone].charAt(0).toLowerCase() + r.tipsLabel[t.zone].slice(1))) +
            '<button type="button" class="inline-link" data-jump="change-h">' + esc(r.plannerLink) + '</button>' +
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
          return '<li class="tip"><span class="tip-n" aria-hidden="true">' + (k + 1) + '</span><p><strong>' + esc(tp[0]) + '</strong> ' + esc(tp[1]) + '</p></li>';
        }).join("") + '</ol>' +
        '<aside class="watch stack stack--tight" aria-labelledby="watch-h"><h3 id="watch-h" class="row-icon">' + ICON_EYE + esc(z.watchTitle) + '</h3><p>' + esc(z.watch) + '</p></aside></div>' +
        (z.note ? '<p class="measure">' + esc(z.note) + '</p>' : "") +
      '</section>';

    var after =
      '<nav class="after" aria-label="More options">' +
        '<button type="button" class="btn" data-done>Done</button>' +
        '<button type="button" class="btn btn--secondary" data-fresh>' + esc(r.startFresh) + '</button>' +
      '</nav>';

    var download =
      // Saving and leaving live together in one card, same style as the others.
      '<section class="card save-card" aria-label="' + esc(r.download) + '">' +
        (!S.saveOk ? '<p class="note note--alert"><strong>' + esc(r.noStorage) + '</strong></p>' : "") +
        '<p class="measure">' + esc(r.downloadNote) + '</p>' +
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

  function openStartFresh() {
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
          go("welcome", { replace: true });
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

  function downloadPdf(takes, idx) {
    if (!window.jspdf || !window.jspdf.jsPDF) return;
    var t = takes[idx], first = takes[0], compare = idx > 0;
    var doc = new window.jspdf.jsPDF({ unit: "pt", format: "letter" });
    var W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    var M = 54, CW = W - 2 * M, y = M;

    function color(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function ensure(h) { if (y + h > H - M - 24) { doc.addPage(); y = M; } }
    function para(txt, size, opts) {
      opts = opts || {};
      doc.setFont(opts.font || "helvetica", opts.style || "normal");
      doc.setFontSize(size);
      color(opts.color || RGB.ink);
      var lines = doc.splitTextToSize(pdfText(txt), opts.width || CW);
      var lh = size * (opts.lh || 1.4);
      lines.forEach(function (ln) { ensure(lh); doc.text(ln, opts.x || M, y + size); y += lh; });
      y += opts.after == null ? 6 : opts.after;
    }
    function rule() { ensure(14); doc.setDrawColor(RGB.line[0], RGB.line[1], RGB.line[2]); doc.setLineWidth(0.75); doc.line(M, y + 4, W - M, y + 4); y += 14; }

    // 1. Title, date, session
    para("Trust Check", 28, { font: "times", color: RGB.purple, after: 2, lh: 1.2 });
    para(longDate(t.date) + ", " + timeLabel(t.date), 11, { color: RGB.muted, after: 10 });
    rule();

    // 3. Zone, score, size of change, grid result
    ensure(40);
    var zc = RGB[t.zone];
    doc.setFillColor(zc[0], zc[1], zc[2]);
    doc.rect(M, y + 6, 14, 14, "F");
    para("You're in " + t.zone + ".", 22, { font: "times", x: M + 22, after: 2, lh: 1.25 });
    para(C.zones[t.zone].meaning, 10.5, { after: 8 });
    var facts = ["Total score: " + t.total + " out of 55"];
    if (compare) facts.push("First take, " + longDate(first.date) + ": " + first.zone + " -> Today: " + t.zone);
    facts.forEach(function (f) { para(f, 11, { after: 1 }); });
    y += 8;
    rule();

    // 4. Table of statements
    var colsW = compare ? [CW - 180, 60, 60, 60] : [CW - 120, 120];
    var heads = compare ? ["Statement", "First take", "Today", "Change"] : ["Statement", "Today"];
    ensure(24);
    doc.setFont("helvetica", "bold"); doc.setFontSize(9); color(RGB.muted);
    var x = M;
    heads.forEach(function (h, k) { doc.text(h, k === 0 ? x : x + colsW[k] - 4, y + 10, { align: k === 0 ? "left" : "right" }); x += colsW[k]; });
    y += 18;
    var lastGroup = "";
    C.statements.forEach(function (s, i) {
      if (s.group !== lastGroup) {
        lastGroup = s.group;
        ensure(18);
        doc.setFont("helvetica", "bold"); doc.setFontSize(8.5); color(RGB.purple);
        doc.text(pdfText(s.group.toUpperCase()), M, y + 10);
        y += 16;
      }
      doc.setFont("helvetica", "normal"); doc.setFontSize(10);
      var lines = doc.splitTextToSize(pdfText((i + 1) + ". " + s.text), colsW[0] - 12);
      var rowH = lines.length * 13 + 6;
      ensure(rowH);
      color(RGB.ink);
      lines.forEach(function (ln, k) { doc.text(ln, M, y + 10 + k * 13); });
      var vals = compare
        ? [String(first.scores[i]), String(t.scores[i]), pdfText(signed(t.scores[i] - first.scores[i]))]
        : [t.scores[i] + " (" + C.ratings[t.scores[i] - 1] + ")"];
      var cx = M + colsW[0];
      vals.forEach(function (v, k) { doc.text(v, cx + colsW[k + 1] - 4, y + 10, { align: "right" }); cx += colsW[k + 1]; });
      y += rowH;
      doc.setDrawColor(RGB.line[0], RGB.line[1], RGB.line[2]); doc.setLineWidth(0.5); doc.line(M, y - 2, W - M, y - 2);
    });
    ensure(18);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); color(RGB.ink);
    doc.text("Total", M, y + 10);
    var tv = compare ? [String(first.total), String(t.total), pdfText(signed(t.total - first.total))] : [t.total + " out of 55"];
    var tx = M + colsW[0];
    tv.forEach(function (v, k) { doc.text(v, tx + colsW[k + 1] - 4, y + 10, { align: "right" }); tx += colsW[k + 1]; });
    y += 26;

    // 5. Tips and watch-out
    var z = C.zones[t.zone];
    rule();
    ensure(90);
    para(C.results.part1Heading.replace("{tips}", C.results.tipsLabel[t.zone]), 12.5, { style: "bold", after: 4 });
    para(z.focus, 11, { after: 8, lh: 1.35 });
    z.tips.forEach(function (tp, k) {
      para((k + 1) + ". " + tp[0], 11, { style: "bold", after: 1 });
      para(tp[1], 10.5, { x: M + 14, width: CW - 14, after: 6 });
    });
    y += 4;
    para(z.watchTitle, 11, { style: "bold", color: RGB.ink, after: 1 });
    para(z.watch, 10.5, { after: 6 });
    if (z.note) para(z.note, 10.5, { color: RGB.muted, after: 6 });

    // 6. Planning a change (only if they typed one or chose a size)
    if (t.ask || t.askSize) {
      y += 6; rule(); ensure(60);
      para(C.results.part2Heading.replace("{zone}", t.zone), 12.5, { style: "bold", after: 6 });
      if (t.ask) { para(C.results.askLabel, 10, { style: "bold", after: 1 }); para(t.ask, 10.5, { after: 6 }); }
      if (t.askSize) {
        para("Size of change: " + sizeLabel(t.askSize), 10.5, { after: 1 });
        para(t.zone + " + " + sizeLabel(t.askSize) + " change -> " + t.gridResult + ". " + C.grid.lines[t.gridResult], 10.5, { style: "bold", after: 1 });
        if (C.grid.actions && C.grid.actions[t.gridResult]) para(C.results.nextStepLabel + ": " + C.grid.actions[t.gridResult], 10.5, { after: 6 });
      }
    }

    // 7. What they tried (retakes)
    if (t.tried) {
      y += 6; rule();
      para(C.results.triedLabel, 10, { style: "bold", after: 1 });
      para(t.tried, 10.5, { after: 6 });
    }

    // 8. Every answer with the feedback they saw ("Why this matters" and the
    // matching story, by the same rules as the card: 4-5 there, 1-2 missing, 3 both).
    y += 6; rule(); ensure(60);
    para(C.results.pdfAnswersTitle, 12.5, { style: "bold", after: 8 });
    var lastG = "";
    C.statements.forEach(function (s, i) {
      var v = t.scores[i];
      if (s.group !== lastG) {
        lastG = s.group; ensure(40);
        para(s.group.toUpperCase(), 8.5, { style: "bold", color: RGB.muted, after: 4 });
      }
      ensure(70);
      para((i + 1) + ". " + s.text, 11, { style: "bold", after: 2 });
      var ans = C.results.pdfYourAnswer + ": " + C.ratings[v - 1] + " (" + v + ")";
      if (compare) ans += "   |   " + C.results.pdfFirstTake + ": " + C.ratings[first.scores[i] - 1] + " (" + first.scores[i] + ")";
      para(ans, 10, { color: RGB.muted, after: 4 });
      para(C.card.heading + ": " + s.why, 10, { x: M + 12, width: CW - 12, after: 3 });
      if (v >= 3) para(C.card.there + ": " + s.there, 10, { x: M + 12, width: CW - 12, after: 3 });
      if (v <= 3) para(C.card.missing + ": " + s.missing, 10, { x: M + 12, width: CW - 12, after: 3 });
      y += 6;
    });

    // 9. Page numbers (no link or retake line)
    var pages = doc.internal.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "normal"); doc.setFontSize(9); color(RGB.muted);
      if (pages > 1) doc.text(p + " / " + pages, W - M, H - M + 14, { align: "right" });
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
