import { firebaseConfig } from "./src/config/firebase";
import logo from "./src/assets/logo1.png";

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

// Initialize Firebase using the environment variables directly

firebase.initializeApp(firebaseConfig);

// Get a reference to Firebase Messaging
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon ?? logo,
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});
