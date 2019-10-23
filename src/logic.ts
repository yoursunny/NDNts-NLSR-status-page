import { Forwarder } from "@ndn/fw";
import { L3Face } from "@ndn/l3face";
import { Name } from "@ndn/name";
import { Segment as Segment02, Version as Version02 } from "@ndn/naming-convention-02";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decoder } from "@ndn/tlv";
import { WsTransport } from "@ndn/ws-transport";

import { NameLsa } from "./model/name-lsa";

export async function connect(): Promise<void> {
  const transport = await WsTransport.connect("wss://titan.cs.memphis.edu/ws/");
  const face = Forwarder.getDefault().addFace(new L3Face(transport));
  face.addRoute(new Name("/"));
}

export async function fetchNameLsas(): Promise<NameLsa[]> {
  // find version number
  const versioned = await discoverVersion(
    new Name("/ndn/edu/arizona/%C1.Router/hobo/nlsr/lsdb/names"),
    {
      segmentNumConvention: Segment02,
      versionConvention: Version02,
    });

  // retrieve segmented object with version number
  const dataset = await fetch(versioned, { segmentNumConvention: Segment02 }).promise;

  const decoder = new Decoder(dataset);
  const list = [] as NameLsa[];
  while (!decoder.eof) {
    list.push(decoder.decode(NameLsa));
  }
  return list;
}
