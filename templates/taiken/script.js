/**
 * nebane テンプレート — script.js
 *
 * 収録機能:
 *  1. Swiper ヒーロースライダー初期化
 *  2. ヘッダー スクロール検知（背景切り替え）
 *  3. ハンバーガーメニュー
 *  4. ヒーローキャッチコピー フェードイン
 *  5. スクロール検知フェードイン（IntersectionObserver）
 *  6. モーダル（デジタル絵本）開閉
 *  7. スムーズアンカースクロール
 */

'use strict';

/* ============================================================
   DOMContentLoaded を待ってから初期化
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initSwiper();
  initHeader();
  initHamburger();
  initHeroCopy();
  initScrollFade();
  initModal();
  initSmoothScroll();
});


/* ============================================================
   1. Swiper ヒーロースライダー
   ============================================================ */
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.p-top-fv__sliders', {
    loop: true,
    speed: 1200,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: '.p-top-fv__pagination',
      clickable: true,
    },
    on: {
      slideChangeTransitionEnd() {
        // スライド切り替え時に再びillustをフェードイン
        const activeSlide = document.querySelector('.swiper-slide-active');
        if (!activeSlide) return;
        const illusts = activeSlide.querySelectorAll('.p-top-fv__slider-illust');
        illusts.forEach(el => {
          el.style.opacity = '0';
          void el.offsetWidth; // reflow
          el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
          el.style.opacity = '1';
        });
      }
    }
  });
}


/* ============================================================
   2. ヘッダー スクロール検知
   ============================================================ */
function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const THRESHOLD = 60;

  function updateHeader() {
    header.classList.toggle('is-scrolled', window.scrollY > THRESHOLD);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();
}


/* ============================================================
   3. ハンバーガーメニュー
   ============================================================ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('global-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isActive = btn.classList.toggle('is-active');
    nav.classList.toggle('is-open', isActive);
    btn.setAttribute('aria-expanded', String(isActive));
    document.body.style.overflow = isActive ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('is-active');
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}


/* ============================================================
   4. ヒーローキャッチコピー フェードイン
   ============================================================ */
function initHeroCopy() {
  const copyText = document.querySelector('.p-top-fv__copy-text');
  if (!copyText) return;

  setTimeout(() => {
    copyText.classList.add('is-visible');
  }, 400);
}


/* ============================================================
   5. スクロール検知フェードイン（IntersectionObserver）
   ============================================================ */
function initScrollFade() {
  const targets = document.querySelectorAll('.c-up, .c-up__list');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // data-delay 属性があれば遅延
        const delay = parseInt(entry.target.dataset.delay || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('is-visible');
        }, delay);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));

  /* c-up02 ── トピックス一覧は「列ごと」に遅延 */
  const lists02 = document.querySelectorAll('.c-up02');
  const observer2 = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // 子要素を順番にフェードイン
        const children = entry.target.querySelectorAll('.c-up__list');
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add('is-visible'), i * 80);
          child.style.opacity = '0';
          child.style.transform = 'translateY(40px)';
          child.style.transition = `opacity 0.8s ease, transform 0.8s ease`;
        });

        setTimeout(() => entry.target.classList.add('is-visible'), 0);
        observer2.unobserve(entry.target);
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );
  lists02.forEach(el => observer2.observe(el));
}


/* ============================================================
   6. モーダル（デジタル絵本）
   ============================================================ */
function initModal() {
  const modal    = document.getElementById('book-modal');
  const openBtns = document.querySelectorAll('.js-bookOpen');
  const closeBtn = document.querySelector('.js-bookClose');
  if (!modal) return;

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    openModal();
  }));

  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
  });
}


/* ============================================================
   7. スムーズアンカースクロール
   ============================================================ */
function initSmoothScroll() {
  const HEADER_H = 72;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}
