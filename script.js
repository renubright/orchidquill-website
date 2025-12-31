// Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector(".site-nav");
if (navToggle && nav)
  navToggle.addEventListener("click", () => nav.classList.toggle("is-open"));
if (nav)
  nav.addEventListener(
    "click",
    (e) => e.target.tagName === "A" && nav.classList.remove("is-open")
  );

// Smooth scrolling (for older browsers that ignore CSS scroll-behavior)
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href").slice(1);
    const t = document.getElementById(id);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Contact form validation + fake submit
const form = document.getElementById("contact-form");
const successMessage = document.getElementById("form-success-message");
const setError = (name, msg) => {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = msg || "";
};
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
if (form)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const date = form.date.value;
    const invitationDropDateEl = form.querySelector(
      '[name="invitation-drop-date"]'
    );
    const invitationDropDate = invitationDropDateEl
      ? invitationDropDateEl.value
      : null;
    const budget = form.budget ? parseFloat(form.budget.value) : null;
    const invitationCountEl = form.querySelector('[name="invitation-count"]');
    const invitationCount = invitationCountEl
      ? parseInt(invitationCountEl.value)
      : null;
    const message = form.message.value.trim();
    let ok = true;
    if (successMessage) successMessage.textContent = "";
    if (!name) {
      setError("name", "Please share your name.");
      ok = false;
    } else setError("name", "");
    if (!email) {
      setError("email", "An email address helps us write back.");
      ok = false;
    } else if (!validEmail(email)) {
      setError("email", "Please enter a valid email.");
      ok = false;
    } else setError("email", "");
    if (!date) {
      setError("date", "Please provide your wedding date.");
      ok = false;
    } else {
      const weddingDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (weddingDate <= today) {
        setError("date", "Wedding date must be in the future.");
        ok = false;
      } else setError("date", "");
    }
    if (!invitationDropDate) {
      setError(
        "invitation-drop-date",
        "Please provide the invitation drop date."
      );
      ok = false;
    } else {
      const dropDate = new Date(invitationDropDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dropDate <= today) {
        setError(
          "invitation-drop-date",
          "Invitation drop date must be in the future."
        );
        ok = false;
      } else setError("invitation-drop-date", "");
    }
    if (budget !== null) {
      if (!budget || isNaN(budget)) {
        setError("budget", "Please enter a valid budget amount.");
        ok = false;
      } else if (budget < 3000) {
        setError(
          "budget",
          "The minimum investment for working with us is $3,000."
        );
        ok = false;
      } else setError("budget", "");
    }
    if (invitationCount !== null) {
      if (!invitationCount || isNaN(invitationCount) || invitationCount < 1) {
        setError(
          "invitation-count",
          "Please enter a valid number of invitations (at least 1)."
        );
        ok = false;
      } else setError("invitation-count", "");
    }
    if (!message) {
      setError("message", "Please share additional details about your event.");
      ok = false;
    } else setError("message", "");
    if (!ok) return;
    form.reset();
    if (successMessage)
      successMessage.textContent =
        "Thank you for reaching out. Your inquiry has been received and we'll respond warmly as soon as possible.";
  });

// Dynamic year in footer
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Portfolio Lightbox
const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImage = document.querySelector(".lightbox-image");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxOverlay = document.querySelector(".lightbox-overlay");
const portfolioItems = document.querySelectorAll(".portfolio-item img");

// Open lightbox
function openLightbox(imgSrc, imgAlt) {
  if (lightboxImage && lightboxModal) {
    lightboxImage.src = imgSrc;
    lightboxImage.alt = imgAlt;
    lightboxModal.classList.add("is-open");
    lightboxModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
}

// Close lightbox
function closeLightbox() {
  if (lightboxModal) {
    lightboxModal.classList.remove("is-open");
    lightboxModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Add click/touch event listeners to portfolio images
if (portfolioItems.length > 0) {
  portfolioItems.forEach((img) => {
    // Handle both click and touch events
    img.addEventListener("click", (e) => {
      e.preventDefault();
      openLightbox(img.src, img.alt);
    });

    // Touch event for mobile devices
    img.addEventListener("touchend", (e) => {
      e.preventDefault();
      openLightbox(img.src, img.alt);
    });
  });
}

// Close lightbox on close button click
if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}

// Close lightbox on overlay click
if (lightboxOverlay) {
  lightboxOverlay.addEventListener("click", closeLightbox);
}

// Close lightbox on ESC key
document.addEventListener("keydown", (e) => {
  if (
    e.key === "Escape" &&
    lightboxModal &&
    lightboxModal.classList.contains("is-open")
  ) {
    closeLightbox();
  }
});
