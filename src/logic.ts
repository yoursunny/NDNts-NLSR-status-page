import { connectToTestbed } from "@ndn/autoconfig";
import { FwTracer } from "@ndn/fw";
import { Name } from "@ndn/name";
import { Segment as Segment02, Version as Version02 } from "@ndn/naming-convention-02";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decoder } from "@ndn/tlv";

import { NameLsa } from "./model/name-lsa";

FwTracer.enable();

export async function connect(): Promise<string> {
  const faces = await connectToTestbed({
    count: 4,
    preferFastest: true,
  });
  if (faces.length < 1) {
    throw new Error("unable to connect to NDN testbed");
  }
  faces[0].addRoute(new Name("/"));
  return faces[0].toString();
}

export async function fetchNameLsas(): Promise<NameLsa[]> {
  const name = new Name("/ndn/edu/arizona/%C1.Router/hobo/nlsr/lsdb/names");
  const dataset = await discoverVersion(name, {
    segmentNumConvention: Segment02,
    versionConvention: Version02,
  }).then((versioned) => fetch(versioned, {
    segmentNumConvention: Segment02,
  }).promise);

  const decoder = new Decoder(dataset);
  const list = [] as NameLsa[];
  while (!decoder.eof) {
    list.push(decoder.decode(NameLsa));
  }
  return list;
}
