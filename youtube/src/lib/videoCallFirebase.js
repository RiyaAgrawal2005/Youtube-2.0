// // lib/videoCallFirebase.js
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // Video Call Firebase config (renamed)
// const videoCallFirebaseConfig = {
//   apiKey: "AIzaSyCChQFIWxtf2kt0QIzjmWPYBW00nw_hWq4",
//   authDomain: "videocallfirebase-1a4c6.firebaseapp.com",
//   projectId: "videocallfirebase-1a4c6",
//   storageBucket: "videocallfirebase-1a4c6.firebasestorage.app",
//   messagingSenderId: "206049577883",
//   appId: "1:206049577883:web:a0e123c2ff87cdd53baf3e",
//   measurementId: "G-5T9HS2BX05"
// };

// // Initialize Firebase app only if not already initialized
// const app = getApps().length > 0 ? getApp() : initializeApp(videoCallFirebaseConfig);

// // Export Firestore and Auth for video calls
// export const videoCallDb = getFirestore(app);
// export const videoCallAuth = getAuth(app);























// lib/videoCallFirebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const videoCallFirebaseConfig = {
  apiKey: "AIzaSyCChQFIWxtf2kt0QIzjmWPYBW00nw_hWq4",
  authDomain: "videocallfirebase-1a4c6.firebaseapp.com",
  projectId: "videocallfirebase-1a4c6",
  storageBucket: "videocallfirebase-1a4c6.firebasestorage.app",
  messagingSenderId: "206049577883",
  appId: "1:206049577883:web:a0e123c2ff87cdd53baf3e",
  measurementId: "G-5T9HS2BX05"
};

// Use a named app to avoid using the wrong default app
const APP_NAME = "videoCallApp";

let app;
try {
  app = getApp(APP_NAME);
} catch (e) {
  app = initializeApp(videoCallFirebaseConfig, APP_NAME);
}

// Optional debug helper — remove or comment out in production
console.log("VideoCall Firebase app projectId:", app.options?.projectId);

export const videoCallDb = getFirestore(app);
export const videoCallAuth = getAuth(app);
