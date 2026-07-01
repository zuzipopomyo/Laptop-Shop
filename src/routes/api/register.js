const express = require("express");
const router = express.Router();
const registerController = require("../../controllers/registerController");
const { validateRegister } = require("../../validations/authValidation");

router.post("/", validateRegister, registerController.handleNewUser);

module.exports = router;