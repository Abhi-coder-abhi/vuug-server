const jwt = require('jsonwebtoken');
const userModel = require("../models/user-model")

const secretKey = 'This_is_metaverse_token';

const generateToken = async (payload) => {

  const token = jwt.sign(payload, secretKey,);
  return token;
}

const decodeToken = (token, cb) => jwt.verify(token, secretKey, cb);

const Authenticated = async (req, res, next) => {
  let token = req.headers.Authorization || req.headers.authorization;
  if (!token || !String(token).startsWith("Bearer")) {
    return res.unauth();
  }
  token = token.split(" ")[1];

  try {
    const decoded = await jwt.verify(token, secretKey);
    if (!decoded) return res.unauth("JWT error");
    if (decoded && decoded.id && decoded.id.role && (decoded.id.role == "admin" || decoded.id.role == "sub-admin")) {
      req.userDetails = decoded.id;
      next();
      return;
    }
    const userDetails = await userModel.findById({ _id: decoded.id });
    if (!userDetails) {
      return res.status(400).json({
        message: "Malformed jwt token"
      });
    }

    req.user = userDetails;
    req.userDetails = userDetails;
    next();
  } catch (error) {
    res.unauth(error.message);
  }
};

const PassAuthenticated = (req, res, next) => {
  let token = req.headers.Authorization || req.headers.authorization;
  if (!token || !String(token).startsWith("Bearer")) {
    return res.unauth();
  }
  token = token.split(" ")[1];
  /**get decode */
  jwt.verify(token, secretKey, (error, decoded) => {
    if (error || !decoded) return res.unauth(error.message);
    /** get user and set req.user */
    userModel.findById(decoded.id, (err, user) => {
      if (err) return res.unauth(err.message);
      if (!user) return res.unauth();
      req.user = user;
      next();
    });
  });
};

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validate(req);
      next();
    } catch (error) {
      res.validationFailed(error.message);
    }
  };
};

// Exporting the functions
module.exports = {
  generateToken,
  decodeToken,
  Authenticated,
  PassAuthenticated,
  validate
};
