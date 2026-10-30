// Меню, появление блоков при прокрутке, ползунок «до и после», карта лица
document.documentElement.classList.add('js');

const burger = document.querySelector('.burger');
const nav = document.getElementById('nav');
burger?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
  nav.classList.remove('open');
  burger?.setAttribute('aria-expanded', false);
  document.body.style.overflow = '';
}));
document.querySelector('.nav__btn')?.addEventListener('click', (e) => {
  const item = e.currentTarget.parentElement;
  e.currentTarget.setAttribute('aria-expanded', item.classList.toggle('open'));
});

// Сцена на первом экране: наклон за мышкой и параллакс при прокрутке.
// SMIL-анимации останавливаем, если человек просит меньше движения
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const scene = document.querySelector('[data-scene]');
if (reduceMotion) document.querySelectorAll('svg.art').forEach((s) => s.pauseAnimations());
else if (scene) {
  const heroEl = scene.parentElement;
  const set = (k, v) => scene.style.setProperty(k, v);
  if (matchMedia('(pointer: fine)').matches) {
    heroEl.addEventListener('pointermove', (e) => {
      const r = heroEl.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      set('--ry', `${x * 12}deg`); set('--rx', `${-y * 9}deg`);
      set('--px', `${x * -18}px`); set('--py', `${y * -12}px`);
      set('--bx', `${x * 24}px`); set('--by', `${y * 18}px`);
    });
    heroEl.addEventListener('pointerleave', () => ['--ry', '--rx', '--px', '--py', '--bx', '--by'].forEach((k) => set(k, '0')));
  }
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { set('--sy', `${Math.min(scrollY, 900) * 0.22}px`); ticking = false; });
  }, { passive: true });
}

// Плавное появление
const rv = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((list) => list.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  rv.forEach((el) => io.observe(el));
} else rv.forEach((el) => el.classList.add('in'));

// До и после
document.querySelectorAll('.ba__range').forEach((r) => {
  r.addEventListener('input', () => r.parentElement.style.setProperty('--pos', r.value + '%'));
});

// Карта лица: точка на лице и вкладка показывают одну и ту же зону
document.querySelectorAll('[data-fm]').forEach((fm) => {
  const pick = (id) => {
    fm.querySelectorAll('[data-zone]').forEach((el) => el.classList.toggle('on', el.dataset.zone === id));
  };
  fm.querySelectorAll('.fz, .fm__tab').forEach((el) => {
    el.addEventListener('click', () => pick(el.dataset.zone));
    el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(el.dataset.zone); } });
  });
  pick(fm.querySelector('.fm__tab.on')?.dataset.zone);
});
