(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  // 与 test/site.js 一致：资源根目录（code/shared/site.js 里用 location 会解析错 player4/pages 路径）
  var ASSET_ROOT = (function () {
    var src = document.currentScript && document.currentScript.src;
    if (src) return new URL("../../shared/p5ui/assets/src-assets/images/", src).href;
    return new URL("../../../shared/p5ui/assets/src-assets/images/", window.location.href).href;
  })();

  // -----------------------
  // Notification：与 test/site.js 的 showNoti 行为一致（clone 模板 + 堆叠 + 自动消失）
  // -----------------------
  var notiHost = $("#p5NotiHost");
  var notiTpl = $("#p5NotiTpl");

  function closeP5Noti(el) {
    if (!el) return;
    el.style.opacity = "0";
    if (el.classList && el.classList.contains("p5r-noti--bottomQuarter")) {
      el.style.transform = "translate(-50%, 20px)";
    } else {
      el.style.transform = "translateX(-8px)";
    }
    setTimeout(function () {
      if (el && el.parentNode) el.remove();
    }, 180);
  }

  function showP5Noti(text, opts) {
    if (!notiHost || !notiTpl) return;
    opts = opts || {};
    var ttl = typeof opts.ttl === "number" ? opts.ttl : 3200;
    var title = opts.title || "摩尔 加纳";
    var portraitSrc = opts.portraitSrc;
    var dialogSrc = opts.dialogSrc;

    var el = notiTpl.cloneNode(true);
    el.removeAttribute("id");
    el.style.display = "block";
    el.style.opacity = "1";
    el.style.transform = "translateX(0)";

    var portraitImg = el.querySelector(".p5-portrait-img");
    if (portraitImg && portraitSrc) portraitImg.src = portraitSrc;
    var dialogImg = el.querySelector(".p5-dialog-img");
    if (dialogImg && dialogSrc) dialogImg.src = dialogSrc;

    var titleSpan = el.querySelector(".p5-noti-title .p5-title-ctn span");
    if (titleSpan) titleSpan.textContent = title;
    var textEl = el.querySelector(".p5-noti-text");
    if (textEl) textEl.textContent = text || "通知";

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "site-notiClose";
    closeBtn.setAttribute("aria-label", "关闭通知");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeP5Noti(el);
    });
    el.appendChild(closeBtn);

    var bottomQuarter = !!opts.bottomQuarter;
    if (bottomQuarter) {
      el.classList.add("p5r-noti--bottomQuarter");
    }
    el.style.opacity = "0";
    el.style.transform = bottomQuarter
      ? "translate(-50%, 28px)"
      : "translateX(-10px)";
    notiHost.appendChild(el);
    requestAnimationFrame(function () {
      el.style.transition = "opacity .18s ease, transform .18s ease";
      el.style.opacity = "1";
      el.style.transform = bottomQuarter ? "translate(-50%, 0)" : "translateX(0)";
    });

    if (ttl > 0) {
      setTimeout(function () {
        closeP5Noti(el);
      }, ttl);
    }
  }

  // -----------------------
  // Upload：与 test/site.js 一致（code/shared/site.js 未绑定 .p5-upload-ctn）
  // -----------------------
  var zoomLayer = $("#p5Zoom");
  var zoomImg = zoomLayer && zoomLayer.querySelector(".p5-zoom-img");
  var zoomClose = zoomLayer && zoomLayer.querySelector(".p5-zoom-close");

  function openZoom(src) {
    if (!zoomLayer || !zoomImg) return;
    zoomImg.src = src;
    zoomLayer.style.display = "flex";
  }
  function closeZoom() {
    if (!zoomLayer) return;
    zoomLayer.style.display = "none";
  }
  if (zoomClose) zoomClose.addEventListener("click", closeZoom);
  if (zoomLayer) {
    zoomLayer.addEventListener("click", function (e) {
      if (e.target === zoomLayer) closeZoom();
    });
  }

  function bindUpload(container) {
    var preview = container.querySelector(".p5-upload-preview");
    var input = container.querySelector('input[type="file"]');
    var del = container.querySelector(".p5-upload-delete");
    var zoomBtn = container.querySelector(".p5-zoom");
    var defaultSrc = ASSET_ROOT + "upload/default.png";
    if (!preview || !input) return;

    var current = preview.getAttribute("src") || defaultSrc;
    function isDefault() {
      return (preview.getAttribute("src") || "").indexOf("default.png") !== -1;
    }
    function setPreview(url) {
      current = url;
      preview.src = url;
      if (del) del.hidden = isDefault();
    }

    container.addEventListener("click", function (e) {
      if (e.target.closest(".p5-upload-delete") || e.target.closest(".p5-zoom")) return;
      if (isDefault()) input.click();
    });

    input.addEventListener("change", function () {
      var f = input.files && input.files[0];
      if (!f || !f.type.match(/^image\//)) return;
      setPreview(URL.createObjectURL(f));
    });

    container.addEventListener("dragover", function (e) {
      e.preventDefault();
    });
    container.addEventListener("drop", function (e) {
      e.preventDefault();
      var f = e.dataTransfer.files && e.dataTransfer.files[0];
      if (!f || !f.type.match(/^image\//)) return;
      setPreview(URL.createObjectURL(f));
    });

    if (del) {
      del.addEventListener("click", function (e) {
        e.stopPropagation();
        input.value = "";
        setPreview(defaultSrc);
      });
    }
    if (zoomBtn) {
      zoomBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (isDefault()) return;
        openZoom(current);
      });
    }
  }

  $all(".p5-upload-ctn").forEach(bindUpload);

  // -----------------------
  // Banner：3D 视差（随鼠标平移 + 轻微 rotateX/Y）
  // 监听 document：顶栏 fixed 盖在 banner 上，只在 banner 上监听时导航条区域无法驱动视差
  // -----------------------
  var banner = $(".p5r-banner");
  var bannerBg = banner && banner.querySelector(".p5r-banner__bg");
  var reduceMotionBanner =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (banner && bannerBg && !reduceMotionBanner) {
    var maxTranslate = 14;
    var maxTilt = 5;
    var parallaxIdle =
      "translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(1)";
    function applyBannerParallax(e) {
      var rect = banner.getBoundingClientRect();
      var zoneTop = Math.max(0, rect.top);
      var zoneBottom = rect.bottom;
      if (zoneBottom <= 0 || zoneTop >= window.innerHeight) {
        bannerBg.style.transform = parallaxIdle;
        return;
      }
      if (e.clientY < zoneTop - 24 || e.clientY > zoneBottom + 48) {
        bannerBg.style.transform = parallaxIdle;
        return;
      }
      var cx = rect.left + rect.width / 2;
      var zoneMidY = (zoneTop + zoneBottom) / 2;
      var halfW = Math.max(1, rect.width / 2);
      var halfH = Math.max(1, (zoneBottom - zoneTop) / 2);
      var dx = (e.clientX - cx) / halfW;
      var dy = (e.clientY - zoneMidY) / halfH;
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));
      var tx = -dx * maxTranslate;
      var ty = -dy * maxTranslate;
      var rx = dy * maxTilt;
      var ry = -dx * maxTilt;
      bannerBg.style.transform =
        "translate3d(" + tx + "px," + ty + "px,0) rotateX(" + rx + "deg) rotateY(" + ry + "deg) scale(1.05)";
    }
    document.addEventListener("mousemove", applyBannerParallax);
    window.addEventListener("blur", function () {
      bannerBg.style.transform = parallaxIdle;
    });
  }

  // 日历整卡底图：与 banner 相同的平移 + rotateX/Y 视差；在卡内时 scale(1.07)（原 CSS 悬停放大）
  var calendarCard = $(".p5r-calendarCard");
  var calBgImg =
    calendarCard && calendarCard.querySelector(".p5r-calBgLayer__img");
  var reduceMotionCal =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (calendarCard && calBgImg && !reduceMotionCal) {
    var calMaxTranslate = 14;
    var calMaxTilt = 5;
    var calParallaxIdle =
      "translate3d(0,0,0) rotateX(0deg) rotateY(0deg) scale(1)";
    function applyCalendarParallax(e) {
      var rect = calendarCard.getBoundingClientRect();
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) {
        calBgImg.style.transform = calParallaxIdle;
        return;
      }
      var pad = 10;
      var inside =
        e.clientX >= rect.left - pad &&
        e.clientX <= rect.right + pad &&
        e.clientY >= rect.top - pad &&
        e.clientY <= rect.bottom + pad;
      if (!inside) {
        calBgImg.style.transform = calParallaxIdle;
        return;
      }
      var cx = rect.left + rect.width / 2;
      var zoneMidY = (rect.top + rect.bottom) / 2;
      var halfW = Math.max(1, rect.width / 2);
      var halfH = Math.max(1, (rect.bottom - rect.top) / 2);
      var dx = (e.clientX - cx) / halfW;
      var dy = (e.clientY - zoneMidY) / halfH;
      dx = Math.max(-1, Math.min(1, dx));
      dy = Math.max(-1, Math.min(1, dy));
      var tx = -dx * calMaxTranslate;
      var ty = -dy * calMaxTranslate;
      var rx = dy * calMaxTilt;
      var ry = -dx * calMaxTilt;
      calBgImg.style.transform =
        "translate3d(" +
        tx +
        "px," +
        ty +
        "px,0) rotateX(" +
        rx +
        "deg) rotateY(" +
        ry +
        "deg) scale(1.07)";
    }
    document.addEventListener("mousemove", applyCalendarParallax);
    window.addEventListener("blur", function () {
      calBgImg.style.transform = calParallaxIdle;
    });
  }

  // 顶栏 details 点击外部关闭：见 code/shared/site.js（全站统一）

  // -----------------------
  // 左侧：轮播 + dots（已去掉第二张素材）
  // -----------------------
  var heroImg = $("#calHeroImg");
  var dotsHost = $("#calHeroDots");

  var heroImages = [
    "../../../皇家p5r/高卷杏/人物素材2 (1).png",
    "../../../皇家p5r/喜多川祐介/人物插图 (2).png",
    "../../../皇家p5r/喜多川祐介/人物插图 (3).png",
    "../../../皇家p5r/喜多川祐介/人物插图 (4).png"
  ];
  var HERO_INTERVAL_MS = 6200;
  var HERO_FADE_MS = 280;

  var heroIndex = 0;
  var heroTimer = null;

  function renderHeroDots() {
    if (!dotsHost) return;
    dotsHost.innerHTML = "";
    for (var i = 0; i < heroImages.length; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("data-i", String(i));
      b.setAttribute("aria-label", "切换到第 " + (i + 1) + " 张");
      dotsHost.appendChild(b);
    }
    dotsHost.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest && e.target.closest("[data-i]");
      if (!btn) return;
      var i = Number(btn.getAttribute("data-i"));
      setHero(i, true);
    });
  }

  function setHeroDotsActive(i) {
    if (!dotsHost) return;
    Array.prototype.forEach.call(dotsHost.querySelectorAll("button[data-i]"), function (b) {
      b.classList.toggle("is-active", Number(b.getAttribute("data-i")) === i);
    });
  }

  function setHero(i, resetTimer) {
    heroIndex = (i + heroImages.length) % heroImages.length;
    if (heroImg) {
      heroImg.style.opacity = "0";
      setTimeout(function () {
        if (!heroImg) return;
        heroImg.src = heroImages[heroIndex];
        heroImg.style.opacity = "1";
      }, HERO_FADE_MS);
    }
    setHeroDotsActive(heroIndex);
    if (resetTimer) startHero();
  }

  function startHero() {
    stopHero();
    heroTimer = setInterval(function () {
      setHero(heroIndex + 1, false);
    }, HERO_INTERVAL_MS);
  }

  function stopHero() {
    if (heroTimer) clearInterval(heroTimer);
    heroTimer = null;
  }

  if (heroImg) {
    renderHeroDots();
    setHero(0, false);
    startHero();
    var heroRegion = $(".p5r-calHero");
    if (heroRegion) {
      heroRegion.addEventListener("mouseenter", function () {
        stopHero();
      });
      heroRegion.addEventListener("mouseleave", function () {
        startHero();
      });
    }
  }

  // -----------------------
  // 左侧：日历（选中某天用 sword 飞来钉住）
  // -----------------------
  var calTitleDisplay = $("#calTitleDisplay");
  var calYearPart = $("#calYearPart");
  var calMonthPart = $("#calMonthPart");
  var calJumpYearBar = $("#calJumpYearBar");
  var calJumpMonthBar = $("#calJumpMonthBar");
  var calJumpYear = $("#calJumpYear");
  var calJumpMonth = $("#calJumpMonth");
  var calYearOk = $("#calYearOk");
  var calMonthOk = $("#calMonthOk");
  var calGrid = $("#calGrid");
  var btnPrev = $("#calPrev");
  var btnNext = $("#calNext");
  var activePin = { el: null, key: "" };

  var today = new Date();
  var view = { y: today.getFullYear(), m: today.getMonth() }; // m:0-11

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function keyOf(y, m, d) {
    return y + "-" + pad2(m + 1) + "-" + pad2(d);
  }

  function daysInMonth(y, m) {
    return new Date(y, m + 1, 0).getDate();
  }

  // Monday-first: 1..7
  function weekdayMonFirst(y, m, d) {
    var wd = new Date(y, m, d).getDay(); // 0 Sun .. 6 Sat
    return wd === 0 ? 7 : wd;
  }

  function clearPin() {
    if (activePin.el && activePin.el.isConnected) activePin.el.remove();
    activePin.el = null;
    activePin.key = "";
    $all(".p5r-day.is-pinned").forEach(function (btn) {
      btn.classList.remove("is-pinned");
    });
  }

  function pinTo(dayBtn, y, m, d) {
    clearPin();
    if (!dayBtn) return;
    dayBtn.classList.add("is-pinned");
    var img = document.createElement("img");
    img.className = "p5r-swordPin is-fly";
    img.alt = "selected";
    img.src = "../../../shared/p5ui/assets/src-assets/images/sword.png";
    dayBtn.appendChild(img);
    activePin.el = img;
    activePin.key = keyOf(y, m, d);
  }

  function isCalEditOpen() {
    return (
      (calJumpYearBar && !calJumpYearBar.hidden) ||
      (calJumpMonthBar && !calJumpMonthBar.hidden)
    );
  }

  function syncCalTitleText() {
    if (isCalEditOpen()) return;
    if (calYearPart) calYearPart.textContent = String(view.y);
    if (calMonthPart) calMonthPart.textContent = String(view.m + 1);
  }

  function closeCalEditWithoutApply() {
    if (calJumpYearBar) calJumpYearBar.hidden = true;
    if (calJumpMonthBar) calJumpMonthBar.hidden = true;
    syncCalTitleText();
  }

  function openCalJumpYear() {
    if (!calJumpYearBar) return;
    if (calJumpMonthBar) calJumpMonthBar.hidden = true;
    calJumpYearBar.hidden = false;
    if (calJumpYear) {
      calJumpYear.value = String(view.y);
      calJumpYear.focus();
      calJumpYear.select();
    }
  }

  function openCalJumpMonth() {
    if (!calJumpMonthBar) return;
    if (calJumpYearBar) calJumpYearBar.hidden = true;
    calJumpMonthBar.hidden = false;
    if (calJumpMonth) {
      calJumpMonth.value = String(view.m + 1);
      calJumpMonth.focus();
      calJumpMonth.select();
    }
  }

  function confirmCalJumpYear() {
    if (!calJumpYear) return;
    var y = parseInt(calJumpYear.value, 10);
    if (isNaN(y) || y < 1900 || y > 2100) {
      showP5Noti("请输入合法年份（1900–2100）", {
        ttl: 2400,
        title: "日历",
        portraitSrc: ASSET_ROOT + "portraits/mona.png",
        dialogSrc: ASSET_ROOT + "notification.png"
      });
      return;
    }
    view.y = y;
    closeCalEditWithoutApply();
    renderCalendar();
  }

  function confirmCalJumpMonth() {
    if (!calJumpMonth) return;
    var mo = parseInt(calJumpMonth.value, 10);
    if (isNaN(mo) || mo < 1 || mo > 12) {
      showP5Noti("请输入合法月份（1–12）", {
        ttl: 2400,
        title: "日历",
        portraitSrc: ASSET_ROOT + "portraits/mona.png",
        dialogSrc: ASSET_ROOT + "notification.png"
      });
      return;
    }
    view.m = mo - 1;
    closeCalEditWithoutApply();
    renderCalendar();
  }

  function renderCalendar() {
    if (!calGrid) return;
    if (isCalEditOpen()) closeCalEditWithoutApply();
    syncCalTitleText();
    calGrid.innerHTML = "";

    var firstW = weekdayMonFirst(view.y, view.m, 1); // 1..7
    var dim = daysInMonth(view.y, view.m);

    // fill 6 weeks x 7 days = 42
    var prevMonth = new Date(view.y, view.m, 0);
    var prevDim = prevMonth.getDate();

    for (var i = 0; i < 42; i++) {
      var cell = document.createElement("button");
      cell.type = "button";
      cell.className = "p5r-day";
      cell.setAttribute("role", "gridcell");

      var dayNumEl = document.createElement("span");
      dayNumEl.className = "p5r-dayNum";

      var d = i - (firstW - 1) + 1;
      var y = view.y;
      var m = view.m;
      var isMuted = false;

      if (d <= 0) {
        // previous month
        isMuted = true;
        var pm = view.m - 1;
        if (pm < 0) { pm = 11; y = view.y - 1; } else { y = view.y; }
        m = pm;
        d = prevDim + d;
      } else if (d > dim) {
        // next month
        isMuted = true;
        var nm = view.m + 1;
        if (nm > 11) { nm = 0; y = view.y + 1; } else { y = view.y; }
        m = nm;
        d = d - dim;
      }

      if (isMuted) cell.classList.add("is-muted");
      dayNumEl.textContent = String(d);
      cell.appendChild(dayNumEl);

      cell.setAttribute("data-y", String(y));
      cell.setAttribute("data-m", String(m));
      cell.setAttribute("data-d", String(d));

      calGrid.appendChild(cell);

      // restore pin if current key matches
      if (activePin.key && activePin.key === keyOf(y, m, d)) {
        pinTo(cell, y, m, d);
      }
    }
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", function () {
      view.m -= 1;
      if (view.m < 0) { view.m = 11; view.y -= 1; }
      renderCalendar();
    });
  }
  if (btnNext) {
    btnNext.addEventListener("click", function () {
      view.m += 1;
      if (view.m > 11) { view.m = 0; view.y += 1; }
      renderCalendar();
    });
  }

  if (calGrid) {
    calGrid.addEventListener("click", function (e) {
      var btn = e.target && e.target.closest && e.target.closest(".p5r-day");
      if (!btn) return;
      var y = Number(btn.getAttribute("data-y"));
      var m = Number(btn.getAttribute("data-m"));
      var d = Number(btn.getAttribute("data-d"));
      pinTo(btn, y, m, d);
    });
  }

  function onCalYearKeydown(e) {
    if (!calJumpYearBar || calJumpYearBar.hidden) return;
    if (e.key === "Enter") {
      e.preventDefault();
      confirmCalJumpYear();
    }
  }
  function onCalMonthKeydown(e) {
    if (!calJumpMonthBar || calJumpMonthBar.hidden) return;
    if (e.key === "Enter") {
      e.preventDefault();
      confirmCalJumpMonth();
    }
  }
  if (calYearPart) {
    calYearPart.addEventListener("dblclick", function (e) {
      e.preventDefault();
      openCalJumpYear();
    });
  }
  if (calMonthPart) {
    calMonthPart.addEventListener("dblclick", function (e) {
      e.preventDefault();
      openCalJumpMonth();
    });
  }
  if (calYearOk) {
    calYearOk.addEventListener("click", function () {
      confirmCalJumpYear();
    });
  }
  if (calMonthOk) {
    calMonthOk.addEventListener("click", function () {
      confirmCalJumpMonth();
    });
  }
  if (calJumpYear) calJumpYear.addEventListener("keydown", onCalYearKeydown);
  if (calJumpMonth) calJumpMonth.addEventListener("keydown", onCalMonthKeydown);

  document.addEventListener("keydown", function (e) {
    if (!isCalEditOpen()) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeCalEditWithoutApply();
    }
  });

  renderCalendar();

  // -----------------------
  // 左下：浮动广告（点三次切图，再点触发通知并消失）
  // -----------------------
  var floatAd = $("#floatAd");
  var floatAdImg = $("#floatAdImg");
  var adSeq = [
    "../../../皇家p5r/摩尔加纳/摩尔加纳 (1).png",
    "../../../皇家p5r/摩尔加纳/摩尔加纳 (8).png",
    "../../../皇家p5r/摩尔加纳/摩尔加纳 (11).png"
  ];
  var adClick = 0;

  if (floatAd && floatAdImg) {
    floatAd.addEventListener("click", function () {
      adClick += 1;
      if (adClick <= 3) {
        floatAdImg.src = adSeq[(adClick - 1) % adSeq.length];
        return;
      }
      showP5Noti("不要再摸啦！", {
        ttl: 3000,
        title: "摩尔 加纳",
        portraitSrc: ASSET_ROOT + "portraits/mona.png",
        dialogSrc: ASSET_ROOT + "notification.png",
        bottomQuarter: true
      });
      floatAd.style.display = "none";
    });
  }

  // -----------------------
  // 右侧：预告信文字（最多 12 字，上下两行、每行最多 6 字、整体居中）+ 上传背景同步
  // -----------------------
  var letterInput = $("#letterInput");
  var tilesHost = $("#letterTiles");
  var preview = document.querySelector(".p5r-letterPreview");
  var rings = document.querySelector(".p5r-letterRings");
  var uploadPreview = $("#letterUpload .p5-upload-preview");

  var LETTER_MAX = 12;
  var LETTER_PER_ROW = 6;

  function tileVariant(i) {
    var v = i % 3;
    return v === 0 ? "v1" : v === 1 ? "v2" : "v3";
  }

  function layoutTiles(text) {
    if (!tilesHost) return;
    tilesHost.innerHTML = "";
    var s = String(text || "").trim();
    if (!s) return;

    var chars = Array.prototype.slice.call(s).slice(0, LETTER_MAX);
    var row1 = chars.slice(0, LETTER_PER_ROW);
    var row2 = chars.slice(LETTER_PER_ROW);

    function makeRow(arr, indexOffset) {
      var wrap = document.createElement("div");
      wrap.className = "p5r-letterRow";
      for (var j = 0; j < arr.length; j++) {
        var i = indexOffset + j;
        var ch = arr[j];
        var el = document.createElement("div");
        el.className = "p5r-tile " + tileVariant(i);
        el.textContent = ch;
        // 同一行保持基线对齐：只做围绕中心的轻微旋转，不再上下位移
        var rot = -12 + ((i * 9) % 25); // -12 ~ 12 度
        el.style.transform = "rotate(" + rot + "deg)";
        wrap.appendChild(el);
      }
      return wrap;
    }

    if (row1.length) tilesHost.appendChild(makeRow(row1, 0));
    if (row2.length) tilesHost.appendChild(makeRow(row2, row1.length));
  }

  if (letterInput) {
    letterInput.addEventListener("input", function () {
      layoutTiles(letterInput.value);
    });
    layoutTiles(letterInput.value);
  }

  // Upload 预览图变化 -> 同步到预告信背景
  function syncPreviewBgFromUpload() {
    if (!preview || !uploadPreview) return;
    var src = uploadPreview.getAttribute("src") || "";
    var isDefault = src.indexOf("/upload/default.png") !== -1 || src.indexOf("\\upload\\default.png") !== -1;
    if (isDefault) {
      preview.classList.remove("has-bg");
      preview.style.backgroundImage = "";
      if (rings) rings.style.display = "flex";
      return;
    }
    preview.classList.add("has-bg");
    preview.style.backgroundImage = "url('" + src.replace(/'/g, "%27") + "')";
    if (rings) rings.style.display = "none";
  }

  if (uploadPreview) {
    syncPreviewBgFromUpload();
    var mo = new MutationObserver(function () {
      syncPreviewBgFromUpload();
    });
    mo.observe(uploadPreview, { attributes: true, attributeFilter: ["src"] });
  }

  // -----------------------
  // 页眉：banner 还在视口里则透明；banner 完全滚上去后黑底
  // -----------------------
  var headerBar = $(".p5r-header");
  var bannerEl = $(".p5r-banner");
  function syncHeaderBar() {
    if (!headerBar) return;
    if (!bannerEl) {
      headerBar.classList.add("p5r-header--solid");
      return;
    }
    var pastBanner = bannerEl.getBoundingClientRect().bottom <= 0;
    headerBar.classList.toggle("p5r-header--solid", pastBanner);
  }

  function onWindowScroll() {
    syncHeaderBar();
  }
  window.addEventListener("scroll", onWindowScroll, { passive: true });
  syncHeaderBar();

  // -----------------------
  // 人物表：每页最多 5 行，底部分页切换（表格结构为纯 HTML + p5-ui）
  // -----------------------
  var charPager = $("#charTablePager");
  var charRows = $all(".p5r-charRow");
  function setCharTablePage(page) {
    var p = String(page);
    charRows.forEach(function (tr) {
      tr.hidden = tr.getAttribute("data-char-page") !== p;
      tr.classList.remove("is-selected");
    });
    $all(".p5r-charPagerBtn").forEach(function (btn) {
      var on = btn.getAttribute("data-char-page") === p;
      btn.classList.toggle("is-active", on);
      if (on) btn.setAttribute("aria-current", "page");
      else btn.removeAttribute("aria-current");
    });
  }
  if (charPager && charRows.length) {
    charPager.addEventListener("click", function (e) {
      var t = e.target;
      if (!t || !t.getAttribute) return;
      var pg = t.getAttribute("data-char-page");
      if (!pg) return;
      setCharTablePage(pg);
    });
    setCharTablePage("1");
  }

  var charTableEl = document.querySelector(".p5r-charTable");
  if (charTableEl) {
    function charRowOpenHref(tr) {
      if (!tr || tr.hidden) return;
      var href = tr.getAttribute("data-char-href");
      if (!href) return;
      window.open(href, "_blank", "noopener,noreferrer");
    }
    charTableEl.addEventListener("click", function (e) {
      var tr = e.target.closest("tr.p5r-charRow[data-char-href]");
      if (!tr || !charTableEl.contains(tr)) return;
      charRows.forEach(function (r) {
        r.classList.remove("is-selected");
      });
      tr.classList.add("is-selected");
      charRowOpenHref(tr);
    });
    charTableEl.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var tr = e.target.closest("tr.p5r-charRow[data-char-href]");
      if (!tr || !charTableEl.contains(tr)) return;
      e.preventDefault();
      charRowOpenHref(tr);
    });
  }

  // -----------------------
  // 4×4 华容道：原图比例不拉伸；切片用像素对齐 background；滑块可拖到空格（相邻合法）
  // -----------------------
  var slideMount = $("#slidePuzzleMount");
  var slideReset = $("#slidePuzzleReset");
  var SLIDE_PUZZLE_SRC = new URL(
    "../../../皇家p5r/雨宫莲/背景角色素材 (5).png",
    window.location.href
  ).href;
  var slideState = [];
  var slideWon = false;
  var slideImgNaturalW = 1;
  var slideImgNaturalH = 1;
  var slideDragSlot = null;

  function slideNeighbors(i) {
    var r = (i / 4) | 0;
    var c = i % 4;
    var out = [];
    if (c > 0) out.push(i - 1);
    if (c < 3) out.push(i + 1);
    if (r > 0) out.push(i - 4);
    if (r < 3) out.push(i + 4);
    return out;
  }

  function slideShuffle() {
    var s = [];
    var i;
    for (i = 0; i < 15; i++) s[i] = i;
    s[15] = null;
    var empty = 15;
    for (i = 0; i < 450; i++) {
      var ns = slideNeighbors(empty);
      var j = ns[(Math.random() * ns.length) | 0];
      s[empty] = s[j];
      s[j] = null;
      empty = j;
    }
    slideState = s;
  }

  function slideIsSolved() {
    var k;
    for (k = 0; k < 15; k++) {
      if (slideState[k] !== k) return false;
    }
    return slideState[15] === null;
  }

  function slideTrySwapSlot(slotIndex) {
    if (slideWon) return false;
    var emptyPos = slideState.indexOf(null);
    if (slideNeighbors(emptyPos).indexOf(slotIndex) === -1) return false;
    slideState[emptyPos] = slideState[slotIndex];
    slideState[slotIndex] = null;
    return true;
  }

  /** 将两个格子上的内容（含一方为空格）互换，用于拖到另一块上 */
  function slideTrySwapTwoSlots(fromSlot, toSlot) {
    if (slideWon) return false;
    if (fromSlot === toSlot) return false;
    if (fromSlot < 0 || fromSlot > 15 || toSlot < 0 || toSlot > 15) return false;
    var a = slideState[fromSlot];
    var b = slideState[toSlot];
    if (a === null && b === null) return false;
    slideState[fromSlot] = b;
    slideState[toSlot] = a;
    return true;
  }

  function slideAfterMove() {
    if (slideIsSolved()) {
      slideWon = true;
      renderSlidePuzzle();
      showP5Noti("恭喜完成！！拼图", {
        ttl: 4200,
        title: "摩尔 加纳",
        portraitSrc: ASSET_ROOT + "portraits/mona.png",
        dialogSrc: ASSET_ROOT + "notification.png",
        bottomQuarter: true
      });
    } else {
      renderSlidePuzzle();
    }
  }

  function slideApplySlices(board) {
    if (!board || slideWon) return;
    var rect = board.getBoundingClientRect();
    var cs = window.getComputedStyle(board);
    var pl = parseFloat(cs.paddingLeft) || 0;
    var pt = parseFloat(cs.paddingTop) || 0;
    var pr = parseFloat(cs.paddingRight) || 0;
    var pb = parseFloat(cs.paddingBottom) || 0;
    var innerW = rect.width - pl - pr;
    var innerH = rect.height - pt - pb;
    if (innerW < 8 || innerH < 8) return;
    var tw = innerW / 4;
    var th = innerH / 4;
    var tiles = board.querySelectorAll(".p5r-slidePuzzle__tile:not(.is-empty)");
    var i;
    for (i = 0; i < tiles.length; i++) {
      var tile = tiles[i];
      var piece = Number(tile.getAttribute("data-piece"));
      if (isNaN(piece)) continue;
      var col = piece % 4;
      var row = (piece / 4) | 0;
      tile.style.backgroundImage = "url(" + JSON.stringify(SLIDE_PUZZLE_SRC) + ")";
      tile.style.backgroundSize = innerW + "px " + innerH + "px";
      tile.style.backgroundPosition = "-" + col * tw + "px -" + row * th + "px";
    }
  }

  function slideClearDropHighlight(board) {
    if (!board) return;
    var marked = board.querySelectorAll(".p5r-slidePuzzle__tile.is-drop-target");
    var j;
    for (j = 0; j < marked.length; j++) marked[j].classList.remove("is-drop-target");
  }

  function renderSlidePuzzle() {
    if (!slideMount) return;
    slideMount.innerHTML = "";
    if (slideWon) {
      var wrapDone = document.createElement("div");
      wrapDone.className = "p5r-slidePuzzle__board p5r-slidePuzzle__board--done";
      wrapDone.style.aspectRatio = slideImgNaturalW + " / " + slideImgNaturalH;
      var full = document.createElement("img");
      full.className = "p5r-slidePuzzle__fullimg";
      full.src = SLIDE_PUZZLE_SRC;
      full.alt = "拼图完成";
      wrapDone.appendChild(full);
      slideMount.appendChild(wrapDone);
      return;
    }
    var board = document.createElement("div");
    board.className = "p5r-slidePuzzle__board";
    board.setAttribute("role", "group");
    board.style.aspectRatio = slideImgNaturalW + " / " + slideImgNaturalH;

    var idx;
    for (idx = 0; idx < 16; idx++) {
      var piece = slideState[idx];
      var el = document.createElement("div");
      el.className = "p5r-slidePuzzle__tile";
      el.setAttribute("data-slot", String(idx));
      if (piece === null) {
        el.classList.add("is-empty");
        el.setAttribute("aria-label", "空格，可将任意滑块拖入（相邻一步移动或远距离换位）");
        el.addEventListener("dragover", function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          el.classList.add("is-drop-target");
        });
        el.addEventListener("dragleave", function () {
          el.classList.remove("is-drop-target");
        });
        (function (emptySlot) {
          el.addEventListener("drop", function (e) {
            e.preventDefault();
            el.classList.remove("is-drop-target");
            var fromStr = e.dataTransfer.getData("text/plain");
            var from = fromStr !== "" ? Number(fromStr) : slideDragSlot;
            if (from === null || from === undefined || isNaN(from)) return;
            if (slideState[from] === null) return;
            if (slideState[emptySlot] !== null) return;
            if (slideTrySwapSlot(from)) {
              slideAfterMove();
              return;
            }
            if (slideTrySwapTwoSlots(from, emptySlot)) slideAfterMove();
          });
        })(idx);
      } else {
        el.setAttribute("data-piece", String(piece));
        el.setAttribute("role", "button");
        el.setAttribute("tabindex", "0");
        el.setAttribute("draggable", "true");
        el.setAttribute("aria-label", "拼图滑块，可拖到相邻空格或另一块上互换位置");
        (function (slot) {
          el.addEventListener("click", function () {
            if (slideTrySwapSlot(slot)) slideAfterMove();
          });
          el.addEventListener("keydown", function (ev) {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              if (slideTrySwapSlot(slot)) slideAfterMove();
            }
          });
          el.addEventListener("dragover", function (e) {
            var from = slideDragSlot;
            if (from === null || from === undefined || from === slot) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            el.classList.add("is-drop-target");
          });
          el.addEventListener("dragleave", function () {
            el.classList.remove("is-drop-target");
          });
          el.addEventListener("drop", function (e) {
            e.preventDefault();
            el.classList.remove("is-drop-target");
            var fromStr = e.dataTransfer.getData("text/plain");
            var from = fromStr !== "" ? Number(fromStr) : slideDragSlot;
            if (from === null || from === undefined || isNaN(from) || from === slot) return;
            if (slideState[from] === null) return;
            if (!slideTrySwapTwoSlots(from, slot)) return;
            slideAfterMove();
          });
          el.addEventListener("dragstart", function (e) {
            slideDragSlot = slot;
            e.dataTransfer.setData("text/plain", String(slot));
            e.dataTransfer.effectAllowed = "move";
            el.classList.add("is-dragging");
          });
          el.addEventListener("dragend", function () {
            el.classList.remove("is-dragging");
            slideDragSlot = null;
            slideClearDropHighlight(board);
          });
        })(idx);
      }
      board.appendChild(el);
    }

    board.addEventListener("dragleave", function (e) {
      if (e.target === board) slideClearDropHighlight(board);
    });

    slideMount.appendChild(board);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        slideApplySlices(board);
      });
    });
  }

  function slideRestart() {
    slideWon = false;
    slideShuffle();
    renderSlidePuzzle();
  }

  if (slideMount) {
    var slidePreload = new Image();
    var slidePuzzleBooted = false;
    function slideBootPuzzle() {
      if (slidePuzzleBooted) return;
      slidePuzzleBooted = true;
      slideImgNaturalW = slidePreload.naturalWidth || 1;
      slideImgNaturalH = slidePreload.naturalHeight || 1;
      slideRestart();
    }
    slidePreload.onload = slideBootPuzzle;
    slidePreload.onerror = slideBootPuzzle;
    slidePreload.src = SLIDE_PUZZLE_SRC;
    if (slidePreload.complete && slidePreload.naturalWidth) slideBootPuzzle();

    if (slideReset) {
      slideReset.addEventListener("click", slideRestart);
    }

    window.addEventListener(
      "resize",
      function () {
        if (slideWon || !slideMount) return;
        var b = slideMount.querySelector(".p5r-slidePuzzle__board:not(.p5r-slidePuzzle__board--done)");
        if (b) slideApplySlices(b);
      },
      { passive: true }
    );
  }

  // -----------------------
  // 人物介绍：图文切换（百科短引 + 链接）
  // 说明：短引来自百科原话（尽量短），其余用更长的摘要表达。
  // -----------------------
  function initBioModule() {
    var card = $("#p5rBioCard");
    if (!card) return;

    var avatar = $("#p5rBioAvatar");
    var nameEl = $("#p5rBioName");
    var quoteEl = $("#p5rBioQuote");
    var summaryEl = $("#p5rBioSummary");
    var eyesEl = $("#p5rBioEyes");

    var picker = $("#p5rBioPicker");
    var pickerTab = $("#p5rBioPickerTab");
    var pickerDrawer = $("#p5rBioPickerDrawer");
    var grid = $("#p5rBioGrid");
    var dropCtn = $("#p5rBioDrop");
    var genBtn = $("#p5rBioGenerate");
    if (!picker || !pickerTab || !pickerDrawer || !grid || !dropCtn || !genBtn) return;

    // 旧的全屏过场层已弃用（保留 DOM 不影响）：#p5rBioGenOverlay
    var genOverlay = $("#p5rBioGenOverlay");
    var genOverlayImg = $("#p5rBioGenOverlayImg");
    var reveal = $("#p5rBioReveal");
    var revealImg = $("#p5rBioRevealImg");

    var ROYAL_ROOT = (function () {
      var src = document.currentScript && document.currentScript.src;
      // characters.js 位于 code/player4/characters.js
      // 皇家p5r 位于项目根目录 /皇家p5r，因此这里应为 ../../皇家p5r（而不是 ../../../皇家p5r）
      if (src) return new URL("../../皇家p5r/", src).href;
      return new URL("../../../皇家p5r/", window.location.href).href;
    })();

    var bios = [
      {
        key: "ryuji",
        name: "坂本龙司",
        portrait: "ryuji.png",
        quote: "坂本龙司，游戏《女神异闻录5》中的角色。",
        summary:
          "**秀尽学园二年级生**。虽然言行举止看起来粗鲁，但本性**热血正直、重情重义**。因某起事件在校内被视为“问题学生”并遭排挤；与主人公相遇后，一同卷入异世界事件并逐渐成为**怪盗团的重要伙伴**。",
        eyes: "坂本龙司/眼神素材.png"
      },
      {
        key: "ann",
        name: "高卷杏",
        portrait: "ann.png",
        quote: "高卷杏，《女神异闻录5》及其衍生作品的主要角色之一。",
        summary:
          "**秀尽学园二年级生**。拥有**四分之一美国血统**，能说流利英语。因为外貌出众与模特工作等原因，在校园里容易被误解而与同学产生距离感。与主人公等人相遇后，逐渐走出孤立处境，并在一系列事件中成为**怪盗团的重要成员**。",
        eyes: "高卷杏/眼神素材.png"
      },
      {
        key: "futaba",
        name: "佐仓双叶",
        portrait: "futaba.png",
        quote: "佐仓双叶，游戏《女神异闻录5》中的角色。",
        summary:
          "比主人公小一岁的少女，拥有超出常人的计算能力与**天才般的编程技术**，但极不擅长与人交流。曾被卷入事件后长时间闭门不出。与主人公一行相遇后，在经历与内心相关的事件后逐渐走出阴影，并成为**怪盗团不可或缺的支援力量**。",
        eyes: "佐仓双叶/眼神界面.png"
      },
      {
        key: "akechi",
        name: "明智吾郎",
        portrait: "akechi.png",
        quote: "明智吾郎，游戏《女神异闻录5》及其衍生作品的角色。",
        summary:
          "高中三年级学生，以**“高中生侦探”**的身份活跃于电视访谈节目，被称为**“侦探王子再临”**，在公众与学生群体中人气很高。作为侦探参与对**怪盗团**相关事件的调查，并在与主人公等人的多次接触与推理中扮演**重要角色**。",
        eyes: "明智吾郎/眼神素材.png"
      },
      {
        key: "makoto",
        name: "新岛真",
        portrait: "makoto.png",
        quote: "秀尽学园的三年级生。头脑聪慧，品行端正，担任学生会长。",
        summary:
          "**秀尽学园三年级生**，**学生会长**。性格冷静沉着、责任感强，也有做事认真不轻易妥协的一面。与**怪盗团**相关事件产生交集后，在多方压力与现实矛盾中做出选择，并在后续行动中成为**团队重要成员**。",
        eyes: "新岛真/眼神素材.png"
      },
      {
        key: "haru",
        name: "奥村春",
        portrait: "haru.png",
        quote: "秀尽学园高中3年级学生。大型食品公司的社长的千金。",
        summary:
          "**秀尽学园三年级学生**。成长于**富裕家庭**，气质高雅，待人礼貌温和，能够与人友好交流，但也会在一些地方刻意与他人保持距离。与**怪盗团**的行动产生交集后，逐渐展现出**更坚定的一面**。",
        eyes: "奥春村/背景素材 (1).png"
      }
    ];

    function safeText(el, text) {
      if (el) el.textContent = text || "";
    }

    function escapeHtml(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
    }

    /** 摘要内 **关键词** → <strong>，其余转义 */
    function formatSummaryInline(s) {
      var chunks = String(s).split("**");
      var html = "";
      for (var i = 0; i < chunks.length; i++) {
        if (i % 2 === 0) {
          html += escapeHtml(chunks[i]);
        } else {
          html +=
            '<strong class="p5r-bioCard__summaryStrong">' +
            escapeHtml(chunks[i]) +
            "</strong>";
        }
      }
      return html;
    }

    function renderSummaryHtml(text) {
      var t = String(text || "").trim();
      if (!t) return "";

      // 以句号切分，4 句为一段（末段不足 4 句也单独成段）
      var parts = t.split("。").map(function (x) { return x.trim(); }).filter(Boolean);
      if (!parts.length) return "<p>" + formatSummaryInline(t) + "</p>";

      var perPara = 4;
      var out = [];
      for (var i = 0; i < parts.length; i += perPara) {
        var chunks = [];
        for (var j = 0; j < perPara && i + j < parts.length; j++) {
          chunks.push(parts[i + j]);
        }
        var seg = chunks.join("。");
        var para = seg + "。";
        para = para.replace(/。。+$/g, "。");
        out.push("<p>" + formatSummaryInline(para) + "</p>");
      }
      return out.join("");
    }

    var currentKey = bios[0] && bios[0].key;
    var droppedKey = null;
    var revealGenSeq = 0;
    var REVEAL_LAYER_FADE_MS = 1800;
    var REVEAL_HOLD_MS = 3000;
    var REVEAL_ENTER_DELAY_MS = 280;
    // 在「展示」阶段的中段切换人物介绍（保证淡去开始时已是新人物）
    var REVEAL_SWAP_AT_MS = Math.floor(REVEAL_HOLD_MS * 0.55);

    function getBioByKey(key) {
      for (var i = 0; i < bios.length; i++) {
        if (bios[i].key === key) return bios[i];
      }
      return bios[0];
    }

    function setEyes(src, onReady) {
      if (!eyesEl) return;
      eyesEl.classList.remove("is-on");
      var next = new Image();
      next.onload = function () {
        eyesEl.src = src || "";
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            eyesEl.classList.add("is-on");
            onReady && onReady();
          });
        });
      };
      next.onerror = function () {
        eyesEl.src = src || "";
        eyesEl.classList.add("is-on");
        onReady && onReady();
      };
      next.src = src || "";
    }

    function renderBioNameStagger(name) {
      var track = $("#p5rBioNameTrack");
      if (!track) return;
      track.innerHTML = "";
      var chars = Array.from(name || "");
      for (var i = 0; i < chars.length; i++) {
        var span = document.createElement("span");
        span.className = "p5r-staggerTitle__ch";
        if (chars.length >= 2 && i === 1) span.classList.add("p5r-staggerTitle__ch--invert");
        span.textContent = chars[i];
        track.appendChild(span);
      }
      $all("#p5rBioNameTrack .p5r-staggerTitle__ch").forEach(function (el) {
        var rot = Math.random() * 14 - 7;
        var skew = Math.random() * 8 - 4;
        el.style.transform = "rotate(" + rot.toFixed(1) + "deg) skewX(" + skew.toFixed(1) + "deg)";
      });
    }

    function clearBioCard() {
      card.classList.add("p5r-bioCard--empty");
      card.classList.remove("is-frostedFinal");
      if (nameEl) {
        nameEl.innerHTML =
          '<span class="p5r-staggerTitle__track" id="p5rBioNameTrack"></span>';
      }
      safeText(quoteEl, "");
      if (summaryEl) summaryEl.innerHTML = "";
      if (avatar) {
        avatar.removeAttribute("src");
        avatar.alt = "";
      }
      if (eyesEl) {
        eyesEl.removeAttribute("src");
        eyesEl.classList.remove("is-on");
      }
      if (reveal) reveal.classList.remove("is-on");
      if (reveal) reveal.classList.remove("p5r-bioCard__reveal--eyesHaru");
      if (revealImg) revealImg.src = "";
      card.classList.remove("p5r-bioCard--eyesHaru");
      card.classList.remove("is-frosted");
      genBtn.disabled = true;
      genBtn.textContent = "生成介绍";
      dropCtn.classList.add("p5r-bioDrop--inactive");
      genBtn.setAttribute("aria-hidden", "true");
    }

    function renderBio(key) {
      var bio = null;
      bio = getBioByKey(key);
      currentKey = bio.key;

      card.classList.remove("p5r-bioCard--empty");
      card.classList.toggle("p5r-bioCard--eyesHaru", bio.key === "haru");
      genBtn.disabled = false;
      genBtn.textContent = "重新生成";
      dropCtn.classList.remove("p5r-bioDrop--inactive");
      genBtn.setAttribute("aria-hidden", "false");

      if (avatar) {
        avatar.src = ASSET_ROOT + "portraits/" + bio.portrait;
        avatar.alt = bio.name + "头像";
      }
      renderBioNameStagger(bio.name);
      safeText(quoteEl, "“" + bio.quote + "”");
      if (summaryEl) summaryEl.innerHTML = renderSummaryHtml(bio.summary);
    }

    function playGenerateReveal(src, onShownCb, onSwapCb, canFadeOut) {
      // 只遮住人物介绍卡片，不全屏
      // 关键约束：
      // - 文案/头像等必须在遮罩淡出并解除磨砂后再写入，避免先闪字
      // - 背景眼神应在过场中途就切到“新人物”，确保过场结束时不会仍显示旧人物
      if (!reveal || !revealImg) {
        onShownCb && onShownCb();
        onSwapCb && onSwapCb();
        return;
      }
      var mySeq = ++revealGenSeq;
      reveal.classList.remove("is-on");
      void reveal.offsetWidth;

      function scheduleUnfrost() {
        window.setTimeout(function () {
          if (mySeq !== revealGenSeq) return;
          card.classList.remove("is-frosted");
          card.classList.add("is-frostedFinal");
        }, REVEAL_LAYER_FADE_MS + 120);
      }

      var next = new Image();
      next.onload = function () {
        if (mySeq !== revealGenSeq) return;
        revealImg.src = src || "";
        window.setTimeout(function () {
          if (mySeq !== revealGenSeq) return;
          reveal.classList.add("is-on");
          card.classList.add("is-frosted");
          // 底层模糊眼神不在此阶段切换，与人物介绍一起在 onSwapCb 中切换（见 runGenerate）
          onShownCb && onShownCb();

          // 展示阶段中段：完成「人物介绍」切换（要求：淡去时已经是新的）
          window.setTimeout(function () {
            if (mySeq !== revealGenSeq) return;
            onSwapCb && onSwapCb();
          }, REVEAL_SWAP_AT_MS);

          window.setTimeout(function () {
            if (mySeq !== revealGenSeq) return;
            // 只有当背景已切到新人物后，才开始淡出遮罩；
            // 这样不会出现“眼神淡去了但背景还没切过去”的空窗。
            if (canFadeOut && !canFadeOut()) {
              var waitStart = Date.now();
              (function waitBg() {
                if (mySeq !== revealGenSeq) return;
                if (!canFadeOut || canFadeOut() || Date.now() - waitStart > 2500) {
                  reveal.classList.remove("is-on");
                  scheduleUnfrost();
                  return;
                }
                window.setTimeout(waitBg, 80);
              })();
              return;
            }
            reveal.classList.remove("is-on");
            scheduleUnfrost();
          }, REVEAL_HOLD_MS);
        }, REVEAL_ENTER_DELAY_MS);
      };
      next.onerror = function () {
        if (mySeq !== revealGenSeq) return;
        card.classList.add("is-frosted");
        window.setTimeout(function () {
          if (mySeq !== revealGenSeq) return;
          card.classList.remove("is-frosted");
          onShownCb && onShownCb();
          onSwapCb && onSwapCb();
        }, 500);
      };
      next.src = src || "";
    }

    function setDroppedKey(key) {
      var bio = getBioByKey(key);
      droppedKey = bio.key;
    }

    function runGenerate() {
      if (!droppedKey) return;
      var key = droppedKey;
      var bio = getBioByKey(key);
      var src = bio && bio.eyes ? ROYAL_ROOT + bio.eyes : "";

      // 奥村春：过场层从一开始就需要同样的构图偏移，避免过场眼神与后续背景对不齐
      if (reveal) reveal.classList.toggle("p5r-bioCard__reveal--eyesHaru", key === "haru");

      var bgReady = false;
      var wantsSwap = false;
      var swapped = false;
      function swapIfReady() {
        if (!wantsSwap || swapped) return;
        if (!bgReady) return;
        swapped = true;
        renderBio(key);
      }

      playGenerateReveal(
        src,
        function () {
          // 第一阶段：仅过场层渐入，底层模糊眼神保持旧人物，避免“眼神刚出现背景已换”
          if (!src) {
            bgReady = true;
          }
        },
        function () {
          // 眼神展示阶段中段：底层背景眼神与人物介绍同时切换
          wantsSwap = true;
          if (!src) {
            swapIfReady();
            return;
          }
          setEyes(src, function () {
            bgReady = true;
            swapIfReady();
          });
        },
        function () {
          // 淡去开始前必须满足：背景已切 + 人物介绍已切
          return bgReady && swapped;
        }
      );
    }

    function buildPickerGrid() {
      grid.innerHTML = "";
      bios.forEach(function (bio) {
        var item = document.createElement("div");
        item.className = "p5r-bioPickItem";
        item.setAttribute("data-key", bio.key);
        item.setAttribute("draggable", "true");
        item.setAttribute("aria-label", bio.name);

        var img = document.createElement("img");
        img.className = "p5r-bioPickItem__img";
        img.src = ASSET_ROOT + "portraits/" + bio.portrait;
        img.alt = bio.name + "头像";

        item.appendChild(img);

        item.addEventListener("dragstart", function (e) {
          e.dataTransfer.setData("text/plain", bio.key);
          e.dataTransfer.effectAllowed = "move";
        });

        grid.appendChild(item);
      });
    }

    function togglePicker(forceOpen) {
      var open = typeof forceOpen === "boolean" ? forceOpen : !picker.classList.contains("is-open");
      picker.classList.toggle("is-open", open);
      pickerTab.setAttribute("aria-expanded", open ? "true" : "false");
      pickerDrawer.hidden = !open;
    }

    pickerTab.addEventListener("click", function () {
      togglePicker();
    });

    function onBioDragOver(e) {
      e.preventDefault();
      card.classList.add("is-dropOver");
      e.dataTransfer.dropEffect = "move";
    }
    function onBioDragLeave(e) {
      // 移动到卡片内部子元素时不取消高亮
      if (card.contains(e.relatedTarget)) return;
      card.classList.remove("is-dropOver");
    }
    function onBioDrop(e) {
      e.preventDefault();
      card.classList.remove("is-dropOver");
      var key = e.dataTransfer.getData("text/plain");
      if (!key) return;
      setDroppedKey(key);
      togglePicker(false);
      runGenerate();
    }

    // 拖放目标 = 人物介绍卡片（生成区域）
    card.addEventListener("dragover", onBioDragOver);
    card.addEventListener("dragleave", onBioDragLeave);
    card.addEventListener("drop", onBioDrop);

    // 兼容：按钮区域也可接收（不要求用户精准拖到卡片）
    dropCtn.addEventListener("dragover", onBioDragOver);
    dropCtn.addEventListener("dragleave", onBioDragLeave);
    dropCtn.addEventListener("drop", onBioDrop);

    genBtn.addEventListener("click", function () {
      runGenerate();
    });

    buildPickerGrid();
    clearBioCard();
  }
  initBioModule();

  /** 标题逐字轻微随机倾角（rotate + skewX），每次加载不同 */
  function applyStaggerTitleTilts() {
    $all(".p5r-staggerTitle__ch").forEach(function (el) {
      var rot = Math.random() * 14 - 7;
      var skew = Math.random() * 8 - 4;
      el.style.transform =
        "rotate(" + rot.toFixed(1) + "deg) skewX(" + skew.toFixed(1) + "deg)";
    });
  }
  applyStaggerTitleTilts();
})();

