import nodemailer from "nodemailer";

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "0103riyaagrawal@gmail.com",        // Your Gmail
      pass: "iyycrhxhyrudrkwa",                  // Your Gmail app password (no spaces)
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Riya Agrawal" <0103riyaagrawal@gmail.com>', // sender address
      to: "1234riyaagrawal@gmail.com",                      // change to your recipient email
      subject: "Test Email from Nodemailer",
      text: "Hello! This is a test email to verify SMTP setup.",
    });

    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

testEmail();
