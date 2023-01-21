import { connectToNetwork, connectToRouter } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

export async function connect(): Promise<string> {
  const faces = await connectToNetwork({
    H3Transport,
    fallback: ["hobo.cs.arizona.edu", "ndn.qub.ac.uk", "ndntestbed.iiit.ac.in"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/uk/ac/qub/ping/*",
      "/ndn/in/ac/iiith/ping/*",
      "/yoursunny/_/mdw/ping/*",
      "/yoursunny/_/ley/ping/*",
      "/yoursunny/_/bom/ping/*",
    ],
  });
  const uri = `${faces[0]}`;

  if (!uri.includes(".ndn.net.eu.org")) {
    // PCNL does not peer with NDN testbed, make it go to yoursunny ndn6 network
    void connectToRouter("wss://sea.ws.ndn.net.eu.org/ws/", {
      addRoutes: ["/pcnl"],
    });
  }

  return uri;
}
