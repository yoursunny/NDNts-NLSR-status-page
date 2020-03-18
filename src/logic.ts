import { connectToTestbed } from "@ndn/autoconfig";
import { FwTracer } from "@ndn/fw";
import { Segment, Version } from "@ndn/naming-convention1";
import { Name } from "@ndn/packet";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decoder } from "@ndn/tlv";

import { NameLsa } from "./model/name-lsa";

FwTracer.enable();

export async function connect(): Promise<string> {
  const faces = await connectToTestbed({
    connectTimeout: 5000,
    count: 4,
    fchFallback: ["hobo.cs.arizona.edu", "titan.cs.memphis.edu"],
    preferFastest: true,
  });
  if (faces.length === 0) {
    throw new Error("unable to connect to NDN testbed");
  }
  faces[0].addRoute(new Name("/"));
  return faces[0].toString();
}

export async function fetchNameLsas(): Promise<NameLsa[]> {
  const name = new Name("/ndn/edu/arizona/%C1.Router/hobo/nlsr/lsdb/names");
  const versioned = await discoverVersion(name, {
    segmentNumConvention: Segment,
    versionConvention: Version,
  });
  const dataset = await fetch.promise(versioned, {
    segmentNumConvention: Segment,
  });

  const decoder = new Decoder(dataset);
  const list = [] as NameLsa[];
  while (!decoder.eof) {
    list.push(decoder.decode(NameLsa));
  }
  return list;
}
