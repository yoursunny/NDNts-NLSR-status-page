import { Segment, Version } from "@ndn/naming-convention1";
import { Name } from "@ndn/packet";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decoder } from "@ndn/tlv";
import pAny from "p-any";

import { NameLsa } from "./model/name-lsa";

async function fetchNameLsaDataset(routerName: Name): Promise<Uint8Array> {
  const name = routerName.append("nlsr", "lsdb", "names");
  const versioned = await discoverVersion(name, {
    segmentNumConvention: Segment,
    versionConvention: Version,
  });
  return fetch.promise(versioned, {
    segmentNumConvention: Segment,
  });
}

function decodeNameLsaDataset(dataset: Uint8Array): NameLsa[] {
  const decoder = new Decoder(dataset);
  const list: NameLsa[] = [];
  while (!decoder.eof) {
    list.push(decoder.decode(NameLsa));
  }
  return list;
}

const routerNames: Name[] = [
  new Name("/ndn/edu/arizona/%C1.Router/hobo"),
  new Name("/ndn/edu/wustl/%C1.Router/wundngw"),
  new Name("/ndn/it/unipd/%C1.Router/ndnnode"),
  new Name("/ndn/kr/anyang/%C1.Router/anyanghub"),
];

export async function fetchNameLsas(): Promise<NameLsa[]> {
  const dataset = await pAny(routerNames.map((router) => fetchNameLsaDataset(router)));
  return decodeNameLsaDataset(dataset);
}
