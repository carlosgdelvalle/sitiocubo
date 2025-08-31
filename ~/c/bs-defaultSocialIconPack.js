// Default social icon pack
// Provides social media icons and functionality

(function() {
  'use strict';

  var socialIconPack = {
    init: function() {
      this.setupSocialIcons();
      this.setupSocialSharing();
    },

    icons: {
      facebook: {
        viewBox: "0 0 24 24",
        path: "M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03h-2.54v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.908h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939z"
      },
      instagram: {
        viewBox: "0 0 24 24",
        path: "M16.604 8.516c.13.35.198.719.203 1.091.033.622.033.811.033 2.386 0 1.574-.004 1.763-.033 2.385a3.273 3.273 0 0 1-.203 1.091 1.956 1.956 0 0 1-1.12 1.12c-.35.13-.719.198-1.091.204-.622.032-.811.032-2.386.032-1.574 0-1.763-.003-2.385-.032a3.273 3.273 0 0 1-1.091-.204 1.956 1.956 0 0 1-1.12-1.12 3.273 3.273 0 0 1-.204-1.09c-.032-.623-.032-.812-.032-2.386 0-1.575.003-1.764.032-2.386.006-.372.074-.741.204-1.09a1.956 1.956 0 0 1 1.12-1.12c.35-.13.718-.199 1.09-.204.623-.033.812-.033 2.386-.033 1.575 0 1.764.004 2.386.033.372.005.741.074 1.09.203.515.2.922.606 1.12 1.12zM12 15.033a3.033 3.033 0 1 0 0-6.066 3.033 3.033 0 0 0 0 6.066zm3.153-5.477a.71.71 0 1 0 0-1.418.71.71 0 0 0 0 1.418zM12 13.967a1.967 1.967 0 1 1 0-3.934 1.967 1.967 0 0 1 0 3.934zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10A10 10 0 0 0 12 2zm5.87 12.433c-.01.49-.102.974-.274 1.432a3.018 3.018 0 0 1-1.727 1.728 4.335 4.335 0 0 1-1.433.272c-.629.03-.829.037-2.432.037-1.604 0-1.819 0-2.433-.037a4.335 4.335 0 0 1-1.433-.272 3.018 3.018 0 0 1-1.727-1.728 4.335 4.335 0 0 1-.273-1.432c-.029-.63-.036-.83-.036-2.433 0-1.604 0-1.818.036-2.433.01-.49.102-.974.273-1.432a3.018 3.018 0 0 1 1.727-1.728 4.335 4.335 0 0 1 1.433-.272c.629-.03.829-.037 2.433-.037 1.603 0 1.818 0 2.432.037.49.009.974.101 1.433.272.794.307 1.42.934 1.727 1.728.172.458.264.943.273 1.432.03.63.036.83.036 2.433 0 1.604-.007 1.804-.036 2.433z"
      },
      linkedin: {
        viewBox: "0 0 24 24",
        path: "M22 12c0-5.524-4.477-10-10-10C6.478 2 2 6.478 2 12c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10zm-5.074-6H6.871C6.391 6 6 6.38 6 6.85v10.098c0 .47.39.852.871.852h10.056a.864.864 0 00.873-.852V6.85a.863.863 0 00-.874-.85zm-8.3 1.621a1.015 1.015 0 11-.003 2.03 1.015 1.015 0 01.002-2.03zm-.876 2.803h1.753v5.63H7.75v-5.63zm2.85 0h-.002l.002-.002v.002zm0 0h1.677v.77h.023c.233-.443.804-.91 1.66-.91 1.771 0 2.098 1.166 2.098 2.682v3.089H14.31v-2.74c0-.652-.011-1.493-.909-1.493-.91 0-1.05.712-1.05 1.446v2.785H10.6v-5.63z"
      },
      twitter: {
        viewBox: "0 0 24 24",
        path: "M22 12c0-5.524-4.477-10-10-10C6.478 2 2 6.478 2 12c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10zm-3.795-3.516c-.33.492-.749.926-1.23 1.271l.008.319c0 3.255-2.477 7.005-7.006 7.005a6.968 6.968 0 01-3.773-1.107 4.94 4.94 0 003.645-1.019 2.466 2.466 0 01-2.3-1.71 2.464 2.464 0 001.112-.042 2.465 2.465 0 01-1.975-2.413v-.032c.333.185.711.295 1.115.309a2.461 2.461 0 01-.762-3.286 6.987 6.987 0 005.075 2.572 2.462 2.462 0 014.196-2.245 4.986 4.986 0 001.564-.597A2.469 2.469 0 0116.79 8.87a4.936 4.936 0 001.414-.387z"
      },
      youtube: {
        viewBox: "0 0 20 20",
        path: "M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10A10 10 0 0 0 10 0zm5.673 10.436c0 .935-.066 1.866-.066 1.866-.027.415-.17.814-.41 1.153-.306.308-.72.483-1.153.487-1.615.116-4.033.12-4.033.12s-2.99-.03-3.913-.117a1.91 1.91 0 0 1-1.25-.49 2.273 2.273 0 0 1-.419-1.146s-.033-.934-.033-1.865V9.56c0-.935.033-1.876.033-1.876s.03-.804.364-1.153c.305-.312.72-.493 1.156-.506 1.615-.116 4.036-.149 4.036-.149s2.411.033 4.026.15c.44.016.855.203 1.16.52.244.336.394.731.436 1.145 0 0 .07.934.07 1.865l-.004.88z"
      }
    },

    setupSocialIcons: function() {
      // Create CSS for social icons
      var style = document.createElement('style');
      style.textContent = `
        .social-icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          margin: 0 5px;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .social-icon:hover {
          transform: scale(1.1);
          opacity: 0.8;
        }
        
        .social-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor;
        }
        
        .social-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .social-share-buttons {
          display: flex;
          gap: 10px;
          margin: 1rem 0;
        }
        
        .social-share-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          color: white;
          text-decoration: none;
          font-size: 14px;
          transition: background-color 0.3s ease;
        }
        
        .social-share-button.facebook { background-color: #1877f2; }
        .social-share-button.twitter { background-color: #1da1f2; }
        .social-share-button.linkedin { background-color: #0077b5; }
        
        .social-share-button:hover {
          opacity: 0.9;
        }
      `;
      document.head.appendChild(style);
    },

    createIcon: function(platform, size) {
      size = size || 40;
      var icon = this.icons[platform];
      
      if (!icon) {
        return null;
      }
      
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', icon.viewBox);
      svg.setAttribute('width', size);
      svg.setAttribute('height', size);
      svg.setAttribute('fill', 'currentColor');
      
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', icon.path);
      
      svg.appendChild(path);
      return svg;
    },

    setupSocialSharing: function() {
      var self = this;
      
      // Add share functionality
      window.BSShare = {
        facebook: function(url, title) {
          url = url || window.location.href;
          var shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
          self.openShareWindow(shareUrl);
        },
        
        twitter: function(url, title) {
          url = url || window.location.href;
          title = title || document.title;
          var shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(title);
          self.openShareWindow(shareUrl);
        },
        
        linkedin: function(url, title) {
          url = url || window.location.href;
          title = title || document.title;
          var shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
          self.openShareWindow(shareUrl);
        }
      };
    },

    openShareWindow: function(url) {
      var width = 600;
      var height = 400;
      var left = (window.innerWidth - width) / 2;
      var top = (window.innerHeight - height) / 2;
      
      window.open(
        url,
        'share',
        'width=' + width + ',height=' + height + ',left=' + left + ',top=' + top + ',scrollbars=yes,resizable=yes'
      );
    },

    initializeSocialLinks: function() {
      // Initialize existing social links
      var socialLinks = document.querySelectorAll('[data-social]');
      
      for (var i = 0; i < socialLinks.length; i++) {
        var link = socialLinks[i];
        var platform = link.getAttribute('data-social');
        var icon = this.createIcon(platform);
        
        if (icon) {
          link.appendChild(icon);
          link.classList.add('social-icon');
        }
      }
    }
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      socialIconPack.init();
      socialIconPack.initializeSocialLinks();
    });
  } else {
    socialIconPack.init();
    socialIconPack.initializeSocialLinks();
  }

  // Export for module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = socialIconPack;
  }

  // Global assignment for browser
  if (typeof window !== 'undefined') {
    window.BSSocialIconPack = socialIconPack;
  }
})();
