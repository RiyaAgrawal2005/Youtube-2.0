// // server/routes/verify-payment.js
// import express from "express";
// import crypto from "crypto";

// const router = express.Router();

// // router.post("/verify-payment", async (req, res) => {
//     router.post("/", async (req, res) => {
//     console.log("Key Secret in Backend:", process.env.RAZORPAY_KEY_SECRET ? "Loaded" : "❌ Missing");
//     console.log("Received verify-payment request body:", req.body);
//   try {
//     console.log("🔹 Incoming payment verification request");
//     console.log("Request body:", req.body);

//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;

//     console.log("----- Payment Verification Request -----");
//     console.log("Email:", email);
//     console.log("Order ID:", razorpay_order_id);
//     console.log("Payment ID:", razorpay_payment_id);
//     console.log("Signature from Razorpay:", razorpay_signature);


//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//     console.error("Missing required fields in payment verification");
//     return res.status(400).json({ success: false, message: "Missing payment details" });
//   }

// console.log("Order ID (raw):", razorpay_order_id, "| length:", razorpay_order_id.length);
// console.log("Payment ID (raw):", razorpay_payment_id, "| length:", razorpay_payment_id.length);
// console.log("Signature (raw):", razorpay_signature, "| length:", razorpay_signature.length);


//     // Generate signature
//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "");
//     hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
//     const generatedSignature = hmac.digest("hex");

// console.log("RAZORPAY_KEY_SECRET Loaded:", !!process.env.RAZORPAY_KEY_SECRET);
//     console.log("Generated Signature:", generatedSignature);
// console.log("Signature match:", generatedSignature === razorpay_signature);

//     if (generatedSignature === razorpay_signature) {
//       console.log("✅ Payment verified successfully!");
//       return res.json({ success: true, message: "Payment verified" });
//     } else {
//       console.log("❌ Invalid payment signature!");
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }
//   } catch (error) {
//     console.error("🚨 Payment Verification Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;















// import express from "express";
// import crypto from "crypto";

// const router = express.Router();

// router.post("/", async (req, res) => {
//   console.log("Key Secret Loaded:", !!process.env.RAZORPAY_KEY_SECRET);
//   console.log("Received request body:", req.body);

//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;

//     // Check for missing fields
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Missing payment details" });
//     }

//     // Trim values to avoid extra spaces
//     const orderId = razorpay_order_id.toString().trim();
//     const paymentId = razorpay_payment_id.toString().trim();
//     const signature = razorpay_signature.toString().trim();
// const secret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
//     // Generate HMAC signature
//     const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "");
//     hmac.update(orderId + "|" + paymentId);
//     const generatedSignature = hmac.digest("hex");

//     console.log("Order ID:", orderId);
//     console.log("Payment ID:", paymentId);
//     console.log("Signature from Razorpay:", signature);
//     console.log("Generated Signature:", generatedSignature);
//     console.log("Signature match:", generatedSignature === signature);
// console.log("Raw Razorpay Signature:", `"${signature}"`);
// console.log("Generated Signature:", `"${generatedSignature}"`);
// console.log("Secret length:", secret.length);
//     if (generatedSignature === signature) {
//       console.log("✅ Payment verified successfully!");
//       return res.json({ success: true, message: "Payment verified" });
//     } else {
//       console.log("❌ Invalid payment signature!");
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//   } catch (error) {
//     console.error("🚨 Payment Verification Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;





















// import express from "express";
// import crypto from "crypto";

// const router = express.Router();
// console.log("RAZORPAY_KEY_SECRET (backend verify-payment):", process.env.RAZORPAY_KEY_SECRET);
// console.log("🔑 RAZORPAY_KEY_SECRET (raw):", JSON.stringify(process.env.RAZORPAY_KEY_SECRET));
// console.log("✅ verify-payment.js loaded");


// router.post("/", async (req, res) => {
//   console.log("🔹 Verify-payment route hit");
//   console.log("🔹 req.body:", req.body);
//   console.log("HEADERS:", req.headers["content-type"]);
  
//   // 🟢 Add debug logs here
//   console.log("🟢 Raw req.body before checks:", req.body);
//   console.log("🟢 Type of razorpay_order_id:", typeof req.body.razorpay_order_id);
//   console.log("🟢 Type of razorpay_payment_id:", typeof req.body.razorpay_payment_id);
//   console.log("🟢 Type of razorpay_signature:", typeof req.body.razorpay_signature);

//   try {
//     // Ensure req.body has the required fields
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email } = req.body;


//  console.log("🔍 VERIFY-PAYMENT DEBUG");
//     console.log("Order ID from client:", `"${razorpay_order_id}"`);
//     console.log("Payment ID from client:", `"${razorpay_payment_id}"`);
//     console.log("Signature from client:", `"${razorpay_signature}"`);
//     console.log("Email:", email);

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       console.error("❌ Missing payment details:", req.body);
//       return res.status(400).json({ success: false, message: "Missing payment details" });
//     }

//     // Ensure secret is loaded
//     // const secret = process.env.RAZORPAY_KEY_SECRET?.trim();
//     const secret = process.env.RAZORPAY_KEY_SECRET?.trim().replace(/^"|"$/g, "");
// console.log("✅ Cleaned RAZORPAY_KEY_SECRET:", `"${secret}"`);

//     if (!secret) {
//       console.error("❌ Razorpay secret missing in .env");
//       return res.status(500).json({ success: false, message: "Razorpay secret missing" });
//     }

//     // Trim order_id and payment_id to avoid invisible spaces
//     const orderId = razorpay_order_id.toString().trim();
//     const paymentId = razorpay_payment_id.toString().trim();
//     const signature = razorpay_signature.toString().trim();


// // 🟢 Extra debug logs here
// console.log("🔍 SECRET used for verification:", `"${secret}"`);
// console.log("🔍 orderId (after trim):", `"${orderId}"`);
// console.log("🔍 paymentId (after trim):", `"${paymentId}"`);
// console.log("🔍 signature (after trim):", `"${signature}"`);
// console.log("🔍 String for HMAC:", `"${orderId}|${paymentId}"`);
// console.log("🔹 Lengths:", orderId.length, paymentId.length, signature.length, secret.length);
// console.log("🔹 All chars:", orderId, paymentId, signature, secret);

// console.log("🔑 RAZORPAY_KEY_SECRET (raw):", JSON.stringify(process.env.RAZORPAY_KEY_SECRET));
// console.log("🔍 Backend received payload:", req.body);
//     // Generate expected HMAC signature using UTF-8 encoding
//     const body = `${orderId}|${paymentId}`;
//     const expectedSignature = crypto
//       .createHmac("sha256", secret)
//       // .update(Buffer.from(body, "utf-8"))
//         .update(`${orderId}|${paymentId}`, "utf-8")
//       .digest("hex");

//       console.log("Expected:", expectedSignature);
// console.log("Provided:", signature);

//     // Debug logging
//     console.log("🔹 Received order_id:", `"${orderId}"`);
//     console.log("🔹 Received payment_id:", `"${paymentId}"`);
//     console.log("🔹 Received signature:", `"${signature}"`);
//     console.log("🔹 Expected signature:", `"${expectedSignature}"`);
// console.log("🔹 String for HMAC:", `"${razorpay_order_id}|${razorpay_payment_id}"`);
//     console.log("Body for HMAC:", body);
//     console.log("Expected signature:", expectedSignature);
//       console.log("🔍 Order ID:", razorpay_order_id);
//   console.log("🔍 Payment ID:", razorpay_payment_id);
//   console.log("🔍 Expected Signature:", expectedSignature);
//   console.log("🔍 Provided Signature:", razorpay_signature);
//   console.log("🔍 Match:", expectedSignature === razorpay_signature);
//     // Compare signatures
//     if (expectedSignature === signature) {
//       console.log("✅ Payment verified successfully!");
//       return res.json({ success: true, message: "Payment verified" });
//     } else {
//       console.error("❌ Invalid payment signature!");
//       return res.status(400).json({ success: false, message: "Invalid signature" , expected: expectedSignature,
//     provided: signature,});
//     }
//   } catch (error) {
//     console.error("🚨 Payment verification error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;
























// import express from "express";
// import crypto from "crypto";
// import User from "../Modals/user.js"; // <-- so we can update isPremium
// import Razorpay from "razorpay";
// import sendInvoiceEmail from "../utils/sendInvoiceEmail.js";
// const router = express.Router();
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


// router.post("/", async (req, res) => {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, email , plan} = req.body;

//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Missing payment details" });
//     }

//     const secret = process.env.RAZORPAY_KEY_SECRET?.trim().replace(/^"|"$/g, "");
//     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = crypto
//       .createHmac("sha256", secret)
//       .update(body)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }


//      const order = await razorpay.orders.fetch(razorpay_order_id);
//     const purpose = order.notes?.purpose || "subscription";
//     console.log("✅ Payment verified for purpose:", purpose);
// //     const dbOrder = await Order.findOne({ orderId: razorpay_order_id });
// // console.log("✅ Payment verified for purpose:", dbOrder.purpose);


//     // Update user based on purpose
//     // if (purpose === "premium-download") {
//     //   await User.findOneAndUpdate({ email }, { isPremium: true });
//     //   console.log(`User ${email} upgraded to Premium for downloads`);
//     // } else if (purpose === "subscription") {
//     //   await User.findOneAndUpdate({ email }, { isPremium: true });
//     //   console.log(`User ${email} upgraded subscription`);
//     // }



//      // 3️⃣ Update MongoDB
//     let updateFields = {};
//     if (purpose === "subscription") {
//       updateFields = { isPremium: true, subscriptionPlan: plan || "Gold" };
//     } else if (purpose === "premium-download") {
//       updateFields = { isPremium: true };
//     }

//     if (Object.keys(updateFields).length > 0) {
//       await User.findOneAndUpdate({ email }, updateFields, { new: true });
//       console.log(`User ${email} updated with:`, updateFields);
//     }


// try {
//   const amount = order.amount / 100; // Razorpay stores amount in paise
//   const currency = order.currency || "INR";

//   await sendInvoiceEmail(email, purpose === "subscription" ? plan || "Gold Plan" : "Premium Download", razorpay_payment_id, razorpay_order_id, amount, currency);
//   console.log(`✅ Invoice sent to ${email} for ${purpose}`);
// } catch (err) {
//   console.error("❌ Failed to send invoice:", err);
// }

//     res.json({ success: true, message: "Payment verified", purpose });
//   } catch (error) {
//     console.error("🚨 Payment verification error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;












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

