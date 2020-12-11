import { Component, h } from "preact";

interface Props {
  sequenceNumber: bigint;
  expirationTime: string;
}

export class LsaInfoDetail extends Component<Props> {
  public render() {
    return (
      <small>
        seqNum={this.props.sequenceNumber.toString()}
        &nbsp;
        expire={this.props.expirationTime}
      </small>
    );
  }
}
