require("dotenv").config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const app = require('./app');

connectDB();
const PORT = process.env.PORT || 5000;

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
