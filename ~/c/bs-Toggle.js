// Toggle functionality
// Provides toggle button and switch components

(function() {
  'use strict';

  var bsToggle = {
    init: function() {
      this.setupToggleButtons();
      this.setupToggleSwitches();
      this.setupToggleStyles();
    },

    setupToggleStyles: function() {
      var style = document.createElement('style');
      style.textContent = `
        .bs-toggle {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        
        .bs-toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        
        .bs-toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        
        .bs-toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        
        .bs-toggle input:checked + .bs-toggle-slider {
          background-color: #FFD703;
        }
        
        .bs-toggle input:focus + .bs-toggle-slider {
          box-shadow: 0 0 1px #FFD703;
        }
        
        .bs-toggle input:checked + .bs-toggle-slider:before {
          transform: translateX(26px);
        }
        
        .bs-toggle-button {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #495057;
          padding: 0.375rem 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease-in-out;
          border-radius: 0.25rem;
        }
        
        .bs-toggle-button:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }
        
        .bs-toggle-button.active {
          background: #FFD703;
          border-color: #FFD703;
          color: #000;
        }
        
        .bs-toggle-button:focus {
          outline: 0;
          box-shadow: 0 0 0 0.2rem rgba(255, 215, 3, 0.25);
        }
        
        .bs-toggle-group {
          display: flex;
          flex-wrap: wrap;
        }
        
        .bs-toggle-group .bs-toggle-button {
          border-radius: 0;
          margin-left: -1px;
        }
        
        .bs-toggle-group .bs-toggle-button:first-child {
          border-top-left-radius: 0.25rem;
          border-bottom-left-radius: 0.25rem;
          margin-left: 0;
        }
        
        .bs-toggle-group .bs-toggle-button:last-child {
          border-top-right-radius: 0.25rem;
          border-bottom-right-radius: 0.25rem;
        }
      `;
      document.head.appendChild(style);
    },

    setupToggleButtons: function() {
      var toggleButtons = document.querySelectorAll('.bs-toggle-button');
      
      for (var i = 0; i < toggleButtons.length; i++) {
        var button = toggleButtons[i];
        button.addEventListener('click', this.handleToggleButtonClick.bind(this));
      }
    },

    handleToggleButtonClick: function(event) {
      var button = event.target;
      var group = button.closest('.bs-toggle-group');
      
      if (group) {
        // Handle toggle group (radio-like behavior)
        var buttons = group.querySelectorAll('.bs-toggle-button');
        for (var i = 0; i < buttons.length; i++) {
          buttons[i].classList.remove('active');
        }
        button.classList.add('active');
      } else {
        // Handle single toggle button
        button.classList.toggle('active');
      }
      
      // Trigger custom event
      var customEvent = new CustomEvent('bs-toggle-change', {
        detail: {
          button: button,
          active: button.classList.contains('active'),
          value: button.getAttribute('data-value') || button.textContent
        }
      });
      button.dispatchEvent(customEvent);
    },

    setupToggleSwitches: function() {
      var toggleSwitches = document.querySelectorAll('.bs-toggle input[type="checkbox"]');
      
      for (var i = 0; i < toggleSwitches.length; i++) {
        var toggle = toggleSwitches[i];
        toggle.addEventListener('change', this.handleToggleSwitchChange.bind(this));
      }
    },

    handleToggleSwitchChange: function(event) {
      var toggle = event.target;
      var customEvent = new CustomEvent('bs-toggle-switch-change', {
        detail: {
          toggle: toggle,
          checked: toggle.checked,
          value: toggle.value
        }
      });
      toggle.dispatchEvent(customEvent);
    },

    // Public API methods
    toggle: function(element) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      
      if (element && element.classList.contains('bs-toggle-button')) {
        element.click();
      } else if (element && element.type === 'checkbox') {
        element.checked = !element.checked;
        element.dispatchEvent(new Event('change'));
      }
    },

    setToggleState: function(element, state) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      
      if (element && element.classList.contains('bs-toggle-button')) {
        if (state) {
          element.classList.add('active');
        } else {
          element.classList.remove('active');
        }
      } else if (element && element.type === 'checkbox') {
        element.checked = !!state;
        element.dispatchEvent(new Event('change'));
      }
    },

    getToggleState: function(element) {
      if (typeof element === 'string') {
        element = document.querySelector(element);
      }
      
      if (element && element.classList.contains('bs-toggle-button')) {
        return element.classList.contains('active');
      } else if (element && element.type === 'checkbox') {
        return element.checked;
      }
      
      return false;
    },

    createToggleSwitch: function(container, options) {
      options = options || {};
      
      var label = document.createElement('label');
      label.className = 'bs-toggle';
      
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!options.checked;
      input.value = options.value || '';
      
      var slider = document.createElement('span');
      slider.className = 'bs-toggle-slider';
      
      label.appendChild(input);
      label.appendChild(slider);
      
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      
      if (container) {
        container.appendChild(label);
      }
      
      // Setup event listener
      input.addEventListener('change', this.handleToggleSwitchChange.bind(this));
      
      return label;
    },

    createToggleButton: function(container, options) {
      options = options || {};
      
      var button = document.createElement('button');
      button.className = 'bs-toggle-button';
      button.textContent = options.text || 'Toggle';
      button.setAttribute('data-value', options.value || options.text || 'Toggle');
      
      if (options.active) {
        button.classList.add('active');
      }
      
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      
      if (container) {
        container.appendChild(button);
      }
      
      // Setup event listener
      button.addEventListener('click', this.handleToggleButtonClick.bind(this));
      
      return button;
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      bsToggle.init();
    });
  } else {
    bsToggle.init();
  }

  // Export for external use
  window.BSToggle = bsToggle;

})();
