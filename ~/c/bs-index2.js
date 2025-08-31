// Index2 module for additional website functionality
// Provides secondary utilities and components

(function() {
  'use strict';

  var bsIndex2 = {
    init: function() {
      this.setupAnimations();
      this.setupInteractiveElements();
      this.setupAccessibility();
    },

    setupAnimations: function() {
      // Setup CSS animations and transitions
      var style = document.createElement('style');
      style.textContent = `
        .fade-in {
          opacity: 0;
          transition: opacity 0.6s ease-in-out;
        }
        
        .fade-in.visible {
          opacity: 1;
        }
        
        .slide-up {
          transform: translateY(30px);
          opacity: 0;
          transition: transform 0.6s ease-out, opacity 0.6s ease-out;
        }
        
        .slide-up.visible {
          transform: translateY(0);
          opacity: 1;
        }
        
        .scale-in {
          transform: scale(0.8);
          opacity: 0;
          transition: transform 0.4s ease-out, opacity 0.4s ease-out;
        }
        
        .scale-in.visible {
          transform: scale(1);
          opacity: 1;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }
        
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }
      `;
      document.head.appendChild(style);
      
      this.setupScrollAnimations();
    },

    setupScrollAnimations: function() {
      // Setup scroll-triggered animations
      if ('IntersectionObserver' in window) {
        var animationObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        }, {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation classes
        var animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
        for (var i = 0; i < animatedElements.length; i++) {
          animationObserver.observe(animatedElements[i]);
        }
      } else {
        // Fallback for browsers without IntersectionObserver
        var animatedElements = document.querySelectorAll('.fade-in, .slide-up, .scale-in');
        for (var i = 0; i < animatedElements.length; i++) {
          animatedElements[i].classList.add('visible');
        }
      }
    },

    setupInteractiveElements: function() {
      // Setup interactive elements
      this.setupButtons();
      this.setupCards();
      this.setupTooltips();
    },

    setupButtons: function() {
      // Add ripple effect to buttons
      var buttons = document.querySelectorAll('button, .btn, [role="button"]');
      
      for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function(e) {
          var ripple = document.createElement('span');
          ripple.classList.add('ripple');
          
          var rect = this.getBoundingClientRect();
          var size = Math.max(rect.width, rect.height);
          var x = e.clientX - rect.left - size / 2;
          var y = e.clientY - rect.top - size / 2;
          
          ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
          `;
          
          this.style.position = 'relative';
          this.style.overflow = 'hidden';
          this.appendChild(ripple);
          
          setTimeout(function() {
            if (ripple.parentNode) {
              ripple.parentNode.removeChild(ripple);
            }
          }, 600);
        });
      }
      
      // Add ripple animation CSS
      var style = document.createElement('style');
      style.textContent = `
        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    },

    setupCards: function() {
      // Add hover effects to cards
      var cards = document.querySelectorAll('.card, [data-card]');
      
      for (var i = 0; i < cards.length; i++) {
        cards[i].classList.add('hover-lift');
      }
    },

    setupTooltips: function() {
      // Simple tooltip functionality
      var tooltipElements = document.querySelectorAll('[data-tooltip]');
      
      for (var i = 0; i < tooltipElements.length; i++) {
        var element = tooltipElements[i];
        
        element.addEventListener('mouseenter', function() {
          var tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          tooltip.textContent = this.getAttribute('data-tooltip');
          tooltip.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 14px;
            white-space: nowrap;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
          `;
          
          document.body.appendChild(tooltip);
          
          var rect = this.getBoundingClientRect();
          tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
          tooltip.style.top = (rect.top - tooltip.offsetHeight - 8) + 'px';
          
          setTimeout(function() {
            tooltip.style.opacity = '1';
          }, 10);
          
          this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
          if (this._tooltip) {
            var tooltip = this._tooltip;
            tooltip.style.opacity = '0';
            setTimeout(function() {
              if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
              }
            }, 300);
            this._tooltip = null;
          }
        });
      }
    },

    setupAccessibility: function() {
      // Improve accessibility
      this.setupKeyboardNavigation();
      this.setupFocusManagement();
      this.setupAriaLabels();
    },

    setupKeyboardNavigation: function() {
      // Improve keyboard navigation
      document.addEventListener('keydown', function(e) {
        // Escape key closes modals/overlays
        if (e.key === 'Escape') {
          var activeOverlay = document.querySelector('.overlay.active');
          if (activeOverlay && window.BSOverlayTypes) {
            window.BSOverlayTypes.close(activeOverlay);
          }
        }
        
        // Enter key activates buttons
        if (e.key === 'Enter' && e.target.getAttribute('role') === 'button') {
          e.target.click();
        }
      });
    },

    setupFocusManagement: function() {
      // Improve focus management
      var focusableElements = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
      
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          var focusable = Array.from(document.querySelectorAll(focusableElements));
          var currentIndex = focusable.indexOf(document.activeElement);
          
          if (e.shiftKey) {
            // Shift + Tab (previous)
            if (currentIndex <= 0) {
              e.preventDefault();
              focusable[focusable.length - 1].focus();
            }
          } else {
            // Tab (next)
            if (currentIndex >= focusable.length - 1) {
              e.preventDefault();
              focusable[0].focus();
            }
          }
        }
      });
    },

    setupAriaLabels: function() {
      // Add missing ARIA labels
      var buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
      for (var i = 0; i < buttons.length; i++) {
        var button = buttons[i];
        if (!button.textContent.trim()) {
          button.setAttribute('aria-label', 'Button');
        }
      }
      
      var links = document.querySelectorAll('a:not([aria-label]):not([aria-labelledby])');
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (!link.textContent.trim() && link.querySelector('img')) {
          link.setAttribute('aria-label', 'Link');
        }
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      bsIndex2.init();
    });
  } else {
    bsIndex2.init();
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = bsIndex2;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSIndex2 = bsIndex2;
  }
})();
