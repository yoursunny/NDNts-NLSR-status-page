import { connectToNetwork, connectToRouter } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

export async function connect(): Promise<string> {
  // PCNL has no peering with NDN testbed, make it go to yoursunny ndn6 network
  void connectToRouter("wss://nrt.ws.ndn.net.eu.org/ws/", {
    addRoutes: ["/pcnl"],
  });

  const faces = await connectToNetwork({
    H3Transport,
    fallback: ["hobo.cs.arizona.edu", "ndn.qub.ac.uk", "ndntestbed.iiit.ac.in"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/uk/ac/qub/ping/*",
      "/ndn/in/ac/iiith/ping/*",
      "/yoursunny/_/lax/ping/*",
      "/yoursunny/_/muc/ping/*",
      "/yoursunny/_/sin/ping/*",
    ],
  });
  return faces[0]!.toString();
}
