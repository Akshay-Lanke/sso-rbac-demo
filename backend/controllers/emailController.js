const transporter = require('../utils/mailer');

exports.sendEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const info = await transporter.sendMail({
      from: '"SSO App" <no-reply@example.com>',
      to: email,
      subject: "Hello from Okta SSO App",
      text: "This is a test email sent from the backend after SSO login."
    });

    res.json({ message: "Email sent!", previewUrl: require('nodemailer').getTestMessageUrl(info) });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
};
