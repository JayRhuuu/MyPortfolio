document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const navbar = document.querySelector(".navbar");
    const navLinks = document.querySelectorAll(".navbar a[href^='#']");
    const sections = Array.from(navLinks)
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter((section) => section instanceof HTMLElement);
  
    const updateActiveLink = (activeId) => {
      navLinks.forEach((navLink) => {
        if (navLink.getAttribute("href") === activeId) {
          navLink.classList.add("active");
        } else {
          navLink.classList.remove("active");
        }
      });
    };
  
    // Toggle navbar
    menuIcon?.addEventListener("click", () => {
      menuIcon.classList.toggle("bx-x");
      navbar.classList.toggle("open");
    });
  
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#" || targetId.length === 1) {
          return;
        }
        event.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          navbar.classList.remove("open");
          menuIcon?.classList.remove("bx-x");
          updateActiveLink(targetId);
        }
      });
    });
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            updateActiveLink(`#${entry.target.id}`);
          }
        });
      },
      { root: null, threshold: [0.35] }
    );
  
    sections.forEach((section) => observer.observe(section));
  });
  