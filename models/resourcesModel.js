const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mini_Project");

const resourceSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

const Resources = mongoose.model("Resource", resourceSchema);

module.exports = Resources;
