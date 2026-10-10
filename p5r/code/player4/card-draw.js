(function () {
  "use strict";

  var BASE = "../../../皇家p5r/";
  var CARDS = [
    {
      face: BASE + "芳泽霞/芳泽霞8.png",
      popup: BASE + "芳泽霞/芳泽霞人物素材 (3).png",
      label: "芳泽霞",
    },
    {
      face: BASE + "高卷杏/人物素材2 (1).png",
      popup: BASE + "高卷杏/人物素材1.png",
      label: "高卷杏",
    },
    {
      face: BASE + "喜多川祐介/2024-10-21 221242.jpg",
      popup: BASE + "喜多川祐介/4.png",
      label: "喜多川祐介",
    },
    {
      face: BASE + "新岛真/新岛真背景素材.png",
      popup: BASE + "新岛真/人物素材.png",
      label: "新岛真",
    },
    {
      face: BASE + "佐仓双叶/佐仓双叶人物3.png",
      popup: BASE + "佐仓双叶/2.png",
      label: "佐仓双叶",
    },
  ];

  var fan = document.getElementById("p5rCardFan");
  var stage = document.getElementById("p5rCardStage");
  var cards = fan ? fan.querySelectorAll(".p5r-cardDraw__card") : [];
  var vcardLayer = document.getElementById("p5rCardVcard");
  var vcardFig = document.getElementById("p5rCardVcardFig");
  var vcardScene = vcardLayer ? vcardLayer.querySelector(".p5r-cardDraw__vcardScene") : null;
  var vcardAnchor = document.getElementById("p5rCardVcardAnchor");
  var vcardPair = document.getElementById("p5rCardVcardPair");
  var vcardCardShell = document.getElementById("p5rCardVcardCardShell");
  var vcardClose = document.getElementById("p5rCardVcardClose");
  var vcardBackdrop = vcardLayer
    ? vcardLayer.querySelector(".p5r-cardDraw__vcardBackdrop")
    : null;

  if (
    !fan ||
    !cards.length ||
    !vcardLayer ||
    !vcardFig ||
    !vcardScene ||
    !vcardAnchor ||
    !vcardPair ||
    !vcardCardShell
  ) {
    return;
  }

  var fanned = false;
  var selectedIndex = -1;
  var pinnedEl = null;
  var pinParent = null;
  var pinNext = null;
  /** 占位：牌被移到弹层时保留 fan 内子元素序号，避免 :nth-child 错位导致邻牌「弹出」 */
  var pinPlaceholder = null;
  var closeTimer = null;
  var openGen = 0;
  var SPREAD_MS = 900;
  var prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** 点击背景：收拢为叠在一起的一摞，并关闭立绘层 */
  function stackFan() {
    if (!fanned || !fan) return;
    openGen++;
    finishCloseVcard();
    fanned = false;
    selectedIndex = -1;
    fan.classList.remove("is-fanned", "has-selection");
    fan.classList.add("is-stacked");
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove("is-selected", "is-revealed");
    }
  }

  function spreadFan() {
    if (fanned) return;
    fanned = true;
    if (fan.classList.contains("is-stacked")) {
      fan.classList.replace("is-stacked", "is-fanned");
    } else {
      fan.classList.add("is-fanned");
    }
  }

  function clearCloseTimer() {
    if (closeTimer !== null) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  }

  function unpinCard() {
    if (!pinnedEl) return;
    pinnedEl.classList.remove("is-vcard-pinned");
    pinnedEl.style.cssText = "";
    if (pinParent) {
      if (pinPlaceholder && pinPlaceholder.parentNode === pinParent) {
        pinParent.insertBefore(pinnedEl, pinPlaceholder);
        pinPlaceholder.remove();
      } else if (pinNext && pinNext.parentNode === pinParent) {
        pinParent.insertBefore(pinnedEl, pinNext);
      } else {
        pinParent.appendChild(pinnedEl);
      }
    }
    pinnedEl = null;
    pinParent = null;
    pinNext = null;
    pinPlaceholder = null;
  }

  function hideLayerAndFig() {
    vcardLayer.setAttribute("hidden", "");
    vcardLayer.setAttribute("aria-hidden", "true");
    vcardAnchor.setAttribute("aria-hidden", "true");
    vcardFig.removeAttribute("src");
    vcardFig.removeAttribute("alt");
    document.body.style.overflow = "";
    vcardPair.classList.remove("is-spread");
  }

  function finishCloseVcard() {
    clearCloseTimer();
    unpinCard();
    hideLayerAndFig();
  }

  function closeVcard() {
    if (vcardLayer.hasAttribute("hidden")) return;
    openGen++;
    clearCloseTimer();
    var wasSpread = vcardPair.classList.contains("is-spread");
    vcardPair.classList.remove("is-spread");
    if (wasSpread && !prefersReducedMotion) {
      closeTimer = window.setTimeout(finishCloseVcard, SPREAD_MS);
    } else {
      finishCloseVcard();
    }
  }

  function placeAnchorOverCard(r) {
    var scen = vcardScene.getBoundingClientRect();
    vcardAnchor.style.left = r.left - scen.left + "px";
    vcardAnchor.style.top = r.top - scen.top + "px";
    vcardAnchor.style.width = r.width + "px";
    vcardAnchor.style.height = r.height + "px";
  }

  function mountCardInShell(el) {
    pinParent = el.parentNode;
    pinNext = el.nextSibling;
    pinPlaceholder = document.createElement("div");
    pinPlaceholder.className = "p5r-cardDraw__fanSlot";
    pinPlaceholder.setAttribute("aria-hidden", "true");
    pinParent.insertBefore(pinPlaceholder, el);
    vcardCardShell.appendChild(el);
    pinnedEl = el;
    el.classList.add("is-vcard-pinned");
    el.style.position = "absolute";
    el.style.left = "0";
    el.style.top = "0";
    el.style.width = "100%";
    el.style.height = "100%";
    el.style.margin = "0";
    el.style.transform = "none";
    el.style.boxSizing = "border-box";
  }

  function openVcard(index) {
    clearCloseTimer();
    openGen++;
    var myGen = openGen;
    unpinCard();
    vcardPair.classList.remove("is-spread");

    var el = cards[index];
    var r = el.getBoundingClientRect();
    vcardFig.src = CARDS[index].popup;
    vcardFig.alt = CARDS[index].label + " 立绘";

    placeAnchorOverCard(r);
    mountCardInShell(el);

    vcardLayer.removeAttribute("hidden");
    vcardLayer.setAttribute("aria-hidden", "false");
    vcardAnchor.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    void vcardAnchor.offsetWidth;

    if (prefersReducedMotion) {
      vcardPair.classList.add("is-spread");
    } else {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (myGen !== openGen) return;
          vcardPair.classList.add("is-spread");
        });
      });
    }
  }

  function selectCard(index) {
    selectedIndex = index;
    fan.classList.add("has-selection");
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.toggle("is-selected", i === index);
      cards[i].classList.toggle("is-revealed", i === index);
    }
  }

  function onCardPointer(index) {
    if (!fanned) {
      spreadFan();
      return;
    }
    if (selectedIndex === index && cards[index].classList.contains("is-revealed")) {
      openVcard(index);
      return;
    }
    selectCard(index);
    closeVcard();
  }

  for (var c = 0; c < cards.length; c++) {
    (function (idx) {
      var btn = cards[idx];
      var faceImg = btn.querySelector(".p5r-cardDraw__face--front img");
      if (faceImg) {
        faceImg.src = CARDS[idx].face;
        faceImg.alt = CARDS[idx].label;
      }
      btn.addEventListener("click", function () {
        onCardPointer(idx);
      });
    })(c);
  }

  if (stage) {
    stage.addEventListener("click", function (e) {
      if (!fanned) return;
      if (e.target.closest && e.target.closest(".p5r-cardDraw__card")) return;
      stackFan();
    });
  }

  var mainDraw = document.querySelector(".p5r-cardDrawMain");
  if (mainDraw) {
    mainDraw.addEventListener("click", function (e) {
      if (!fanned) return;
      if (e.target.closest && e.target.closest(".p5r-cardDraw__card")) return;
      if (e.target.closest && e.target.closest("#p5rCardStage")) return;
      stackFan();
    });
  }

  function onBackdropOrClose() {
    closeVcard();
  }

  if (vcardClose) vcardClose.addEventListener("click", onBackdropOrClose);
  if (vcardBackdrop) vcardBackdrop.addEventListener("click", onBackdropOrClose);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !vcardLayer.hasAttribute("hidden")) {
      closeVcard();
    }
  });
})();
