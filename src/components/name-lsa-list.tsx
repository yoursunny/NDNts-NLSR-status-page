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
        <tbody>{this.renderBody()}</tbody>
      </table>
    );
  }

  private renderBody() {
    if (this.props.list.length === 0) {
      return (
        <tr>
          <td colSpan={2}>loading</td>
        </tr>
      );
    }
    return this.props.list.map(this.renderLsa);
  }

  private renderLsa(lsa: NameLsa) {
    return <NameLsaView key={lsa.originRouter.toString()} lsa={lsa}/>;
  }
}
