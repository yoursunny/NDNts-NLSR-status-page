import { Name } from "@ndn/packet";

import { type RouterDataset, AdjacencyLsa, CoordinateLsa, NameLsa, retrieveDataset, verifier } from "./model/mod";

export interface NetworkProfile {
  network: Name;
  routerNames: readonly Name[];
  show: "coordinates" | "adjacencies";
}

export const NetworkProfile: Record<string, NetworkProfile> = {
  ndn: {
    network: new Name("/ndn"),
    routerNames: [
      new Name("/ndn/edu/arizona/%C1.Router/hobo"),
      new Name("/ndn/uk/ac/qub/%C1.Router/ndn"),
      new Name("/ndn/jp/waseda/%C1.Router/ndn-tb"),
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
  },
};

export async function fetchDataset({
  routerNames,
  show,
}: NetworkProfile, signal: AbortSignal): Promise<RouterDataset> {
  const options = { signal, verifier };
  const [from, nameLsas, coordinateLsas, adjacencyLsas] = await Promise.any(routerNames.map((routerName) => Promise.all([
    routerName,
    retrieveDataset({ routerName, d: NameLsa, ...options }),
    show === "coordinates" ? retrieveDataset({ routerName, d: CoordinateLsa, ...options }) : undefined,
    show === "adjacencies" ? retrieveDataset({ routerName, d: AdjacencyLsa, ...options }) : undefined,
  ])));

  const originRouters = Array.from(nameLsas, ([router]) => router);
  originRouters.sort((a, b) => a.compare(b));
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
