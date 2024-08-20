const mongoose = require("mongoose");

// Schema
const historySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Ensure user field is required
    },
    prompt: {
      type: String,
      required: true, // Ensure prompt field is required
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compile to form the model
const ContentHistory = mongoose.model("ContentHistory", historySchema);

module.exports = ContentHistory;
