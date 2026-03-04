/**
 * Gallery Carousel with Modal
 * - Responsive: 1 card (mobile), 2 cards (tablet), 4 cards (desktop)
 * - Navigate carousel with prev/next buttons
 * - Click card to open modal with full image
 * - Navigate in modal with arrows and keyboard
 * - Close modal with close button, backdrop, or Escape
 */

class GalleryCarousel {
  constructor() {
    // Sample data - replace with your actual images
    this.images = [
      {
        id: 1,
        src: "img/jira_logo.webp",
        alt: "Project 1",
        title: "Modern Brand Identity",
      },
      {
        id: 2,
        src: "img/adidas_logo.webp",
        alt: "Project 2",
        title: "Creative Packaging Design",
      },
      {
        id: 3,
        src: "img/roku_logo.webp",
        alt: "Project 3",
        title: "Corporate Branding",
      },
      {
        id: 4,
        src: "img/puma_logo.webp",
        alt: "Project 4",
        title: "Product Photography",
      },
      {
        id: 5,
        src: "img/jira_logo.webp",
        alt: "Project 5",
        title: "Digital Art Direction",
      },
      {
        id: 6,
        src: "img/adidas_logo.webp",
        alt: "Project 6",
        title: "Website Redesign",
      },
      {
        id: 7,
        src: "img/roku_logo.webp",
        alt: "Project 7",
        title: "Logo Design",
      },
      {
        id: 8,
        src: "img/puma_logo.webp",
        alt: "Project 8",
        title: "Marketing Campaign",
      },
    ];

    // DOM elements
    this.track = document.querySelector(".gallery-carousel__track");
    this.prevBtn = document.querySelector(".gallery-carousel__control--prev");
    this.nextBtn = document.querySelector(".gallery-carousel__control--next");
    this.modal = document.querySelector(".gallery-modal");
    this.modalBackdrop = document.querySelector(".gallery-modal__backdrop");
    this.modalClose = document.querySelector(".gallery-modal__close");
    this.modalImage = document.querySelector(".gallery-modal__image");
    this.modalTitle = document.querySelector(".gallery-modal__title");
    this.modalPrevBtn = document.querySelector(".gallery-modal__nav--prev");
    this.modalNextBtn = document.querySelector(".gallery-modal__nav--next");

    if (!this.track) {
      console.warn("Gallery carousel not found");
      return;
    }

    // State
    this.currentIndex = 0;
    this.activeImageIndex = 0;
    this.cardsPerView = this.getCardsPerView();

    this.init();
  }

  init() {
    this.renderCards();
    this.setupCarouselEventListeners();
    this.setupModalEventListeners();
    this.updateCarouselPosition();
    this.updateCarouselButtons();

    // Handle window resize
    window.addEventListener("resize", () => this.handleResize());
  }

  getCardsPerView() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 991) return 2;
    return 4;
  }

  renderCards() {
    this.track.innerHTML = "";

    this.images.forEach((image, index) => {
      const card = document.createElement("article");
      card.className = "gallery-carousel__card";
      card.setAttribute("data-index", index);
      card.innerHTML = `
        <div class="gallery-carousel__card-image-wrapper">
          <img 
            class="gallery-carousel__card-image" 
            src="${image.src}" 
            alt="${image.alt}"
            loading="lazy"
          />
        </div>
        <h3 class="gallery-carousel__card-title">${image.title}</h3>
      `;

      // Click handler to open modal
      card.addEventListener("click", () => this.openModal(index));

      this.track.appendChild(card);
    });
  }

  setupCarouselEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.goToPrevSlide());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.goToNextSlide());
    }
  }

  setupModalEventListeners() {
    if (!this.modal) return;

    // Close button
    if (this.modalClose) {
      this.modalClose.addEventListener("click", () => this.closeModal());
    }

    // Backdrop click
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener("click", () => this.closeModal());
    }

    // Navigation buttons
    if (this.modalPrevBtn) {
      this.modalPrevBtn.addEventListener("click", () => this.goToPrevImage());
    }

    if (this.modalNextBtn) {
      this.modalNextBtn.addEventListener("click", () => this.goToNextImage());
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeydown(e));
  }

  handleKeydown(e) {
    if (!this.modal.classList.contains("is-open")) return;

    switch (e.key) {
      case "Escape":
        this.closeModal();
        break;
      case "ArrowLeft":
        e.preventDefault();
        this.goToPrevImage();
        break;
      case "ArrowRight":
        e.preventDefault();
        this.goToNextImage();
        break;
    }
  }

  updateCarouselPosition() {
    const cards = this.track.querySelectorAll(".gallery-carousel__card");
    if (cards.length === 0) return;

    // Calculate card width including gap
    const firstCard = cards[0];
    const cardWidth = firstCard.offsetWidth;
    const gap = 20; // matches CSS gap
    const moveDistance = (cardWidth + gap) * this.currentIndex;

    this.track.style.transform = `translateX(-${moveDistance}px)`;
  }

  updateCarouselButtons() {
    const maxIndex = Math.max(0, this.images.length - this.cardsPerView);

    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
    }
  }

  goToPrevSlide() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarouselPosition();
      this.updateCarouselButtons();
    }
  }

  goToNextSlide() {
    const maxIndex = Math.max(0, this.images.length - this.cardsPerView);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarouselPosition();
      this.updateCarouselButtons();
    }
  }

  handleResize() {
    const oldCardsPerView = this.cardsPerView;
    this.cardsPerView = this.getCardsPerView();

    // Adjust currentIndex if needed to prevent overflow
    const maxIndex = Math.max(0, this.images.length - this.cardsPerView);
    this.currentIndex = Math.min(this.currentIndex, maxIndex);

    // Update if cards per view changed
    if (oldCardsPerView !== this.cardsPerView) {
      this.updateCarouselPosition();
      this.updateCarouselButtons();
    }
  }

  openModal(index) {
    this.activeImageIndex = index;
    this.setActiveImage(index);
    this.modal.classList.add("is-open");
    this.modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // Focus management
    if (this.modalClose) {
      this.modalClose.focus();
    }
  }

  closeModal() {
    this.modal.classList.remove("is-open");
    this.modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  setActiveImage(index) {
    const image = this.images[index];
    if (!image) return;

    if (this.modalImage) {
      this.modalImage.src = image.src;
      this.modalImage.alt = image.alt;
    }

    if (this.modalTitle) {
      this.modalTitle.textContent = image.title;
    }

    this.activeImageIndex = index;
  }

  goToPrevImage() {
    // Circular navigation
    const newIndex =
      this.activeImageIndex === 0
        ? this.images.length - 1
        : this.activeImageIndex - 1;
    this.setActiveImage(newIndex);
  }

  goToNextImage() {
    // Circular navigation
    const newIndex =
      this.activeImageIndex === this.images.length - 1
        ? 0
        : this.activeImageIndex + 1;
    this.setActiveImage(newIndex);
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new GalleryCarousel();
});
