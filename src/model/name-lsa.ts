import { Name, TT } from "@ndn/packet";
import { type Decoder, EvDecoder } from "@ndn/tlv";

import { decodeDouble, Lsa } from "./lsa";

const PrefixInfoEVD = new EvDecoder<PrefixInfo>("PrefixInfo")
  .add(TT.Name, (t, { decoder }) => t.name = decoder.decode(Name), { required: true })
  .add(0x8C, (t, { value }) => t.cost = decodeDouble(value));

const NameLsaEVD = new EvDecoder<NameLsa>("NameLsa", 0x89)
  .add(0x80, (t, { decoder }) => t.decodeLsaInfo(decoder))
  .add(TT.Name, (t, { decoder }) => t.prefixes.push({
    name: decoder.decode(Name),
  }), { repeat: true })
  .add(0x92, (t, { vd }) => t.prefixes.push(
    PrefixInfoEVD.decodeValue({} as PrefixInfo, vd),
  ), { repeat: true });

export class NameLsa extends Lsa {
  public static readonly SUFFIX = ["nlsr", "lsdb", "names"];

  public static decodeFrom(decoder: Decoder): NameLsa {
    return NameLsaEVD.decode(new NameLsa(), decoder);
  }

  public prefixes: PrefixInfo[] = [];
}

export interface PrefixInfo {
  name: Name;
  cost?: number;
}
