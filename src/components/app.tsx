import * as React from "react";

import { fetchNameLsas } from "../logic";
import { NameLsa } from "../model";
import { NameLsaList } from "./name-lsa-list";

interface State {
  nameLsas: NameLsa[];
}

export class App extends React.Component<{}, State> {
  private refreshTimer = 0;

  constructor(props) {
    super(props);
    this.state = { nameLsas: [] };
  }

  public componentDidMount() {
    this.refreshTimer = setInterval(this.refresh, 10000) as unknown as number;
    this.refresh();
  }

  public componentWillUnmount() {
    clearInterval(this.refreshTimer);
    this.refreshTimer = 0;
  }

  public render() {
    if (this.state.nameLsas.length === 0) {
      return (
        <div>
          loading
        </div>
      );
    }
    return (
      <NameLsaList list={this.state.nameLsas}/>
    );
  }

  private refresh = () => {
    fetchNameLsas()
    .then(
      (nameLsas) => this.setState({ nameLsas }),
      // tslint:disable-next-line:no-console
      console.warn,
    );
  }
}
