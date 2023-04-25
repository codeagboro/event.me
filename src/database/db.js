const mongoose = require("mongoose");
require("colors");

mongoose.set('strictQuery', true);
const connectDB = async () => {
  try {
      await mongoose.connect("mongodb://127.0.0.1:27017/eventdb", () => {
        console.log("Database Connected".green.underline);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
