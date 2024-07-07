const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mini_Project");

const adminSchema = new mongoose.Schema({
  adminID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
