// Pantalla "Estamos trabajando": la página queda tapada hasta que se dé de
// alta. Para verla igual: finanzas.html?ver=neko-prueba (queda recordado mientras
// dure la pestaña). Para darla de alta: sacar class="mnt" del <html> y este script.
(function () {
  var ok = false;
  try {
    if (new URLSearchParams(location.search).get("ver") === "neko-prueba") sessionStorage.setItem("nekoVer", "1");
    ok = sessionStorage.getItem("nekoVer") === "1";
  } catch (error) {
    /* sin sessionStorage: queda la pantalla de mantenimiento */
  }
  if (ok) document.documentElement.classList.remove("mnt");
})();
