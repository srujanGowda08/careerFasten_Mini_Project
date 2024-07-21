const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    url: {
      type: String,
      required: [true, "URL is required"],
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail URL is required"],
    },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

module.exports = Playlist;
