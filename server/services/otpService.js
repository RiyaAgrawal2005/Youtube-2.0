
import nodemailer from "nodemailer";
import twilio from "twilio";

// Temporary in-memory store for OTPs
const otpStore = new Map(); // { identifier -> { otp, expires } }
const EXP_MS = 5 * 60 * 1000; // 5 minutes expiration

// South Indian states for deciding OTP channel
const southStates = new Set([
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
]);

// Normalize mobile numbers
const normalizeMobile = (mobile) =>
  mobile.startsWith("+") ? mobile : `+91${mobile}`;

// Normalize email
const normalizeEmail = (email) => email?.trim().toLowerCase() || null;

// Generate and store OTP
export const generateAndStoreOtp = (identifier) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(identifier, { otp, expires: Date.now() + EXP_MS });
  return otp;
};

// Verify OTP
export const verifyOtp = (identifier, candidateOtp) => {
  const rec = otpStore.get(identifier);
  if (!rec) return false;
  if (Date.now() > rec.expires) {
    otpStore.delete(identifier);
    return false;
  }
  if (rec.otp !== candidateOtp) return false;
  otpStore.delete(identifier); // clear on success
  return true;
};

// Send OTP via Email
export const sendEmailOtp = async (email, otp) => {
  const normalizedEmail = normalizeEmail(email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"YouTube 2.0" <${process.env.EMAIL_USER}>`,
    to: normalizedEmail,
    subject: "Your login OTP",
    text: `Your OTP is ${otp}`,
  });

  return normalizedEmail;
};

// Send OTP via SMS
export const sendSmsOtp = async (mobile, otp) => {
  if (!mobile) throw new Error("Mobile number missing");
  if (
    !process.env.TWILIO_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_PHONE
  ) {
    throw new Error("Twilio not configured");
  }

  const normalizedMobile = normalizeMobile(mobile);
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  await client.messages.create({
    body: `Your OTP is ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: normalizedMobile,
  });

  return normalizedMobile;
};


// Decide OTP method automatically based on state
export const decideOtpMethod = (state) =>
  southStates.has(state) ? "email" : "mobile";
