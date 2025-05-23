import { Name } from "@ndn/packet";
import { console } from "@ndn/util";

import { AdjacencyLsa, CoordinateLsa, NameLsa, retrieveDataset, type RouterDataset, verifier } from "./model/mod";

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
      new Name("/ndn/pt/uminho/%C1.Router/vnetlab"),
      new Name("/ndn/jp/waseda/%C1.Router/ndn-tb"),
    ],
    show: "adjacencies",
  },
  yoursunny: {
    network: new Name("/yoursunny"),
    routerNames: [
      new Name("/yoursunny/_/%C1.Router/iah"),
      new Name("/yoursunny/_/%C1.Router/otp"),
      new Name("/yoursunny/_/%C1.Router/syd"),
    ],
    show: "adjacencies",
  },
};

export async function fetchDataset({
  routerNames,
  show,
}: NetworkProfile, signal: AbortSignal): Promise<RouterDataset> {
  const options = { signal, verifier };
  const [from, nameLsas, coordinateLsas, adjacencyLsas] = await Promise.any(routerNames.map(async (routerName) => {
    try {
      return await Promise.all([
        routerName,
        retrieveDataset({ routerName, d: NameLsa, ...options }),
        show === "coordinates" ? retrieveDataset({ routerName, d: CoordinateLsa, ...options }) : undefined,
        show === "adjacencies" ? retrieveDataset({ routerName, d: AdjacencyLsa, ...options }) : undefined,
      ]);
    } catch (err: unknown) {
      console.warn(`${routerName} ${err}`);
      throw err;
    }
  }));

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
