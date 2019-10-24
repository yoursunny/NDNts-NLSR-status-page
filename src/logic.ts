import { connectToTestbed } from "@ndn/fch";
import { FwTracer } from "@ndn/fw";
import { Name } from "@ndn/name";
import { Segment as Segment02, Version as Version02 } from "@ndn/naming-convention-02";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decoder } from "@ndn/tlv";

import { NameLsa } from "./model/name-lsa";

FwTracer.enable();

export async function connect(): Promise<void> {
  const faces = await connectToTestbed({ count: 4 });
  faces.forEach((face, i) => {
    if (i > 0) {
      face.close();
    } else {
      face.addRoute(new Name("/"));
    }
  });
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
