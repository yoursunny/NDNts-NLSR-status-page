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

// ndnsec_in keychain/root cert-dump -i /yoursunny | base64 -d | xxd -p
const YOURSUNNY_ROOT_1618190329576_HEX = `
06fd0129072a0809796f757273756e6e7908034b455908087319cd8d937b
5ba6080473656c66230800000178c3a8e6e8140918010219040036ee8015
5b3059301306072a8648ce3d020106082a8648ce3d030107034200046af1
9567f65ec0dda977ec53f7e47e2a1dfb77983b4f1e7814a17a150f2ec751
813573c25e6be4a1740e55a57195b001d2d72a4a8f5e42e9e395b1cf640b
f051164b1b01031c1c071a0809796f757273756e6e7908034b4559080873
19cd8d937b5ba6fd00fd26fd00fe0f313937303031303154303030303030
fd00ff0f32303431303430375430313138343917463044022029f81a3b64
6fedcb375656af4e90bceb26379f0eadf2ae428930c3a3677e759502205c
5fad1f9906e1c34b4357d3c50c6c6414abfaca3b3804a54e05f48c51091d
5d`;

const POLICY = `
network = ndn | yoursunny
sitename = <_s1> | (<_s1>/<_s2>) | (<_s1>/<_s2>/<_s3>)

rootcert = <network>/<_KEY>
sitecert = <network>/<sitename>/<_KEY>
operatorcert = <network>/<sitename>/%C1.Operator/<_opid>/<_KEY>
routercert = <network>/<sitename>/%C1.Router/<_routerid>/<_KEY>

lsdbdata = <network>/<sitename>/%C1.Router/<_routerid>/nlsr/lsdb/<_lsatype>/<_version>/<_segment>

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
    YOURSUNNY_ROOT_1618190329576_HEX,
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
