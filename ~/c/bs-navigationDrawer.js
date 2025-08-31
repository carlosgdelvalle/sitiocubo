// Navigation drawer functionality
// Provides mobile-friendly navigation drawer behavior

(function() {
  'use strict';

  var navigationDrawer = {
    init: function() {
      this.setupDrawer();
      this.setupToggleButtons();
      this.setupCloseHandlers();
    },

    setupDrawer: function() {
      var style = document.createElement('style');
      style.textContent = `
        .navigation-drawer {
          position: fixed;
          top: 0;
          left: -300px;
          width: 300px;
          height: 100vh;
          background: #fff;
          box-shadow: 2px 0 5px rgba(0,0,0,0.1);
          transition: left 0.3s ease;
          z-index: 10000;
          overflow-y: auto;
        }
        
        .navigation-drawer.open {
          left: 0;
        }
        
        .navigation-drawer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          z-index: 9999;
          display: none;
        }
        
        .navigation-drawer-overlay.active {
          display: block;
        }
        
        .nav-drawer-toggle {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
        }
        
        .nav-drawer-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
      `;
      document.head.appendChild(style);
    },

    setupToggleButtons: function() {
      var toggleButtons = document.querySelectorAll('.nav-drawer-toggle');
      
      for (var i = 0; i < toggleButtons.length; i++) {
        toggleButtons[i].addEventListener('click', this.toggleDrawer.bind(this));
      }
    },

    setupCloseHandlers: function() {
      var closeButtons = document.querySelectorAll('.nav-drawer-close');
      var overlay = document.querySelector('.navigation-drawer-overlay');
      
      for (var i = 0; i < closeButtons.length; i++) {
        closeButtons[i].addEventListener('click', this.closeDrawer.bind(this));
      }
      
      if (overlay) {
        overlay.addEventListener('click', this.closeDrawer.bind(this));
      }
    },

    toggleDrawer: function() {
      var drawer = document.querySelector('.navigation-drawer');
      var overlay = document.querySelector('.navigation-drawer-overlay');
      
      if (drawer && overlay) {
        if (drawer.classList.contains('open')) {
          this.closeDrawer();
        } else {
          this.openDrawer();
        }
      }
    },

    openDrawer: function() {
      var drawer = document.querySelector('.navigation-drawer');
      var overlay = document.querySelector('.navigation-drawer-overlay');
      
      if (drawer && overlay) {
        drawer.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    },

    closeDrawer: function() {
      var drawer = document.querySelector('.navigation-drawer');
      var overlay = document.querySelector('.navigation-drawer-overlay');
      
      if (drawer && overlay) {
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      navigationDrawer.init();
    });
  } else {
    navigationDrawer.init();
  }

  // Export for external use
  window.NavigationDrawer = navigationDrawer;

})();
