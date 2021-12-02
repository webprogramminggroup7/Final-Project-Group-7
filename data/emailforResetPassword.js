const nodemailer = require('nodemailer');

const sendEmailForPasswordReset = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    auth: {
      user: process.env.MAILTRAP_USERNAME,
      pass: process.env.MAILTRAP_PASSWORD
    }
  });

  const mailOptionsToSend = {
    from: 'Web Programming Group 7 <webprogramminggroup7@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  await transporter.sendMail(mailOptionsToSend);
};

module.exports = sendEmailForPasswordReset ;