import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages } from "@fortawesome/free-solid-svg-icons";

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
        <form className="create-post--form" onSubmit={this.createPost}>
          <label className="create-post--title">Creat post</label>
          <input
            className="file-input"
            type="file"
            id="file"
            onChange={this.fileUpload}
          />
          <textarea
            className="creat-post--textarea"
            placeholder="Write here your post"
            value={this.state.postMessage}
            onChange={this.handlePostChange}
            type="text"
          />
          <label htmlFor="file" className="file-input--label">
            <FontAwesomeIcon icon={faImages} className="creat-post--icon" />
            Choose a Image
          </label>
          <button className="create-post--button">Post</button>
        </form>
      </div>
    );
  }
}

export default PostCreat;
