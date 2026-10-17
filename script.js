
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // =======================================================
  // 1. MENÚ RESPONSIVE
  // =======================================================

  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (menuToggle && mainNav) {
    const closeMenu = () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen =
        menuToggle.getAttribute("aria-expanded") === "true";

      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Abrir menú" : "Cerrar menú"
      );

      mainNav.classList.toggle("is-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    // Cerrar el menú si se cambia a una pantalla de escritorio.
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 900) {
        closeMenu();
      }
    });
  }

  // =======================================================
  // 2. FILTROS Y BUSCADOR DEL PORTAFOLIO
  // =======================================================

  const projectGrid = document.querySelector("#project-grid");
  const projectSearch = document.querySelector("#project-search");
  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCount = document.querySelector("#project-count");
  const emptyResults = document.querySelector("#empty-results");

  if (projectGrid && projectSearch && filterButtons.length > 0) {
    const projectCards = Array.from(
      projectGrid.querySelectorAll(".project-card")
    );

    let activeFilter = "all";

    const filterProjects = () => {
      const searchTerm = projectSearch.value
        .trim()
        .toLocaleLowerCase("es");

      let visibleCount = 0;

      projectCards.forEach((card) => {
        const category = card.dataset.category || "";
        const text = card.textContent.toLocaleLowerCase("es");

        const matchesCategory =
          activeFilter === "all" || category === activeFilter;

        const matchesSearch = text.includes(searchTerm);
        const isVisible = matchesCategory && matchesSearch;

        card.hidden = !isVisible;

        if (isVisible) {
          visibleCount++;
        }
      });

      if (projectCount) {
        projectCount.textContent =
          `${String(visibleCount).padStart(2, "0")} PROYECTOS`;
      }

      if (emptyResults) {
        emptyResults.hidden = visibleCount !== 0;
      }
    };

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";

        filterButtons.forEach((item) => {
          const isActive = item === button;

          item.classList.toggle("active", isActive);
          item.setAttribute("aria-pressed", String(isActive));
        });

        filterProjects();
      });
    });

    projectSearch.addEventListener("input", filterProjects);

    filterProjects();
  }

  // =======================================================
  // 3. FORMULARIO DE CONTACTO
  // =======================================================

  const contactForm = document.querySelector("#contact-form-element");
  const formFeedback = document.querySelector("#form-feedback");

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", (event) => {
      // Evita el envío y la recarga de la página.
      event.preventDefault();

      // Valida los campos requeridos y el formato del correo.
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();

      formFeedback.classList.remove("error");
      formFeedback.classList.add("success");

      formFeedback.textContent =
        `¡Gracias${name ? `, ${name}` : ""}! ` +
        "El formulario se ha validado correctamente. " +
        "Esta demostración no envía todavía el mensaje a un servidor.";

      console.info("Formulario validado correctamente:", {
        name: formData.get("name"),
        email: formData.get("email"),
        service: formData.get("service")
      });

      // No se borran los campos para que el usuario pueda
      // revisar sus datos mientras se integra un backend.
    });

    // Elimina el mensaje anterior cuando el usuario edita el formulario.
    contactForm.addEventListener("input", () => {
      formFeedback.textContent = "";
      formFeedback.classList.remove("success", "error");
    });
  }

  // =======================================================
  // 4. AÑO AUTOMÁTICO EN EL PIE DE PÁGINA
  // =======================================================

  document.querySelectorAll(".current-year").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });
});
