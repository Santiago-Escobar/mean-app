const express = require("express");
const multer = require("multer");
const Post = require("../models/post");
const router = express.Router();
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
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
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
//
var upload = multer({storage: storageConf});
router.post("", upload.single('image'), function(req, res, next) {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: "post send succesfully!",
      post: {
        ...createdPost,
        id:  createdPost._id

      }
    });
  });
});

router.put("/:id", upload.single('image'), function(req, res, next) {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    console.log(result);
    res.status(200).json({ message: "updated" });
  });
});
// rwdavid // ycf9jAk57srl6cm0
router.get("", function(req, res, next) {
  Post.find().then(posts => {
    res.status(200).json({
      message: "Post fetched succesfully",
      posts: posts
    });
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
  });
});

router.delete("/:id", function(req, res, next) {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(req.params.id);
    res.status(200).json({
      message: "Post deleted succesfully"
    });
  });
});

module.exports = router;
