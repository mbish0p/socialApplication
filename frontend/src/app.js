import React from "react";
import ReactDOM from "react-dom";
import "./styles/style.scss";
import App from "./components/App";
import UserSearch from "./components/UserSearch";
import Dashboard from "./components/Dashboard";
import User from "./components/User";
import { BrowserRouter, Switch, Route } from "react-router-dom";

const jsx = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/dashboard" component={Dashboard} />
      <Route exact path="/dashboard/:username" component={UserSearch} />
      <Route exact path="/:userID" component={User} />
      <Route exact path="/*" />
    </Switch>
  </BrowserRouter>
);

ReactDOM.render(jsx, document.getElementById("app"));
