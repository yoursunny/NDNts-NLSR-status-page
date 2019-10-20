import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/app";
import { connect } from "./logic";

async function main() {
  await connect();
  ReactDOM.render(<App/>, document.getElementById("app"));
}

document.addEventListener("DOMContentLoaded", main);
