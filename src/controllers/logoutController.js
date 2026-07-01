const User = require("../models/User");

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); 
  
  const refreshToken = cookies.jwt;

  try {
    // Is refreshToken in DB?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      });
      return res.sendStatus(204);
    }

    // Delete refreshToken from DB
    foundUser.refreshToken = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
    await foundUser.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { handleLogout };
