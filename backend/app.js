const express = require("express");
require("./mongoose/mongoose");
const bodyParser = require("body-parser");
const userRouter = require("./routers/user");
const postRouter = require("./routers/post");
const commentRouter = require("./routers/comment");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(userRouter);
app.use(postRouter);
app.use(commentRouter);

// const Post = require('./models/posts')
// const User = require('./models/user')

// const main = async () => {

//     // const post = await Post.findById('5e3d86f3e8e27d4594c79bd2')
//     // await post.populate('owner').execPopulate()
//     // console.log(post.owner)

//     // const user = await User.findById('5e3db172e6f9ef2da896fe7a')
//     // await user.populate('posts').execPopulate()
//     // console.log(user.posts)
// }

// main()

app.listen(3000);
