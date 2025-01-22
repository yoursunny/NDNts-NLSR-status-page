// compile to .tlv
// 1. activate python-ndn venv
// 2. python ~/NDNts/pkg/lvs/compile.py <mk/trust-policy.rs >mk/trust-policy.tlv

#network: network & { network: "ndn" | "yoursunny" }
#sitename: s10
#sitename: s20/s21
#sitename: s30/s31/s32
#routername: #network/#sitename/"%C1.Router"/routerid

#rootcert: #network/#CERT
#sitecert: #network/#sitename/#CERT <= #rootcert
#operatorcert: #network/#sitename/"%C1.Operator"/opid/#CERT <= #sitecert
#routercert: #routername/#CERT <= #operatorcert
#lsdbdata: #routername/"nlsr"/"lsdb"/lsatype/version/segment & { lsatype: "names" | "adjacencies" | "coordinates" } <= #routercert

#CERT: "KEY"/_/_/_
