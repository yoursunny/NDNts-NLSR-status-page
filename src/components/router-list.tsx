import { Component, h } from "preact";

import type { RouterLsaData } from "../model/mod";
import { RouterView } from "./router-view";

interface Props {
  list: RouterLsaData[];
  show: "coordinates" | "adjacencies";
}

export class RouterList extends Component<Props> {
  public render() {
    const { show } = this.props;
    const [width1, colume2, width2] =
      show === "coordinates" ?
        [50, "Coordinates", 20] :
        [40, "Adjacencies", 30];
    return (
      <table className="pure-table pure-table-bordered" style="table-layout:fixed; width:98%; word-break:break-all;">
        <thead>
          <tr>
            <th style="width:30%;">Router</th>
            <th style={`width:${width1}%;`}>Prefix</th>
            <th style={`width:${width2}%;`}>{colume2}</th>
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

  private renderRouter = (router: RouterLsaData) => {
    const { show } = this.props;
    return (
      <RouterView
        key={router.originRouter}
        router={router}
        hideCoordinate={show !== "coordinates"}
        hideAdjacency={show !== "adjacencies"}
      />
    );
  };
}
