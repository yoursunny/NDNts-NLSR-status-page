import { connectToTestbed } from "@ndn/autoconfig";
import { Endpoint } from "@ndn/endpoint";
import type { FwFace } from "@ndn/fw";
import { Name } from "@ndn/packet";
import { H3Transport } from "@ndn/quic-transport";
import pAny from "p-any";

async function connectH3(): Promise<string> {
  const abort = new AbortController();
  let face: FwFace|undefined;
  try {
    face = await H3Transport.createFace({
      lp: { mtu: 1200 },
    }, "https://lil.quic.g.ndn.today:6367/ndn");
    face.addRoute(new Name("/"));

    const endpoint = new Endpoint({ signal: abort.signal });
    const suffix = Math.floor(Math.random() * 1e8);
    await pAny([
      endpoint.consume(`/ndn/edu/arizona/ping/${suffix}`),
      endpoint.consume(`/ndn/nl/delft/ping/${suffix}`),
      endpoint.consume(`/ndn/my/edu/uum/ping/${suffix}`),
    ]);

    return face.toString();
  } catch (err: unknown) {
    console.warn("HTTP/3 connection error", err);
    face?.close();
    throw err;
  } finally {
    abort.abort();
  }
}

export async function connect(): Promise<string> {
  try { return await connectH3(); } catch {}

  const faces = await connectToTestbed({
    connectTimeout: 5000,
    count: 4,
    fchFallback: ["hobo.cs.arizona.edu", "ndn-testbed.ewi.tudelft.nl", "uum.testbed.named-data.net"],
    preferFastest: true,
  });
  if (faces.length === 0) {
    throw new Error("unable to connect to NDN testbed");
  }
  return faces[0].toString();
}
