// Service Worker for Sitiocubo Website
// Provides caching and offline functionality

const CACHE_NAME = 'sitiocubo-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/js/intersection-observer-fix.js',
  '/radpack.js',
  '/~/c/bs-_rollupPluginBabelHelpers.js',
  '/~/c/bs-index3.js',
  '/~/c/bs-themeOverrides.js',
  '/~/c/bs-boldOutline.js',
  '/~/c/bs-legacyOverrides.js',
  '/~/c/bs-index.js',
  '/~/c/bs-overlayTypes.js',
  '/~/c/bs-defaultSocialIconPack.js',
  '/~/c/bs-index2.js',
  '/~/c/bs-dataAids.js',
  '/~/c/bs-navigationDrawer.js',
  '/~/c/bs-searchFormLocations.js',
  '/~/c/_rollupPluginBabelHelpers.js',
  '/~/c/_commonjsHelpers.js',
  '/~/c/interopRequireDefault.js',
  '/~/c/_react_commonjs-external.js',
  '/~/c/bs-Toggle.js',
  '/~/bs-FlyoutMenu-Component.js'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Cache install failed:', error);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).catch(function() {
          // If both cache and network fail, return a fallback
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync (if supported)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  return Promise.resolve();
}

// Push notification handler
self.addEventListener('push', function(event) {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/img1.wsimg.com/isteam/ip/a5031d39-e467-4821-8707-2384810ca2bc/favicon/b1f9fc74-b903-4704-87bd-0dbc055e696f.jpg/~/rs=w32,h32,m.jpeg',
      badge: '/img1.wsimg.com/isteam/ip/a5031d39-e467-4821-8707-2384810ca2bc/favicon/b1f9fc74-b903-4704-87bd-0dbc055e696f.jpg/~/rs=w16,h16,m.jpeg'
    };

    event.waitUntil(
      self.registration.showNotification('Sitiocubo', options)
    );
  }
});

// Notification click handler
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
