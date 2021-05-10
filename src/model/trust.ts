import { Certificate } from "@ndn/keychain";
import { Data, Verifier } from "@ndn/packet";
import { Decoder, fromHex } from "@ndn/tlv";
import { TrustSchema, TrustSchemaVerifier, versec2019 } from "@ndn/trust-schema";

// curl -sfL https://named-data.net/ndnsec/ndn-testbed-root-x3.ndncert | xxd -p
const NDN_TESTBED_ROOT_X3_HEX = `
06fd0149072408036e646e08034b45590808ecf14c8e512315e008036e64
6e0809fd00000175e67f3210140918010219040036ee80155b3059301306
072a8648ce3d020106082a8648ce3d030107034200041b1fb763816f628d
5e49c22f803ef8950850773378cead36d5da29f2dee419f1297c674a7f61
c6a679f8feaa05f62275c94644ffb35af33ccee314fa46920cd116701b01
031c16071408036e646e08034b45590808ecf14c8e512315e0fd00fd26fd
00fe0f323032303131323054313633313337fd00ff0f3230323431323331
54323335393539fd010227fd020023fd02010866756c6c6e616d65fd0202
134e444e205465737462656420526f6f7420583317473045022100fc86bb
53ea862f4d722da5fcb834883702b078b7675086029c85e6b3a8280ada02
2053c0b1766141760e6596ba1e40712d9cf6b6a8770ea88b919a18e250d8
09c5a9`;

const POLICY = `
network = ndn
sitename = <_s1> | (<_s1>/<_s2>) | (<_s1>/<_s2>/<_s3>)

rootcert = <network>/<_KEY>
sitecert = <network>/<sitename>/<_KEY>
operatorcert = <network>/<sitename>/%C1.Operator/<_opid>/<_KEY>
routercert = <network>/<sitename>/%C1.Router/<_routerid>/<_KEY>

lsdbdata = ndn/<sitename>/%C1.Router/<_routerid>/nlsr/lsdb/<_lsatype>/<_version>/<_segment>

lsdbdata <= routercert <= operatorcert <= sitecert <= rootcert
`;

async function importRootCert(hex: string): Promise<Certificate> {
  const data = new Decoder(fromHex(hex.replace(/\s+/g, ""))).decode(Data);
  const cert = Certificate.fromData(data);
  await cert.createVerifier();
  return cert;
}

async function makeVerifier(): Promise<Verifier> {
  const trustAnchors = await Promise.all([
    NDN_TESTBED_ROOT_X3_HEX,
  ].map((hex) => importRootCert(hex)));
  const policy = versec2019.load(POLICY);
  const schema = new TrustSchema(policy, trustAnchors);
  return new TrustSchemaVerifier({ schema });
}

let verifierPromise: Promise<Verifier>|undefined;

export function getVerifier(): Promise<Verifier> {
  verifierPromise ??= makeVerifier();
  return verifierPromise;
}
