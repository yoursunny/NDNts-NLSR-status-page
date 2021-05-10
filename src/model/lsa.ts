import { Name, TT } from "@ndn/packet";
import { Decoder, EvDecoder, NNI } from "@ndn/tlv";

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
