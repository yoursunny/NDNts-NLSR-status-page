import { Name } from "@ndn/packet";
import { Decoder, EvDecoder, NNI } from "@ndn/tlv";

const EVD = new EvDecoder<Lsa>("LsaInfo", 0x80)
  .add(0x81, (t, { vd }) => t.originRouter = vd.decode(Name))
  .add(0x82, (t, { value }) => t.sequenceNumber = NNI.decode(value, { big: true }))
  .add(0x8B, (t, { value }) => t.expirationPeriod = NNI.decode(value, { big: true }));

export abstract class Lsa {
  public decodeLsaInfo(decoder: Decoder) {
    EVD.decode(this, decoder);
  }

  public originRouter = new Name();
  public sequenceNumber!: bigint;
  public expirationPeriod!: bigint;
}
