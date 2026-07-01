const express = require('express');
const router = express.Router();
const laptopController = require('../../controllers/laptopController');
const verifyJWT = require('../../middleware/verifyJWT');
const { upload } = require('../../config/cloudinary');

// Public routes
router.get('/', laptopController.getAllLaptops);
router.get('/:id', laptopController.getLaptopById);

// Protected routes
router.post('/', verifyJWT, upload.array('images', 5), laptopController.addLaptop); // Max 5 images
router.put('/:id', verifyJWT, upload.array('images', 5), laptopController.updateLaptop);
router.delete('/:id', verifyJWT, laptopController.deleteLaptop);

module.exports = router;
