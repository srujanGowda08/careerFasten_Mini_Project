const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/mini_Project");

const upcomingSchema = new mongoose.Schema(
  {
    jobTitle: {
      type: String,
      required: [true, "Title is required"],
    },
    companyName: {
      type: String,
      required: [true, "Company Name is required"],
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

const Upcoming = mongoose.model("Upcoming", upcomingSchema);

module.exports = Upcoming;
