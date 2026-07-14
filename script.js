/* Your Safety Partners — interactions */
(function () {
  'use strict';

  /* ---- Seamless logo marquee: clone each track's set once, then start ----
     Duplicating in JS keeps the markup to one unique set per row; the exact
     clone makes translateX(-50%) land copy #2 on copy #1 with zero jump. */
  document.querySelectorAll('[data-marquee]').forEach(function (track) {
    var originals = Array.prototype.slice.call(track.children);
    originals.forEach(function (node) { track.appendChild(node.cloneNode(true)); });
    track.classList.add('is-ready');
  });

  /* ---- Extend scroll-reveal to section headers & key blocks ----
     (all below the hero fold, so adding the hidden state now causes no flash) */
  ['.section__head', '.faq__head', '.band__inner', '.simple__lead', '.simple__qs',
   '.resp__text', '.resp__note', '.portal__text', '.portal__panel', '.contact__text',
   '.contact__form-wrap', '.services__cta', '.step', '.acc'
  ].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add('reveal');
      if (!el.hasAttribute('data-delay') && i % 4) el.setAttribute('data-delay', String(i % 4));
    });
  });

  /* ---- Scroll reveal ---- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Mobile nav ---- */
  var burger = document.querySelector('.burger');
  var mnav = document.querySelector('.mobile-nav');
  if (burger && mnav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mnav.hidden = open;
    });
    mnav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        burger.setAttribute('aria-expanded', 'false');
        mnav.hidden = true;
      });
    });
  }

  /* ---- Accordion: single-open behaviour ---- */
  var accs = document.querySelectorAll('.accordion .acc');
  accs.forEach(function (acc) {
    acc.addEventListener('toggle', function () {
      if (acc.open) {
        accs.forEach(function (o) { if (o !== acc) o.open = false; });
      }
    });
  });

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector('.header');
  var onScroll = function () {
    if (window.scrollY > 12) header.style.boxShadow = '0 8px 30px -18px rgba(24,25,27,.4)';
    else header.style.boxShadow = 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Card cursor-glow (Aceternity Card Spotlight / Glowing Effect) ---- */
  var fine = window.matchMedia('(pointer:fine)').matches;
  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---- Comet Card: cursor-tracking 3D tilt + moving glare on the small cards ----
     (Aceternity's CometCard, rebuilt in vanilla JS.) It's pointer-driven and
     interactive, so we keep it even under reduced-motion — nothing moves on its own. */
  if (fine) {
    document.querySelectorAll('.svc, .pillar, .post, .review').forEach(function (card) {
      card.classList.add('comet');
      var glare = document.createElement('span');
      glare.className = 'comet__glare';
      card.appendChild(glare);
      card.addEventListener('pointerenter', function () { card.classList.add('is-tilting'); });
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        card.style.transform = 'perspective(1000px) rotateX(' + ((0.5 - py) * 9).toFixed(2) +
          'deg) rotateY(' + ((px - 0.5) * 9).toFixed(2) + 'deg) scale(1.03)';
        glare.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        glare.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', function () {
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });

    /* ---- Hero callback card tilt ---- */
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = 6;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateX(' + (-py * max) + 'deg) rotateY(' + (px * max) + 'deg) translateY(-4px)';
      });
      el.addEventListener('pointerleave', function () {
        el.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
      });
    });
  }

  /* ---- Count-up on numeric stats (value change conveys meaning) ---- */
  if (!reduced && 'IntersectionObserver' in window) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; countObs.unobserve(el);
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var dur = 1100, start = null;
        function tick(now) {
          if (start === null) start = now;
          var p = Math.min((now - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });
  }

  /* ---- Demo form feedback (no backend) ---- */
  document.querySelectorAll('form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      if (!btn) return;
      var original = btn.textContent;
      btn.textContent = '✓ Thank you — we\'ll be in touch';
      btn.style.background = '#1a1b1d';
      btn.style.color = '#FAB702';
      setTimeout(function () {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
      }, 3200);
    });
  });
})();
