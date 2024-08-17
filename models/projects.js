const mongoose = require("mongoose");

const projectsSchema = mongoose.Schema({
  french_title: { type: String, required: true },
  english_title: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: String, required: true },
  tools: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  english_description: { type: String, required: true },
  french_description: { type: String, required: true },
  french_resum: { type: String, required: true },
  english_resum: { type: String, required: true },

  links: [
    {
      url: { type: String, required: true },
      category: { type: String, required: true },
    },
  ],
  sliders: [
    {
      picture: { type: String, required: true },
      picture_id: { type: String, required: true },
      alt: { type: String, required: true },
      french_content: { type: String, required: true },
      english_content: { type: String, required: true },
    },
  ],
  skills: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
    },
  ],
  likes_id: { type: String, required: true },
  slider_likes_id: { type: String, required: true },
  content_likes_id: { type: String, required: true },
});

module.exports = mongoose.model("Projects", projectsSchema);
