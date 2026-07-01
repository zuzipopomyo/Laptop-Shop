const bcrypt = require("bcrypt");
const user = require("../models/User");

const handleNewUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check for duplicate email in DB
    const duplicate = await user.findOne({ email }).exec();
    if (duplicate) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and store the new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: `User ${newUser.name} created successfully!` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleNewUser };
