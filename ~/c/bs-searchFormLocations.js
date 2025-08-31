// Search form locations functionality
// Provides location-based search form behavior

(function() {
  'use strict';

  var searchFormLocations = {
    init: function() {
      this.setupLocationSearch();
      this.setupGeolocation();
      this.setupAutocomplete();
    },

    setupLocationSearch: function() {
      var locationInputs = document.querySelectorAll('input[data-location-search]');
      
      for (var i = 0; i < locationInputs.length; i++) {
        var input = locationInputs[i];
        input.addEventListener('input', this.handleLocationInput.bind(this));
        input.addEventListener('focus', this.showLocationSuggestions.bind(this));
      }
    },

    handleLocationInput: function(event) {
      var input = event.target;
      var value = input.value.trim();
      
      if (value.length > 2) {
        this.searchLocations(value, input);
      } else {
        this.hideSuggestions(input);
      }
    },

    searchLocations: function(query, input) {
      // Simulate location search results
      var mockResults = [
        'Lima, Peru',
        'San Isidro, Lima',
        'Miraflores, Lima',
        'Surco, Lima',
        'La Molina, Lima'
      ].filter(function(location) {
        return location.toLowerCase().includes(query.toLowerCase());
      });

      this.displaySuggestions(mockResults, input);
    },

    displaySuggestions: function(suggestions, input) {
      var existingSuggestions = input.parentNode.querySelector('.location-suggestions');
      if (existingSuggestions) {
        existingSuggestions.remove();
      }

      if (suggestions.length === 0) {
        return;
      }

      var suggestionsList = document.createElement('div');
      suggestionsList.className = 'location-suggestions';
      suggestionsList.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ccc;
        border-top: none;
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      `;

      for (var i = 0; i < suggestions.length; i++) {
        var suggestion = document.createElement('div');
        suggestion.className = 'location-suggestion';
        suggestion.textContent = suggestions[i];
        suggestion.style.cssText = `
          padding: 10px;
          cursor: pointer;
          border-bottom: 1px solid #eee;
        `;
        
        suggestion.addEventListener('mouseenter', function() {
          this.style.backgroundColor = '#f5f5f5';
        });
        
        suggestion.addEventListener('mouseleave', function() {
          this.style.backgroundColor = '';
        });
        
        suggestion.addEventListener('click', function() {
          input.value = this.textContent;
          suggestionsList.remove();
          input.dispatchEvent(new Event('change'));
        });

        suggestionsList.appendChild(suggestion);
      }

      input.parentNode.style.position = 'relative';
      input.parentNode.appendChild(suggestionsList);
    },

    hideSuggestions: function(input) {
      var suggestions = input.parentNode.querySelector('.location-suggestions');
      if (suggestions) {
        suggestions.remove();
      }
    },

    showLocationSuggestions: function(event) {
      var input = event.target;
      if (input.value.trim().length > 2) {
        this.searchLocations(input.value.trim(), input);
      }
    },

    setupGeolocation: function() {
      var geoButtons = document.querySelectorAll('[data-get-location]');
      
      for (var i = 0; i < geoButtons.length; i++) {
        geoButtons[i].addEventListener('click', this.getCurrentLocation.bind(this));
      }
    },

    getCurrentLocation: function(event) {
      var button = event.target;
      var targetInput = document.querySelector(button.getAttribute('data-target') || 'input[data-location-search]');
      
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
      }

      button.disabled = true;
      button.textContent = 'Obteniendo ubicación...';

      navigator.geolocation.getCurrentPosition(
        function(position) {
          // Simulate reverse geocoding
          var lat = position.coords.latitude;
          var lng = position.coords.longitude;
          
          // Mock location based on coordinates
          var location = 'Lima, Peru (lat: ' + lat.toFixed(4) + ', lng: ' + lng.toFixed(4) + ')';
          
          if (targetInput) {
            targetInput.value = location;
            targetInput.dispatchEvent(new Event('change'));
          }
          
          button.disabled = false;
          button.textContent = 'Usar mi ubicación';
        },
        function(error) {
          console.error('Error getting location:', error);
          alert('No se pudo obtener la ubicación.');
          button.disabled = false;
          button.textContent = 'Usar mi ubicación';
        }
      );
    },

    setupAutocomplete: function() {
      // Setup autocomplete for common locations
      var commonLocations = [
        'Lima, Peru',
        'Callao, Peru',
        'Arequipa, Peru',
        'Trujillo, Peru',
        'Chiclayo, Peru',
        'Piura, Peru',
        'Iquitos, Peru',
        'Cusco, Peru',
        'Chimbote, Peru',
        'Huancayo, Peru'
      ];

      window.LocationAutocomplete = {
        getCommonLocations: function() {
          return commonLocations;
        },
        
        searchLocations: function(query) {
          return commonLocations.filter(function(location) {
            return location.toLowerCase().includes(query.toLowerCase());
          });
        }
      };
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      searchFormLocations.init();
    });
  } else {
    searchFormLocations.init();
  }

  // Export for external use
  window.SearchFormLocations = searchFormLocations;

})();
