(function () {
  "use strict";

  function cfg() {
    return window.ROSAANA_CONFIG || {};
  }

  function prices() {
    return cfg().prices || {};
  }

  function formatCOP(n) {
    return "$" + Math.round(n).toLocaleString("es-CO");
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
      const c = cfg();
      var url = c.mapsPlaceUrl;
      if (!url) {
        var q = c.mapsQuery || c.address || "";
        url = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
      }
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
  document.querySelectorAll("[data-bind-hours]").forEach(function (el) {
    var lines = c.hoursLines;
    if (!lines || !lines.length) return;
    el.textContent = "";
    lines.forEach(function (line, i) {
      el.appendChild(document.createTextNode(line));
      if (i < lines.length - 1) el.appendChild(document.createElement("br"));
    });
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

  var empanadaHint = document.getElementById("empanada-price-suelta");
  if (empanadaHint && c.prices && c.prices.empanadaIndividual != null) {
    empanadaHint.textContent = formatCOP(c.prices.empanadaIndividual);
  }

  /* Modal de pedido con cantidades y total */
  var modal = document.getElementById("order-modal");
  var modalTitle = document.getElementById("order-modal-title");
  var modalFields = document.getElementById("order-modal-fields");
  var modalError = document.getElementById("order-modal-error");
  var modalTotal = document.getElementById("order-modal-total-line");
  var sendBtn = document.getElementById("order-modal-send");
  var currentOrder = { type: null, product: "" };

  function unitPriceForType(type) {
    var p = prices();
    switch (type) {
      case "pastel":
        return p.pastel != null ? p.pastel : 2000;
      case "patacon":
        return p.patacon != null ? p.patacon : 12000;
      case "arepa":
        return p.arepa != null ? p.arepa : 4000;
      case "salchipapas":
        return p.salchipapas != null ? p.salchipapas : 10000;
      default:
        return 0;
    }
  }

  function closeOrderModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("order-modal-open");
    currentOrder.type = null;
    currentOrder.product = "";
  }

  function updateOrderTotal() {
    if (!modalTotal) return;
    modalError.hidden = true;
    modalError.textContent = "";

    if (currentOrder.type === "empanadas") {
      var packEl = document.getElementById("order-in-packs");
      var indEl = document.getElementById("order-in-ind");
      if (!packEl || !indEl) return;
      var packs = parseInt(packEl.value, 10) || 0;
      var ind = parseInt(indEl.value, 10) || 0;
      var p = prices();
      var packP = p.empanadaPack != null ? p.empanadaPack : 2000;
      var indP = p.empanadaIndividual != null ? p.empanadaIndividual : 500;
      var perPack = p.empanadasPerPack != null ? p.empanadasPerPack : 7;
      var total = packs * packP + ind * indP;
      if (packs === 0 && ind === 0) {
        modalTotal.textContent = "Total: " + formatCOP(0) + " — indica paquetes o sueltas";
      } else {
        modalTotal.textContent = "Total a pagar: " + formatCOP(total);
      }
    } else {
      var qtyEl = document.getElementById("order-in-qty");
      if (!qtyEl) return;
      var qty = parseInt(qtyEl.value, 10) || 0;
      var unit = unitPriceForType(currentOrder.type);
      var total = qty * unit;
      if (qty < 1) {
        modalTotal.textContent = "Total: " + formatCOP(0) + " — mínimo 1 unidad";
      } else {
        modalTotal.textContent =
          "Total a pagar: " + formatCOP(total) + " (" + qty + " × " + formatCOP(unit) + ")";
      }
    }
  }

  function openOrderModal(type, productName) {
    if (!modal || !modalTitle || !modalFields) return;
    currentOrder.type = type;
    currentOrder.product = productName;
    modalTitle.textContent = productName;
    modalFields.innerHTML = "";
    modalError.hidden = true;
    modalError.textContent = "";

    if (type === "empanadas") {
      var p = prices();
      var packP = p.empanadaPack != null ? p.empanadaPack : 2000;
      var indP = p.empanadaIndividual != null ? p.empanadaIndividual : 500;
      var perPack = p.empanadasPerPack != null ? p.empanadasPerPack : 7;

      modalFields.innerHTML =
        '<label class="order-field">' +
        '<span class="order-field__label">Paquetes de ' +
        perPack +
        " empanadas (" +
        formatCOP(packP) +
        " c/u paquete)</span>" +
        '<input type="number" class="order-field__input" id="order-in-packs" min="0" step="1" value="0" inputmode="numeric" />' +
        "</label>" +
        '<label class="order-field">' +
        '<span class="order-field__label">Empanadas sueltas (' +
        formatCOP(indP) +
        " c/u)</span>" +
        '<input type="number" class="order-field__input" id="order-in-ind" min="0" step="1" value="0" inputmode="numeric" />' +
        "</label>";

      document.getElementById("order-in-packs").addEventListener("input", updateOrderTotal);
      document.getElementById("order-in-ind").addEventListener("input", updateOrderTotal);
    } else {
      var unit = unitPriceForType(type);
      modalFields.innerHTML =
        '<label class="order-field">' +
        '<span class="order-field__label">¿Cuántas unidades?</span>' +
        '<input type="number" class="order-field__input" id="order-in-qty" min="1" step="1" value="1" inputmode="numeric" />' +
        "</label>" +
        '<p class="order-field__hint">Precio unitario: ' +
        formatCOP(unit) +
        "</p>";
      document.getElementById("order-in-qty").addEventListener("input", updateOrderTotal);
    }

    updateOrderTotal();
    modal.hidden = false;
    document.body.classList.add("order-modal-open");
    var firstIn = modal.querySelector("input");
    if (firstIn) firstIn.focus();
  }

  function buildOrderMessage() {
    var base = cfg().defaultOrderMessage || "";
    var product = currentOrder.product;
    var body = "";

    if (currentOrder.type === "empanadas") {
      var packs = parseInt(document.getElementById("order-in-packs").value, 10) || 0;
      var ind = parseInt(document.getElementById("order-in-ind").value, 10) || 0;
      var p = prices();
      var packP = p.empanadaPack != null ? p.empanadaPack : 2000;
      var indP = p.empanadaIndividual != null ? p.empanadaIndividual : 500;
      var perPack = p.empanadasPerPack != null ? p.empanadasPerPack : 7;

      if (packs === 0 && ind === 0) return null;

      var total = packs * packP + ind * indP;
      body = product + ":\n";
      if (packs > 0) {
        body +=
          "- " +
          packs +
          " paquete(s) de " +
          perPack +
          " empanadas → " +
          formatCOP(packs * packP) +
          "\n";
      }
      if (ind > 0) {
        body += "- " + ind + " empanada(s) suelta(s) → " + formatCOP(ind * indP) + "\n";
      }
      body += "Total a pagar: " + formatCOP(total);
    } else {
      var qty = parseInt(document.getElementById("order-in-qty").value, 10) || 0;
      var unit = unitPriceForType(currentOrder.type);
      if (qty < 1) return null;
      var total = qty * unit;
      body =
        product +
        ": " +
        qty +
        " unidad(es) × " +
        formatCOP(unit) +
        " = " +
        formatCOP(total) +
        "\nTotal a pagar: " +
        formatCOP(total);
    }

    return base + "\n\n" + body;
  }

  function confirmOrder() {
    if (currentOrder.type === "empanadas") {
      var packs = parseInt(document.getElementById("order-in-packs").value, 10) || 0;
      var ind = parseInt(document.getElementById("order-in-ind").value, 10) || 0;
      if (packs === 0 && ind === 0) {
        modalError.textContent =
          "Indica cuántos paquetes de 7 o cuántas empanadas sueltas quieres.";
        modalError.hidden = false;
        return;
      }
    } else {
      var qty = parseInt(document.getElementById("order-in-qty").value, 10) || 0;
      if (qty < 1) {
        modalError.textContent = "La cantidad mínima es 1.";
        modalError.hidden = false;
        return;
      }
    }
    var msg = buildOrderMessage();
    if (!msg) return;
    window.location.href = waUrl(msg);
    closeOrderModal();
  }

  if (modal) {
    document.querySelectorAll("[data-order]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openOrderModal(btn.getAttribute("data-order"), btn.getAttribute("data-product") || "");
      });
    });
    modal.querySelectorAll("[data-close-order]").forEach(function (el) {
      el.addEventListener("click", closeOrderModal);
    });
    if (sendBtn) sendBtn.addEventListener("click", confirmOrder);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeOrderModal();
    });
  }

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
