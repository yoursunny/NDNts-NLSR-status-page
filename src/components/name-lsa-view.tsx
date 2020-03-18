import { AltUri, Name } from "@ndn/packet";
import { toHex } from "@ndn/tlv";
import * as React from "react";

import { NameLsa } from "../model";

interface Props {
  lsa: NameLsa;
}

export class NameLsaView extends React.Component<Props> {
  public render() {
    return this.props.lsa.names.map(this.renderRow);
  }

  private renderOrigin() {
    const lsa = this.props.lsa;
    return (
      <td rowSpan={Math.max(lsa.names.length, 1)}>
        {AltUri.ofName(lsa.originRouter)}
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
    return (
      <tr key={toHex(name.value)}>
        {index === 0 ? this.renderOrigin() : undefined}
        <td>{AltUri.ofName(name)}</td>
      </tr>
    );
  };
}
