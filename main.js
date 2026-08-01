const root = document.documentElement;
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

/* Tema */
let storedTheme = null;
try {
  storedTheme = localStorage.getItem("tema");
} catch {
  storedTheme = null;
}
if (storedTheme === "light" || storedTheme === "dark")
  root.dataset.theme = storedTheme;

const getTheme = () =>
  root.dataset.theme || (systemTheme.matches ? "light" : "dark");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeColor = document.querySelector('meta[name="theme-color"]');

const updateThemeUI = () => {
  const dark = getTheme() === "dark";
  themeToggle?.setAttribute(
    "aria-label",
    dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
  );
  themeColor?.setAttribute("content", dark ? "#09090d" : "#f8f7f4");
};

updateThemeUI();
themeToggle?.addEventListener("click", () => {
  const nextTheme = getTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  try {
    localStorage.setItem("tema", nextTheme);
  } catch {
    /* almacenamiento no disponible */
  }
  updateThemeUI();
});
systemTheme.addEventListener?.("change", () => {
  if (!root.dataset.theme) updateThemeUI();
});

/* Año */
const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

/* Barra superior, progreso y sección activa */
const topbar = document.querySelector("[data-topbar]");
const progress = document.querySelector("[data-scroll-progress]");

const updateScrollUI = () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  topbar?.classList.toggle("is-stuck", scrollTop > 8);
  if (progress)
    progress.style.transform = `scaleX(${maxScroll > 0 ? scrollTop / maxScroll : 0})`;
};

updateScrollUI();
window.addEventListener("scroll", updateScrollUI, { passive: true });
window.addEventListener("resize", updateScrollUI, { passive: true });

const navLinks = [...document.querySelectorAll("[data-nav-link]")];
const sections = [...document.querySelectorAll("[data-section]")].filter(
  (section) => section.id !== "inicio",
);

const updateActiveSection = () => {
  const marker = window.scrollY + Math.min(window.innerHeight * 0.34, 260);
  let activeId = "";
  for (const section of sections) {
    if (section.offsetTop <= marker) activeId = section.id;
  }

  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
};

updateActiveSection();
window.addEventListener("scroll", updateActiveSection, { passive: true });
window.addEventListener("resize", updateActiveSection, { passive: true });

/* Navegación móvil */
const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");

const closeMenu = () => {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Abrir navegación");
  navigation.classList.remove("is-open");
};

menuToggle?.addEventListener("click", () => {
  if (!navigation) return;
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Cerrar navegación" : "Abrir navegación",
  );
  navigation.classList.toggle("is-open", open);
});

navigation
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});
document.addEventListener("pointerdown", (event) => {
  if (!navigation?.classList.contains("is-open")) return;
  if (navigation.contains(event.target) || menuToggle?.contains(event.target))
    return;
  closeMenu();
});

/* Entrada progresiva */
const revealElements = [...document.querySelectorAll(".reveal")];
revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-order", String(index));
});

if (!reduceMotion && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -7% 0px", threshold: 0.06 },
  );
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-in"));
}

/* Resplandor de portada */
const hero = document.querySelector(".hero");
const glow = document.querySelector(".hero__glow");
if (hero && glow && !reduceMotion && finePointer) {
  hero.addEventListener("pointermove", (event) => {
    const box = hero.getBoundingClientRect();
    glow.style.setProperty(
      "--gx",
      `${((event.clientX - box.left) / box.width) * 100}%`,
    );
    glow.style.setProperty(
      "--gy",
      `${((event.clientY - box.top) / box.height) * 100}%`,
    );
  });
}

/* Foco que sigue al puntero en tarjetas */
if (!reduceMotion && finePointer) {
  document.querySelectorAll("[data-card], [data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      card.style.setProperty("--mx", `${x}px`);
      card.style.setProperty("--my", `${y}px`);
    });
  });

  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--ry", `${x * 2.3}deg`);
      card.style.setProperty("--rx", `${y * -2.1}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}
