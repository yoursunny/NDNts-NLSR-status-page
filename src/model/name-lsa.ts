import { Name, TT } from "@ndn/packet";
import { type Decoder, EvDecoder } from "@ndn/tlv";

import { Lsa } from "./lsa";

const EVD = new EvDecoder<NameLsa>("NameLsa", 0x89)
  .add(0x80, (t, { decoder }) => t.decodeLsaInfo(decoder))
  .add(TT.Name, (t, { decoder }) => t.names.push(decoder.decode(Name)), { repeat: true });

export class NameLsa extends Lsa {
  public static readonly SUFFIX = ["nlsr", "lsdb", "names"];

  public static decodeFrom(decoder: Decoder): NameLsa {
    return EVD.decode(new NameLsa(), decoder);
  }

  public names: Name[] = [];
}
