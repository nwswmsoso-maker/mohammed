self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

self.addEventListener('message', e => {
    if (e.data && e.data.type === 'KEEP_ALIVE') return;
});

self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};
    e.waitUntil(
        self.registration.showNotification(data.title || '🔔 زبون جديد!', {
            body: data.body || 'حجز زبون جديد',
            icon: 'cover.jpg',
            badge: 'cover.jpg',
            vibrate: [400, 100, 400, 100, 400, 100, 400],
            requireInteraction: true,
            tag: 'booking-' + Date.now()
        })
    );
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            for (const client of list) {
                if (client.url.includes('admin') && 'focus' in client) {
                    return client.focus();
                }
            }
            return clients.openWindow('./admin.html');
        })
    );
});
