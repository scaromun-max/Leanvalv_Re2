const CACHE_NAME = 'leanvalv-offline-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y guardar los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptar las peticiones de red para servir desde la caché si no hay internet
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si el archivo está en la caché, lo devuelve (Offline)
        if (response) {
          return response;
        }
        // Si no está en la caché, intenta buscarlo en internet (Online)
        return fetch(event.request);
      })
  );
});

// Actualizar la caché cuando haya una nueva versión
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});