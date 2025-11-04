// // chatFirebase.js (ChatEnhancement Project)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// ✅ This config is from your ChatEnhancement Firebase project
const chatConfig = { 
  apiKey: "AIzaSyDHUxMYa8U2124KNxM0X9RPE8xJIHPgmok",
  authDomain: "chatenhancement.firebaseapp.com",
  projectId: "chatenhancement",
  storageBucket: "chatenhancement.appspot.com",
  messagingSenderId: "523643209855",
  appId: "1:523643209855:web:bcdd2c7c720510e064d74a"
}

const chatApp = initializeApp(chatConfig, "chatApp"); // Important: use unique name
const chatDB = getFirestore(chatApp);

export { chatDB,  };









// rules_version = '2'; 
// service cloud.firestore { 
// match /databases/{database}/documents {
//  match /privateChats/{chatId}/messages/{messageId} {
//    allow read, write: if true; // 
//  } 
//  }
//   }