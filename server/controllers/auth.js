import mongoose from "mongoose";
import User from "../Modals/user.js";

const southStates = new Set([
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
]);

export const login = async (req, res) => {
  try {
    const { email, name, image, lat, lon, location, mobile } = req.body;
    console.log("📍 Incoming coords:", lat, lon);
    if (!email) return res.status(400).json({ message: "Email is required" });

    // Defaults
    let state = location || "Unknown";
    let city = "Unknown";

    // Reverse geocoding if coords exist
    if ((!state || state === "Unknown") && lat != null && lon != null) {
      try {
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`;
        const geoRes = await fetch(url, {
          headers: { "User-Agent": "YouTubeCloneApp/1.0" },
        });
        console.log("📍 Using browser coords for reverse geocoding:", lat, lon);

        if (geoRes.ok) {
          const geoData = await geoRes.json();
          state =
            geoData?.address?.state ||
            geoData?.address?.state_district ||
            geoData?.address?.region ||
            geoData?.address?.city ||
            geoData?.address?.town ||
            geoData?.address?.village ||
            "Unknown";

          city =
            geoData?.address?.city ||
            geoData?.address?.town ||
            geoData?.address?.village ||
            "Unknown";

          console.log("✅ Resolved city/state:", city, state);
        }
      } catch (err) {
        console.error("❌ Reverse geocoding error:", err.message || err);
      }
    }

    // Fallback to IP-based location if still unknown
    if (!state || state === "Unknown") {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        state = ipData.region || "Unknown";
        city = ipData.city || "Unknown";
        console.log("🌍 Resolved city/state via IP fallback:", city, state);
      } catch {
        state = "Unknown";
        city = "Unknown";
      }
    }

    state = (state || "Unknown").trim();

    // 2️⃣ Decide theme & OTP
    const hour = new Date().getHours();
      
      const inSouth = southStates.has(state);
      const timeIsWhite = hour >= 10 && hour < 12;
    const theme = inSouth && timeIsWhite ? "white" : "dark";
    // const otpMethod = inSouth ? "mobile" : "email";
    const otpMethod = inSouth ? "email" : "mobile";

console.log("State:", state, "City:", city,  "InSouth:", inSouth, "Hour:", hour);
console.log("Theme:", theme, "OTP Method:", otpMethod);

    // 3️⃣ Upsert user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        name,
        image,
        mobile,
        location: {city,state},
        theme,
        otpMethod,
      });
      return res.status(201).json({
        ok: true,
        theme: user.theme,
        otpChannel: user.otpMethod,
        location:  user.location,
        result: user,
        message:  "New user created, logged in directly",
      });
    } else {
      
await user.save();

return res.status(200).json({
  ok: true,
  theme: user.theme,
  otpChannel: user.otpMethod,   // "email" or "mobile"
  location: user.location,
  email: user.email,
  mobile: user.mobile || null,
  otpRequired: true,            // IMPORTANT: frontend checks this flag
  message: "Existing user, OTP required",
});

    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: { channelname, description } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ result: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};





























