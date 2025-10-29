// // import { initializeApp } from "firebase/app";
// // import { getAuth } from "firebase/auth";
// // import { getFirestore } from "firebase/firestore";

// // const firebaseConfig = {
// //   apiKey: "YOUR_API_KEY",
// //   authDomain: "your-app.firebaseapp.com",
// //   projectId: "your-app-id",
// //   storageBucket: "your-app.appspot.com",
// //   messagingSenderId: "SENDER_ID",
// //   appId: "APP_ID",
// // };

// // const app = initializeApp(firebaseConfig);

// // export const auth = getAuth(app);
// // export const db = getFirestore(app);




// // firebase.js
// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// // ✅ Replace these with your actual Firebase config values
// const firebaseConfig = {
//   apiKey: "AIzaSyAuUHRptEWcfmHDHddIqltTzt4pu5j1CsU",
//   authDomain: "fir-f0bfc.firebaseapp.com",
//   projectId: "fir-f0bfc",
//   storageBucket: "fir-f0bfc.firebasestorage.app",
//   messagingSenderId: "392134226415",
//   appId: "1:392134226415:web:e0f7b3cfa209519a6d461a"
// };


// // Initialize Firebase only once
// const app = initializeApp(firebaseConfig);

// // Firestore Database
// const db = getFirestore(app);

// // Firebase Authentication
// const auth = getAuth(app);

// export { db, auth };








import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";  // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyAuUHRptEWcfmHDHddIqltTzt4pu5j1CsU",
  authDomain: "fir-f0bfc.firebaseapp.com",
  projectId: "fir-f0bfc",
  storageBucket: "fir-f0bfc.appspot.com", // corrected
  messagingSenderId: "392134226415",
  appId: "1:392134226415:web:e0f7b3cfa209519a6d461a"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);  // ✅ Firestore

export { auth, provider, db };
















// firebase.js or firebase.ts
// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // ✅ Correct Firebase config for ChatEnhancement project
// const firebaseConfig = {
//   apiKey: "AIzaSyDHUxMYa8U2124KNxM0X9RPE8xJIHPgmok",
//   authDomain: "chatenhancement.firebaseapp.com",
//   projectId: "chatenhancement",
//   storageBucket: "chatenhancement.firebasestorage.app",
//   messagingSenderId: "523643209855",
//   appId: "1:523643209855:web:bcdd2c7c720510e064d74a"
// };

// // ✅ Initialize app only once
// const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// // ✅ Set up Firebase services
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// const db = getFirestore(app);

// // ✅ Export for use in your app
// export { app, auth, provider, db };



















// firebase.js (or firebase.ts)

// import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// // ✅ YouTube Project Config (Main App)
// const youtubeConfig = { 
//   apiKey: "AIzaSyAuUHRptEWcfmHDHddIqltTzt4pu5j1CsU",
//   authDomain: "fir-f0bfc.firebaseapp.com",
//   projectId: "fir-f0bfc",
//   storageBucket: "fir-f0bfc.firebasestorage.app",
//   messagingSenderId: "392134226415",
//   appId: "1:392134226415:web:e0f7b3cfa209519a6d461a"
// };

// // ✅ ChatEnhancement Project Config (Secondary App)
// const ChatEnhancementConfig = { 
//   apiKey: "AIzaSyDHUxMYa8U2124KNxM0X9RPE8xJIHPgmok",
//   authDomain: "chatenhancement.firebaseapp.com",
//   projectId: "chatenhancement",
//   storageBucket: "chatenhancement.appspot.com",
//   messagingSenderId: "523643209855",
//   appId: "1:523643209855:web:bcdd2c7c720510e064d74a"
// };

// // ✅ Initialize the main app (YouTube)
// const app = getApps().length === 0 ? initializeApp(youtubeConfig) : getApp();
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// const db = getFirestore(app); // YouTube Firestore (not used for chats)

// // ✅ Initialize ChatEnhancement as named app
// const chatApp = initializeApp(ChatEnhancementConfig, "ChatApp");
// const chatDB = getFirestore(chatApp); // Firestore from ChatEnhancement

// export { auth, provider, db, chatDB };
