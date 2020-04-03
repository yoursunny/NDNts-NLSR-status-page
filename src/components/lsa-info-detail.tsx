import * as React from "react";

interface Props {
  sequenceNumber: number;
  expirationPeriod: number;
}

export class LsaInfoDetail extends React.Component<Props> {
  public render() {
    return (
      <small>
        seqNum={this.props.sequenceNumber}
        &nbsp;
        expire={this.props.expirationPeriod}
      </small>
    );
  }
}
