require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const videos = require("./routes/videos.js");
const PORT = process.env.PORT || 8000;

app.use(cors());
// Enable CORS for specific origins
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://brainflix-platform.netlify.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(express.json());
app.set("trust proxy", 1);

//IMPORT ROUTES
app.use("/videos", videos);
app.use("/:videoId/likes", videos);
app.use("/videos/:videoId", videos);
app.use("/videos/:videoId/comments", videos);
app.use("/videos/:videoId/comments/:commentId", videos);
//START A SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
