import { AltUri, Name } from "@ndn/packet";
import { toHex } from "@ndn/util";
import { Component, Fragment, h } from "preact";

import { RouterLsaData, shortenName } from "../model/mod";
import { LsaInfoDetail } from "./lsa-info-detail";

interface Props {
  router: RouterLsaData;
  hideCoordinate: boolean;
  hideAdjacency: boolean;
}

export class RouterView extends Component<Props> {
  public render() {
    const { originRouter, nameLsa } = this.props.router;
    if (nameLsa.names.length > 0) {
      return nameLsa.names.map(this.renderRow);
    }
    return (
      <tr key={originRouter}>
        {this.renderOrigin()}
        <td/>
        {this.renderCoordinate()}
        {this.renderAdjacency()}
      </tr>
    );
  }

  private get rowSpan() {
    const { nameLsa } = this.props.router;
    return Math.max(1, nameLsa.names.length);
  }

  private renderOrigin() {
    const { name, nameLsa } = this.props.router;
    return (
      <td rowSpan={this.rowSpan}>
        {AltUri.ofName(name)}
        {nameLsa ?
          <>
            <br/>
            <LsaInfoDetail {...nameLsa}/>
          </> :
          undefined
        }
      </td>
    );
  }

  private renderCoordinate() {
    const {
      router: { coordinateLsa },
      hideCoordinate,
    } = this.props;
    if (hideCoordinate) {
      return undefined;
    }
    if (!coordinateLsa) {
      return <td rowSpan={this.rowSpan}/>;
    }
    return (
      <td rowSpan={this.rowSpan}>
        {coordinateLsa.radius.toFixed(5)}
        {coordinateLsa.angle.map((a) => `, ${a.toFixed(5)}`)}
        <br/>
        <LsaInfoDetail {...coordinateLsa}/>
      </td>
    );
  }

  private renderAdjacency() {
    const {
      router: { adjacencyLsa },
      hideAdjacency,
    } = this.props;
    if (hideAdjacency) {
      return undefined;
    }
    if (!adjacencyLsa) {
      return <td rowSpan={this.rowSpan}/>;
    }
    return (
      <td rowSpan={this.rowSpan}>
        <ul>
          {adjacencyLsa.adjacencies.map((adj) => (
            <li key={toHex(adj.name.value)} title={AltUri.ofName(adj.name)}>
              {shortenName(adj.name).map(AltUri.ofComponent).join("/")}
              {" "}
              <small>({adj.cost})</small>
            </li>
          ))}
        </ul>
        <LsaInfoDetail {...adjacencyLsa}/>
      </td>
    );
  }

  private renderRow = (name: Name, index: number) => (
    <tr key={toHex(name.value)}>
      {index === 0 ? this.renderOrigin() : undefined}
      <td>{AltUri.ofName(name)}</td>
      {index === 0 ? [this.renderCoordinate(), this.renderAdjacency()] : undefined}
    </tr>
  );
}
