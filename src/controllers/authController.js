const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.status(401).json({ message: "Invalid email or password" });

    // Evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password" });

    // Grab non-empty roles
    const roles = Object.values(foundUser.roles).filter(Boolean);

    // Create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
          name: foundUser.name,
          email: foundUser.email,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET || "access_secret_key_123456",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { id: foundUser._id, name: foundUser.name },
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key_123456",
      { expiresIn: "7d" }
    );

    // Save refresh token with current user (supporting multiple devices)
    foundUser.refreshToken = foundUser.refreshToken || [];
    foundUser.refreshToken.push(refreshToken);
    await foundUser.save();

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
    });

    // Send access token
    res.json({
      accessToken,
      name: foundUser.name,
      email: foundUser.email,
      roles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogin };
