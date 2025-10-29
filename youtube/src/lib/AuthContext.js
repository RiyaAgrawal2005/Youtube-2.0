// import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
// import { useState } from "react";
// import { createContext } from "react";
// import { provider, auth } from "./firebase";
// import axiosInstance from "./axiosinstance";
// import { useEffect, useContext } from "react";

// const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   const login = (userdata) => {
//     setUser(userdata);
//     localStorage.setItem("user", JSON.stringify(userdata));
//   };
//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error("Error during sign out:", error);
//     }
//   };
//   const handlegooglesignin = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const firebaseuser = result.user;
//       const payload = {
//         email: firebaseuser.email,
//         name: firebaseuser.displayName,
//         image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//         //  mobile: userMobileNumber
//       };
//       const response = await axiosInstance.post("/user/login", payload);
//       // console.log("Login request body:", { email, password, otp });
//       console.log("Login request body:", payload);

//      console.log("Login API response:", response.data); 
//       login(response.data.result);
//     } catch (error) {
//       console.error(error);
//     }
//   };
//   useEffect(() => {
//     const unsubcribe = onAuthStateChanged(auth, async (firebaseuser) => {
//       if (firebaseuser) {
//         try {
//           const payload = {
//             email: firebaseuser.email,
//             name: firebaseuser.displayName,
//             image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//           };
//           const response = await axiosInstance.post("/user/login", payload);
//           login(response.data.result);
//         } catch (error) {
//           console.error(error);
//           logout();
//         }
//       }
//     });
//     return () => unsubcribe();
//   }, []);

//   return (
//     <UserContext.Provider value={{ user, login, logout, handlegooglesignin }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);

















// import React, { createContext, useContext, useState, useEffect } from "react";
// import { onAuthStateChanged, signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
// import { auth } from "./firebase";
// import axiosInstance from "./axiosinstance";
// import OtpPopup from "@/components/OtpPopup";

// const UserContext = createContext(null);

// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [pendingLogin, setPendingLogin] = useState(null);
//   const [showOtp, setShowOtp] = useState(false);
//   const [otpMethod, setOtpMethod] = useState("email");
//   const [otpIdentifier, setOtpIdentifier] = useState(""); // track input
//   const [justSignedIn, setJustSignedIn] = useState(false);

//   const login = (userdata) => {
//     setUser(userdata);
//     localStorage.setItem("user", JSON.stringify(userdata));
//     console.log("✅ User logged in:", userdata);
//   };

//   const logout = async () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     try { await signOut(auth); } catch (err) { console.error("Logout error:", err); }
//   };

//   const handlegooglesignin = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       provider.setCustomParameters({ prompt: "select_account" });

//       const result = await signInWithPopup(auth, provider);
//       const firebaseuser = result.user;
//       const payload = {
//         email: firebaseuser.email,
//         name: firebaseuser.displayName,
//         image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//       };
//       console.log("🔹 Gmail user:", payload);

//       const response = await axiosInstance.post("/user/login", payload);
//       const data = response.data;
//       console.log("🔹 /user/login response:", data);

//       if (data.otpRequired) {
//         setPendingLogin(payload);
//         setOtpMethod(data.otpChannel || "email");
//         setOtpIdentifier(""); // force input
//         setShowOtp(true);
//       // } else {
//       //   const userData = data.result || data.user; // ✅ fallback to data.user
//       //   login(userData);
//       // }

//        } else if (data.result || data.user) {
//       // Only login if user object exists
//       login(data.result || data.user);
//     }

//       setJustSignedIn(true);
//     } catch (err) {
//       console.error("Google signin error:", err);
//     }
//   };

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, async (firebaseuser) => {
//       if (firebaseuser && !justSignedIn) {
//         try {
//           const payload = {
//             email: firebaseuser.email,
//             name: firebaseuser.displayName,
//             image: firebaseuser.photoURL || "https://github.com/shadcn.png",
//           };
//           console.log("🔹 onAuthStateChanged payload:", payload);

//           const response = await axiosInstance.post("/user/login", payload);
//           const data = response.data;
//           console.log("🔹 /user/login on refresh:", data);

//           const userData = data.result || data.user; // ✅ fallback
//            if (userData) login(userData);
//         } catch (err) {
//           console.error("onAuthStateChanged error:", err);
//           logout();
//         }
//       }
//     });
//     return () => unsub();
//   }, [justSignedIn]);

//   const finishPendingLogin = (verifiedUser) => {
//     login(verifiedUser);
//     setPendingLogin(null);
//     setOtpIdentifier("");
//     setShowOtp(false);
//     setJustSignedIn(false);
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout, handlegooglesignin, setOtpIdentifier }}>
//       {children}
//       <OtpPopup
//         isOpen={showOtp}
//         identifier={otpIdentifier}       // input value
//         identifierEmail={pendingLogin?.email} // pass correct email for OTP
//         method={otpMethod}
//         pendingLogin={pendingLogin}
//         setIdentifier={setOtpIdentifier} 
//         onClose={() => { setShowOtp(false); setPendingLogin(null); setOtpIdentifier(""); setJustSignedIn(false); }}
//         onVerified={finishPendingLogin}
//       />
//     </UserContext.Provider>
//   );
// };

// export const useUser = () => useContext(UserContext);


















// correct code 


import React, { createContext, useContext, useState, useEffect } from "react";
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


  // const handlegooglesignin = async () => {
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     provider.setCustomParameters({ prompt: "select_account" });

  //     const result = await signInWithPopup(auth, provider);
  //     const firebaseuser = result.user;
  //     const payload = {
  //       email: firebaseuser.email,
  //       name: firebaseuser.displayName,
  //       image: firebaseuser.photoURL || "https://github.com/shadcn.png",
  //     };
  //     console.log("🔹 Gmail user:", payload);

  //     const response = await axiosInstance.post("/user/login", payload);
  //     const data = response.data;
  //     console.log("🔹 /user/login response:", data);

  //     if (data.otpRequired) {
  //       setPendingLogin(payload);
  //       setOtpMethod(data.otpChannel || "email");
  //       setOtpIdentifier("");
  //       setShowOtp(true);

  //     } else if (data.result || data.user) {
  //       login(data.result || data.user);
  //     }

  //     setJustSignedIn(true);
  //   } catch (err) {
  //     console.error("Google signin error:", err);
  //   }
  // };

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
          // if (userData) login(userData);
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
        // identifierEmail={pendingLogin?.email}
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


















