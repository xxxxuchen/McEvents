const jwt = require("jsonwebtoken");
const CustomError = require("../utils/customError");

const checkAuth = async (req, res, next) => {
  // check authorization header for token
  const tokenHeader = req.headers.authorization;
  if (!tokenHeader || !tokenHeader.startsWith("Bearer")) {
    next(new CustomError("Authentication invalid. User is not logged in", 401));
  }
  const token = tokenHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach user to req object for other routes to use
    req.userID = payload.userId;
    next();
  } catch (error) {
    next(new CustomError("Authentication invalid", 401));
  }
};

module.exports = checkAuth;
