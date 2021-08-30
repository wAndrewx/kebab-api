const nodemailer = require("nodemailer");

const emailVerifyHash = (hash, email) => {
  let transporter = nodemailer.createTransport({
    // allowed for less secure apps turned on
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PW,
    },
  });
  const verifyLink = `http://localhost:8080/verify/${hash}`;

  var message = {
    from: `Twitter mock app 👽 <${process.env.GMAIL_EMAIL}>`,
    to: email,
    subject: "Verification for WebSocket app",
    text: "Hello please click here to verify",
    html: `<p>Thanks for signing up with us! </p><a href=${verifyLink}>Click here to verify</a>`,
  };

  transporter.sendMail(message, (err) => {
    console.log("EMAIL ERROR:", err);
  });
};

module.exports = { emailVerifyHash };
