//importScripts('/__/firebase/6.0.4/firebase-app.js');
//importScripts('/__/firebase/6.0.4/firebase-messaging.js');
//importScripts('/__/firebase/init.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js');
 var firebaseConfig = {
    apiKey: "AIzaSyBYFSGZ4dcrxCpa6K1-nbGJs3DcDfpmi6k",
    authDomain: "chat-43efa.firebaseapp.com",
    databaseURL: "https://chat-43efa.firebaseio.com",
    projectId: "chat-43efa",
    storageBucket: "chat-43efa.appspot.com",
    messagingSenderId: "111021014435",
    appId: "1:111021014435:web:e7f8c001e86398165d2e16",
    measurementId: "G-N6JV4CVH84"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

firebase.messaging();

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});


console.log("Load serviceWorker")