import { Component, h } from "preact";

import { RouterLsa } from "../fetch";
import { RouterView } from "./router-view";

interface Props {
  list: RouterLsa[];
}

export class RouterList extends Component<Props> {
  public render() {
    return (
      <table className="pure-table pure-table-bordered" style="table-layout:fixed; width:98%; word-break:break-all;">
        <colgroup>
          <col style="width:30%;"/>
          <col style="width:50%;"/>
          <col style="width:20%;"/>
        </colgroup>
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
          <td colSpan={3}>loading</td>
        </tr>
      );
    }
    return this.props.list.map(this.renderRouter);
  }

  private renderRouter({ originRouter, nameLsa, coordinateLsa }: RouterLsa) {
    return <RouterView key={originRouter} nameLsa={nameLsa} coordinateLsa={coordinateLsa}/>;
  }
}
