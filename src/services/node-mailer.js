const nodemailer = require('nodemailer');
async function mailOTP(email, OTP) {
    // Your nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'tiwariabhi1406@gmail.com', // replace with your email
        pass: 'nvkkwwhioxrvkbzu',  // replace with your email password or an app-specific password
      },
    });
    const mailOptions = {
      from: 'tiwariabhi1406@gmail.com', // replace with your email
      to: email,
      subject: 'OTP for Verification in VYUZ-Metaverse',
      text: `Your OTP for verification of your email is: ${OTP}`,
  };
  
    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      return('Email sent: ' + info.response);
    } catch (error) {
      return('Error sending email:', error);
      // Handle the error as needed (e.g., return an error response)
    }
  }
  async function mailVerify(email) {
    // Your nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'tiwariabhi1406@gmail.com', // replace with your email
        pass: 'nvkkwwhioxrvkbzu',  // replace with your email password or an app-specific password
      },
    });
    const verificationURL = `http://localhost:8080/verify?email=${email}`;
    const mailOptions = {
      from: 'tiwariabhi1406@gmail.com', // replace with your email
      to: email,
      subject: 'OTP for Verification in VYUZ-Metaverse',
      html: `<button><a href="YOUR_VERIFICATION_URL">Verify Email</a></button>`
  };
  
    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      return('Email sent: ' + info.response);
    } catch (error) {
      return('Error sending email:', error);
      // Handle the error as needed (e.g., return an error response)
    }
  }
  module.exports = {mailOTP,mailVerify}