const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    holdingDate: { type: Date, required: true },
    organization: {
      type: String,
      enum: ["personal", "club", "department"],
      required: true,
    },
    venue: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The creator of the event
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
