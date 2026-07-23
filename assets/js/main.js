(function () {
  "use strict";

  var root = document.documentElement;

  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit === "dark" || explicit === "light") return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  // Stamp the chosen theme onto every internal link so it survives
  // navigation even when localStorage doesn't carry over between pages
  // (e.g. opening the files directly via file:// rather than a server).
  function propagateThemeToLinks(theme) {
    // note: href*=".html" (not $=) so this still matches links this
    // function has already rewritten once (they no longer end in ".html"
    // once a "?theme=" query string is appended)
    document.querySelectorAll('a[href*=".html"]').forEach(function (a) {
      var href = a.getAttribute("href");
      var base = href.split("?")[0];
      a.setAttribute("href", base + "?theme=" + theme);
    });
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    propagateThemeToLinks(theme);

    var url = new URL(location.href);
    url.searchParams.set("theme", theme);
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  }

  propagateThemeToLinks(currentTheme());

  var toggle = document.querySelector(".theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });
  }

  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav__links");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
})();
