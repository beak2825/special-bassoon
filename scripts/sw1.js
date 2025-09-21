// sw.js
const CACHE_NAME = 'v1';
const URLS_TO_CACHE = [
  'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/getaway-shootout/57c3e4e4cd0ccbb1f0cbcdc9dbe8fd6e.js',
  'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/mc/index_all_in_one.html',
  'https://unpkg.com/my-npm-html/index.html',
  'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/getaway-shootout/__index.html',
  'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/rocket-league/Build/RSD%201.1.0rc4.wasm.code.unityweb',
  'https://raw.githubusercontent.com/beak2825/special-bassoon/refs/heads/main/rocket-league/Build/RSD%201.1.0rc4.data.unityweb',
  // add other assets manually
];

const HASH_URL = '/hashes.txt'; // Should return file|hash per line, e.g., game.js|abc123

// Utility to fetch and parse hashes
async function getRemoteHashes() {
  try {
    const res = await fetch(HASH_URL, { cache: 'no-store' });
    const text = await res.text();
    const hashes = {};
    text.split('\n').forEach(line => {
      const [file, hash] = line.trim().split('|');
      if (file && hash) hashes[file] = hash;
    });
    return hashes;
  } catch (err) {
    console.error('[SW] Failed to fetch hashes', err);
    return {};
  }
}

// Install event: initial caching
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event: clean up old caches if needed
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(self.clients.claim());
});

// Fetch event: serve from cache first
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

// Periodically check hashes and update cache
async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  const remoteHashes = await getRemoteHashes();

  for (const url of URLS_TO_CACHE) {
    try {
      const response = await cache.match(url);
      const oldHash = response ? await hashResponse(response) : null;
      const newHash = remoteHashes[url];
      if (!oldHash || oldHash !== newHash) {
        console.log('[SW] Updating cached file:', url);
        const newResponse = await fetch(url, { cache: 'no-store' });
        await cache.put(url, newResponse);
      }
    } catch (err) {
      console.error('[SW] Error updating file', url, err);
    }
  }
}

// Simple hash function for Response
async function hashResponse(response) {
  const buffer = await response.clone().arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Check for updates every 5 minutes
setInterval(() => {
  console.log('[SW] Checking for updates...');
  updateCache();
}, 5 * 60 * 1000);
