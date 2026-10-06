// Script de la página, en archivo aparte (no inline) para poder usar una
// Content-Security-Policy sin 'unsafe-inline' en script-src.

(function () {
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  var STORAGE_KEY = 'neko-theme';

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function effectiveTheme() {
    var stored = root.getAttribute('data-theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-label', theme === 'dark' ? t('theme_to_light_aria') : t('theme_to_dark_aria'));
    }
  }

  try {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      apply(saved);
    } else {
      apply(effectiveTheme());
    }
  } catch (e) {
    apply(effectiveTheme());
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
      apply(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    });
  }
})();

(function () {
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMobileMenu');
  if (!navToggle || !navMenu) return;

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', t('nav_toggle_open_aria'));
    navMenu.classList.remove('is-open');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    navToggle.setAttribute('aria-label', isOpen ? t('nav_toggle_open_aria') : t('nav_toggle_close_aria'));
    navMenu.classList.toggle('is-open', !isOpen);
  });

  navMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      navToggle.focus();
    }
  });

  var desktopQuery = window.matchMedia('(min-width: 761px)');
  var onDesktopChange = function (e) { if (e.matches) closeMenu(); };
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onDesktopChange);
  else desktopQuery.addListener(onDesktopChange);
})();

(function () {
  var boxPop = document.querySelector('.box-pop');
  if (!boxPop) return;

  function setOpen(open) {
    boxPop.classList.toggle('is-open', open);
    boxPop.classList.add('tapped');
    boxPop.setAttribute('aria-pressed', open ? 'true' : 'false');
  }

  boxPop.addEventListener('click', function () {
    setOpen(!boxPop.classList.contains('is-open'));
  });

  boxPop.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      setOpen(!boxPop.classList.contains('is-open'));
    }
  });

  document.addEventListener('click', function (e) {
    if (boxPop.classList.contains('is-open') && !boxPop.contains(e.target)) {
      setOpen(false);
    }
  });
})();

(function () {
  var btn = document.getElementById('btnShareProduct');
  var toast = document.getElementById('toast');
  if (!btn) return;

  // Cada página puede compartir su propio producto con data-share-*.
  var SHARE_URL = btn.dataset.shareUrl || 'https://nekotools.site/#producto';
  var SHARE_TITLE = btn.dataset.shareTitle || 'Neko Lista';
  var SHARE_TEXT_KEY = btn.dataset.shareTextKey || 'share_text';
  var toastHideTimer = null;

  function showToast(message) {
    if (!toast) return;
    clearTimeout(toastHideTimer);
    toast.textContent = message;
    toast.hidden = false;
    toast.getBoundingClientRect();
    toast.classList.add('is-visible');
    toastHideTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
      setTimeout(function () { toast.hidden = true; }, 200);
    }, 2400);
  }

  btn.addEventListener('click', async function () {
    var shareData = { title: SHARE_TITLE, text: t(SHARE_TEXT_KEY), url: SHARE_URL };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (error) {
        // Cerrar el diálogo nativo no es un error; cualquier otra falla del
        // share nativo cae al copiado del link de abajo.
        if (error && error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(SHARE_URL);
      showToast(t('share_toast_copied'));
    } catch (error) {
      window.prompt(t('share_copy_manual'), SHARE_URL);
    }
  });
})();

(function () {
  var items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

  items.forEach(function (el) { io.observe(el); });
})();

(function () {
  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  if (!form || !status) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.textContent = t('contact_status_sending');
    status.className = 'form-status';

    fetch('contact.php', {
      method: 'POST',
      body: new FormData(form),
    })
      .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
      .then(function (result) {
        if (result.ok && result.data && result.data.ok) {
          status.textContent = t('contact_status_ok');
          status.className = 'form-status is-ok';
          form.reset();
        } else {
          status.textContent = t('contact_status_error');
          status.className = 'form-status is-error';
        }
      })
      .catch(function () {
        status.textContent = t('contact_status_error');
        status.className = 'form-status is-error';
      })
      .finally(function () {
        btn.disabled = false;
      });
  });
})();

(function () {
  var toggle = document.getElementById('langToggle');
  var panel = document.getElementById('langPanel');
  if (!toggle || !panel) return;

  function renderOptions() {
    panel.innerHTML = '';
    LANGUAGES.forEach(function (lang) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-option' + (lang.code === currentLang ? ' is-active' : '');
      btn.setAttribute('role', 'menuitemradio');
      btn.setAttribute('aria-checked', lang.code === currentLang ? 'true' : 'false');
      btn.innerHTML = '<span class="flag">' + lang.flag + '</span><span>' + lang.nativeName + '</span>';
      btn.addEventListener('click', function () {
        setLang(lang.code);
        renderOptions();
        closePanel();
      });
      panel.appendChild(btn);
    });
  }

  function openPanel() {
    panel.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  }
  function closePanel() {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var isOpen = panel.classList.contains('is-open');
    if (isOpen) { closePanel(); } else { renderOptions(); openPanel(); }
  });

  document.addEventListener('click', function (e) {
    if (panel.classList.contains('is-open') && !panel.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
      closePanel();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) {
      closePanel();
      toggle.focus();
    }
  });
})();

applyStaticTranslations();

// >>> Neko Finanzas: visor de capturas 
// Capturas de la galería: se abren en grande y el gatito explica cada una.
  (() => {
    const cards = [...document.querySelectorAll(".gallery-card")];
    if (!cards.length || !document.body.classList.contains("page-finanzas")) return;
    let index = 0, box = null, lastFocus = null;
    const show = () => {
      const card = cards[index], img = card.querySelector("img");
      box.querySelector(".lb-img").src = img.src;
      box.querySelector(".lb-img").alt = img.alt;
      box.querySelector(".lb-title").textContent = card.querySelector("h3").textContent;
      box.querySelector(".lb-text").textContent = card.dataset.explain || card.querySelector("p").textContent;
      box.querySelector(".lb-count").textContent = (index + 1) + " de " + cards.length;
      // El gatito va cambiando de lado: a la izquierda en una captura, a la derecha en la siguiente.
      box.classList.toggle("is-right", index % 2 === 1);
      const guide = box.querySelector(".lb-guide");
      guide.style.animation = "none";
      void guide.offsetWidth;
      guide.style.animation = "";
    };
    const close = () => { box?.remove(); box = null; document.documentElement.classList.remove("lb-open"); document.removeEventListener("keydown", onKey); lastFocus?.focus(); };
    const step = (d) => { index = (index + d + cards.length) % cards.length; show(); };
    const onKey = (e) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab") {
        const buttons = [...box.querySelectorAll("button")];
        const at = buttons.indexOf(document.activeElement);
        e.preventDefault();
        buttons[(at + (e.shiftKey ? -1 : 1) + buttons.length) % buttons.length].focus();
      }
    };
    const open = (i, from) => {
      index = i; lastFocus = from;
      box = document.createElement("div");
      box.className = "lb";
      box.setAttribute("role", "dialog");
      box.setAttribute("aria-modal", "true");
      box.setAttribute("aria-label", "Captura de la app");
      box.innerHTML = '<button type="button" class="lb-btn lb-close" aria-label="Cerrar">✕</button>' +
        '<div class="lb-stage">' +
        '<div class="lb-guide"><div class="lb-bubble" aria-live="polite"><strong class="lb-title"></strong><p class="lb-text"></p><span class="lb-count"></span></div>' +
        '<img class="lb-neko" src="img/neko-explicando.webp" alt="" width="280" height="266"></div>' +
        '<img class="lb-img" alt="">' +
        '</div>' +
        '<div class="lb-nav"><button type="button" class="lb-btn lb-prev" aria-label="Captura anterior">‹</button><button type="button" class="lb-btn lb-next" aria-label="Captura siguiente">›</button></div>';
      box.addEventListener("click", (e) => {
        if (e.target.closest(".lb-prev")) step(-1);
        else if (e.target.closest(".lb-next")) step(1);
        else if (e.target.closest(".lb-close") || !e.target.closest(".lb-stage")) close();
      });
      document.body.append(box);
      document.documentElement.classList.add("lb-open");
      document.addEventListener("keydown", onKey);
      show();
      box.querySelector(".lb-next").focus();
    };
    cards.forEach((card, i) => {
      const frame = card.querySelector(".gallery-frame");
      frame.setAttribute("role", "button");
      frame.setAttribute("tabindex", "0");
      frame.setAttribute("aria-label", "Ver en grande: " + card.querySelector("h3").textContent);
      frame.addEventListener("click", () => open(i, frame));
      frame.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(i, frame); } });
    });
  })();
// <<< Neko Finanzas: visor de capturas 
