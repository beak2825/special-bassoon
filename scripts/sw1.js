const MANIFEST_URL = "https://script.google.com/macros/s/AKfycbxUt3Mnj5MexVz_DvuBzpDJY2T1UKsueER98J7-IE2uHBb99LqNXA83vtKwE7mt73ThmA/exec";
const CACHE_NAME = "site-cache-v1";

// Compute SHA-256 hash of response body
async function hashResponse(response) {
  const buffer = await response.clone().arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// Ensure cache matches manifest
async function updateCacheFromManifest() {
  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    const manifest = await res.json();
    const cache = await caches.open(CACHE_NAME);

    for (const file of manifest.files) {
      const cachedResponse = await cache.match(file.url);
      let needsUpdate = true;

      if (cachedResponse) {
        try {
          const cachedHash = await hashResponse(cachedResponse);
          if (cachedHash === file.hash) {
            needsUpdate = false; // already up to date
          }
        } catch (err) {
          console.warn("Hash check failed for", file.url, err);
        }
      }

      if (needsUpdate) {
        console.log("Updating cache for:", file.url);
        try {
          const freshResponse = await fetch(file.url, { cache: "no-store" });
          const freshHash = await hashResponse(freshResponse.clone());
          if (freshHash === file.hash) {
            await cache.put(file.url, freshResponse);
          } else {
            console.error("Hash mismatch after download:", file.url);
          }
        } catch (err) {
          console.error("Failed to fetch", file.url, err);
        }
      }
    }
  } catch (err) {
    console.error("Manifest fetch failed", err);
  }
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(updateCacheFromManifest());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;
      try {
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      } catch (err) {
        return cached || Response.error();
      }
    })
  );
});

// Periodically update cache on worker wake
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "update-cache") {
    event.waitUntil(updateCacheFromManifest());
  }
});
