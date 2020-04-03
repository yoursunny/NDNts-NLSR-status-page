import * as React from "react";

import { RouterLsa } from "../fetch";
import { RouterView } from "./router-view";

interface Props {
  list: RouterLsa[];
}

export class RouterList extends React.Component<Props> {
  public render() {
    return (
      <table className="pure-table pure-table-bordered">
        <thead>
          <tr>
            <th>Router</th>
            <th>Prefix</th>
            <th>Coordinates</th>
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
    return this.props.list.map(this.renderRouter);
  }

  private renderRouter({ originRouter, nameLsa, coordinateLsa }: RouterLsa) {
    return <RouterView key={originRouter} nameLsa={nameLsa} coordinateLsa={coordinateLsa}/>;
  }
}
