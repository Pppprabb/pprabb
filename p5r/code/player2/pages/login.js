(function () {
  "use strict";

  var MIN_USER_LEN = 3;
  var MIN_PASS_LEN = 6;
  /** 与「游客进入」一致：有全屏过场图时停留时长（秒） */
  var LEAVE_OVERLAY_MS = 3000;

  function playLoginLeaveThen(goHref) {
    var leaveOv = document.getElementById("loginLeaveOverlay");
    if (leaveOv) {
      document.body.classList.add("is-login-leaving");
      leaveOv.removeAttribute("hidden");
      leaveOv.setAttribute("aria-hidden", "false");
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          leaveOv.classList.add("is-active");
        });
      });
    }
    setTimeout(function () {
      location.href = goHref;
    }, leaveOv ? LEAVE_OVERLAY_MS : 200);
  }

  var form = document.getElementById("loginForm");
  if (!form) return;

  var nameInput = document.getElementById("loginName");
  var passInput = document.getElementById("loginPass");
  var toggle = document.getElementById("togglePass");

  function clearLoginErrors() {
    setFieldInvalid("name", false);
    setFieldInvalid("pass", false);
  }

  function setFieldInvalid(field, invalid) {
    if (field === "name" && nameInput) {
      nameInput.classList.toggle("login-input--invalid", !!invalid);
    }
    if (field === "pass" && passInput) {
      passInput.classList.toggle("login-input--invalid", !!invalid);
    }
  }

  /** 校验失败：与人物页「摩尔加纳」底栏通知同款（拼图 / 不要再摸啦） */
  function showLoginValidationNoti(lines) {
    var msg = lines.filter(Boolean).join("；");
    if (!msg) return;
    if (window.P5Proto && window.P5Proto.toastNoti) {
      window.P5Proto.toastNoti(msg, {
        title: "摩尔 加纳",
        portrait: "mona",
        ttl: 3800,
        bottomQuarter: true
      });
    }
  }

  form.addEventListener(
    "submit",
    function (e) {
      e.preventDefault();
      e.stopImmediatePropagation();

      clearLoginErrors();

      var name = String(nameInput && nameInput.value ? nameInput.value : "").trim();
      var pass = String(passInput && passInput.value ? passInput.value : "");

      var ok = true;
      var lines = [];
      if (name.length < MIN_USER_LEN) {
        setFieldInvalid("name", true);
        lines.push("用户名至少 " + MIN_USER_LEN + " 个字");
        ok = false;
      }
      if (pass.length < MIN_PASS_LEN) {
        setFieldInvalid("pass", true);
        lines.push("密码至少 " + MIN_PASS_LEN + " 位");
        ok = false;
      }
      if (!ok) {
        showLoginValidationNoti(lines);
        return;
      }

      if (window.P5Proto && window.P5Proto.setUser) {
        window.P5Proto.setUser({ name: name, ts: Date.now(), portrait: "mona" });
      }
      playLoginLeaveThen(new URL("../../player1/pages/bulletins.html", location.href).href);
    },
    true
  );

  if (nameInput) {
    nameInput.addEventListener("input", function () {
      setFieldInvalid("name", false);
    });
  }
  if (passInput) {
    passInput.addEventListener("input", function () {
      setFieldInvalid("pass", false);
    });
  }

  form.addEventListener("reset", function () {
    clearLoginErrors();
  });

  if (toggle && passInput) {
    toggle.addEventListener("click", function () {
      var isPwd = passInput.getAttribute("type") === "password";
      passInput.setAttribute("type", isPwd ? "text" : "password");
      toggle.setAttribute("aria-pressed", isPwd ? "true" : "false");
      toggle.textContent = isPwd ? "🙈" : "🎭";
      toggle.title = isPwd ? "隐藏密码" : "显示密码";
      passInput.focus();
    });
    toggle.setAttribute("aria-pressed", "false");
  }

  var guestLink = document.getElementById("guestLink");
  if (guestLink) {
    guestLink.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.P5Proto && window.P5Proto.setUser) {
        window.P5Proto.setUser(null);
      }
      playLoginLeaveThen(new URL("../../player1/pages/bulletins.html", location.href).href);
    });
  }
})();
