const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true
    },

    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAW", "TRANSFER"],
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      default: "SUCCESS"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);