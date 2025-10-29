import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
console.log("👉 EMAIL_USER:", process.env.EMAIL_USER);
console.log("👉 EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465, // SSL
  secure: true,
  // service: "gmail",
  auth: {
     type: "login",
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/**
 * Sends a simple invoice/receipt email
 */
const sendInvoiceEmail = async (
  toEmail,
  plan,
  paymentId,
  orderId,
  amount = 0,
  currency = "INR"
) => {
  const subject = `Your ${plan} plan payment receipt`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111;">
      <h2>Payment Receipt</h2>
      <p>Hi,</p>
      <p>Thank you for your purchase. Here are your payment details:</p>
      <ul>
        <li><strong>Plan:</strong> ${plan}</li>
        <li><strong>Amount:</strong> ${amount} ${currency}</li>
        <li><strong>Payment ID:</strong> ${paymentId}</li>
        <li><strong>Order ID:</strong> ${orderId}</li>
      </ul>
      <p>If you have any questions, just reply to this email.</p>
      <p>– Your App Team</p>
    </div>
  `;

  console.log("📩 Sending email to:", toEmail);
  console.log("👉 EMAIL_USER:", process.env.EMAIL_USER);
  console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "MISSING");
console.log("Sending invoice to:", toEmail);

//   await transporter.sendMail({
//     from: `"Your App" <${process.env.EMAIL_USER}>`,
//     to: toEmail,
//     subject,
//     html,
//   });
// 

console.log("🔐 Using credentials:", {
  user: process.env.EMAIL_USER,
  passLength: process.env.EMAIL_PASS?.length,
});


try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject,
    html,
    });
    console.log("✅ Email sent successfully");
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw error;
  }
};
export default sendInvoiceEmail;
