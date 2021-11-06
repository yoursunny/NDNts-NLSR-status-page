import { connectToNetwork } from "@ndn/autoconfig";

export async function connect(): Promise<string> {
  const faces = await connectToNetwork({
    fallback: ["hobo.cs.arizona.edu", "ndn-testbed.ewi.tudelft.nl", "uum.testbed.named-data.net"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/nl/delft/ping/*",
      "/ndn/my/edu/uum/ping/*",
      "/yoursunny/_/dal/ping/*",
      "/yoursunny/_/muc/ping/*",
    ],
  });
  return faces[0]!.toString();
}
