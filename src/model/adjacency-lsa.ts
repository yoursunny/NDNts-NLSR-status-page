import { Name, TT } from "@ndn/packet";
import { Decoder, EvDecoder } from "@ndn/tlv";

import { decodeDouble, Lsa } from "./lsa";

const AdjacencyEVD = new EvDecoder<Adjacency>("Adjacency", 0x84)
  .add(TT.Name, (t, { decoder }) => t.name = decoder.decode(Name))
  .add(0x8D, (t, { text }) => t.uri = text)
  .add(0x8C, (t, { value }) => t.cost = decodeDouble(value));

const EVD = new EvDecoder<AdjacencyLsa>("AdjacencyLsa", 0x83)
  .add(0x80, (t, { decoder }) => t.decodeLsaInfo(decoder))
  .add(0x84, (t, { decoder }) => t.adjacencies.push(AdjacencyEVD.decode({} as Adjacency, decoder)), { repeat: true });

export interface Adjacency {
  name: Name;
  uri: string;
  cost: number;
}

export class AdjacencyLsa extends Lsa {
  public static readonly SUFFIX = ["nlsr", "lsdb", "adjacencies"];

  public static decodeFrom(decoder: Decoder): AdjacencyLsa {
    return EVD.decode(new AdjacencyLsa(), decoder);
  }

  public adjacencies: Adjacency[] = [];
}
