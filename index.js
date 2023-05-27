require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const videos = require("./routes/videos.js");
const PORT = process.env.PORT || 8000;

app.set("trust proxy", 1);
app.use(cors());
// Enable CORS for specific origins
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.json());

//IMPORT ROUTES
app.use("/videos", videos);
//START A SERVER
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
