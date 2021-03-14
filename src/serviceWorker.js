const staticChecklistSite = 'checklist-v2';
const assets = ['/index.html', '/assets/app.js'];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(staticChecklistSite).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(`${staticChecklistSite}-${fetchEvent.request}`).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
