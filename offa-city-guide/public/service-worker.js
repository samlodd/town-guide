self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("offa-cache").then(cache => {
      return cache.addAll([
        "/",
        "/index.html",
        "/manifest.json",
        "/src/data/offadata.json"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
