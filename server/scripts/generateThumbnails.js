import mongoose from "mongoose";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import Video from "../Modals/video.js";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.resolve();
const uploadDir = path.join(__dirname, "uploads");
const thumbnailDir = path.join(uploadDir, "thumbnails");

// Make sure thumbnail folder exists
if (!fs.existsSync(thumbnailDir)) {
  fs.mkdirSync(thumbnailDir);
}

// **Set FFmpeg & FFprobe paths explicitly**
const ffmpegPath = "C:\\Users\\dell\\Downloads\\ffmpeg-2025-09-04-git-2611874a50-full_build (1)\\ffmpeg-2025-09-04-git-2611874a50-full_build\\bin\\ffmpeg.exe";
const ffprobePath = "C:\\Users\\dell\\Downloads\\ffmpeg-2025-09-04-git-2611874a50-full_build (1)\\ffmpeg-2025-09-04-git-2611874a50-full_build\\bin\\ffprobe.exe";

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

async function generateThumbnails() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("✅ DB connected");

    // const videos = await Video.find({ poster: { $exists: false } });
const videos = await Video.find({});
    for (const video of videos) {
      const videoPath = path.join(__dirname, video.filepath);
      const thumbnailFilename = `${Date.now()}-${video.filename}.jpg`;
      const thumbnailPath = path.join(thumbnailDir, thumbnailFilename);

      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .on("end", resolve)
          .on("error", reject)
          .screenshots({
            timestamps: ["50%"], // grab frame at 50% of the video
            filename: thumbnailFilename,
            folder: thumbnailDir,
            size: "320x240",
          });
      });

      video.poster = `uploads/thumbnails/${thumbnailFilename}`;
      await video.save();
      console.log(`🖼️ Thumbnail saved for ${video.videotitle}`);
    }

    console.log("🎉 All missing thumbnails generated!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
}

generateThumbnails();
