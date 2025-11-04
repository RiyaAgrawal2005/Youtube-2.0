
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("❌ Missing Razorpay keys in .env");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// create order endpoint
router.post("/", async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  try {
    const { amount, currency, purpose, email, plan, receiptId } = req.body;
const finalReceiptId = receiptId || `receipt_${Date.now()}`
    const options = {
      amount: amount * 100,
      currency: currency || "INR",
      payment_capture: 1,
      receipt: finalReceiptId, // ✅ unique receipt
      description: `${purpose === "premium-download" ? "Premium Download" : "Subscription"}: ${plan || purpose || "subscription"}`,
      notes: { purpose: purpose || "subscription",
plan: plan || "",
         email 
        },
    };

    const order = await razorpay.orders.create(options);
    console.log("🆕 Order created:", order.id, "Purpose:", options.notes.purpose);

    // ✅ Send both order and key_id to frontend
    res.json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount,
       receipt: order.receipt,
      description: order.description,
      key: process.env.RAZORPAY_KEY_ID, // 👈 public key for Razorpay checkout
    });
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
});


export default router;
