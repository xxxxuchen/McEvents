const User = require("../models/User.js");
const bcrypt = require("bcryptjs");
const CustomError = require("../utils/customError.js");

const signup = async (req, res, next) => {
  try {
    const { password } = req.body;
    // hash password before saving user to db
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ ...req.body, password: hashedPassword });
    const token = user.createJWT();
    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new CustomError("Please provide email and password", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError("User not found", 404));
    }
    const isCorrect = await user.verifyPassword(password);
    if (!isCorrect) {
      return next(new CustomError("Wrong Password", 401));
    }
    const token = user.createJWT();
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        pfpLink: user.pfpLink,
        token: token,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = {
  signup,
  login,
};
