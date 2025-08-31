// Carousel Component (Versioned Widget Library)
// Advanced carousel component for the guac-widget-shared system

(function(global, factory) {
  'use strict';
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    (global = global || self).GuacCarousel = factory();
  }
})(this, function() {
  'use strict';

  function GuacCarousel(element, options) {
    this.element = element;
    this.options = Object.assign({
      interval: 5000,
      pause: 'hover',
      wrap: true,
      keyboard: true,
      touch: true,
      indicators: true,
      controls: true,
      fade: false,
      autoHeight: false
    }, options);

    this.currentIndex = 0;
    this.isPlaying = false;
    this.intervalId = null;
    this.items = [];
    this.indicators = [];
    this.isTransitioning = false;

    this.init();
  }

  GuacCarousel.prototype = {
    init: function() {
      this.setupElements();
      this.setupStyles();
      this.setupEvents();
      this.setupAccessibility();
      
      if (this.options.interval > 0) {
        this.start();
      }
    },

    setupElements: function() {
      this.inner = this.element.querySelector('.carousel-inner') || this.element;
      this.items = Array.from(this.element.querySelectorAll('.carousel-item, .slide'));
      this.prevBtn = this.element.querySelector('.carousel-control-prev, .prev');
      this.nextBtn = this.element.querySelector('.carousel-control-next, .next');
      this.indicatorsList = this.element.querySelector('.carousel-indicators, .indicators');

      if (this.indicatorsList) {
        this.indicators = Array.from(this.indicatorsList.querySelectorAll('li, button'));
      }

      // Create items if they don't exist (for simple image carousels)
      if (this.items.length === 0) {
        var images = this.element.querySelectorAll('img');
        for (var i = 0; i < images.length; i++) {
          var item = document.createElement('div');
          item.className = 'carousel-item';
          item.appendChild(images[i].cloneNode(true));
          this.inner.appendChild(item);
        }
        this.items = Array.from(this.element.querySelectorAll('.carousel-item'));
      }

      // Set first item as active if none are active
      if (!this.element.querySelector('.carousel-item.active, .slide.active') && this.items.length > 0) {
        this.items[0].classList.add('active');
        if (this.indicators.length > 0) {
          this.indicators[0].classList.add('active');
        }
      }

      // Find current active index
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].classList.contains('active')) {
          this.currentIndex = i;
          break;
        }
      }
    },

    setupStyles: function() {
      if (document.querySelector('#guac-carousel-styles')) {
        return; // Styles already added
      }

      var style = document.createElement('style');
      style.id = 'guac-carousel-styles';
      style.textContent = `
        .guac-carousel {
          position: relative;
          overflow: hidden;
        }
        
        .guac-carousel .carousel-inner {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .guac-carousel .carousel-item {
          position: relative;
          display: none;
          float: left;
          width: 100%;
          margin-right: -100%;
          backface-visibility: hidden;
          transition: transform 0.6s ease-in-out;
        }
        
        .guac-carousel .carousel-item.active {
          display: block;
        }
        
        .guac-carousel .carousel-item img {
          width: 100%;
          height: auto;
          display: block;
        }
        
        .guac-carousel .carousel-control-prev,
        .guac-carousel .carousel-control-next {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          background: rgba(0, 0, 0, 0.5);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          line-height: 1;
          opacity: 0.7;
          transition: opacity 0.3s;
        }
        
        .guac-carousel .carousel-control-prev:hover,
        .guac-carousel .carousel-control-next:hover {
          opacity: 1;
        }
        
        .guac-carousel .carousel-control-prev {
          left: 10px;
        }
        
        .guac-carousel .carousel-control-next {
          right: 10px;
        }
        
        .guac-carousel .carousel-indicators {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          z-index: 10;
        }
        
        .guac-carousel .carousel-indicators li,
        .guac-carousel .carousel-indicators button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: background 0.3s;
        }
        
        .guac-carousel .carousel-indicators .active {
          background: rgba(255, 255, 255, 1);
        }
      `;
      document.head.appendChild(style);
    },

    setupEvents: function() {
      var self = this;

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if (!self.isTransitioning) {
            self.prev();
          }
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          if (!self.isTransitioning) {
            self.next();
          }
        });
      }

      // Indicator events
      this.indicators.forEach(function(indicator, index) {
        indicator.addEventListener('click', function(e) {
          e.preventDefault();
          if (!self.isTransitioning) {
            self.goTo(index);
          }
        });
      });

      // Keyboard navigation
      if (this.options.keyboard) {
        this.element.addEventListener('keydown', function(e) {
          if (self.isTransitioning) return;
          
          switch (e.key) {
            case 'ArrowLeft':
              e.preventDefault();
              self.prev();
              break;
            case 'ArrowRight':
              e.preventDefault();
              self.next();
              break;
          }
        });
      }

      // Touch/swipe support
      if (this.options.touch) {
        this.setupTouchEvents();
      }

      // Pause on hover
      if (this.options.pause === 'hover') {
        this.element.addEventListener('mouseenter', function() {
          self.pause();
        });
        
        this.element.addEventListener('mouseleave', function() {
          if (self.options.interval > 0) {
            self.start();
          }
        });
      }

      // Visibility change handling
      if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', function() {
          if (document.hidden) {
            self.pause();
          } else if (self.options.interval > 0 && !self.isPlaying) {
            self.start();
          }
        });
      }
    },

    setupTouchEvents: function() {
      var self = this;
      var startX = 0;
      var currentX = 0;
      var isDragging = false;
      var threshold = 50;

      this.element.addEventListener('touchstart', function(e) {
        if (self.isTransitioning) return;
        startX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });

      this.element.addEventListener('touchmove', function(e) {
        if (!isDragging || self.isTransitioning) return;
        currentX = e.touches[0].clientX;
      }, { passive: true });

      this.element.addEventListener('touchend', function(e) {
        if (!isDragging || self.isTransitioning) return;
        isDragging = false;

        var diff = startX - currentX;
        if (Math.abs(diff) > threshold) {
          if (diff > 0) {
            self.next();
          } else {
            self.prev();
          }
        }
      }, { passive: true });
    },

    setupAccessibility: function() {
      this.element.setAttribute('role', 'region');
      this.element.setAttribute('aria-label', 'Image carousel');
      this.element.setAttribute('tabindex', '0');

      if (this.inner) {
        this.inner.setAttribute('aria-live', 'polite');
      }

      if (this.prevBtn) {
        this.prevBtn.setAttribute('aria-label', 'Previous image');
        this.prevBtn.innerHTML = '‹';
      }
      
      if (this.nextBtn) {
        this.nextBtn.setAttribute('aria-label', 'Next image');
        this.nextBtn.innerHTML = '›';
      }

      this.indicators.forEach(function(indicator, index) {
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      });
    },

    goTo: function(index) {
      if (index < 0 || index >= this.items.length || index === this.currentIndex || this.isTransitioning) {
        return;
      }

      this.slide(index);
    },

    next: function() {
      if (this.isTransitioning) return;
      
      var nextIndex = this.options.wrap ? 
        (this.currentIndex + 1) % this.items.length :
        Math.min(this.currentIndex + 1, this.items.length - 1);
      
      if (nextIndex !== this.currentIndex) {
        this.slide(nextIndex);
      }
    },

    prev: function() {
      if (this.isTransitioning) return;
      
      var prevIndex = this.options.wrap ?
        (this.currentIndex - 1 + this.items.length) % this.items.length :
        Math.max(this.currentIndex - 1, 0);
      
      if (prevIndex !== this.currentIndex) {
        this.slide(prevIndex);
      }
    },

    slide: function(index) {
      if (this.isTransitioning || index === this.currentIndex) return;
      
      this.isTransitioning = true;
      var self = this;
      var currentItem = this.items[this.currentIndex];
      var nextItem = this.items[index];

      if (!currentItem || !nextItem) {
        this.isTransitioning = false;
        return;
      }

      // Dispatch slide start event
      this.dispatchEvent('slide.carousel', {
        from: this.currentIndex,
        to: index
      });

      // Update active states
      currentItem.classList.remove('active');
      nextItem.classList.add('active');

      // Update indicators
      if (this.indicators.length > 0) {
        this.indicators[this.currentIndex].classList.remove('active');
        this.indicators[index].classList.add('active');
      }

      var oldIndex = this.currentIndex;
      this.currentIndex = index;

      // End transition after animation
      setTimeout(function() {
        self.isTransitioning = false;
        self.dispatchEvent('slid.carousel', {
          from: oldIndex,
          to: index
        });
      }, 600);
    },

    start: function() {
      if (this.isPlaying || this.options.interval <= 0 || this.items.length <= 1) return;

      this.isPlaying = true;
      var self = this;
      this.intervalId = setInterval(function() {
        if (!self.isTransitioning) {
          self.next();
        }
      }, this.options.interval);
    },

    pause: function() {
      if (!this.isPlaying) return;

      this.isPlaying = false;
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    },

    destroy: function() {
      this.pause();
      this.element.removeAttribute('role');
      this.element.removeAttribute('aria-label');
      this.element.removeAttribute('tabindex');
      
      // Remove event listeners would go here in a full implementation
    },

    dispatchEvent: function(eventName, detail) {
      if (typeof CustomEvent !== 'undefined') {
        var event = new CustomEvent(eventName, { detail: detail });
        this.element.dispatchEvent(event);
      }
    }
  };

  // Static methods
  GuacCarousel.init = function(selector, options) {
    var elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : [selector];
    
    var instances = [];
    for (var i = 0; i < elements.length; i++) {
      if (elements[i] && !elements[i]._guacCarousel) {
        elements[i].classList.add('guac-carousel');
        var instance = new GuacCarousel(elements[i], options);
        elements[i]._guacCarousel = instance;
        instances.push(instance);
      }
    }
    
    return instances.length === 1 ? instances[0] : instances;
  };

  return GuacCarousel;
});

// Auto-initialize carousels
if (typeof document !== 'undefined') {
  function initGuacCarousels() {
    var carousels = document.querySelectorAll('[data-carousel], .carousel[data-auto-init]');
    for (var i = 0; i < carousels.length; i++) {
      if (!carousels[i]._guacCarousel) {
        window.GuacCarousel.init(carousels[i]);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGuacCarousels);
  } else {
    initGuacCarousels();
  }
}
