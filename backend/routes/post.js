const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const checkAuth = require("../middleware/check-auth");
const router = express.Router();
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const storageConf = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    var error = new Error("Invalid MIME type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});
//
var upload = multer({ storage: storageConf });
router.post("", checkAuth, upload.single("image"), function(req, res, next) {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    author: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "post send succesfully!",
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch( err => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  });
});

router.put("/:id", checkAuth, upload.single("image"), function(req, res, next) {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    author: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, author: req.userData.userId }, post).then(result => {
    if(result.nModified > 0){
      res.status(200).json({ message: "Updated Successfull" });
    }
    else{
      res.status(401).json({ message: "Not Authorized" });
    }
  })
  .catch( err => {
    res.status(500).json({
      message: "Couldn't update post!"
    })
  });
});
// rwdavid // ycf9jAk57srl6cm0
router.get("", function(req, res, next) {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Post fetched succesfully",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch( err => {
      res.status(500).json({
        message: "Fetching posts failed"
      })
    });
});

router.get("/:id", function(req, res, next) {
  Post.findById(req.params.id).then(post => {
    if (post) {
      //console.log(post);
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: "post not found" });
    }
  })
  .catch( err => {
    res.status(500).json({
      message: "Fetching post failed"
    })
  });
});

router.delete("/:id", checkAuth, function(req, res, next) {
  Post.deleteOne({ _id: req.params.id, author: req.userData.userId }).then(result => {
    //console.log(req.params.id);
    if(result.n > 0){
      res.status(200).json({ message: "Deleted" });
    }
    else{
      res.status(401).json({ message: "Not Authorized" });
    }
  })
  .catch( err => {
    res.status(500).json({
      message: "Couldn't delete post"
    })
  });
});

module.exports = router;
