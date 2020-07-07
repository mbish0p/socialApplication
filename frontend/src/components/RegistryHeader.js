import React from "react";
import Modal from "react-modal";
import { withRouter } from "react-router-dom";
import axios from "axios";

class RegistryHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      email: "",
      password: "",
      error: "",
    };

    Modal.setAppElement(document.getElementById("app"));
  }

  handleLoginModal = (e) => {
    this.setState({
      openModal: true,
    });
  };
  handleCloseModal = () => {
    this.setState({
      openModal: false,
    });
  };

  handleChangeEmail = (e) => {
    const email = e.target.value;
    this.setState({ email });
  };

  handlePasswordChange = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  handleLogin = (e) => {
    e.preventDefault();

    if (this.state.email && this.state.password) {
      this.setState({
        error: "",
      });

      this.props.handleLogin({
        email: this.state.email,
        password: this.state.password,
      });
    } else {
      this.setState({
        error: "You need provide all information",
      });
    }
  };

  render() {
    return (
      <div>
        <div className="registry--header">
          <h2>SocialApp</h2>
          <button
            className="registry--header--login_button"
            onClick={this.handleLoginModal}
          >
            Login
          </button>
        </div>
        <Modal
          isOpen={this.state.openModal}
          onRequestClose={this.handleCloseModal}
          closeTimeoutMS={300}
          className="modal"
        >
          <h2>Login</h2>

          <form onSubmit={this.handleLogin} className="modal--form">
            <input
              value={this.state.email}
              onChange={this.handleChangeEmail}
              type="text"
              placeholder="Email  *"
            />
            <input
              value={this.state.password}
              onChange={this.handlePasswordChange}
              type="password"
              placeholder="Password  *"
            />
            {this.state.error && (
              <p className="form--error">{this.state.error}</p>
            )}
            <button>Login</button>
          </form>
        </Modal>
      </div>
    );
  }
}

export default RegistryHeader;
