const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('mongodb connected successfully');
    } catch (error) {
      console.log(error);
    }
  }


  module.exports = connectDB;