

import express from "express";
import path from "path";
import { canDownloadVideo, saveDownload } from "../controllers/downloadController.js";

const router = express.Router();

// 1️⃣ Check if user can download
router.get("/can-download", canDownloadVideo);

// 2️⃣ Save download record
router.post("/save", saveDownload);

// 3️⃣ Serve the video file for download
router.get("/file/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(process.cwd(), "uploads", filename); // uploads folder
console.log("Looking for file at:", filePath);

  res.download(filePath, filename, (err) => {
    if (err) {
      console.error(err);
      res.status(404).send("File not found");
    }
  });
});

export default router;
