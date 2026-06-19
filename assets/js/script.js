// ==========================================
// EMAILJS CONFIG
// ==========================================
const EMAILJS_PUBLIC_KEY = "X5bLslep9g2_X_vfu";
const EMAILJS_SERVICE_ID = "service_om6jz9t";
const EMAILJS_TEMPLATE_ID = "template_u4wp8ep";

if (typeof emailjs !== "undefined") {
  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY,
  });
}

// ==========================================
// BASIC SECURITY
// ==========================================

// // Disable right click
document.addEventListener("contextmenu", (e) => e.preventDefault());

// Disable common inspect shortcuts
// document.addEventListener("keydown", function (e) {
//   if (
//     e.key === "F12" ||
//     (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) ||
//     (e.ctrlKey && e.key.toLowerCase() === "u")
//   ) {
//     e.preventDefault();
//   }
// });

// ==========================================
// SANITIZER
// ==========================================
function sanitizeInput(value) {
  const div = document.createElement("div");
  div.innerText = value;
  return div.innerHTML.trim();
}

// ==========================================
// RATE LIMITER
// ==========================================
const LAST_SUBMIT_KEY = "portfolio_last_submit";
let lastSubmitTime =
  Number(localStorage.getItem(LAST_SUBMIT_KEY)) || 0;

// ==========================================
// NAVIGATION SYSTEM
// ==========================================
const menu = document.querySelector(".navbar");
const menuBtn = document.querySelector("#menu-icon");
const navLinks = document.querySelectorAll(".navbar a");
const sections = document.querySelectorAll("section");

// Toggle mobile navbar
if (menu && menuBtn) {
  menuBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}

// Handle navigation clicks + smooth scroll
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
      targetSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    // Close mobile menu after click
    if (menu.classList.contains("open")) {
      menu.classList.remove("open");
    }
  });
});

// ==========================================
// ACTIVE NAV LINK ON SCROLL
// ==========================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          link.classList.remove("active");

          if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    threshold: 0.4,
  }
);

sections.forEach((section) => observer.observe(section));

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    menu &&
    menu.classList.contains("open") &&
    !menu.contains(e.target) &&
    !menuBtn.contains(e.target)
  ) {
    menu.classList.remove("open");
  }
});

// ==========================================
// CONTACT FORM
// ==========================================
const contactForm = document.getElementById("contact-form");
const contactName = document.getElementById("name");
const contactEmail = document.getElementById("email");
const contactMessage = document.getElementById("message");
const honeypot = document.getElementById("website");

if (contactForm && contactName && contactEmail && contactMessage) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(
      "button[type='submit']"
    );

    if (!submitButton || submitButton.disabled) return;

    // Honeypot anti-bot
    if (honeypot && honeypot.value !== "") {
      console.warn("Bot detected");
      return;
    }

    // Rate limit (30 sec)
    const now = Date.now();

    if (now - lastSubmitTime < 30000) {
      alert("Please wait 30 seconds before sending another message.");
      return;
    }

    lastSubmitTime = now;
    localStorage.setItem(LAST_SUBMIT_KEY, now.toString());

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    const formData = {
      name: sanitizeInput(contactName.value),
      email: sanitizeInput(contactEmail.value),
      message: sanitizeInput(contactMessage.value),
    };

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill in all fields.");
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
      return;
    }

    if (formData.name.length > 100) {
      alert("Name too long.");
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
      return;
    }

    if (formData.message.length > 1000) {
      alert("Message too long.");
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(formData.email)) {
      alert("Invalid email.");
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
      return;
    }

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          message: formData.message,
          reply_to: formData.email,
        }
      );

      console.log("Email sent:", response);
      alert("Message sent successfully!");
      contactForm.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Unable to send message.");
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Send Message";
    }
  });
}
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();