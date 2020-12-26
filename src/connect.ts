import { connectToTestbed } from "@ndn/autoconfig";
import { Endpoint } from "@ndn/endpoint";
import { Name } from "@ndn/packet";
import { QuicTransport } from "@ndn/quic-transport";
import pAny from "p-any";

export async function connect(): Promise<string> {
  const abort = new AbortController();
  try {
    const face = await QuicTransport.createFace({}, "quic-transport://quic-gateway-yul.ndn.today:15937/ndn");
    face.addRoute(new Name("/"));

    const endpoint = new Endpoint({ signal: abort.signal });
    const suffix = Math.floor(Math.random() * 1e8);
    await pAny([
      endpoint.consume(`/ndn/edu/arizona/ping/${suffix}`),
      endpoint.consume(`/ndn/kr/anyang/ping/${suffix}`),
    ]);

    return face.toString();
  } catch (err: unknown) {
    console.warn("QUIC connection error", err);
  } finally {
    abort.abort();
  }

  const faces = await connectToTestbed({
    connectTimeout: 5000,
    count: 4,
    fchFallback: ["hobo.cs.arizona.edu", "anyang.testbed.named-data.net"],
    preferFastest: true,
  });
  if (faces.length === 0) {
    throw new Error("unable to connect to NDN testbed");
  }
  return faces[0].toString();
}
