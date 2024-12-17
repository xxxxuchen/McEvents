const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    // foreign key
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // foreign key
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    participationName: { type: String, required: true },
    faculty: { type: String, required: true },
    major: { type: String, required: true },
    phone: { type: String, required: true },
    McGillID: { type: String, required: true },
    comment: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);
