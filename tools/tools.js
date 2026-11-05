/* My Tools slide: inserted between "works" and the contact finale.
   Does not modify app.js / app.css — it only adds one section to the DOM. */
(function () {
  var W = 1672, H = 941;
  // sprite boxes cut from the design (px in the 1672x941 design)
  var ICONS = [
    { f: 'gpt', x: 227,  y: 85, w: 175, h: 164, d: 5.2, dl: 0,    s: 0.00 },
    { f: 'pin', x: 533,  y: 56, w: 135, h: 127, d: 4.6, dl: -1.2, s: 0.07 },
    { f: 'fig', x: 782,  y: 55, w: 144, h: 137, d: 5.6, dl: -2.1, s: 0.14 },
    { f: 'ps',  x: 1040, y: 93, w: 166, h: 154, d: 4.9, dl: -0.6, s: 0.21 }
  ];
  var LENSES = [
    { cx: 1105, cy: 386, rx: 25, ry: 21, rot: -6, gd: 1.0 },
    { cx: 1192, cy: 383, rx: 36, ry: 22, rot: 8,  gd: 1.12 }
  ];
  var base = (function () {
    var s = document.currentScript && document.currentScript.src;
    return s ? s.replace(/[^\/]*$/, '') : './tools/';
  })();
  var pct = function (v, t) { return (v / t * 100).toFixed(3) + '%'; };

  function build() {
    var sec = document.createElement('section');
    sec.className = 'mt'; sec.id = 'my-tools'; sec.setAttribute('aria-label', 'My tools');
    var h = '<div class="mt-stage"><img class="mt-bg" alt="My Tools — a set of modern tools for creativity and productivity" src="' + base + 'bg.jpg" draggable="false">';
    LENSES.forEach(function (l) {
      h += '<div class="mt-lens" style="left:' + pct(l.cx - l.rx, W) + ';top:' + pct(l.cy - l.ry, H) +
           ';width:' + pct(l.rx * 2, W) + ';height:' + pct(l.ry * 2, H) + ';transform:rotate(' + l.rot + 'deg);--gd:' + l.gd + 's"></div>';
    });
    h += '<span class="mt-star" style="left:' + pct(1112, W) + ';top:' + pct(376, H) + ';--gd:1.2s"></span>';
    h += '<span class="mt-star" style="left:' + pct(1212, W) + ';top:' + pct(374, H) + ';--gd:1.32s;width:1.8cqw;height:1.8cqw"></span>';
    ICONS.forEach(function (i) {
      h += '<div class="mt-ico" data-s="' + i.s + '" style="left:' + pct(i.x, W) + ';top:' + pct(i.y, H) +
           ';width:' + pct(i.w, W) + ';height:' + pct(i.h, H) + '"><div class="mt-ico-in" style="--d:' + i.d + 's;--dl:' + i.dl +
           's"><img alt="" src="' + base + i.f + '.png" draggable="false"></div></div>';
    });
    sec.innerHTML = h + '</div>';
    return sec;
  }

  var clamp = function (v) { return Math.max(0, Math.min(1, v)); };
  var ease = function (t) { return 1 - Math.pow(1 - t, 3); };

  function init(sec) {
    var stage = sec.querySelector('.mt-stage');
    var icons = [].slice.call(sec.querySelectorAll('.mt-ico'));
    var raf = 0;
    function update() {
      raf = 0;
      var r = sec.getBoundingClientRect(), vh = window.innerHeight || 800;
      // enter: icons rise from the bottom of the slide while it scrolls into view
      var enter = clamp((vh * 0.95 - r.top) / (vh * 0.75));
      // exit: they fade away as we scroll down towards "Get in touch"
      var exit = clamp((vh * 0.9 - r.bottom) / (vh * 0.55));
      var sh = stage.clientHeight;
      icons.forEach(function (el) {
        var s = parseFloat(el.dataset.s) || 0;
        var e = ease(clamp((enter - s) / (1 - s)));
        var x = ease(clamp((exit - s * 0.5) / (1 - s * 0.5)));
        var up = (1 - e) * sh * 0.85 - x * sh * 0.22;
        el.style.opacity = (e * (1 - x)).toFixed(3);
        el.style.transform = 'translate3d(0,' + up.toFixed(1) + 'px,0) scale(' + (0.7 + 0.3 * e - 0.12 * x).toFixed(3) + ')';
      });
    }
    function req() { if (!raf) raf = requestAnimationFrame(update); }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req);
    update();
  }

  var tries = 0;
  (function place() {
    var fin = document.querySelector('.finale');
    if (fin && fin.parentNode) {
      if (document.getElementById('my-tools')) return;
      var sec = build();
      fin.parentNode.insertBefore(sec, fin);
      init(sec);
      return;
    }
    if (++tries < 200) setTimeout(place, 50);
  })();
})();
