const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Año del pie */
document.querySelector('[data-year]').textContent = String(new Date().getFullYear());

/* Tema: sigue al sistema salvo que el visitante elija otra cosa */
const root = document.documentElement;
const stored = localStorage.getItem('tema');
if (stored === 'light' || stored === 'dark') root.dataset.theme = stored;

document.querySelector('[data-theme-toggle]').addEventListener('click', () => {
  const sistemaEsClaro = matchMedia('(prefers-color-scheme: light)').matches;
  const actual = root.dataset.theme || (sistemaEsClaro ? 'light' : 'dark');
  const siguiente = actual === 'dark' ? 'light' : 'dark';
  root.dataset.theme = siguiente;
  localStorage.setItem('tema', siguiente);
});

/* Borde de la barra al desplazar */
const topbar = document.querySelector('.topbar');
const onScroll = () => topbar.classList.toggle('is-stuck', window.scrollY > 8);
onScroll();
addEventListener('scroll', onScroll, { passive: true });

/* La marca aparece en la barra cuando el nombre de la portada deja de verse */
const heroTitle = document.querySelector('.hero__title');
if (heroTitle && 'IntersectionObserver' in window) {
  new IntersectionObserver(
    ([entry]) => topbar.classList.toggle('is-past-hero', !entry.isIntersecting),
    { threshold: 0 },
  ).observe(heroTitle);
} else {
  topbar.classList.add('is-past-hero');
}

/* Entrada progresiva de las secciones */
if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
}

/* Resplandor que sigue al puntero en la portada */
const hero = document.querySelector('.hero');
const glow = document.querySelector('.hero__glow');
if (hero && glow && !reduceMotion && matchMedia('(pointer: fine)').matches) {
  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    glow.style.setProperty('--gx', `${((event.clientX - box.left) / box.width) * 100}%`);
    glow.style.setProperty('--gy', `${((event.clientY - box.top) / box.height) * 100}%`);
  });
}
