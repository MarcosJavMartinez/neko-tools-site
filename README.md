# Neko Tools

Sitio de [Neko Tools](https://nekotools.site): presenta Neko Lista (`index.html`) y Neko Finanzas (`finanzas.html`), las herramientas de la marca, y adelanta las próximas.

### 🌐 [Ver sitio en vivo →](https://nekotools.site)

## 📸 Vista previa

![Hero de Neko Tools](docs/hero.jpg)

<details>
<summary>Más capturas: galería de Neko Lista, sección "próximamente", versión mobile</summary>

![Galería de capturas reales de la app](docs/galeria.jpg)
![Sección "más herramientas, pronto" con la caja abierta](docs/proximamente.jpg)
![Hero en mobile](docs/hero-mobile.jpg)

</details>

## ✨ Detalles

- Contenido que aparece al hacer scroll (`IntersectionObserver`) y microinteracciones de hover en toda la página.
- Menú propio en mobile (hamburguesa con las secciones y el CTA), en vez de solo esconder los links.
- Caja "próximamente" interactiva: un tap o un hover la abre y muestra, en abanico, un adelanto animado de las próximas herramientas.
- Modo claro/oscuro y SEO técnico: `sitemap.xml`, `robots.txt`, datos estructurados JSON-LD, Open Graph y Twitter Card.

## 🛠️ Stack

Sitio estático: HTML, CSS y JavaScript vanilla, sin build ni frameworks. Una página por herramienta (`index.html` para Neko Lista, `finanzas.html` para Neko Finanzas) que comparten `site.css`, `site.js` e `i18n.js`; `img/` tiene los assets reales (logos, marca y capturas de las apps). La página de Neko Finanzas usa los mismos componentes con el tema cian (`body.page-finanzas` en `site.css`).

## 🚀 Deploy

Este repo se despliega por Git a Hostinger, apuntando al dominio `nekotools.site`. Cualquier push a `master` se refleja en el sitio.

## 👤 Autor

Desarrollado por [Marcos Martínez](https://github.com/MarcosJavMartinez), bajo la marca Neko Tools.
