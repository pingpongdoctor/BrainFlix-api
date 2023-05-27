const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require("uuid");
const multer = require("multer");
const path = require("path");

//USE MULTER LIBRARY TO STORE THE UPLOADED IMAGE AND CREATE A NAME FOR THE IMAGE
const destinationFolder = path.join(
  process.cwd(),
  "upload-file",
  "upload-image"
);
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, destinationFolder);
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });
const file = path.join(process.cwd(), "data", "videos.json");

//ROUTE FOR THE VIDEOLIST
router
  .route("/")
  .get((req, res) => {
    try {
      const data = fs.readFileSync(file, "utf-8");
      const videoData = JSON.parse(data).map((video) => {
        const imageName = video.image;

        if (!imageName.includes("Upload-video-preview")) {
          imageFile = `/images/${imageName}`;
        } else {
          imageFile = `/upload-image/${imageName}`;
        }

        return {
          id: video.id,
          title: video.title,
          channel: video.channel,
          image: path.dirname(imageFile),
        };
      });
      res.json(videoData);
    } catch (error) {
      res.status(500).json({ message: { error } });
    }
  })

  //ROUTE FOR POSTING A NEW VIDEO FROM THE UPLOAD PAGE
  .post(upload.single("image"), (req, res) => {
    const data = fs.readFileSync(file, "utf-8");
    let videoData = JSON.parse(data);
    const { title, description } = req.body;
    const imagePath = req.file.path;
    console.log(imagePath);
    if (req.body && title && description && imagePath) {
      const updatedVideo = {
        id: uuid(),
        title,
        description,
        channel: "Red Cow",
        image: imagePath.replace("upload-file", ""),
        views: "1",
        likes: "1",
        duration: "5:00",
        video: "https://project-2-api.herokuapp.com/stream",
        timestamp: Date.now(),
        comments: [],
      };
      // const newVideoData = [...videoData, updatedVideo];
      // fs.writeFileSync(file, JSON.stringify(newVideoData));
      // res.status(201).send("video updated");
    } else {
      res
        .status(400)
        .send("Make sure you update the right video object structure");
    }
  });

//ROUTE FOR THE MAIN VIDEO
router.get("/:videoId", (req, res) => {
  try {
    const data = fs.readFileSync(file, "utf-8");
    let videoData = JSON.parse(data);
    const foundVideo = videoData.find(
      (video) => video.id === req.params.videoId
    );
    const imageName = foundVideo.image;

    if (!imageName.includes("Upload-video-preview")) {
      imageFile = `/images/${imageName}`;
      foundVideo.image = imageFile;
    } else {
      imageFile = `/upload-image/${imageName}`;
      foundVideo.image = imageFile;
    }
    console.log(foundVideo);
    res.json(foundVideo);
  } catch (error) {
    res.status(500).send("Sorry! Something is happening with the server");
  }
});

//ROUTE FOR POSTING COMMENTS
router.post("/:videoId/comments", (req, res) => {
  const data = fs.readFileSync(file, "utf-8");
  let videoData = JSON.parse(data);
  const { name, comment } = req.body;
  if (req.body && name && comment) {
    const newComment = {
      id: uuid(),
      name,
      comment,
      likes: 0,
      timestamp: Date.now(),
    };
    for (let i = 0; i < videoData.length; i++) {
      if (videoData[i].id === req.params.videoId) {
        videoData[i].comments.push(newComment);
      }
    }
    fs.writeFileSync(file, JSON.stringify(videoData));
    res.status(201).send("comments updated");
    console.log("running");
  } else {
    res
      .status(400)
      .send("Error! Make sure the comment object has the right structure");
  }
});

//ROUTE FOR DELETING COMMENTS
router.delete("/:videoId/comments/:commentId", (req, res) => {
  try {
    const data = fs.readFileSync(file, "utf-8");
    let videoData = JSON.parse(data);
    console.log("running");
    const newVideoData = videoData.map((video) => {
      if (video.id === req.params.videoId) {
        const newCommentArr = video.comments.filter(
          (comment) => comment.id !== req.params.commentId
        );
        video.comments = newCommentArr;
      }
      return video;
    });
    fs.writeFileSync(file, JSON.stringify(newVideoData));
    res.status(200).send("comment deleted");
  } catch (error) {
    res.status(500).send("Problem comes from the server");
  }
});

//ROUTE FOR ADDING LIKES FOR VIDEOS
router.put("/:videoId/likes", (req, res) => {
  try {
    const data = fs.readFileSync(file, "utf-8");
    let videoData = JSON.parse(data);
    const newVideoData = videoData.map((video) => {
      if (video.id === req.params.videoId) {
        newVideoLike = video.likes
          .split("")
          .filter((letter) => letter !== ",")
          .join("");
        video.likes = (Number(newVideoLike) + 1).toLocaleString("en");
      }
      return video;
    });
    fs.writeFileSync(file, JSON.stringify(newVideoData));
    res.status(200).send("like added");
  } catch (error) {
    res.status(500).send("Problem comes from the server");
  }
});

module.exports = router;
