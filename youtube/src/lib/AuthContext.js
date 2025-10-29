// import React, { createContext, useContext, useState, useEffect } from "react";
// import {
//   onAuthStateChanged,
//   signInWithPopup,
//   signOut,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "./firebase";
// import axiosInstance from "./axiosinstance";
// import OtpPopup from "@/components/OtpPopup";

// const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [pendingLogin, setPendingLogin] = useState(null);
//   const [showOtp, setShowOtp] = useState(false);
//   const [otpMethod, setOtpMethod] = useState("email");
//   const [otpIdentifier, setOtpIdentifier] = useState("");
//   const [justSignedIn, setJustSignedIn] = useState(false);

//   // ✅ Login and save user to localStorage
//   const login = (userdata) => {
//     if (!userdata) return;
//     setUser(userdata);
//     localStorage.setItem("user", JSON.stringify(userdata));
//     console.log("✅ User logged in:", userdata);
//   };

//   // ✅ Logout and clear data
//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     try {
//       await signOut(auth);
//     } catch (err) {
//       console.error("Logout error:", err);
//     }
//   };

//   // ✅ Google Sign-in
//   const handlegooglesignin = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       provider.setCustomParameters({ prompt: "select_account" });

//       const result = await signInWithPopup(auth, provider);
//       const firebaseuser = result.user;

//       const loginPayload = {
//         email: firebaseuser.email,
//         name: firebaseuser.displayName,
//         image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//       };

//       console.log("🔹 Gmail user:", loginPayload);

//       const response = await axiosInstance.post("/user/login", loginPayload);
//       const data = response.data;

//       console.log("🔹 /user/login response:", data);

//       if (data.otpRequired) {
//         setPendingLogin(loginPayload);
//         setOtpMethod(data.otpChannel || "email");
//         setOtpIdentifier(loginPayload.email);
//         setShowOtp(true);
//       } else if (data.result || data.user) {
//         login(data.result || data.user);
//       }

//       setJustSignedIn(true);
//     } catch (err) {
//       console.error("Google signin error:", err);
//     }
//   };

//   // ✅ Restore user from localStorage and listen for Firebase auth
//   useEffect(() => {
//     try {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const parsed = JSON.parse(storedUser);
//         if (parsed && parsed.email) {
//           setUser(parsed);
//           console.log("✅ Restored user from localStorage:", parsed.email);
//         } else {
//           console.warn("⚠️ Invalid stored user data, clearing...");
//           localStorage.removeItem("user");
//         }
//       }
//     } catch (err) {
//       console.error("⚠️ Error restoring user:", err);
//       localStorage.removeItem("user");
//     }

//     const unsub = onAuthStateChanged(auth, async (firebaseuser) => {
//       if (firebaseuser) {
//         try {
//           const payload = {
//             email: firebaseuser.email,
//             name: firebaseuser.displayName,
//             image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//           };

//           console.log("🔹 onAuthStateChanged payload:", payload);

//           const response = await axiosInstance.post("/user/login", payload);
//           const data = response.data;
//           const userData = data.result || data.user;

//           if (userData) {
//             setUser(userData);
//             localStorage.setItem("user", JSON.stringify(userData));
//             console.log("✅ Logged in as:", userData.email);
//           }
//         } catch (err) {
//           console.error("onAuthStateChanged error (ignored):", err);
//         }
//       }
//     });

//     return () => unsub();
//   }, []);

//   const finishPendingLogin = (verifiedUser) => {
//     login(verifiedUser);
//     setPendingLogin(null);
//     setOtpIdentifier("");
//     setShowOtp(false);
//     setJustSignedIn(false);
//   };

//   return (
//     <UserContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         handlegooglesignin,
//         setOtpIdentifier,
//       }}
//     >
//       {children}

//       <OtpPopup
//         isOpen={showOtp}
//         identifier={otpIdentifier}
//         method={otpMethod}
//         pendingLogin={pendingLogin}
//         setIdentifier={setOtpIdentifier}
//         onClose={() => {
//           setShowOtp(false);
//           setPendingLogin(null);
//           setOtpIdentifier("");
//           setJustSignedIn(false);
//         }}
//         onVerified={finishPendingLogin}
//       />
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);




















import React, { createContext, useContext, useState, useEffect, } from "react";
import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import axiosInstance from "./axiosinstance";
import OtpPopup from "@/components/OtpPopup";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingLogin, setPendingLogin] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otpMethod, setOtpMethod] = useState("email");
  const [otpIdentifier, setOtpIdentifier] = useState("");
  const [justSignedIn, setJustSignedIn] = useState(false);

  // ✅ login user and save to localStorage
  const login = (userdata) => {
    if (!userdata) return;
    setUser(userdata);
    localStorage.setItem("user", JSON.stringify(userdata));
    console.log("✅ User logged in:", userdata);
  };

  // ✅ logout user and clear storage
  const logout = async () => {
    setUser(null);
    localStorage.removeItem("user");
    try { await signOut(auth); } catch (err) { console.error("Logout error:", err); }
  };


const handlegooglesignin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const result = await signInWithPopup(auth, provider);
    const firebaseuser = result.user;
    const loginPayload = {
      email: firebaseuser.email,
      name: firebaseuser.displayName,
      image: firebaseuser.photoURL || "https://github.com/shadcn.png",
    };
    console.log("🔹 Gmail user:", loginPayload);

    const response = await axiosInstance.post("/user/login", loginPayload);
    const data = response.data;
    console.log("🔹 /user/login response:", data);

    if (data.otpRequired) {
      setPendingLogin(loginPayload);            // 🔹 original login
      setOtpMethod(data.otpChannel || "email"); 
      setOtpIdentifier(loginPayload.email);     // 🔹 default OTP target
      setShowOtp(true);
    } else if (data.result || data.user) {
      login(data.result || data.user);
    }

    setJustSignedIn(true);
  } catch (err) {
    console.error("Google signin error:", err);
  }
};


  

  useEffect(() => {
    // ✅ Restore user from localStorage first
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // ✅ Firebase auth listener
    const unsub = onAuthStateChanged(auth, async (firebaseuser) => {
      if (firebaseuser) {
        try {
          const payload = {
            email: firebaseuser.email,
            name: firebaseuser.displayName,
            image: firebaseuser.photoURL || "https://github.com/shadcn.png",
          };
          console.log("🔹 onAuthStateChanged payload:", payload);

          const response = await axiosInstance.post("/user/login", payload);
          const data = response.data;
          console.log("🔹 /user/login on refresh:", data);

          const userData = data.result || data.user;
         
           if (userData) {
        // Update state AND localStorage immediately
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("✅ Logged in as:", userData.email);
      }
        } catch (err) {
          console.error("onAuthStateChanged error (ignored):", err);
          // ❌ Do NOT logout here. Just keep existing localStorage user.
        }
      }
    });

    return () => unsub();
  }, []);

  const finishPendingLogin = (verifiedUser) => {
    login(verifiedUser);
    setPendingLogin(null);
    setOtpIdentifier("");
    setShowOtp(false);
    setJustSignedIn(false);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, handlegooglesignin, setOtpIdentifier }}>
      {children}
      <OtpPopup
        isOpen={showOtp}
        identifier={otpIdentifier}
       
        method={otpMethod}
        pendingLogin={pendingLogin}
        setIdentifier={setOtpIdentifier}
        onClose={() => { setShowOtp(false); setPendingLogin(null); setOtpIdentifier(""); setJustSignedIn(false); }}
        onVerified={finishPendingLogin}
      />
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);


















