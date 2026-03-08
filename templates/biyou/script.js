/**
 * BOTANIST LP サンプル - インタラクション
 * ・香りタブ切り替え（top / middle / last）
 * ・応募規約モーダルの開閉
 */

(function () {
  'use strict';

  // ----- 香り立ちの変化タブ -----
  var tabButtons = document.querySelectorAll('.fragrance-tab');
  var cards = document.querySelectorAll('.fragrance-card');

  function switchFragrance(target) {
    tabButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === target);
    });
    cards.forEach(function (card) {
      card.classList.toggle('active', card.getAttribute('data-card') === target);
    });
  }

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.getAttribute('data-tab');
      if (target) switchFragrance(target);
    });
  });

  // ----- 応募規約モーダル -----
  var modal = document.getElementById('modal-terms');
  var openBtn = document.querySelector('[data-modal="terms"]');
  var closeTriggers = document.querySelectorAll('[data-close="terms"]');

  function openModal() {
    if (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      // フォーカスをモーダル内に
      var focusable = modal.querySelector('button, [href], input');
      if (focusable) focusable.focus();
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (openBtn) openBtn.focus();
    }
  }

  if (openBtn) {
    openBtn.addEventListener('click', openModal);
  }

  closeTriggers.forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  // モーダル外クリック（オーバーレイ）は modal-overlay で処理済み
  if (modal) {
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }
})();
