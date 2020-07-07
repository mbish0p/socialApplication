import React from "react";
import Registry from "./Registratrion";
import axios from "axios";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: undefined,
    };
  }

  loggedInStatus = () => {
    axios({
      url: "http://localhost:3000/user/logged_in",
      method: "GET",
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      this.props.history.push("/dashboard");
    }
  }

  render() {
    return (
      <div>
        <Registry
          submitForm={({ name, email, password, age }) => {
            axios({
              url: "http://localhost:3000/user",
              method: "POST",
              data: {
                name,
                email,
                password,
                age,
              },
            })
              .then((response) => {
                localStorage.setItem("jwt", response.data.token);
                console.log(response.data.token);
                this.props.history.push("/dashboard");
              })
              .catch((e) => {
                console.log(e);
              });
            //console.log(registratrionForm);
          }}
          submitLogin={({ email, password }) => {
            axios({
              method: "POST",
              url: "http://localhost:3000/user/login",
              data: {
                email,
                password,
              },
            })
              .then((res) => {
                localStorage.setItem("jwt", res.data.token);
                this.props.history.push("/dashboard");
                console.log(res.data.token);
              })
              .catch((e) => {
                console.log(e);
                this.setState({
                  error: "Unable to login",
                });
              });
          }}
        />
      </div>
    );
  }
}

export default App;
