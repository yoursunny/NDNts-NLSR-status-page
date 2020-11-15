import { connectToTestbed } from "@ndn/autoconfig";
import { Endpoint } from "@ndn/endpoint";
import { Name } from "@ndn/packet";
import { QuicTransport } from "@ndn/quic-transport";

export async function connect(): Promise<string> {
  try {
    const face = await QuicTransport.createFace({}, "quic-transport://quic-gateway-us-ny.ndn.today:6367/ndn");
    face.addRoute(new Name("/"));
    await new Endpoint().consume(`/ndn/edu/arizona/ping/${Math.floor(Math.random() * 1e8)}`);
    return face.toString();
  } catch (err: unknown) {
    console.warn("QUIC connection error", err);
  }

  const faces = await connectToTestbed({
    connectTimeout: 5000,
    count: 4,
    fchFallback: ["hobo.cs.arizona.edu", "titan.cs.memphis.edu"],
    preferFastest: true,
  });
  if (faces.length === 0) {
    throw new Error("unable to connect to NDN testbed");
  }
  // faces[0].addRoute(new Name("/"));
  return faces[0].toString();
}
