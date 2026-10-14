/**
 * Main application scripts for Vanilla implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Mobile Menu Toggle
  const initMobileMenu = () => {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const header = document.getElementById('header');
    
    if (menuBtn && header) {
      menuBtn.addEventListener('click', () => {
        header.classList.toggle('mobile-menu-open');
      });
    }
  };

  // 2. Intersection Observer for Fade-in animations
  const initScrollAnimations = () => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Optional: stop observing once it's visible if you only want it to animate once
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-section');
    animatedElements.forEach(el => observer.observe(el));
  };

  // 3. Smooth Scrolling for Anchor Links
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        // Prevent default if it's just "#"
        if (this.getAttribute('href') === '#') {
          e.preventDefault();
          return;
        }
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Close mobile menu if open
          document.getElementById('header').classList.remove('mobile-menu-open');
        }
      });
    });
  };

  // Initialize all functions
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
});