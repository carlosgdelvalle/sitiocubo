// Theme overrides for the website
// Provides theme-specific styling and behavior

(function() {
  'use strict';

  var themeOverrides = {
    init: function() {
      // Apply theme-specific overrides
      this.applyColorScheme();
      this.setupResponsiveElements();
    },

    applyColorScheme: function() {
      // Apply the primary color scheme
      var primaryColor = '#FFD703';
      var accentColor = '#111111';
      var neutralColor = '#FFFFFF';
      
      // Set CSS custom properties if supported
      if (window.CSS && CSS.supports('color', 'var(--primary)')) {
        document.documentElement.style.setProperty('--primary-color', primaryColor);
        document.documentElement.style.setProperty('--accent-color', accentColor);
        document.documentElement.style.setProperty('--neutral-color', neutralColor);
      }
    },

    setupResponsiveElements: function() {
      // Setup responsive behavior for theme elements
      var mediaQuery = window.matchMedia('(max-width: 768px)');
      
      function handleResponsive(e) {
        if (e.matches) {
          // Mobile styles
          document.body.classList.add('mobile-theme');
        } else {
          // Desktop styles
          document.body.classList.remove('mobile-theme');
        }
      }
      
      mediaQuery.addListener(handleResponsive);
      handleResponsive(mediaQuery);
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      themeOverrides.init();
    });
  } else {
    themeOverrides.init();
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = themeOverrides;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSThemeOverrides = themeOverrides;
  }
})();
