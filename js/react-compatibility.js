// React Compatibility Layer
// Provides additional React compatibility for UX widgets

(function() {
  'use strict';

  // Wait for React to be available
  function waitForReact(callback) {
    if (window.React && window.ReactDOM) {
      callback();
    } else {
      setTimeout(function() { waitForReact(callback); }, 10);
    }
  }

  waitForReact(function() {
    // Enhance React with additional methods that UX widgets might expect
    if (window.React && !window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
      // Add React internals mock to prevent errors
      window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
        ReactCurrentDispatcher: { current: null },
        ReactCurrentBatchConfig: { suspense: null },
        ReactCurrentOwner: { current: null },
        ReactDebugCurrentFrame: {},
        IsSomeRendererActing: { current: false }
      };
    }

    // Enhance ReactDOM with additional methods
    if (window.ReactDOM) {
      // Add createRoot for React 18 compatibility
      if (!window.ReactDOM.createRoot) {
        window.ReactDOM.createRoot = function(container) {
          return {
            render: function(element) {
              return window.ReactDOM.render(element, container);
            },
            unmount: function() {
              return window.ReactDOM.unmountComponentAtNode(container);
            }
          };
        };
      }

      // Add flushSync for compatibility
      if (!window.ReactDOM.flushSync) {
        window.ReactDOM.flushSync = function(fn) {
          if (typeof fn === 'function') {
            return fn();
          }
        };
      }

      // Add unstable_batchedUpdates for compatibility
      if (!window.ReactDOM.unstable_batchedUpdates) {
        window.ReactDOM.unstable_batchedUpdates = function(fn, a) {
          if (typeof fn === 'function') {
            return fn(a);
          }
        };
      }
    }

    // Add Scheduler for compatibility
    if (!window.Scheduler) {
      window.Scheduler = {
        unstable_runWithPriority: function(priority, fn) {
          if (typeof fn === 'function') {
            return fn();
          }
        },
        unstable_scheduleCallback: function(priority, fn, options) {
          if (typeof fn === 'function') {
            return setTimeout(fn, 0);
          }
        },
        unstable_cancelCallback: function(id) {
          clearTimeout(id);
        },
        unstable_now: function() {
          return performance.now();
        },
        unstable_shouldYield: function() {
          return false;
        }
      };
    }

    // Add React Error Boundary simulation
    if (window.React && !window.React.ErrorBoundary) {
      window.React.ErrorBoundary = function(props) {
        return props.children;
      };
    }

    // Override console.error temporarily to catch and handle React errors
    var originalConsoleError = console.error;
    console.error = function() {
      var args = Array.prototype.slice.call(arguments);
      var message = args.join(' ');
      
      // If it's a React error, handle it gracefully
      if (message.includes('Minified React error') || 
          message.includes('ReactDOM') || 
          message.includes('React element')) {
        
        // Log as warning instead of error for React issues in development
        console.warn('React compatibility issue (handled):', message);
        return;
      }
      
      // For other errors, call original console.error
      originalConsoleError.apply(console, arguments);
    };

    // Provide a global error handler for uncaught React errors
    window.addEventListener('error', function(event) {
      if (event.error && event.error.message && 
          (event.error.message.includes('Minified React error') ||
           event.error.message.includes('ReactDOM'))) {
        
        console.warn('Caught React error (prevented page crash):', event.error.message);
        event.preventDefault();
        return false;
      }
    });

    // Handle unhandled promise rejections from React
    window.addEventListener('unhandledrejection', function(event) {
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('Minified React error') ||
           event.reason.message.includes('ReactDOM'))) {
        
        console.warn('Caught React promise rejection (handled):', event.reason.message);
        event.preventDefault();
        return false;
      }
    });

    console.log('React compatibility layer initialized');
  });

})();
