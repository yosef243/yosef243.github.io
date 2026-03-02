// اسم الكاش والإصدار (تم التحديث لـ v4 لضمان تحميل الهيكلة الجديدة)
const CACHE_NAME = 'sabry-sadaqa-v0.0.3';

// قائمة بكل الملفات التي يجب حفظها لتعمل بدون إنترنت (تحديث شامل للمسارات)
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  
  // ملفات التصميم
  './css/themes.css',
  './css/main.css',
  
  // ملفات البرمجة (العقل المدبر المقسم)
  './js/core.js',
  './js/ui.js',
  './js/pwa.js',
  
  // ملفات البيانات (قاعدة البيانات المقسمة)
  './data/azkar.js',
  './data/duas.js',
  './data/tasks.js',
  './data/stories.js',
  './data/names.js',
  
  // الأيقونات الأساسية داخل مجلد icons
  './icons/icon-192x192.png',
  './icons/icon-512x512.png'
];

// 1. حدث التثبيت (Install) - يقوم بتحميل الملفات الجديدة في الذاكرة
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache v4');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// 2. حدث الجلب (Fetch) - لقراءة الملفات من الذاكرة عند انقطاع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا وجد الملف في الكاش، يرجعه. وإلا يحمله من الإنترنت
        return response || fetch(event.request);
      })
  );
});

// 3. حدث التفعيل (Activate) - لمسح أي إصدار قديم من الكاش فوراً
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
