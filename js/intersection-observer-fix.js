// IntersectionObserver fix for safer element observation
// This script provides a safer wrapper around IntersectionObserver

(function() {
  'use strict';

  // Store the original IntersectionObserver
  var OriginalIntersectionObserver = window.IntersectionObserver;

  // Create a safer wrapper
  function SafeIntersectionObserver(callback, options) {
    // Wrap the callback to add safety checks
    var safeCallback = function(entries, observer) {
      try {
        // Filter out any invalid entries
        var validEntries = entries.filter(function(entry) {
          return entry && 
                 entry.target && 
                 entry.target.nodeType === 1 && // Ensure it's an element
                 typeof entry.isIntersecting === 'boolean';
        });
        
        if (validEntries.length > 0) {
          callback(validEntries, observer);
        }
      } catch (error) {
        console.warn('IntersectionObserver callback error:', error);
      }
    };

    // Create the original observer with the safe callback
    return new OriginalIntersectionObserver(safeCallback, options);
  }

  // Copy static properties
  SafeIntersectionObserver.prototype = OriginalIntersectionObserver.prototype;
  
  // Override the observe method to add element validation
  var originalObserve = OriginalIntersectionObserver.prototype.observe;
  SafeIntersectionObserver.prototype.observe = function(element) {
    if (!element || element.nodeType !== 1) {
      // Silently ignore invalid elements to reduce console noise
      return;
    }
    
    try {
      return originalObserve.call(this, element);
    } catch (error) {
      console.warn('IntersectionObserver.observe error:', error);
    }
  };

  // Override the unobserve method to add element validation
  var originalUnobserve = OriginalIntersectionObserver.prototype.unobserve;
  SafeIntersectionObserver.prototype.unobserve = function(element) {
    if (!element || element.nodeType !== 1) {
      return;
    }
    
    try {
      return originalUnobserve.call(this, element);
    } catch (error) {
      console.warn('IntersectionObserver.unobserve error:', error);
    }
  };

  // Replace the global IntersectionObserver with our safer version
  window.IntersectionObserver = SafeIntersectionObserver;

  // Also provide a fallback for browsers that don't support IntersectionObserver
  if (!OriginalIntersectionObserver) {
    window.IntersectionObserver = function(callback, options) {
      // Fallback implementation that immediately triggers for all observed elements
      this.observe = function(element) {
        if (element && element.nodeType === 1) {
          setTimeout(function() {
            try {
              callback([{
                target: element,
                isIntersecting: true,
                intersectionRatio: 1,
                boundingClientRect: element.getBoundingClientRect(),
                rootBounds: null,
                time: Date.now()
              }], this);
            } catch (error) {
              console.warn('Fallback IntersectionObserver callback error:', error);
            }
          }.bind(this), 100);
        }
      };
      
      this.unobserve = function(element) {
        // No-op for fallback
      };
      
      this.disconnect = function() {
        // No-op for fallback
      };
    };
  }

  // IntersectionObserver safety wrapper initialized silently
})();
