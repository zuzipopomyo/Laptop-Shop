const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const { validateLogin } = require("../../validations/authValidation");

router.post("/", validateLogin, authController.handleLogin);

module.exports = router;
