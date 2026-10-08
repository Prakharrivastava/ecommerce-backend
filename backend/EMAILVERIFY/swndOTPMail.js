import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create transporter instance outside the function so it gets reused across calls
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // App Password generated from Google Account
  },
});

export const sendOPTMail = async (otp, email) => {
  try {
    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      html: `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 10 minutes.</p>`,
    };

    const info = await transporter.sendMail(mailConfigurations);
    console.log('OTP Sent Successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email');
  }
};