/**
 * Load common HTML components (header, footer) dynamically
 * This allows us to maintain a single source of truth for shared components
 * Uses localStorage caching to avoid reloading components on page navigation
 */
(function () {
  // Cache expiry time: 24 hours
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000;

  // Initialize component after loading
  function initializeComponent(componentName) {
    if (componentName === "header") {
      // Initialize navigation toggle after header loads
      const navToggle = document.querySelector(".nav-toggle");
      const nav = document.querySelector(".site-nav");
      if (navToggle && nav) {
        // Remove existing listeners by cloning to prevent duplicates
        const newNavToggle = navToggle.cloneNode(true);
        navToggle.parentNode.replaceChild(newNavToggle, navToggle);
        const newNav = nav.cloneNode(true);
        nav.parentNode.replaceChild(newNav, nav);

        newNavToggle.addEventListener("click", () =>
          newNav.classList.toggle("is-open")
        );
        newNav.addEventListener(
          "click",
          (e) => e.target.tagName === "A" && newNav.classList.remove("is-open")
        );
      }
    } else if (componentName === "footer") {
      // Update year in footer after it loads
      const yearEl = document.getElementById("year");
      if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
      }
    }
  }

  // Fetch component from server
  async function fetchComponent(componentName, placeholderId, useCache = true) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      console.warn(`Placeholder with id "${placeholderId}" not found`);
      return;
    }

    try {
      const response = await fetch(`components/${componentName}.html`, {
        cache: "force-cache", // Use browser cache
      });
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

      // Cache in localStorage
      if (useCache) {
        const cacheKey = `component_${componentName}`;
        try {
          localStorage.setItem(cacheKey, bodyContent);
          localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        } catch (e) {
          // localStorage might be full or disabled, continue without caching
          console.warn("Could not cache component:", e);
        }
      }

      placeholder.innerHTML = bodyContent;
      initializeComponent(componentName);
    } catch (error) {
      console.error(`Error loading ${componentName}:`, error);
      if (placeholder) {
        placeholder.innerHTML = `<p style="color: red;">Error loading ${componentName}</p>`;
      }
    }
  }

  // Load component into a placeholder element
  async function loadComponent(componentName, placeholderId) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      console.warn(`Placeholder with id "${placeholderId}" not found`);
      return;
    }

    // Check localStorage cache first
    const cacheKey = `component_${componentName}`;
    const cachedHtml = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

    // Use cached version if it exists and is not expired
    if (cachedHtml && cacheTimestamp) {
      const age = Date.now() - parseInt(cacheTimestamp, 10);
      if (age < CACHE_EXPIRY) {
        // Use cached version immediately
        placeholder.innerHTML = cachedHtml;
        initializeComponent(componentName);

        // Fetch in background to update cache (non-blocking)
        fetchComponent(componentName, placeholderId, true).catch(() => {
          // Silently fail background update
        });
        return;
      } else {
        // Cache expired, remove it
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}_timestamp`);
      }
    }

    // No cache or expired, fetch fresh
    await fetchComponent(componentName, placeholderId, true);
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
