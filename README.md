# nicolasandraderetamal.github.io

Sitio personal de Nicolás Andrade Retamal, desarrollador fullstack. Presenta la
trayectoria profesional y los cuatro proyectos desplegados, con enlace a la demo
y al código de cada uno.

**En línea:** <https://nicolasandraderetamal.github.io>

## Cómo está hecho

Una sola página estática, sin dependencias ni proceso de compilación: HTML,
CSS y JavaScript nativo. Se publica en GitHub Pages directamente desde `main`.

- `index.html` — todo el contenido, con marcado semántico
- `styles.css` — sistema de tokens, temas claro y oscuro, y adaptación a móvil
- `main.js` — conmutador de tema, entrada progresiva al desplazar y resplandor que
  sigue al puntero
- `img/` — capturas reales de cada aplicación desplegada
- `cv/` — currículum: `cv.html` es la fuente y `nicolas-andrade-cv.pdf` se genera
  desde ahí imprimiendo a PDF, así el contenido se mantiene versionado

Sigue la preferencia de tema del sistema, respeta `prefers-reduced-motion`, se
navega completo por teclado y no carga recursos de terceros.

## Desarrollo

Cualquier servidor estático sirve:

```bash
python -m http.server 4321
```

Luego abrir <http://localhost:4321>.
