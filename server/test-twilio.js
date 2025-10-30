// test-twilio.js
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config(); // Load your .env file

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE;
const toNumber = "+918171952328"; // 👈 replace with your verified number

const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: "Test message from YouTube 2.0 🚀",
    from: fromNumber,
    to: toNumber,
  })
  .then(message => console.log("✅ Message sent successfully:", message.sid))
  .catch(error => console.error("❌ Error sending message:", error.message));
