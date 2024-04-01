const jwt = require('jsonwebtoken');

function generateToken(payload) {
    // Replace 'YOUR_SECRET_KEY' with your actual secret key for signing the token
    const secretKey = 'This_is_metaverse_token';

    // Replace the 'expiresIn' value with your desired token expiration time
    const expiresIn = '1h'; // Token expires in 1 hour

    // Generate the JWT token
    const token = jwt.sign(payload, secretKey, { expiresIn });

    return token;
}
module.exports = generateToken