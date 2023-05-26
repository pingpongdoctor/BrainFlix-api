require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const videos = require("./routes/videos.js");
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.static("public"));
app.use(express.static("upload-file"));
app.use(express.static("data"));

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
