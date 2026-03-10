// ファイル: assets/js/main.js

document.addEventListener("DOMContentLoaded", function () {

  // ==========================================
  // MENUボタン開閉処理
  // ==========================================
  const menuBtn = document.getElementById("js-menu-btn");
  const globalNav = document.getElementById("js-global-nav");

  if (menuBtn && globalNav) {
    menuBtn.addEventListener("click", function () {
      const isOpen = globalNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      globalNav.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });

    // ▼ ナビリンクをクリックしたらメニューを閉じる
    globalNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        globalNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        globalNav.setAttribute("aria-hidden", "true");
      });
    });

    // ▼ メニュー外をクリックしたら閉じる
    document.addEventListener("click", function (e) {
      if (!menuBtn.contains(e.target) && !globalNav.contains(e.target)) {
        globalNav.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
        globalNav.setAttribute("aria-hidden", "true");
      }
    });
  }

  // ==========================================
  // スクロール時にヘッダーに背景色を追加
  // ==========================================
  const header = document.querySelector(".site-header");
  if (header) {
    const updateHeader = function () {
      if (window.scrollY > 40) {
        header.style.background = "rgba(0,0,0,0.7)";
        header.style.backdropFilter = "blur(12px)";
      } else {
        header.style.background = "";
        header.style.backdropFilter = "";
      }
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
  }

  // ==========================================
  // アンカーリンクのスムーススクロール
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 64;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    });
  });

});
