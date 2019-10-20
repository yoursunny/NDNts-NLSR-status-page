import { Forwarder, SimpleEndpoint } from "@ndn/fw";
import { L3Face } from "@ndn/l3face";
import { Interest } from "@ndn/l3pkt";
import { Name } from "@ndn/name";
import { Segment as Segment02 } from "@ndn/naming-convention-02";
import { fetch } from "@ndn/segmented-object";
import { Decoder } from "@ndn/tlv";
import { WsTransport } from "@ndn/ws-transport";

import { NameLsa } from "./model/name-lsa";

export async function connect(): Promise<void> {
  const transport = await WsTransport.connect("wss://titan.cs.memphis.edu/ws/");
  const face = Forwarder.getDefault().addFace(new L3Face(transport));
  face.addRoute(new Name("/"));
}

export async function fetchNameLsas(): Promise<NameLsa[]> {
  const se = new SimpleEndpoint();
  // find version number
  const data = await se.consume(new Interest("/ndn/edu/arizona/%C1.Router/hobo/nlsr/lsdb/names",
                                             Interest.CanBePrefix, Interest.MustBeFresh));

  // retrieve segmented object with version number
  // TODO integrate version discovery into @ndn/segmented-object package
  const dataset = await fetch(data.name.getPrefix(-1),
                              { segmentNumConvention: Segment02 }).promise;

  const decoder = new Decoder(dataset);
  const list = [] as NameLsa[];
  while (!decoder.eof) {
    list.push(decoder.decode(NameLsa));
  }
  return list;
}
