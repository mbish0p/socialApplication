import React from "react";

class PostCreat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postMessage: "",
      error: "",
      img: null,
    };
  }

  handlePostChange = (e) => {
    this.setState({
      postMessage: e.target.value,
    });
  };

  fileUpload = (e) => {
    this.setState({
      img: e.target.files[0],
    });
  };

  createPost = (e) => {
    e.preventDefault();

    if (this.state.postMessage || this.state.img) {
      this.setState({
        error: "",
      });
      const content = {
        content: this.state.postMessage,
        img: this.state.img,
      };
      this.setState({
        postMessage: "",
        img: null,
      });
      this.props.wasCreated(content);
    } else {
      this.setState({
        error: "You need provide all information",
      });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.createPost}>
          <label>Creat post</label>
          <input type="file" onChange={this.fileUpload} />
          <textarea
            placeholder="Write here your post"
            value={this.state.postMessage}
            onChange={this.handlePostChange}
            type="text"
          />
          <button>Post</button>
        </form>
      </div>
    );
  }
}

export default PostCreat;
