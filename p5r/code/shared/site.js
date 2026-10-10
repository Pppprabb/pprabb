(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  // -----------------------
  // 简易“状态存储”（原型用）
  // -----------------------
  var KEY_USER = "p5_proto_user";
  var KEY_READ = "p5_proto_bulletin_read";

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem(KEY_USER) || "null");
    } catch (e) {
      return null;
    }
  }
  function setUser(u) {
    if (!u) localStorage.removeItem(KEY_USER);
    else localStorage.setItem(KEY_USER, JSON.stringify(u));
  }
  function getReadMap() {
    try {
      return JSON.parse(localStorage.getItem(KEY_READ) || "{}") || {};
    } catch (e) {
      return {};
    }
  }
  function setReadMap(m) {
    localStorage.setItem(KEY_READ, JSON.stringify(m || {}));
  }

  function syncHeaderUser() {
    var el = $("#headerUser");
    var btn = $("#headerLogout");
    if (!el) return;
    var u = getUser();
    el.textContent = u && u.name ? "用户：" + u.name : "未登录（原型）";
    // 头像入口已移除：用用户名（或页面里的“个人中心”按钮）进入个人主页
    el.style.cursor = "pointer";
    el.onclick = function () {
      location.href = new URL("../../player4/pages/profile.html", location.href).href;
    };
    if (btn) {
      btn.hidden = !(u && u.name);
      btn.onclick = function () {
        setUser(null);
        syncHeaderUser();
        syncP4rCharacterHeader();
        toastNoti("已退出登录（原型）", { portrait: "mona" });
        location.href = new URL("../../player2/pages/login.html", location.href).href;
      };
    }
  }

  // -----------------------
  // P5R 风格通知（可堆叠、可关闭、头像轮换）
  // 资源根：与 player4/characters.js 一致，按 site.js 所在目录解析，避免登录等子页用 location 算成 player2/shared 导致图片 404
  // -----------------------
  var ASSET_ROOT = (function () {
    var src = typeof document !== "undefined" && document.currentScript && document.currentScript.src;
    if (src) {
      try {
        return new URL("../../shared/p5ui/assets/src-assets/images/", src).href;
      } catch (e) {
        /* fall through */
      }
    }
    try {
      return new URL("../../../shared/p5ui/assets/src-assets/images/", location.href).href;
    } catch (e2) {
      return "";
    }
  })();
  var notiHost = null;

  function ensureNotiHost() {
    var existing = $("#p5NotiHost");
    if (existing) {
      notiHost = existing;
      return existing;
    }
    if (notiHost) return notiHost;
    notiHost = document.createElement("div");
    notiHost.className = "site-notiHost";
    notiHost.id = "notiHost";
    document.body.appendChild(notiHost);
    return notiHost;
  }

  var portraits = [
    "akechi",
    "ann",
    "futaba",
    "haru",
    "makoto",
    "mona",
    "ryuji",
    "yusuke"
  ];
  var portraitSeq = 0;

  function portraitSrc(name) {
    return ASSET_ROOT + "portraits/" + name + ".png";
  }

  /** 人物区等顶栏：仅同步用户名（游客 / 已登录名）；头像固定为各页 HTML，与个人主页一致，不用 mona 立绘替换 */
  function syncP4rCharacterHeader() {
    var nameEl = $("#p5rHeaderUserName");
    if (!nameEl) return;
    var u = getUser();
    nameEl.textContent = u && u.name ? u.name : "游客";
    nameEl.style.cursor = "pointer";
    nameEl.onclick = function () {
      location.href = new URL("../../player4/pages/profile.html", location.href).href;
    };
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toastNotiCloseEl(el, bottomQuarter) {
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = bottomQuarter ? "translate(-50%, 20px)" : "translateX(-8px)";
    setTimeout(function () {
      if (el && el.parentNode) el.remove();
    }, 180);
  }

  function toastNoti(text, opts) {
    opts = opts || {};
    var host = ensureNotiHost();
    var tpl = $("#p5NotiTpl");
    var ttl = typeof opts.ttl === "number" ? opts.ttl : 3200;
    var bottomQuarter = !!opts.bottomQuarter;

    var who = opts.portrait;
    if (!who) {
      portraitSeq += 1;
      who = portraits[portraitSeq % portraits.length];
    }

    var titleText = opts.title || who.toUpperCase();
    var bodyText = text || "通知";

    var el;
    if (tpl && tpl.cloneNode) {
      el = tpl.cloneNode(true);
      el.removeAttribute("id");
      el.removeAttribute("style");
      el.style.display = "block";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      if (bottomQuarter) el.classList.add("p5r-noti--bottomQuarter");

      var portraitImg = el.querySelector(".p5-portrait-img");
      if (portraitImg) portraitImg.src = portraitSrc(who);
      var dialogImg = el.querySelector(".p5-dialog-img");
      if (dialogImg) dialogImg.src = ASSET_ROOT + "notification.png";

      var titleSpan = el.querySelector(".p5-noti-title .p5-title-ctn span");
      if (titleSpan) titleSpan.textContent = titleText;
      var textEl = el.querySelector(".p5-noti-text");
      if (textEl) textEl.textContent = bodyText;
    } else {
      el = document.createElement("div");
      el.className = "p5-noti-ctn";
      el.setAttribute("role", "status");
      el.setAttribute("aria-live", "polite");
      if (bottomQuarter) el.classList.add("p5r-noti--bottomQuarter");
      el.style.display = "block";
      el.innerHTML =
        '<div class="p5-noti-sub-ctn">' +
        '<img class="p5-portrait-img" src="' +
        portraitSrc(who) +
        '" alt="">' +
        '<div class="p5-dialog-ctn">' +
        '<img class="p5-dialog-img" src="' +
        ASSET_ROOT +
        'notification.png" alt="">' +
        '<div class="p5-noti-title"><p class="p5-title-ctn text-size-small"><span>' +
        escapeHtml(titleText) +
        "</span></p></div>" +
        '<div class="p5-noti-text">' +
        escapeHtml(bodyText) +
        "</div>" +
        "</div>" +
        "</div>";
    }

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "site-notiClose";
    closeBtn.setAttribute("aria-label", "关闭通知");
    closeBtn.textContent = "×";
    closeBtn.onclick = function (e) {
      e.stopPropagation();
      toastNotiCloseEl(el, bottomQuarter);
    };
    el.appendChild(closeBtn);

    el.style.opacity = "0";
    el.style.transform = bottomQuarter ? "translate(-50%, 28px)" : "translateX(-10px)";
    host.appendChild(el);
    requestAnimationFrame(function () {
      el.style.transition = "opacity .18s ease, transform .18s ease";
      el.style.opacity = "1";
      el.style.transform = bottomQuarter ? "translate(-50%, 0)" : "translateX(0)";
    });

    if (ttl > 0) {
      setTimeout(function () {
        if (!el.isConnected) return;
        closeBtn.onclick(new Event("click"));
      }, ttl);
    }
  }

  function ensureMsgHost() {
    var host = $("#msgHost") || $("#p5MsgHost");
    if (host) return host;
    host = document.createElement("div");
    host.id = "msgHost";
    document.body.appendChild(host);
    return host;
  }

  /** @param {string} kind default | clear | fail
   *  @param {string|{caption?:string}=} caption 可选：显示在图框下方的说明（常用于 fail） */
  function showMsg(kind, caption) {
    var host = ensureMsgHost();
    var k = String(kind || "default").toLowerCase();
    var cap = "";
    if (typeof caption === "string" && caption.trim()) {
      cap = caption.trim();
    } else if (caption && typeof caption.caption === "string" && caption.caption.trim()) {
      cap = String(caption.caption).trim();
    }
    var map = {
      default: ASSET_ROOT + "msg/default.png",
      clear: ASSET_ROOT + "msg/clear.png",
      fail: ASSET_ROOT + "msg/fail.png"
    };
    var src = map[k] || map.default;

    var el = document.createElement("div");
    el.className = "p5-msg-ctn" + (cap ? " p5-msg-ctn--withCaption" : "");
    if (cap) {
      el.style.position = "fixed";
      el.style.zIndex = "120";
      el.style.left = "50%";
      el.style.top = "max(96px, calc(env(safe-area-inset-top, 0px) + 72px))";
      el.style.transform = "translateX(-50%)";
      el.style.display = "flex";
      el.style.flexDirection = "column";
      el.style.alignItems = "center";
      el.style.gap = "10px";
      el.style.pointerEvents = "none";
    } else if (k === "fail") {
      /* 仅 fail 图、无说明时：固定在页眉下方居中（联系页等） */
      el.className += " p5-msg-ctn--failTop";
      el.style.position = "fixed";
      el.style.zIndex = "120";
      el.style.left = "50%";
      el.style.top = "max(96px, calc(env(safe-area-inset-top, 0px) + 72px))";
      el.style.transform = "translateX(-50%)";
      el.style.pointerEvents = "none";
    } else {
      el.style.top = "140px";
    }

    var inner =
      '<div class="p5-msg-sub-ctn" style="opacity:1">' +
      '<img class="p5-msg-img" src="' +
      src +
      '" alt="">' +
      '<img class="p5-sword-img p5-sword-animation" src="' +
      ASSET_ROOT +
      'sword.png" alt="">' +
      "</div>";
    if (cap) {
      inner +=
        '<p class="site-msgCaption" role="status">' +
        escapeHtml(cap) +
        "</p>";
    }
    el.innerHTML = inner;
    host.appendChild(el);
    var sub = el.querySelector(".p5-msg-sub-ctn");
    var capEl = el.querySelector(".site-msgCaption");
    setTimeout(function () {
      if (sub) sub.style.opacity = "0";
      if (capEl) capEl.style.opacity = "0";
    }, 2200);
    setTimeout(function () {
      el.remove();
    }, 3400);
  }

  // -----------------------
  // 公告（读/未读）
  // -----------------------
  function bindBulletins() {
    var list = $("#bulletinList");
    if (!list) return;
    var read = getReadMap();

    $all("[data-bid]", list).forEach(function (row) {
      var id = row.getAttribute("data-bid");
      if (read[id]) row.classList.add("is-read");
      row.addEventListener("click", function () {
        read[id] = true;
        setReadMap(read);
        row.classList.add("is-read");
        toastNoti("已标记为已读：" + id, { ttl: 1800 });
      });
    });

    var clearBtn = $("#clearRead");
    if (clearBtn) {
      clearBtn.onclick = function () {
        setReadMap({});
        $all("[data-bid]", list).forEach(function (row) {
          row.classList.remove("is-read");
        });
        showMsg("clear");
      };
    }
  }

  // -----------------------
  // 任务列表（分页 + 筛选）
  // -----------------------
  function bindTasks() {
    var host = $("#taskList");
    var pager = $("#taskPager");
    if (!host || !pager) return;

    var all = [];
    for (var i = 1; i <= 32; i++) {
      all.push({
        id: "T" + String(i).padStart(2, "0"),
        title: "委托/任务 " + i,
        tag: i % 3 === 0 ? "情报" : i % 3 === 1 ? "行动" : "支援",
        level: i % 3 === 0 ? "★★★" : i % 3 === 1 ? "★★" : "★"
      });
    }

    var filterSel = $("#taskFilter");
    var pageSize = 6;
    var page = 1;

    function getFiltered() {
      var v = filterSel ? String(filterSel.value || "all") : "all";
      if (v === "all") return all;
      return all.filter(function (x) {
        return x.tag === v;
      });
    }

    function render() {
      var data = getFiltered();
      var pageCount = Math.max(1, Math.ceil(data.length / pageSize));
      if (page > pageCount) page = pageCount;
      if (page < 1) page = 1;

      host.innerHTML = "";
      var start = (page - 1) * pageSize;
      var slice = data.slice(start, start + pageSize);
      slice.forEach(function (t) {
        var row = document.createElement("div");
        row.className = "item";
        row.innerHTML =
          '<div style="min-width:0">' +
          '<div class="itemTitle">' +
          t.title +
          "</div>" +
          '<div class="itemMeta">ID ' +
          t.id +
          " · " +
          t.tag +
          " · 难度 " +
          t.level +
          "</div>" +
          "</div>" +
          '<span class="pill">' +
          t.tag +
          "</span>";
        row.addEventListener("click", function () {
          // 跳转到详情（带参数）
          var u = new URL("../../player4/pages/detail.html", location.href);
          u.searchParams.set("id", t.id);
          location.href = u.href;
        });
        host.appendChild(row);
      });

      pager.innerHTML = "";
      function btn(label, toPage, active) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = active ? "p5-btn-ctn p5-hover-animation-mix" : "p5-btn-ctn p5-hover-animation-gray";
        b.textContent = label;
        b.onclick = function () {
          page = toPage;
          render();
        };
        pager.appendChild(b);
      }
      btn("上一页", Math.max(1, page - 1), false);
      for (var p = 1; p <= Math.min(5, pageCount); p++) btn(String(p), p, p === page);
      btn("下一页", Math.min(pageCount, page + 1), false);
    }

    if (filterSel) {
      filterSel.onchange = function () {
        page = 1;
        render();
      };
    }
    render();
  }

  // -----------------------
  // 登录页（原型：只存 localStorage）
  // -----------------------
  function bindLogin() {
    var form = $("#loginForm");
    if (!form) return;
    if (form.getAttribute("data-login-client") === "1") return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = String($("#loginName").value || "").trim();
      var pass = String($("#loginPass").value || "");
      if (!name) {
        toastNoti("请输入用户名", { portrait: "ann" });
        showMsg("fail");
        return;
      }
      if (pass.length < 3) {
        toastNoti("密码太短（原型演示）", { portrait: "akechi" });
        showMsg("fail");
        return;
      }
      setUser({ name: name, ts: Date.now(), portrait: "mona" });
      syncHeaderUser();
      showMsg("clear");
      setTimeout(function () {
        document.documentElement.classList.add("is-leaving");
        setTimeout(function () {
          location.href = new URL("../../player1/pages/bulletins.html", location.href).href;
        }, 220);
      }, 350);
    });
  }

  // -----------------------
  // 联系页（原型：校验 + 提示）
  // -----------------------
  function bindContact() {
    var form = $("#contactForm");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nick = String($("#cNick").value || "").trim();
      var mail = String($("#cMail").value || "").trim();
      var msg = String($("#cMsg").value || "").trim();
      if (!nick || !mail || !msg) {
        showMsg("fail", "请把信息填完整（原型）");
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
        showMsg("fail", "邮箱格式不正确（原型）");
        return;
      }
      toastNoti("反馈已提交，感谢你的反馈。", {
        title: "摩尔 加纳",
        portrait: "mona",
        ttl: 3800,
        bottomQuarter: true
      });
      form.reset();
    });
  }

  // -----------------------
  // 详情页（读取 query 参数）
  // -----------------------
  function bindDetail() {
    var el = $("#detailId");
    if (!el) return;
    var qs = new URLSearchParams(location.search);
    var id = qs.get("id") || "T??";
    el.textContent = id;
    var side = $("#detailIdSide");
    if (side) side.textContent = id;
  }

  // 暴露给原型页面说明/控制台
  window.P5Proto = {
    toastNoti: toastNoti,
    showMsg: showMsg,
    setUser: setUser,
    getUser: getUser
  };

  // BackTop：与 test/site.js 一致（页面 body 末尾需有 #p5BackTop.p5-top-ctn）
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

  // 绑定
  syncHeaderUser();
  syncP4rCharacterHeader();
  $all("[data-p5r-logout]").forEach(function (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      setUser(null);
      syncP4rCharacterHeader();
      location.href = new URL("../../player2/pages/login.html", location.href).href;
    });
  });
  bindLogin();
  bindContact();
  bindBulletins();
  bindTasks();
  bindDetail();

  // 顶栏「人物 / 联系」等 details：点击外部关闭（多组 .p5r-headerNav 一并处理）
  var p5rHeaderNavDetails = $all("details.p5r-headerNav");
  if (p5rHeaderNavDetails.length) {
    document.addEventListener("click", function (e) {
      for (var i = 0; i < p5rHeaderNavDetails.length; i++) {
        var d = p5rHeaderNavDetails[i];
        if (!d.open) continue;
        if (d.contains(e.target)) continue;
        d.open = false;
      }
    });
  }
})();

