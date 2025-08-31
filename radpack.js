// Radpack module loader
// Provides module loading and dependency management

(function() {
  'use strict';

  // Module registry
  var modules = {};
  var loadedModules = {};
  var loadingModules = {};

  // Radpack function
  function radpack(moduleName) {
    return new Promise(function(resolve, reject) {
      // Check if module is already loaded
      if (loadedModules[moduleName]) {
        resolve(loadedModules[moduleName]);
        return;
      }

      // Check if module is currently loading
      if (loadingModules[moduleName]) {
        loadingModules[moduleName].push({ resolve: resolve, reject: reject });
        return;
      }

      // Start loading the module
      loadingModules[moduleName] = [{ resolve: resolve, reject: reject }];

      // Try to load from registered modules first
      if (modules[moduleName]) {
        try {
          var moduleExports = modules[moduleName]();
          loadedModules[moduleName] = moduleExports;
          
          // Resolve all waiting promises
          loadingModules[moduleName].forEach(function(promise) {
            promise.resolve(moduleExports);
          });
          delete loadingModules[moduleName];
        } catch (error) {
          // Reject all waiting promises
          loadingModules[moduleName].forEach(function(promise) {
            promise.reject(error);
          });
          delete loadingModules[moduleName];
        }
        return;
      }

      // Fallback: create a mock module for missing dependencies
      console.warn('Module not found: ' + moduleName + '. Creating fallback.');
      
      var fallbackModule = createFallbackModule(moduleName);
      loadedModules[moduleName] = fallbackModule;
      
      // Resolve all waiting promises
      loadingModules[moduleName].forEach(function(promise) {
        promise.resolve(fallbackModule);
      });
      delete loadingModules[moduleName];
    });
  }

  // Create fallback module for missing dependencies
  function createFallbackModule(moduleName) {
    var fallback = {
      default: function() {
        return {
          init: function() {
            console.log('Fallback module initialized: ' + moduleName);
          },
          render: function() {
            return document.createElement('div');
          }
        };
      }
    };

    // Add common properties that might be expected
    fallback.Component = fallback.default;
    fallback.Theme = fallback.default;
    
    return fallback;
  }

  // Register a module
  radpack.register = function(name, factory) {
    modules[name] = factory;
  };

  // Define common modules that might be needed
  radpack.register('@widget/LAYOUT/bs-layout9-Theme-publish-Theme', function() {
    return {
      default: function() {
        return {
          init: function() {
            console.log('Layout theme initialized');
          },
          applyTheme: function() {
            // Apply basic theme styles
            var style = document.createElement('style');
            style.textContent = `
              .layout-theme {
                font-family: 'Squada One', sans-serif;
                color: #111;
              }
              .primary-color { color: #FFD703; }
              .accent-color { color: #111; }
              .neutral-color { color: #fff; }
            `;
            document.head.appendChild(style);
          }
        };
      }
    };
  });

  // Register other common widget modules
  var commonModules = [
    '@widget/LAYOUT/bs-Hamburger-Component',
    '@widget/LAYOUT/bs-FlyoutMenu-Component',
    '@widget/LAYOUT/bs-LinkAwareComponent',
    '@widget/LAYOUT/bs-MobileFlyoutMenu-Component',
    '@widget/CONTACT/bs-contact1-contact-form',
    '@widget/CONTACT/bs-Component',
    '@widget/CONTACT/bs-genericMap'
  ];

  commonModules.forEach(function(moduleName) {
    radpack.register(moduleName, function() {
      return {
        default: function() {
          return {
            init: function() {
              console.log('Component initialized: ' + moduleName);
            },
            render: function() {
              return document.createElement('div');
            },
            destroy: function() {
              console.log('Component destroyed: ' + moduleName);
            }
          };
        }
      };
    });
  });

  // Expose radpack globally
  window.radpack = radpack;

  // Also create Core.utils if it doesn't exist
  if (!window.Core) {
    window.Core = {
      utils: {
        deferBootstrap: function(config, immediate) {
          // Simple bootstrap implementation
          if (immediate === false) {
            // Defer execution
            setTimeout(function() {
              radpack(config.radpack).then(function(module) {
                if (module && module.default) {
                  var component = new module.default();
                  if (component.init) {
                    component.init();
                  }
                }
              }).catch(function(error) {
                console.warn('Failed to bootstrap component:', config.componentName, error);
              });
            }, 0);
          } else {
            // Immediate execution
            radpack(config.radpack).then(function(module) {
              if (module && module.default) {
                var component = new module.default();
                if (component.init) {
                  component.init();
                }
              }
            }).catch(function(error) {
              console.warn('Failed to bootstrap component:', config.componentName, error);
            });
          }
        }
      }
    };
  }

  console.log('Radpack module loader initialized');
})();
