/**
 * LP テンプレート選択 - 2タップ完結
 *
 * タップ①: テンプレートをタップ → サンプル LP ポップアップ
 * タップ②: 「この番号をLINEで送る」→ LINE 公式起動
 *
 * 【設定】LINE 公式の友だち追加 URL
 */
(function () {
  'use strict';

  var LINE_URL = 'https://lin.ee/ZmnINmd';

  /* ─── テンプレート一覧（番号順） ─── */
  var TEMPLATES = [
    { num: 2, name: 'フレグランスコレクション', genre: '物販',    style: 'biyou',      path: 'templates/biyou/index.html' },
    { num: 3, name: '珈琲と、ひだまり。',       genre: '物販',    style: 'butuhan',    path: 'templates/butuhan/index.html' },
    { num: 4, name: 'doodle',                   genre: '美容',    style: 'doodle',     path: 'templates/biyou-doodle/index.html' },
    { num: 6, name: 'longleage',                genre: '美容',    style: 'longleage',  path: 'templates/biyou-longleage/index.html' },
    { num: 7, name: 'モノコトLab.',             genre: 'スクール', style: 'school-lp7', path: 'templates/school-lp7/index.html' },
    { num: 8, name: '習い事教室',               genre: 'スクール', style: 'school-lp8', path: 'templates/school-lp8/index.html' }
  ];

  /* ─── 現在の状態 ─── */
  var state = { tpl: null };

  /* ─── DOM ─── */
  var templatesGrid    = document.getElementById('templates-grid');
  var actionBar        = document.getElementById('action-bar');
  var actionNumValue   = document.getElementById('action-num-value');
  var btnLine          = document.getElementById('btn-line');
  var btnPreviewOpen   = document.getElementById('btn-preview-open');

  var modal            = document.getElementById('modal');
  var modalBackdrop    = document.getElementById('modal-backdrop');
  var modalSheet       = document.getElementById('modal-sheet');
  var modalClose       = document.getElementById('modal-close');
  var modalNum         = document.getElementById('modal-num');
  var modalName        = document.getElementById('modal-name');
  var modalIframe      = document.getElementById('modal-iframe');
  var modalLoading     = document.getElementById('modal-loading');
  var btnLineModal     = document.getElementById('btn-line-modal');
  var btnLineModalText = document.getElementById('btn-line-modal-text');

  /* ════════════════════════════════════════
     初期描画: 全テンプレートを一覧表示
  ════════════════════════════════════════ */
  templatesGrid.innerHTML = TEMPLATES.map(function (t) {
    return '<button type="button" class="tpl-card" data-style="' + t.style
      + '" data-num="' + t.num
      + '" data-name="' + t.name
      + '" data-path="' + t.path + '">'
      + skeletonHTML(t.style)
      + '<div class="tpl-foot">'
      + '<span class="tpl-num">No.' + t.num + '</span>'
      + '<span class="tpl-name">' + t.name + '</span>'
      + '<span class="tpl-genre">' + t.genre + '</span>'
      + '</div>'
      + '</button>';
  }).join('');

  /* カードクリック → ポップアップ */
  templatesGrid.querySelectorAll('.tpl-card').forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card);
    });
  });

  /* ════════════════════════════════════════
     ポップアップを開く
  ════════════════════════════════════════ */
  function openModal(card) {
    var num  = card.dataset.num;
    var name = card.dataset.name;
    var path = card.dataset.path;

    state.tpl = { num: num, name: name, path: path };

    modalNum.textContent       = 'No.' + num;
    modalName.textContent      = name;
    btnLineModalText.textContent = 'No.' + num + ' をLINEで送る';
    btnLineModal.href          = LINE_URL;

    actionNumValue.textContent = num;
    actionBar.hidden           = false;
    btnLine.href               = LINE_URL;

    modalLoading.hidden        = false;
    modalIframe.style.opacity  = '0';
    modalIframe.src            = 'about:blank';

    templatesGrid.querySelectorAll('.tpl-card').forEach(function (c) {
      c.classList.remove('selected');
    });
    card.classList.add('selected');

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    setTimeout(function () { modalIframe.src = path; }, 80);
  }

  /* iframe 読み込み完了 */
  modalIframe.addEventListener('load', function () {
    if (modalIframe.src === 'about:blank') return;
    modalLoading.hidden = true;
    modalIframe.style.opacity = '1';
    modalIframe.style.transition = 'opacity .3s';
  });

  /* ════════════════════════════════════════
     ポップアップを閉じる
  ════════════════════════════════════════ */
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
    setTimeout(function () { modalIframe.src = 'about:blank'; }, 300);
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* スワイプで閉じる（スマホ向け） */
  var touchStartY = 0;
  modalSheet.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  modalSheet.addEventListener('touchend', function (e) {
    if (e.changedTouches[0].clientY - touchStartY > 80) closeModal();
  }, { passive: true });

  /* アクションバー「サンプルを見る」 */
  btnPreviewOpen.addEventListener('click', function () {
    var card = templatesGrid.querySelector('.tpl-card.selected');
    if (card) openModal(card);
  });

  /* ════════════════════════════════════════
     スケルトン HTML 生成
  ════════════════════════════════════════ */
  function skeletonHTML(style) {
    if (style === 'doodle') {
      return '<div class="tpl-preview tpl-preview-doodle">'
        + '<div class="mock-hero-catch"></div>'
        + '<div class="mock-hero-logo"></div>'
        + '<div class="mock-hero-badges"></div>'
        + '<div class="mock-hero-cta"></div>'
        + '</div>';
    }
    if (style === 'butuhan') {
      return '<div class="tpl-preview tpl-preview-butan">'
        + '<div class="mock-hero-label"></div>'
        + '<div class="mock-hero-catch"></div>'
        + '<div class="mock-hero-lead"></div>'
        + '<div class="mock-hero-cta"></div>'
        + '</div>';
    }
    if (style === 'biyou') {
      return '<div class="tpl-preview tpl-preview-biyou">'
        + '<div class="mock-split-left">'
        + '<div class="mock-hero-en"></div>'
        + '<div class="mock-hero-ttl"></div>'
        + '<div class="mock-hero-cta"></div>'
        + '</div>'
        + '<div class="mock-split-right">'
        + '<div class="mock-product"></div>'
        + '</div>'
        + '</div>';
    }
    if (style === 'longleage') {
      return '<div class="tpl-preview tpl-preview-longleage">'
        + '<div class="mock-hero-slideshow"></div>'
        + '<div class="mock-hero-eyebrow"></div>'
        + '<div class="mock-hero-title"></div>'
        + '<div class="mock-hero-btns"></div>'
        + '<div class="mock-salon-row"></div>'
        + '</div>';
    }
    if (style === 'school-lp7') {
      return '<div class="tpl-preview tpl-preview-school-lp7">'
        + '<div class="mock-hero-circuit"></div>'
        + '<div class="mock-hero-sub"></div>'
        + '<div class="mock-hero-logo"></div>'
        + '<div class="mock-hero-cta"></div>'
        + '</div>';
    }
    if (style === 'school-lp8') {
      return '<div class="tpl-preview tpl-preview-school-lp8">'
        + '<div class="mock-hero-bg"></div>'
        + '<div class="mock-hero-sub"></div>'
        + '<div class="mock-hero-ttl"></div>'
        + '<div class="mock-hero-cta"></div>'
        + '</div>';
    }
    return '<div class="tpl-preview">'
      + '<div class="mock-catch"></div>'
      + '<div class="mock-cta"></div>'
      + '</div>';
  }

})();
