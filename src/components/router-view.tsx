import { AltUri, Name } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import { Component, h } from "preact";

import { CoordinateLsa, NameLsa } from "../model";
import { LsaInfoDetail } from "./lsa-info-detail";

interface Props {
  coordinateLsa?: CoordinateLsa;
  nameLsa?: NameLsa;
}

export class RouterView extends Component<Props> {
  public render() {
    const { nameLsa, coordinateLsa } = this.props;
    if (nameLsa && nameLsa.names.length > 0) {
      return nameLsa.names.map(this.renderRow);
    }
    return (
      <tr key={toHex(coordinateLsa!.originRouter.value)}>
        {this.renderOrigin()}
        <td>&nbsp;</td>
        {this.renderCoordinate()}
      </tr>
    );
  }

  private computeRowSpan() {
    const { nameLsa } = this.props;
    return nameLsa ? Math.max(nameLsa.names.length, 1) : 1;
  }

  private renderOrigin() {
    const { nameLsa, coordinateLsa } = this.props;
    if (nameLsa) {
      return (
        <td rowSpan={this.computeRowSpan()}>
          {AltUri.ofName(nameLsa.originRouter)}
          <br/>
          <LsaInfoDetail {...nameLsa}/>
        </td>
      );
    }
    return (
      <td>
        {AltUri.ofName(coordinateLsa!.originRouter)}
      </td>
    );
  }

  private renderCoordinate() {
    const { coordinateLsa } = this.props;
    if (coordinateLsa) {
      return (
        <td rowSpan={this.computeRowSpan()}>
          {coordinateLsa.radius.toFixed(5)}
          {coordinateLsa.angle.map((a) => `, ${a.toFixed(5)}`)}
          <br/>
          <LsaInfoDetail {...coordinateLsa}/>
        </td>
      );
    }
    return (
      <td>&nbsp;</td>
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
