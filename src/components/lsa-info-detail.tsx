import * as React from "react";

interface Props {
  sequenceNumber: bigint;
  expirationPeriod: bigint;
}

export class LsaInfoDetail extends React.Component<Props> {
  public render() {
    return (
      <small>
        seqNum={this.props.sequenceNumber.toString()}
        &nbsp;
        expire={this.props.expirationPeriod.toString()}
      </small>
    );
  }
}
