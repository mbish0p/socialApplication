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

postSchema.methods.reaction = async function ({ action, userID }) {
  let isAlreadyLike = this.positiveRates.filter((positive) => {
    return JSON.stringify(positive.userID) === JSON.stringify(userID);
  });
  if (JSON.stringify(isAlreadyLike) === "[]") isAlreadyLike = null;

  let isAlreadyDislike = this.negativeRates.filter((negative) => {
    return JSON.stringify(negative.userID) === JSON.stringify(userID);
  });
  if (JSON.stringify(isAlreadyDislike) === "[]") isAlreadyDislike = null;

  switch (action) {
    case "like":
      if (!isAlreadyLike && !isAlreadyDislike) {
        this.positiveRates = this.positiveRates.concat({ userID });
      } else if (isAlreadyLike) {
        const newPostiveRates = this.positiveRates.filter((positive) => {
          return JSON.stringify(positive.userID) !== JSON.stringify(userID);
        });
        this.positiveRates = newPostiveRates;
      } else if (isAlreadyDislike) {
        const newNegativeRates = this.negativeRates.filter((negative) => {
          return JSON.stringify(negative.userID) !== JSON.stringify(userID);
        });

        this.negativeRates = newNegativeRates;
        this.positiveRates = this.positiveRates.concat({ userID });
      }
      break;

    case "dislike":
      if (!isAlreadyLike && !isAlreadyDislike) {
        this.negativeRates = this.negativeRates.concat({ userID });
      } else if (isAlreadyDislike) {
        const newNegativeRates = this.negativeRates.filter((negative) => {
          return JSON.stringify(negative.userID) !== JSON.stringify(userID);
        });

        this.negativeRates = newNegativeRates;
      } else if (isAlreadyLike) {
        const newPostiveRates = this.positiveRates.filter((positive) => {
          return JSON.stringify(positive.userID) !== JSON.stringify(userID);
        });
        this.positiveRates = newPostiveRates;

        this.negativeRates = this.negativeRates.concat({ userID });
      }
      break;
  }

  await this.save();
  return this;
};

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
