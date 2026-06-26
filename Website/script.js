// ================================
// Dark Mode Toggle
// ================================

const themeToggle = document.getElementById("theme-toggle");

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀️ Light Mode";
}

// Toggle theme
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeToggle.textContent = "☀️ Light Mode";
        localStorage.setItem("theme", "dark");
    } else {
        themeToggle.textContent = "🌙 Dark Mode";
        localStorage.setItem("theme", "light");
    }
});


// ================================
// Scroll Reveal Animation
// ================================

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");

                // Uncomment the next line if you only want the animation to happen once.
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15,
        rootMargin: "0px 0px -75px 0px"
    }
);

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ========================================
// BACK TO TOP BUTTON
// ========================================

const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    backToTopButton.classList.add("show");
  } else {
    backToTopButton.classList.remove("show");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});

// ========================================
// OPTIONS MENU
// ========================================

const optionsToggle = document.getElementById("options-toggle");
const optionsPanel = document.getElementById("options-panel");

if (optionsToggle && optionsPanel) {
  optionsToggle.addEventListener("click", () => {
    optionsPanel.classList.toggle("show");
  });

  optionsPanel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      optionsPanel.classList.remove("show");
    });
  });
}

/* ========================= */
/* Image Gallery Lightbox */
/* ========================= */

const galleryThumbnails = document.querySelectorAll(".gallery-thumbnail");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxClose = document.getElementById("lightbox-close");

galleryThumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", () => {
    lightboxImage.src = thumbnail.src;
    lightboxImage.alt = thumbnail.alt;
    lightbox.classList.add("active");
  });
});

lightboxClose.addEventListener("click", () => {
  lightbox.classList.remove("active");
  lightboxImage.src = "";
});

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove("active");
    lightboxImage.src = "";
  }
});

// ========================================
// FUTURE FEATURES
// ========================================

// Typing animation

// Skill bar animation

// Active navigation highlighting

// Project filtering