// Service Worker for News Page Caching ONLY
// IMPORTANT: Do not cache app shell/HTML for non-news routes to avoid stale UI after deploys.
const CACHE_NAME = 'vaultx-news-v2';
const urlsToCache = [
  '/news',
  '/api/news',
  '/app/news/news.css'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Only handle caching for news routes and API
  const isNewsRoute = requestUrl.pathname.startsWith('/news') || requestUrl.pathname.startsWith('/api/news');

  if (!isNewsRoute) {
    // Bypass and let the request go to the network for everything else
    return;
  }

  // Network-first for HTML/navigation to keep content fresh
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for other assets under news
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached || fetch(event.request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return response;
        })
      );
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 