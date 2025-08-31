// Data aids for website functionality
// Provides data handling and processing utilities

(function() {
  'use strict';

  var dataAids = {
    init: function() {
      this.setupDataAttributes();
      this.setupDataProcessing();
      this.setupDataValidation();
    },

    setupDataAttributes: function() {
      // Process data attributes for dynamic behavior
      this.processToggleElements();
      this.processConditionalElements();
      this.processDataBindings();
    },

    processToggleElements: function() {
      // Handle elements with data-toggle attributes
      var toggleElements = document.querySelectorAll('[data-toggle]');
      
      for (var i = 0; i < toggleElements.length; i++) {
        var element = toggleElements[i];
        var target = element.getAttribute('data-toggle');
        
        element.addEventListener('click', function(e) {
          e.preventDefault();
          var targetElement = document.querySelector(this.getAttribute('data-toggle'));
          
          if (targetElement) {
            if (targetElement.style.display === 'none' || !targetElement.style.display) {
              targetElement.style.display = 'block';
              this.classList.add('active');
            } else {
              targetElement.style.display = 'none';
              this.classList.remove('active');
            }
          }
        });
      }
    },

    processConditionalElements: function() {
      // Handle elements with conditional display
      var conditionalElements = document.querySelectorAll('[data-show-if], [data-hide-if]');
      
      for (var i = 0; i < conditionalElements.length; i++) {
        var element = conditionalElements[i];
        this.evaluateCondition(element);
      }
    },

    evaluateCondition: function(element) {
      var showIf = element.getAttribute('data-show-if');
      var hideIf = element.getAttribute('data-hide-if');
      
      if (showIf) {
        var condition = this.parseCondition(showIf);
        element.style.display = condition ? 'block' : 'none';
      }
      
      if (hideIf) {
        var condition = this.parseCondition(hideIf);
        element.style.display = condition ? 'none' : 'block';
      }
    },

    parseCondition: function(conditionString) {
      // Simple condition parser
      // Supports: element-exists:selector, screen-size:mobile/desktop, etc.
      var parts = conditionString.split(':');
      var type = parts[0];
      var value = parts[1];
      
      switch (type) {
        case 'element-exists':
          return document.querySelector(value) !== null;
        
        case 'screen-size':
          if (value === 'mobile') {
            return window.innerWidth <= 768;
          } else if (value === 'desktop') {
            return window.innerWidth > 768;
          }
          break;
        
        case 'has-class':
          var parts = value.split(',');
          var selector = parts[0];
          var className = parts[1];
          var element = document.querySelector(selector);
          return element && element.classList.contains(className);
        
        default:
          return false;
      }
      
      return false;
    },

    processDataBindings: function() {
      // Handle data binding attributes
      var bindElements = document.querySelectorAll('[data-bind]');
      
      for (var i = 0; i < bindElements.length; i++) {
        var element = bindElements[i];
        var binding = element.getAttribute('data-bind');
        this.setupBinding(element, binding);
      }
    },

    setupBinding: function(element, binding) {
      // Simple data binding setup
      var parts = binding.split(':');
      var property = parts[0];
      var source = parts[1];
      
      if (property === 'text' && source) {
        var sourceElement = document.querySelector(source);
        if (sourceElement) {
          element.textContent = sourceElement.textContent;
          
          // Setup observer for changes
          if (window.MutationObserver) {
            var observer = new MutationObserver(function() {
              element.textContent = sourceElement.textContent;
            });
            
            observer.observe(sourceElement, {
              childList: true,
              subtree: true,
              characterData: true
            });
          }
        }
      }
    },

    setupDataProcessing: function() {
      // Setup data processing utilities
      this.dataStore = {};
      this.setupDataAPI();
    },

    setupDataAPI: function() {
      // Create a simple data API
      window.BSData = {
        set: function(key, value) {
          dataAids.dataStore[key] = value;
          dataAids.notifyDataChange(key, value);
        },
        
        get: function(key) {
          return dataAids.dataStore[key];
        },
        
        remove: function(key) {
          delete dataAids.dataStore[key];
          dataAids.notifyDataChange(key, null);
        },
        
        clear: function() {
          dataAids.dataStore = {};
        }
      };
    },

    notifyDataChange: function(key, value) {
      // Notify elements that depend on this data
      var dependentElements = document.querySelectorAll('[data-depends="' + key + '"]');
      
      for (var i = 0; i < dependentElements.length; i++) {
        var element = dependentElements[i];
        var action = element.getAttribute('data-action') || 'update-text';
        
        switch (action) {
          case 'update-text':
            element.textContent = value || '';
            break;
          
          case 'update-value':
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
              element.value = value || '';
            }
            break;
          
          case 'toggle-visibility':
            element.style.display = value ? 'block' : 'none';
            break;
        }
      }
    },

    setupDataValidation: function() {
      // Setup data validation utilities
      window.BSValidate = {
        email: function(email) {
          var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return re.test(email);
        },
        
        phone: function(phone) {
          var re = /^[\+]?[1-9][\d]{0,15}$/;
          return re.test(phone.replace(/\s/g, ''));
        },
        
        required: function(value) {
          return value && value.toString().trim().length > 0;
        },
        
        minLength: function(value, min) {
          return value && value.toString().length >= min;
        },
        
        maxLength: function(value, max) {
          return !value || value.toString().length <= max;
        },
        
        number: function(value) {
          return !isNaN(parseFloat(value)) && isFinite(value);
        },
        
        url: function(url) {
          try {
            new URL(url);
            return true;
          } catch (e) {
            return false;
          }
        }
      };
    },

    // Utility functions for data manipulation
    formatData: function(data, format) {
      switch (format) {
        case 'currency':
          return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
          }).format(data);
        
        case 'date':
          return new Date(data).toLocaleDateString('es-PE');
        
        case 'time':
          return new Date(data).toLocaleTimeString('es-PE');
        
        case 'percentage':
          return (data * 100).toFixed(2) + '%';
        
        default:
          return data;
      }
    },

    sanitizeData: function(data) {
      if (typeof data === 'string') {
        return data
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
      }
      return data;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      dataAids.init();
    });
  } else {
    dataAids.init();
  }

  // Re-evaluate conditions on resize
  window.addEventListener('resize', function() {
    var conditionalElements = document.querySelectorAll('[data-show-if], [data-hide-if]');
    for (var i = 0; i < conditionalElements.length; i++) {
      dataAids.evaluateCondition(conditionalElements[i]);
    }
  });

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataAids;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSDataAids = dataAids;
  }
})();
