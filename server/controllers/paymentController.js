

import Razorpay from "razorpay";
import crypto from "crypto";
import User from "../Modals/user.js";
import sendInvoiceEmail  from "../utils/sendInvoiceEmail.js"; // create this helper
import Payment from "../Modals/Payment.js"; // Make sure this path is correct

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_yourKey",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "yourSecretKey", // FIX: should be RAZORPAY_KEY_SECRET, not RAZORPAY_SECRET
});

// ------------------ CREATE ORDER ------------------
export const createOrder = async (req, res) => {
  const { amount } = req.body; // frontend passes plan price (10/50/100)
  const options = {
    amount: amount * 100, // Razorpay needs paise
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ error: "Order creation failed" });
  }
};

// ------------------ VERIFY PAYMENT ------------------
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email, plan } = req.body;

    // ✅ Step 1: Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // ✅ Step 2: Update user subscription plan
    // const updatedUser = await User.findOneAndUpdate(
    //   { email },
    //   { subscriptionPlan: plan, isPremium: plan !== "Free" }, // save plan name
    //   { new: true }
    // );
    const updatedUser = await User.findOneAndUpdate(
  { email },
  {
    subscriptionPlan: plan,
    isPremium: plan !== "Free",
    downloadsToday: 0,      // reset daily downloads
    lastDownloadDate: null, // reset last download date
  },
  { new: true }
);


 await Payment.create({
      email,
      plan,
      amount: plan === "Bronze" ? 10 : plan === "Silver" ? 50 : plan === "Gold" ? 100 : 0,
      currency: "INR",
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "paid",
      paidAt: new Date()
    });


    // ✅ Step 3: Send confirmation email with invoice
    await sendInvoiceEmail(email, plan, razorpay_payment_id, razorpay_order_id);

    // ✅ Step 4: Respond
    res.json({
      success: true,
      message: `Payment verified & upgraded to ${plan} plan`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ Error in verifyPayment:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


















































