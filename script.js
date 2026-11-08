"use strict";

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-navigation");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (menuButton && navigation) {
  document.documentElement.classList.add("menu-ready");

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menú");
    navigation.classList.remove("is-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Abrir menú" : "Cerrar menú");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) {
      closeMenu();
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: reducedMotion.matches ? "auto" : "smooth",
      block: "start"
    });

    if (window.location.hash !== link.getAttribute("href")) {
      window.history.pushState(null, "", link.getAttribute("href"));
    }
  });
});

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  document.documentElement.classList.add("js-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -36px 0px"
  });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
if (contactForm instanceof HTMLFormElement && formStatus) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const showFormStatus = (message, isError = false) => {
    formStatus.textContent = message;
    formStatus.classList.toggle("form-status-error", isError);
    formStatus.hidden = false;
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity() || !(submitButton instanceof HTMLButtonElement)) {
      return;
    }

    submitButton.disabled = true;
    showFormStatus("Enviando tu mensaje…");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: new FormData(contactForm),
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        showFormStatus(`No se pudo enviar tu mensaje (error ${response.status}). Inténtalo de nuevo o escríbenos directamente a los correos indicados.`, true);
        return;
      }

      contactForm.reset();
      showFormStatus("Gracias por contactarnos. Tu mensaje fue enviado correctamente.");
    } catch (error) {
      showFormStatus("No fue posible conectar con el servicio de envío. Revisa tu conexión e inténtalo de nuevo o escríbenos directamente a los correos indicados.", true);
      console.error("Error al enviar el formulario de contacto:", error);
    } finally {
      submitButton.disabled = false;
    }
  });
}

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
