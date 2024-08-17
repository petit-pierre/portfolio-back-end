const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const toolsSchema = mongoose.Schema({
  title: { type: String, required: true },
  categorie: { type: String, required: true },
  picture_url: { type: String, required: true },
  picture_id: { type: String, required: true },
  likes_id: { type: String, required: true },
});

toolsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Tools", toolsSchema);
