// sw.js
const CACHE_NAME = 'my-game-cache-v1';
const SW_VER = '1'; // current SW version

const SW_URL = 'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/scripts/sw.txt';

// Helper: fetch text from URL
async function fetchText(url) {
  const res = await fetch(url, { cache: 'no-store', mode: 'cors' });
  if (!res.ok) throw new Error('Failed to fetch ' + url);
  return await res.text();
}

// Install event: cache JS/CSS immediately so they are available offline
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

// Fetch event: dynamic caching
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isJSOrCSS = url.endsWith('.js') || url.endsWith('.css');

  if (isJSOrCSS) {
    // Cache-first for offline, but always fetch latest version
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        return fetch(event.request, { cache: 'no-store', mode: 'cors' })
          .then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
            return cachedResponse || networkResponse;
          })
          .catch(() => cachedResponse) // fallback if offline
      })
    );
  } else {
    // Everything else: cache first, then network
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(networkResponse => {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
            return networkResponse;
          })
          .catch(() => cachedResponse)
      })
    );
  }
});

// Periodically check sw.txt for updates
async function checkSWVersion() {
  try {
    const remoteSwVer = await fetchText(SW_URL);
    if (remoteSwVer.trim() !== SW_VER) {
      console.log('[SW] SW version changed. Clearing cache...');
      const cacheNames = await caches.keys();
      for (const name of cacheNames) {
        await caches.delete(name);
      }
    }
  } catch (err) {
    console.error('[SW] Failed to check SW version', err);
  }
}

// Check SW version once on install + every 5 minutes
checkSWVersion();
setInterval(checkSWVersion, 5 * 60 * 1000);