const nodemailer = require('nodemailer');
async function mailOTP(email, OTP) {
  // Your nodemailer transporter setup
  const transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587 || 25 || 465,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'AKIA5SJKLNVWGT4CRRVC', // replace with your email
      pass: 'BJYcpSWXu6fmvgnBXbvPf9aRiM/RTlk0wAJeAkCk4sKM',  // replace with your email password or an app-specific password
    },
  });
  const mailOptions = {
    from: 'noreply@vyug.io', // replace with your email
    to: email,
    subject: 'OTP for Verification in VYUZ-Metaverse',
    text: `Your OTP for verification of your email is: ${OTP}`,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    return ('Email abhi: ' + info.response);
  } catch (error) {
    console.log(error)
    return ('Error sending email:', error);
    // Handle the error as needed (e.g., return an error response)
  }
}
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