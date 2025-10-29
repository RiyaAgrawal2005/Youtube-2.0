import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// List of South Indian states for your task
const southStates = new Set([
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana"
]);

/**
 * Reverse geocode latitude/longitude to city/state and determine theme & OTP method
 */
export const reverseGeocode = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon)
      return res.status(400).json({ error: "Coordinates missing" });

    const apiKey = process.env.OPENCAGE_KEY;
    const geoRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=${apiKey}`
    );

    const components = geoRes.data.results[0]?.components || {};
    const city = components.city || components.town || "Unknown";
    const state = components.state || components.region || "Unknown";

    // Determine theme based on time and location
    const now = new Date();
    const hour = now.getHours(); // 0-23
    let theme = "dark";
    if (hour >= 10 && hour < 12 && southStates.has(state)) {
      theme = "white";
    }

    // Determine OTP method
    const otpMethod = southStates.has(state) ? "email" : "mobile";

    res.json({ city, state, theme, otpMethod });
  } catch (err) {
    console.error("Reverse geocode error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to reverse geocode coordinates" });
  }
};

/**
 * Get location from IP as fallback
 */
export const ipLocation = async (req, res) => {
  try {
    const ip = req.ip || req.headers["x-forwarded-for"] || "8.8.8.8"; // fallback IP
    const response = await axios.get(`https://ipapi.co/${ip}/json/`);

    const city = response.data.city || "Unknown";
    const state = response.data.region || "Unknown";

    // Determine theme based on time and location
    const now = new Date();
    const hour = now.getHours();
    let theme = "dark";
    if (hour >= 10 && hour < 12 && southStates.has(state)) {
      theme = "white";
    }

    const otpMethod = southStates.has(state) ? "email" : "mobile";

    res.json({ city, state, theme, otpMethod });
  } catch (err) {
    console.error("IP location error:", err.message);
    res.status(500).json({ error: "Failed to get location from IP" });
  }
};
