import { Certificate } from "@ndn/keychain";
import { Data, Verifier } from "@ndn/packet";
import { Decoder, fromHex } from "@ndn/tlv";
import { TrustSchema, TrustSchemaVerifier, versec2019 } from "@ndn/trust-schema";

// curl -sL https://named-data.net/ndnsec/ndn-testbed-root-v2.ndncert | xxd -p
const NDN_TESTBED_ROOT_V2_HEX = `
06fd023b072408036e646e08034b45590808659d7fa5c581107d08036e64
6e0809fd00000160714a519b140918010219040036ee8015fd014f308201
4b3082010306072a8648ce3d02013081f7020101302c06072a8648ce3d01
01022100ffffffff00000001000000000000000000000000ffffffffffff
ffffffffffff305b0420ffffffff00000001000000000000000000000000
fffffffffffffffffffffffc04205ac635d8aa3a93e7b3ebbd55769886bc
651d06b0cc53b0f63bce3c3e27d2604b031500c49d360886e704936a6678
e1139d26b7819f7e900441046b17d1f2e12c4247f8bce6e563a440f27703
7d812deb33a0f4a13945d898c2964fe342e2fe1a7f9b8ee7eb4a7c0f9e16
2bce33576b315ececbb6406837bf51f5022100ffffffff00000000ffffff
ffffffffffbce6faada7179e84f3b9cac2fc632551020101034200040508
76a6ad49f9678babbd5ced994a6040f8c8c3c24c764623ed0822ec9b8a0a
567d89c9f6bfc8e4a066c786aa74c475b375ac35af9488009b12343145d5
3358166d1b01031c16071408036e646e08034b45590808659d7fa5c58110
7dfd00fd26fd00fe0f323031373132323054303031393339fd00ff0f3230
32303132333154323335393539fd010224fd020020fd02010866756c6c6e
616d65fd0202104e444e205465737462656420526f6f7417463044022030
b736ce03e17ac622c1ee2601cd2a56a59cdf9ad5aab179639bf4a45eee2b
3d02204c5322df3666fc487e5f4b73adc3b10e16e6b25d9c864223ca8a24
68cf69ba43`;

const NDN_TESTBED_ROOT_V2_DATA = new Decoder(fromHex(NDN_TESTBED_ROOT_V2_HEX.replace(/\s+/g, ""))).decode(Data);

const POLICY = `
sitename = <_s1> | (<_s1>/<_s2>) | (<_s1>/<_s2>/<_s3>)

rootcert = ndn/<_KEY>
sitecert = ndn/<sitename>/<_KEY>
operatorcert = ndn/<sitename>/%C1.Operator/<_opid>/<_KEY>
routercert = ndn/<sitename>/%C1.Router/<_routerid>/<_KEY>

lsdbdata = ndn/<sitename>/%C1.Router/<_routerid>/nlsr/lsdb/<_lsatype>/<_version>/<_segment>

lsdbdata <= routercert <= operatorcert <= sitecert <= rootcert
`;

async function makeVerifier(): Promise<Verifier> {
  const rootCert = Certificate.fromData(NDN_TESTBED_ROOT_V2_DATA);
  await rootCert.createVerifier();
  const policy = versec2019.load(POLICY);
  const schema = new TrustSchema(policy, [rootCert]);
  return new TrustSchemaVerifier({ schema });
}

let verifierPromise: Promise<Verifier>|undefined;

export function getVerifier(): Promise<Verifier> {
  if (!verifierPromise) {
    verifierPromise = makeVerifier();
  }
  return verifierPromise;
}
