/**
 * Clients Carousel with Modal
 * - Responsive: 1 card on mobile (<992px), 4 cards on desktop (>=992px)
 * - Navigate with prev/next buttons
 * - Click card to open in modal
 * - Close modal with close button, backdrop click, or Escape key
 */

class ClientsCarousel {
  constructor() {
    this.track = document.querySelector(".carousel-clients__track");
    this.items = document.querySelectorAll(".carousel-clients__item");
    this.prevBtn = document.querySelector("[data-carousel-prev='clients']");
    this.nextBtn = document.querySelector("[data-carousel-next='clients']");
    this.carouselContainer = document.querySelector(".carousel-clients");

    if (!this.track || this.items.length === 0) {
      console.warn("Clients carousel not found or empty");
      return;
    }

    this.currentIndex = 0;
    this.visibleCount = this.getVisibleCount();
    this.itemWidth = 0;

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.calculateLayout();
    this.render();
    this.setupCardClickModal();
    window.addEventListener("resize", () => this.handleResize());
  }

  setupEventListeners() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.prev());
    }
    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.next());
    }
  }

  getVisibleCount() {
    return window.innerWidth >= 992 ? 4 : 1;
  }

  calculateLayout() {
    this.visibleCount = this.getVisibleCount();

    // Calculate item width based on container and visible count
    const containerWidth = this.carouselContainer.offsetWidth;
    // Subtract button widths and gaps
    // Each button is approximately 2rem (32px), gap is 10px
    const totalButtonAndGapWidth = 2 * 32 + 2 * 10;
    const availableWidth = containerWidth - totalButtonAndGapWidth;
    this.itemWidth = availableWidth / this.visibleCount;

    // Apply width to all items
    this.items.forEach((item) => {
      item.style.width = this.itemWidth + "px";
    });

    // Ensure current index doesn't exceed valid range
    const maxIndex = Math.max(0, this.items.length - this.visibleCount);
    this.currentIndex = Math.min(this.currentIndex, maxIndex);
  }

  render() {
    // Calculate scroll distance
    const scrollDistance = this.currentIndex * this.itemWidth;
    this.track.style.transform = `translateX(-${scrollDistance}px)`;

    // Update button states
    this.updateButtonStates();
  }

  updateButtonStates() {
    const maxIndex = Math.max(0, this.items.length - this.visibleCount);

    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentIndex === 0;
      this.prevBtn.setAttribute("aria-disabled", this.currentIndex === 0);
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentIndex >= maxIndex;
      this.nextBtn.setAttribute("aria-disabled", this.currentIndex >= maxIndex);
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.render();
    }
  }

  next() {
    const maxIndex = Math.max(0, this.items.length - this.visibleCount);
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.render();
    }
  }

  handleResize() {
    const oldVisibleCount = this.visibleCount;
    this.calculateLayout();

    // If visible count changed, update carousel
    if (oldVisibleCount !== this.visibleCount) {
      this.render();
    }
  }

  setupCardClickModal() {
    // Use event delegation on the track
    this.track.addEventListener("click", (e) => {
      const item = e.target.closest(".carousel-clients__item");
      if (item) {
        const img = item.querySelector("img");
        if (img) {
          this.openModal(img);
        }
      }
    });
  }

  openModal(imgElement) {
    // Create modal if it doesn't exist
    let modal = document.getElementById("modal-clients");

    if (!modal) {
      modal = document.createElement("div");
      modal.id = "modal-clients";
      modal.className = "modal-clients";
      modal.innerHTML = `
        <div class="modal-clients__backdrop"></div>
        <div class="modal-clients__dialog" role="dialog" aria-label="Client logo">
          <button class="modal-clients__close" aria-label="Close modal" type="button">
            ✕
          </button>
          <div class="modal-clients__content"></div>
        </div>
      `;
      document.body.appendChild(modal);

      // Setup close handlers
      const closeBtn = modal.querySelector(".modal-clients__close");
      const backdrop = modal.querySelector(".modal-clients__backdrop");

      closeBtn.addEventListener("click", () => this.closeModal());
      backdrop.addEventListener("click", () => this.closeModal());

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("is-open")) {
          this.closeModal();
        }
      });
    }

    // Set content
    const contentContainer = modal.querySelector(".modal-clients__content");
    contentContainer.innerHTML = "";

    // Clone the image to display in modal
    const clonedImg = imgElement.cloneNode(true);
    clonedImg.style.width = "auto";
    clonedImg.style.maxWidth = "100%";
    clonedImg.style.height = "auto";

    contentContainer.appendChild(clonedImg);

    // Show modal
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  closeModal() {
    const modal = document.getElementById("modal-clients");
    if (modal) {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  new ClientsCarousel();
});
