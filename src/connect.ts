import { connectToNetwork } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

export async function connect(): Promise<string> {
  const faces = await connectToNetwork({
    H3Transport,
    fallback: ["hobo.cs.arizona.edu", "vnetlab.gcom.di.uminho.pt"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/pt/uminho/ping/*",
      "/ndn/jp/waseda/ping/*",
      "/yoursunny/_/mdw/ping/*",
      "/yoursunny/_/lil/ping/*",
      "/yoursunny/_/bom/ping/*",
    ],
  });
  return `${faces[0]}`;
}
