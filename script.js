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

    /* JS-driven continuous scroll — NOT affected by reduced-motion engine gating,
       so the strip moves on every browser/OS setting. */
    var dir = track.classList.contains('marquee__track--reverse') ? 1 : -1;
    var speed = 45; // px per second
    var half = track.scrollWidth / 2;
    var measure = function () { var h = track.scrollWidth / 2; if (h) half = h; };
    window.addEventListener('load', measure);
    window.addEventListener('resize', measure);
    var x = dir === 1 ? -half : 0;
    var last = null;
    function step(ts) {
      if (last === null) last = ts;
      var dt = (ts - last) / 1000; last = ts;
      if (dt > 0.12) dt = 0.016; // clamp big jumps after the tab was backgrounded
      if (!half) measure();
      x += dir * speed * dt;
      if (x <= -half) x += half;
      if (x >= 0) x -= half;
      track.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
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

  /* ---- Professional scroll reveal (Web Animations API) ----
     Driven in JS so it plays even when the OS "reduce motion" setting would
     otherwise gate CSS animations. Fade + rise, cubic ease-out, staggered. */
  var reveals = document.querySelectorAll('.reveal');
  var canAnimate = 'IntersectionObserver' in window && typeof document.body.animate === 'function';
  // Only hide reveals now that JS is confirmed running (no-JS keeps content visible).
  document.documentElement.classList.add('reveal-ready');

  function showReveal(el, animate) {
    if (el.classList.contains('in')) return;
    el.classList.add('in');
    if (animate) {
      /* transform-only: content stays fully visible; this just adds a subtle rise.
         Never animates opacity, so nothing can be left invisible. */
      el.animate(
        [{ transform: 'translateY(22px)' }, { transform: 'translateY(0)' }],
        { duration: 640, delay: (parseInt(el.getAttribute('data-delay') || '0', 10)) * 85, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'backwards' }
      );
    }
  }

  if (canAnimate) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target; io.unobserve(el);
        showReveal(el, true);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });

    /* Safety net: if nothing revealed within 3s (observer never fired, e.g. the
       tab loaded in the background), just show everything so content is never lost. */
    setTimeout(function () {
      var any = Array.prototype.some.call(reveals, function (el) { return el.classList.contains('in'); });
      if (!any) reveals.forEach(function (el) { showReveal(el, false); });
    }, 3000);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        reveals.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) showReveal(el, true);
        });
      }
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Link service cards to their detail sections on services.html ---- */
  (function () {
    var map = {
      'Traffic Management': 'traffic-management', 'Safety Training': 'safety-training',
      'Machine Safety': 'machine-safety', 'Plant & Equipment': 'plant-equipment',
      'Job Safety Analysis': 'job-safety-analysis', 'Psychosocial Health': 'psychosocial-health',
      'Confined Spaces': 'confined-spaces', 'Working at Heights': 'working-at-heights',
      'Contractor Management': 'contractor-management', 'Standard Operating Procedures': 'standard-operating-procedures',
      'Incident Investigations': 'incident-investigations', 'Safety Audits': 'safety-audits'
    };
    document.querySelectorAll('.svc').forEach(function (card) {
      var h = card.querySelector('h3'), link = card.querySelector('.svc__link');
      if (!h || !link) return;
      var id = map[h.textContent.trim()];
      if (id) link.setAttribute('href', 'service.html?s=' + id);
    });
    /* On the Services overview page, point each row's button to its full detail page */
    document.querySelectorAll('.about__row[id]').forEach(function (row) {
      var b = row.querySelector('.btn');
      if (b) { b.setAttribute('href', 'service.html?s=' + row.id); b.textContent = 'View this service'; }
    });
  })();

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

  var reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* Cards use a clean CSS hover lift only — no 3D tilt or glare (kept intentionally
     restrained for a professional, editorial feel rather than playful motion). */

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
