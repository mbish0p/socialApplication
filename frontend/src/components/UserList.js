import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class User extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userPosts: undefined,
    };
  }

  componentDidMount() {
    axios({
      method: "GET",
      url: `http://localhost:3000/post/user/${this.props.id}`,
    })
      .then((res) => {
        this.setState({
          userPosts: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div className="user--container">
        <div className="user">
          <h2>
            <Link to={`/${this.props.id}`} className="username">
              {this.props.username}
            </Link>
          </h2>
          <h4>{this.props.email}</h4>
          <h4>
            Number of posts :
            {this.state.userPosts && this.state.userPosts.length}
          </h4>
        </div>
      </div>
    );
  }
}

export default User;
