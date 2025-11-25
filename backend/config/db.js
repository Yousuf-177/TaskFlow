const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,{});
    console.log("MongoDB connected Successfully\n\n", process.env.MONGO_URI);
  } catch (error) {
    console.error("Error during DB connection",error);
    process.exit(1)
  }
};
module.exports = connectDB;
