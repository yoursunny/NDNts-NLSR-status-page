import { connectToNetwork } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

export async function connect(): Promise<string> {
  const faces = await connectToNetwork({
    H3Transport,
    fallback: ["hobo.cs.arizona.edu", "frankfurt.testbed.named-data.net"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/pcl/frankfurt/ping/*",
      "/ndn/jp/waseda/ping/*",
      "/yoursunny/_/mdw/ping/*",
      "/yoursunny/_/otp/ping/*",
      "/yoursunny/_/syd/ping/*",
    ],
  });
  return `${faces[0]}`;
}
