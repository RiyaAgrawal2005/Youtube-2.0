// import express from "express";
// import multer from "multer";
// import ffmpeg from "fluent-ffmpeg";
// import fs from "fs";
// import path from "path";
// import Video from "../Modals/video.js";

// const router = express.Router();

// // ✅ Set FFmpeg & FFprobe paths explicitly
// ffmpeg.setFfmpegPath("C:\\Users\\dell\\Downloads\\ffmpeg-2025-09-04-git-2611874a50-full_build (1)\\ffmpeg-2025-09-04-git-2611874a50-full_build\\bin\\ffmpeg.exe");
// ffmpeg.setFfprobePath("C:\\Users\\dell\\Downloads\\ffmpeg-2025-09-04-git-2611874a50-full_build (1)\\ffmpeg-2025-09-04-git-2611874a50-full_build\\bin\\ffprobe.exe");

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

// // Ensure thumbnails folder exists
// const thumbnailDir = path.join("uploads", "thumbnails");
// if (!fs.existsSync(thumbnailDir)) {
//   fs.mkdirSync(thumbnailDir, { recursive: true });
// }

// // Upload video & generate thumbnail
// router.post("/upload", upload.single("video"), async (req, res) => {
//   try {
//     const videoPath = req.file.path;
//     const thumbnailFilename = `${req.file.filename}.jpg`;
//     const thumbnailPath = path.join("uploads", "thumbnails", thumbnailFilename);

//     ffmpeg(videoPath)
//       .screenshots({
//         timestamps: ["50%"], // grab middle frame
//         folder: thumbnailDir,
//         filename: thumbnailFilename,
//         size: "320x180",
//       })
//       .on("end", async () => {
//         console.log("✅ Thumbnail generated:", thumbnailPath);

//         const newVideo = new Video({
//           filename: req.file.filename,
//           filepath: videoPath,
//           poster: thumbnailPath, // save thumbnail path
//           videotitle: req.body.videotitle,
//           videochanel: req.body.videochanel,
//           views: 0,
//         });

//         await newVideo.save();
//         res.json({ message: "Video uploaded successfully", video: newVideo });
//       })
//       .on("error", (err) => {
//         console.error("❌ Thumbnail generation failed:", err);
//         res.status(500).json({ error: "Thumbnail generation failed" });
//       });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Upload failed" });
//   }
// });

// export default router;













import express from "express";
import multer from "multer";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";
import Video from "../Modals/video.js";

const router = express.Router();

// Point to your ffmpeg binaries
ffmpeg.setFfmpegPath(
  "C:\\Users\\dell\\Downloads\\ffmpeg-2025-09-04-git-2611874a50-full_build (1)\\ffmpeg-2025-09-04-git-2611874a50-full_build\\bin\\ffmpeg.exe"
);
ffmpeg.setFfprobePath(
  "C:\\Users\\dell\\Downloads\\ffmpeg-2025-09-04-git-2611874a50-full_build (1)\\ffmpeg-2025-09-04-git-2611874a50-full_build\\bin\\ffprobe.exe"
);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Multer saving file to:", "uploads/");
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const name = Date.now() + "-" + file.originalname;
    console.log("📝 Multer generated filename:", name);
    cb(null, name);
  },
});
const upload = multer({ storage });

// Ensure thumbnails folder exists
const thumbnailDir = path.join("uploads", "thumbnails");
if (!fs.existsSync(thumbnailDir)) {
  console.log("📁 Creating thumbnails directory:", thumbnailDir);
  fs.mkdirSync(thumbnailDir, { recursive: true });
}

// Upload video & generate thumbnail
router.post("/upload", upload.single("video"), async (req, res) => {
  try {
    console.log("📩 Incoming upload request");
    console.log("📦 Request body:", req.body);
    console.log("📂 Uploaded file details:", req.file);

    const videoPath = req.file.path;
    const thumbnailFilename = `${req.file.filename}.jpg`;
    const thumbnailPath = path.join("uploads", "thumbnails", thumbnailFilename);

    console.log("🎯 Video path:", videoPath);
    console.log("🎯 Thumbnail target path:", thumbnailPath);

    // Generate thumbnail
    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .on("start", (cmd) => {
          console.log("🚀 ffmpeg started with command:", cmd);
        })
        .on("end", () => {
          console.log("✅ ffmpeg finished, thumbnail created:", thumbnailPath);
          resolve();
        })
        .on("error", (err) => {
          console.error("❌ ffmpeg error:", err);
          reject(err);
        })
        .screenshots({
          timestamps: ["50%"],
          folder: path.join("uploads", "thumbnails"),
          filename: thumbnailFilename,
          size: "320x180",
        });
    });

    // Save video in DB
 const posterUrl = `uploads/thumbnails/${req.file.filename}.jpg`;

const newVideo = new Video({
  filename: req.file.filename,
  filepath: videoPath.replace(/\\/g, "/"), // forward slashes
  poster: posterUrl,                        // forward slashes
  videotitle: req.body.videotitle,
  videochanel: req.body.videochanel,
  views: 0,
});


    console.log("💾 Saving video to DB:", newVideo);

    await newVideo.save();
    console.log("✅ Video saved in DB with poster:", newVideo.poster);

    res.json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

export default router;
