import { Segment, Version } from "@ndn/naming-convention1";
import { ComponentLike, Name } from "@ndn/packet";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decodable, Decoder, toHex } from "@ndn/tlv";
import pAny from "p-any";

import { CoordinateLsa, Lsa, NameLsa } from "./model";
import { getVerifier } from "./model/trust";

async function fetchDataset(routerName: Name, suffix: ComponentLike[]): Promise<Uint8Array> {
  const verifier = await getVerifier();
  const name = routerName.append(...suffix);
  const versioned = await discoverVersion(name, {
    segmentNumConvention: Segment,
    versionConvention: Version,
    verifier,
  });
  return fetch.promise(versioned, {
    segmentNumConvention: Segment,
    verifier,
  });
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
  new Name("/ndn/edu/wustl/%C1.Router/wundngw"),
  new Name("/ndn/it/unipd/%C1.Router/ndnnode"),
  new Name("/ndn/kr/anyang/%C1.Router/anyanghub"),
];

async function fetchCoordinateLsas(): Promise<CoordinateLsa[]> {
  const dataset = await pAny(routerNames.map((router) => fetchDataset(router, CoordinateLsa.SUFFIX)));
  return decodeDataset(dataset, CoordinateLsa);
}

async function fetchNameLsas(): Promise<NameLsa[]> {
  const dataset = await pAny(routerNames.map((router) => fetchDataset(router, NameLsa.SUFFIX)));
  return decodeDataset(dataset, NameLsa);
}

export interface RouterLsa {
  originRouter: string;
  name: Name;
  coordinateLsa?: CoordinateLsa;
  nameLsa?: NameLsa;
}

export async function fetchLsas(): Promise<RouterLsa[]> {
  const [coordinateLsaList, nameLsaList] = await Promise.all([
    fetchCoordinateLsas(),
    fetchNameLsas(),
  ]);
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
