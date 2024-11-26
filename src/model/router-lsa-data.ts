import { type ComponentLike, type Name, NameMap, type Verifier } from "@ndn/packet";
import { discoverVersion, fetch } from "@ndn/segmented-object";
import { type Decodable, Decoder } from "@ndn/tlv";

import type { AdjacencyLsa } from "./adjacency-lsa";
import type { CoordinateLsa } from "./coordinate-lsa";
import type { Lsa } from "./lsa";
import type { NameLsa } from "./name-lsa";

export interface RouterDataset {
  from: Name;
  lsas: RouterLsaData[];
}

export interface RouterLsaData {
  originRouter: Name;
  name: Name;
  nameLsa: NameLsa;
  coordinateLsa?: CoordinateLsa;
  adjacencyLsa?: AdjacencyLsa;
}

export async function retrieveDataset<R extends Lsa>({
  routerName,
  d,
  signal,
  verifier,
}: retrieveDataset.Options<R>): Promise<NameMap<R>> {
  const cOpts = { signal, verifier };
  const name = routerName.append(...d.SUFFIX);
  const versioned = await discoverVersion(name, { cOpts });
  const dataset = await fetch(versioned, { cOpts });

  const decoder = new Decoder(dataset);
  const m = new NameMap<R>();
  while (!decoder.eof) {
    const lsa = decoder.decode(d);
    m.set(lsa.originRouter, lsa);
  }
  return m;
}

export namespace retrieveDataset {
  export interface Options<R extends Lsa> {
    routerName: Name;
    d: Decodable<R> & { SUFFIX: readonly ComponentLike[] };
    signal: AbortSignal;
    verifier: Verifier;
  }
}
