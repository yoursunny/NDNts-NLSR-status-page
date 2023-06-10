import { connectToNetwork } from "@ndn/autoconfig";
import { H3Transport } from "@ndn/quic-transport";

export async function connect(): Promise<string> {
  const faces = await connectToNetwork({
    H3Transport,
    fallback: ["hobo.cs.arizona.edu", "vnetlab.gcom.di.uminho.pt", "ndntestbed.iiit.ac.in"],
    testConnection: [
      "/ndn/edu/arizona/ping/*",
      "/ndn/pt/uminho/ping/*",
      "/ndn/in/ac/iiith/ping/*",
      "/yoursunny/_/mdw/ping/*",
      "/yoursunny/_/ley/ping/*",
      "/yoursunny/_/bom/ping/*",
    ],
  });
  return `${faces[0]}`;
}
