const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const picturesSchema = mongoose.Schema({
  imageUrl: { type: String, required: false, unique: true },
});

picturesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Picture", picturesSchema);
