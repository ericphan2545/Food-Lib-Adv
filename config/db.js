const mongoose = require("mongoose");

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/food_lib";

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

module.exports = mongoose;
