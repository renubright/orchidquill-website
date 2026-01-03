/**
 * Load common HTML components (header, footer) dynamically
 * This allows us to maintain a single source of truth for shared components
 */
(function () {
  // Load component into a placeholder element
  async function loadComponent(componentName, placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      console.warn(`Placeholder with id "${placeholderId}" not found`);
      return;
    }

    try {
      const response = await fetch(`components/${componentName}.html`);
      if (!response.ok) {
        throw new Error(
          `Failed to load ${componentName}: ${response.statusText}`
        );
      }
      const html = await response.text();
      // Extract body content if it's a full HTML document, otherwise use as-is
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const bodyContent = doc.body ? doc.body.innerHTML : html;
      placeholder.innerHTML = bodyContent;

      // After loading, initialize any scripts that depend on the component
      if (componentName === "header") {
        // Initialize navigation toggle after header loads
        const navToggle = document.querySelector(".nav-toggle");
        const nav = document.querySelector(".site-nav");
        if (navToggle && nav) {
          navToggle.addEventListener("click", () =>
            nav.classList.toggle("is-open")
          );
        }
        if (nav) {
          nav.addEventListener(
            "click",
            (e) => e.target.tagName === "A" && nav.classList.remove("is-open")
          );
        }
      } else if (componentName === "footer") {
        // Update year in footer after it loads
        const yearEl = document.getElementById("year");
        if (yearEl) {
          yearEl.textContent = new Date().getFullYear();
        }
      }
    } catch (error) {
      console.error(`Error loading ${componentName}:`, error);
      placeholder.innerHTML = `<p style="color: red;">Error loading ${componentName}</p>`;
    }
  }

  // Load components when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      loadComponent("header", "header-placeholder");
      loadComponent("footer", "footer-placeholder");
    });
  } else {
    // DOM already loaded
    loadComponent("header", "header-placeholder");
    loadComponent("footer", "footer-placeholder");
  }
})();
