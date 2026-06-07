self.addEventListener('push', e => {
    const data = e.data ? e.data.json() : {};
    
    // تشغيل الصوت في الخلفية
    playNotificationSound();
    
    self.registration.showNotification(data.title || '🔔 زبون جديد!', {
        body: data.body || 'حجز زبون جديد',
        icon: 'cover.jpg',
        badge: 'cover.jpg',
        vibrate: [400, 100, 400, 100, 400, 100, 400], // اهتزاز أطول
        requireInteraction: true,
        tag: 'booking-' + Date.now()
    });
});

// تشغيل الصوت من Service Worker
async function playNotificationSound() {
    try {
        const audioContext = new (self.AudioContext || self.webkitAudioContext)();
        const response = await fetch('mhma.mp3');
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
    } catch(e) {
        console.warn('Sound playback failed:', e);
    }
}

self.addEventListener('notificationclick', e => {
    e.notification.close();
    e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
        if (list.length > 0) { list[0].focus(); return; }
        clients.openWindow('./admin.html');
    }));
});

self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('message', e => {
    if (e.data && e.data.type === 'KEEP_ALIVE') return;
});
