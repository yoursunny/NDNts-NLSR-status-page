import { FwHint, Name, noopSigning } from "@ndn/packet";

import { AdjacencyLsa, CoordinateLsa, NameLsa, retrieveDataset, RouterDataset, verifier } from "./model/mod";

export interface NetworkProfile {
  network: Name;
  routerNames: readonly Name[];
  show: "coordinates" | "adjacencies";
  fwHint?: FwHint;
  noVerify?: boolean;
}

export const NetworkProfile: Record<string, NetworkProfile> = {
  ndn: {
    network: new Name("/ndn"),
    routerNames: [
      new Name("/ndn/edu/arizona/%C1.Router/hobo"),
      new Name("/ndn/uk/ac/qub/%C1.Router/ndn"),
      new Name("/ndn/in/ac/iiith/%C1.Router/ndntestbed"),
    ],
    show: "coordinates",
  },
  yoursunny: {
    network: new Name("/yoursunny"),
    routerNames: [
      new Name("/yoursunny/_/%C1.Router/dal"),
      new Name("/yoursunny/_/%C1.Router/muc"),
      new Name("/yoursunny/_/%C1.Router/sin"),
    ],
    show: "adjacencies",
  },
  pcnl: {
    network: new Name("/pcnl"),
    routerNames: [
      new Name("/pcnl/ndn-testbed/_/%C1.Router/BJ-01"),
      new Name("/pcnl/ndn-testbed/_/%C1.Router/HK-01"),
      new Name("/pcnl/ndn-testbed/_/%C1.Router/SZ-01"),
    ],
    show: "adjacencies",
    fwHint: new FwHint("/yoursunny"),
    noVerify: true,
  },
};

export async function fetchDataset({
  routerNames,
  show,
  fwHint,
  noVerify,
}: NetworkProfile, signal: AbortSignal): Promise<RouterDataset> {
  const options = {
    signal,
    fwHint,
    verifier: noVerify ? noopSigning : verifier,
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
