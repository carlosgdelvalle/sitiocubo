// Legacy overrides for backward compatibility
// Provides compatibility with older browser features

(function() {
  'use strict';

  var legacyOverrides = {
    init: function() {
      this.polyfillFeatures();
      this.setupLegacySupport();
    },

    polyfillFeatures: function() {
      // Polyfill for Array.from if not available
      if (!Array.from) {
        Array.from = function(arrayLike) {
          var result = [];
          for (var i = 0; i < arrayLike.length; i++) {
            result.push(arrayLike[i]);
          }
          return result;
        };
      }

      // Polyfill for Object.assign if not available
      if (!Object.assign) {
        Object.assign = function(target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
          return target;
        };
      }

      // Polyfill for classList if not available
      if (!('classList' in document.createElement('_'))) {
        this.addClassListPolyfill();
      }
    },

    addClassListPolyfill: function() {
      // Simple classList polyfill
      (function() {
        var regExp = function(name) {
          return new RegExp('(^| )' + name + '( |$)');
        };
        
        var forEach = function(list, fn, scope) {
          for (var i = 0; i < list.length; i++) {
            fn.call(scope, list[i]);
          }
        };
        
        // class list object with basic methods
        function ClassList(element) {
          this.element = element;
        }
        
        ClassList.prototype = {
          add: function() {
            forEach(arguments, function(name) {
              if (!this.contains(name)) {
                this.element.className += ' ' + name;
              }
            }, this);
          },
          remove: function() {
            forEach(arguments, function(name) {
              this.element.className = 
                this.element.className.replace(regExp(name), '');
            }, this);
          },
          toggle: function(name) {
            return this.contains(name) 
              ? (this.remove(name), false) 
              : (this.add(name), true);
          },
          contains: function(name) {
            return regExp(name).test(this.element.className);
          }
        };
        
        window.DOMTokenList = ClassList;
        
        function defineElementGetter(obj, prop, getter) {
          if (Object.defineProperty) {
            Object.defineProperty(obj, prop, { get: getter });
          }
        }
        
        defineElementGetter(Element.prototype, 'classList', function() {
          return new ClassList(this);
        });
      })();
    },

    setupLegacySupport: function() {
      // Add legacy browser support classes
      var html = document.documentElement;
      
      // Detect IE versions
      var ie = (function() {
        var undef,
            v = 3,
            div = document.createElement('div'),
            all = div.getElementsByTagName('i');
        
        while (
          div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
          all[0]
        );
        
        return v > 4 ? v : undef;
      }());
      
      if (ie) {
        html.className += ' ie ie' + ie;
      }
      
      // Add touch support detection
      if ('ontouchstart' in window) {
        html.className += ' touch';
      } else {
        html.className += ' no-touch';
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      legacyOverrides.init();
    });
  } else {
    legacyOverrides.init();
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = legacyOverrides;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSLegacyOverrides = legacyOverrides;
  }
})();
