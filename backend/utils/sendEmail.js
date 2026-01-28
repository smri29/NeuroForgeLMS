const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create Transporter (The Postman)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'SendGrid', 'Mailgun', etc.
    auth: {
      user: process.env.EMAIL_USERNAME, // We will add this to .env
      pass: process.env.EMAIL_PASSWORD, // We will add this to .env
    },
  });

  // 2. Define Email Options
  const mailOptions = {
    from: `"PyForge Support" <${process.env.EMAIL_USERNAME}>`,
    to: options.email,
    subject: options.subject,
    html: options.message, // We will use HTML for nice formatting
  };

  // 3. Send Email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;