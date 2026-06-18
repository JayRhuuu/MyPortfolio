document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".navbar a[href^='#']");
  const sections = Array.from(navLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter((section) => section instanceof HTMLElement);

  const contactName = document.getElementById("name");
  const contactEmail = document.getElementById("email");
  const contactMessage = document.getElementById("message");

  // Update active navigation link
  const updateActiveLink = (activeId) => {
    navLinks.forEach((navLink) => {
      if (navLink.getAttribute("href") === activeId) {
        navLink.classList.add("active");
      } else {
        navLink.classList.remove("active");
      }
    });
  };

  // Toggle mobile navbar
  menuIcon?.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar?.classList.toggle("open");
  });

  // Handle navigation link clicks with smooth scrolling
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#" || targetId.length === 1) {
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (!targetElement) {
        return;
      }

      event.preventDefault();
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      navbar?.classList.remove("open");
      menuIcon?.classList.remove("bx-x");
      updateActiveLink(targetId);
    });
  });

  // Update active link based on scroll position (Intersection Observer)
  if (sections.length > 0 && "IntersectionObserver" in window) {
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
  }

  // Contact form submission handler
  const EMAILJS_USER_ID = "X5bLslep9g2_X_vfu";
  const EMAILJS_SERVICE_ID = "service_om6jz9t";
  const EMAILJS_TEMPLATE_ID = "template_u4wp8ep";

  if (typeof emailjs !== "undefined" && EMAILJS_USER_ID !== "YOUR_EMAILJS_USER_ID") {
    emailjs.init(EMAILJS_USER_ID);
  }

  const sanitizeInput = (value) =>
    value
      .replace(/<[^>]*>/g, "")
      .replace(/[\u0000-\u001F\u007F]/g, "")
      .trim();

  const contactForm = document.getElementById("contact-form");
  if (contactForm && contactName && contactEmail && contactMessage) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = {
        name: sanitizeInput(contactName.value),
        email: sanitizeInput(contactEmail.value),
        message: sanitizeInput(contactMessage.value),
      };

      if (!formData.name || !formData.email || !formData.message) {
        alert("Please fill in all fields.");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      const securityNote =
        "This message was submitted via the portfolio contact form. Do not share sensitive credentials in replies.";

      const emailjsAvailable = typeof emailjs !== "undefined" &&
        EMAILJS_SERVICE_ID !== "YOUR_SERVICE_ID" &&
        EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" &&
        EMAILJS_USER_ID !== "YOUR_EMAILJS_USER_ID";

      if (emailjsAvailable) {
        try {
          await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: formData.name,
            from_email: formData.email,
            message: formData.message,
            security_note: securityNote,
            reply_to: formData.email,
            to_email: "jayrhuelplaton22@gmail.com",
          });

          alert("Message sent successfully! Thank you for reaching out.");
          contactForm.reset();
          return;
        } catch (error) {
          console.error("EmailJS error:", error);
          alert("Unable to send the message via EmailJS. Falling back to email client.");
        }
      }

      const mailtoBody = `${formData.message}%0A%0A---%0A${encodeURIComponent(securityNote)}%0A%0AFrom:%20${encodeURIComponent(
        formData.email
      )}`;
      const mailtoLink = `mailto:jayrhuelplaton22@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(
        formData.name
      )}&body=${mailtoBody}`;

      window.location.href = mailtoLink;
      contactForm.reset();
    });
  }
});

  