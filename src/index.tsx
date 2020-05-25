import Bugsnag from "@bugsnag/browser";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import * as React from "react";
import * as ReactDOM from "react-dom";

import { App } from "./components/app";
import { connect } from "./connect";

Bugsnag.start({
  apiKey: "ea4b8d8f54ab51480dd721055e3cc0a9",
  plugins: [new BugsnagPluginReact(React)],
});

async function main() {
  let connectedRouter: string;
  try {
    connectedRouter = await connect();
  } catch (err) {
    Bugsnag.notify(err);
    return;
  }
  const ErrorBoundary = Bugsnag.getPlugin("react")!.createErrorBoundary();
  ReactDOM.render(
    (
      <ErrorBoundary>
        <App connectedRouter={connectedRouter}/>
      </ErrorBoundary>
    ), document.querySelector("#app"));
}

document.addEventListener("DOMContentLoaded", main);
