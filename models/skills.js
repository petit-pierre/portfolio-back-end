const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const skillsSchema = mongoose.Schema({
  french_title: { type: String, required: true },
  english_title: { type: String, required: true },
  picture_url: { type: String, required: true },
  picture_id: { type: String, required: true },
  likes_id: { type: String, required: true },
});

skillsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Skills", skillsSchema);
