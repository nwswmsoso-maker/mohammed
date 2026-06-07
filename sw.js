self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};
    self.registration.showNotification(data.title || '🔔 زبون جديد!', {
        body: data.body || 'حجز زبون جديد',
        icon: 'cover.jpg',
        badge: 'cover.jpg',
        vibrate: [400, 100, 400, 100, 400],
        requireInteraction: true,
        tag: 'new-booking',
        renotify: true
    });
});

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.openWindow('./admin.html'));
});

// يبقى الـ SW شغال بالخلفية
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));

// فحص دوري كل 10 ثواني حتى لو الشاشة مقفلة
self.addEventListener('message', e => {
    if (e.data && e.data.type === 'KEEP_ALIVE') {
        // نحافظ على الـ SW شغال
    }
});
