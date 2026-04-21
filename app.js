/* =========================================================
   APEX IA — Interactions
   ========================================================= */

// --- Split hero words into .word spans for staggered rise ---
(function splitHero() {
  document.querySelectorAll('.hero__line').forEach(line => {
    const html = line.innerHTML;
    // Wrap full line content in one .word so the existing CSS keyframes drive it
    line.innerHTML = `<span class="word">${html}</span>`;
  });
})();

// --- Generic reveal on scroll ---
(function reveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// --- Triade trigger ---
(function triade() {
  const stage = document.getElementById('triade-stage');
  if (!stage) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        stage.classList.add('in-view');
        io.disconnect();
      }
    });
  }, { threshold: 0.2 });
  io.observe(stage);
})();

// --- Checklist items animate in ---
(function check() {
  const items = document.querySelectorAll('.check li');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const idx = [...items].indexOf(e.target);
        setTimeout(() => e.target.classList.add('in-view'), idx * 140);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  items.forEach(el => io.observe(el));
})();

// --- Weights bar trigger ---
(function weights() {
  const w = document.querySelector('.weights');
  if (!w) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { w.classList.add('in-view'); io.disconnect(); }
    });
  }, { threshold: 0.3 });
  io.observe(w);
})();

// --- Rule meter trigger ---
(function rule() {
  const r = document.querySelector('.rule');
  if (!r) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { r.classList.add('in-view'); io.disconnect(); }
    });
  }, { threshold: 0.4 });
  io.observe(r);
})();

// --- Phases rail: scroll-linked fill + active dot ---
(function phaseRail() {
  const container = document.getElementById('phases');
  const fill = document.getElementById('rail-fill');
  if (!container || !fill) return;

  const phases = container.querySelectorAll('.phase');

  function onScroll() {
    const rect = container.getBoundingClientRect();
    const viewH = window.innerHeight;
    const total = rect.height;
    const scrolled = Math.min(Math.max(viewH * 0.5 - rect.top, 0), total);
    const pct = (scrolled / total) * 100;
    fill.style.height = pct + '%';

    // active marker: whichever phase center is nearest to viewport middle
    let bestIdx = 0, bestDist = Infinity;
    phases.forEach((p, i) => {
      const r = p.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const dist = Math.abs(center - viewH / 2);
      if (dist < bestDist) { bestDist = dist; bestIdx = i; }
    });
    phases.forEach((p, i) => p.classList.toggle('active', i === bestIdx));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();

// --- Mini-Brief: typewriter reveal when in view ---
(function typewriter() {
  const card = document.getElementById('brief-card');
  if (!card) return;

  const rows = card.querySelectorAll('[data-type]');
  rows.forEach(r => {
    r.dataset.final = r.textContent;
    r.textContent = '';
  });

  let started = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !started) {
        started = true;
        runType(rows, 0);
        io.disconnect();
      }
    });
  }, { threshold: 0.3 });
  io.observe(card);

  function runType(list, i) {
    if (i >= list.length) return;
    const el = list[i];
    const text = el.dataset.final;
    let n = 0;
    const speed = text.length > 40 ? 12 : 24;
    const tick = () => {
      n++;
      el.textContent = text.slice(0, n);
      if (n < text.length) setTimeout(tick, speed);
      else setTimeout(() => runType(list, i + 1), 180);
    };
    tick();
  }
})();

// --- Nav active link tracking ---
(function navActive() {
  const links = document.querySelectorAll('.nav__links a');
  const map = new Map();
  links.forEach(a => {
    const id = a.getAttribute('href').replace('#', '');
    const sec = document.getElementById(id);
    if (sec) map.set(sec, a);
  });
  if (!map.size) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      const link = map.get(e.target);
      if (!link) return;
      if (e.isIntersecting) {
        links.forEach(l => l.style.color = '');
        link.style.color = 'var(--accent)';
        link.style.opacity = '1';
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, sec) => io.observe(sec));
})();
