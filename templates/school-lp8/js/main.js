'use strict';

/* ============================================================
   DOMContentLoaded: 全処理の起点
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNoticeBanner();
  initHamburger();
  initSmoothScroll();
  initHeaderScroll();
  initFaq();
  initTabs();
  initScrollAnimation();
  initBackToTop();
  initFloatingCta();
  initContactForm();
  initHeroParallax();
});

/* ============================================================
   重要なお知らせバナーを閉じる
   ============================================================ */
function initNoticeBanner() {
  const banner = document.getElementById('noticeBanner');
  const closeBtn = document.getElementById('noticeBannerClose');
  if (!banner || !closeBtn) return;

  // セッション中に閉じた記憶があれば非表示
  if (sessionStorage.getItem('noticeBannerClosed')) {
    banner.classList.add('hidden');
  }

  closeBtn.addEventListener('click', () => {
    banner.classList.add('hidden');
    sessionStorage.setItem('noticeBannerClosed', '1');
  });
}

/* ============================================================
   ハンバーガーメニュー（スマホ）
   ============================================================ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('active');
    nav.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    // body スクロール制御
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ナビリンクをクリックしたら閉じる
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ナビ外クリックで閉じる
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      btn.classList.remove('active');
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   スムーススクロール
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const header     = document.getElementById('header');
      const noticeBanner = document.getElementById('noticeBanner');
      const headerH    = header ? header.offsetHeight : 0;
      const noticeH    = (noticeBanner && !noticeBanner.classList.contains('hidden'))
                         ? noticeBanner.offsetHeight : 0;
      const offset     = headerH + noticeH + 8;

      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   スクロール時のヘッダースタイル変更
   ============================================================ */
function initHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 初期実行
}

/* ============================================================
   FAQ アコーディオン
   ============================================================ */
function initFaq() {
  const items = document.querySelectorAll('.faq__item');
  items.forEach(item => {
    const btn    = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // 他を閉じる（任意: 1つだけ開くアコーディオン）
      items.forEach(other => {
        const otherBtn    = other.querySelector('.faq__question');
        const otherAnswer = other.querySelector('.faq__answer');
        if (other !== item && otherBtn && otherAnswer) {
          otherBtn.setAttribute('aria-expanded', 'false');
          otherAnswer.setAttribute('aria-hidden', 'true');
        }
      });

      btn.setAttribute('aria-expanded', String(!isOpen));
      answer.setAttribute('aria-hidden', String(isOpen));
    });
  });
}

/* ============================================================
   教室案内タブ切り替え
   ============================================================ */
function initTabs() {
  const tabs  = document.querySelectorAll('.tab');
  const areas = document.querySelectorAll('.school__area');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.area;

      tabs.forEach(t => {
        t.classList.toggle('tab--active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });

      areas.forEach(area => {
        if (area.id === target) {
          area.classList.remove('school__area--hidden');
          area.setAttribute('aria-hidden', 'false');
        } else {
          area.classList.add('school__area--hidden');
          area.setAttribute('aria-hidden', 'true');
        }
      });
    });
  });
}

/* ============================================================
   スクロールアニメーション（Intersection Observer）
   ============================================================ */
function initScrollAnimation() {
  // アニメーション対象要素に .fade-in クラスを付与
  const targets = [
    '.why__card',
    '.feature-card',
    '.course-card',
    '.school-card',
    '.testimonial-card',
    '.faq__item',
    '.trial__step',
    '.about__stat',
    '.news__item',
  ];

  targets.forEach((selector, groupIndex) => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('fade-in');
      // グループ内の index に応じて遅延を設定（0〜3の4段階）
      const delayClass = `fade-in-delay-${Math.min(i % 4, 3) + 1}`;
      el.classList.add(delayClass);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // 一度だけ実行
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

/* ============================================================
   トップへ戻るボタン
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   固定CTAボタン（スクロール後に表示）
   ============================================================ */
function initFloatingCta() {
  const cta = document.getElementById('floatingCta');
  if (!cta) return;

  const onScroll = () => {
    cta.classList.toggle('visible', window.scrollY > 300);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   お問い合わせフォームバリデーション
   ============================================================ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  // リアルタイムバリデーション
  const nameInput    = form.querySelector('#name');
  const emailInput   = form.querySelector('#email');
  const messageInput = form.querySelector('#message');
  const privacyInput = form.querySelector('#privacy');

  [nameInput, emailInput, messageInput].forEach(input => {
    if (!input) return;
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    if (!validateField(nameInput))    isValid = false;
    if (!validateField(emailInput))   isValid = false;
    if (!validateField(messageInput)) isValid = false;

    // プライバシーポリシー
    const privacyError = document.getElementById('privacyError');
    if (privacyInput && !privacyInput.checked) {
      if (privacyError) privacyError.textContent = 'プライバシーポリシーへの同意が必要です。';
      isValid = false;
    } else if (privacyError) {
      privacyError.textContent = '';
    }

    if (!isValid) return;

    // ▼ ここに実際の送信処理（fetch/Ajaxなど）を追加してください
    // 例: submitForm(form);

    // デモ用: 送信成功の表示
    showFormSuccess(form);
  });
}

function validateField(input) {
  if (!input) return true;

  const errorEl = document.getElementById(`${input.id}Error`);
  let message = '';

  if (input.required && !input.value.trim()) {
    message = 'この項目は必須です。';
  } else if (input.type === 'email' && input.value.trim()) {
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(input.value.trim())) {
      message = '正しいメールアドレスを入力してください。';
    }
  }

  if (errorEl) errorEl.textContent = message;
  input.classList.toggle('error', !!message);

  return !message;
}

function showFormSuccess(form) {
  // 送信成功メッセージを挿入
  let successEl = form.parentNode.querySelector('.form-success');
  if (!successEl) {
    successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.innerHTML = `
      <i class="fa-solid fa-circle-check"></i>
      <h3>送信が完了しました！</h3>
      <p>お問い合わせいただきありがとうございます。<br />
         担当者より3営業日以内にご連絡いたします。</p>
    `;
    form.parentNode.insertBefore(successEl, form);
  }

  form.style.display = 'none';
  successEl.classList.add('show');

  // ページトップへスクロール
  successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* ============================================================
   ヒーローセクション パララックス
   ============================================================ */
function initHeroParallax() {
  const heroBg = document.querySelector('.hero__bg');
  if (!heroBg) return;

  // 画像がある場合はロードアニメーションを発火
  heroBg.classList.add('loaded');

  // スクロールパララックス（軽量なtransform方式）
  const onScroll = () => {
    const scrollY = window.scrollY;
    const heroEl  = document.getElementById('hero');
    if (!heroEl) return;
    const heroH = heroEl.offsetHeight;
    if (scrollY < heroH) {
      heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ============================================================
   ユーティリティ: スロットル（パフォーマンス最適化）
   ============================================================ */
function throttle(fn, wait) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last < wait) return;
    last = now;
    fn(...args);
  };
}
