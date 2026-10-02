const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/account");
const transactionRoutes = require("./routes/transaction");

const app = express();


// MIDDLEWARE
app.use(cors());
app.use(express.json());


// HOME
app.get("/", (req, res) => {
  res.json({
    message: "Banking API is running"
  });
});


// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    status: "UP"
  });
});


// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);


// DATABASE
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(process.env.PORT, () => {
      console.log(
        `Server running on http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });