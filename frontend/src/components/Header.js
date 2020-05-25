import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { withRouter } from "react-router-dom";

class Header extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
    };
  }

  handleLogout = () => {
    const jwt = localStorage.getItem("jwt");
    axios({
      url: "http://localhost:3000/user/logout",
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then(() => {
        localStorage.removeItem("jwt");
        this.props.history.push("/");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  findUser = (e) => {
    e.preventDefault;
    const name = this.state.username;

    this.props.history.push(`/dashboard/${name}`);
  };

  componentDidMount() {
    const jwt = localStorage.getItem("jwt");
    if (!jwt) {
      console.log(this.props);
    }
  }
  handleFindChange = (e) => {
    this.setState({
      username: e.target.value,
    });
  };
  render() {
    return (
      <div>
        <h2>
          <Link to="/dashboard">Social App</Link>{" "}
        </h2>
        {this.props.username && <h2>{this.props.username.name}</h2>}
        <form
          action={`/dashboard/${this.state.username}`}
          onSubmit={this.findUser}
        >
          <input
            value={this.state.username}
            onChange={this.handleFindChange}
            placeholder="Username"
            type="text"
          />
          <button>Find</button>
        </form>

        <button onClick={this.handleLogout}>Logout</button>
      </div>
    );
  }
}

export default withRouter(Header);
