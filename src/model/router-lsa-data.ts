import type { ComponentLike, Name, NamingConvention, Verifier } from "@ndn/packet";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { Decodable, Decoder, toHex } from "@ndn/tlv";

import type { AdjacencyLsa } from "./adjacency-lsa";
import type { CoordinateLsa } from "./coordinate-lsa";
import type { Lsa } from "./lsa";
import type { NameLsa } from "./name-lsa";

export interface RouterDataset {
  from: Name;
  lsas: RouterLsaData[];
}

export interface RouterLsaData {
  originRouter: string;
  name: Name;
  nameLsa: NameLsa;
  coordinateLsa?: CoordinateLsa;
  adjacencyLsa?: AdjacencyLsa;
}

export async function retrieveDataset<R extends Lsa>({
  routerName,
  d,
  segmentNumConvention,
  versionConvention,
  signal,
  verifier,
}: retrieveDataset.Options<R>): Promise<Map<string, R>> {
  const name = routerName.append(...d.SUFFIX);
  const versioned = await discoverVersion(name, {
    segmentNumConvention,
    versionConvention,
    signal,
    verifier,
  });

  const dataset = await fetch(versioned, {
    segmentNumConvention,
    signal,
    verifier,
  });

  const decoder = new Decoder(dataset);
  const m = new Map<string, R>();
  while (!decoder.eof) {
    const lsa = decoder.decode(d);
    m.set(toHex(lsa.originRouter.value), lsa);
  }
  return m;
}

export namespace retrieveDataset {
  export interface Options<R extends Lsa> {
    routerName: Name;
    d: Decodable<R> & { SUFFIX: readonly ComponentLike[] };
    segmentNumConvention: NamingConvention<number>;
    versionConvention: NamingConvention<number>;
    signal: AbortSignal;
    verifier: Verifier;
  }
}
