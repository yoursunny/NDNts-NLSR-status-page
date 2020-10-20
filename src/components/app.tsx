import Bugsnag from "@bugsnag/browser";
import { Component, Fragment, h } from "preact";

import { fetchLsas, RouterLsa } from "../fetch";
import { RouterList } from "./router-list";

interface Props {
  connectedRouter: string;
}

interface State {
  lsas: RouterLsa[];
}

export class App extends Component<Props, State> {
  private refreshTimer = 0;
  state = {
    lsas: [],
  };

  public componentDidMount() {
    this.refreshTimer = setInterval(this.refresh, 10000) as unknown as number;
    this.refresh();
  }

  public componentWillUnmount() {
    clearInterval(this.refreshTimer);
    this.refreshTimer = 0;
  }

  public render() {
    return (
      <>
        <RouterList list={this.state.lsas}/>
        <p>Connected to <code>{this.props.connectedRouter}</code>.</p>
      </>
    );
  }

  private refresh = () => {
    fetchLsas()
      .then(
        (lsas) => this.setState({ lsas }),
        (err) => Bugsnag.notify(err),
      );
  };
}
