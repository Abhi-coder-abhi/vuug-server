const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true,
  auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD
  },
});


async function mailOTP(email, OTP) {
  console.log(process.env.MAIL_FROM)
  const mailOptions = {
    from: process.env.MAIL_FROM, // replace with your email
    to: email,
    subject: 'OTP for Verification in VYUZ-Metaverse',
    text: `Your OTP for verification of your email is: ${OTP}`,
  };

  console.log(email, OTP);
  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(info);
    return  info.response;
  } catch (error) {
    console.error('Error sending email:', error);
    return 'Error sending email: ' + error.message;
  }
}

module.exports = { mailOTP };

{/* async function mailVerify(email) {
    // Your nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'CoinCred', // replace with your email
        pass: 'byrypgdlrpkamziw',  // replace with your email password or an app-specific password
      },  
    });
    const verificationURL = `http://localhost:8080/verify?email=${email}`;
    const mailOptions = {
      from: 'alifaizan.kgn9654@gmail.com', // replace with your email
      to: email,
      subject: 'OTP for Verification in VYUZ-Metaverse',
  
  };
  
    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      return("majjj");
    } catch (error) {
      return('Error sending email:', error);
      // Handle the error as needed (e.g., return an error response)
    }
  }*/}
module.exports = { mailOTP }