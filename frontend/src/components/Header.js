import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
      <div className="main-header">
        <div className="container">
          <h2 className="main-header--logo">
            <Link to="/dashboard">SocialApp</Link>
          </h2>

          {this.props.username && (
            <h2 className="main-header--username">
              {this.props.username.name}
            </h2>
          )}

          <form
            className="main-header--form"
            action={`/dashboard/${this.state.username}`}
            onSubmit={this.findUser}
          >
            <input
              value={this.state.username}
              onChange={this.handleFindChange}
              placeholder="Find"
              type="text"
            />
            <button className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <button className="logout-button" onClick={this.handleLogout}>
            Logout
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(Header);
