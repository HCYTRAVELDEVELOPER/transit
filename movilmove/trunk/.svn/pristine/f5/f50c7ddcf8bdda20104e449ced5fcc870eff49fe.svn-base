var CACHE_NAME = 'my-site-cache-v2';
var urlsToCache = [
    '/',
    '/nwlib6/nwproject/modules/nw_user_session/js/nwmaker-home.js',
    '/nwlib6/nwproject/modules/nw_user_session/nwmaker_css.php',
    '/nwlib6/nwproject/modules/nw_user_session/nwmaker_jsmaker.php',
    '/nwlib6/nwproject/modules/nw_user_session/nwmaker_js.php'
];
self.addEventListener('install', function (event) {
    event.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(urlsToCache);
    }));
});

'use strict';

self.addEventListener('fetch', function (event) {});

self.addEventListener('push', function (event) {
    console.log(event);
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
    var tag = Math.floor((Math.random() * 10000) + 1);
    const title = 'Nuevo mensaje';
    var data = {
        doge: {
            wow: 'Data de notificación...'
        }
    }
    const options = {
        renotify: true,
        body: event.data.text(),
        icon: 'images/icon.png',
        badge: 'images/badge.png',
        vibrate: [200, 100, 200, 100, 200, 100, 400],
        tag: tag,
        data: data
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function (event) {
    console.log(event);
    console.log('[Service Worker] Notification click Received.');
    event.notification.close();
    event.waitUntil(clients.openWindow("http://" + location.hostname));
});