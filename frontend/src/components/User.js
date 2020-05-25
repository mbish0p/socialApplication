import React from "react";
import Header from "./Header";
import axios from "axios";
import Posts from "./Posts";

class User extends React.Component {
  constructor(props) {
    super(props);

    const path = window.location.pathname.slice(1);
    this.state = {
      userID: path,
      me: undefined,
      posts: undefined,
    };
  }
  componentDidMount() {
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
            me: res.data,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }

    axios({
      url: `http://localhost:3000/post/user/${this.state.userID}`,
      method: "GET",
    })
      .then((res) => {
        this.setState({
          posts: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  render() {
    return (
      <div>
        <Header username={this.state.me} />
        <Posts posts={this.state.posts} editDelete={this.editDelete} />
      </div>
    );
  }
}

export default User;
