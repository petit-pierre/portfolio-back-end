const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const likesSchema = mongoose.Schema({
  title: { type: String },
  likes: { type: Number, required: true },
});

likesSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Likes", likesSchema);
