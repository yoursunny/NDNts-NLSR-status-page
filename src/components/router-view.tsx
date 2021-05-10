import { AltUri, Name } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import { Component, Fragment, h } from "preact";

import type { RouterLsa } from "../fetch";
import { LsaInfoDetail } from "./lsa-info-detail";

interface Props {
  router: RouterLsa;
}

export class RouterView extends Component<Props> {
  public render() {
    const { nameLsa, coordinateLsa } = this.props.router;
    if (nameLsa && nameLsa.names.length > 0) {
      return nameLsa.names.map(this.renderRow);
    }
    return (
      <tr key={toHex(coordinateLsa!.originRouter.value)}>
        {this.renderOrigin()}
        <td/>
        {this.renderCoordinate()}
      </tr>
    );
  }

  private get rowSpan() {
    const { nameLsa } = this.props.router;
    return nameLsa ? Math.max(1, nameLsa.names.length) : 1;
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
    const { coordinateLsa } = this.props.router;
    return (
      <td rowSpan={this.rowSpan}>
        {coordinateLsa ?
          <>
            {coordinateLsa.radius.toFixed(5)}
            {coordinateLsa.angle.map((a) => `, ${a.toFixed(5)}`)}
            <br/>
            <LsaInfoDetail {...coordinateLsa}/>
          </> :
          undefined
        }
      </td>
    );
  }

  private renderRow = (name: Name, index: number) => {
    return (
      <tr key={toHex(name.value)}>
        {index === 0 ? this.renderOrigin() : undefined}
        <td>{AltUri.ofName(name)}</td>
        {index === 0 ? this.renderCoordinate() : undefined}
      </tr>
    );
  };
}
