require("dotenv").config();
const express = require("express");

const mongoose = require('mongoose');
const connectDB = require('./config/db')

connectDB();
const PORT = process.env.PORT;
const app = express();


mongoose.connection.once('open',()=>{
     console.log('Connected to MongoDB')});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
