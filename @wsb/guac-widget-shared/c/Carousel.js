// Carousel Widget Component
// Provides image and content carousel functionality

(function() {
  'use strict';

  var Carousel = {
    init: function() {
      this.setupStyles();
      this.setupCarousels();
    },

    setupStyles: function() {
      var style = document.createElement('style');
      style.textContent = `
        .carousel {
          position: relative;
          overflow: hidden;
          width: 100%;
        }
        
        .carousel-inner {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        
        .carousel-item {
          position: relative;
          display: none;
          float: left;
          width: 100%;
          margin-right: -100%;
          backface-visibility: hidden;
          transition: transform 0.6s ease-in-out;
        }
        
        .carousel-item.active {
          display: block;
        }
        
        .carousel-item img {
          width: 100%;
          height: auto;
        }
        
        .carousel-control-prev,
        .carousel-control-next {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 15%;
          color: #fff;
          text-align: center;
          opacity: 0.5;
          transition: opacity 0.15s ease;
          background: none;
          border: none;
          cursor: pointer;
        }
        
        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          opacity: 0.9;
        }
        
        .carousel-control-prev {
          left: 0;
        }
        
        .carousel-control-next {
          right: 0;
        }
        
        .carousel-control-prev-icon,
        .carousel-control-next-icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          line-height: 40px;
          text-align: center;
          font-size: 18px;
        }
        
        .carousel-control-prev-icon::before {
          content: '‹';
        }
        
        .carousel-control-next-icon::before {
          content: '›';
        }
        
        .carousel-indicators {
          position: absolute;
          right: 0;
          bottom: 10px;
          left: 0;
          z-index: 15;
          display: flex;
          justify-content: center;
          padding-left: 0;
          margin-right: 15%;
          margin-left: 15%;
          list-style: none;
        }
        
        .carousel-indicators li {
          box-sizing: content-box;
          flex: 0 1 auto;
          width: 30px;
          height: 3px;
          margin-right: 3px;
          margin-left: 3px;
          text-indent: -999px;
          cursor: pointer;
          background-color: #fff;
          background-clip: padding-box;
          border-top: 10px solid transparent;
          border-bottom: 10px solid transparent;
          opacity: 0.5;
          transition: opacity 0.6s ease;
        }
        
        .carousel-indicators .active {
          opacity: 1;
        }
        
        .carousel-caption {
          position: absolute;
          right: 15%;
          bottom: 20px;
          left: 15%;
          z-index: 10;
          padding-top: 20px;
          padding-bottom: 20px;
          color: #fff;
          text-align: center;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 4px;
        }
      `;
      document.head.appendChild(style);
    },

    setupCarousels: function() {
      var carousels = document.querySelectorAll('.carousel');
      
      for (var i = 0; i < carousels.length; i++) {
        this.initializeCarousel(carousels[i]);
      }
    },

    initializeCarousel: function(carousel) {
      var items = carousel.querySelectorAll('.carousel-item');
      var indicators = carousel.querySelectorAll('.carousel-indicators li');
      var prevBtn = carousel.querySelector('.carousel-control-prev');
      var nextBtn = carousel.querySelector('.carousel-control-next');
      
      var currentIndex = 0;
      var autoplayInterval = null;
      var autoplayDelay = parseInt(carousel.getAttribute('data-interval')) || 5000;
      
      // Make first item active if none are active
      if (!carousel.querySelector('.carousel-item.active')) {
        if (items.length > 0) {
          items[0].classList.add('active');
        }
        if (indicators.length > 0) {
          indicators[0].classList.add('active');
        }
      }
      
      // Find current active index
      for (var i = 0; i < items.length; i++) {
        if (items[i].classList.contains('active')) {
          currentIndex = i;
          break;
        }
      }
      
      function showSlide(index) {
        // Remove active class from all items and indicators
        for (var i = 0; i < items.length; i++) {
          items[i].classList.remove('active');
        }
        for (var i = 0; i < indicators.length; i++) {
          indicators[i].classList.remove('active');
        }
        
        // Add active class to current item and indicator
        if (items[index]) {
          items[index].classList.add('active');
        }
        if (indicators[index]) {
          indicators[index].classList.add('active');
        }
        
        currentIndex = index;
        
        // Dispatch custom event
        carousel.dispatchEvent(new CustomEvent('carousel-slide-change', {
          detail: { index: index, item: items[index] }
        }));
      }
      
      function nextSlide() {
        var newIndex = (currentIndex + 1) % items.length;
        showSlide(newIndex);
      }
      
      function prevSlide() {
        var newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        showSlide(newIndex);
      }
      
      function startAutoplay() {
        if (autoplayDelay > 0 && !carousel.hasAttribute('data-pause')) {
          autoplayInterval = setInterval(nextSlide, autoplayDelay);
        }
      }
      
      function stopAutoplay() {
        if (autoplayInterval) {
          clearInterval(autoplayInterval);
          autoplayInterval = null;
        }
      }
      
      // Event listeners
      if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
          e.preventDefault();
          prevSlide();
          stopAutoplay();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
          e.preventDefault();
          nextSlide();
          stopAutoplay();
        });
      }
      
      // Indicator click events
      for (var i = 0; i < indicators.length; i++) {
        (function(index) {
          indicators[index].addEventListener('click', function(e) {
            e.preventDefault();
            showSlide(index);
            stopAutoplay();
          });
        })(i);
      }
      
      // Touch/swipe support
      var startX = 0;
      var isDown = false;
      
      carousel.addEventListener('mousedown', function(e) {
        isDown = true;
        startX = e.clientX;
      });
      
      carousel.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
      });
      
      carousel.addEventListener('mouseup', function(e) {
        if (!isDown) return;
        isDown = false;
        
        var endX = e.clientX;
        var diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          stopAutoplay();
        }
      });
      
      // Touch events
      carousel.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
      });
      
      carousel.addEventListener('touchend', function(e) {
        var endX = e.changedTouches[0].clientX;
        var diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
          stopAutoplay();
        }
      });
      
      // Keyboard navigation
      carousel.addEventListener('keydown', function(e) {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            prevSlide();
            stopAutoplay();
            break;
          case 'ArrowRight':
            e.preventDefault();
            nextSlide();
            stopAutoplay();
            break;
        }
      });
      
      // Pause on hover
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
      
      // Start autoplay
      startAutoplay();
      
      // Store methods on element for external access
      carousel._carouselNext = nextSlide;
      carousel._carouselPrev = prevSlide;
      carousel._carouselGoTo = showSlide;
      carousel._carouselStop = stopAutoplay;
      carousel._carouselStart = startAutoplay;
    },

    // Public API
    next: function(selector) {
      var carousel = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (carousel && carousel._carouselNext) {
        carousel._carouselNext();
      }
    },

    prev: function(selector) {
      var carousel = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (carousel && carousel._carouselPrev) {
        carousel._carouselPrev();
      }
    },

    goTo: function(selector, index) {
      var carousel = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (carousel && carousel._carouselGoTo) {
        carousel._carouselGoTo(index);
      }
    },

    stop: function(selector) {
      var carousel = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (carousel && carousel._carouselStop) {
        carousel._carouselStop();
      }
    },

    start: function(selector) {
      var carousel = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (carousel && carousel._carouselStart) {
        carousel._carouselStart();
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      Carousel.init();
    });
  } else {
    Carousel.init();
  }

  // Export for external use
  window.Carousel = Carousel;

})();
