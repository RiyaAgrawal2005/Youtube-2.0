
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";

import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import downloadRoutes from "./routes/downloadRoutes.js";
import premiumRoutes from "./routes/premiumRoutes.js";
import locationRoutes from "./routes/location.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import createOrderRoute from "./routes/create-order.js";
import verifyPaymentRoute from "./routes/verify-payment.js";
import LocationRoutes from "./routes/LocationRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import getLocationRoutes from "./routes/getLocationRoutes.js";
import uploadVideoRouter from "./routes/uploadVideo.js";
import UserModel from "./Modals/user.js";  // make sure the path matches your structure



dotenv.config();
const router = express.Router();
const app = express();

app.use(cors());
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Log incoming requests after parsing
app.use((req, res, next) => {
  console.log("📩 Incoming:", req.method, req.url);
  console.log("📦 Parsed body:", req.body);
  next();
});


console.log("Server setup complete");
const __dirname = path.resolve();



// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, "uploads"), {
//     setHeaders: (res, path) => {
//       if (path.endsWith(".mp4")) {
//         res.setHeader("Content-Type", "video/mp4");
//         res.setHeader("Content-Disposition", "inline");
//       }
//     },
//   })
// );



app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".mp4")) {
        res.setHeader("Content-Type", "video/mp4");
        res.setHeader("Content-Disposition", "inline");
      } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (filePath.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      }
    },
  })
);



app.get("/", (req, res) => {
  res.send("YouTube backend is working");
});

// Express example
app.get('/users/byFirebaseUid/:firebaseUid', async (req, res) => {
  const firebaseUid = req.params.firebaseUid;
  try {
    const user = await UserModel.findOne({ firebaseUid }); // your user schema stores firebaseUid
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});




app.post('/user/loginOrCreate', async (req, res) => {
  const { firebaseUid, email } = req.body;
  try {
    let user = await UserModel.findOne({ firebaseUid });
    if (!user) {
      user = new UserModel({ firebaseUid, email });
      await user.save();
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.use("/api/videos", uploadVideoRouter);
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);
app.use("/api/location", locationRoutes)
app.use("/api/download", downloadRoutes);
app.use("/api/premium", premiumRoutes);
app.use("/create-order", createOrderRoute);
app.use("/api/payment/verify-payment", verifyPaymentRoute);
app.use("/api/task-location", LocationRoutes);

app.use("/api/otp", otpRoutes);
app.use("/api", getLocationRoutes);

const PORT = process.env.PORT || 5000;
console.log("OPENCAGE_KEY", process.env.OPENCAGE_KEY);
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });





const DBURL = process.env.DB_URL;
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("✅ MongoDB connected");
  app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
  })
  .catch((error) => {
    console.log("❌ MongoDB connection error:", error);
  });





























