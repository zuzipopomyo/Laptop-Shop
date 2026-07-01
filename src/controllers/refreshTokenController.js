const User = require("../models/User");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ message: "No refresh token provided" });
  
  const refreshToken = cookies.jwt;
  
  // Clear the cookie before setting a new one
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  try {
    // Find user by refresh token
    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse / theft
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key_123456",
        async (err, decoded) => {
          if (err) return; // Invalid token anyway
          // If valid but not in DB, someone reused a deleted/stolen token
          // Find the user and clear all their active refresh tokens
          const hackedUser = await User.findById(decoded.id).exec();
          if (hackedUser) {
            hackedUser.refreshToken = [];
            await hackedUser.save();
          }
        }
      );
      return res.status(403).json({ message: "Forbidden" });
    }

    // Filter out the current refresh token from DB
    const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);

    // Verify token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key_123456",
      async (err, decoded) => {
        if (err) {
          // Token expired - update DB
          foundUser.refreshToken = [...newRefreshTokenArray];
          await foundUser.save();
          return res.status(403).json({ message: "Forbidden / Expired Token" });
        }

        if (foundUser._id.toString() !== decoded.id) {
          return res.status(403).json({ message: "Forbidden" });
        }

        // Token is valid; generate new tokens
        const roles = Object.values(foundUser.roles).filter(Boolean);
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

        const newRefreshToken = jwt.sign(
          { id: foundUser._id, name: foundUser.name },
          process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key_123456",
          { expiresIn: "7d" }
        );

        // Save rotated refresh token in database
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await foundUser.save();

        // Send rotated refresh token in secure cookie
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
        });

        res.json({
          accessToken,
          name: foundUser.name,
          email: foundUser.email,
          roles,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleRefreshToken };
