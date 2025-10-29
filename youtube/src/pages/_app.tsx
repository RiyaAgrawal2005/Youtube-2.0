// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";
// import SettingsPanel from "@/components/SettingsPanel"; // adjust path if needed

// import { Toaster } from "@/components/ui/sonner";
// import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import { UserProvider } from "../lib/AuthContext";
// export default function App({ Component, pageProps }: AppProps) {
//   return (
//     <UserProvider>
//       <div className="min-h-screen bg-white text-black">
//         <title>Your-Tube Clone</title>
//         <Header />
//         <Toaster />
//         <div className="flex">
//           <Sidebar />
//           <Component {...pageProps} />
//           <SettingsPanel onThemeChange={handleThemeChange} />

//         </div>
//       </div>
//     </UserProvider>
//   );
// }























// import Header from "@/components/Header";
// import Sidebar from "@/components/Sidebar";
// import SettingsPanel from "@/components/SettingsPanel";
// import Chatroom from "@/components/ChatboxButton";
// import BackButton from "@/components/BackButton";
// import { Toaster } from "@/components/ui/sonner";
// import "@/styles/globals.css";
// import type { AppProps } from "next/app";
// import { UserProvider } from "../lib/AuthContext";
// import { useState, useEffect } from "react";

// export default function App({ Component, pageProps }: AppProps) {
//   const [theme, setTheme] = useState<"light" | "dark" | "default">("default");

//   // Load saved theme from localStorage on mount
//   useEffect(() => {
//     const savedTheme = localStorage.getItem("theme") as
//       | "light"
//       | "dark"
//       | "default"
//       | null;
//     if (savedTheme) setTheme(savedTheme);
//   }, []);

//   // Apply theme and save to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem("theme", theme);
//     if (theme === "light") {
//       document.documentElement.classList.remove("dark");
//     } else if (theme === "dark") {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [theme]);

//   const handleThemeChange = (newTheme: "light" | "dark" | "default") => {
//     setTheme(newTheme);
//   };

//   return (
//     <UserProvider>
//       <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
//         <title>Your-Tube Clone</title>
//         <Header />
//         <Toaster />
//         <div className="flex">
//           <Sidebar />
//           <Component {...pageProps} />
//           <div className="fixed bottom-8 left-6 flex flex-col items-center">
//           <Chatroom />
//           <BackButton />
//         </div>
//           <SettingsPanel onThemeChange={handleThemeChange} />
//         </div>
//       </div>
//     </UserProvider>
//   );
// }






















import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Chatroom from "@/components/ChatboxButton";
import BackButton from "@/components/BackButton";
import VideoCallButton from "@/components/VideoCallButton";

import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
// import SettingsPanel from "@/components/SettingsPanel";

const backendUrl = "http://localhost:5000";

// Define the type for location info
interface LocationInfo {
  city: string;
  state: string;
  theme: "white" | "dark";
  otpMethod: "email" | "mobile";
}

// List of South Indian states
const southStates = new Set([
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
]);

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<"white" | "dark">("dark");
  const [location, setLocation] = useState<LocationInfo | null>(null);

useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        let data: LocationInfo | null = null;

        if ("geolocation" in navigator) {
          data = await new Promise<LocationInfo>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                try {
                  const { latitude, longitude } = position.coords;
                  const res = await axios.get(`${backendUrl}/api/task-location/reverse`, {
                    params: { lat: latitude, lon: longitude },
                  });
                  resolve(res.data);
                } catch (err) {
                  console.warn("Reverse geocoding failed, fallback to IP:", err);
                  const res = await axios.get(`${backendUrl}/api/task-location/ip`);
                  resolve(res.data);
                }
              },
              async () => {
                // If user denies geolocation
                const res = await axios.get(`${backendUrl}/api/task-location/ip`);
                resolve(res.data);
              },
              { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
          });
        } else {
          // Browser does not support geolocation
          const res = await axios.get(`${backendUrl}/api/task-location/ip`);
          data = res.data;
        }

        if (data) {
  setLocation(data);

  // Apply theme safely
  if (data.theme) {
    setTheme(data.theme);
    // applyTheme(data.theme);
  }



  // Trigger OTP safely
  if (data.otpMethod) {
    triggerOTP(data.otpMethod);
  }
}


      } catch (err) {
        console.error("Failed to detect location:", err);
      }
    };

    // const applyTheme = (theme: "white" | "dark") => {
    //   document.body.style.backgroundColor = theme === "white" ? "#ffffff" : "#1a1a1a";
    //   document.body.style.color = theme === "white" ? "#000000" : "#ffffff";
    // };

    const triggerOTP = (method: "email" | "mobile") => {
      // Replace this with your actual OTP logic
      console.log(`Trigger OTP via: ${method}`);
    };

    fetchLocation();
  }, []);




  return (
    <UserProvider>
      <div className={`min-h-screen transition-colors duration-300`}>
        <title>Your-Tube Clone</title>
        <Header />
        <Toaster />
        <div className="flex">
          <Sidebar />
          <Component {...pageProps} location={location} theme={theme} />
          <div className="fixed bottom-8 left-6 flex flex-col items-center">
            <VideoCallButton />
            <Chatroom />
            <BackButton />
          </div>
        </div>
      </div>
    </UserProvider>
  );
}
















