import { Name } from "@ndn/packet";
import { Decoder, EvDecoder } from "@ndn/tlv";

const EVD = new EvDecoder<Lsa>("LsaInfo", 0x80)
  .add(0x81, (t, { vd }) => t.originRouter = vd.decode(Name))
  .add(0x82, (t, { nni }) => t.sequenceNumber = nni)
  .add(0x8B, (t, { nni }) => t.expirationPeriod = nni);

export abstract class Lsa {
  public decodeLsaInfo(decoder: Decoder) {
    EVD.decode(this, decoder);
  }

  public originRouter = new Name();
  public sequenceNumber = 0;
  public expirationPeriod = Infinity;
}
