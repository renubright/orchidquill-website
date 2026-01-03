/**
 * Dynamically load portfolio images from images/portfolio/ directory
 * This script generates portfolio items based on available images
 */
(function () {
  // List of portfolio image filenames
  // Update this array when adding new portfolio images
  const portfolioImages = [
    "portfolio-1.png",
    "portfolio-2.png",
    "portfolio-3.png",
    "portfolio-4.png",
    "portfolio-5.png",
    "portfolio-6.png",
    "portfolio-7.png",
    "portfolio-8.png",
    "portfolio-9.png",
    "portfolio-10.png",
    "portfolio-11.png",
    "portfolio-12.png",
    "portfolio-13.png",
    "portfolio-14.png",
    "portfolio-15.png",
  ];

  function loadPortfolioImages() {
    const portfolioGrid = document.querySelector(".portfolio-grid");
    if (!portfolioGrid) {
      console.warn("Portfolio grid not found");
      return;
    }

    // Clear existing content
    portfolioGrid.innerHTML = "";

    // Generate portfolio items for each image
    portfolioImages.forEach((imageName, index) => {
      const portfolioItem = document.createElement("div");
      portfolioItem.className = "portfolio-item";

      const img = document.createElement("img");
      img.src = `images/portfolio/${imageName}`;
      img.alt = `Portfolio item ${index + 1}`;
      img.loading = "lazy"; // Lazy load images for better performance

      portfolioItem.appendChild(img);
      portfolioGrid.appendChild(portfolioItem);
    });

    // Re-initialize lightbox functionality after images are loaded
    // This is needed because the lightbox code in main.js runs before images are added
    initializePortfolioLightbox();
  }

  function initializePortfolioLightbox() {
    const portfolioItems = document.querySelectorAll(".portfolio-item img");
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImage = document.querySelector(".lightbox-image");
    const lightboxClose = document.querySelector(".lightbox-close");
    const lightboxOverlay = document.querySelector(".lightbox-overlay");

    if (!lightboxModal || !lightboxImage) return;

    // Remove existing event listeners by cloning and replacing
    portfolioItems.forEach((img) => {
      // Remove old listeners by replacing the element
      const newImg = img.cloneNode(true);
      img.parentNode.replaceChild(newImg, img);

      let touchStartX = 0;
      let touchStartY = 0;
      let touchMoved = false;
      let touchJustHandled = false;

      // Track touch start position
      newImg.addEventListener(
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
      newImg.addEventListener(
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
      newImg.addEventListener("touchend", (e) => {
        if (!touchMoved) {
          e.preventDefault();
          openLightbox(newImg.src, newImg.alt);
          touchJustHandled = true;
          // Reset flag after a delay to allow click event to be blocked
          setTimeout(() => {
            touchJustHandled = false;
          }, 300);
        }
      });

      // Handle click for desktop
      newImg.addEventListener("click", (e) => {
        // Prevent click if touch was just handled (mobile)
        if (touchJustHandled) {
          e.preventDefault();
          return;
        }
        // Desktop click handler
        e.preventDefault();
        openLightbox(newImg.src, newImg.alt);
      });
    });

    // Open lightbox function
    function openLightbox(imgSrc, imgAlt) {
      if (lightboxImage && lightboxModal) {
        lightboxImage.src = imgSrc;
        lightboxImage.alt = imgAlt;
        lightboxModal.classList.add("is-open");
        lightboxModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
      }
    }

    // Close lightbox function
    function closeLightbox() {
      if (lightboxModal) {
        lightboxModal.classList.remove("is-open");
        lightboxModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = ""; // Restore scrolling
      }
    }

    // Close lightbox on close button click
    if (lightboxClose) {
      lightboxClose.onclick = closeLightbox;
    }

    // Close lightbox on overlay click
    if (lightboxOverlay) {
      lightboxOverlay.onclick = closeLightbox;
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
  }

  // Load portfolio images when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadPortfolioImages);
  } else {
    // DOM already loaded
    loadPortfolioImages();
  }
})();
