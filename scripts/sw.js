const CACHE_NAME = 'petplace.com';

// Cache and update with stale-while-revalidate policy.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Prevent Chrome Developer Tools error:
  // Failed to execute 'fetch' on 'ServiceWorkerGlobalScope':
  // 'only-if-cached' can be set only with 'same-origin' mode
  //
  // See also https://stackoverflow.com/a/49719964/1217468
  if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
    return;
  }

  const handler = async () => {
    const cache = await caches.open(CACHE_NAME);

    const cachedResponsePromise = await cache.match(request);
    const networkResponsePromise = fetch(request);

    if (request.url.startsWith(self.location.origin) && request.url.includes('query-index.json')) {
      const promise = async () => {
        const networkResponse = await networkResponsePromise;

        await cache.put(request, networkResponse.clone());
      };
      event.waitUntil(promise());
    }

    return cachedResponsePromise || networkResponsePromise;
  };
  event.respondWith(handler());
});

// Clean up caches other than current.
self.addEventListener('activate', (event) => {
  const promise = async () => {
    const cacheNames = await caches.keys();

    await Promise.all(
      cacheNames
        .filter((cacheName) => {
          const deleteThisCache = cacheName !== CACHE_NAME;
          return deleteThisCache;
        })
        .map((cacheName) => caches.delete(cacheName)),
    );
  };
  event.waitUntil(promise());
});
