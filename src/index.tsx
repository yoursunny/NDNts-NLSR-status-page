import bugsnagReact from "@bugsnag/plugin-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { bugsnagClient } from "./bugsnag";
import { App } from "./components/app";
import { connect } from "./logic";

bugsnagClient.use(bugsnagReact, React);

async function main() {
  let connectedRouter: string;
  try {
    connectedRouter = await connect();
  } catch (err) {
    alert(err);
    bugsnagClient.notify(err);
    return;
  }
  const ErrorBoundary = bugsnagClient.getPlugin("react");
  ReactDOM.render(
    (
      <ErrorBoundary>
        <App connectedRouter={connectedRouter}/>
      </ErrorBoundary>
    ), document.getElementById("app"));
}

document.addEventListener("DOMContentLoaded", main);
