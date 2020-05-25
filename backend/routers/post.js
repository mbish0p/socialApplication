const express = require("express");
const Post = require("./../models/posts");
const auth = require("./../middleware/auth");
const multer = require("multer");
const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});
const router = express.Router();

router.post("/post", auth, upload.single("image"), async (req, res) => {
  let img;
  if (req.file) {
    img = req.file.buffer;
  }
  const post = new Post({
    ...req.body,
    owner: req.user._id,
    img,
  });
  await post.save();
  res.status(201).send(post);
});

router.post("/post/like/:postID", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID);
    const isAlreadyLiked = post.positiveRates.find((id) => {
      console.log(id);
      console.log(req.user._id);
      return id === req.user._id;
    });

    console.log(isAlreadyLiked);

    if (!isAlreadyLiked) {
      post.positiveRates = post.positiveRates.concat(req.user._id);
    } else {
      throw new Error("You alredy liked this post");
    }
    await post.save();
    res.send(post);
  } catch (error) {
    console.log(error.toString());
  }
});

router.get("/post/user/:id", async (req, res) => {
  try {
    const posts = await Post.find({ owner: req.params.id });
    res.status(200).send(posts);
  } catch (error) {
    res.send(error);
  }
});

router.get("/post/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post ? res.send(post) : res.send("Post not find");
  } catch (error) {
    res.send(error);
  }
});

router.get("/posts", auth, async (req, res) => {
  try {
    await req.user.populate("posts").execPopulate();
    res.send(req.user.posts);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.patch("/post/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndUpdate(id, {
      content: req.body.content,
    });
    if (post) res.status(201).send(post);
  } catch (error) {
    res.send(e);
  }
});

router.delete("/post/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    res.send(post);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
