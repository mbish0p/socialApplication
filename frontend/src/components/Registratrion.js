import React from "react";
import Header from "./RegistryHeader";
import validator from "validator";

class Registry extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      age: "",
      email: "",
      password: "",
      error: "",
    };
  }

  handleChangeName = (e) => {
    this.setState({
      name: e.target.value,
    });
  };

  handleChangeAge = (e) => {
    const age = e.target.value;
    if (validator.isInt(age, { min: 1, max: 120 }))
      this.setState({ age: parseInt(age) });
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

  passwordValidation = (e) => {
    if (e.target.value !== this.state.password) {
      this.setState({
        error: "You must provide same password as above",
      });
    } else this.setState({ error: "" });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (
      this.state.name &&
      this.state.password &&
      this.state.email &&
      this.state.age &&
      !this.state.error
    ) {
      this.props.submitForm({
        name: this.state.name,
        email: this.state.email,
        password: this.state.password,
        age: this.state.age,
      });
    } else this.setState({ error: "You must provide all information" });
  };

  handleLogin = (data) => {
    this.props.submitLogin(data);
  };

  render() {
    return (
      <div>
        <Header handleLogin={this.handleLogin} />
        <form onSubmit={this.handleSubmit}>
          <input
            value={this.state.name}
            onChange={this.handleChangeName}
            autoFocus
            type="text"
            placeholder="Name  *"
          />
          <input
            value={this.state.age}
            onChange={this.handleChangeAge}
            placeholder="Age "
          />
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
          <input
            onChange={this.passwordValidation}
            type="password"
            placeholder="Repete password  *"
          />
          {this.state.error && <p>{this.state.error}</p>}
          <button>Registry</button>
        </form>
      </div>
    );
  }
}

export default Registry;
