// compile to .tlv
// 1. activate python-ndn venv
// 2. python ~/NDNts/pkg/lvs/compile.py <mk/trust-policy.rs >mk/trust-policy.tlv

#network: network & { network: "ndn" | "yoursunny" }
#sitename1: s1
#sitename2: s1/s2
#sitename3: s1/s2/s3
#routername1: #network/#sitename1/"%C1.Router"/routerid
#routername2: #network/#sitename2/"%C1.Router"/routerid
#routername3: #network/#sitename3/"%C1.Router"/routerid

#rootcert: #network/#CERT
#sitecert1: #network/#sitename1/#CERT <= #rootcert
#sitecert2: #network/#sitename2/#CERT <= #rootcert
#sitecert3: #network/#sitename3/#CERT <= #rootcert
#operatorcert1: #network/#sitename1/"%C1.Operator"/opid/#CERT <= #sitecert1
#operatorcert2: #network/#sitename2/"%C1.Operator"/opid/#CERT <= #sitecert2
#operatorcert3: #network/#sitename3/"%C1.Operator"/opid/#CERT <= #sitecert3
#routercert1: #routername1/#CERT <= #operatorcert1
#routercert2: #routername2/#CERT <= #operatorcert2
#routercert3: #routername3/#CERT <= #operatorcert3
#lsdbdata1: #routername1/"nlsr"/"lsdb"/lsatype/version/segment <= #routercert1
#lsdbdata2: #routername2/"nlsr"/"lsdb"/lsatype/version/segment <= #routercert2
#lsdbdata3: #routername3/"nlsr"/"lsdb"/lsatype/version/segment <= #routercert3

#CERT: "KEY"/_/_/_
