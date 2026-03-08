(function($){

  let w, h,
      win = $(window),
      scrollTop,
      timer,
      loading = true,
      offset = 0;

  // ユーザーエージェント検出
  var ua = {};
  ua.name = window.navigator.userAgent.toLowerCase();

  ua.isIE      = (ua.name.indexOf('msie') >= 0 || ua.name.indexOf('trident') >= 0);
  ua.isiPhone  = ua.name.indexOf('iphone') >= 0;
  ua.isiPod    = ua.name.indexOf('ipod') >= 0;
  ua.isiPad    = ua.name.indexOf('ipad') >= 0;
  ua.isiOS     = (ua.isiPhone || ua.isiPod || ua.isiPad);
  ua.isAndroid = ua.name.indexOf('android') >= 0;
  ua.isTablet  = (ua.isiPad || (ua.isAndroid && ua.name.indexOf('mobile') < 0));

  if (ua.isIE) {
    ua.verArray = /(msie|rv:?)\s?([0-9]{1,})([\.0-9]{1,})/.exec(ua.name);
    if (ua.verArray) { ua.ver = parseInt(ua.verArray[2], 10); }
  }
  if (ua.isiOS) {
    ua.verArray = /(os)\s([0-9]{1,})([\_0-9]{1,})/.exec(ua.name);
    if (ua.verArray) { ua.ver = parseInt(ua.verArray[2], 10); }
  }
  if (ua.isAndroid) {
    ua.verArray = /(android)\s([0-9]{1,})([\.0-9]{1,})/.exec(ua.name);
    if (ua.verArray) { ua.ver = parseInt(ua.verArray[2], 10); }
  }

  // ブレークポイント（480px）
  let b = 480;

  const breakPoints = () => {
    // 切り替え時に一度だけ実行
    if (w > b && !$('body').hasClass('pc')) {
      $('body').addClass('pc').removeClass('sp');
    } else if (w <= b && !$('body').hasClass('sp')) {
      $('body').addClass('sp').removeClass('pc');
    }
  };

  const resizeEvent = () => {
    w = window.innerWidth;
    h = win.height();

    // リサイズ操作が終わった0.2秒後に実行
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {

      if (loading) {
        // ページ読み込み時に一度だけ実行
        loading = false;

        $('.para').each(function(i) {
          para_o[i] = $(this).offset().top - h * 5 / 7;
        });

        scrollEvent();

      } else {
        // 横幅が変わった時だけ実行（スマホのがたつき不具合回避）
        if (w > b || w != last_w) {
          $('.para').each(function(i) {
            para_o[i] = $(this).offset().top - h * 5 / 7;
          });
          scrollEvent();
        }
      }

      last_w = win.width();

    }, 200);
  };

  // スクロールイベント
  var para_o = new Array(),
      para_f = new Array();

  function scrollEvent() {
    scrollTop = win.scrollTop();

    // .paraクラスのスクロールアニメーション（doneクラスを付与）
    $('.para').each(function(i) {
      if (scrollTop > para_o[i]) {
        if (para_f[i]) {
          para_f[i] = false;
          $(this).addClass('done');
        }
      }
    });

    // デスクトップでスクロール250px後にヘッダー固定（nav_fixクラス）
    if (scrollTop < 250) {
      if ($('body').hasClass('pc')) {
        $('body').removeClass('nav_fix nav_open');
      }
    } else {
      if ($('body').hasClass('pc')) {
        $('body').addClass('nav_fix');
      }
    }
  }

  // ウィンドウイベント
  win.on({
    'load': function() {
      resizeEvent();
      $('body').addClass('loaded'); // ローディング完了 → ヒーローアニメーション発火
    },
    'resize': function() {
      w = window.innerWidth;
      h = win.height();
      breakPoints();
      resizeEvent();
    },
    'scroll': function() {
      scrollEvent();
    }
  });

  // DOMReady
  $(function() {

    w = window.innerWidth;
    h = win.height();

    breakPoints();

    scrollTop = win.scrollTop();
    last_w = win.width();

    // .paraの初期フラグをtrueにセット
    $('.para').each(function(i) {
      para_f[i] = true;
    });

    // Windows環境の場合クラスを追加
    if (navigator.platform.indexOf("Win") != -1) {
      $('body').addClass('windows');
    }

    // タブレットの場合ビューポートを1200pxに固定
    if (ua.isTablet) {
      $('meta[name=viewport]').attr('content', 'width=1200');
    }

    // ハンバーガーメニュー開閉
    function nav_all() {
      if ($('body').hasClass('nav_open')) {
        $('body').removeClass('nav_open');
      } else {
        $('body').addClass('nav_open');
      }
    }

    $('#ham').on({
      'click': function(e) {
        e.preventDefault();
        nav_all();
      }
    });

  });

})(jQuery);
