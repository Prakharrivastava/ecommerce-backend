import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL, // Aapka Gmail ID
      pass: process.env.SMTP_PASSWORD, // Gmail App Password (NOT regular password)
    },
  });

  const mailOptions = {
    from: `"Shalini Enterprises" <${process.env.SMTP_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};