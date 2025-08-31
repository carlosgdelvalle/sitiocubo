// Overlay types and functionality
// Provides different types of overlays for the website

(function() {
  'use strict';

  var overlayTypes = {
    init: function() {
      this.setupOverlayStyles();
      this.registerOverlayTypes();
    },

    setupOverlayStyles: function() {
      var style = document.createElement('style');
      style.textContent = `
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 9999;
          display: none;
        }
        
        .overlay.active {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .overlay-modal {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          max-width: 90%;
          max-height: 90%;
          overflow: auto;
          position: relative;
        }
        
        .overlay-fullscreen {
          background: rgba(17, 17, 17, 0.95);
          color: white;
        }
        
        .overlay-notification {
          background: rgba(255, 215, 3, 0.95);
          color: #111;
          padding: 1rem;
          text-align: center;
        }
        
        .overlay-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
        }
        
        .overlay-close:hover {
          opacity: 0.7;
        }
      `;
      document.head.appendChild(style);
    },

    registerOverlayTypes: function() {
      this.types = {
        modal: this.createModal,
        fullscreen: this.createFullscreen,
        notification: this.createNotification,
        loading: this.createLoading
      };
    },

    create: function(type, content, options) {
      options = options || {};
      
      if (this.types[type]) {
        return this.types[type](content, options);
      }
      
      return this.createModal(content, options);
    },

    createModal: function(content, options) {
      var overlay = document.createElement('div');
      overlay.className = 'overlay';
      
      var modal = document.createElement('div');
      modal.className = 'overlay-modal';
      
      if (options.closable !== false) {
        var closeBtn = document.createElement('button');
        closeBtn.className = 'overlay-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
          overlayTypes.close(overlay);
        });
        modal.appendChild(closeBtn);
      }
      
      if (typeof content === 'string') {
        modal.innerHTML += content;
      } else {
        modal.appendChild(content);
      }
      
      overlay.appendChild(modal);
      document.body.appendChild(overlay);
      
      return overlay;
    },

    createFullscreen: function(content, options) {
      var overlay = document.createElement('div');
      overlay.className = 'overlay overlay-fullscreen';
      
      if (options.closable !== false) {
        var closeBtn = document.createElement('button');
        closeBtn.className = 'overlay-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.addEventListener('click', function() {
          overlayTypes.close(overlay);
        });
        overlay.appendChild(closeBtn);
      }
      
      if (typeof content === 'string') {
        overlay.innerHTML += content;
      } else {
        overlay.appendChild(content);
      }
      
      document.body.appendChild(overlay);
      
      return overlay;
    },

    createNotification: function(content, options) {
      var overlay = document.createElement('div');
      overlay.className = 'overlay overlay-notification';
      
      if (typeof content === 'string') {
        overlay.innerHTML = content;
      } else {
        overlay.appendChild(content);
      }
      
      document.body.appendChild(overlay);
      
      // Auto-close after delay
      if (options.autoClose !== false) {
        setTimeout(function() {
          overlayTypes.close(overlay);
        }, options.delay || 3000);
      }
      
      return overlay;
    },

    createLoading: function(content, options) {
      var overlay = document.createElement('div');
      overlay.className = 'overlay';
      
      var loader = document.createElement('div');
      loader.innerHTML = content || 'Loading...';
      loader.style.cssText = 'text-align: center; color: white; font-size: 1.2rem;';
      
      overlay.appendChild(loader);
      document.body.appendChild(overlay);
      
      return overlay;
    },

    show: function(overlay) {
      if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    close: function(overlay) {
      if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(function() {
          if (overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
          }
        }, 300);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      overlayTypes.init();
    });
  } else {
    overlayTypes.init();
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = overlayTypes;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSOverlayTypes = overlayTypes;
  }
})();
