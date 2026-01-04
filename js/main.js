// Mobile nav toggle - initialized in load-components.js after header loads

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

// Contact form validation
const form = document.getElementById("contact-form");
const successMessage = document.getElementById("form-success-message");
const setError = (name, msg) => {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = msg || "";
};
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
if (form)
  form.addEventListener("submit", (e) => {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const date = form.wedding_date.value;
    const invitationDropDateEl = form.querySelector(
      '[name="invitation_drop_date"]'
    );
    const invitationDropDate = invitationDropDateEl
      ? invitationDropDateEl.value
      : null;
    const budget = form.budget ? parseFloat(form.budget.value) : null;
    const invitationCountEl = form.querySelector('[name="invitation_count"]');
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
      setError("wedding_date", "Please provide your wedding date.");
      ok = false;
    } else {
      const weddingDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (weddingDate <= today) {
        setError("wedding_date", "Wedding date must be in the future.");
        ok = false;
      } else setError("wedding_date", "");
    }
    if (!invitationDropDate) {
      setError(
        "invitation_drop_date",
        "Please provide the invitation drop date."
      );
      ok = false;
    } else {
      const dropDate = new Date(invitationDropDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (dropDate <= today) {
        setError(
          "invitation_drop_date",
          "Invitation drop date must be in the future."
        );
        ok = false;
      } else setError("invitation_drop_date", "");
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
          "invitation_count",
          "Please enter a valid number of invitations (at least 1)."
        );
        ok = false;
      } else setError("invitation_count", "");
    }
    if (!message) {
      setError("message", "Please share additional details about your event.");
      ok = false;
    } else setError("message", "");

    // If validation fails, prevent form submission
    if (!ok) {
      e.preventDefault();
      return;
    }
    // If validation passes, allow normal form POST to proceed
  });

// Dynamic year in footer - initialized in load-components.js after footer loads

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
    let touchStartX = 0;
    let touchStartY = 0;
    let touchMoved = false;
    let touchJustHandled = false;

    // Track touch start position
    img.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchMoved = false;
        touchJustHandled = false;
      },
      { passive: true }
    );

    // Track if touch moved (scrolling)
    img.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches.length > 0) {
          const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
          const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
          // If moved more than 10px, consider it a scroll
          if (deltaX > 10 || deltaY > 10) {
            touchMoved = true;
          }
        }
      },
      { passive: true }
    );

    // Handle touch end - only open lightbox if it was a tap (not a scroll)
    img.addEventListener("touchend", (e) => {
      if (!touchMoved) {
        e.preventDefault();
        openLightbox(img.src, img.alt);
        touchJustHandled = true;
        // Reset flag after a delay to allow click event to be blocked
        setTimeout(() => {
          touchJustHandled = false;
        }, 300);
      }
    });

    // Handle click for desktop
    img.addEventListener("click", (e) => {
      // Prevent click if touch was just handled (mobile)
      if (touchJustHandled) {
        e.preventDefault();
        return;
      }
      // Desktop click handler
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

// Auto-redirect with progress bar for thanks page
(function () {
  const homeButton = document.getElementById("home-button");
  const progressBar = document.getElementById("progress-bar");
  const homeUrl = "index.html";

  if (!homeButton || !progressBar) return;

  // Check for debug mode in URL
  const urlParams = new URLSearchParams(window.location.search);
  const isDebugMode = urlParams.has("debug");

  const duration = 5000; // 5 seconds
  const interval = 50; // Update every 50ms for smooth animation
  const increment = (100 / duration) * interval; // Percentage to increment per interval
  let currentWidth = 0;
  let progressTimer = null;

  function updateProgress() {
    currentWidth += increment;
    homeButton.classList.add("loading");
    if (currentWidth >= 100) {
      progressBar.style.width = "100%";
      if (isDebugMode) {
        // In debug mode, reset and loop instead of redirecting
        setTimeout(() => {
          currentWidth = 0;
          progressBar.style.width = "0%";
          updateProgress();
        }, 100);
      } else {
        window.location.href = homeUrl;
      }
    } else {
      progressBar.style.width = currentWidth + "%";
      progressTimer = setTimeout(updateProgress, interval);
    }
  }

  function cancelRedirect() {
    if (progressTimer) {
      clearTimeout(progressTimer);
      progressTimer = null;
    }
    progressBar.style.width = "0%";
    currentWidth = 0;
    homeButton.classList.remove("loading");
  }

  // Start progress bar animation
  updateProgress();

  // Cancel redirect if user clicks home button (manual navigation)
  homeButton.addEventListener("click", function (e) {
    cancelRedirect();
  });
})();
