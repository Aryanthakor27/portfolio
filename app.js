// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Graphic Design Portfolio Category Filtering
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          card.style.animation = "fadeIn 0.4s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // 2. Websites Showcase Category Filtering & Live Search (48+ Sites)
  const webTabBtns = document.querySelectorAll(".web-tab-btn");
  const websiteCards = document.querySelectorAll(".website-card");
  const webSearchInput = document.getElementById("web-search-input");
  const noWebResults = document.getElementById("no-web-results");

  let activeWebCategory = "all";
  let currentSearchQuery = "";

  function filterWebsites() {
    let visibleCount = 0;

    websiteCards.forEach(card => {
      const cat = card.getAttribute("data-web-cat");
      const cardText = card.textContent.toLowerCase();

      const matchesCat = (activeWebCategory === "all" || cat === activeWebCategory);
      const matchesSearch = (!currentSearchQuery || cardText.includes(currentSearchQuery));

      if (matchesCat && matchesSearch) {
        card.style.display = "flex";
        card.style.animation = "fadeIn 0.3s ease forwards";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    if (noWebResults) {
      if (visibleCount === 0) {
        noWebResults.classList.remove("hidden");
      } else {
        noWebResults.classList.add("hidden");
      }
    }
  }

  webTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      webTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeWebCategory = btn.getAttribute("data-web-filter");
      filterWebsites();
    });
  });

  if (webSearchInput) {
    webSearchInput.addEventListener("input", (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      filterWebsites();
    });
  }

  // 3. Grid Overlay Toggle
  const toggleGridBtn = document.getElementById("toggle-grid-btn");
  const gridOverlay = document.getElementById("figma-grid-overlay");

  if (toggleGridBtn && gridOverlay) {
    toggleGridBtn.addEventListener("click", () => {
      gridOverlay.classList.toggle("hidden");
      toggleGridBtn.classList.toggle("active");
    });
  }

  // 4. Specs Modal / Toast
  const specsBtn = document.getElementById("toggle-specs-btn");
  if (specsBtn) {
    specsBtn.addEventListener("click", () => {
      showToast("Figma Canvas: 1440px | 12-Col Grid (Margin: 80px, Gutter: 24px)");
    });
  }
});

// Lightbox Functions
function openLightbox(imgSrc, title, category) {
  const modal = document.getElementById("lightbox-modal");
  const modalImg = document.getElementById("lightbox-img");
  const modalTitle = document.getElementById("lightbox-title");
  const modalTag = document.getElementById("lightbox-tag");
  const lightboxBody = document.querySelector(".lightbox-body");

  if (modal && modalImg && modalTitle && modalTag) {
    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalTag.textContent = category;

    if (lightboxBody) {
      if (imgSrc.includes("logos/") || category.toLowerCase().includes("brand") || category.toLowerCase().includes("logo")) {
        lightboxBody.classList.add("logo-mode");
      } else {
        lightboxBody.classList.remove("logo-mode");
      }
    }

    modal.classList.remove("hidden");
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }
}

function closeLightbox() {
  const modal = document.getElementById("lightbox-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// Copy Email with Toast Alert
function copyEmail() {
  const email = "thakoraryan2002@gmail.com";
  navigator.clipboard.writeText(email).then(() => {
    showToast("Email copied to clipboard: thakoraryan2002@gmail.com");
  }).catch(() => {
    showToast("Email: thakoraryan2002@gmail.com");
  });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  const toastMsg = document.getElementById("toast-message");
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.remove("hidden");
    setTimeout(() => {
      toast.classList.add("hidden");
    }, 3500);
  }
}
