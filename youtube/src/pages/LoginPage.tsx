



import React from "react";
import { applyTheme } from "../lib/theme";



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
