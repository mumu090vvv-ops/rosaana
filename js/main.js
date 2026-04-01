(function () {
  "use strict";

  function cfg() {
    return window.ROSAANA_CONFIG || {};
  }

  function waUrl(text) {
    const num = (cfg().whatsappNumber || "").replace(/\D/g, "");
    if (!num) return "#contacto";
    const t = text || cfg().defaultOrderMessage || "Hola, quiero hacer un pedido.";
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(t);
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      const extra = el.getAttribute("data-whatsapp") || "";
      const base = cfg().defaultOrderMessage || "";
      window.location.href = waUrl(base + extra);
    });
  });

  const mapsBtn = document.querySelector("[data-maps]");
  if (mapsBtn) {
    mapsBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const q = cfg().mapsQuery || cfg().address || "";
      const url =
        "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const c = cfg();
  document.querySelectorAll("[data-bind-address]").forEach(function (el) {
    if (c.address) el.textContent = c.address;
  });
  document.querySelectorAll("[data-bind-phone]").forEach(function (el) {
    if (c.phoneDisplay) el.textContent = c.phoneDisplay;
  });
  document.querySelectorAll("[data-bind-instagram]").forEach(function (el) {
    if (c.instagramHandle) el.textContent = c.instagramHandle;
  });
  document.querySelectorAll("a[data-bind-instagram-link]").forEach(function (el) {
    if (c.instagram) el.href = c.instagram;
  });
  document.querySelectorAll("a[data-bind-facebook-link]").forEach(function (el) {
    if (c.facebook) el.href = c.facebook;
  });

  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  function closeNav() {
    if (navLinks) navLinks.classList.remove("is-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const open = !navLinks.classList.contains("is-open");
      navLinks.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.classList.toggle("nav-open", open);
    });

    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeNav();
      });
    });
  }

  let scrollTick = false;
  window.addEventListener("scroll", function () {
    if (!header) return;
    if (!scrollTick) {
      window.requestAnimationFrame(function () {
        header.classList.toggle("is-scrolled", window.scrollY > 40);
        scrollTick = false;
      });
      scrollTick = true;
    }
  });

  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  function setActiveNav() {
    const y = window.scrollY + 120;
    let current = "inicio";
    sections.forEach(function (sec) {
      const top = sec.offsetTop;
      const h = sec.offsetHeight;
      if (y >= top && y < top + h) current = sec.id;
    });
    navAnchors.forEach(function (a) {
      const id = a.getAttribute("href").slice(1);
      a.classList.toggle("is-active", id === current);
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();
})();
