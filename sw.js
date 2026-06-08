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
            vibrate: [500, 100, 500, 100, 500],
            requireInteraction: true,
            tag: 'salon-new-booking',
            renotify: true,
            actions: [
                { action: 'open', title: 'افتح التطبيق' },
                { action: 'close', title: 'إغلق' }
            ],
            data: data.url ? { url: data.url } : {}
        })
    );
});

self.addEventListener('notificationclick', e => {
    e.notification.close();

    // إذا ضغط "إغلق" — لا تفتح شي
    if (e.action === 'close') return;

    // إذا ضغط "افتح التطبيق" أو ضغط على الإشعار مباشرة
    const targetUrl = (e.notification.data && e.notification.data.url)
        ? e.notification.data.url
        : './';

    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
            // ابحث عن تاب مفتوح
            for (const client of list) {
                if ('focus' in client) {
                    return client.focus();
                }
            }
            // افتح تاب جديد
            return clients.openWindow(targetUrl);
        })
    );
});
