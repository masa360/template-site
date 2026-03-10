/**
 * LPテンプレート選択 - 3タップ完結
 *
 * タップ①: ジャンルを選ぶ
 * タップ②: スケルトンをタップ → サンプルLPポップアップ
 * タップ③: 「この番号をLINEで送る」→ LINE公式起動
 *
 * ─────────────────────────────────
 * 【設定】LINE公式の友だち追加URLを入れてください
 * 例: 'https://lin.ee/xxxxxxx'
 * ─────────────────────────────────
 */
(function () {
  'use strict';

  var LINE_URL = 'https://lin.ee/ZmnINmd';

  /* ─── ジャンルごとのテンプレート定義（附番: 1〜6） ─── */
  var TEMPLATES = {
    butuhan: [
      { num: 3,  name: '珈琲と、ひだまり。', style: 'butuhan', path: 'templates/butuhan/index.html' }
    ],
    biyou: [
      { num: 2,  name: 'フレグランスコレクション', style: 'biyou', path: 'templates/biyou/index.html' },
      { num: 4,  name: 'doodle', style: 'doodle', path: 'templates/biyou-doodle/index.html' },
      { num: 6,  name: 'longleage', style: 'longleage', path: 'templates/biyou-longleage/index.html' }
    ],
    insyoku: [
      { num: 5,  name: 'ゆうカフェ', style: 'insyoku', path: 'templates/insyoku/index.html' }
    ],
    school: [
      { num: 8, name: '習い事教室', style: 'school-lp8', path: 'templates/school-lp8/index.html' }
    ],
    taiken: [
      { num: 1,  name: 'nebane', style: 'taiken', path: 'templates/taiken/index.html' }
    ]
  };

  /* ─── ジャンルごとのサンプルコンテンツ ─── */
  var DEMO = {
    butuhan: {
      catch:   '品質にこだわった、あなたへ届けたい一品',
      sub:     '国内厳選素材100%使用。\n職人が一つひとつ丁寧に仕上げました。',
      company: '〇〇ストア\n創業10年、累計販売数10,000点以上。\n品質と安心を大切にお届けします。',
      features:'送料無料・即日発送可\n30日間返品保証付き\nLINEで24時間サポート'
    },
    biyou: {
      catch:   'あなたらしい美しさを、ここで。',
      sub:     '一人ひとりに合わせた丁寧な施術で、\n理想の自分へ近づきましょう。',
      company: '〇〇サロン\n女性専用・完全個室・完全予約制。\n経験10年のスタイリストが担当します。',
      features:'初回体験50%オフ\n完全個室でリラックス\nLINEで24時間予約受付'
    },
    school: {
      catch:   '学びで、可能性が広がる。',
      sub:     '初心者でも安心。\n現役プロが基礎からサポートします。',
      company: '〇〇スクール\n受講生累計500名以上。\n少人数制で一人ひとりに丁寧に対応。',
      features:'オンライン・対面どちらも対応\n無料体験レッスンあり\n修了後もサポート継続'
    },
    taiken: {
      catch:   'まず体験してみませんか？',
      sub:     '難しいことは何もありません。\n初めての方でも気軽にご参加ください。',
      company: '〇〇体験会\n毎月開催・定員10名の少人数制。\n初めての方大歓迎です。',
      features:'参加費無料（初回限定）\n持ち物一切不要\nLINEで簡単予約OK'
    },
    insyoku: {
      catch:   'ここは、かくれがのような居場所',
      sub:     '飲みものも、おやつも、Wi-Fiも充電もぜんぶ無料です。',
      company: '〇〇カフェ\n営業時間・アクセス・ご予約はこちらから。',
      features:'無料Wi-Fi・充電\n軽食・ドリンク\n予約制・ゆったり過ごせる'
    }
  };

  var GENRE_LABELS = { butuhan:'物販', biyou:'美容', insyoku:'飲食', school:'スクール', taiken:'体験' };

  /* ─── 現在の状態 ─── */
  var state = { genre: null, tpl: null };

  /* ─── DOM ─── */
  var step1El = document.getElementById('step1');
  var step2El = document.getElementById('step2');
  var step3El = document.getElementById('step3');

  var templatesWrap    = document.getElementById('templates-wrap');
  var templatesHeading = document.getElementById('templates-heading');
  var templatesGrid    = document.getElementById('templates-grid');
  var actionBar        = document.getElementById('action-bar');
  var actionNumValue   = document.getElementById('action-num-value');
  var btnLine          = document.getElementById('btn-line');
  var btnPreviewOpen   = document.getElementById('btn-preview-open');

  var modal        = document.getElementById('modal');
  var modalBackdrop= document.getElementById('modal-backdrop');
  var modalSheet   = document.getElementById('modal-sheet');
  var modalClose   = document.getElementById('modal-close');
  var modalNum     = document.getElementById('modal-num');
  var modalName    = document.getElementById('modal-name');
  var modalIframe  = document.getElementById('modal-iframe');
  var modalLoading = document.getElementById('modal-loading');
  var btnLineModal = document.getElementById('btn-line-modal');
  var btnLineModalText = document.getElementById('btn-line-modal-text');

  /* ════════════════════════════════════════
     タップ①: ジャンル選択
  ════════════════════════════════════════ */
  document.querySelectorAll('.genre-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.genre = btn.dataset.genre;
      state.tpl   = null;

      document.querySelectorAll('.genre-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      renderTemplates(state.genre);
      actionBar.hidden = true;

      /* ステップ2をアクティブに */
      step1El.classList.remove('active');
      step2El.classList.add('active');
      step3El.classList.remove('active');
    });
  });

  /* ════════════════════════════════════════
     スケルトン一覧を描画
  ════════════════════════════════════════ */
  function renderTemplates(genre) {
    var list = TEMPLATES[genre];
    templatesHeading.textContent = GENRE_LABELS[genre] + ' のテンプレート';
    templatesGrid.innerHTML = list.map(function (t) {
      return '<button type="button" class="tpl-card" data-style="' + t.style
        + '" data-num="' + t.num
        + '" data-name="' + t.name
        + '" data-path="' + t.path + '">'
        + skeletonHTML(t.style)
        + '<div class="tpl-foot">'
        + '<span class="tpl-num">No.' + t.num + '</span>'
        + '<span class="tpl-name">' + t.name + '</span>'
        + '</div>'
        + '</button>';
    }).join('');

    templatesWrap.hidden = false;
    setTimeout(function () {
      templatesWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 60);

    /* タップ②: スケルトンカードクリック → ポップアップ */
    templatesGrid.querySelectorAll('.tpl-card').forEach(function (card) {
      card.addEventListener('click', function () {
        openModal(card);
      });
    });
  }

  /* ════════════════════════════════════════
     タップ②: ポップアップを開く
  ════════════════════════════════════════ */
  function openModal(card) {
    var num  = card.dataset.num;
    var name = card.dataset.name;
    var path = card.dataset.path;

    state.tpl = { num: num, name: name, path: path };

    /* ヘッダー更新 */
    modalNum.textContent  = 'No.' + num;
    modalName.textContent = name;

    /* LINEボタンテキスト更新 */
    btnLineModalText.textContent = 'No.' + num + ' をLINEで送る';
    btnLineModal.href = LINE_URL.replace(/\/$/, '');

    /* アクションバーも更新（モーダル外から再送信できるよう） */
    actionNumValue.textContent = num;
    actionBar.hidden = false;
    btnLine.href = LINE_URL.replace(/\/$/, '');

    /* ステップ3をアクティブに */
    step1El.classList.remove('active');
    step2El.classList.remove('active');
    step3El.classList.add('active');

    /* iframe をローディング状態にしてから src をセット */
    modalLoading.hidden = false;
    modalIframe.style.opacity = '0';
    modalIframe.src = 'about:blank';

    /* デモ用クエリパラメータを付与してiframe読み込み */
    var src = buildDemoUrl(path, state.genre);

    /* カード選択状態を更新 */
    templatesGrid.querySelectorAll('.tpl-card').forEach(function (c) {
      c.classList.remove('selected');
    });
    card.classList.add('selected');

    /* モーダル表示 */
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    /* iframe src は少し遅らせてセット（スムーズなアニメーションのため） */
    setTimeout(function () { modalIframe.src = src; }, 80);
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
    /* iframeをリセット（メモリ節約） */
    setTimeout(function () { modalIframe.src = 'about:blank'; }, 300);
  }

  modalClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);

  /* ESCキーで閉じる（デスクトップ対応） */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  /* ドラッグで閉じる（スマホ向け） */
  var touchStartY = 0;
  modalSheet.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  modalSheet.addEventListener('touchend', function (e) {
    var diff = e.changedTouches[0].clientY - touchStartY;
    if (diff > 80) closeModal(); /* 80px以上下へスワイプで閉じる */
  }, { passive: true });

  /* ════════════════════════════════════════
     アクションバーの「サンプルを見る」
  ════════════════════════════════════════ */
  btnPreviewOpen.addEventListener('click', function () {
    if (!state.tpl) return;
    var card = templatesGrid.querySelector('.tpl-card.selected');
    if (card) openModal(card);
  });

  /* ════════════════════════════════════════
     デモ用URLを生成
  ════════════════════════════════════════ */
  function buildDemoUrl(path, genre) {
    /* 固定コンテンツのサンプルLPはパラメータ不要 */
    if (path.indexOf('biyou/index.html') !== -1 || path.indexOf('biyou-doodle/index.html') !== -1 || path.indexOf('biyou-longleage/index.html') !== -1 || path.indexOf('butuhan/index.html') !== -1 || path.indexOf('insyoku/index.html') !== -1 || path.indexOf('taiken/index.html') !== -1 || path.indexOf('school-lp8/index.html') !== -1) return path;
    var d = DEMO[genre] || DEMO.butuhan;
    var p = new URLSearchParams();
    p.set('catch',   d.catch);
    p.set('sub',     d.sub);
    p.set('company', d.company);
    p.set('features',d.features);
    return path + '?' + p.toString();
  }

  /* ════════════════════════════════════════
     スケルトンHTML生成
  ════════════════════════════════════════ */
  function skeletonHTML(style) {
    if (style === 'insyoku') {
      return '<div class="tpl-preview tpl-preview-insyoku">'
        + '<div class="mock-vertical-ttl"></div>'
        + '<div class="mock-circle"></div>'
        + '<div class="mock-photo"></div>'
        + '</div>';
    }
    if (style === 'doodle') {
      return '<div class="tpl-preview tpl-preview-doodle">'
        + '<div class="mock-hero-overlay"></div>'
        + '<div class="mock-hero-catch"></div>'
        + '<div class="mock-hero-logo"></div>'
        + '<div class="mock-hero-badges"></div>'
        + '<div class="mock-hero-cta"></div>'
        + '</div>';
    }
    if (style === 'taiken') {
      return '<div class="tpl-preview tpl-preview-taiken">'
        + '<div class="mock-slider"></div>'
        + '<div class="mock-copy"></div>'
        + '<div class="mock-btn"></div>'
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
    if (style === 'school-lp8') {
      return '<div class="tpl-preview tpl-preview-school-lp8">'
        + '<div class="mock-hero-bg"></div>'
        + '<div class="mock-hero-sub"></div>'
        + '<div class="mock-hero-ttl"></div>'
        + '<div class="mock-hero-cta"></div>'
        + '</div>';
    }
    if (style === 'A') {
      return '<div class="tpl-preview">'
        + '<div class="mock-img"></div>'
        + '<div class="mock-catch"></div>'
        + '<div class="mock-text"></div>'
        + '<div class="mock-cta"></div>'
        + '</div>';
    }
    if (style === 'B') {
      return '<div class="tpl-preview">'
        + '<div class="mock-fullimg"></div>'
        + '<div class="mock-overlay">'
        + '<div class="mock-catch"></div>'
        + '<div class="mock-cta"></div>'
        + '</div>'
        + '</div>';
    }
    return '<div class="tpl-preview">'
      + '<div class="mock-label"></div>'
      + '<div class="mock-catch"></div>'
      + '<div class="mock-catch-s"></div>'
      + '<div class="mock-line"></div>'
      + '<div class="mock-item"></div>'
      + '<div class="mock-item-s"></div>'
      + '<div class="mock-cta"></div>'
      + '</div>';
  }

})();
