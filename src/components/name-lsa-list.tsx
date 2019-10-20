import * as React from "react";

import { NameLsa } from "../model";
import { NameLsaView } from "./name-lsa-view";

interface Props {
  list: NameLsa[];
}

export class NameLsaList extends React.Component<Props> {
  public render() {
    return (
      <table className="pure-table pure-table-bordered">
        <thead>
          <tr>
            <th>Router</th>
            <th>Prefix</th>
          </tr>
        </thead>
        <tbody>{this.props.list.map(this.renderLsa)}</tbody>
      </table>
    );
  }

  private renderLsa(lsa: NameLsa) {
    return <NameLsaView key={lsa.originRouter.toString()} lsa={lsa}/>;
  }
}
