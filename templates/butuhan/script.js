/**
 * 珈琲と、ひだまり。｜サンプルLP
 * メニュータブ・スマホナビ・スクロールアニメ・ヘッダー
 */
(function () {
  'use strict';

  // ----- スクロールで表示アニメ（Intersection Observer） -----
  var inviewEls = document.querySelectorAll('[data-inview]');
  if (inviewEls.length > 0) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview');
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      }
    );
    inviewEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ----- ヘッダー：スクロールで背景を少し強調 -----
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 20) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ----- メニュータブ（コーヒー / 軽食・スイーツ） -----
  var tabButtons = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = this.getAttribute('data-tab');
      if (!targetId) return;

      tabButtons.forEach(function (b) {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(function (p) {
        p.classList.remove('is-active');
        p.setAttribute('hidden', '');
      });

      this.classList.add('is-active');
      this.setAttribute('aria-selected', 'true');
      var panel = document.getElementById('panel-' + targetId);
      if (panel) {
        panel.classList.add('is-active');
        panel.removeAttribute('hidden');
      }
    });
  });

  // ----- スマホ用ナビ開閉（ハンバーガー → ×） -----
  var navToggle = document.querySelector('.nav-toggle');
  var navSp = document.getElementById('nav-sp');

  if (navToggle && navSp) {
    navToggle.addEventListener('click', function () {
      var isOpen = navSp.classList.toggle('is-open');
      navToggle.classList.toggle('is-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    navSp.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navSp.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'メニューを開く');
      });
    });
  }
})();
