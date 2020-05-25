import React from "react";
import Header from "./Header";
import axios from "axios";
import User from "./UserList";

class UserSearch extends React.Component {
  constructor(props) {
    super(props);

    const path = window.location.pathname.slice(11);
    const name = path.replace("%20", " ");

    this.state = {
      user: undefined,
      findUsersA: undefined,
      name,
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
            user: res.data,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    axios({
      url: "http://localhost:3000/user/find",
      method: "POST",
      data: {
        username: this.state.name,
      },
    })
      .then((res) => {
        this.setState({
          findUsersA: res.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  render() {
    return (
      <div>
        <Header username={this.state.user} />
        {this.state.findUsersA && (
          <div>
            {this.state.findUsersA.map((user) => {
              return (
                <User
                  key={user._id}
                  username={user.name}
                  id={user._id}
                  email={user.email}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default UserSearch;
