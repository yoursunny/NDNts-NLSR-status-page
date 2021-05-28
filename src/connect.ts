import { connectToNetwork } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

export async function connect(): Promise<string> {
  const faces = await connectToNetwork({
    H3Transport,
    fallback: ["hobo.cs.arizona.edu", "ndn-testbed.ewi.tudelft.nl", "uum.testbed.named-data.net"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/nl/delft/ping/*",
      "/ndn/my/edu/uum/ping/*",
      "/yoursunny/_/dal/ping/*",
      "/yoursunny/_/waw/ping/*",
    ],
  });
  return faces[0]!.toString();
}
