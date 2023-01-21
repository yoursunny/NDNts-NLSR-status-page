import Bugsnag from "@bugsnag/browser";
import BugsnagPluginReact from "@bugsnag/plugin-react";
import * as Preact from "preact";

const { Fragment, h, render } = Preact;

import { App } from "./components/app";
import { connect } from "./connect";

if (location.hostname.endsWith(".ndn.today")) {
  Bugsnag.start({
    apiKey: "ea4b8d8f54ab51480dd721055e3cc0a9",
    plugins: [new BugsnagPluginReact(Preact)],
  });
} else {
  Bugsnag.start({
    apiKey: "00000000000000000000000000000000",
    enabledReleaseStages: [],
  });
}

async function main() {
  let connectedRouter: string;
  try {
    connectedRouter = await connect();
  } catch (err: unknown) {
    Bugsnag.notify(err as Error);
    return;
  }
  const ErrorBoundary = Bugsnag.getPlugin("react")?.createErrorBoundary() ?? Fragment;
  render(
    (
      <ErrorBoundary>
        <App connectedRouter={connectedRouter}/>
      </ErrorBoundary>
    ), document.querySelector("#app")!);
}

document.addEventListener("DOMContentLoaded", main);
