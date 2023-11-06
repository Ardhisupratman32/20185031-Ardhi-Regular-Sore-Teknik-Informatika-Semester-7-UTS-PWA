// service-worker.js

// Nama cache Anda
var cacheName = 'profile-ku-v1';

// Daftar sumber daya yang ingin Anda cache
var filesToCache = [
                '/',
                '/index.html',
                '/style.css',
                '/manifest.json',
                '/img/foto-anda.png',
                '/img/icon-192x192.png',
                '/img/icon-384x384.png',
                '/img/icon-512x512.png'
            ];

// Instalasi Service Worker
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

// Aktivasi Service Worker
self.addEventListener('activate', evt => {

});

// Fetching sumber daya dari cache atau jaringan
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            // Menggunakan sumber daya dari cache jika ada
            return cacheRes || fetch(evt.request);
        })
    );
});

  self.addEventListener('push', function(event) {
    if (self.Notification.permission === 'granted') {
      // Izin notifikasi telah diberikan, Anda dapat menampilkan pemberitahuan
      const options = {
        body: 'Assalaikum pak',
        icon: 'icon.png',
        badge:'badge.png',
        actions: [
          { action: 'yes', title: 'Ya' },
          { action: 'no', title: 'Tidak' }
        ],
        data: {
          senderId: '12345',
          messageId: '67890'
        },
        silent: true,
        timestamp: Date.now()
      };
      
  
      event.waitUntil(
        self.registration.showNotification('Notifikasi', options)
      );
    } else {
      // Izin notifikasi tidak diberikan
    }
  });
  
  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
  
    if (event.action === 'yes') {
      // Tindakan "Ya" diambil
      // Menampilkan notifikasi dengan ucapan "Anda memilih Ya"
      self.registration.showNotification('Notifikasi Ya', {
        body: 'Anda memilih Ya',
        icon: 'icon.png'
      });
    } else if (event.action === 'no') {
      // Tindakan "Tidak" diambil
      // Menampilkan notifikasi dengan ucapan "Anda memilih Tidak"
      self.registration.showNotification('Notifikasi Tidak', {
        body: 'Anda memilih Tidak',
        icon: 'icon.png'
      });
    } else {
      // Notifikasi di-klik tanpa memilih tindakan apa pun
      // Lakukan sesuatu ketika notifikasi di-klik tanpa memilih "Ya" atau "Tidak"
      console.log('Anda mengklik notifikasi');
    }
  });
  
