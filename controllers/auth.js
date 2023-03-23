const UserModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const bcrypt = require("bcryptjs");

// REGISTER
const register = async (req, res) => {
  // create user in db with model
  const user = await UserModel.create({ ...req.body });
  // create token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  // send back to front-end user object with name and token
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
};

// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  // check for email and password to not be empty
  if (!email || !password) {
    throw new BadRequestError("Please Provide email and password");
  }
  // find user
  const user = await UserModel.findOne({ email });
  // if user doesnt exists throw error
  if (!user) {
    throw new UnauthenticatedError("User doesnt exist");
  }
  // compare password
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  // if password matches create token and send back response, if not throw error
  if (!isPasswordMatch) {
    throw new UnauthenticatedError("Password doesnt match");
  }
  // create token
  const token = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
  // send back user
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = { login, register };
