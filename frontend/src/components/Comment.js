import React from "react";
import axios from "axios";
import { RiSettings4Line } from "react-icons/ri";
import { DropdownButton, DropdownIcon, DropdownMenu } from "./DropdownButton";
import Modal from "react-modal";

class Comment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      creator: undefined,
      openModal: false,
      error: "",
      content: this.props.comment.message,
    };
  }

  handleCloseModal = () => {
    if (!this.state.error) {
      this.setState({
        openModal: false,
      });
    }
  };

  componentDidMount() {
    const userID = this.props.comment.creator;
    axios({
      url: `http://localhost:3000/user/${userID}`,
      method: "GET",
    })
      .then((res) => {
        this.setState({
          creator: res.data.name,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  settingOption = ({ option }) => {
    const settings = {
      type: option,
      commentID: this.props._id,
    };
    if (option === "Edit") {
      this.setState({
        openModal: true,
      });
    } else this.props.editDelete(settings);
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
      commentID: this.props._id,
      content: this.state.content,
      type: "Edit",
    };
    if (!this.state.error) {
      this.props.editDelete(settings);
      this.handleCloseModal();
    }
  };

  render() {
    return (
      <div>
        <div className="comment--header">
          <h4>{this.state.creator}</h4>
          <DropdownButton>
            <DropdownIcon icon={<RiSettings4Line />}>
              <DropdownMenu settingOption={this.settingOption} />
            </DropdownIcon>
          </DropdownButton>

          <Modal
            isOpen={this.state.openModal}
            onRequestClose={this.handleCloseModal}
            closeTimeoutMS={300}
            className="modal-edit"
          >
            <div className="modal-edit--header">
              <h2>{this.state.creator}</h2>
              <h2>Edit Comment</h2>
            </div>
            <form onSubmit={this.handleSubmit} className="modal-edit--form">
              <input
                value={this.state.content}
                type="text"
                onChange={this.handleEdit}
              />
              {this.state.error && <p>{this.state.error}</p>}
              <button>Edit</button>
            </form>
          </Modal>
        </div>
        <p className="comment--content">{this.state.content}</p>
      </div>
    );
  }
}
export default Comment;
