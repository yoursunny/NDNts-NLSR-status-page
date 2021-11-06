#!/usr/bin/env -S node --loader tsm
import { printESM, versec2021 } from "@ndn/trust-schema";
import { writeFileSync } from "node:fs";

const policy = versec2021.load(`
_network: "ndn" | "yoursunny"
_sitename: s1 | (s1/s2) | (s1/s2/s3)
_routername: _network/_sitename/"%C1.Router"/routerid

rootcert: _network/_CERT
sitecert: _network/_sitename/_CERT
operatorcert: _network/_sitename/"%C1.Operator"/opid/_CERT
routercert: _routername/_CERT
lsdbdata: _routername/"nlsr"/"lsdb"/lsatype/version/segment

lsdbdata <= routercert <= operatorcert <= sitecert <= rootcert
_CERT: "KEY"/_/_/_
`);

writeFileSync("src/model/trust-policy.ts", printESM(policy));