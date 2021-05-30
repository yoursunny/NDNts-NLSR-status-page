import { Segment as Segment1, Version as Version1 } from "@ndn/naming-convention1";
import { Segment as Segment2, Version as Version2 } from "@ndn/naming-convention2";
import { Name, NamingConvention } from "@ndn/packet";
import pAny from "p-any";

import { AdjacencyLsa, CoordinateLsa, getVerifier, NameLsa, retrieveDataset, RouterDataset } from "./model/mod";

export interface NetworkProfile {
  network: Name;
  routerNames: readonly Name[];
  segmentNumConvention: NamingConvention<number>;
  versionConvention: NamingConvention<number>;
  show: "coordinates"|"adjacencies";
}

export const NetworkProfile: Record<string, NetworkProfile> = {
  ndn: {
    network: new Name("/ndn"),
    routerNames: [
      new Name("/ndn/edu/arizona/%C1.Router/hobo"),
      new Name("/ndn/nl/delft/%C1.Router/ndn-testbed"),
      new Name("/ndn/my/edu/uum/%C1.Router/isan-ndn"),
    ],
    segmentNumConvention: Segment1,
    versionConvention: Version1,
    show: "coordinates",
  },
  yoursunny: {
    network: new Name("/yoursunny"),
    routerNames: [
      new Name("/yoursunny/_/%C1.Router/dal"),
      new Name("/yoursunny/_/%C1.Router/waw"),
    ],
    segmentNumConvention: Segment2,
    versionConvention: Version2,
    show: "adjacencies",
  },
};

export async function fetchDataset({
  routerNames,
  segmentNumConvention,
  versionConvention,
  show,
}: NetworkProfile): Promise<RouterDataset> {
  const abort = new AbortController();
  const options = {
    segmentNumConvention,
    versionConvention,
    signal: abort.signal,
    verifier: await getVerifier(),
  };
  const [from, nameLsas, coordinateLsas, adjacencyLsas] = await pAny(routerNames.map((routerName) => Promise.all([
    routerName,
    retrieveDataset({ routerName, d: NameLsa, ...options }),
    show === "coordinates" ? retrieveDataset({ routerName, d: CoordinateLsa, ...options }) : undefined,
    show === "adjacencies" ? retrieveDataset({ routerName, d: AdjacencyLsa, ...options }) : undefined,
  ])));
  abort.abort();

  const originRouters = Array.from(nameLsas.keys());
  originRouters.sort((a, b) => a.localeCompare(b));
  return {
    from,
    lsas: originRouters.map((originRouter) => {
      const nameLsa = nameLsas.get(originRouter)!;
      return {
        originRouter,
        name: nameLsa.originRouter,
        nameLsa,
        coordinateLsa: coordinateLsas?.get(originRouter),
        adjacencyLsa: adjacencyLsas?.get(originRouter),
      };
    }),
  };
}
