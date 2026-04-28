const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected MongoDB");
  } catch (err) {
    console.log("DB error", err);
    process.exit(1);
  }
};

module.exports = connectDB;