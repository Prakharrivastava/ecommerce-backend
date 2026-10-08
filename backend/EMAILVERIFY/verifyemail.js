import nodemailer from 'nodemailer';
import 'dotenv/config';

// Create transporter instance outside the function to reuse connections
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Google App Password
  },
});

export const verifyemail = async (token, email) => {
  try {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const verificationLink = `${clientUrl}/verify/${token}`;

    const mailConfigurations = {
      from: process.env.MAIL_USER,
      to: email,
      subject: 'Verify Your Email Address',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Verify Your Email</h2>
          <p>Hi there,</p>
          <p>Thank you for registering! Please click the button below to verify your email address:</p>
          <a href="${verificationLink}" 
             style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; border-radius: 5px; margin: 15px 0;">
            Verify Email
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p><a href="${verificationLink}">${verificationLink}</a></p>
          <p>This link will expire in 10 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailConfigurations);
    console.log('Verification email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    throw new Error('Failed to send verification email');
  }
};