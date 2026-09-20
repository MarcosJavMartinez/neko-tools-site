// Anti-clickjacking: sin acceso a headers del servidor no podemos usar
// X-Frame-Options / frame-ancestors, así que si alguien mete la página en un
// iframe la ocultamos y la sacamos del marco.
if (window.top !== window.self) {
  document.documentElement.style.display = "none";
  try {
    window.top.location.href = window.self.location.href;
  } catch (error) {
    /* navegación bloqueada: al menos queda oculta */
  }
}
