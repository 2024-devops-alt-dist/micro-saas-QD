/**
 * Service Worker minimal
 * Évite la mise en cache des requêtes PUT, POST, PATCH, DELETE
 * qui ne sont pas compatibles avec l'API Cache
 */

// Ignorer les opérations de mise à jour du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Intercepter les requêtes et eviter de cacher les méthodes non-GET
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Ne cacher que les requêtes GET (images, CSS, JS, etc.)
  // Toutes les autres méthodes (PUT, POST, PATCH, DELETE) sont passées directement
  if (request.method !== 'GET') {
    return; // Laisser la requête passer sans mise en cache
  }
  
  // Les requêtes GET peuvent être mises en cache (comportement par défaut du navigateur)
});
