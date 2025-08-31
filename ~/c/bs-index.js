// Main index module for website functionality
// Provides core initialization and utilities

(function() {
  'use strict';

  var bsIndex = {
    init: function() {
      this.setupGlobalUtilities();
      this.initializeComponents();
      this.setupEventListeners();
    },

    setupGlobalUtilities: function() {
      // Global utility functions
      window.BSUtils = {
        ready: function(fn) {
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', fn);
          } else {
            fn();
          }
        },
        
        debounce: function(func, wait) {
          var timeout;
          return function executedFunction() {
            var context = this;
            var args = arguments;
            var later = function() {
              timeout = null;
              func.apply(context, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        },
        
        throttle: function(func, limit) {
          var inThrottle;
          return function() {
            var args = arguments;
            var context = this;
            if (!inThrottle) {
              func.apply(context, args);
              inThrottle = true;
              setTimeout(function() { inThrottle = false; }, limit);
            }
          };
        }
      };
    },

    initializeComponents: function() {
      // Initialize common components
      this.setupSmoothScrolling();
      this.setupFormValidation();
      this.setupImageLazyLoading();
    },

    setupSmoothScrolling: function() {
      // Smooth scrolling for anchor links
      var links = document.querySelectorAll('a[href^="#"]');
      for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', function(e) {
          var target = document.querySelector(this.getAttribute('href'));
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      }
    },

    setupFormValidation: function() {
      // Basic form validation
      var forms = document.querySelectorAll('form');
      for (var i = 0; i < forms.length; i++) {
        forms[i].addEventListener('submit', function(e) {
          var isValid = true;
          var inputs = this.querySelectorAll('input[required], textarea[required]');
          
          for (var j = 0; j < inputs.length; j++) {
            var input = inputs[j];
            if (!input.value.trim()) {
              input.classList.add('error');
              isValid = false;
            } else {
              input.classList.remove('error');
            }
          }
          
          if (!isValid) {
            e.preventDefault();
          }
        });
      }
    },

    setupImageLazyLoading: function() {
      // Simple lazy loading for images
      if ('IntersectionObserver' in window) {
        var imageObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              var img = entry.target;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
              }
            }
          });
        });

        var lazyImages = document.querySelectorAll('img.lazy');
        for (var i = 0; i < lazyImages.length; i++) {
          imageObserver.observe(lazyImages[i]);
        }
      }
    },

    setupEventListeners: function() {
      // Global event listeners
      window.addEventListener('resize', window.BSUtils.debounce(function() {
        // Handle resize events
        window.dispatchEvent(new Event('optimizedResize'));
      }, 250));

      // Handle scroll events
      window.addEventListener('scroll', window.BSUtils.throttle(function() {
        // Handle scroll events
        window.dispatchEvent(new Event('optimizedScroll'));
      }, 16));
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      bsIndex.init();
    });
  } else {
    bsIndex.init();
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = bsIndex;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSIndex = bsIndex;
  }
})();
