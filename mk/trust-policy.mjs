import { readFile, writeFile } from "node:fs/promises";

import { LvsModel, toPolicy } from "@ndn/lvs";
import { Decoder } from "@ndn/tlv";
import { printESM } from "@ndn/trust-schema";

const model = Decoder.decode(await readFile("mk/trust-policy.tlv"), LvsModel);
const policy = toPolicy(model);

await writeFile("src/model/trust-policy.ts", printESM(policy));
