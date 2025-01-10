import { translations } from "./translations.js";
import { skillsData } from "../data/skillsData.js";
import { resumeData } from "../data/resumeData.js";

// Variable global para Typed.js
let typedInstance;

// Función para inicializar Typed.js
const initTyped = () => {
  const typed = document.querySelector(".typed");
  if (typed) {
    const typedStrings = typed.getAttribute("data-typed-items")?.split(", ");
    if (typedStrings && typedStrings.length > 0) {
      // Destruir instancia previa de Typed.js
      if (typedInstance) {
        typedInstance.destroy();
      }

      // Crear nueva instancia de Typed.js
      typedInstance = new Typed(".typed", {
        strings: typedStrings,
        loop: true,
        typeSpeed: 100,
        backSpeed: 50,
        backDelay: 2000,
      });
    } else {
      console.error("No se encontraron cadenas en 'data-typed-items'.");
    }
  }
};

// Función para aplicar las traducciones
const setLanguage = (lang) => {
  const elements = document.querySelectorAll("[data-key]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-key");
    if (translations[lang]?.[key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Actualizar Typed.js dinámicamente
  const typed = document.querySelector(".typed");
  if (typed) {
    const newTypedItems = translations[lang]?.["typed-items"];
    if (newTypedItems) {
      typed.setAttribute("data-typed-items", newTypedItems);
      initTyped(); // Reiniciar Typed.js con las nuevas cadenas
    }
  }

  generateResume(lang);
  generateServices(lang);

  // Actualizar el título de la página
  const pageTitle = document.querySelector("#page-title");
  if (pageTitle && translations[lang]["page-title"]) {
    pageTitle.textContent = translations[lang]["page-title"];
  }
};

// Eventos para cambiar el idioma
document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const lang = button.getAttribute("data-lang");
    localStorage.setItem("selectedLanguage", lang); // Guardar idioma
    setLanguage(lang);
  });
});

// Aplicar idioma guardado al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const savedLang = localStorage.getItem("selectedLanguage") || "en";
  setLanguage(savedLang);
});

// Inicializar Typed.js al cargar la página
document.addEventListener("DOMContentLoaded", initTyped);

(function () {
  "use strict";

  /**
   * Selector Helper
   */
  const select = (el, all = false) => {
    el = el.trim();
    return all
      ? [...document.querySelectorAll(el)]
      : document.querySelector(el);
  };

  const on = (type, el, listener, all = false) => {
    const selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  const navbarlinks = select("#navbar .scrollto", true);

  const navbarlinksActive = () => {
    const position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      const target = navbarlink.getAttribute("data-target");
      const section = select(`#${target}`);
      if (section) {
        if (
          position >= section.offsetTop &&
          position <= section.offsetTop + section.offsetHeight
        ) {
          navbarlink.classList.add("active");
        } else {
          navbarlink.classList.remove("active");
        }
      }
    });
  };

  window.addEventListener("load", navbarlinksActive);
  document.addEventListener("scroll", navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (targetId) => {
    const section = select(`#${targetId}`);
    if (section) {
      const elementPos = section.offsetTop;
      window.scrollTo({
        top: elementPos,
        behavior: "smooth",
      });
    }
  };

  /**
   * Manejo de clicks en enlaces del navbar
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      e.preventDefault();
      const target = this.getAttribute("data-target");
      if (target) {
        scrollto(target);
      }
    },
    true
  );

  /**
   * Compatibilidad con rutas completas (index.html#about)
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      const target = window.location.hash.replace("#", "");
      if (select(`#${target}`)) {
        scrollto(target);
      }
    }
  });

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * WhtsApp button
   */
  let Whats = select(".floatWapp");
  if (Whats) {
    const toggleBacktotop = () => {
      if (window.scrollY > 3000) {
        Whats.classList.add("activee");
      } else {
        Whats.classList.remove("activee");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = select("body");
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function (direction) {
        let progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
      },

      1200: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });
})();

const generateSkills = (skills) => {
  const skillsContainer = document.getElementById("skills-container");

  // Limpiar el contenedor antes de agregar habilidades
  skillsContainer.innerHTML = "";

  // Dividir habilidades en dos columnas
  const half = Math.ceil(skills.length / 2);
  const columns = [skills.slice(0, half), skills.slice(half)];

  // Generar HTML para cada columna
  columns.forEach((columnSkills) => {
    const column = document.createElement("div");
    column.className = "col-lg-6";
    column.setAttribute("data-aos", "fade-up");

    columnSkills.forEach((skill) => {
      const skillHTML = `
        <div class="progress">
          <span class="skill" data-key="${skill.key}">
            ${skill.label}<i class="val">${skill.value}%</i>
          </span>
          <div class="progress-bar-wrap">
            <div
              class="progress-bar"
              aria-valuenow="${skill.value}"
              aria-valuemin="0"
              aria-valuemax="100"
              style="width: ${skill.value}%"
            ></div>
          </div>
        </div>
      `;
      column.innerHTML += skillHTML;
    });

    skillsContainer.appendChild(column);
  });
};

// Generar habilidades al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  generateSkills(skillsData);
});

const generateResume = (lang) => {
  const resumeContainer = document.getElementById("resume-container");
  const data = resumeData[lang]; // Selecciona los datos en el idioma correspondiente

  // Limpiar el contenedor
  resumeContainer.innerHTML = "";

  // Asegurar orden de generación: Experiencia -> Educación -> Certificaciones
  const orderedSections = ["experience", "education", "certifications"];

  orderedSections.forEach((key) => {
    const section = data[key];
    let sectionHTML = `
      <div class="col-lg-6" data-aos="fade-up">
        <h3 class="resume-title">${section.title}</h3>
    `;

    if (key === "certifications") {
      // Caso especial para certificaciones
      sectionHTML += `
        <div class="resume-item pb-0">
          <p><em>${section.description}</em></p>
          <ul>
            ${section.items.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      `;
    } else {
      // Caso general para experiencia y educación
      sectionHTML += section.items
        .map((item) => {
          return `
            <div class="resume-item">
              <h4>${item.title || "Undefined"}</h4>
              <h5>${item.date || "Undefined"}</h5>
              <p><em>${item.company || item.institution || "Undefined"}</em></p>
              ${
                Array.isArray(item.description)
                  ? `<ul>${item.description
                      .map((desc) => `<li>${desc}</li>`)
                      .join("")}</ul>`
                  : `<p>${item.description || ""}</p>`
              }
            </div>
          `;
        })
        .join("");
    }

    sectionHTML += `</div>`;
    resumeContainer.innerHTML += sectionHTML;
  });
};

const generateServices = (lang) => {
  const services = [
    {
      icon: "bi bi-stack",
      titleKey: "service-multi-platform-title",
      descriptionKey: "service-multi-platform-description",
    },
    {
      icon: "bi bi-server",
      titleKey: "service-database-title",
      descriptionKey: "service-database-description",
    },
    {
      icon: "bi bi-search",
      titleKey: "service-marketing-title",
      descriptionKey: "service-marketing-description",
    },
    {
      icon: "bi bi-clouds-fill",
      titleKey: "service-cloud-title",
      descriptionKey: "service-cloud-description",
    },
    {
      icon: "bi bi-shield-lock-fill",
      titleKey: "service-security-title",
      descriptionKey: "service-security-description",
    },
    {
      icon: "bi bi-tools",
      titleKey: "service-support-title",
      descriptionKey: "service-support-description",
    },
  ];

  const container = document.getElementById("services-container");
  container.innerHTML = ""; // Limpiar contenido previo

  services.forEach((service, index) => {
    const delay = 100 * (index + 1); // Aumentar el delay de animación
    const serviceHTML = `
      <div class="col-lg-4 col-md-6 icon-box" data-aos="fade-up" data-aos-delay="${delay}">
        <div class="icon"><i class="${service.icon}"></i></div>
        <h4 class="title"><a href="" data-key="${service.titleKey}">${
      translations[lang][service.titleKey]
    }</a></h4>
        <p class="description" data-key="${service.descriptionKey}">${
      translations[lang][service.descriptionKey]
    }</p>
      </div>
    `;
    container.innerHTML += serviceHTML;
  });
};
