const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middleware/verifyJWT");

const app = express();

// Cross Origin Resource Sharing
app.use(cors({
  origin: true, // or specific frontend URLs
  credentials: true
}));

// Built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Route handlers
app.use("/api/register", require("./routes/api/register"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/refresh", require("./routes/api/refresh"));
app.use("/api/logout", require("./routes/api/logout"));
app.use("/api/laptops", require("./routes/api/laptops"));

// A simple protected test route
app.get("/api/test-protected", verifyJWT, (req, res) => {
  res.json({
    message: "Access granted to protected route!",
    user: {
      id: req.userId,
      name: req.userName,
      email: req.userEmail,
      roles: req.userRoles
    }
  });
});

// Default root response
app.get("/", (req, res) => {
  res.send("Laptop Shop API is running");
});

module.exports = app;
