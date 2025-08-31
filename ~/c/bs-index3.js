// Index3 module for website functionality
// Provides core functionality for the website components

(function() {
  'use strict';

  // Core utilities
  var utils = {
    ready: function(fn) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
      } else {
        fn();
      }
    },
    
    addClass: function(element, className) {
      if (element && element.classList) {
        element.classList.add(className);
      }
    },
    
    removeClass: function(element, className) {
      if (element && element.classList) {
        element.classList.remove(className);
      }
    },
    
    hasClass: function(element, className) {
      return element && element.classList && element.classList.contains(className);
    }
  };

  // Initialize core functionality
  utils.ready(function() {
    // Initialize any core components here
    console.log('Index3 module loaded');
  });

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSIndex3 = utils;
  }
})();
