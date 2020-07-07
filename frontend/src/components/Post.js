import React from "react";
import axios from "axios";
import { RiSettings4Line } from "react-icons/ri";
import { DropdownButton, DropdownIcon, DropdownMenu } from "./DropdownButton";
import Modal from "react-modal";
import CommentSection from "./CommentSection";

class Post extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      commentSection: false,
      openModal: false,
      creator: undefined,
      rate: 0,
      content: this.props.content,
      error: "",
      loggedUser: undefined,
      base64String: undefined,
    };
  }
  componentDidMount() {
    const userID = this.props.owner;
    axios({
      url: `http://localhost:3000/user/${userID}`,
      method: "GET",
    })
      .then((res) => {
        this.setState({
          creator: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });

    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      this.props.history.push("/");
    } else {
      axios({
        url: "http://localhost:3000/user/me",
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => {
          this.setState({
            loggedUser: res.data,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (this.props.img) {
      let base64String = btoa(
        String.fromCharCode(...new Uint8Array(this.props.img.data))
      );
      this.setState({
        base64String,
      });
    }
    this.fetchLikesRatio();
  }

  fetchLikesRatio = () => {
    axios({
      url: `http://localhost:3000/post/${this.props._id}/ratio`,
      method: "GET",
    })
      .then((res) => {
        this.setState({
          rate: res.data.totalRatio,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  handleSettings = () => {
    this.setState((state) => ({
      settingToggle: !state.settingToggle,
    }));
  };

  handleEditPostModal = () => {
    this.setState({
      openModal: true,
    });
  };

  handleCloseModal = () => {
    if (!this.state.error) {
      this.setState({
        openModal: false,
      });
    }
  };

  handleEdit = (e) => {
    const content = e.target.value;

    if (content === "") {
      this.setState({
        error: " Post must contain some text",
        content,
      });
    } else {
      this.setState({
        error: "",
        content,
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const settings = {
      option: "Edit",
      content: this.state.content,
      id: this.props._id,
    };
    if (!this.state.error) {
      this.props.handleEvent(settings);
      this.handleCloseModal();
    }
  };

  handleLike = () => {
    const jwt = localStorage.getItem("jwt");
    axios({
      url: `http://localhost:3000/post/like/${this.props._id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => {
        this.fetchLikesRatio();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  handleDislike = () => {
    const jwt = localStorage.getItem("jwt");
    axios({
      url: `http://localhost:3000/post/dislike/${this.props._id}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => {
        this.fetchLikesRatio();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  settingOption = ({ option }) => {
    const settings = {
      option,
      id: this.props._id,
    };
    if (option === "Edit") {
      this.handleEditPostModal();
    } else {
      this.props.handleEvent(settings);
    }
  };

  handleCommentSection = () => {
    this.setState({
      commentSection: !this.state.commentSection,
    });
  };

  render() {
    return (
      <div className="post">
        {this.state.creator && (
          <div className="post--container">
            <div className="post--header">
              <h2 className="post--title">{this.state.creator.name}</h2>
              {/* If you are creator of post you can edit/delete only */}
              {this.state.loggedUser &&
                this.state.creator &&
                this.state.creator._id === this.state.loggedUser._id && (
                  <DropdownButton>
                    <DropdownIcon icon={<RiSettings4Line />}>
                      <DropdownMenu settingOption={this.settingOption} />
                    </DropdownIcon>
                  </DropdownButton>
                )}
            </div>
            <Modal
              isOpen={this.state.openModal}
              onRequestClose={this.handleCloseModal}
              closeTimeoutMS={300}
              className="modal-edit"
            >
              <div className="modal-edit--header">
                <h2>{this.state.creator.name}</h2>
                <h2>Edit Post</h2>
              </div>

              <form onSubmit={this.handleSubmit} className="modal-edit--form">
                <textarea
                  className="edit-post"
                  value={this.state.content}
                  type="text"
                  onChange={this.handleEdit}
                />
                {this.state.error && <p>{this.state.error}</p>}
                <button>Edit</button>
              </form>
            </Modal>
            <p className="post--content">{this.props.content}</p>
            {this.props.img && (
              <img
                className="post--image"
                src={`data:image/jpeg;base64,${this.state.base64String}`}
              />
            )}
            <div className="post--activity">
              <div className="post--likes">
                <button className="post--button" onClick={this.handleLike}>
                  +
                </button>{" "}
                {/* maybe checkbox*/}
                <h3 className="post--rate">{this.state.rate}</h3>
                <button className="post--button" onClick={this.handleDislike}>
                  -
                </button>
              </div>
              <button
                className="post--button"
                onClick={this.handleCommentSection}
              >
                Comments
              </button>
            </div>
            {this.state.commentSection && (
              <CommentSection postID={this.props._id} />
            )}
          </div>
        )}
      </div>
    );
  }
}

export default Post;
