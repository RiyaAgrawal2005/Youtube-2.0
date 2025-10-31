// backend/routes/otpRoutes.js
import express from "express";
import { sendOtpController, verifyOtpController } from "../controllers/otpController.js";

const router = express.Router();
router.post("/send", sendOtpController); {
     console.log("📩 /send-otp route triggered", req.body);
}    // POST /api/otp/send
router.post("/verify", verifyOtpController); // POST /api/otp/verify

export default router;
