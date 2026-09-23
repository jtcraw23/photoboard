// Photo Board service worker: cache-first so the installed page opens with no
// signal. Bump CACHE on every deploy; the old cache is dropped on activate and
// phones pick up the new files the next time they open the page with signal.
var CACHE = 'photo-board-v2';
var ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) { return cache.addAll(ASSETS); }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
      // Serve from cache at once; refresh the copy in the background when online.
      var refresh = fetch(event.request).then(function (resp) {
        if (resp && resp.ok && new URL(event.request.url).origin === self.location.origin) {
          var copy = resp.clone();
          caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
        }
        return resp;
      }).catch(function () { return cached; });
      return cached || refresh;
    })
  );
});
