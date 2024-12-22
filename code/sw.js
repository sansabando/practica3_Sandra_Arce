const CACHE_NAME = 'shooter-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/game.css',
  '/main.js',
  '/Game.js',
  '/Entity.js',
  '/Character.js',
  '/Player.js',
  '/Opponent.js',
  '/Shot.js',
  '/Boss.js',
  '/assets/player.png',
  '/assets/player_dead.png',
  '/assets/opponent.png',
  '/assets/opponent_dead.png',
  '/assets/shot1.png',
  '/assets/shot2.png',
  '/assets/game_over.png',
  '/assets/you_win.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
