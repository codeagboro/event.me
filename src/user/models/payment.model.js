/** @format */

const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema(
  {
    tx_ref: {
      type: String,
    },
    amount: {
      type: String,
    },
    currency: {
      type: String,
      default: "NGN",
    },
    status: {
      type: String,
    },
    payment: {
      type: String,
    },
    email: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
