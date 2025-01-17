const nodemailer = require('nodemailer');
const config = require('../utils/config');

getMessage = (verificationLink, user) => ({
    from: 'bloglist.webapp@gmail.com',
    to: user.email,
    subject: '[Bookmarkly] Verify Your Email Address',
    html: `
    <html>
  <body style="font-family: Arial, sans-serif; background-color: #f4f7fb; color: #333; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
      <h1 style="font-size: 24px; color: #4CAF50; margin-bottom: 15px; font-weight: bold;">Hello ${user.username},</h1>
      <p style="font-size: 14px; line-height: 1.5; margin: 10px 0;">Welcome to Bookmarkly (Formerly BlogList)! To get started, please confirm your email address.</p>
      <p style="font-size: 14px; line-height: 1.5; margin: 10px 0;">Simply click the button below to verify your account:</p>
      <a href="${verificationLink}" style="display: inline-block; text-decoration: none; color: #fff; background-color: #4CAF50; padding: 12px 25px; border-radius: 4px; font-size: 16px; font-weight: bold; text-align: center;">Verify Email Address</a>
      <p style="font-size: 14px; line-height: 1.5; margin: 20px 0;">This link will expire in 24 hours.</p>
      <footer style="font-size: 12px; color: #888; text-align: center; line-height: 1.5; margin-top: 20px;">
        <p style="margin: 0;">Have any questions? Contact us at <a href="mailto:bloglist.webapp@gmail.com" style="color: #4CAF50; text-decoration: none; font-weight: bold;">support@bookmarkly.com</a></p>
      </footer>
    </div>
  </body>
</html>
    `,
})

exports.sendVerificationEmail = async (verificationLink, user) => {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.EMAIL,
            pass: config.EMAIL_PASS
        },
    });

    await transporter.sendMail(getMessage(verificationLink, user));
};
