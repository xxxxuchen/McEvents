const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    match: [
      /^[a-zA-Z0-9._%+-]+@(mail\.mcgill\.ca|mcgill\.ca)$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 4,
  },
  publishedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  pfpLink: {
    type: String,
  },
});

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

UserSchema.methods.verifyPassword = async function (receivedPassword) {
  return await bcrypt.compare(receivedPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
