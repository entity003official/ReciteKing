const CACHE_NAME = 'kana-study-v8-new-features';
const urlsToCache = [
  './',
  './index.html',
  './word-typing.html',
  './test-page.html',
  './simple.html',
  './curriculum-selection.html',
  './curriculum-stats.html',
  './data-manager.html',
  './app.js',
  './kana-data.js',
  './vocabulary-manager.js',
  './word-typing.js',
  './vocabulary-browser.js',
  './romaji-converter.js',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  // 强制激活新的Service Worker
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      // 强制所有客户端使用新的Service Worker
      return self.clients.claim();
    })
  );
});
