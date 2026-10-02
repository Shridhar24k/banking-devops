const express = require("express");

const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const auth = require("../middleware/auth");

const router = express.Router();


// DEPOSIT
router.post("/deposit", auth, async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0"
      });
    }

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user.userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    account.balance += Number(amount);

    await account.save();

    await Transaction.create({
      accountId: account._id,
      type: "DEPOSIT",
      amount,
      description: "Money deposited"
    });

    res.json({
      message: "Deposit successful",
      balance: account.balance
    });

  } catch (error) {
    res.status(500).json({
      message: "Deposit failed",
      error: error.message
    });
  }
});


// WITHDRAW
router.post("/withdraw", auth, async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be greater than 0"
      });
    }

    const account = await Account.findOne({
      _id: accountId,
      userId: req.user.userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    if (account.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance"
      });
    }

    account.balance -= Number(amount);

    await account.save();

    await Transaction.create({
      accountId: account._id,
      type: "WITHDRAW",
      amount,
      description: "Money withdrawn"
    });

    res.json({
      message: "Withdrawal successful",
      balance: account.balance
    });

  } catch (error) {
    res.status(500).json({
      message: "Withdrawal failed",
      error: error.message
    });
  }
});


// TRANSACTION HISTORY
router.get("/:accountId", auth, async (req, res) => {
  try {
    const account = await Account.findOne({
      _id: req.params.accountId,
      userId: req.user.userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    const transactions = await Transaction.find({
      accountId: account._id
    }).sort({
      createdAt: -1
    });

    res.json(transactions);

  } catch (error) {
    res.status(500).json({
      message: "Could not fetch transactions"
    });
  }
});

module.exports = router;