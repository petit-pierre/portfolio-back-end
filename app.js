const express = require("express");
const mongoose = require("mongoose");
const projectsRoutes = require("./routes/projects");
const slidersRoutes = require("./routes/sliders");
const translationsRoutes = require("./routes/translations");
const userRoutes = require("./routes/user");
const skillsRoutes = require("./routes/skills");
const toolsRoutes = require("./routes/tools");
const pictureRoutes = require("./routes/pictures");
const likesRoutes = require("./routes/likes");
const app = express();
const path = require("path");
const code = require("./code.json");

mongoose
  .connect(code.code, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/projects", projectsRoutes);
app.use("/api/sliders", slidersRoutes);
app.use("/api/translations", translationsRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/tools", toolsRoutes);
app.use("/api/pictures", pictureRoutes);
app.use("/api/likes", likesRoutes);
module.exports = app;
