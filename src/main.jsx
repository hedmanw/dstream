import React from "react";
import Router from "react-router";
import App from "./components/App.jsx";
import Dashboard from "./components/Dashboard.jsx";
import PartyPanel from "./components/PartyPanel.jsx";
import jQuery from "jquery";
window.jQuery = jQuery;
import "bootstrap";

let DefaultRoute = Router.DefaultRoute;
let Route = Router.Route;

let routes = (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Dashboard}/>
    <Route name="party" path="party" handler={PartyPanel} title="Trololol" />
    <Route name="dashboard" path="/" handler={Dashboard} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});
