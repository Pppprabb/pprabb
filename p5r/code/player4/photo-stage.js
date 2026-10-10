(function () {
  "use strict";

  var INTRO_IN_MS = 700;
  var INTRO_OUT_MS = 460;
  var STAGE_IN_MS = 500;
  var DEFAULT_HOLD_MS = 1600;
  var IMG_FALLBACK_MS = 1300;

  function initPhotoStage(root) {
    if (!root) return;
    var rotor = root.querySelector(".p5r-photoStage__rotor");
    var cards = root.querySelectorAll(".p5r-photoStage__card");
    if (!rotor || !cards.length) return;

    var reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var autoSpin = 0;
    var rafId = 0;

    function setRotorTransform() {
      rotor.style.transform = "rotateY(" + autoSpin + "deg)";
      root.style.setProperty("--p5r-stage-spin", autoSpin + "deg");
    }

    function tick() {
      if (!reduceMotion) autoSpin += 0.06;
      setRotorTransform();
      rafId = requestAnimationFrame(tick);
    }

    function spinCardFace(btn) {
      if (reduceMotion) return;
      var flip = btn.querySelector(".p5r-photoStage__cardFlip");
      if (!flip || flip.classList.contains("p5r-photoStage__cardFlip--spin")) return;
      flip.classList.remove("p5r-photoStage__cardFlip--spin");
      void flip.offsetWidth;
      flip.classList.add("p5r-photoStage__cardFlip--spin");
      var done = function () {
        flip.classList.remove("p5r-photoStage__cardFlip--spin");
        flip.removeEventListener("animationend", done);
      };
      flip.addEventListener("animationend", done);
    }

    cards.forEach(function (btn) {
      btn.addEventListener("click", function () {
        spinCardFace(btn);
      });
    });

    setRotorTransform();
    if (!reduceMotion) {
      rafId = requestAnimationFrame(tick);
    }

    document.addEventListener("visibilitychange", function () {
      if (reduceMotion) return;
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = 0;
      } else if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    });
  }

  var intro = document.getElementById("p5rPhotoStageIntro");
  var stage = document.getElementById("p5rPhotoStageRoot");
  var reduceMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!stage) return;

  if (reduceMotion || !intro) {
    if (intro && reduceMotion) {
      intro.setAttribute("hidden", "");
      intro.setAttribute("aria-hidden", "true");
    }
    stage.classList.remove("p5r-photoStage--introPending");
    initPhotoStage(stage);
    return;
  }

  var rawHold = intro.getAttribute("data-hold-ms");
  var holdMs = rawHold ? parseInt(rawHold, 10) : DEFAULT_HOLD_MS;
  if (isNaN(holdMs) || holdMs < 400) holdMs = DEFAULT_HOLD_MS;

  var introImg = intro.querySelector(".p5r-photoStageIntro__img");
  var introStarted = false;

  function teardownIntro() {
    intro.setAttribute("hidden", "");
    intro.setAttribute("aria-hidden", "true");
    intro.classList.remove("p5r-photoStageIntro--in", "p5r-photoStageIntro--out");
  }

  function showStage() {
    stage.classList.remove("p5r-photoStage--introPending");
    stage.classList.add("p5r-photoStage--in");
    initPhotoStage(stage);
    setTimeout(function () {
      stage.classList.remove("p5r-photoStage--in");
    }, STAGE_IN_MS + 50);
  }

  function runDissolve() {
    intro.classList.add("p5r-photoStageIntro--out");
    setTimeout(function () {
      teardownIntro();
      showStage();
    }, INTRO_OUT_MS);
  }

  function playIntroSequence() {
    if (introStarted) return;
    introStarted = true;
    requestAnimationFrame(function () {
      intro.classList.add("p5r-photoStageIntro--in");
    });
    setTimeout(function () {
      setTimeout(runDissolve, holdMs);
    }, INTRO_IN_MS);
  }

  function bootIntro() {
    playIntroSequence();
  }

  if (introImg && !introImg.complete) {
    var done = function () {
      bootIntro();
    };
    introImg.addEventListener("load", done, { once: true });
    introImg.addEventListener("error", done, { once: true });
    setTimeout(function () {
      if (!introStarted) bootIntro();
    }, IMG_FALLBACK_MS);
  } else {
    bootIntro();
  }
})();
