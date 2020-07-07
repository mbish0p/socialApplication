import React, { Component } from "react";
import axios from "axios";
import Comment from "./Comment";

class CommentSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comment: "",
      postComments: undefined,
    };
  }
  componentDidMount() {
    this.fetchComments();
  }

  fetchComments = () => {
    axios({
      url: `http://localhost:3000/post/${this.props.postID}/comment`,
      method: "GET",
    })
      .then((res) => {
        this.setState({
          postComments: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleCommentChange = (e) => {
    this.setState({
      comment: e.target.value,
    });
  };

  addComment = (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem("jwt");

    axios({
      url: `http://localhost:3000/post/${this.props.postID}/comment`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      data: {
        content: this.state.comment,
      },
    })
      .then((res) => {
        this.setState({
          comment: "",
        });
        this.fetchComments();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  editDelete = (settings) => {
    const jwt = localStorage.getItem("jwt");

    if (settings.type === "Edit") {
      axios({
        url: `http://localhost:3000/post/${this.props.postID}/comment/${settings.commentID}/edit`,
        method: "PATCH",
        data: {
          content: settings.content,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => {
          this.fetchComments();
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (settings.type === "Delete") {
      axios({
        url: `http://localhost:3000/post/${this.props.postID}/comment/${settings.commentID}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => {
          this.fetchComments();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  render() {
    return (
      <div>
        <form className="comments--form" onSubmit={this.addComment}>
          <input
            placeholder="Your comment"
            value={this.state.comment}
            type="text"
            onChange={this.handleCommentChange}
          />
          <button onClick={this.addComment}>Add</button>
        </form>
        {this.state.postComments &&
          this.state.postComments.map((comment, index) => {
            return (
              <Comment key={index} {...comment} editDelete={this.editDelete} />
            );
          })}
      </div>
    );
  }
}

export default CommentSection;
