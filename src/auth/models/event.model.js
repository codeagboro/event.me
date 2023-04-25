/** @format */

const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    location: {
      type: String,
    },
    ticketAmount: {
      type: Number,
    },
    image: {
      type: String,
    },
    eventSerial: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;
