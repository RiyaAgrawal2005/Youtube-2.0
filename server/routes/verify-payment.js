

import express from "express";
import crypto from "crypto";
import User from "../Modals/user.js"; // <-- for updating isPremium
import Razorpay from "razorpay";
import sendInvoiceEmail from "../utils/sendInvoiceEmail.js";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payment/verify-payment
router.post("/", async (req, res) => {
  console.log("📩 Incoming verify-payment request body:", req.body);

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, plan } = req.body;

    // 1️⃣ Check for missing fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.warn("⚠️ Missing payment details:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    // 2️⃣ Verify signature
    const secret = process.env.RAZORPAY_KEY_SECRET?.trim().replace(/^"|"$/g, "");
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto.createHmac("sha256", secret).update(body).digest("hex");

    console.log("🔑 Expected signature:", expectedSignature);
    console.log("🔑 Received signature:", razorpay_signature);

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ Signature mismatch");
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // 3️⃣ Fetch order from Razorpay
    const order = await razorpay.orders.fetch(razorpay_order_id);
    console.log("📝 Fetched Razorpay order:", order);

    const purpose = order.notes?.purpose || "subscription";
    const planFromOrder = order.notes?.plan || plan || "Gold";

    console.log(`✅ Payment verified for purpose: ${purpose}, plan: ${planFromOrder}`);

    // 4️⃣ Update user in MongoDB
    let updateFields = {};
    if (purpose === "subscription") {
      updateFields = { isPremium: true, subscriptionPlan: planFromOrder };
    } else if (purpose === "premium-download") {
      updateFields = { isPremium: true };
    }

    if (Object.keys(updateFields).length > 0) {
      const updatedUser = await User.findOneAndUpdate({ email }, updateFields, { new: true });
      if (!updatedUser) {
        console.warn(`⚠️ User with email ${email} not found in DB`);
      } else {
        console.log(`✅ User ${email} updated successfully with:`, updateFields);
      }
    }

    // 5️⃣ Send invoice email
    try {
      const amount = order.amount / 100; // Razorpay stores amount in paise
      const currency = order.currency || "INR";

      await sendInvoiceEmail(
        email,
        purpose === "subscription" ? `${planFromOrder} Plan` : "Premium Download",
        razorpay_payment_id,
        razorpay_order_id,
        amount,
        currency
      );
      console.log(`✅ Invoice sent to ${email} for ${purpose}`);
    } catch (emailErr) {
      console.error("❌ Failed to send invoice:", emailErr);
    }

    // 6️⃣ Respond to frontend
    res.json({ success: true, message: "Payment verified", purpose, plan: planFromOrder });
  } catch (error) {
    console.error("🚨 Payment verification error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

export default router;

