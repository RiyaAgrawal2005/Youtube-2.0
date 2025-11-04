

import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { planName, price, time, razorpay_payment_id, userEmail } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER!,
    to: userEmail,
    subject: `Invoice for ${planName} Plan`,
    text: `Thank you for purchasing the ${planName} plan.

Payment ID: ${razorpay_payment_id}
Amount: ₹${price}
Access Time: ${time === Infinity ? 'Unlimited' : time + ' minutes'}

Enjoy your upgraded experience! 🎉`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Invoice sent' });
  } catch (error) {
    console.error('Email Error:', error);
    res.status(500).json({ error: 'Email failed to send' });
  }
}
