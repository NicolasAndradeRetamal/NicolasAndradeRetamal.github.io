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

/* ---------- Paleta de comandos ---------- */
const ENTRIES = [
  { label: 'Inicio', desc: 'Volver arriba', kind: 'Sección', href: '#inicio' },
  { label: 'Proyectos', desc: 'Las cuatro aplicaciones', kind: 'Sección', href: '#proyectos' },
  { label: 'Stack', desc: 'Tecnologías con las que trabajo', kind: 'Sección', href: '#stack' },
  { label: 'Trayectoria', desc: 'Experiencia profesional', kind: 'Sección', href: '#trayectoria' },
  { label: 'Contacto', desc: 'Correo, LinkedIn y GitHub', kind: 'Sección', href: '#contacto' },
  {
    label: 'Gestor de Gastos',
    desc: 'C# · .NET · Vue 3 · PostgreSQL · 2FA',
    kind: 'Proyecto',
    href: '#proyecto-gestor',
  },
  {
    label: 'Notas',
    desc: 'Next.js · Prisma · pgvector · búsqueda semántica',
    kind: 'Proyecto',
    href: '#proyecto-notas',
  },
  {
    label: 'Tareas',
    desc: 'Angular · signals · kanban con arrastre',
    kind: 'Proyecto',
    href: '#proyecto-tareas',
  },
  {
    label: 'Clima',
    desc: 'React 19 · TanStack Query · PWA',
    kind: 'Proyecto',
    href: '#proyecto-clima',
  },
  {
    label: 'Descargar CV',
    desc: 'PDF con la experiencia completa',
    kind: 'Acción',
    href: 'cv/nicolas-andrade-cv.pdf',
    external: true,
  },
  {
    label: 'Escribirme un correo',
    desc: 'nicolasandraderetamal@hotmail.com',
    kind: 'Acción',
    href: 'mailto:nicolasandraderetamal@hotmail.com',
    external: true,
  },
  {
    label: 'LinkedIn',
    desc: 'Perfil profesional',
    kind: 'Acción',
    href: 'https://www.linkedin.com/in/nicolas-antonio-andrade-retamal',
    external: true,
  },
  {
    label: 'GitHub',
    desc: 'Código de todos los proyectos',
    kind: 'Acción',
    href: 'https://github.com/NicolasAndradeRetamal',
    external: true,
  },
];

const palette = document.querySelector('[data-palette]');
const input = document.querySelector('[data-palette-input]');
const results = document.querySelector('[data-palette-results]');
const empty = document.querySelector('[data-palette-empty]');
let active = 0;
let visible = ENTRIES;
let lastFocused = null;

// Sin tildes ni mayúsculas: "clima" encuentra "Clima", "grafico" encuentra "gráfico".
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

function render() {
  results.innerHTML = '';
  visible.forEach((entry, index) => {
    const item = document.createElement('li');
    item.setAttribute('role', 'option');
    item.setAttribute('aria-selected', String(index === active));
    item.innerHTML = `<span><strong>${entry.label}</strong><span class="desc">${entry.desc}</span></span><span class="kind">${entry.kind}</span>`;
    item.addEventListener('click', () => go(entry));
    item.addEventListener('pointermove', () => {
      if (active === index) return;
      active = index;
      render();
    });
    results.append(item);
  });
  empty.hidden = visible.length > 0;
  results.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' });
}

function filter(query) {
  const q = normalize(query.trim());
  visible = q
    ? ENTRIES.filter((entry) => normalize(`${entry.label} ${entry.desc} ${entry.kind}`).includes(q))
    : ENTRIES;
  active = 0;
  render();
}

function open() {
  lastFocused = document.activeElement;
  palette.hidden = false;
  input.value = '';
  filter('');
  input.focus();
}

function close() {
  palette.hidden = true;
  lastFocused?.focus?.();
}

function go(entry) {
  close();
  if (entry.external) {
    window.open(entry.href, entry.href.startsWith('http') ? '_blank' : '_self', 'noopener');
    return;
  }
  document.querySelector(entry.href)?.scrollIntoView({
    behavior: reduceMotion ? 'auto' : 'smooth',
    block: 'start',
  });
  history.replaceState(null, '', entry.href);
}

document.querySelectorAll('[data-open-palette]').forEach((button) => {
  button.addEventListener('click', open);
});

document.querySelector('[data-palette-scrim]').addEventListener('click', close);
input.addEventListener('input', () => filter(input.value));

addEventListener('keydown', (event) => {
  const isShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
  if (isShortcut) {
    event.preventDefault();
    palette.hidden ? open() : close();
    return;
  }
  if (palette.hidden) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    close();
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    active = (active + 1) % visible.length;
    render();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    active = (active - 1 + visible.length) % visible.length;
    render();
  } else if (event.key === 'Enter' && visible[active]) {
    event.preventDefault();
    go(visible[active]);
  }
});
