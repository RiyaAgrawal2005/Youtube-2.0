
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firebaseUid: { type: String, unique: true },
  name: { type: String },
  image: { type: String },
  // location: { type: String, default: "Unknown" },
  location: {
    city: { type: String, default: "Unknown" },
    state: { type: String, default: "Unknown" },
  },
  otpMethod: { type: String, enum: ["email", "mobile"], default: "email" },
mobile: { type: String },
theme: { type: String, enum: ["white", "dark"], default: "dark" },
  joinedon: { type: Date, default: Date.now },
  channelname: { type: String },
  description: { type: String },
  subscriptionPlan: {
    type: String,
    enum: ["Free", "Bronze", "Silver", "Gold"],
    default: "Free",
  },
  downloadsToday: { type: Number, default: 0 },
  lastDownloadDate: { type: String, default: null }, // YYYY-MM-DD
  isPremium: { type: Boolean, default: false }, // optional, can keep for backward compatibility
}, { collection: "users" });

export default mongoose.model("User", userSchema);
