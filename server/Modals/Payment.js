import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    plan: { type: String, enum: ["Free", "Bronze", "Silver", "Gold"], required: true },
    amount: { type: Number, required: true }, // in INR (whole number, not paise)
    currency: { type: String, default: "INR" },

    orderId: { type: String, required: true },
    paymentId: { type: String },
    receipt: { type: String },

    status: { type: String, enum: ["created", "paid", "failed"], default: "created" },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
