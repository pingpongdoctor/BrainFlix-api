const express = require("express");
const router = express.Router();
const fs = require("fs");
const { v4: uuid } = require("uuid");

//ROUTE FOR VIDEOLIST
router.get("/", (req, res) => {
  const data = fs.readFileSync("./data/videos.json", "utf-8");
  const videoData = JSON.parse(data).map((video) => {
    return {
      id: video.id,
      title: video.title,
      channel: video.channel,
      image: video.image,
    };
  });
  res.json(videoData);
});

//ROUTE FOR THE MAIN VIDEO
router.get("/:videoId", (req, res) => {
  const data = fs.readFileSync("./data/videos.json", "utf-8");
  const videoData = JSON.parse(data);
  const foundVideo = videoData.find((video) => video.id === req.params.videoId);
  res.json(foundVideo);
});

//ROUTE FOR POSTING NEW VIDEO
router.post("/", (req, res) => {
  const data = fs.readFileSync("./data/videos.json", "utf-8");
  const videoData = JSON.parse(data);
  const { title, description } = req.body;
  if (req.body && title && description) {
    const updatedVideo = {
      id: uuid(),
      title,
      description,
      channel: "Red Cow",
      image: "/images/Upload-video-preview.jpg",
      views: "1,000,000",
      likes: 100000,
      duration: "5:00",
      video: "https://project-2-api.herokuapp.com/stream",
      timestamp: Date.now(),
      comments: [],
    };
    const newVideoData = [...videoData, updatedVideo];
    fs.writeFileSync("./data/videos.json", JSON.stringify(newVideoData));
    res.send("video updated");
  } else {
    res.send("Make sure you update the right video object structure");
  }
});

//ROUTE FOR POSTING COMMENTS
router.post("/:videoId/comments", (req, res) => {
  const data = fs.readFileSync("./data/videos.json", "utf-8");
  let videoData = JSON.parse(data);
  const { name, comment } = req.body;
  if (req.body && name && comment) {
    let foundVideo = videoData.find((video) => video.id === req.params.videoId);
    const indexOfFoundVideo = videoData.indexOf(foundVideo);
    const newComment = {
      id: uuid(),
      name,
      comment,
      likes: 0,
      timestamp: Date.now(),
    };
    foundVideo.comments.push(newComment);
    videoData.splice(indexOfFoundVideo, 1, foundVideo);
    fs.writeFileSync("./data/videos.json", JSON.stringify(videoData));
    res.send("comments updated");
  } else {
    res.send("Error! Make sure the comment object has the right structure");
  }
});

//ROUTE FOR DELETING COMMENTS
router.delete("/:videoId/comments/:commentId", (req, res) => {
  const data = fs.readFileSync("./data/videos.json", "utf-8");
  let videoData = JSON.parse(data);
  let foundVideo = videoData.find((video) => video.id === req.params.videoId);
  const indexOfFoundVideo = videoData.indexOf(foundVideo);
  let foundCommentArr = foundVideo.comments;
  foundCommentArr = foundCommentArr.filter(
    (comment) => comment.id !== req.params.commentId
  );
  foundVideo = { ...foundVideo, comments: foundCommentArr };
  videoData.splice(indexOfFoundVideo, 1, foundVideo);
  fs.writeFileSync("./data/videos.json", JSON.stringify(videoData));
  res.send("comments deleted");
});

//ROUTE FOR ADDING LIKE FOR VIDEOS
router.put("/:videoId/likes", (req, res) => {
  const data = fs.readFileSync("./data/videos.json", "utf-8");
  let videoData = JSON.parse(data);
  const foundVideo = videoData.find((video) => video.id === req.params.videoId);
  const indexOfFoundVideo = videoData.indexOf(foundVideo);
  const newLike = Number(foundVideo.likes) + 1;
  const newFoundVideo = { ...foundVideo, likes: newLike };
  videoData.splice(indexOfFoundVideo, 1, newFoundVideo);
  fs.writeFileSync("./data/videos.json", JSON.stringify(videoData));
  res.send("like added");
});
module.exports = router;
