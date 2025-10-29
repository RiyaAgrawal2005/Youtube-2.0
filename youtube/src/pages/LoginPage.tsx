

// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const southStates = [
// //   "Tamil Nadu",
// //   "Kerala",
// //   "Karnataka",
// //   "Andhra Pradesh",
// //   "Telangana",
// // ];

// // // Get browser geolocation
// // async function getBrowserLocation(): Promise<{ latitude: number; longitude: number }> {
// //   return new Promise((resolve, reject) => {
// //     if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
// //     navigator.geolocation.getCurrentPosition(
// //       (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
// //       (err) => reject(err)
// //     );
// //   });
// // }

// // // Reverse geocode lat/lon to get state
// // async function reverseGeocode(lat: number, lon: number): Promise<string> {
// //   const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
// //   if (!res.ok) throw new Error("Failed to reverse geocode");
// //   const data = await res.json();
// //   return data.address?.state || "";
// // }

// // // IP-based geolocation fallback
// // async function getIpLocation(): Promise<string> {
// //   const res = await fetch("https://ipapi.co/json/");
// //   if (!res.ok) throw new Error("Failed to get IP location");
// //   const data = await res.json();
// //   return data.region || "";
// // }

// // export default function LoginPage() {
// //   const [theme, setTheme] = useState<"white" | "dark">("dark");
// //   const [location, setLocation] = useState<string | null>(null);
// //   const [otpMethod, setOtpMethod] = useState<"email" | "sms" | null>(null);

// //   // Form state
// //   const [email, setEmail] = useState("");
// //   const [name, setName] = useState(""); // optional name for first-time signup
// //   const [image, setImage] = useState(""); // optional profile image
// //   const [mobile, setMobile] = useState("");

// // // Detect location & theme on load (client preview only; server is source of truth)
// // useEffect(() => {
// //   async function detectLocationAndTheme() {
// //     const currentHour = new Date().getHours();
// //     let state = "";

// //     try {
// //       const { latitude, longitude } = await getBrowserLocation();
// //       // ✅ Ask your backend to reverse geocode
// //       const res = await axios.get(`/api/location/reverse`, {
// //         params: { lat: latitude, lon: longitude },
// //       });
// //       state = res.data?.state || "";
// //     } catch {
// //       try {
// //         state = await getIpLocation();
// //       } catch {
// //         state = "";
// //       }
// //     }

// //     setLocation(state);

// //     const inSouth = southStates.includes(state);

// //     // ✅ OR logic per spec
// //     const timeIsWhite = currentHour >= 10 && currentHour < 12;
// //     const shouldWhite = inSouth || timeIsWhite;

// //     setTheme(shouldWhite ? "white" : "dark");
// //     setOtpMethod(inSouth ? "email" : "sms"); // email for South, SMS otherwise
// //   }

// //   detectLocationAndTheme();
// // }, []);

// // // Apply theme to body
// // useEffect(() => {
// //   if (theme === "white") {
// //     document.body.classList.add("white-theme");
// //     document.body.classList.remove("dark-theme");
// //   } else {
// //     document.body.classList.add("dark-theme");
// //     document.body.classList.remove("white-theme");
// //   }
// // }, [theme]);

// // const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   if (!email) {
// //     alert("Email is required");
// //     return;
// //   }
// //   if (otpMethod === "sms" && !/^\+91\d{10}$/.test(mobile)) {
// //     alert("Valid mobile number is required for SMS OTP");
// //     return;
// //   }

// //   // Get coords first (server will finalize theme/otp)
// // //   navigator.geolocation.getCurrentPosition(
// // //     async (pos) => {
// // //       const { latitude, longitude } = pos.coords;

// // //       // const res = await fetch("/api/test-login", {
// // //         const res = await fetch("/user/login", {
// // //         method: "POST",
// // //         headers: { "Content-Type": "application/json" },
// // //         body: JSON.stringify({
// // //           email,
// // //           name,
// // //           image,
// // //           lat: latitude,
// // //           lon: longitude,
// // //           mobile, // pass mobile to save for SMS OTP
// // //         }),
// // //       });

 
// // //       const data = await res.json();
// // //       console.log("✅ Login Response:", data);

// // //       if (data.success) {
// // //         // ✅ Trust server for final values
// // //         const serverTheme = data.user?.theme || theme;
// // //         const serverOtp = data.user?.otpMethod || otpMethod;
// // //         setTheme(serverTheme);
// // //         setOtpMethod(serverOtp);

// // //         // apply to body
// // //         if (serverTheme === "white") {
// // //           document.body.classList.add("white-theme");
// // //           document.body.classList.remove("dark-theme");
// // //         } else {
// // //           document.body.classList.add("dark-theme");
// // //           document.body.classList.remove("white-theme");
// // //         }

// // //         localStorage.setItem("theme", serverTheme);
// // //         alert("Login successful");
// // //       } else {
// // //         alert("Login failed");
// // //       }
// // //     },
// // //     (err) => {
// // //       console.error("❌ Geolocation error:", err);
// // //       alert("Unable to fetch location");
// // //     }
// // //   );
// // // };

// // useEffect(() => {
// //   navigator.geolocation.getCurrentPosition(
// //     (pos) => {
// //       handleLoginWithLocation(pos.coords.latitude, pos.coords.longitude);
// //     },
// //     (err) => {
// //       console.error("❌ Geolocation error:", err);
// //       handleLoginWithLocation(undefined, undefined); // fallback
// //     }
// //   );
// // }, []); // runs once on mount


// // const handleLoginWithLocation = async (lat?: number, lon?: number) => {
// //   try {
// //     const res = await fetch("/user/login", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         email,
// //         name,
// //         image, 
// // lat: lat ?? null,
// //         lon: lon ?? null,
// //         mobile,
// //       }),
// //     });

// //     const data = await res.json();
// //     console.log("✅ Login Response:", data);

// //     if (data.success) {
// //       const serverTheme = data.user?.theme || theme;
// //       const serverOtp = data.user?.otpMethod || otpMethod;

// //       setTheme(serverTheme);
// //       setOtpMethod(serverOtp);

// //       if (serverTheme === "white") {
// //         document.body.classList.add("white-theme");
// //         document.body.classList.remove("dark-theme");
// //       } else {
// //         document.body.classList.add("dark-theme");
// //         document.body.classList.remove("white-theme");
// //       }

// //       localStorage.setItem("theme", serverTheme);
// //       alert("Login successful");
// //     } else {
// //       alert("Login failed");
// //     }
// //   } catch (err) {
// //     console.error("❌ Login error:", err);
// //   }
// // };
// // }


// //   return (
// //     <>
// //       <style>{`
// //         body.white-theme { background-color: white; color: black; transition: all 0.3s; }
// //         body.dark-theme { background-color: #121212; color: white; transition: all 0.3s; }
// //         .login-container { padding: 1rem; max-width: 400px; margin: 2rem auto; font-family: Arial, sans-serif; }
// //         label { display: block; margin-bottom: 0.3rem; font-weight: 600; }
// //         input { width: 100%; padding: 6px; margin-bottom: 12px; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; }
// //         button { padding: 8px 16px; font-size: 1rem; cursor: pointer; background-color: #007bff; border: none; border-radius: 4px; color: white; transition: background-color 0.2s ease; }
// //         button:hover { background-color: #0056b3; }
// //       `}</style>

// //       <div className="login-container">
// //         <h2>Login Page</h2>
// //         <p>Current Theme: <strong>{theme}</strong></p>
// //         <p>Detected Location: <strong>{location || "Unknown"}</strong></p>
// //         <p>OTP Method: <strong>{otpMethod || "Loading..."}</strong></p>

// //         <form onSubmit={handleSubmit}>
// //           <label>Email:</label>
// //           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

// //           <label>Name (optional):</label>
// //           <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

// //           <label>Profile Image URL (optional):</label>
// //           <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

// //           {otpMethod === "sms" && (
// //             <>
// //               <label>Mobile Number (for OTP):</label>
// //               <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91xxxxxxxxxx" required />
// //             </>
// //           )}

// //           <button type="submit">Login / Sign-in</button>
// //         </form>
// //       </div>
// //     </>
// //   );
// // }



























// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const southStates = [
//   "Tamil Nadu",
//   "Kerala",
//   "Karnataka",
//   "Andhra Pradesh",
//   "Telangana",
// ];

// // Get browser geolocation
// async function getBrowserLocation(): Promise<{ latitude: number; longitude: number }> {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) return reject(new Error("Geolocation not supported"));
//     navigator.geolocation.getCurrentPosition(
//       (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
//       (err) => reject(err)
//     );
//   });
// }

// // IP-based geolocation fallback
// async function getIpLocation(): Promise<string> {
//   const res = await fetch("https://ipapi.co/json/");
//   if (!res.ok) throw new Error("Failed to get IP location");
//   const data = await res.json();
//   return data.region || "Unknown";
// }

// export default function LoginPage() {
//  const [theme, setTheme] = useState<"white" | "dark">("dark");

//   const [location, setLocation] = useState<string>("Unknown");
//   const [otpMethod, setOtpMethod] = useState<"email" | "sms">("sms");

//   // Form state
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [image, setImage] = useState("");
//   const [mobile, setMobile] = useState("");

//   useEffect(() => {
//   const storedTheme = localStorage.getItem("theme") as "white" | "dark";
//   if (storedTheme) setTheme(storedTheme);
// }, []);
//   // Detect location & theme on load
//   useEffect(() => {
//     async function detectLocationAndTheme() {
//       const currentHour = new Date().getHours();
//       let resolvedLocation = "";

//       try {
//         const { latitude, longitude } = await getBrowserLocation();
//         console.log("Browser geolocation:", latitude, longitude);
        
//         // Ask backend to reverse geocode
//         const res = await axios.get("/api/location/reverse", {
//           params: { lat: latitude, lon: longitude },
//         });
//         resolvedLocation = res.data?.state || "";
//         console.log("Reverse geocode result:", resolvedLocation);
//         handleLoginWithLocation(latitude, longitude, resolvedLocation);
//       } catch {
//         try {
//           // Fallback to IP
//           resolvedLocation = await getIpLocation();
//           console.log("IP fallback:", resolvedLocation);
//           handleLoginWithLocation(undefined, undefined, resolvedLocation);
//         } catch {
//           resolvedLocation = "Unknown";
//           handleLoginWithLocation(undefined, undefined, resolvedLocation);
//         }
//       }

//       setLocation(resolvedLocation);

//       const inSouth = southStates.includes(resolvedLocation);
//       const timeIsWhite = currentHour >= 10 && currentHour < 12;
//       const shouldWhite = inSouth || timeIsWhite;

//       setTheme(shouldWhite ? "white" : "dark");
//       setOtpMethod(inSouth ? "email" : "sms");
//     }

//     detectLocationAndTheme();
//   }, []);

//   // Apply theme to body
//   // useEffect(() => {
//   //   if (typeof window === "undefined") return; // only client-side
//   //   if (theme === "white") {
//   //     document.body.classList.add("white-theme");
//   //     document.body.classList.remove("dark-theme");
//   //   } else {
//   //     document.body.classList.add("dark-theme");
//   //     document.body.classList.remove("white-theme");
//   //   }
//   // }, [theme]);
// useEffect(() => {
//     document.body.style.backgroundColor = theme === "white" ? "white" : "#121212";
//     document.body.style.color = theme === "white" ? "black" : "white";
//     localStorage.setItem("theme", theme);
//   }, [theme]);





//   const handleLoginWithLocation = async (lat?: number, lon?: number, resolvedLocation?: string) => {
//     try {
//       const res = await fetch("/user/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email,
//           name,
//           image,
//           lat: lat ?? null,
//           lon: lon ?? null,
//           location: resolvedLocation ?? "Unknown",
//           mobile,
//         }),
//       });

//       const data = await res.json();
//       console.log("✅ Login Response:", data);

//       if (data.result) {
//         const serverTheme = data.result.theme || theme;
//         setTheme(serverTheme); // this triggers the above useEffect
//          setOtpMethod(data.result.otpMethod || otpMethod);
//         localStorage.setItem("theme", serverTheme);

//         // const serverOtp = data.result.otpMethod || otpMethod;
//         // setOtpMethod(serverOtp);

//         // localStorage.setItem("theme", serverTheme);

//         alert("Login successful");
//       } else {
//         alert("Login failed");
//       }
//     } catch (err) {
//       console.error("❌ Login error:", err);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) {
//       alert("Email is required");
//       return;
//     }
//     if (otpMethod === "sms" && !/^\+91\d{10}$/.test(mobile)) {
//       alert("Valid mobile number is required for SMS OTP");
//       return;
//     }
//     // Trigger login again to ensure server has coordinates/fallback
//     handleLoginWithLocation(undefined, undefined, location);
//   };

//   return (
//     <>
//     {/* <style>{`
//       body.white-theme {
//         background-color: white;
//         color: black;
//       }
//       body.dark-theme {
//         background-color: #121212;
//         color: white;
//       }
//     `}</style> */}
//     <div className="login-container">
//       <h2>Login Page</h2>
//       <p>Current Theme: <strong>{theme}</strong></p>
//       <p>Detected Location: <strong>{location}</strong></p>
//       <p>OTP Method: <strong>{otpMethod}</strong></p>

//       <form onSubmit={handleSubmit}>
//         <label>Email:</label>
//         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

//         <label>Name (optional):</label>
//         <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

//         <label>Profile Image URL (optional):</label>
//         <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />

//         {otpMethod === "sms" && (
//           <>
//             <label>Mobile Number (for OTP):</label>
//             <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+91xxxxxxxxxx" required />
//           </>
//         )}

//         <button type="submit">Login / Sign-in</button>
//       </form>
//     </div>
//     </>
//   );
// }

















// import React from "react";
// import { applyTheme } from "../lib/theme";

// async function handleLogin(email: string) {
//   const coords = await new Promise<{ lat: number; lon: number } | null>((resolve) => {
//     if (!("geolocation" in navigator)) return resolve(null);
//     navigator.geolocation.getCurrentPosition(
//       (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
//       () => resolve(null),
//       { maximumAge: 30_000, timeout: 4000, enableHighAccuracy: false }
//     );
//   });
// console.log("🎯 Browser coords:", coords);

//   const res = await fetch(`${process.env.REACT_APP_API}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     // body: JSON.stringify({ email, coords }),
//     body: JSON.stringify({
//   email,
//   lat: coords?.lat,
//   lon: coords?.lon
// }),
// });



//   const data = await res.json();
//   if (data?.ok) {
//     applyTheme(data.theme);
//     alert(`Theme: ${data.theme}, OTP via: ${data.otpChannel}, State: ${data.state}`);
//   } else {
//     console.error("Login failed", data);
//   }
// }

// export default function LoginPage() {
//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold">Login</h1>
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//         onClick={() => handleLogin("1234riyaagrawal@gmail.com")}
//       >
//         Login
//       </button>
//     </div>
//   );
// }




















import React from "react";
import { applyTheme } from "../lib/theme";

// async function handleLogin(email: string) {
//   let coords: { lat: number; lon: number } | null = null;

//   if ("geolocation" in navigator) {
//     coords = await new Promise((resolve) =>
//       // const coords = { lat: 28.6139, lon: 77.2090 }; // New Delhi

//       navigator.geolocation.getCurrentPosition(
//         (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
//         (err) => {
//           console.warn("❌ Geolocation error:", err.message);
//           resolve(null);
//         },
//         { maximumAge: 30_000, timeout: 10000, enableHighAccuracy: true }
//       )
//     );
//   }

//   if (!coords) console.warn("⚠️ No browser coordinates available; fallback to IP will be used on backend");
//   console.log("🎯 Browser coords:", coords);

//   // Always send lat/lon as null if not available
//   const res = await fetch(`${process.env.REACT_APP_API}/auth/login`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       email,
//       lat: coords?.lat ?? null,
//       lon: coords?.lon ?? null,
//     }),
//   });



//   // 4️⃣ Handle response
//   const data = await res.json();
//   if (data?.ok) {
//     applyTheme(data.theme);
//     alert(`Theme: ${data.theme}, OTP via: ${data.otpChannel}, State: ${data.state}`);
//     console.log("✅ Login response:", data);
//   } else {
//     console.error("Login failed", data);
//   }
// }

async function handleLogin(email: string, name: string, image: string) {
  let coords: { lat: number; lon: number } | null = null;

  if ("geolocation" in navigator) {
    coords = await new Promise((resolve) =>
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => {
          console.warn("❌ Geolocation error:", err.message);
          resolve(null);
        },
        { maximumAge: 30_000, timeout: 10000, enableHighAccuracy: true }
      )
    );
  }

  // Use dummy coords if geolocation fails
  if (!coords) {
    console.warn("⚠️ Using dummy coordinates for testing");
    coords = { lat: 28.6139, lon: 77.2090 }; // New Delhi
  }
  const lat = coords?.lat ?? 28.6139;  // New Delhi
  const lon = coords?.lon ?? 77.2090;
  console.log("🎯 Sending coords:", lat, lon);

  const res = await fetch(`${process.env.REACT_APP_API}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name,
      image,
      // lat: coords.lat,
      // lon: coords.lon,
// lat: coords?.lat ?? 28.6139, // dummy coords fallback
//   lon: coords?.lon ?? 77.2090,
lat,
lon,
    }),
  });

  const data = await res.json();
  if (data?.ok) {
    applyTheme(data.theme);
    alert(`Theme: ${data.theme}, OTP via: ${data.otpChannel}, State: ${data.state}`);
    console.log("✅ Login response:", data);
  } else {
    console.error("Login failed", data);
  }
}



export default function LoginPage() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Login</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => handleLogin("1234riyaagrawal@gmail.com", "Riya Agrawal",
    "https://lh3.googleusercontent.com/a/ACg8ocL_zdGxuSSqOZLjfNjlHlHyNzxjfeNjHxSknKs2afm7_-p3cWs=s96-c"
  )}

        // )}
      >
        Login
      </button>
    </div>
  );
}
