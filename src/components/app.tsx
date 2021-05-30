import Bugsnag from "@bugsnag/browser";
import { AltUri } from "@ndn/packet";
import { get as hashGet, set as hashSet } from "hashquery";
import { Component, Fragment, h } from "preact";

import { fetchDataset, NetworkProfile } from "../fetch";
import { RouterLsaData } from "../model/mod";
import { RouterList } from "./router-list";

interface Props {
  connectedRouter: string;
}

interface State {
  network: keyof typeof NetworkProfile;
  from: string;
  lsas: RouterLsaData[];
}

export class App extends Component<Props, State> {
  private refreshTimer = 0;
  state: State = {
    network: (() => {
      const id = hashGet("network");
      if (Object.keys(NetworkProfile).includes(id)) {
        return id;
      }
      hashSet("network", "ndn");
      return "ndn";
    })(),
    from: "",
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
        <div class="pure-menu pure-menu-horizontal">
          <span class="pure-menu-heading pure-menu-link">network</span>
          <ul class="pure-menu-list">
            {Object.entries(NetworkProfile).map(([id, { network }]) => (
              <li key={id} class={`pure-menu-item ${id === this.state.network ? "pure-menu-selected" : ""}`}>
                <a href="javascript:;" class="pure-menu-link" onClick={this.handleChooseNetwork(id)}>{AltUri.ofName(network)}</a>
              </li>
            ))}
          </ul>
        </div>
        <RouterList list={this.state.lsas} show={this.network.show}/>
        <p>Connected to <code>{this.props.connectedRouter}</code>; dataset retrieved from <code>{this.state.from}</code>.</p>
      </>
    );
  }

  private get network(): NetworkProfile {
    return NetworkProfile[this.state.network];
  }

  private handleChooseNetwork = (id: keyof typeof NetworkProfile) =>
    (evt: MouseEvent) => {
      evt.preventDefault();
      hashSet("network", id);
      this.setState({ network: id, from: "", lsas: [] }, this.refresh);
    };

  private refresh = () => {
    fetchDataset(this.network)
      .then(
        ({ from, lsas }) => this.setState({ from: AltUri.ofName(from), lsas }),
        (err) => {
          console.error(err);
          Bugsnag.notify(err);
        },
      );
  };
}
