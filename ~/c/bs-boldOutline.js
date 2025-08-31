// Bold outline styles and functionality
// Provides bold outline styling for interactive elements

(function() {
  'use strict';

  var boldOutline = {
    init: function() {
      this.setupOutlineStyles();
      this.setupFocusHandling();
    },

    setupOutlineStyles: function() {
      // Create and inject CSS for bold outlines
      var style = document.createElement('style');
      style.textContent = `
        .bold-outline {
          outline: 2px solid #FFD703;
          outline-offset: 2px;
        }
        
        .bold-outline:focus {
          outline: 3px solid #FFD703;
          outline-offset: 3px;
        }
        
        .btn-outline {
          border: 2px solid #FFD703;
          background: transparent;
          color: #FFD703;
          font-weight: bold;
        }
        
        .btn-outline:hover {
          background: #FFD703;
          color: #111111;
        }
      `;
      document.head.appendChild(style);
    },

    setupFocusHandling: function() {
      // Add focus handling for accessibility
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-navigation');
        }
      });

      document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
      });
    },

    applyBoldOutline: function(element) {
      if (element) {
        element.classList.add('bold-outline');
      }
    },

    removeBoldOutline: function(element) {
      if (element) {
        element.classList.remove('bold-outline');
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      boldOutline.init();
    });
  } else {
    boldOutline.init();
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = boldOutline;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSBoldOutline = boldOutline;
  }
})();
