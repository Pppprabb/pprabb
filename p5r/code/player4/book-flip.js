/* 一步一步翻页：点击右侧下一页，左侧上一页；每次只翻一张（.p5r-flipPage 按 DOM 顺序） */
(function () {
  "use strict";

  var root = document.getElementById("p5rFlipBook");
  if (!root) return;

  var pages = Array.prototype.slice.call(root.querySelectorAll(".p5r-flipPage"));

  if (!pages.length) return;

  var animating = false;
  var actionToken = 0;

  function getFlippedCount() {
    var n = 0;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].classList.contains("is-flipped")) n++;
    }
    return n;
  }

  function setOpenState() {
    root.classList.toggle("is-open", getFlippedCount() > 0);
  }

  function closeAll() {
    actionToken++;
    animating = false;
    for (var i = 0; i < pages.length; i++) {
      pages[i].classList.remove("is-behind");
      pages[i].classList.remove("is-flipped");
    }
    setOpenState();
  }

  function nextPage() {
    if (animating) return;
    var idx = getFlippedCount();
    if (idx >= pages.length) return;
    animating = true;
    actionToken++;
    var token = actionToken;
    var el = pages[idx];
    function done(e) {
      if (token !== actionToken) return;
      if (e && e.target !== el) return;
      if (e && e.propertyName !== "transform") return;
      el.removeEventListener("transitionend", done);
      el.classList.add("is-behind");
      animating = false;
      setOpenState();
    }
    el.addEventListener("transitionend", done);
    el.classList.remove("is-behind");
    el.classList.add("is-flipped");
    setOpenState();
    // 兜底：部分浏览器可能不触发 transitionend
    window.setTimeout(function () {
      if (animating && token === actionToken) done();
    }, 1400);
  }

  function prevPage() {
    if (animating) return;
    var idx = getFlippedCount() - 1;
    if (idx < 0) return;
    animating = true;
    actionToken++;
    var token = actionToken;
    var el = pages[idx];
    function done(e) {
      if (token !== actionToken) return;
      if (e && e.target !== el) return;
      if (e && e.propertyName !== "transform") return;
      el.removeEventListener("transitionend", done);
      animating = false;
      setOpenState();
    }
    el.addEventListener("transitionend", done);
    el.classList.remove("is-behind");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        el.classList.remove("is-flipped");
      });
    });
    setOpenState();
    window.setTimeout(function () {
      if (animating && token === actionToken) done();
    }, 1400);
  }

  function onClick(e) {
    var rect = root.getBoundingClientRect();
    var mid = rect.left + rect.width / 2;
    if (e.clientX >= mid) nextPage();
    else prevPage();
  }

  function onDocPointerDown(e) {
    if (root.contains(e.target)) return;
    if (getFlippedCount() === 0) return;
    closeAll();
  }

  function onKeyDown(e) {
    if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
      e.preventDefault();
      nextPage();
    } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
      e.preventDefault();
      prevPage();
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeAll();
    }
  }

  root.addEventListener("click", onClick);
  root.addEventListener("keydown", onKeyDown);
  document.addEventListener("pointerdown", onDocPointerDown);
  setOpenState();
})();
