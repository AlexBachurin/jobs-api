const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }
  //extract token from header string 'Bearer token'
  const token = authHeader.split(" ")[1];
  try {
    // decode jwt token to extract username and id
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, name } = payload;
    req.user = { userId, name };
    // pass to next to job routes
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
