const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const translationsSchema = mongoose.Schema({
  english: {
    placeholder_mail: { type: String, required: true },
    placeholder_content: { type: String, required: true },
    content: { type: String, required: true },
    button: { type: String, required: true },
    error_mail: { type: String, required: true },
    error_content: { type: String, required: true },
    succes: { type: String, required: true },
    recommendation: { type: String, required: true },
    cv: { type: String, required: true },
    cv_id: { type: String, required: true },
  },
  french: {
    placeholder_mail: { type: String, required: true },
    placeholder_content: { type: String, required: true },
    content: { type: String, required: true },
    button: { type: String, required: true },
    error_mail: { type: String, required: true },
    error_content: { type: String, required: true },
    succes: { type: String, required: true },
    recommendation: { type: String, required: true },
    cv: { type: String, required: true },
    cv_id: { type: String, required: true },
  },
});

translationsSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Translations", translationsSchema);
