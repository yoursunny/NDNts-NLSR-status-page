import { h } from "preact";

interface Props {
  sequenceNumber: bigint;
  expirationTime: string;
}

export function LsaInfoDetail(props: Props) {
  return (
    <small>
      seqNum={props.sequenceNumber.toString()}
      &nbsp;
      expire={props.expirationTime}
    </small>
  );
}
