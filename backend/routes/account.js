const express = require("express");
const Account = require("../models/Account");
const auth = require("../middleware/auth");

const router = express.Router();


// CREATE ACCOUNT
router.post("/", auth, async (req, res) => {
  try {
    const accountNumber =
      "10" + Math.floor(10000000 + Math.random() * 90000000);

    const account = await Account.create({
      userId: req.user.userId,
      accountNumber,
      accountType: "Savings",
      balance: 0
    });

    res.status(201).json({
      message: "Bank account created",
      account
    });

  } catch (error) {
    res.status(500).json({
      message: "Account creation failed",
      error: error.message
    });
  }
});


// GET MY ACCOUNT
router.get("/", auth, async (req, res) => {
  try {
    const accounts = await Account.find({
      userId: req.user.userId
    });

    res.json(accounts);

  } catch (error) {
    res.status(500).json({
      message: "Could not fetch accounts"
    });
  }
});

module.exports = router;