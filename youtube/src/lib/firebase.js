
import { getAuth, GoogleAuthProvider} from "firebase/auth"
import { initializeApp, getApps , getApp  } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyAuUHRptEWcfmHDHddIqltTzt4pu5j1CsU",
  authDomain: "fir-f0bfc.firebaseapp.com",
  projectId: "fir-f0bfc",
  storageBucket: "fir-f0bfc.firebasestorage.app",
  messagingSenderId: "392134226415",
  appId: "1:392134226415:web:e0f7b3cfa209519a6d461a"
};


// const app = initializeApp(firebaseConfig);
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()
export { auth, provider }





// import { getAuth, GoogleAuthProvider , getApps} from "firebase/auth";

// import { initializeApp } from "firebase/app";



// const firebaseConfig = {
//   apiKey: "AIzaSyAuUHRptEWcfmHDHddIqltTzt4pu5j1CsU",
//   authDomain: "fir-f0bfc.firebaseapp.com",
//   projectId: "fir-f0bfc",
//   storageBucket: "fir-f0bfc.firebasestorage.app",
//   messagingSenderId: "392134226415",
//   appId: "1:392134226415:web:e0f7b3cfa209519a6d461a"
// };

// // Initialize Firebase
// // const app = initializeApp(firebaseConfig);

// const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
// const auth = getAuth(app);
// const provider = new GoogleAuthProvider();
// export { auth, provider };
