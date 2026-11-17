const mongoose = require("mongoose");

const chatSessionSchema = new mongoose.Schema(
  {
    visitorEmail: { type: String, default: null },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },
    messages: [
      {
        role: { type: String, enum: ["user", "model"], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    lastInteractionAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ChatSession", chatSessionSchema);
