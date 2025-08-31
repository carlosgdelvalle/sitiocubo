// Interop Require Default
// Provides ES6/CommonJS module interoperability

(function() {
  'use strict';

  function interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
  }

  function interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj;
    } else {
      var newObj = {};
      if (obj != null) {
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = obj[key];
          }
        }
      }
      newObj.default = obj;
      return newObj;
    }
  }

  function getInteropRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null;
    var cache = new WeakMap();
    getInteropRequireWildcardCache = function () {
      return cache;
    };
    return cache;
  }

  function interopRequireWildcardCached(obj) {
    if (obj && obj.__esModule) {
      return obj;
    }
    
    if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
      return { default: obj };
    }
    
    var cache = getInteropRequireWildcardCache();
    
    if (cache && cache.has(obj)) {
      return cache.get(obj);
    }
    
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
        
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc);
        } else {
          newObj[key] = obj[key];
        }
      }
    }
    
    newObj.default = obj;
    
    if (cache) {
      cache.set(obj, newObj);
    }
    
    return newObj;
  }

  // Create the module object
  var interopModule = {
    interopRequireDefault: interopRequireDefault,
    interopRequireWildcard: interopRequireWildcard,
    interopRequireWildcardCached: interopRequireWildcardCached,
    default: interopRequireDefault
  };

  // Make available globally
  if (typeof window !== 'undefined') {
    window.interopRequireDefault = interopRequireDefault;
    window.interopRequireWildcard = interopRequireWildcard;
    window.interopRequireWildcardCached = interopRequireWildcardCached;
  }

  // CommonJS/AMD compatibility
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = interopModule;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return interopModule; });
  }

})();