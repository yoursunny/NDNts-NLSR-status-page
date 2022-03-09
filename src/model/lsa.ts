import { Component, Name, TT } from "@ndn/packet";
import { Decoder, EvDecoder, NNI } from "@ndn/tlv";
import { asDataView } from "@ndn/util";

const EVD = new EvDecoder<Lsa>("LsaInfo", 0x80)
  .add(TT.Name, (t, { value }) => t.originRouter = new Name(value))
  .add(0x82, (t, { value }) => t.sequenceNumber = NNI.decode(value, { big: true }))
  .add(0x8B, (t, { text }) => t.expirationTime = text);

export abstract class Lsa {
  public decodeLsaInfo(decoder: Decoder) {
    EVD.decode(this, decoder);
  }

  public originRouter = new Name();
  public sequenceNumber = BigInt(0);
  public expirationTime = "";
}

export function decodeDouble(value: Uint8Array): number {
  return asDataView(value).getFloat64(0, false);
}

const C1Router = Component.from("%C1.Router");

export function shortenName(name: Name): readonly Component[] {
  let pos = -1;
  for (const [i, comp] of name.comps.entries()) {
    if (comp.equals(C1Router)) {
      pos = i;
      break;
    }
  }

  if (pos <= 0 || pos === name.length - 1) {
    return name.comps;
  }
  return [name.get(pos - 1)!, name.get(pos + 1)!];
}
