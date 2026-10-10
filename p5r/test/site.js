(function () {
  "use strict";

  var ASSET_ROOT = "../shared/p5ui/assets/src-assets/images/";

  // -----------------------
  // Hash 路由：显示/隐藏页面
  // -----------------------
  function $(sel) {
    return document.querySelector(sel);
  }
  function $all(sel) {
    return Array.prototype.slice.call(document.querySelectorAll(sel));
  }

  var routeButtons = $all("[data-route]");
  function setActivePage(route) {
    var pages = $all(".site-page");
    pages.forEach(function (p) {
      p.classList.remove("is-active");
    });

    var target = route ? "#page-" + route : "#page-home";
    var el = $(target);
    if (el) el.classList.add("is-active");
  }

  routeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var r = btn.getAttribute("data-route");
      location.hash = r ? ("#" + r) : "";
    });
  });

  function syncRouteFromHash() {
    var hash = (location.hash || "").replace("#", "").trim();
    if (!hash) hash = "home";
    // home/login/contact -> 对应 page-home/page-login/page-contact
    setActivePage(hash);
  }

  window.addEventListener("hashchange", syncRouteFromHash);
  syncRouteFromHash();

  // 左侧导航：页内锚点滚动（data-scroll-to，不改 hash 路由）
  $all("[data-scroll-to]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var id = a.getAttribute("data-scroll-to");
      var el = document.getElementById(id);
      if (el) {
        setActivePage("home");
        setTimeout(function () { el.scrollIntoView({ behavior: "smooth" }); }, 50);
      }
    });
  });

  // 返回按钮（表单内 data-back）
  $all("[data-back]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var r = btn.getAttribute("data-back") || "home";
      location.hash = r ? ("#" + r) : "#home";
    });
  });

  // -----------------------
  // Banner 图片切换（右下角 1~4 指示器）
  // -----------------------
  var bannerImg = $("#bannerImg");
  var indicatorsHost = $("#bannerIndicators");

  // 确保素材都在你 shared/p5ui/assets/examples/images 里
  var bannerImages = [
    "../shared/p5ui/assets/examples/images/bg.png",
    "../shared/p5ui/assets/examples/images/bg1.png",
    "../shared/p5ui/assets/examples/images/menu_bg.png",
    "../shared/p5ui/assets/examples/images/h_top.png"
  ];

  var bannerIndex = 0;
  var bannerTimer = null;

  function renderIndicators() {
    if (!indicatorsHost) return;
    indicatorsHost.innerHTML = "";
    for (var i = 0; i < bannerImages.length; i++) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "site-bannerDot";
      b.textContent = String(i + 1);
      b.setAttribute("data-i", String(i));
      indicatorsHost.appendChild(b);
    }
    $all(".site-bannerDot").forEach(function (dot) {
      dot.addEventListener("click", function () {
        var i = Number(dot.getAttribute("data-i"));
        setBanner(i, true);
      });
    });
  }

  function setIndicatorsActive(i) {
    $all(".site-bannerDot").forEach(function (dot) {
      var di = Number(dot.getAttribute("data-i"));
      dot.classList.toggle("is-active", di === i);
    });
  }

  function setBanner(i, resetTimer) {
    bannerIndex = i;
    if (bannerImg) {
      bannerImg.style.opacity = "0";
      setTimeout(function () {
        if (bannerImg) bannerImg.src = bannerImages[bannerIndex % bannerImages.length];
        if (bannerImg) bannerImg.style.opacity = "1";
      }, 120);
    }
    setIndicatorsActive(bannerIndex);
    if (resetTimer) startBanner();
  }

  function startBanner() {
    stopBanner();
    bannerTimer = setInterval(function () {
      setBanner((bannerIndex + 1) % bannerImages.length, false);
    }, 4200);
  }

  function stopBanner() {
    if (bannerTimer) clearInterval(bannerTimer);
    bannerTimer = null;
  }

  if (bannerImg) {
    renderIndicators();
    setBanner(0, false);
    startBanner();
    var banner = bannerImg.closest(".site-banner");
    if (banner) {
      banner.addEventListener("mouseenter", stopBanner);
      banner.addEventListener("mouseleave", startBanner);
    }
  }

  // -----------------------
  // 用户状态（localStorage）
  // -----------------------
  var userNameEl = $("#userName");
  var logoutBtn = $("#logoutBtn");
  function getStoredUser() {
    return localStorage.getItem("p5_username") || "";
  }
  function setStoredUser(name) {
    if (!name) localStorage.removeItem("p5_username");
    else localStorage.setItem("p5_username", name);
  }
  function syncUserUI() {
    var u = getStoredUser();
    if (userNameEl) userNameEl.textContent = u || "未登录";
  }
  syncUserUI();

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      setStoredUser("");
      syncUserUI();
      setActivePage("home");
    });
  }

  // -----------------------
  // 表单校验（登录/联系我们）
  // -----------------------
  function showAlert(alertEl, msg) {
    if (!alertEl) return;
    alertEl.textContent = msg;
    alertEl.hidden = false;
  }
  function clearAlert(alertEl) {
    if (!alertEl) return;
    alertEl.textContent = "";
    alertEl.hidden = true;
  }
  function isEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
  }

  var loginForm = $("#loginForm");
  var contactForm = $("#contactForm");
  var formAlert = $("#formAlert");
  var formAlert2 = $("#formAlert2");

  function handleLoginSubmit(e) {
    e.preventDefault();
    clearAlert(formAlert);

    var fd = new FormData(loginForm);
    var username = String(fd.get("username") || "").trim();
    var email = String(fd.get("email") || "").trim();
    var password = String(fd.get("password") || "");

    if (!username) return showAlert(formAlert, "用户名不能为空。");
    if (!isEmail(email)) return showAlert(formAlert, "邮箱格式不正确。");
    if (password.length < 6) return showAlert(formAlert, "密码长度至少 6 位。");

    setStoredUser(username);
    syncUserUI();
    location.hash = "home";
    // 简单提示：直接把 alert 置空并切页
    clearAlert(formAlert);
  }
  if (loginForm) loginForm.addEventListener("submit", handleLoginSubmit);

  function handleContactSubmit(e) {
    e.preventDefault();
    clearAlert(formAlert2);

    var fd = new FormData(contactForm);
    var name = String(fd.get("name") || "").trim();
    var email = String(fd.get("email") || "").trim();
    var message = String(fd.get("message") || "").trim();

    if (!name) return showAlert(formAlert2, "姓名不能为空。");
    if (!isEmail(email)) return showAlert(formAlert2, "邮箱格式不正确。");
    if (!message) return showAlert(formAlert2, "留言不能为空。");

    // 成功后给出“提交成功”的客观反馈（不依赖弹窗库）
    showAlert(formAlert2, "提交成功（演示：不发送到服务器）。");
    setTimeout(function () {
      clearAlert(formAlert2);
    }, 2400);
  }
  if (contactForm) contactForm.addEventListener("submit", handleContactSubmit);

  // -----------------------
  // Canvas 绘制文本
  // -----------------------
  var drawCanvas = $("#drawCanvas");
  var drawBtn = $("#drawBtn");
  var clearCanvasBtn = $("#clearCanvasBtn");
  var drawText = $("#drawText");
  var drawColor = $("#drawColor");

  function drawTextOnCanvas() {
    if (!drawCanvas) return;
    var ctx = drawCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);

    // 背景块（让绘制区域更像“画框”）
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);

    var txt = String(drawText && drawText.value ? drawText.value : "").trim() || "HEIST";
    var color = String(drawColor && drawColor.value ? drawColor.value : "#ffffff");

    ctx.save();
    ctx.translate(drawCanvas.width / 2, drawCanvas.height / 2);
    ctx.rotate((-10 + Math.random() * 20) * Math.PI / 180);

    ctx.font = "900 34px '阿里妈妈数黑体 Bold', ui-sans-serif, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = color;

    // 简单描边模拟（比 p5-text 更清晰）
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(0,0,0,0.8)";
    ctx.strokeText(txt, 0, 0);
    ctx.fillText(txt, 0, 0);

    ctx.restore();
  }

  if (drawBtn) drawBtn.addEventListener("click", drawTextOnCanvas);
  if (clearCanvasBtn) {
    clearCanvasBtn.addEventListener("click", function () {
      if (!drawCanvas) return;
      var ctx = drawCanvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
    });
  }

  // -----------------------
  // 拖放（drag & drop）
  // -----------------------
  var dragItemsHost = $("#dragItems");
  var dropCart = $("#dropCart");
  var cartCountEl = $("#cartCount");
  var cartClearBtn = $("#cartClearBtn");

  var cartItems = [];
  var draggablePool = [
    {
      id: "mona",
      title: "mona",
      img: "../shared/p5ui/assets/src-assets/images/portraits/mona.png"
    },
    {
      id: "ann",
      title: "ann",
      img: "../shared/p5ui/assets/src-assets/images/portraits/ann.png"
    },
    {
      id: "ryuji",
      title: "ryuji",
      img: "../shared/p5ui/assets/src-assets/images/portraits/ryuji.png"
    },
    {
      id: "akechi",
      title: "akechi",
      img: "../shared/p5ui/assets/src-assets/images/portraits/akechi.png"
    }
  ];

  function renderDraggables() {
    if (!dragItemsHost) return;
    dragItemsHost.innerHTML = "";
    draggablePool.forEach(function (it) {
      var card = document.createElement("div");
      card.className = "site-draggable";
      card.setAttribute("draggable", "true");
      card.setAttribute("data-id", it.id);
      card.innerHTML =
        '<img src="' +
        it.img +
        '" alt=""/><div class="site-plainSmall site-showplain">' +
        it.title +
        "</div>";
      card.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", it.id);
        e.dataTransfer.effectAllowed = "copy";
      });
      dragItemsHost.appendChild(card);
    });
  }

  function updateCartUI() {
    if (!dropCart) return;
    dropCart.innerHTML = "";
    cartItems.forEach(function (cid, idx) {
      var it = draggablePool.find(function (x) {
        return x.id === cid;
      });
      var item = document.createElement("div");
      item.className = "site-cartItem";
      if (it) {
        item.innerHTML =
          '<img src="' +
          it.img +
          '" alt=""/><div class="site-cartInfo"><div class="site-cartMeta">item: ' +
          it.title +
          '</div></div><button class="site-cartRemove" type="button" aria-label="删除">删</button>';
      } else {
        item.innerHTML =
          "<div class='site-cartInfo'><div class='site-cartMeta'>item</div></div><button class='site-cartRemove' type='button' aria-label='删除'>删</button>";
      }
      item.setAttribute("data-idx", String(idx));
      var rm = item.querySelector(".site-cartRemove");
      if (rm) {
        rm.addEventListener("click", function (e) {
          e.preventDefault();
          var i = Number(item.getAttribute("data-idx"));
          if (!isFinite(i)) return;
          cartItems.splice(i, 1);
          updateCartUI();
        });
      }
      dropCart.appendChild(item);
    });
    if (cartCountEl) cartCountEl.textContent = String(cartItems.length);
  }

  if (dropCart) {
    dropCart.addEventListener("dragover", function (e) {
      e.preventDefault();
      dropCart.classList.add("is-over");
      e.dataTransfer.dropEffect = "copy";
    });
    dropCart.addEventListener("dragleave", function () {
      dropCart.classList.remove("is-over");
    });
    dropCart.addEventListener("drop", function (e) {
      e.preventDefault();
      dropCart.classList.remove("is-over");
      var id = e.dataTransfer.getData("text/plain");
      if (!id) return;
      cartItems.push(id);
      updateCartUI();
    });
  }

  if (cartClearBtn) {
    cartClearBtn.addEventListener("click", function () {
      cartItems.length = 0;
      updateCartUI();
    });
  }

  renderDraggables();
  updateCartUI();

  // -----------------------
  // 分页（分页显示）
  // -----------------------
  var pageList = $("#pageList");
  var pager = $("#pager");
  var pageData = [];
  for (var k = 1; k <= 38; k++) {
    pageData.push({ id: k, label: "Item " + k });
  }

  var pageSize = 8;
  var pageCount = Math.ceil(pageData.length / pageSize);
  var currentPage = 1;

  function renderPage() {
    if (!pageList) return;
    pageList.innerHTML = "";

    var start = (currentPage - 1) * pageSize;
    var slice = pageData.slice(start, start + pageSize);

    slice.forEach(function (it) {
      var row = document.createElement("div");
      row.className = "site-item";
      row.innerHTML = "<b>" + it.label + "</b><span class='site-pill'>#" + it.id + "</span>";
      pageList.appendChild(row);
    });

    if (pager) {
      pager.innerHTML = "";
      var prev = document.createElement("button");
      prev.type = "button";
      prev.className = "site-pageBtn";
      prev.textContent = "上一页";
      prev.disabled = currentPage === 1;
      prev.addEventListener("click", function () {
        if (currentPage > 1) {
          currentPage--;
          renderPage();
        }
      });
      pager.appendChild(prev);

      // 页码（只显示前后各 2 个，避免太多）
      var left = Math.max(1, currentPage - 2);
      var right = Math.min(pageCount, currentPage + 2);
      for (var i = left; i <= right; i++) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "site-pageBtn" + (i === currentPage ? " is-active" : "");
        btn.textContent = String(i);
        btn.addEventListener(
          "click",
          (function (pi) {
            return function () {
              currentPage = pi;
              renderPage();
            };
          })(i)
        );
        pager.appendChild(btn);
      }

      var next = document.createElement("button");
      next.type = "button";
      next.className = "site-pageBtn";
      next.textContent = "下一页";
      next.disabled = currentPage === pageCount;
      next.addEventListener("click", function () {
        if (currentPage < pageCount) {
          currentPage++;
          renderPage();
        }
      });
      pager.appendChild(next);
    }
  }

  renderPage();

  // -----------------------
  // 场景切换（点击同步背景纹理）
  // -----------------------
  var sceneBtns = $all(".site-sceneBtn");
  var hero = $(".site-hero");
  function applyScene(scene) {
    // 统一控制：修改 banner 图片与 hero 背景（只做“素材切换”的效果）
    var map = {
      menu: "../shared/p5ui/assets/examples/images/menu_bg.png",
      bg1: "../shared/p5ui/assets/examples/images/bg1.png",
      bg: "../shared/p5ui/assets/examples/images/bg.png"
    };
    var img = map[scene] || map.menu;
    if (bannerImg) {
      bannerImg.src = img;
    }
    // 让画面更“换场”，用轻微过渡
    if (hero) {
      hero.style.filter = "saturate(1.2) contrast(1.1)";
      setTimeout(function () {
        if (hero) hero.style.filter = "";
      }, 320);
    }
  }
  sceneBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      applyScene(b.getAttribute("data-scene"));
    });
  });

  // 防止首页初始切换时覆盖 banner：场景按钮不自动触发

  // -----------------------
  // p5-ui 组件：Switch / Upload / Notification / Message / BackTop
  // -----------------------

  // Switch：点击容器切换（匹配 data-p5-switch）
  $all("[data-p5-switch]").forEach(function (wrap) {
    var input = wrap.querySelector('input[type="checkbox"]');
    var bg = wrap.querySelector(".p5-switch-bg");
    if (!input || !bg) return;
    function sync() {
      wrap.classList.remove("p5-switch-on", "p5-switch-off");
      wrap.classList.add(input.checked ? "p5-switch-on" : "p5-switch-off");
      bg.classList.toggle("p5-switch-bg-move", input.checked);
    }
    wrap.addEventListener("click", function (e) {
      if (e.target === input) return;
      input.checked = !input.checked;
      sync();
    });
    input.addEventListener("change", sync);
    sync();
  });

  // Upload：预览/删除/放大（绑定所有 .p5-upload-ctn）
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

  // Notification：多条堆叠 + 可关闭
  var notiHost = $("#p5NotiHost");
  var notiTpl = $("#p5NotiTpl");
  var btnNoti = $("#btnShowNoti");

  function closeNoti(el) {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateX(-8px)";
    setTimeout(function () {
      if (el && el.parentNode) el.remove();
    }, 180);
  }

  function showNoti(text, opts) {
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

    // 关闭按钮
    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "site-notiClose";
    closeBtn.setAttribute("aria-label", "关闭通知");
    closeBtn.textContent = "×";
    closeBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeNoti(el);
    });
    el.appendChild(closeBtn);

    // 进入动画
    el.style.opacity = "0";
    el.style.transform = "translateX(-10px)";
    notiHost.appendChild(el);
    requestAnimationFrame(function () {
      el.style.transition = "opacity .18s ease, transform .18s ease";
      el.style.opacity = "1";
      el.style.transform = "translateX(0)";
    });

    // 自动消失
    if (ttl > 0) {
      setTimeout(function () {
        closeNoti(el);
      }, ttl);
    }
  }

  if (btnNoti && notiHost && notiTpl) {
    var notiSeq = 0;
    var notiPortraits = [
      { title: "JOKER", src: ASSET_ROOT + "portraits/ryuji.png" },
      { title: "ANN", src: ASSET_ROOT + "portraits/ann.png" },
      { title: "MAKOTO", src: ASSET_ROOT + "portraits/makoto.png" },
      { title: "FUTABA", src: ASSET_ROOT + "portraits/futaba.png" },
      { title: "YUSUKE", src: ASSET_ROOT + "portraits/yusuke.png" },
      { title: "HARU", src: ASSET_ROOT + "portraits/haru.png" },
      { title: "MONA", src: ASSET_ROOT + "portraits/mona.png" }
    ];
    var notiDialog = ASSET_ROOT + "notification.png";
    btnNoti.addEventListener("click", function () {
      notiSeq += 1;
      var p = notiPortraits[notiSeq % notiPortraits.length];
      showNoti("通知 #" + notiSeq + "：头像会切换，可堆叠、可关闭。", {
        ttl: 3600,
        title: p.title,
        portraitSrc: p.src,
        dialogSrc: notiDialog
      });
    });
  }

  // Message：插入 DOM + 淡出
  var msgHost = $("#p5MsgHost");
  var btnMsgDefault = $("#btnShowMsgDefault");
  var btnMsgClear = $("#btnShowMsgClear");
  var btnMsgFail = $("#btnShowMsgFail");

  function showMsg(kind) {
    if (!msgHost) return;
    var k = String(kind || "default").toLowerCase();
    var map = {
      default: ASSET_ROOT + "msg/default.png",
      clear: ASSET_ROOT + "msg/clear.png",
      fail: ASSET_ROOT + "msg/fail.png"
    };
    var src = map[k] || map.default;

    var el = document.createElement("div");
    el.className = "p5-msg-ctn";
    el.style.top = "140px";
    el.innerHTML =
      '<div class="p5-msg-sub-ctn" style="opacity:1">' +
      '<img class="p5-msg-img" src="' +
      src +
      '" alt="">' +
      '<img class="p5-sword-img p5-sword-animation" src="' +
      ASSET_ROOT +
      'sword.png" alt="">' +
      "</div>";
    msgHost.appendChild(el);
    var sub = el.querySelector(".p5-msg-sub-ctn");
    setTimeout(function () {
      if (sub) sub.style.opacity = "0";
    }, 2200);
    setTimeout(function () {
      el.remove();
    }, 3400);
  }

  // 暴露给说明文档/控制台复用
  window.showMsg = showMsg;

  if (btnMsgDefault) btnMsgDefault.addEventListener("click", function () { showMsg("default"); });
  if (btnMsgClear) btnMsgClear.addEventListener("click", function () { showMsg("clear"); });
  if (btnMsgFail) btnMsgFail.addEventListener("click", function () { showMsg("fail"); });

  // BackTop：滚动出现 + 回顶
  var backTop = $("#p5BackTop");
  function getDocumentScrollY() {
    var se = document.scrollingElement || document.documentElement;
    return (
      window.scrollY ||
      window.pageYOffset ||
      (se && se.scrollTop) ||
      document.body.scrollTop ||
      0
    );
  }
  function syncBackTop() {
    if (!backTop) return;
    backTop.hidden = getDocumentScrollY() < 260;
  }
  if (backTop) {
    window.addEventListener("scroll", syncBackTop, { passive: true });
    syncBackTop();
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();

