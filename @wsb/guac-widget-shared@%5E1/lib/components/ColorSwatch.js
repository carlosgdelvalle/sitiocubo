// ColorSwatch Component
// Provides color selection and display functionality

(function(global, factory) {
  'use strict';
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    (global = global || self).ColorSwatch = factory();
  }
})(this, function() {
  'use strict';

  function ColorSwatch(element, options) {
    this.element = element;
    this.options = Object.assign({
      colors: ['#FFD703', '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF'],
      selectedColor: null,
      allowCustom: true,
      showHex: true,
      size: 'medium' // small, medium, large
    }, options);

    this.selectedColor = this.options.selectedColor;
    this.swatches = [];

    this.init();
  }

  ColorSwatch.prototype = {
    init: function() {
      this.setupStyles();
      this.createSwatches();
      this.setupEvents();
      this.setupAccessibility();
    },

    setupStyles: function() {
      if (document.querySelector('#color-swatch-styles')) {
        return; // Styles already added
      }

      var style = document.createElement('style');
      style.id = 'color-swatch-styles';
      style.textContent = `
        .color-swatch-container {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #fff;
        }
        
        .color-swatch {
          position: relative;
          cursor: pointer;
          border: 2px solid transparent;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .color-swatch.small {
          width: 24px;
          height: 24px;
        }
        
        .color-swatch.medium {
          width: 32px;
          height: 32px;
        }
        
        .color-swatch.large {
          width: 48px;
          height: 48px;
        }
        
        .color-swatch:hover {
          transform: scale(1.1);
          border-color: #333;
        }
        
        .color-swatch.selected {
          border-color: #FFD703;
          border-width: 3px;
          transform: scale(1.1);
        }
        
        .color-swatch-checkmark {
          display: none;
          color: white;
          font-weight: bold;
          font-size: 16px;
          text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        }
        
        .color-swatch.selected .color-swatch-checkmark {
          display: block;
        }
        
        .color-swatch.light.selected .color-swatch-checkmark {
          color: black;
          text-shadow: 1px 1px 1px rgba(255,255,255,0.5);
        }
        
        .color-input-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 8px;
        }
        
        .color-input {
          width: 60px;
          height: 32px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .color-text-input {
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-family: monospace;
          font-size: 12px;
          width: 80px;
        }
        
        .color-swatch-label {
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }
      `;
      document.head.appendChild(style);
    },

    createSwatches: function() {
      this.element.className = 'color-swatch-container';
      
      // Add label if specified
      if (this.options.label) {
        var label = document.createElement('div');
        label.className = 'color-swatch-label';
        label.textContent = this.options.label;
        this.element.appendChild(label);
      }

      // Create swatches for predefined colors
      for (var i = 0; i < this.options.colors.length; i++) {
        this.createSwatch(this.options.colors[i]);
      }

      // Add custom color input if allowed
      if (this.options.allowCustom) {
        this.createCustomColorInput();
      }

      // Select initial color if specified
      if (this.selectedColor) {
        this.selectColor(this.selectedColor);
      }
    },

    createSwatch: function(color) {
      var swatch = document.createElement('div');
      swatch.className = 'color-swatch ' + this.options.size;
      swatch.style.backgroundColor = color;
      swatch.setAttribute('data-color', color);
      
      // Determine if color is light for checkmark color
      if (this.isLightColor(color)) {
        swatch.classList.add('light');
      }

      // Add checkmark
      var checkmark = document.createElement('span');
      checkmark.className = 'color-swatch-checkmark';
      checkmark.innerHTML = '✓';
      swatch.appendChild(checkmark);

      this.element.appendChild(swatch);
      this.swatches.push(swatch);

      return swatch;
    },

    createCustomColorInput: function() {
      var container = document.createElement('div');
      container.className = 'color-input-container';

      var colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.className = 'color-input';
      colorInput.value = this.selectedColor || '#FFD703';

      if (this.options.showHex) {
        var textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.className = 'color-text-input';
        textInput.value = colorInput.value;
        textInput.placeholder = '#FFFFFF';
        container.appendChild(textInput);

        // Sync color and text inputs
        var self = this;
        colorInput.addEventListener('input', function() {
          textInput.value = colorInput.value.toUpperCase();
          self.selectColor(colorInput.value);
        });

        textInput.addEventListener('input', function() {
          var value = textInput.value;
          if (self.isValidHexColor(value)) {
            colorInput.value = value;
            self.selectColor(value);
          }
        });
      }

      container.appendChild(colorInput);
      this.element.appendChild(container);

      var self = this;
      colorInput.addEventListener('change', function() {
        self.selectColor(colorInput.value);
      });
    },

    setupEvents: function() {
      var self = this;

      // Swatch click events
      this.swatches.forEach(function(swatch) {
        swatch.addEventListener('click', function() {
          var color = swatch.getAttribute('data-color');
          self.selectColor(color);
        });

        swatch.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            var color = swatch.getAttribute('data-color');
            self.selectColor(color);
          }
        });
      });
    },

    setupAccessibility: function() {
      this.element.setAttribute('role', 'group');
      this.element.setAttribute('aria-label', 'Color selection');

      this.swatches.forEach(function(swatch, index) {
        swatch.setAttribute('role', 'button');
        swatch.setAttribute('tabindex', '0');
        swatch.setAttribute('aria-label', 'Select color ' + swatch.getAttribute('data-color'));
      });
    },

    selectColor: function(color) {
      // Remove selection from all swatches
      this.swatches.forEach(function(swatch) {
        swatch.classList.remove('selected');
      });

      // Add selection to matching swatch
      var matchingSwatch = this.element.querySelector('[data-color="' + color + '"]');
      if (matchingSwatch) {
        matchingSwatch.classList.add('selected');
      }

      // Update selected color
      var oldColor = this.selectedColor;
      this.selectedColor = color;

      // Dispatch change event
      this.dispatchEvent('colorchange', {
        oldColor: oldColor,
        newColor: color,
        element: this.element
      });
    },

    getSelectedColor: function() {
      return this.selectedColor;
    },

    addColor: function(color) {
      if (this.options.colors.indexOf(color) === -1) {
        this.options.colors.push(color);
        this.createSwatch(color);
      }
    },

    removeColor: function(color) {
      var index = this.options.colors.indexOf(color);
      if (index > -1) {
        this.options.colors.splice(index, 1);
        var swatch = this.element.querySelector('[data-color="' + color + '"]');
        if (swatch) {
          swatch.remove();
          var swatchIndex = this.swatches.indexOf(swatch);
          if (swatchIndex > -1) {
            this.swatches.splice(swatchIndex, 1);
          }
        }
      }
    },

    isLightColor: function(color) {
      // Convert hex to RGB and calculate luminance
      var hex = color.replace('#', '');
      var r = parseInt(hex.substr(0, 2), 16);
      var g = parseInt(hex.substr(2, 2), 16);
      var b = parseInt(hex.substr(4, 2), 16);
      
      // Calculate relative luminance
      var luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    },

    isValidHexColor: function(color) {
      return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
    },

    dispatchEvent: function(eventName, detail) {
      if (typeof CustomEvent !== 'undefined') {
        var event = new CustomEvent(eventName, { detail: detail });
        this.element.dispatchEvent(event);
      }
    },

    destroy: function() {
      this.element.innerHTML = '';
      this.swatches = [];
    }
  };

  // Static methods
  ColorSwatch.init = function(selector, options) {
    var elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : [selector];
    
    var instances = [];
    for (var i = 0; i < elements.length; i++) {
      if (elements[i] && !elements[i]._colorSwatch) {
        var instance = new ColorSwatch(elements[i], options);
        elements[i]._colorSwatch = instance;
        instances.push(instance);
      }
    }
    
    return instances.length === 1 ? instances[0] : instances;
  };

  return ColorSwatch;
});

// Auto-initialize color swatches
if (typeof document !== 'undefined') {
  function initColorSwatches() {
    var swatches = document.querySelectorAll('[data-color-swatch]');
    for (var i = 0; i < swatches.length; i++) {
      if (!swatches[i]._colorSwatch) {
        var options = {};
        var colors = swatches[i].getAttribute('data-colors');
        if (colors) {
          options.colors = colors.split(',');
        }
        
        var selected = swatches[i].getAttribute('data-selected');
        if (selected) {
          options.selectedColor = selected;
        }
        
        window.ColorSwatch.init(swatches[i], options);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initColorSwatches);
  } else {
    initColorSwatches();
  }
}
