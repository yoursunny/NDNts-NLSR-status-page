import { Segment, Version } from "@ndn/naming-convention1";
import { ComponentLike, Name } from "@ndn/packet";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decodable, Decoder, toHex } from "@ndn/tlv";
import pAny from "p-any";

import { CoordinateLsa, getVerifier, Lsa, NameLsa } from "./model/mod";

async function fetchDataset(routerName: Name, suffix: ComponentLike[], signal: AbortSignal): Promise<Uint8Array> {
  const verifier = await getVerifier();
  const name = routerName.append(...suffix);
  const versioned = await discoverVersion(name, {
    segmentNumConvention: Segment,
    versionConvention: Version,
    signal,
    verifier,
  });

  const dataset = await fetch(versioned, {
    segmentNumConvention: Segment,
    signal,
    verifier,
  });
  return dataset;
}

function decodeDataset<R>(dataset: Uint8Array, d: Decodable<R>): R[] {
  const decoder = new Decoder(dataset);
  const list: R[] = [];
  while (!decoder.eof) {
    list.push(decoder.decode(d));
  }
  return list;
}

const routerNames: Name[] = [
  new Name("/ndn/edu/arizona/%C1.Router/hobo"),
  new Name("/ndn/nl/delft/%C1.Router/ndn-testbed"),
  new Name("/ndn/my/edu/uum/%C1.Router/isan-ndn"),
];

export interface RouterLsa {
  originRouter: string;
  name: Name;
  coordinateLsa?: CoordinateLsa;
  nameLsa?: NameLsa;
}

export async function fetchLsas(): Promise<RouterLsa[]> {
  const abort = new AbortController();
  const [coordinateLsaList, nameLsaList] = await pAny(routerNames.map((router) => Promise.all([
    fetchDataset(router, CoordinateLsa.SUFFIX, abort.signal)
      .then((dataset) => decodeDataset(dataset, CoordinateLsa)),
    fetchDataset(router, NameLsa.SUFFIX, abort.signal)
      .then((dataset) => decodeDataset(dataset, NameLsa)),
  ])));
  abort.abort();

  const coordinateLsaMap = lsaListToMap(coordinateLsaList);
  const nameLsaMap = lsaListToMap(nameLsaList);
  const originRouters = Array.from(new Set([...coordinateLsaMap.keys(), ...nameLsaMap.keys()]));
  originRouters.sort((a, b) => a.localeCompare(b));
  return originRouters.map((originRouter) => {
    const coordinateLsa = coordinateLsaMap.get(originRouter);
    const nameLsa = nameLsaMap.get(originRouter);
    return {
      originRouter,
      name: (coordinateLsa ?? nameLsa)!.originRouter,
      coordinateLsa,
      nameLsa,
    };
  });
}

function lsaListToMap<T extends Lsa>(list: readonly T[]): Map<string, T> {
  const m = new Map<string, T>();
  for (const lsa of list) {
    m.set(toHex(lsa.originRouter.value), lsa);
  }
  return m;
}
