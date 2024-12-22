const CACHE_NAME = 'shooter-cache-v1';
const urlsToCache = [
  '/code/',
  'code/index.html',
  'code/Game.js',
  'code/Entity.js',
  'code/Character.js',
  'code/Player.js',
  'code/Opponent.js',
  'code/Boss.js',
  'code/Shot.js',
  'code/main.js',
  'code/game.css',
  'code/assets/boss.png',
  'code/assets/boss_dead.png',
  'code/assets/game_over.png',
  'code/assets/opponent.png',
  'code/assets/opponent_dead.png',
  'code/assets/player.png',
  'code/assets/player_dead.png',
  'code/assets/shot1.png',
  'code/assets/shot2.png',
  'code/assets/you_win.png',
  'code/assets/icon-192x192.png',
  'code/assets/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.error('Failed to cache resources:', err);
      });
    })
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
