const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  img: {
    type: Buffer,
  },
  comments: [
    {
      comment: {
        message: {
          type: String,
          required: true,
        },
        creator: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      },
    },
  ],
  positiveRates: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
  negativeRates: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
  ],
});

postSchema.methods.saveComment = async function ({ content, creator }) {
  const comment = {
    message: content,
    creator,
  };

  this.comments = this.comments.concat({ comment });

  await this.save();

  return comment;
};

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
