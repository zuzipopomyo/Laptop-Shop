const Laptop = require('../models/Laptop');

//Get all laptops
const getAllLaptops = async (req, res) => {
  try {
    const laptops = await Laptop.find();
    res.json(laptops);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving laptops', error: error.message });
  }
};

//Get single laptop
const getLaptopById = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);
    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    res.json(laptop);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving laptop', error: error.message });
  }
};

// Create a laptop
const addLaptop = async (req, res) => {
  try {
    const { brand, model, price, description } = req.body;

    // Check if images were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'At least one image is required' });
    }

    // Extract URLs from Cloudinary
    const images = req.files.map(file => file.path);

    const newLaptop = new Laptop({
      brand,
      model,
      price,
      description,
      images
    });

    const savedLaptop = await newLaptop.save();
    res.status(201).json(savedLaptop);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating laptop', error: error.message });
  }
};

// @desc Update a laptop
const updateLaptop = async (req, res) => {
  try {
    const { brand, model, price, description } = req.body;
    let laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    // Prepare update data
    const updateData = { brand, model, price, description };

    // If new images were uploaded, append or replace them (here we replace for simplicity)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      updateData.images = newImages; // Replace existing images. Note: you might want to also delete old images from Cloudinary in a real app.
    }

    laptop = await Laptop.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json(laptop);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating laptop', error: error.message });
  }
};

//Delete a laptop
const deleteLaptop = async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    await Laptop.findByIdAndDelete(req.params.id);
    
    // Note: Ideally, we should also delete the associated images from Cloudinary here
    // using cloudinary.uploader.destroy(public_id)

    res.json({ message: 'Laptop removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting laptop', error: error.message });
  }
};

module.exports = {
  getAllLaptops,
  getLaptopById,
  addLaptop,
  updateLaptop,
  deleteLaptop
};
