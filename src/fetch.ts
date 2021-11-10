import { Segment as Segment1, Version as Version1 } from "@ndn/naming-convention1";
import { Segment2, Version2 } from "@ndn/naming-convention2";
import { Name, NamingConvention } from "@ndn/packet";

import { AdjacencyLsa, CoordinateLsa, NameLsa, retrieveDataset, RouterDataset, verifier } from "./model/mod";

export interface NetworkProfile {
  network: Name;
  routerNames: readonly Name[];
  segmentNumConvention: NamingConvention<number>;
  versionConvention: NamingConvention<number>;
  show: "coordinates" | "adjacencies";
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
      new Name("/yoursunny/_/%C1.Router/muc"),
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
}: NetworkProfile, signal: AbortSignal): Promise<RouterDataset> {
  const options = {
    segmentNumConvention,
    versionConvention,
    signal,
    verifier,
  };
  // https://github.com/dustinspecker/obj-props/issues/4
  // eslint-disable-next-line no-use-extend-native/no-use-extend-native
  const [from, nameLsas, coordinateLsas, adjacencyLsas] = await Promise.any(routerNames.map((routerName) => Promise.all([
    routerName,
    retrieveDataset({ routerName, d: NameLsa, ...options }),
    show === "coordinates" ? retrieveDataset({ routerName, d: CoordinateLsa, ...options }) : undefined,
    show === "adjacencies" ? retrieveDataset({ routerName, d: AdjacencyLsa, ...options }) : undefined,
  ])));

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
