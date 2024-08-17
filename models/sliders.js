const mongoose = require("mongoose");

const slidersSchema = mongoose.Schema({
  picture: { type: String, required: true },
  picture_id: { type: String, required: true },
  alt: { type: String, required: true },
  french_content: { type: String, required: true },
  english_content: { type: String, required: true },
});

module.exports = mongoose.model("Sliders", slidersSchema);
