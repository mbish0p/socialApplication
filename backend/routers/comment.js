const express = require("express");
const Post = require("../models/posts");
const auth = require("./../middleware/auth");

const router = express.Router();

router.post("/post/:id/comment", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    const comment = await post.saveComment({
      ...req.body,
      creator: req.user.id,
    });
    res.send(comment);
  } catch (error) {
    res.send(error);
  }
});

router.get("/post/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.send(post.comments);
  } catch (error) {
    res.send(error);
  }
});

router.get("/post/:postID/comment/:commentID", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID);
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.commentID
    );
    console.log(comment);
    res.status(201).send(comment);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.patch(
  "/post/:postID/comment/:commentID/edit",
  auth,
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.postID);
      let comment = post.comments.find(
        (comment) => comment._id.toString() === req.params.commentID
      );
      if (comment.comment.creator.toString() !== req.user.id)
        throw new Error("You can edit only your comments");
      else {
        comment = post.comments.find((comment) => {
          if (comment._id.toString() === req.params.commentID) {
            comment.comment.message = req.body.content;

            return comment;
          }
        });
      }
      await post.save();
      res.status(201).send(comment);
    } catch (e) {
      res.status(404).send(e.toString());
    }
  }
);

router.delete("/post/:postID/comment/:commentID", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postID);
    const comment = post.comments.find((comment, index) => {
      if (comment._id.toString() === req.params.commentID) {
        if (comment.comment.creator.toString() === req.user.id) {
          return post.comments.splice(index, 1);
        } else throw new Error("You can edit only your comments");
      }
    });
    await post.save();
    res.status(201).send(comment);
  } catch (e) {
    res.status(404).send(e.toString());
  }
});

module.exports = router;
