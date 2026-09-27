/**
 * ==========================================================================
 * PORTFOLIO SCRIPT - DANG TRAN MINH DANG
 * Interactive animations, scroll triggers, skill filter & counters
 * ==========================================================================
 */

(function () {
  "use strict";

  // 1. Preloader
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader?.classList.add("hidden");
    }, 350);
  });

  // 2. Current Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 3. Navbar scroll effect
  const navbar = document.getElementById("mainNav");
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      navbar?.classList.add("scrolled");
    } else {
      navbar?.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleNavScroll, { passive: true });
  handleNavScroll();

  // 4. Active nav link on scroll
  const sections = document.querySelectorAll("section[id], header[id]");
  const navLinks = document.querySelectorAll("#mainNav .nav-link:not(.nav-cta)");

  const setActiveNav = () => {
    const scrollY = window.scrollY + 130;
    sections.forEach((section) => {
      const id = section.getAttribute("id");
      if (!id) return;
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  };
  window.addEventListener("scroll", setActiveNav, { passive: true });

  // 5. Close mobile nav when clicking a link
  const navCollapse = document.getElementById("navMenu");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse?.classList.contains("show")) {
        const toggler = document.querySelector(".navbar-toggler");
        toggler?.click();
      }
    });
  });

  // 6. Scroll Reveal Observer
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // 7. Counter Animation for Hero Stats
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  // 8. Skill Progress Bars Animation
  const skillBars = document.querySelectorAll(".skill-bar-fill[data-level]");
  const skillBarObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const level = target.getAttribute("data-level");
          target.style.width = level + "%";
          skillBarObserver.unobserve(target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillBars.forEach((bar) => skillBarObserver.observe(bar));

  // 9. Interactive Skill Category Filter
  const skillTabs = document.querySelectorAll(".skills-tab-nav .tab-btn");
  const skillChips = document.querySelectorAll(".skills-grid .skill-chip");

  skillTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      skillTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.getAttribute("data-category");
      skillChips.forEach((chip) => {
        if (category === "all" || chip.getAttribute("data-category") === category) {
          chip.style.display = "inline-flex";
          chip.style.opacity = "1";
          chip.style.transform = "scale(1)";
        } else {
          chip.style.display = "none";
        }
      });
    });
  });

  // 10. Back to top button
  const backToTop = document.getElementById("backToTop");
  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 400) {
        backToTop?.classList.add("visible");
      } else {
        backToTop?.classList.remove("visible");
      }
    },
    { passive: true }
  );
  backToTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // 11. Custom Toast Notification
  const showToast = (message, icon = "bi-check-circle-fill") => {
    let toast = document.getElementById("customToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "customToast";
      toast.className = "custom-toast";
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="bi ${icon}"></i><span>${message}</span>`;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  };

  // 12. Copy Email to Clipboard
  const copyButtons = document.querySelectorAll("[data-copy-email]");
  copyButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const email = btn.getAttribute("data-copy-email") || "minhdang1123344@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("Copied email to clipboard: " + email, "bi-clipboard-check");
      });
    });
  });

  // 13. Contact Form Submission Handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending message...`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast("Thank you! Your message has been sent successfully to Minh Dang.");
      }, 900);
    });
  }

  // 14. Skill Chip Hover Micro-interactions
  document.querySelectorAll(".skill-chip").forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      chip.style.transform = "translateY(-3px) scale(1.05)";
    });
    chip.addEventListener("mouseleave", () => {
      chip.style.transform = "";
    });
  });
})();
