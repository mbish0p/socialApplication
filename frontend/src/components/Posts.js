import React from "react";
import Post from "./Post";

const Posts = (props) => {
  return (
    <div>
      {props.posts &&
        props.posts.map((post, index) => {
          return (
            <Post
              key={index}
              {...post}
              handleEvent={(settings) => {
                props.editDelete(settings);
              }}
            />
          );
        })}
    </div>
  );
};

export default Posts;
