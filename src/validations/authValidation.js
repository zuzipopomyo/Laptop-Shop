const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const validateRegister = (req, res, next) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
};
