const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    trim: true
  },
  model: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String, // URLs from Cloudinary
    required: true
  }]
}, { timestamps: true });

// Check if the model already exists to prevent OverwriteModelError (useful during dev with nodemon)
const Laptop = mongoose.models.Laptop || mongoose.model('Laptop', laptopSchema);

module.exports = Laptop;
