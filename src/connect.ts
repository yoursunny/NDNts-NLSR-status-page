import { connectToNetwork, connectToRouter } from "@ndn/autoconfig";

export async function connect(): Promise<string> {
  void connectToRouter("wss://nrt.ws.ndn.net.eu.org/ws/", {
    addRoutes: ["/pcnl"],
  });

  const faces = await connectToNetwork({
    fallback: ["hobo.cs.arizona.edu", "ndn.qub.ac.uk", "ndntestbed.iiit.ac.in"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/uk/ac/qub/ping/*",
      "/ndn/in/ac/iiith/ping/*",
      "/yoursunny/_/dal/ping/*",
      "/yoursunny/_/muc/ping/*",
      "/yoursunny/_/sin/ping/*",
    ],
  });
  return faces[0]!.toString();
}
