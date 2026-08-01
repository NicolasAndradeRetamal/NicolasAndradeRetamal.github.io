const root = document.documentElement;
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
const systemTheme = window.matchMedia("(prefers-color-scheme: light)");

const storedTheme = localStorage.getItem("tema");
if (storedTheme === "light" || storedTheme === "dark")
  root.dataset.theme = storedTheme;

const getTheme = () =>
  root.dataset.theme || (systemTheme.matches ? "light" : "dark");
const themeToggle = document.querySelector("[data-theme-toggle]");

const updateThemeLabel = () => {
  if (!themeToggle) return;
  themeToggle.setAttribute(
    "aria-label",
    getTheme() === "dark" ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
  );
};

updateThemeLabel();
themeToggle?.addEventListener("click", () => {
  const nextTheme = getTheme() === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  localStorage.setItem("tema", nextTheme);
  updateThemeLabel();
});
systemTheme.addEventListener?.("change", updateThemeLabel);

const year = document.querySelector("[data-year]");
if (year) year.textContent = String(new Date().getFullYear());

const topbar = document.querySelector("[data-topbar]");
const updateTopbar = () =>
  topbar?.classList.toggle("is-stuck", window.scrollY > 8);
updateTopbar();
window.addEventListener("scroll", updateTopbar, { passive: true });

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

if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -7% 0px", threshold: 0.06 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((element) => element.classList.add("is-in"));
}

const hero = document.querySelector(".hero");
const glow = document.querySelector(".hero__glow");
if (
  hero &&
  glow &&
  !reduceMotion &&
  window.matchMedia("(pointer: fine)").matches
) {
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
