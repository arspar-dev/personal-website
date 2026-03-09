/* ── NAV ── */
const nav    = document.getElementById('nav');
const toggle = document.getElementById('nav-toggle');
const links  = document.getElementById('nav-links');
const topBtn = document.getElementById('scroll-top');

if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    if (topBtn) topBtn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });
}

if (toggle && links) {
  toggle.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  document.addEventListener('click', e => { if (!nav.contains(e.target)) links.classList.remove('open'); });
}

if (topBtn) topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── SCROLL ANIMATIONS ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || 0);
    setTimeout(() => entry.target.classList.add('in'), delay);
    io.unobserve(entry.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-anim]').forEach(el => io.observe(el));

/* ── COUNTERS ── */
function counter(el, target, ms = 1400) {
  const large = target >= 1000;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / ms, 1);
    const eased = 1 - (1 - p) ** 3;
    const v = Math.floor(eased * target);
    el.textContent = large ? v.toLocaleString('en-US') : v;
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = large ? target.toLocaleString('en-US') : target;
  })(t0);
}

const metricsIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('[data-count]').forEach(el => {
      counter(el, parseInt(el.dataset.count, 10));
    });
    metricsIO.unobserve(entry.target);
  });
}, { threshold: 0.4 });

const metricsRow = document.querySelector('.metrics-row');
if (metricsRow) metricsIO.observe(metricsRow);

/* ── NEWSLETTER ── */
const nlForm = document.getElementById('nl-form');
const nlOk   = document.getElementById('nl-success');

if (nlForm) {
  nlForm.addEventListener('submit', e => {
    e.preventDefault();
    // TODO: connect to ConvertKit / Mailchimp / Resend
    nlForm.style.display = 'none';
    if (nlOk) nlOk.classList.add('show');
  });
}

/* ── SMOOTH ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.querySelector(a.getAttribute('href'));
    if (!el) return;
    e.preventDefault();
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 76, behavior: 'smooth' });
  });
});
