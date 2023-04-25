/** @format */

const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    tx_ref: {
      type: String,
    },
    amount: {
      // storing the google id for first time users and storing it for second time user
      type: String,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    booking: {
      type: String
    },
    transaction_id: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
