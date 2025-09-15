// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Mobile Navigation Toggle
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition =
          targetSection.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // Header background on scroll
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      header.style.background = "rgba(255, 255, 255, 0.98)";
      header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
      header.style.background = "rgba(255, 255, 255, 0.95)";
      header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.05)";
    }
  });

  // Gallery functionality
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.getElementById("lightbox-prev");
  const lightboxNext = document.getElementById("lightbox-next");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  let currentImageIndex = 0;
  let allImages = [];
  let visibleImagesCount = 12;

  // Initialize all available images
  function initializeGallery() {
    // Generate all image paths
    for (let i = 1; i <= 40; i++) {
      allImages.push({
        src: `images/image_${i}.jpg`,
        alt: `Lux Loft Spa - Slika ${i}`,
      });
    }

    // Add click handlers to existing gallery items
    const existingItems = document.querySelectorAll(".gallery-item");
    existingItems.forEach((item, index) => {
      item.addEventListener("click", function () {
        openLightbox(index);
      });
    });

    // Hide load more button if all images are already shown
    const galleryGrid = document.querySelector(".gallery-grid");
    if (galleryGrid.children.length >= allImages.length) {
      loadMoreBtn.style.display = "none";
    }
  }

  // Show more images in gallery
  function showMoreImages() {
    const galleryGrid = document.querySelector(".gallery-grid");
    const currentCount = galleryGrid.children.length;
    const imagesToShow = Math.min(12, allImages.length - currentCount);

    for (let i = 0; i < imagesToShow; i++) {
      const imageIndex = currentCount + i;
      if (imageIndex < allImages.length) {
        const galleryItem = createGalleryItem(
          allImages[imageIndex],
          imageIndex
        );
        galleryGrid.appendChild(galleryItem);

        // Force display and trigger reflow
        galleryItem.style.display = "block";
        galleryItem.offsetHeight; // Trigger reflow
      }
    }

    // Hide load more button if all images are shown
    if (galleryGrid.children.length >= allImages.length) {
      loadMoreBtn.style.display = "none";
    }
  }

  // Create gallery item element
  function createGalleryItem(image, index) {
    const galleryItem = document.createElement("div");
    galleryItem.className = "gallery-item";
    galleryItem.setAttribute("data-image", image.src);

    // Create img element programmatically for better control
    const img = document.createElement("img");
    img.src = image.src;
    img.alt = image.alt;
    img.loading = "eager"; // Changed from lazy to eager for immediate loading

    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "gallery-overlay";
    overlay.innerHTML = '<i class="fas fa-expand"></i>';

    // Append elements
    galleryItem.appendChild(img);
    galleryItem.appendChild(overlay);

    // Add click event for lightbox
    galleryItem.addEventListener("click", function () {
      openLightbox(index);
    });

    // Ensure immediate visibility
    img.onload = function () {
      galleryItem.style.opacity = "1";
    };

    img.onerror = function () {
      galleryItem.style.display = "none";
    };

    return galleryItem;
  }

  // Load more button functionality
  loadMoreBtn.addEventListener("click", function () {
    showMoreImages();
  });

  // Open lightbox
  function openLightbox(imageIndex) {
    currentImageIndex = imageIndex;
    lightboxImage.src = allImages[imageIndex].src;
    lightboxImage.alt = allImages[imageIndex].alt;
    lightbox.style.display = "block";
    document.body.style.overflow = "hidden";
  }

  // Close lightbox
  function closeLightbox() {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
  }

  // Navigate to previous image
  function previousImage() {
    currentImageIndex =
      currentImageIndex > 0 ? currentImageIndex - 1 : allImages.length - 1;
    lightboxImage.src = allImages[currentImageIndex].src;
    lightboxImage.alt = allImages[currentImageIndex].alt;
  }

  // Navigate to next image
  function nextImage() {
    currentImageIndex =
      currentImageIndex < allImages.length - 1 ? currentImageIndex + 1 : 0;
    lightboxImage.src = allImages[currentImageIndex].src;
    lightboxImage.alt = allImages[currentImageIndex].alt;
  }

  // Lightbox event listeners
  lightboxClose.addEventListener("click", closeLightbox);
  lightboxPrev.addEventListener("click", previousImage);
  lightboxNext.addEventListener("click", nextImage);

  // Close lightbox when clicking outside image
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation for lightbox
  document.addEventListener("keydown", function (e) {
    if (lightbox.style.display === "block") {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          previousImage();
          break;
        case "ArrowRight":
          nextImage();
          break;
      }
    }
  });

  // Initialize gallery
  initializeGallery();

  // Lazy loading for images
  const images = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.onload = () => {
          img.classList.add("loaded");
        };
        if (img.complete) {
          img.classList.add("loaded");
        }
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => {
    imageObserver.observe(img);
  });

  // Scroll animations for sections
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  // Observe sections for animation
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    sectionObserver.observe(section);
  });

  // Add smooth reveal animation to feature cards
  const featureCards = document.querySelectorAll(
    ".feature, .amenity-card, .contact-item"
  );
  featureCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.1
    }s, transform 0.6s ease ${index * 0.1}s`;
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  featureCards.forEach((card) => {
    cardObserver.observe(card);
  });

  // Add active state to navigation based on scroll position
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    let current = "";
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${current}`) {
        link.classList.add("active");
      }
    });
  }

  // Add CSS for active nav link
  const style = document.createElement("style");
  style.textContent = `
        .nav-link.active {
            color: var(--primary-color);
        }
        .nav-link.active::after {
            width: 100%;
        }
    `;
  document.head.appendChild(style);

  // Update active nav link on scroll
  window.addEventListener("scroll", updateActiveNavLink);
  updateActiveNavLink(); // Initialize on load

  // Add parallax effect to hero background (optional, for performance)
  const heroBackground = document.querySelector(".hero-background");

  window.addEventListener("scroll", function () {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;

    if (scrolled < window.innerHeight) {
      heroBackground.style.transform = `translateY(${rate}px)`;
    }
  });

  // Add entrance animation to hero content
  const heroContent = document.querySelector(".hero-content");
  setTimeout(() => {
    heroContent.style.opacity = "1";
    heroContent.style.transform = "translateY(0)";
  }, 500);

  // Initialize hero content animation
  heroContent.style.opacity = "0";
  heroContent.style.transform = "translateY(50px)";
  heroContent.style.transition = "opacity 1s ease, transform 1s ease";

  // Add click tracking for phone number links
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
  phoneLinks.forEach((link) => {
    link.addEventListener("click", function () {
      // You can add analytics tracking here if needed
      console.log("Phone number clicked:", this.href);
    });
  });

  // Add form validation if contact form is added later
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  // Add touch gestures for mobile lightbox navigation
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].screenX;
  });

  lightbox.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next image
        nextImage();
      } else {
        // Swipe right - previous image
        previousImage();
      }
    }
  }

  // Performance optimization: debounce scroll events
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Apply debouncing to scroll-heavy functions
  const debouncedScrollHandler = debounce(function () {
    updateActiveNavLink();
    // Add other scroll-dependent functions here if needed
  }, 10);

  window.addEventListener("scroll", debouncedScrollHandler);

  // Preload next few images in gallery for better UX
  function preloadImages() {
    const currentVisible = document.querySelectorAll(".gallery-item").length;
    const toPreload = Math.min(6, allImages.length - currentVisible);

    for (let i = currentVisible; i < currentVisible + toPreload; i++) {
      if (i < allImages.length) {
        const img = new Image();
        img.src = allImages[i].src;
      }
    }
  }

  // Preload images after initial load
  setTimeout(preloadImages, 2000);

  // Add error handling for missing images
  document.addEventListener(
    "error",
    function (e) {
      if (e.target.tagName === "IMG") {
        console.warn("Image failed to load:", e.target.src);
        e.target.style.display = "none";
      }
    },
    true
  );
});
