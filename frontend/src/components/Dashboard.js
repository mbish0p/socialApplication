import React from "react";
import axios from "axios";
import Header from "./Header";
import Posts from "./Posts";
import PostCreat from "./PostCreate";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
      posts: undefined,
    };
  }

  fetchPosts = () => {
    const jwt = localStorage.getItem("jwt");
    axios({
      url: "http://localhost:3000/posts",
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
      .then((res) => {
        this.setState({
          posts: res.data,
        });
        //console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };
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
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    this.fetchPosts();
  }

  createPost = ({ content, img }) => {
    const jwt = localStorage.getItem("jwt");
    const fd = new FormData();

    fd.append("image", img);
    fd.append("content", content);
    axios
      .post("http://localhost:3000/post", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${jwt}`,
        },
      })
      .then((res) => {
        this.fetchPosts();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  editDelete = (settings) => {
    const jwt = localStorage.getItem("jwt");
    if (settings.option === "Edit") {
      axios({
        url: `http://localhost:3000/post/${settings.id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        data: {
          content: settings.content,
        },
      })
        .then((res) => {
          this.fetchPosts();
        })
        .catch((e) => {
          console.log(e);
        });
    } else if (settings.option === "Delete") {
      axios({
        url: `http://localhost:3000/post/${settings.id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })
        .then((res) => {
          this.fetchPosts();
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  render() {
    return (
      <div>
        <Header username={this.state.user} />
        <PostCreat wasCreated={this.createPost} />
        <Posts posts={this.state.posts} editDelete={this.editDelete} />
      </div>
    );
  }
}

export default Dashboard;
