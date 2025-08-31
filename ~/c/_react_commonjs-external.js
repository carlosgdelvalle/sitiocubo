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
      if (container && typeof container.innerHTML !== 'undefined') {
        // Very basic rendering - just for compatibility
        container.innerHTML = '<div>React Component Rendered</div>';
      }
    },

    unmountComponentAtNode: function(container) {
      if (container && typeof container.innerHTML !== 'undefined') {
        container.innerHTML = '';
      }
    },

    findDOMNode: function(component) {
      return null;
    },

    createPortal: function(children, container) {
      return children;
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