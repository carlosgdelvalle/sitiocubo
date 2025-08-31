// Carousel Component (Widget Library Version)
// Advanced carousel component for the widget system

(function(global, factory) {
  'use strict';
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    global.CarouselWidget = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function() {
  'use strict';

  var CarouselWidget = function(element, options) {
    this.element = element;
    this.options = Object.assign({
      interval: 5000,
      pause: 'hover',
      wrap: true,
      keyboard: true,
      touch: true,
      indicators: true,
      controls: true,
      fade: false
    }, options || {});

    this.currentIndex = 0;
    this.isPlaying = false;
    this.intervalId = null;
    this.items = [];
    this.indicators = [];

    this.init();
  };

  CarouselWidget.prototype = {
    init: function() {
      this.setupElements();
      this.setupEvents();
      this.setupAccessibility();
      
      if (this.options.interval > 0) {
        this.start();
      }
    },

    setupElements: function() {
      this.inner = this.element.querySelector('.carousel-inner');
      this.items = Array.from(this.element.querySelectorAll('.carousel-item'));
      this.prevBtn = this.element.querySelector('.carousel-control-prev');
      this.nextBtn = this.element.querySelector('.carousel-control-next');
      this.indicatorsList = this.element.querySelector('.carousel-indicators');

      if (this.indicatorsList) {
        this.indicators = Array.from(this.indicatorsList.querySelectorAll('li'));
      }

      // Set first item as active if none are active
      if (!this.element.querySelector('.carousel-item.active') && this.items.length > 0) {
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

    setupEvents: function() {
      var self = this;

      if (this.prevBtn) {
        this.prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.prev();
        });
      }

      if (this.nextBtn) {
        this.nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          self.next();
        });
      }

      // Indicator events
      this.indicators.forEach(function(indicator, index) {
        indicator.addEventListener('click', function(e) {
          e.preventDefault();
          self.goTo(index);
        });
      });

      // Keyboard navigation
      if (this.options.keyboard) {
        this.element.addEventListener('keydown', function(e) {
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
          self.start();
        });
      }

      // Visibility change handling
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          self.pause();
        } else if (self.options.interval > 0) {
          self.start();
        }
      });
    },

    setupTouchEvents: function() {
      var self = this;
      var startX = 0;
      var currentX = 0;
      var isDragging = false;
      var threshold = 50;

      this.element.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isDragging = true;
      }, { passive: true });

      this.element.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
      }, { passive: true });

      this.element.addEventListener('touchend', function(e) {
        if (!isDragging) return;
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
      // Add ARIA attributes
      this.element.setAttribute('role', 'region');
      this.element.setAttribute('aria-label', 'Carousel');

      if (this.inner) {
        this.inner.setAttribute('role', 'group');
        this.inner.setAttribute('aria-live', 'polite');
      }

      // Add controls accessibility
      if (this.prevBtn) {
        this.prevBtn.setAttribute('aria-label', 'Previous slide');
      }
      if (this.nextBtn) {
        this.nextBtn.setAttribute('aria-label', 'Next slide');
      }

      // Add indicators accessibility
      this.indicators.forEach(function(indicator, index) {
        indicator.setAttribute('role', 'button');
        indicator.setAttribute('aria-label', 'Go to slide ' + (index + 1));
      });
    },

    goTo: function(index) {
      if (index < 0 || index >= this.items.length || index === this.currentIndex) {
        return;
      }

      var direction = index > this.currentIndex ? 'next' : 'prev';
      this.slide(direction, index);
    },

    next: function() {
      var nextIndex = this.options.wrap ? 
        (this.currentIndex + 1) % this.items.length :
        Math.min(this.currentIndex + 1, this.items.length - 1);
      
      if (nextIndex !== this.currentIndex) {
        this.slide('next', nextIndex);
      }
    },

    prev: function() {
      var prevIndex = this.options.wrap ?
        (this.currentIndex - 1 + this.items.length) % this.items.length :
        Math.max(this.currentIndex - 1, 0);
      
      if (prevIndex !== this.currentIndex) {
        this.slide('prev', prevIndex);
      }
    },

    slide: function(direction, index) {
      var self = this;
      var currentItem = this.items[this.currentIndex];
      var nextItem = this.items[index];

      if (!currentItem || !nextItem) return;

      // Dispatch slide start event
      var slideEvent = new CustomEvent('slide.carousel', {
        detail: {
          direction: direction,
          from: this.currentIndex,
          to: index
        }
      });
      this.element.dispatchEvent(slideEvent);

      // Update active states
      currentItem.classList.remove('active');
      nextItem.classList.add('active');

      // Update indicators
      if (this.indicators.length > 0) {
        this.indicators[this.currentIndex].classList.remove('active');
        this.indicators[index].classList.add('active');
      }

      this.currentIndex = index;

      // Dispatch slide end event
      setTimeout(function() {
        var slidEvent = new CustomEvent('slid.carousel', {
          detail: {
            direction: direction,
            from: self.currentIndex,
            to: index
          }
        });
        self.element.dispatchEvent(slidEvent);
      }, 600); // Match CSS transition duration
    },

    start: function() {
      if (this.isPlaying || this.options.interval <= 0) return;

      this.isPlaying = true;
      var self = this;
      this.intervalId = setInterval(function() {
        self.next();
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
      // Remove event listeners and clean up
      this.element.removeAttribute('role');
      this.element.removeAttribute('aria-label');
    }
  };

  // Static method to initialize carousels
  CarouselWidget.init = function(selector, options) {
    var elements = typeof selector === 'string' ? 
      document.querySelectorAll(selector) : [selector];
    
    var instances = [];
    for (var i = 0; i < elements.length; i++) {
      if (elements[i] && !elements[i]._carouselWidget) {
        var instance = new CarouselWidget(elements[i], options);
        elements[i]._carouselWidget = instance;
        instances.push(instance);
      }
    }
    
    return instances.length === 1 ? instances[0] : instances;
  };

  return CarouselWidget;
});

// Auto-initialize carousels when DOM is ready
if (typeof document !== 'undefined') {
  function initCarousels() {
    var carousels = document.querySelectorAll('.carousel[data-auto-init]');
    for (var i = 0; i < carousels.length; i++) {
      if (!carousels[i]._carouselWidget) {
        window.CarouselWidget.init(carousels[i]);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }
}
