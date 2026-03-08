/**
 * doodle - 産後骨盤矯正・ダイエット専門院
 * ヘッダー・ドロワー・スクロール連動
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.header-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-nav a');

  // ----- スクロールでヘッダーにクラス付与 -----
  function onScroll() {
    if (window.scrollY > 50) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- ハンバーガーメニュー開閉 -----
  function openDrawer() {
    drawer.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'メニューを閉じる');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'メニューを開く');
    document.body.style.overflow = '';
  }

  function toggleDrawer() {
    if (drawer.classList.contains('is-open')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  }

  if (hamburger && drawer) {
    hamburger.addEventListener('click', toggleDrawer);

    // ドロワー内リンククリックで閉じる
    drawerLinks.forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    // ドロワー外クリックで閉じる
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) {
        closeDrawer();
      }
    });
  }

  // ----- セクション表示時のフェードイン（Intersection Observer） -----
  const sections = document.querySelectorAll('.section');
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    section.classList.add('animate-on-scroll');
    observer.observe(section);
  });
})();
