import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { CRUDAPI } from "../apiCalls/crud-api";
import {
  INSERT_FCM_TOKEN,
  INSERT_FCM_TOKEN_METHOD,
} from "../apiCalls/endpoints";
import logo from "../assets/logo1.png";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

export const FIREBASE_VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: FIREBASE_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        console.log("FCM: ", currentToken);
        return currentToken;
      } else {
        return null;
      }
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

export const insertFcmToken = async (authToken, fcmToken, navigate) => {
  try {
    const payload = {
      authToken: authToken,
      fcmToken: fcmToken,
    };
    const response = await CRUDAPI(
      INSERT_FCM_TOKEN,
      INSERT_FCM_TOKEN_METHOD,
      payload,
      navigate
    );
    return response;
  } catch (error) {
    console.log(error);
  }
};

onMessage(messaging, ({ notification }) => {
  new Notification(notification.title, {
    body: notification.body,
    icon: notification.icon ?? logo,
  });
});

// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
