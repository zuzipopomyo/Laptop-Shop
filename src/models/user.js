const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Admin: Number,
    Editor: Number,
  },
  refreshToken: [String],
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
