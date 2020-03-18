import { connectToTestbed } from "@ndn/autoconfig";
import { FwTracer } from "@ndn/fw";
import { Name } from "@ndn/packet";

FwTracer.enable();

export async function connect(): Promise<string> {
  const faces = await connectToTestbed({
    connectTimeout: 5000,
    count: 4,
    fchFallback: ["hobo.cs.arizona.edu", "titan.cs.memphis.edu"],
    preferFastest: true,
  });
  if (faces.length === 0) {
    throw new Error("unable to connect to NDN testbed");
  }
  faces[0].addRoute(new Name("/"));
  return faces[0].toString();
}
