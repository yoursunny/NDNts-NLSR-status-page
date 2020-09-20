import { Decoder, Encoder, EvDecoder } from "@ndn/tlv";

import { Lsa } from "./lsa";

function decodeDouble(value: Uint8Array) {
  return Encoder.asDataView(value).getFloat64(0, false);
}

const EVD = new EvDecoder<CoordinateLsa>("CoordinateLsa", 0x85)
  .add(0x80, (t, { decoder }) => t.decodeLsaInfo(decoder))
  .add(0x87, (t, { value }) => t.radius = decodeDouble(value))
  .add(0x88, (t, { value }) => t.angle.push(decodeDouble(value)), { repeat: true });

export class CoordinateLsa extends Lsa {
  public static readonly SUFFIX = ["nlsr", "lsdb", "coordinates"];

  public static decodeFrom(decoder: Decoder): CoordinateLsa {
    return EVD.decode(new CoordinateLsa(), decoder);
  }

  public radius = 0;
  public angle: number[] = [];
}
