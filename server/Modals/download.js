import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  email: { type: String, required: true },
  videoId: { type: String, required: true },
  videoTitle: { type: String },
  fileUrl: { type: String },
  date: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Download", downloadSchema);
