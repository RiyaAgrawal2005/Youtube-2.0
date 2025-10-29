// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const backendUrl = "http://localhost:5000";

// interface Location {
//   city: string;
//   state: string;
// }

// const LocationFetcher = () => {
//   const [location, setLocation] = useState<Location | null>(null);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     const fetchLocation = async () => {
//       // 1️⃣ Try GPS first
//       if ("geolocation" in navigator) {
//         navigator.geolocation.getCurrentPosition(
//           async (position) => {
//             try {
//               const { latitude, longitude } = position.coords;
//               const res = await axios.get(`${backendUrl}/api/task-location/reverse`, {
//                 params: { lat: latitude, lon: longitude },
//               });
//               setLocation(res.data);
//             } catch (err) {
//               console.warn("Reverse geocoding failed, fallback to IP", err);
//               fetchLocationByIP();
//             }
//           },
//           (geoError) => {
//             console.warn("Geolocation failed, fallback to IP:", geoError.message);
//             fetchLocationByIP();
//           },
//           { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//         );
//       } else {
//         // Browser does not support geolocation
//         fetchLocationByIP();
//       }
//     };

//     const fetchLocationByIP = async () => {
//       try {
//         const res = await axios.get(`${backendUrl}/api/task-location/ip`);
//         setLocation(res.data);
//       } catch (err) {
//         console.error("IP fallback failed:", err);
//         setError("Unable to detect location");
//       }
//     };

//     fetchLocation();
//   }, []);

//   if (error) return <div>{error}</div>;
//   if (!location) return <div>Detecting location...</div>;

//   return (
//     <div>
//       <strong>City:</strong> {location.city} <br />
//       <strong>State:</strong> {location.state}
//     </div>
//   );
// };

// export default LocationFetcher;



















import React, { useEffect, useState } from "react";
import axios from "axios";

const backendUrl = "http://localhost:5000";

interface Location {
  city: string;
  state: string;
  theme: "white" | "dark";
  otpMethod: "email" | "mobile";
}

const LocationFetcher = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchLocation = async () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await axios.get(`${backendUrl}/api/task-location/reverse`, {
                params: { lat: latitude, lon: longitude },
              });
              setLocation(res.data);
              applyTheme(res.data.theme);
              triggerOTP(res.data.otpMethod);
            } catch (err) {
              console.warn("Reverse geocoding failed, fallback to IP", err);
              fetchLocationByIP();
            }
          },
          (geoError) => {
            console.warn("Geolocation failed, fallback to IP:", geoError.message);
            fetchLocationByIP();
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
      } else {
        fetchLocationByIP();
      }
    };

    const fetchLocationByIP = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/task-location/ip`);
        setLocation(res.data);
        applyTheme(res.data.theme);
        triggerOTP(res.data.otpMethod);
      } catch (err) {
        console.error("IP fallback failed:", err);
        setError("Unable to detect location");
      }
    };

    const applyTheme = (theme: "white" | "dark") => {
      document.body.style.backgroundColor = theme === "white" ? "#ffffff" : "#1a1a1a";
      document.body.style.color = theme === "white" ? "#000000" : "#ffffff";
    };

//     const applyTheme = (theme: "white" | "dark") => {
//   const root = document.documentElement;
//   if (theme === "dark") root.classList.add("dark");
//   else root.classList.remove("dark");
// };


    const triggerOTP = (method: "email" | "mobile") => {
      // Replace this with your actual OTP trigger logic
      console.log(`Trigger OTP via: ${method}`);
    };


    fetchLocation();
  }, []);

  if (error) return <div>{error}</div>;
  if (!location) return <div>Detecting location...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h3>Location Info</h3>
      <strong>City:</strong> {location.city} <br />
      <strong>State:</strong> {location.state} <br />
      <strong>Theme:</strong> {location.theme} <br />
      <strong>OTP Method:</strong> {location.otpMethod}
    </div>
  );
};

export default LocationFetcher;
