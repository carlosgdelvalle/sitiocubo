// React CommonJS External
// Provides React compatibility for CommonJS modules

(function() {
  'use strict';

  // Mock React object for compatibility
  var React = {
    createElement: function(type, props) {
      var children = Array.prototype.slice.call(arguments, 2);
      
      // Simple createElement implementation
      var element = {
        type: type,
        props: props || {},
        children: children
      };
      
      // Add children to props if they exist
      if (children.length > 0) {
        element.props.children = children.length === 1 ? children[0] : children;
      }
      
      return element;
    },

    Component: function(props) {
      this.props = props || {};
      this.state = {};
    },

    Fragment: function(props) {
      return React.createElement('div', props);
    },

    createContext: function(defaultValue) {
      return {
        Provider: function(props) {
          return React.createElement('div', props);
        },
        Consumer: function(props) {
          return React.createElement('div', props);
        },
        displayName: 'Context'
      };
    },

    useState: function(initialState) {
      // Mock useState hook
      var state = initialState;
      var setState = function(newState) {
        if (typeof newState === 'function') {
          state = newState(state);
        } else {
          state = newState;
        }
      };
      return [state, setState];
    },

    useEffect: function(effect, deps) {
      // Mock useEffect hook
      if (typeof effect === 'function') {
        setTimeout(effect, 0);
      }
    },

    useContext: function(context) {
      // Mock useContext hook
      return {};
    },

    useMemo: function(factory, deps) {
      // Mock useMemo hook
      return typeof factory === 'function' ? factory() : factory;
    },

    useCallback: function(callback, deps) {
      // Mock useCallback hook
      return callback;
    },

    useRef: function(initialValue) {
      // Mock useRef hook
      return { current: initialValue };
    }
  };

  // Add Component prototype methods
  React.Component.prototype.setState = function(newState) {
    if (typeof newState === 'function') {
      this.state = Object.assign({}, this.state, newState(this.state));
    } else {
      this.state = Object.assign({}, this.state, newState);
    }
  };

  React.Component.prototype.forceUpdate = function() {
    // Mock forceUpdate
  };

  // Mock ReactDOM for basic compatibility
  var ReactDOM = {
    render: function(element, container) {
      if (!container || typeof container.innerHTML === 'undefined') {
        console.warn('ReactDOM.render: Invalid container provided');
        return null;
      }
      
      try {
        // Check if container already has React content
        if (container._reactRootContainer) {
          return container._reactRootContainer;
        }
        
        // Create a minimal React root simulation
        container._reactRootContainer = {
          render: function(element) {
            // Very basic rendering - just for compatibility
            container.innerHTML = '<div data-react-root="true">React Component Rendered</div>';
          },
          unmount: function() {
            delete container._reactRootContainer;
            container.innerHTML = '';
          }
        };
        
        container._reactRootContainer.render(element);
        return container._reactRootContainer;
      } catch (error) {
        console.warn('ReactDOM.render error:', error);
        return null;
      }
    },

    unmountComponentAtNode: function(container) {
      if (!container) return false;
      
      try {
        if (container._reactRootContainer) {
          container._reactRootContainer.unmount();
          return true;
        }
        
        if (container.innerHTML) {
          container.innerHTML = '';
        }
        return false;
      } catch (error) {
        console.warn('ReactDOM.unmountComponentAtNode error:', error);
        return false;
      }
    },

    findDOMNode: function(component) {
      // Always return null to avoid DOM manipulation issues
      return null;
    },

    createPortal: function(children, container) {
      // Return children as-is for portal compatibility
      return children;
    },

    hydrate: function(element, container) {
      // For hydration, just call render but don't clear existing content
      if (container && !container._reactRootContainer) {
        return ReactDOM.render(element, container);
      }
      return container._reactRootContainer;
    }
  };

  // Export both React and ReactDOM
  var reactModule = {
    default: React,
    React: React,
    ReactDOM: ReactDOM,
    createElement: React.createElement,
    Component: React.Component,
    Fragment: React.Fragment,
    createContext: React.createContext,
    useState: React.useState,
    useEffect: React.useEffect,
    useContext: React.useContext,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    useRef: React.useRef
  };

  // Make React available globally
  if (typeof window !== 'undefined') {
    window.React = window.React || React;
    window.ReactDOM = window.ReactDOM || ReactDOM;
    
    // Also create a mock React object if none exists
    if (!window.React) {
      window.React = {
        createElement: function(type, props) {
          var element = document.createElement(type === 'div' ? 'div' : 'span');
          if (props) {
            for (var prop in props) {
              if (prop !== 'children' && props.hasOwnProperty(prop)) {
                element.setAttribute(prop, props[prop]);
              }
            }
          }
          return element;
        },
        Component: function() {},
        Fragment: 'div'
      };
    }
  }

  // CommonJS/AMD compatibility
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = reactModule;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return reactModule; });
  }

})();