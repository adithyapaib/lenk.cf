const cacheName = "lenk";
const staticAssets =[
    './',
    '/css'
] ;
self.addEventListener('install', async function(event) {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
  });
  self.addEventListener('activate', e =>
  {
      self.clients.claim();
  });
  
  self.addEventListener('fetch', function(event) {});
  