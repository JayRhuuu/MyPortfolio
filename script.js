document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");
    const links = document.querySelectorAll('a[href^="#"]');
  
    // Toggle navbar
    menuIcon?.addEventListener("click", () => {
      menuIcon.classList.toggle("bx-x");
      navbar.classList.toggle("open");
    });
  
    // Smooth scroll
    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        const targetId = link.getAttribute("href");
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth" });
          navbar.classList.remove("open");
          menuIcon.classList.remove("bx-x");
        }
      });
    });
  });
  