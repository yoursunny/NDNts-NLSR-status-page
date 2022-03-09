import { connectToNetwork, connectToRouter } from "@ndn/autoconfig";
import { H3Transport as ndnH3Transport } from "@ndn/quic-transport";

// disable H3Transport on Android until 2022-03-29 due to https://crbug.com/1293359
const H3Transport = navigator.userAgent.includes("Android") && Date.now() < 1648512000000 ? undefined : ndnH3Transport;

export async function connect(): Promise<string> {
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
      "/yoursunny/_/dal/ping/*",
      "/yoursunny/_/muc/ping/*",
      "/yoursunny/_/sin/ping/*",
    ],
  });
  return faces[0]!.toString();
}
