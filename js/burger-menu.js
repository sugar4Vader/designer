/**
 * Burger Menu Toggle
 * Handles opening and closing of mobile menu overlay
 */

document.addEventListener("DOMContentLoaded", function () {
  const burgerButton = document.querySelector("[data-burger]");
  const menuOverlay = document.querySelector("[data-menu]");
  const closeButton = document.querySelector("[data-menu-close]");

  // Prevent scroll when menu is open
  function preventScroll() {
    document.body.style.overflow = "hidden";
  }

  function allowScroll() {
    document.body.style.overflow = "";
  }

  // Open menu
  if (burgerButton) {
    burgerButton.addEventListener("click", function (e) {
      e.preventDefault();
      menuOverlay.classList.add("is-open");
      preventScroll();
    });
  }

  // Close menu
  if (closeButton) {
    closeButton.addEventListener("click", function (e) {
      e.preventDefault();
      menuOverlay.classList.remove("is-open");
      allowScroll();
    });
  }

  // Close menu when clicking on a link
  const menuLinks = menuOverlay.querySelectorAll('a[href^="#"]');
  menuLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      menuOverlay.classList.remove("is-open");
      allowScroll();
    });
  });

  // Close menu when clicking outside (on overlay background)
  menuOverlay.addEventListener("click", function (e) {
    if (e.target === menuOverlay) {
      menuOverlay.classList.remove("is-open");
      allowScroll();
    }
  });
});
