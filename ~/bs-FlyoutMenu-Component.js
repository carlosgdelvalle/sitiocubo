// Flyout Menu Component
// Provides flyout menu functionality for navigation

(function() {
  'use strict';

  var FlyoutMenu = {
    init: function() {
      this.setupStyles();
      this.setupMenus();
      this.setupEventListeners();
    },

    setupStyles: function() {
      var style = document.createElement('style');
      style.textContent = `
        .flyout-menu {
          position: relative;
          display: inline-block;
        }
        
        .flyout-menu-trigger {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 4px;
          transition: background-color 0.2s;
        }
        
        .flyout-menu-trigger:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .flyout-menu-content {
          position: absolute;
          top: 100%;
          left: 0;
          min-width: 200px;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-10px);
          transition: all 0.2s ease;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .flyout-menu.open .flyout-menu-content {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .flyout-menu-item {
          display: block;
          padding: 12px 16px;
          color: #333;
          text-decoration: none;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s;
        }
        
        .flyout-menu-item:hover {
          background-color: #f8f9fa;
          color: #000;
        }
        
        .flyout-menu-item:last-child {
          border-bottom: none;
        }
        
        .flyout-menu-item.disabled {
          color: #999;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        .flyout-menu-divider {
          height: 1px;
          background-color: #e9ecef;
          margin: 4px 0;
        }
        
        .flyout-menu-header {
          padding: 8px 16px;
          font-weight: bold;
          color: #666;
          font-size: 0.875rem;
          text-transform: uppercase;
          background-color: #f8f9fa;
          border-bottom: 1px solid #e9ecef;
        }
        
        .flyout-menu-right .flyout-menu-content {
          right: 0;
          left: auto;
        }
        
        .flyout-menu-up .flyout-menu-content {
          top: auto;
          bottom: 100%;
          transform: translateY(10px);
        }
        
        .flyout-menu-up.open .flyout-menu-content {
          transform: translateY(0);
        }
        
        .flyout-submenu {
          position: relative;
        }
        
        .flyout-submenu .flyout-menu-content {
          top: 0;
          left: 100%;
          margin-left: -1px;
        }
        
        .flyout-submenu.flyout-menu-left .flyout-menu-content {
          left: auto;
          right: 100%;
          margin-left: 0;
          margin-right: -1px;
        }
        
        .flyout-menu-arrow {
          display: inline-block;
          margin-left: auto;
          font-size: 0.8em;
        }
        
        .flyout-menu-arrow::after {
          content: '▶';
        }
        
        .flyout-submenu.flyout-menu-left .flyout-menu-arrow::after {
          content: '◀';
        }
      `;
      document.head.appendChild(style);
    },

    setupMenus: function() {
      var menus = document.querySelectorAll('.flyout-menu');
      
      for (var i = 0; i < menus.length; i++) {
        this.initializeMenu(menus[i]);
      }
    },

    initializeMenu: function(menu) {
      var trigger = menu.querySelector('.flyout-menu-trigger');
      var content = menu.querySelector('.flyout-menu-content');
      
      if (!trigger || !content) {
        return;
      }
      
      // Add accessibility attributes
      var menuId = 'flyout-menu-' + Math.random().toString(36).substr(2, 9);
      content.id = menuId;
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', menuId);
      
      // Setup trigger events
      trigger.addEventListener('click', this.toggleMenu.bind(this, menu));
      trigger.addEventListener('keydown', this.handleTriggerKeydown.bind(this, menu));
      
      // Setup menu item events
      var items = content.querySelectorAll('.flyout-menu-item');
      for (var i = 0; i < items.length; i++) {
        items[i].addEventListener('keydown', this.handleItemKeydown.bind(this, menu));
      }
      
      // Setup submenu events
      var submenus = content.querySelectorAll('.flyout-submenu');
      for (var j = 0; j < submenus.length; j++) {
        this.initializeSubmenu(submenus[j]);
      }
    },

    initializeSubmenu: function(submenu) {
      var trigger = submenu.querySelector('.flyout-menu-item');
      var content = submenu.querySelector('.flyout-menu-content');
      
      if (!trigger || !content) {
        return;
      }
      
      // Add arrow indicator
      if (!trigger.querySelector('.flyout-menu-arrow')) {
        var arrow = document.createElement('span');
        arrow.className = 'flyout-menu-arrow';
        trigger.appendChild(arrow);
      }
      
      // Setup hover events for submenus
      submenu.addEventListener('mouseenter', function() {
        submenu.classList.add('open');
      });
      
      submenu.addEventListener('mouseleave', function() {
        submenu.classList.remove('open');
      });
    },

    setupEventListeners: function() {
      // Close menus when clicking outside
      document.addEventListener('click', this.handleDocumentClick.bind(this));
      
      // Close menus on escape key
      document.addEventListener('keydown', this.handleDocumentKeydown.bind(this));
      
      // Handle window resize
      window.addEventListener('resize', this.handleWindowResize.bind(this));
    },

    toggleMenu: function(menu, event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      
      var isOpen = menu.classList.contains('open');
      
      // Close all other menus first
      this.closeAllMenus();
      
      if (!isOpen) {
        this.openMenu(menu);
      }
    },

    openMenu: function(menu) {
      menu.classList.add('open');
      
      var trigger = menu.querySelector('.flyout-menu-trigger');
      var content = menu.querySelector('.flyout-menu-content');
      
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'true');
      }
      
      // Focus first menu item
      if (content) {
        var firstItem = content.querySelector('.flyout-menu-item:not(.disabled)');
        if (firstItem) {
          setTimeout(function() {
            firstItem.focus();
          }, 100);
        }
      }
      
      // Adjust position if menu goes off screen
      this.adjustMenuPosition(menu);
      
      // Dispatch custom event
      menu.dispatchEvent(new CustomEvent('flyout-menu-open'));
    },

    closeMenu: function(menu) {
      menu.classList.remove('open');
      
      var trigger = menu.querySelector('.flyout-menu-trigger');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
      
      // Close all submenus
      var submenus = menu.querySelectorAll('.flyout-submenu');
      for (var i = 0; i < submenus.length; i++) {
        submenus[i].classList.remove('open');
      }
      
      // Dispatch custom event
      menu.dispatchEvent(new CustomEvent('flyout-menu-close'));
    },

    closeAllMenus: function() {
      var openMenus = document.querySelectorAll('.flyout-menu.open');
      for (var i = 0; i < openMenus.length; i++) {
        this.closeMenu(openMenus[i]);
      }
    },

    adjustMenuPosition: function(menu) {
      var content = menu.querySelector('.flyout-menu-content');
      if (!content) return;
      
      var rect = content.getBoundingClientRect();
      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      
      // Adjust horizontal position
      if (rect.right > windowWidth) {
        menu.classList.add('flyout-menu-right');
      }
      
      // Adjust vertical position
      if (rect.bottom > windowHeight) {
        menu.classList.add('flyout-menu-up');
      }
    },

    handleDocumentClick: function(event) {
      var flyoutMenu = event.target.closest('.flyout-menu');
      if (!flyoutMenu) {
        this.closeAllMenus();
      }
    },

    handleDocumentKeydown: function(event) {
      if (event.key === 'Escape') {
        this.closeAllMenus();
      }
    },

    handleTriggerKeydown: function(menu, event) {
      switch (event.key) {
        case 'Enter':
        case ' ':
        case 'ArrowDown':
          event.preventDefault();
          this.toggleMenu(menu);
          break;
      }
    },

    handleItemKeydown: function(menu, event) {
      var items = Array.from(menu.querySelectorAll('.flyout-menu-item:not(.disabled)'));
      var currentIndex = items.indexOf(event.target);
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          var nextIndex = (currentIndex + 1) % items.length;
          items[nextIndex].focus();
          break;
          
        case 'ArrowUp':
          event.preventDefault();
          var prevIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
          items[prevIndex].focus();
          break;
          
        case 'Escape':
          event.preventDefault();
          this.closeMenu(menu);
          menu.querySelector('.flyout-menu-trigger').focus();
          break;
          
        case 'Enter':
        case ' ':
          if (event.target.href) {
            // Let the default action happen for links
            return;
          }
          event.preventDefault();
          event.target.click();
          break;
      }
    },

    handleWindowResize: function() {
      // Close all menus on resize to prevent positioning issues
      this.closeAllMenus();
    },

    // Public API
    open: function(selector) {
      var menu = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (menu && menu.classList.contains('flyout-menu')) {
        this.openMenu(menu);
      }
    },

    close: function(selector) {
      if (selector) {
        var menu = typeof selector === 'string' ? document.querySelector(selector) : selector;
        if (menu && menu.classList.contains('flyout-menu')) {
          this.closeMenu(menu);
        }
      } else {
        this.closeAllMenus();
      }
    },

    toggle: function(selector) {
      var menu = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (menu && menu.classList.contains('flyout-menu')) {
        this.toggleMenu(menu);
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      FlyoutMenu.init();
    });
  } else {
    FlyoutMenu.init();
  }

  // Export for external use
  window.FlyoutMenu = FlyoutMenu;

})();
