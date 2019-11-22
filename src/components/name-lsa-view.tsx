import { Name } from "@ndn/packet";
import * as React from "react";

import { NameLsa } from "../model";

interface Props {
  lsa: NameLsa;
}

export class NameLsaView extends React.Component<Props> {
  public render() {
    return (
      <React.Fragment>
        {this.props.lsa.names.map(this.renderRow)}
      </React.Fragment>
    );
  }

  private renderOrigin() {
    const lsa = this.props.lsa;
    return (
      <td rowSpan={Math.max(lsa.names.length, 1)}>
        {lsa.originRouter.toString()}
        <small>
          <br/>
          seqNum={lsa.sequenceNumber}
          &nbsp;
          expire={lsa.expirationPeriod}
        </small>
      </td>
    );
  }

  private renderRow = (name: Name, index: number) => {
    const nameStr = name.toString();
    return (
      <tr key={nameStr}>
        {index === 0 ? this.renderOrigin() : undefined}
        <td>{nameStr}</td>
      </tr>
    );
  }
}
