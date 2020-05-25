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
  }

  handleSettings = () => {
    this.setState((state, props) => ({
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
      <div>
        {this.state.creator && (
          <div>
            <h2>{this.state.creator.name}</h2>
            {/* If you are creator of post you can edit/delete only */}
            {this.props.img && (
              <img
                src={`data:image/jpeg;base64,${this.state.base64String}`}
                width="200px"
                height="200px"
              />
            )}
            {this.state.loggedUser &&
              this.state.creator &&
              this.state.creator._id === this.state.loggedUser._id && (
                <DropdownButton>
                  <DropdownIcon icon={<RiSettings4Line />}>
                    <DropdownMenu settingOption={this.settingOption} />
                  </DropdownIcon>
                </DropdownButton>
              )}

            <Modal
              isOpen={this.state.openModal}
              onRequestClose={this.handleCloseModal}
            >
              <h2>Edit Post</h2>
              <button onClick={this.handleCloseModal}>Close</button>

              <form onSubmit={this.handleSubmit}>
                <h2>{this.state.creator.name}</h2>
                <textarea
                  value={this.state.content}
                  type="text"
                  onChange={this.handleEdit}
                />
                {this.state.error && <p>{this.state.error}</p>}
                <button>Edit</button>
              </form>
            </Modal>

            <p>{this.props.content}</p>
            <button>+</button>
            <h3>{this.state.rate}</h3>
            <button>-</button>
            <button onClick={this.handleCommentSection}>Comments</button>

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
