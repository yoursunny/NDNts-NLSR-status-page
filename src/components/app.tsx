import * as React from "react";

import { bugsnagClient } from "../bugsnag";
import { fetchNameLsas } from "../fetch";
import { NameLsa } from "../model";
import { NameLsaList } from "./name-lsa-list";

interface Props {
  connectedRouter: string;
}

interface State {
  nameLsas: NameLsa[];
}

export class App extends React.Component<Props, State> {
  private refreshTimer = 0;
  state = {
    nameLsas: [],
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
        <NameLsaList list={this.state.nameLsas}/>
        <p>Connected to <code>{this.props.connectedRouter}</code>.</p>
      </>
    );
  }

  private refresh = () => {
    fetchNameLsas()
      .then(
        (nameLsas) => this.setState({ nameLsas }),
        bugsnagClient.notify,
      );
  };
}
