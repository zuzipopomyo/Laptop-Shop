const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access token required" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || "access_secret_key_123456",
    (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid or expired token" });
      
      req.userId = decoded.UserInfo.id;
      req.userName = decoded.UserInfo.name;
      req.userEmail = decoded.UserInfo.email;
      req.userRoles = decoded.UserInfo.roles;
      next();
    }
  );
};

module.exports = verifyJWT;
