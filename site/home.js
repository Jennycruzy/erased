function ta(e,a){return e.endsWith(a)?e.length===a.length||e[e.length-a.length-1]===".":!1}function na(e,a){let t=e.length-a.length-2,i=e.lastIndexOf(".",t);return i===-1?e:e.slice(i+1)}function X(e,a,t){if(t.validHosts!==null){let o=t.validHosts;for(let n of o)if(ta(a,n))return n}let i=0;if(a.startsWith("."))for(;i<a.length&&a[i]===".";)i+=1;return e.length===a.length-i?null:na(a,e)}function Q(e,a){return e.slice(0,-a.length-1)}function $(e,a){let t=0,i=e.length,o=!1;if(!a){if(e.startsWith("data:"))return null;for(;t<e.length&&e.charCodeAt(t)<=32;)t+=1;for(;i>t+1&&e.charCodeAt(i-1)<=32;)i-=1;if(e.charCodeAt(t)===47&&e.charCodeAt(t+1)===47)t+=2;else{let s=e.indexOf(":/",t);if(s!==-1){let u=s-t,m=e.charCodeAt(t),g=e.charCodeAt(t+1),x=e.charCodeAt(t+2),I=e.charCodeAt(t+3),f=e.charCodeAt(t+4);if(!(u===5&&m===104&&g===116&&x===116&&I===112&&f===115)){if(!(u===4&&m===104&&g===116&&x===116&&I===112)){if(!(u===3&&m===119&&g===115&&x===115)){if(!(u===2&&m===119&&g===115))for(let v=t;v<s;v+=1){let k=e.charCodeAt(v)|32;if(!(k>=97&&k<=122||k>=48&&k<=57||k===46||k===45||k===43))return null}}}}for(t=s+2;e.charCodeAt(t)===47;)t+=1}}let r=-1,l=-1,d=-1;for(let s=t;s<i;s+=1){let u=e.charCodeAt(s);if(u===35||u===47||u===63){i=s;break}else u===64?r=s:u===93?l=s:u===58?d=s:u>=65&&u<=90&&(o=!0)}if(r!==-1&&r>t&&r<i&&(t=r+1),e.charCodeAt(t)===91)return l!==-1?e.slice(t+1,l).toLowerCase():null;d!==-1&&d>t&&d<i&&(i=d)}for(;i>t+1&&e.charCodeAt(i-1)===46;)i-=1;let n=t!==0||i!==e.length?e.slice(t,i):e;return o?n.toLowerCase():n}function ia(e){if(e.length<7||e.length>15)return!1;let a=0;for(let t=0;t<e.length;t+=1){let i=e.charCodeAt(t);if(i===46)a+=1;else if(i<48||i>57)return!1}return a===3&&e.charCodeAt(0)!==46&&e.charCodeAt(e.length-1)!==46}function ra(e){if(e.length<3)return!1;let a=e.startsWith("[")?1:0,t=e.length;if(e[t-1]==="]"&&(t-=1),t-a>39)return!1;let i=!1;for(;a<t;a+=1){let o=e.charCodeAt(a);if(o===58)i=!0;else if(!(o>=48&&o<=57||o>=97&&o<=102||o>=65&&o<=90))return!1}return i}function ee(e){return ra(e)||ia(e)}function _e(e){return e>=97&&e<=122||e>=48&&e<=57||e>127}function ae(e){if(e.length>255||e.length===0||!_e(e.charCodeAt(0))&&e.charCodeAt(0)!==46&&e.charCodeAt(0)!==95)return!1;let a=-1,t=-1,i=e.length;for(let o=0;o<i;o+=1){let n=e.charCodeAt(o);if(n===46){if(o-a>64||t===46||t===45||t===95)return!1;a=o}else if(!(_e(n)||n===45||n===95))return!1;t=n}return i-a-1<=63&&t!==45}function Ze({allowIcannDomains:e=!0,allowPrivateDomains:a=!1,detectIp:t=!0,extractHostname:i=!0,mixedInputs:o=!0,validHosts:n=null,validateHostname:r=!0}){return{allowIcannDomains:e,allowPrivateDomains:a,detectIp:t,extractHostname:i,mixedInputs:o,validHosts:n,validateHostname:r}}var sa=Ze({});function oe(e){return e===void 0?sa:Ze(e)}function te(e,a){return a.length===e.length?"":e.slice(0,-a.length-1)}function ne(){return{domain:null,domainWithoutSuffix:null,hostname:null,isIcann:null,isIp:null,isPrivate:null,publicSuffix:null,subdomain:null}}function ie(e){e.domain=null,e.domainWithoutSuffix=null,e.hostname=null,e.isIcann=null,e.isIp=null,e.isPrivate=null,e.publicSuffix=null,e.subdomain=null}function re(e,a,t,i,o){let n=oe(i);return typeof e!="string"||(n.extractHostname?n.mixedInputs?o.hostname=$(e,ae(e)):o.hostname=$(e,!1):o.hostname=e,a===0||o.hostname===null)||n.detectIp&&(o.isIp=ee(o.hostname),o.isIp)?o:n.validateHostname&&n.extractHostname&&!ae(o.hostname)?(o.hostname=null,o):(t(o.hostname,n,o),a===2||o.publicSuffix===null||(o.domain=X(o.publicSuffix,o.hostname,n),a===3||o.domain===null)||(o.subdomain=te(o.hostname,o.domain),a===4)||(o.domainWithoutSuffix=Q(o.domain,o.publicSuffix)),o)}function se(e,a,t){if(!a.allowPrivateDomains&&e.length>3){let i=e.length-1,o=e.charCodeAt(i),n=e.charCodeAt(i-1),r=e.charCodeAt(i-2),l=e.charCodeAt(i-3);if(o===109&&n===111&&r===99&&l===46)return t.isIcann=!0,t.isPrivate=!1,t.publicSuffix="com",!0;if(o===103&&n===114&&r===111&&l===46)return t.isIcann=!0,t.isPrivate=!1,t.publicSuffix="org",!0;if(o===117&&n===100&&r===101&&l===46)return t.isIcann=!0,t.isPrivate=!1,t.publicSuffix="edu",!0;if(o===118&&n===111&&r===103&&l===46)return t.isIcann=!0,t.isPrivate=!1,t.publicSuffix="gov",!0;if(o===116&&n===101&&r===110&&l===46)return t.isIcann=!0,t.isPrivate=!1,t.publicSuffix="net",!0;if(o===101&&n===100&&r===46)return t.isIcann=!0,t.isPrivate=!1,t.publicSuffix="de",!0}return!1}var Me=(function(){let e=[1,{}],a=[2,{}],t=[0,{city:e}];return[0,{ck:[0,{www:e}],jp:[0,{kawasaki:t,kitakyushu:t,kobe:t,nagoya:t,sapporo:t,sendai:t,yokohama:t}],dev:[0,{hrsn:[0,{psl:[0,{wc:[0,{ignored:a,sub:[0,{ignored:a}]}]}]}]}]}]})(),We=(function(){let e=[1,{}],a=[2,{}],t=[1,{com:e,edu:e,gov:e,net:e,org:e}],i=[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e}],o=[0,{"*":a}],n=[2,{s:o}],r=[0,{relay:a}],l=[2,{id:a}],d=[1,{gov:e}],s=[0,{"transfer-webapp":a}],u=[0,{notebook:a,studio:a}],m=[0,{labeling:a,notebook:a,studio:a}],g=[0,{notebook:a}],x=[0,{labeling:a,notebook:a,"notebook-fips":a,studio:a}],I=[0,{notebook:a,"notebook-fips":a,studio:a,"studio-fips":a}],f=[0,{"*":e}],v=[1,{co:a}],k=[0,{objects:a}],G=[2,{nodes:a}],fe=[0,{my:o}],q=[0,{s3:a,"s3-accesspoint":a,"s3-website":a}],be=[0,{s3:a,"s3-accesspoint":a}],ke=[0,{direct:a}],j=[0,{"webview-assets":a}],z=[0,{vfs:a,"webview-assets":a}],R=[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:q,s3:a,"s3-accesspoint":a,"s3-object-lambda":a,"s3-website":a,"aws-cloud9":j,cloud9:z}],_=[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:be,s3:a,"s3-accesspoint":a,"s3-object-lambda":a,"s3-website":a,"aws-cloud9":j,cloud9:z}],T=[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:q,s3:a,"s3-accesspoint":a,"s3-object-lambda":a,"s3-website":a,"analytics-gateway":a,"aws-cloud9":j,cloud9:z}],S=[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:q,s3:a,"s3-accesspoint":a,"s3-object-lambda":a,"s3-website":a}],Z=[0,{s3:a,"s3-accesspoint":a,"s3-accesspoint-fips":a,"s3-fips":a,"s3-website":a}],ve=[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:Z,s3:a,"s3-accesspoint":a,"s3-accesspoint-fips":a,"s3-fips":a,"s3-object-lambda":a,"s3-website":a,"aws-cloud9":j,cloud9:z}],we=[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:Z,s3:a,"s3-accesspoint":a,"s3-accesspoint-fips":a,"s3-deprecated":a,"s3-fips":a,"s3-object-lambda":a,"s3-website":a,"analytics-gateway":a,"aws-cloud9":j,cloud9:z}],oa=[0,{s3:a,"s3-accesspoint":a,"s3-accesspoint-fips":a,"s3-fips":a}],xe=[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:oa,s3:a,"s3-accesspoint":a,"s3-accesspoint-fips":a,"s3-fips":a,"s3-object-lambda":a,"s3-website":a}],h=[0,{auth:a}],M=[0,{auth:a,"auth-fips":a}],je=[0,{"auth-fips":a}],qe=[0,{apps:a}],U=[0,{paas:a}],ze=[2,{eu:a}],N=[0,{app:a}],F=[0,{site:a}],W=[1,{com:e,edu:e,net:e,org:e}],V=[0,{j:a}],Te=[0,{dyn:a}],Se=[1,{co:e,com:e,edu:e,gov:e,net:e,org:e}],Ae=[0,{p:a}],Ie=[0,{user:a}],Re=[0,{shop:a}],P=[0,{cdn:a}],B=[0,{cust:a,reservd:a}],Pe=[0,{cust:a}],J=[0,{s3:a}],Ce=[1,{biz:e,com:e,edu:e,gov:e,info:e,net:e,org:e}],K=[0,{ipfs:a}],H=[1,{framer:a}],De=[0,{forgot:a}],p=[1,{gs:e}],Ee=[0,{nes:e}],c=[1,{k12:e,cc:e,lib:e}],L=[1,{cc:e,lib:e}];return[0,{ac:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,drr:a,feedback:a,forms:a}],ad:e,ae:[1,{ac:e,co:e,gov:e,mil:e,net:e,org:e,sch:e}],aero:[1,{airline:e,airport:e,"accident-investigation":e,"accident-prevention":e,aerobatic:e,aeroclub:e,aerodrome:e,agents:e,"air-surveillance":e,"air-traffic-control":e,aircraft:e,airtraffic:e,ambulance:e,association:e,author:e,ballooning:e,broker:e,caa:e,cargo:e,catering:e,certification:e,championship:e,charter:e,civilaviation:e,club:e,conference:e,consultant:e,consulting:e,control:e,council:e,crew:e,design:e,dgca:e,educator:e,emergency:e,engine:e,engineer:e,entertainment:e,equipment:e,exchange:e,express:e,federation:e,flight:e,freight:e,fuel:e,gliding:e,government:e,groundhandling:e,group:e,hanggliding:e,homebuilt:e,insurance:e,journal:e,journalist:e,leasing:e,logistics:e,magazine:e,maintenance:e,marketplace:e,media:e,microlight:e,modelling:e,navigation:e,parachuting:e,paragliding:e,"passenger-association":e,pilot:e,press:e,production:e,recreation:e,repbody:e,res:e,research:e,rotorcraft:e,safety:e,scientist:e,services:e,show:e,skydiving:e,software:e,student:e,taxi:e,trader:e,trading:e,trainer:e,union:e,workinggroup:e,works:e}],af:t,ag:[1,{co:e,com:e,net:e,nom:e,org:e,obj:a}],ai:[1,{com:e,net:e,off:e,org:e,uwu:a,framer:a}],al:i,am:[1,{co:e,com:e,commune:e,net:e,org:e,radio:a}],ao:[1,{co:e,ed:e,edu:e,gov:e,gv:e,it:e,og:e,org:e,pb:e}],aq:e,ar:[1,{bet:e,com:e,coop:e,edu:e,gob:e,gov:e,int:e,mil:e,musica:e,mutual:e,net:e,org:e,seg:e,senasa:e,tur:e}],arpa:[1,{e164:e,home:e,"in-addr":e,ip6:e,iris:e,uri:e,urn:e}],as:d,asia:[1,{cloudns:a,daemon:a,dix:a}],at:[1,{ac:[1,{sth:e}],co:e,gv:e,or:e,funkfeuer:[0,{wien:a}],futurecms:[0,{"*":a,ex:o,in:o}],futurehosting:a,futuremailing:a,ortsinfo:[0,{ex:o,kunden:o}],biz:a,info:a,"123webseite":a,priv:a,myspreadshop:a,"12hp":a,"2ix":a,"4lima":a,"lima-city":a}],au:[1,{asn:e,com:[1,{cloudlets:[0,{mel:a}],myspreadshop:a}],edu:[1,{act:e,catholic:e,nsw:[1,{schools:e}],nt:e,qld:e,sa:e,tas:e,vic:e,wa:e}],gov:[1,{qld:e,sa:e,tas:e,vic:e,wa:e}],id:e,net:e,org:e,conf:e,oz:e,act:e,nsw:e,nt:e,qld:e,sa:e,tas:e,vic:e,wa:e}],aw:[1,{com:e}],ax:e,az:[1,{biz:e,co:e,com:e,edu:e,gov:e,info:e,int:e,mil:e,name:e,net:e,org:e,pp:e,pro:e}],ba:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,rs:a}],bb:[1,{biz:e,co:e,com:e,edu:e,gov:e,info:e,net:e,org:e,store:e,tv:e}],bd:f,be:[1,{ac:e,cloudns:a,webhosting:a,interhostsolutions:[0,{cloud:a}],kuleuven:[0,{ezproxy:a}],"123website":a,myspreadshop:a,transurl:o}],bf:d,bg:[1,{0:e,1:e,2:e,3:e,4:e,5:e,6:e,7:e,8:e,9:e,a:e,b:e,c:e,d:e,e,f:e,g:e,h:e,i:e,j:e,k:e,l:e,m:e,n:e,o:e,p:e,q:e,r:e,s:e,t:e,u:e,v:e,w:e,x:e,y:e,z:e,barsy:a}],bh:t,bi:[1,{co:e,com:e,edu:e,or:e,org:e}],biz:[1,{activetrail:a,"cloud-ip":a,cloudns:a,jozi:a,dyndns:a,"for-better":a,"for-more":a,"for-some":a,"for-the":a,selfip:a,webhop:a,orx:a,mmafan:a,myftp:a,"no-ip":a,dscloud:a}],bj:[1,{africa:e,agro:e,architectes:e,assur:e,avocats:e,co:e,com:e,eco:e,econo:e,edu:e,info:e,loisirs:e,money:e,net:e,org:e,ote:e,restaurant:e,resto:e,tourism:e,univ:e}],bm:t,bn:[1,{com:e,edu:e,gov:e,net:e,org:e,co:a}],bo:[1,{com:e,edu:e,gob:e,int:e,mil:e,net:e,org:e,tv:e,web:e,academia:e,agro:e,arte:e,blog:e,bolivia:e,ciencia:e,cooperativa:e,democracia:e,deporte:e,ecologia:e,economia:e,empresa:e,indigena:e,industria:e,info:e,medicina:e,movimiento:e,musica:e,natural:e,nombre:e,noticias:e,patria:e,plurinacional:e,politica:e,profesional:e,pueblo:e,revista:e,salud:e,tecnologia:e,tksat:e,transporte:e,wiki:e}],br:[1,{"9guacu":e,abc:e,adm:e,adv:e,agr:e,aju:e,am:e,anani:e,aparecida:e,app:e,arq:e,art:e,ato:e,b:e,barueri:e,belem:e,bet:e,bhz:e,bib:e,bio:e,blog:e,bmd:e,boavista:e,bsb:e,campinagrande:e,campinas:e,caxias:e,cim:e,cng:e,cnt:e,com:[1,{simplesite:a}],contagem:e,coop:e,coz:e,cri:e,cuiaba:e,curitiba:e,def:e,des:e,det:e,dev:e,ecn:e,eco:e,edu:e,emp:e,enf:e,eng:e,esp:e,etc:e,eti:e,far:e,feira:e,flog:e,floripa:e,fm:e,fnd:e,fortal:e,fot:e,foz:e,fst:e,g12:e,geo:e,ggf:e,goiania:e,gov:[1,{ac:e,al:e,am:e,ap:e,ba:e,ce:e,df:e,es:e,go:e,ma:e,mg:e,ms:e,mt:e,pa:e,pb:e,pe:e,pi:e,pr:e,rj:e,rn:e,ro:e,rr:e,rs:e,sc:e,se:e,sp:e,to:e}],gru:e,imb:e,ind:e,inf:e,jab:e,jampa:e,jdf:e,joinville:e,jor:e,jus:e,leg:[1,{ac:a,al:a,am:a,ap:a,ba:a,ce:a,df:a,es:a,go:a,ma:a,mg:a,ms:a,mt:a,pa:a,pb:a,pe:a,pi:a,pr:a,rj:a,rn:a,ro:a,rr:a,rs:a,sc:a,se:a,sp:a,to:a}],leilao:e,lel:e,log:e,londrina:e,macapa:e,maceio:e,manaus:e,maringa:e,mat:e,med:e,mil:e,morena:e,mp:e,mus:e,natal:e,net:e,niteroi:e,nom:f,not:e,ntr:e,odo:e,ong:e,org:e,osasco:e,palmas:e,poa:e,ppg:e,pro:e,psc:e,psi:e,pvh:e,qsl:e,radio:e,rec:e,recife:e,rep:e,ribeirao:e,rio:e,riobranco:e,riopreto:e,salvador:e,sampa:e,santamaria:e,santoandre:e,saobernardo:e,saogonca:e,seg:e,sjc:e,slg:e,slz:e,sorocaba:e,srv:e,taxi:e,tc:e,tec:e,teo:e,the:e,tmp:e,trd:e,tur:e,tv:e,udi:e,vet:e,vix:e,vlog:e,wiki:e,zlg:e}],bs:[1,{com:e,edu:e,gov:e,net:e,org:e,we:a}],bt:t,bv:e,bw:[1,{ac:e,co:e,gov:e,net:e,org:e}],by:[1,{gov:e,mil:e,com:e,of:e,mediatech:a}],bz:[1,{co:e,com:e,edu:e,gov:e,net:e,org:e,za:a,mydns:a,gsj:a}],ca:[1,{ab:e,bc:e,mb:e,nb:e,nf:e,nl:e,ns:e,nt:e,nu:e,on:e,pe:e,qc:e,sk:e,yk:e,gc:e,barsy:a,awdev:o,co:a,"no-ip":a,myspreadshop:a,box:a}],cat:e,cc:[1,{cleverapps:a,cloudns:a,ftpaccess:a,"game-server":a,myphotos:a,scrapping:a,twmail:a,csx:a,fantasyleague:a,spawn:[0,{instances:a}]}],cd:d,cf:e,cg:e,ch:[1,{square7:a,cloudns:a,cloudscale:[0,{cust:a,lpg:k,rma:k}],flow:[0,{ae:[0,{alp1:a}],appengine:a}],"linkyard-cloud":a,gotdns:a,dnsking:a,"123website":a,myspreadshop:a,firenet:[0,{"*":a,svc:o}],"12hp":a,"2ix":a,"4lima":a,"lima-city":a}],ci:[1,{ac:e,"xn--aroport-bya":e,a\u00E9roport:e,asso:e,co:e,com:e,ed:e,edu:e,go:e,gouv:e,int:e,net:e,or:e,org:e}],ck:f,cl:[1,{co:e,gob:e,gov:e,mil:e,cloudns:a}],cm:[1,{co:e,com:e,gov:e,net:e}],cn:[1,{ac:e,com:[1,{amazonaws:[0,{"cn-north-1":[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:q,s3:a,"s3-accesspoint":a,"s3-deprecated":a,"s3-object-lambda":a,"s3-website":a}],"cn-northwest-1":[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:be,s3:a,"s3-accesspoint":a,"s3-object-lambda":a,"s3-website":a}],compute:o,airflow:[0,{"cn-north-1":o,"cn-northwest-1":o}],eb:[0,{"cn-north-1":a,"cn-northwest-1":a}],elb:o}],sagemaker:[0,{"cn-north-1":u,"cn-northwest-1":u}]}],edu:e,gov:e,mil:e,net:e,org:e,"xn--55qx5d":e,\u516C\u53F8:e,"xn--od0alg":e,\u7DB2\u7D61:e,"xn--io0a7i":e,\u7F51\u7EDC:e,ah:e,bj:e,cq:e,fj:e,gd:e,gs:e,gx:e,gz:e,ha:e,hb:e,he:e,hi:e,hk:e,hl:e,hn:e,jl:e,js:e,jx:e,ln:e,mo:e,nm:e,nx:e,qh:e,sc:e,sd:e,sh:[1,{as:a}],sn:e,sx:e,tj:e,tw:e,xj:e,xz:e,yn:e,zj:e,"canva-apps":a,canvasite:fe,myqnapcloud:a,quickconnect:ke}],co:[1,{com:e,edu:e,gov:e,mil:e,net:e,nom:e,org:e,carrd:a,crd:a,otap:o,leadpages:a,lpages:a,mypi:a,xmit:o,firewalledreplit:l,repl:l,supabase:a}],com:[1,{a2hosted:a,cpserver:a,adobeaemcloud:[2,{dev:o}],africa:a,airkitapps:a,"airkitapps-au":a,aivencloud:a,alibabacloudcs:a,kasserver:a,amazonaws:[0,{"af-south-1":R,"ap-east-1":_,"ap-northeast-1":T,"ap-northeast-2":T,"ap-northeast-3":R,"ap-south-1":T,"ap-south-2":S,"ap-southeast-1":T,"ap-southeast-2":T,"ap-southeast-3":S,"ap-southeast-4":S,"ap-southeast-5":[0,{"execute-api":a,dualstack:q,s3:a,"s3-accesspoint":a,"s3-deprecated":a,"s3-object-lambda":a,"s3-website":a}],"ca-central-1":ve,"ca-west-1":[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:Z,s3:a,"s3-accesspoint":a,"s3-accesspoint-fips":a,"s3-fips":a,"s3-object-lambda":a,"s3-website":a}],"eu-central-1":T,"eu-central-2":S,"eu-north-1":_,"eu-south-1":R,"eu-south-2":S,"eu-west-1":[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:q,s3:a,"s3-accesspoint":a,"s3-deprecated":a,"s3-object-lambda":a,"s3-website":a,"analytics-gateway":a,"aws-cloud9":j,cloud9:z}],"eu-west-2":_,"eu-west-3":R,"il-central-1":[0,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:q,s3:a,"s3-accesspoint":a,"s3-object-lambda":a,"s3-website":a,"aws-cloud9":j,cloud9:[0,{vfs:a}]}],"me-central-1":S,"me-south-1":_,"sa-east-1":R,"us-east-1":[2,{"execute-api":a,"emrappui-prod":a,"emrnotebooks-prod":a,"emrstudio-prod":a,dualstack:Z,s3:a,"s3-accesspoint":a,"s3-accesspoint-fips":a,"s3-deprecated":a,"s3-fips":a,"s3-object-lambda":a,"s3-website":a,"analytics-gateway":a,"aws-cloud9":j,cloud9:z}],"us-east-2":we,"us-gov-east-1":xe,"us-gov-west-1":xe,"us-west-1":ve,"us-west-2":we,compute:o,"compute-1":o,airflow:[0,{"af-south-1":o,"ap-east-1":o,"ap-northeast-1":o,"ap-northeast-2":o,"ap-northeast-3":o,"ap-south-1":o,"ap-south-2":o,"ap-southeast-1":o,"ap-southeast-2":o,"ap-southeast-3":o,"ap-southeast-4":o,"ca-central-1":o,"ca-west-1":o,"eu-central-1":o,"eu-central-2":o,"eu-north-1":o,"eu-south-1":o,"eu-south-2":o,"eu-west-1":o,"eu-west-2":o,"eu-west-3":o,"il-central-1":o,"me-central-1":o,"me-south-1":o,"sa-east-1":o,"us-east-1":o,"us-east-2":o,"us-west-1":o,"us-west-2":o}],s3:a,"s3-1":a,"s3-ap-east-1":a,"s3-ap-northeast-1":a,"s3-ap-northeast-2":a,"s3-ap-northeast-3":a,"s3-ap-south-1":a,"s3-ap-southeast-1":a,"s3-ap-southeast-2":a,"s3-ca-central-1":a,"s3-eu-central-1":a,"s3-eu-north-1":a,"s3-eu-west-1":a,"s3-eu-west-2":a,"s3-eu-west-3":a,"s3-external-1":a,"s3-fips-us-gov-east-1":a,"s3-fips-us-gov-west-1":a,"s3-global":[0,{accesspoint:[0,{mrap:a}]}],"s3-me-south-1":a,"s3-sa-east-1":a,"s3-us-east-2":a,"s3-us-gov-east-1":a,"s3-us-gov-west-1":a,"s3-us-west-1":a,"s3-us-west-2":a,"s3-website-ap-northeast-1":a,"s3-website-ap-southeast-1":a,"s3-website-ap-southeast-2":a,"s3-website-eu-west-1":a,"s3-website-sa-east-1":a,"s3-website-us-east-1":a,"s3-website-us-gov-west-1":a,"s3-website-us-west-1":a,"s3-website-us-west-2":a,elb:o}],amazoncognito:[0,{"af-south-1":h,"ap-east-1":h,"ap-northeast-1":h,"ap-northeast-2":h,"ap-northeast-3":h,"ap-south-1":h,"ap-south-2":h,"ap-southeast-1":h,"ap-southeast-2":h,"ap-southeast-3":h,"ap-southeast-4":h,"ap-southeast-5":h,"ca-central-1":h,"ca-west-1":h,"eu-central-1":h,"eu-central-2":h,"eu-north-1":h,"eu-south-1":h,"eu-south-2":h,"eu-west-1":h,"eu-west-2":h,"eu-west-3":h,"il-central-1":h,"me-central-1":h,"me-south-1":h,"sa-east-1":h,"us-east-1":M,"us-east-2":M,"us-gov-east-1":je,"us-gov-west-1":je,"us-west-1":M,"us-west-2":M}],amplifyapp:a,awsapprunner:o,awsapps:a,elasticbeanstalk:[2,{"af-south-1":a,"ap-east-1":a,"ap-northeast-1":a,"ap-northeast-2":a,"ap-northeast-3":a,"ap-south-1":a,"ap-southeast-1":a,"ap-southeast-2":a,"ap-southeast-3":a,"ca-central-1":a,"eu-central-1":a,"eu-north-1":a,"eu-south-1":a,"eu-west-1":a,"eu-west-2":a,"eu-west-3":a,"il-central-1":a,"me-south-1":a,"sa-east-1":a,"us-east-1":a,"us-east-2":a,"us-gov-east-1":a,"us-gov-west-1":a,"us-west-1":a,"us-west-2":a}],awsglobalaccelerator:a,siiites:a,appspacehosted:a,appspaceusercontent:a,"on-aptible":a,myasustor:a,"balena-devices":a,boutir:a,bplaced:a,cafjs:a,"canva-apps":a,"cdn77-storage":a,br:a,cn:a,de:a,eu:a,jpn:a,mex:a,ru:a,sa:a,uk:a,us:a,za:a,"clever-cloud":[0,{services:o}],dnsabr:a,"ip-ddns":a,jdevcloud:a,wpdevcloud:a,"cf-ipfs":a,"cloudflare-ipfs":a,trycloudflare:a,co:a,devinapps:o,builtwithdark:a,datadetect:[0,{demo:a,instance:a}],dattolocal:a,dattorelay:a,dattoweb:a,mydatto:a,digitaloceanspaces:o,discordsays:a,discordsez:a,drayddns:a,dreamhosters:a,durumis:a,mydrobo:a,blogdns:a,cechire:a,dnsalias:a,dnsdojo:a,doesntexist:a,dontexist:a,doomdns:a,"dyn-o-saur":a,dynalias:a,"dyndns-at-home":a,"dyndns-at-work":a,"dyndns-blog":a,"dyndns-free":a,"dyndns-home":a,"dyndns-ip":a,"dyndns-mail":a,"dyndns-office":a,"dyndns-pics":a,"dyndns-remote":a,"dyndns-server":a,"dyndns-web":a,"dyndns-wiki":a,"dyndns-work":a,"est-a-la-maison":a,"est-a-la-masion":a,"est-le-patron":a,"est-mon-blogueur":a,"from-ak":a,"from-al":a,"from-ar":a,"from-ca":a,"from-ct":a,"from-dc":a,"from-de":a,"from-fl":a,"from-ga":a,"from-hi":a,"from-ia":a,"from-id":a,"from-il":a,"from-in":a,"from-ks":a,"from-ky":a,"from-ma":a,"from-md":a,"from-mi":a,"from-mn":a,"from-mo":a,"from-ms":a,"from-mt":a,"from-nc":a,"from-nd":a,"from-ne":a,"from-nh":a,"from-nj":a,"from-nm":a,"from-nv":a,"from-oh":a,"from-ok":a,"from-or":a,"from-pa":a,"from-pr":a,"from-ri":a,"from-sc":a,"from-sd":a,"from-tn":a,"from-tx":a,"from-ut":a,"from-va":a,"from-vt":a,"from-wa":a,"from-wi":a,"from-wv":a,"from-wy":a,getmyip:a,gotdns:a,"hobby-site":a,homelinux:a,homeunix:a,iamallama:a,"is-a-anarchist":a,"is-a-blogger":a,"is-a-bookkeeper":a,"is-a-bulls-fan":a,"is-a-caterer":a,"is-a-chef":a,"is-a-conservative":a,"is-a-cpa":a,"is-a-cubicle-slave":a,"is-a-democrat":a,"is-a-designer":a,"is-a-doctor":a,"is-a-financialadvisor":a,"is-a-geek":a,"is-a-green":a,"is-a-guru":a,"is-a-hard-worker":a,"is-a-hunter":a,"is-a-landscaper":a,"is-a-lawyer":a,"is-a-liberal":a,"is-a-libertarian":a,"is-a-llama":a,"is-a-musician":a,"is-a-nascarfan":a,"is-a-nurse":a,"is-a-painter":a,"is-a-personaltrainer":a,"is-a-photographer":a,"is-a-player":a,"is-a-republican":a,"is-a-rockstar":a,"is-a-socialist":a,"is-a-student":a,"is-a-teacher":a,"is-a-techie":a,"is-a-therapist":a,"is-an-accountant":a,"is-an-actor":a,"is-an-actress":a,"is-an-anarchist":a,"is-an-artist":a,"is-an-engineer":a,"is-an-entertainer":a,"is-certified":a,"is-gone":a,"is-into-anime":a,"is-into-cars":a,"is-into-cartoons":a,"is-into-games":a,"is-leet":a,"is-not-certified":a,"is-slick":a,"is-uberleet":a,"is-with-theband":a,"isa-geek":a,"isa-hockeynut":a,issmarterthanyou:a,"likes-pie":a,likescandy:a,"neat-url":a,"saves-the-whales":a,selfip:a,"sells-for-less":a,"sells-for-u":a,servebbs:a,"simple-url":a,"space-to-rent":a,"teaches-yoga":a,writesthisblog:a,ddnsfree:a,ddnsgeek:a,giize:a,gleeze:a,kozow:a,loseyourip:a,ooguy:a,theworkpc:a,mytuleap:a,"tuleap-partners":a,encoreapi:a,evennode:[0,{"eu-1":a,"eu-2":a,"eu-3":a,"eu-4":a,"us-1":a,"us-2":a,"us-3":a,"us-4":a}],onfabrica:a,"fastly-edge":a,"fastly-terrarium":a,"fastvps-server":a,mydobiss:a,firebaseapp:a,fldrv:a,forgeblocks:a,framercanvas:a,"freebox-os":a,freeboxos:a,freemyip:a,aliases121:a,gentapps:a,gentlentapis:a,githubusercontent:a,"0emm":o,appspot:[2,{r:o}],blogspot:a,codespot:a,googleapis:a,googlecode:a,pagespeedmobilizer:a,withgoogle:a,withyoutube:a,grayjayleagues:a,hatenablog:a,hatenadiary:a,herokuapp:a,gr:a,smushcdn:a,wphostedmail:a,wpmucdn:a,pixolino:a,"apps-1and1":a,"live-website":a,dopaas:a,"hosted-by-previder":U,hosteur:[0,{"rag-cloud":a,"rag-cloud-ch":a}],"ik-server":[0,{jcloud:a,"jcloud-ver-jpc":a}],jelastic:[0,{demo:a}],massivegrid:U,wafaicloud:[0,{jed:a,ryd:a}],webadorsite:a,joyent:[0,{cns:o}],lpusercontent:a,linode:[0,{members:a,nodebalancer:o}],linodeobjects:o,linodeusercontent:[0,{ip:a}],localtonet:a,lovableproject:a,barsycenter:a,barsyonline:a,modelscape:a,mwcloudnonprod:a,polyspace:a,mazeplay:a,miniserver:a,atmeta:a,fbsbx:qe,meteorapp:ze,routingthecloud:a,mydbserver:a,hostedpi:a,"mythic-beasts":[0,{caracal:a,customer:a,fentiger:a,lynx:a,ocelot:a,oncilla:a,onza:a,sphinx:a,vs:a,x:a,yali:a}],nospamproxy:[0,{cloud:[2,{o365:a}]}],"4u":a,nfshost:a,"3utilities":a,blogsyte:a,ciscofreak:a,damnserver:a,ddnsking:a,ditchyourip:a,dnsiskinky:a,dynns:a,geekgalaxy:a,"health-carereform":a,homesecuritymac:a,homesecuritypc:a,myactivedirectory:a,mysecuritycamera:a,myvnc:a,"net-freaks":a,onthewifi:a,point2this:a,quicksytes:a,securitytactics:a,servebeer:a,servecounterstrike:a,serveexchange:a,serveftp:a,servegame:a,servehalflife:a,servehttp:a,servehumour:a,serveirc:a,servemp3:a,servep2p:a,servepics:a,servequake:a,servesarcasm:a,stufftoread:a,unusualperson:a,workisboring:a,myiphost:a,observableusercontent:[0,{static:a}],simplesite:a,orsites:a,operaunite:a,"customer-oci":[0,{"*":a,oci:o,ocp:o,ocs:o}],oraclecloudapps:o,oraclegovcloudapps:o,"authgear-staging":a,authgearapps:a,skygearapp:a,outsystemscloud:a,ownprovider:a,pgfog:a,pagexl:a,gotpantheon:a,paywhirl:o,upsunapp:a,"postman-echo":a,prgmr:[0,{xen:a}],pythonanywhere:ze,qa2:a,"alpha-myqnapcloud":a,"dev-myqnapcloud":a,mycloudnas:a,mynascloud:a,myqnapcloud:a,qualifioapp:a,ladesk:a,qbuser:a,quipelements:o,rackmaze:a,"readthedocs-hosted":a,rhcloud:a,onrender:a,render:N,"subsc-pay":a,"180r":a,dojin:a,sakuratan:a,sakuraweb:a,x0:a,code:[0,{builder:o,"dev-builder":o,"stg-builder":o}],salesforce:[0,{platform:[0,{"code-builder-stg":[0,{test:[0,{"001":o}]}]}]}],logoip:a,scrysec:a,"firewall-gateway":a,myshopblocks:a,myshopify:a,shopitsite:a,"1kapp":a,appchizi:a,applinzi:a,sinaapp:a,vipsinaapp:a,streamlitapp:a,"try-snowplow":a,"playstation-cloud":a,myspreadshop:a,"w-corp-staticblitz":a,"w-credentialless-staticblitz":a,"w-staticblitz":a,"stackhero-network":a,stdlib:[0,{api:a}],strapiapp:[2,{media:a}],"streak-link":a,streaklinks:a,streakusercontent:a,"temp-dns":a,dsmynas:a,familyds:a,mytabit:a,taveusercontent:a,"tb-hosting":F,reservd:a,thingdustdata:a,"townnews-staging":a,typeform:[0,{pro:a}],hk:a,it:a,"deus-canvas":a,vultrobjects:o,wafflecell:a,hotelwithflight:a,"reserve-online":a,cprapid:a,pleskns:a,remotewd:a,wiardweb:[0,{pages:a}],wixsite:a,wixstudio:a,messwithdns:a,"woltlab-demo":a,wpenginepowered:[2,{js:a}],xnbay:[2,{u2:a,"u2-local":a}],yolasite:a}],coop:e,cr:[1,{ac:e,co:e,ed:e,fi:e,go:e,or:e,sa:e}],cu:[1,{com:e,edu:e,gob:e,inf:e,nat:e,net:e,org:e}],cv:[1,{com:e,edu:e,id:e,int:e,net:e,nome:e,org:e,publ:e}],cw:W,cx:[1,{gov:e,cloudns:a,ath:a,info:a,assessments:a,calculators:a,funnels:a,paynow:a,quizzes:a,researched:a,tests:a}],cy:[1,{ac:e,biz:e,com:[1,{scaleforce:V}],ekloges:e,gov:e,ltd:e,mil:e,net:e,org:e,press:e,pro:e,tm:e}],cz:[1,{contentproxy9:[0,{rsc:a}],realm:a,e4:a,co:a,metacentrum:[0,{cloud:o,custom:a}],muni:[0,{cloud:[0,{flt:a,usr:a}]}]}],de:[1,{bplaced:a,square7:a,com:a,cosidns:Te,dnsupdater:a,"dynamisches-dns":a,"internet-dns":a,"l-o-g-i-n":a,ddnss:[2,{dyn:a,dyndns:a}],"dyn-ip24":a,dyndns1:a,"home-webserver":[2,{dyn:a}],"myhome-server":a,dnshome:a,fuettertdasnetz:a,isteingeek:a,istmein:a,lebtimnetz:a,leitungsen:a,traeumtgerade:a,frusky:o,goip:a,"xn--gnstigbestellen-zvb":a,g\u00FCnstigbestellen:a,"xn--gnstigliefern-wob":a,g\u00FCnstigliefern:a,"hs-heilbronn":[0,{it:[0,{pages:a,"pages-research":a}]}],"dyn-berlin":a,"in-berlin":a,"in-brb":a,"in-butter":a,"in-dsl":a,"in-vpn":a,iservschule:a,"mein-iserv":a,schulplattform:a,schulserver:a,"test-iserv":a,keymachine:a,"git-repos":a,"lcube-server":a,"svn-repos":a,barsy:a,webspaceconfig:a,"123webseite":a,rub:a,"ruhr-uni-bochum":[2,{noc:[0,{io:a}]}],logoip:a,"firewall-gateway":a,"my-gateway":a,"my-router":a,spdns:a,speedpartner:[0,{customer:a}],myspreadshop:a,"taifun-dns":a,"12hp":a,"2ix":a,"4lima":a,"lima-city":a,"dd-dns":a,"dray-dns":a,draydns:a,"dyn-vpn":a,dynvpn:a,"mein-vigor":a,"my-vigor":a,"my-wan":a,"syno-ds":a,"synology-diskstation":a,"synology-ds":a,uberspace:o,"virtual-user":a,virtualuser:a,"community-pro":a,diskussionsbereich:a}],dj:e,dk:[1,{biz:a,co:a,firm:a,reg:a,store:a,"123hjemmeside":a,myspreadshop:a}],dm:Se,do:[1,{art:e,com:e,edu:e,gob:e,gov:e,mil:e,net:e,org:e,sld:e,web:e}],dz:[1,{art:e,asso:e,com:e,edu:e,gov:e,net:e,org:e,pol:e,soc:e,tm:e}],ec:[1,{com:e,edu:e,fin:e,gob:e,gov:e,info:e,k12:e,med:e,mil:e,net:e,org:e,pro:e,base:a,official:a}],edu:[1,{rit:[0,{"git-pages":a}]}],ee:[1,{aip:e,com:e,edu:e,fie:e,gov:e,lib:e,med:e,org:e,pri:e,riik:e}],eg:[1,{ac:e,com:e,edu:e,eun:e,gov:e,info:e,me:e,mil:e,name:e,net:e,org:e,sci:e,sport:e,tv:e}],er:f,es:[1,{com:e,edu:e,gob:e,nom:e,org:e,"123miweb":a,myspreadshop:a}],et:[1,{biz:e,com:e,edu:e,gov:e,info:e,name:e,net:e,org:e}],eu:[1,{airkitapps:a,cloudns:a,dogado:[0,{jelastic:a}],barsy:a,spdns:a,transurl:o,diskstation:a}],fi:[1,{aland:e,dy:a,"xn--hkkinen-5wa":a,h\u00E4kkinen:a,iki:a,cloudplatform:[0,{fi:a}],datacenter:[0,{demo:a,paas:a}],kapsi:a,"123kotisivu":a,myspreadshop:a}],fj:[1,{ac:e,biz:e,com:e,gov:e,info:e,mil:e,name:e,net:e,org:e,pro:e}],fk:f,fm:[1,{com:e,edu:e,net:e,org:e,radio:a,user:o}],fo:e,fr:[1,{asso:e,com:e,gouv:e,nom:e,prd:e,tm:e,avoues:e,cci:e,greta:e,"huissier-justice":e,"en-root":a,"fbx-os":a,fbxos:a,"freebox-os":a,freeboxos:a,goupile:a,"123siteweb":a,"on-web":a,"chirurgiens-dentistes-en-france":a,dedibox:a,aeroport:a,avocat:a,chambagri:a,"chirurgiens-dentistes":a,"experts-comptables":a,medecin:a,notaires:a,pharmacien:a,port:a,veterinaire:a,myspreadshop:a,ynh:a}],ga:e,gb:e,gd:[1,{edu:e,gov:e}],ge:[1,{com:e,edu:e,gov:e,net:e,org:e,pvt:e,school:e}],gf:e,gg:[1,{co:e,net:e,org:e,botdash:a,kaas:a,stackit:a,panel:[2,{daemon:a}]}],gh:[1,{com:e,edu:e,gov:e,mil:e,org:e}],gi:[1,{com:e,edu:e,gov:e,ltd:e,mod:e,org:e}],gl:[1,{co:e,com:e,edu:e,net:e,org:e,biz:a}],gm:e,gn:[1,{ac:e,com:e,edu:e,gov:e,net:e,org:e}],gov:e,gp:[1,{asso:e,com:e,edu:e,mobi:e,net:e,org:e}],gq:e,gr:[1,{com:e,edu:e,gov:e,net:e,org:e,barsy:a,simplesite:a}],gs:e,gt:[1,{com:e,edu:e,gob:e,ind:e,mil:e,net:e,org:e}],gu:[1,{com:e,edu:e,gov:e,guam:e,info:e,net:e,org:e,web:e}],gw:e,gy:Se,hk:[1,{com:e,edu:e,gov:e,idv:e,net:e,org:e,"xn--ciqpn":e,\u4E2A\u4EBA:e,"xn--gmqw5a":e,\u500B\u4EBA:e,"xn--55qx5d":e,\u516C\u53F8:e,"xn--mxtq1m":e,\u653F\u5E9C:e,"xn--lcvr32d":e,\u654E\u80B2:e,"xn--wcvs22d":e,\u6559\u80B2:e,"xn--gmq050i":e,\u7B87\u4EBA:e,"xn--uc0atv":e,\u7D44\u7E54:e,"xn--uc0ay4a":e,\u7D44\u7EC7:e,"xn--od0alg":e,\u7DB2\u7D61:e,"xn--zf0avx":e,\u7DB2\u7EDC:e,"xn--mk0axi":e,\u7EC4\u7E54:e,"xn--tn0ag":e,\u7EC4\u7EC7:e,"xn--od0aq3b":e,\u7F51\u7D61:e,"xn--io0a7i":e,\u7F51\u7EDC:e,inc:a,ltd:a}],hm:e,hn:[1,{com:e,edu:e,gob:e,mil:e,net:e,org:e}],hr:[1,{com:e,from:e,iz:e,name:e,brendly:Re}],ht:[1,{adult:e,art:e,asso:e,com:e,coop:e,edu:e,firm:e,gouv:e,info:e,med:e,net:e,org:e,perso:e,pol:e,pro:e,rel:e,shop:e,rt:a}],hu:[1,{2e3:e,agrar:e,bolt:e,casino:e,city:e,co:e,erotica:e,erotika:e,film:e,forum:e,games:e,hotel:e,info:e,ingatlan:e,jogasz:e,konyvelo:e,lakas:e,media:e,news:e,org:e,priv:e,reklam:e,sex:e,shop:e,sport:e,suli:e,szex:e,tm:e,tozsde:e,utazas:e,video:e}],id:[1,{ac:e,biz:e,co:e,desa:e,go:e,mil:e,my:e,net:e,or:e,ponpes:e,sch:e,web:e,zone:a}],ie:[1,{gov:e,myspreadshop:a}],il:[1,{ac:e,co:[1,{ravpage:a,mytabit:a,tabitorder:a}],gov:e,idf:e,k12:e,muni:e,net:e,org:e}],"xn--4dbrk0ce":[1,{"xn--4dbgdty6c":e,"xn--5dbhl8d":e,"xn--8dbq2a":e,"xn--hebda8b":e}],\u05D9\u05E9\u05E8\u05D0\u05DC:[1,{\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4:e,\u05D9\u05E9\u05D5\u05D1:e,\u05E6\u05D4\u05DC:e,\u05DE\u05DE\u05E9\u05DC:e}],im:[1,{ac:e,co:[1,{ltd:e,plc:e}],com:e,net:e,org:e,tt:e,tv:e}],in:[1,{"5g":e,"6g":e,ac:e,ai:e,am:e,bihar:e,biz:e,business:e,ca:e,cn:e,co:e,com:e,coop:e,cs:e,delhi:e,dr:e,edu:e,er:e,firm:e,gen:e,gov:e,gujarat:e,ind:e,info:e,int:e,internet:e,io:e,me:e,mil:e,net:e,nic:e,org:e,pg:e,post:e,pro:e,res:e,travel:e,tv:e,uk:e,up:e,us:e,cloudns:a,barsy:a,web:a,supabase:a}],info:[1,{cloudns:a,"dynamic-dns":a,"barrel-of-knowledge":a,"barrell-of-knowledge":a,dyndns:a,"for-our":a,"groks-the":a,"groks-this":a,"here-for-more":a,knowsitall:a,selfip:a,webhop:a,barsy:a,mayfirst:a,mittwald:a,mittwaldserver:a,typo3server:a,dvrcam:a,ilovecollege:a,"no-ip":a,forumz:a,nsupdate:a,dnsupdate:a,"v-info":a}],int:[1,{eu:e}],io:[1,{2038:a,co:e,com:e,edu:e,gov:e,mil:e,net:e,nom:e,org:e,"on-acorn":o,myaddr:a,apigee:a,"b-data":a,beagleboard:a,bitbucket:a,bluebite:a,boxfuse:a,brave:n,browsersafetymark:a,bubble:P,bubbleapps:a,bigv:[0,{uk0:a}],cleverapps:a,cloudbeesusercontent:a,dappnode:[0,{dyndns:a}],darklang:a,definima:a,dedyn:a,"fh-muenster":a,shw:a,forgerock:[0,{id:a}],github:a,gitlab:a,lolipop:a,"hasura-app":a,hostyhosting:a,hypernode:a,moonscale:o,beebyte:U,beebyteapp:[0,{sekd1:a}],jele:a,webthings:a,loginline:a,barsy:a,azurecontainer:o,ngrok:[2,{ap:a,au:a,eu:a,in:a,jp:a,sa:a,us:a}],nodeart:[0,{stage:a}],pantheonsite:a,pstmn:[2,{mock:a}],protonet:a,qcx:[2,{sys:o}],qoto:a,vaporcloud:a,myrdbx:a,"rb-hosting":F,"on-k3s":o,"on-rio":o,readthedocs:a,resindevice:a,resinstaging:[0,{devices:a}],hzc:a,sandcats:a,scrypted:[0,{client:a}],"mo-siemens":a,lair:qe,stolos:o,musician:a,utwente:a,edugit:a,telebit:a,thingdust:[0,{dev:B,disrec:B,prod:Pe,testing:B}],tickets:a,webflow:a,webflowtest:a,editorx:a,wixstudio:a,basicserver:a,virtualserver:a}],iq:i,ir:[1,{ac:e,co:e,gov:e,id:e,net:e,org:e,sch:e,"xn--mgba3a4f16a":e,\u0627\u06CC\u0631\u0627\u0646:e,"xn--mgba3a4fra":e,\u0627\u064A\u0631\u0627\u0646:e,arvanedge:a}],is:e,it:[1,{edu:e,gov:e,abr:e,abruzzo:e,"aosta-valley":e,aostavalley:e,bas:e,basilicata:e,cal:e,calabria:e,cam:e,campania:e,"emilia-romagna":e,emiliaromagna:e,emr:e,"friuli-v-giulia":e,"friuli-ve-giulia":e,"friuli-vegiulia":e,"friuli-venezia-giulia":e,"friuli-veneziagiulia":e,"friuli-vgiulia":e,"friuliv-giulia":e,"friulive-giulia":e,friulivegiulia:e,"friulivenezia-giulia":e,friuliveneziagiulia:e,friulivgiulia:e,fvg:e,laz:e,lazio:e,lig:e,liguria:e,lom:e,lombardia:e,lombardy:e,lucania:e,mar:e,marche:e,mol:e,molise:e,piedmont:e,piemonte:e,pmn:e,pug:e,puglia:e,sar:e,sardegna:e,sardinia:e,sic:e,sicilia:e,sicily:e,taa:e,tos:e,toscana:e,"trentin-sud-tirol":e,"xn--trentin-sd-tirol-rzb":e,"trentin-s\xFCd-tirol":e,"trentin-sudtirol":e,"xn--trentin-sdtirol-7vb":e,"trentin-s\xFCdtirol":e,"trentin-sued-tirol":e,"trentin-suedtirol":e,trentino:e,"trentino-a-adige":e,"trentino-aadige":e,"trentino-alto-adige":e,"trentino-altoadige":e,"trentino-s-tirol":e,"trentino-stirol":e,"trentino-sud-tirol":e,"xn--trentino-sd-tirol-c3b":e,"trentino-s\xFCd-tirol":e,"trentino-sudtirol":e,"xn--trentino-sdtirol-szb":e,"trentino-s\xFCdtirol":e,"trentino-sued-tirol":e,"trentino-suedtirol":e,"trentinoa-adige":e,trentinoaadige:e,"trentinoalto-adige":e,trentinoaltoadige:e,"trentinos-tirol":e,trentinostirol:e,"trentinosud-tirol":e,"xn--trentinosd-tirol-rzb":e,"trentinos\xFCd-tirol":e,trentinosudtirol:e,"xn--trentinosdtirol-7vb":e,trentinos\u00FCdtirol:e,"trentinosued-tirol":e,trentinosuedtirol:e,"trentinsud-tirol":e,"xn--trentinsd-tirol-6vb":e,"trentins\xFCd-tirol":e,trentinsudtirol:e,"xn--trentinsdtirol-nsb":e,trentins\u00FCdtirol:e,"trentinsued-tirol":e,trentinsuedtirol:e,tuscany:e,umb:e,umbria:e,"val-d-aosta":e,"val-daosta":e,"vald-aosta":e,valdaosta:e,"valle-aosta":e,"valle-d-aosta":e,"valle-daosta":e,valleaosta:e,"valled-aosta":e,valledaosta:e,"vallee-aoste":e,"xn--valle-aoste-ebb":e,"vall\xE9e-aoste":e,"vallee-d-aoste":e,"xn--valle-d-aoste-ehb":e,"vall\xE9e-d-aoste":e,valleeaoste:e,"xn--valleaoste-e7a":e,vall\u00E9eaoste:e,valleedaoste:e,"xn--valledaoste-ebb":e,vall\u00E9edaoste:e,vao:e,vda:e,ven:e,veneto:e,ag:e,agrigento:e,al:e,alessandria:e,"alto-adige":e,altoadige:e,an:e,ancona:e,"andria-barletta-trani":e,"andria-trani-barletta":e,andriabarlettatrani:e,andriatranibarletta:e,ao:e,aosta:e,aoste:e,ap:e,aq:e,aquila:e,ar:e,arezzo:e,"ascoli-piceno":e,ascolipiceno:e,asti:e,at:e,av:e,avellino:e,ba:e,balsan:e,"balsan-sudtirol":e,"xn--balsan-sdtirol-nsb":e,"balsan-s\xFCdtirol":e,"balsan-suedtirol":e,bari:e,"barletta-trani-andria":e,barlettatraniandria:e,belluno:e,benevento:e,bergamo:e,bg:e,bi:e,biella:e,bl:e,bn:e,bo:e,bologna:e,bolzano:e,"bolzano-altoadige":e,bozen:e,"bozen-sudtirol":e,"xn--bozen-sdtirol-2ob":e,"bozen-s\xFCdtirol":e,"bozen-suedtirol":e,br:e,brescia:e,brindisi:e,bs:e,bt:e,bulsan:e,"bulsan-sudtirol":e,"xn--bulsan-sdtirol-nsb":e,"bulsan-s\xFCdtirol":e,"bulsan-suedtirol":e,bz:e,ca:e,cagliari:e,caltanissetta:e,"campidano-medio":e,campidanomedio:e,campobasso:e,"carbonia-iglesias":e,carboniaiglesias:e,"carrara-massa":e,carraramassa:e,caserta:e,catania:e,catanzaro:e,cb:e,ce:e,"cesena-forli":e,"xn--cesena-forl-mcb":e,"cesena-forl\xEC":e,cesenaforli:e,"xn--cesenaforl-i8a":e,cesenaforl\u00EC:e,ch:e,chieti:e,ci:e,cl:e,cn:e,co:e,como:e,cosenza:e,cr:e,cremona:e,crotone:e,cs:e,ct:e,cuneo:e,cz:e,"dell-ogliastra":e,dellogliastra:e,en:e,enna:e,fc:e,fe:e,fermo:e,ferrara:e,fg:e,fi:e,firenze:e,florence:e,fm:e,foggia:e,"forli-cesena":e,"xn--forl-cesena-fcb":e,"forl\xEC-cesena":e,forlicesena:e,"xn--forlcesena-c8a":e,forl\u00ECcesena:e,fr:e,frosinone:e,ge:e,genoa:e,genova:e,go:e,gorizia:e,gr:e,grosseto:e,"iglesias-carbonia":e,iglesiascarbonia:e,im:e,imperia:e,is:e,isernia:e,kr:e,"la-spezia":e,laquila:e,laspezia:e,latina:e,lc:e,le:e,lecce:e,lecco:e,li:e,livorno:e,lo:e,lodi:e,lt:e,lu:e,lucca:e,macerata:e,mantova:e,"massa-carrara":e,massacarrara:e,matera:e,mb:e,mc:e,me:e,"medio-campidano":e,mediocampidano:e,messina:e,mi:e,milan:e,milano:e,mn:e,mo:e,modena:e,monza:e,"monza-brianza":e,"monza-e-della-brianza":e,monzabrianza:e,monzaebrianza:e,monzaedellabrianza:e,ms:e,mt:e,na:e,naples:e,napoli:e,no:e,novara:e,nu:e,nuoro:e,og:e,ogliastra:e,"olbia-tempio":e,olbiatempio:e,or:e,oristano:e,ot:e,pa:e,padova:e,padua:e,palermo:e,parma:e,pavia:e,pc:e,pd:e,pe:e,perugia:e,"pesaro-urbino":e,pesarourbino:e,pescara:e,pg:e,pi:e,piacenza:e,pisa:e,pistoia:e,pn:e,po:e,pordenone:e,potenza:e,pr:e,prato:e,pt:e,pu:e,pv:e,pz:e,ra:e,ragusa:e,ravenna:e,rc:e,re:e,"reggio-calabria":e,"reggio-emilia":e,reggiocalabria:e,reggioemilia:e,rg:e,ri:e,rieti:e,rimini:e,rm:e,rn:e,ro:e,roma:e,rome:e,rovigo:e,sa:e,salerno:e,sassari:e,savona:e,si:e,siena:e,siracusa:e,so:e,sondrio:e,sp:e,sr:e,ss:e,"xn--sdtirol-n2a":e,s\u00FCdtirol:e,suedtirol:e,sv:e,ta:e,taranto:e,te:e,"tempio-olbia":e,tempioolbia:e,teramo:e,terni:e,tn:e,to:e,torino:e,tp:e,tr:e,"trani-andria-barletta":e,"trani-barletta-andria":e,traniandriabarletta:e,tranibarlettaandria:e,trapani:e,trento:e,treviso:e,trieste:e,ts:e,turin:e,tv:e,ud:e,udine:e,"urbino-pesaro":e,urbinopesaro:e,va:e,varese:e,vb:e,vc:e,ve:e,venezia:e,venice:e,verbania:e,vercelli:e,verona:e,vi:e,"vibo-valentia":e,vibovalentia:e,vicenza:e,viterbo:e,vr:e,vs:e,vt:e,vv:e,"12chars":a,ibxos:a,iliadboxos:a,neen:[0,{jc:a}],"123homepage":a,"16-b":a,"32-b":a,"64-b":a,myspreadshop:a,syncloud:a}],je:[1,{co:e,net:e,org:e,of:a}],jm:f,jo:[1,{agri:e,ai:e,com:e,edu:e,eng:e,fm:e,gov:e,mil:e,net:e,org:e,per:e,phd:e,sch:e,tv:e}],jobs:e,jp:[1,{ac:e,ad:e,co:e,ed:e,go:e,gr:e,lg:e,ne:[1,{aseinet:Ie,gehirn:a,ivory:a,"mail-box":a,mints:a,mokuren:a,opal:a,sakura:a,sumomo:a,topaz:a}],or:e,aichi:[1,{aisai:e,ama:e,anjo:e,asuke:e,chiryu:e,chita:e,fuso:e,gamagori:e,handa:e,hazu:e,hekinan:e,higashiura:e,ichinomiya:e,inazawa:e,inuyama:e,isshiki:e,iwakura:e,kanie:e,kariya:e,kasugai:e,kira:e,kiyosu:e,komaki:e,konan:e,kota:e,mihama:e,miyoshi:e,nishio:e,nisshin:e,obu:e,oguchi:e,oharu:e,okazaki:e,owariasahi:e,seto:e,shikatsu:e,shinshiro:e,shitara:e,tahara:e,takahama:e,tobishima:e,toei:e,togo:e,tokai:e,tokoname:e,toyoake:e,toyohashi:e,toyokawa:e,toyone:e,toyota:e,tsushima:e,yatomi:e}],akita:[1,{akita:e,daisen:e,fujisato:e,gojome:e,hachirogata:e,happou:e,higashinaruse:e,honjo:e,honjyo:e,ikawa:e,kamikoani:e,kamioka:e,katagami:e,kazuno:e,kitaakita:e,kosaka:e,kyowa:e,misato:e,mitane:e,moriyoshi:e,nikaho:e,noshiro:e,odate:e,oga:e,ogata:e,semboku:e,yokote:e,yurihonjo:e}],aomori:[1,{aomori:e,gonohe:e,hachinohe:e,hashikami:e,hiranai:e,hirosaki:e,itayanagi:e,kuroishi:e,misawa:e,mutsu:e,nakadomari:e,noheji:e,oirase:e,owani:e,rokunohe:e,sannohe:e,shichinohe:e,shingo:e,takko:e,towada:e,tsugaru:e,tsuruta:e}],chiba:[1,{abiko:e,asahi:e,chonan:e,chosei:e,choshi:e,chuo:e,funabashi:e,futtsu:e,hanamigawa:e,ichihara:e,ichikawa:e,ichinomiya:e,inzai:e,isumi:e,kamagaya:e,kamogawa:e,kashiwa:e,katori:e,katsuura:e,kimitsu:e,kisarazu:e,kozaki:e,kujukuri:e,kyonan:e,matsudo:e,midori:e,mihama:e,minamiboso:e,mobara:e,mutsuzawa:e,nagara:e,nagareyama:e,narashino:e,narita:e,noda:e,oamishirasato:e,omigawa:e,onjuku:e,otaki:e,sakae:e,sakura:e,shimofusa:e,shirako:e,shiroi:e,shisui:e,sodegaura:e,sosa:e,tako:e,tateyama:e,togane:e,tohnosho:e,tomisato:e,urayasu:e,yachimata:e,yachiyo:e,yokaichiba:e,yokoshibahikari:e,yotsukaido:e}],ehime:[1,{ainan:e,honai:e,ikata:e,imabari:e,iyo:e,kamijima:e,kihoku:e,kumakogen:e,masaki:e,matsuno:e,matsuyama:e,namikata:e,niihama:e,ozu:e,saijo:e,seiyo:e,shikokuchuo:e,tobe:e,toon:e,uchiko:e,uwajima:e,yawatahama:e}],fukui:[1,{echizen:e,eiheiji:e,fukui:e,ikeda:e,katsuyama:e,mihama:e,minamiechizen:e,obama:e,ohi:e,ono:e,sabae:e,sakai:e,takahama:e,tsuruga:e,wakasa:e}],fukuoka:[1,{ashiya:e,buzen:e,chikugo:e,chikuho:e,chikujo:e,chikushino:e,chikuzen:e,chuo:e,dazaifu:e,fukuchi:e,hakata:e,higashi:e,hirokawa:e,hisayama:e,iizuka:e,inatsuki:e,kaho:e,kasuga:e,kasuya:e,kawara:e,keisen:e,koga:e,kurate:e,kurogi:e,kurume:e,minami:e,miyako:e,miyama:e,miyawaka:e,mizumaki:e,munakata:e,nakagawa:e,nakama:e,nishi:e,nogata:e,ogori:e,okagaki:e,okawa:e,oki:e,omuta:e,onga:e,onojo:e,oto:e,saigawa:e,sasaguri:e,shingu:e,shinyoshitomi:e,shonai:e,soeda:e,sue:e,tachiarai:e,tagawa:e,takata:e,toho:e,toyotsu:e,tsuiki:e,ukiha:e,umi:e,usui:e,yamada:e,yame:e,yanagawa:e,yukuhashi:e}],fukushima:[1,{aizubange:e,aizumisato:e,aizuwakamatsu:e,asakawa:e,bandai:e,date:e,fukushima:e,furudono:e,futaba:e,hanawa:e,higashi:e,hirata:e,hirono:e,iitate:e,inawashiro:e,ishikawa:e,iwaki:e,izumizaki:e,kagamiishi:e,kaneyama:e,kawamata:e,kitakata:e,kitashiobara:e,koori:e,koriyama:e,kunimi:e,miharu:e,mishima:e,namie:e,nango:e,nishiaizu:e,nishigo:e,okuma:e,omotego:e,ono:e,otama:e,samegawa:e,shimogo:e,shirakawa:e,showa:e,soma:e,sukagawa:e,taishin:e,tamakawa:e,tanagura:e,tenei:e,yabuki:e,yamato:e,yamatsuri:e,yanaizu:e,yugawa:e}],gifu:[1,{anpachi:e,ena:e,gifu:e,ginan:e,godo:e,gujo:e,hashima:e,hichiso:e,hida:e,higashishirakawa:e,ibigawa:e,ikeda:e,kakamigahara:e,kani:e,kasahara:e,kasamatsu:e,kawaue:e,kitagata:e,mino:e,minokamo:e,mitake:e,mizunami:e,motosu:e,nakatsugawa:e,ogaki:e,sakahogi:e,seki:e,sekigahara:e,shirakawa:e,tajimi:e,takayama:e,tarui:e,toki:e,tomika:e,wanouchi:e,yamagata:e,yaotsu:e,yoro:e}],gunma:[1,{annaka:e,chiyoda:e,fujioka:e,higashiagatsuma:e,isesaki:e,itakura:e,kanna:e,kanra:e,katashina:e,kawaba:e,kiryu:e,kusatsu:e,maebashi:e,meiwa:e,midori:e,minakami:e,naganohara:e,nakanojo:e,nanmoku:e,numata:e,oizumi:e,ora:e,ota:e,shibukawa:e,shimonita:e,shinto:e,showa:e,takasaki:e,takayama:e,tamamura:e,tatebayashi:e,tomioka:e,tsukiyono:e,tsumagoi:e,ueno:e,yoshioka:e}],hiroshima:[1,{asaminami:e,daiwa:e,etajima:e,fuchu:e,fukuyama:e,hatsukaichi:e,higashihiroshima:e,hongo:e,jinsekikogen:e,kaita:e,kui:e,kumano:e,kure:e,mihara:e,miyoshi:e,naka:e,onomichi:e,osakikamijima:e,otake:e,saka:e,sera:e,seranishi:e,shinichi:e,shobara:e,takehara:e}],hokkaido:[1,{abashiri:e,abira:e,aibetsu:e,akabira:e,akkeshi:e,asahikawa:e,ashibetsu:e,ashoro:e,assabu:e,atsuma:e,bibai:e,biei:e,bifuka:e,bihoro:e,biratori:e,chippubetsu:e,chitose:e,date:e,ebetsu:e,embetsu:e,eniwa:e,erimo:e,esan:e,esashi:e,fukagawa:e,fukushima:e,furano:e,furubira:e,haboro:e,hakodate:e,hamatonbetsu:e,hidaka:e,higashikagura:e,higashikawa:e,hiroo:e,hokuryu:e,hokuto:e,honbetsu:e,horokanai:e,horonobe:e,ikeda:e,imakane:e,ishikari:e,iwamizawa:e,iwanai:e,kamifurano:e,kamikawa:e,kamishihoro:e,kamisunagawa:e,kamoenai:e,kayabe:e,kembuchi:e,kikonai:e,kimobetsu:e,kitahiroshima:e,kitami:e,kiyosato:e,koshimizu:e,kunneppu:e,kuriyama:e,kuromatsunai:e,kushiro:e,kutchan:e,kyowa:e,mashike:e,matsumae:e,mikasa:e,minamifurano:e,mombetsu:e,moseushi:e,mukawa:e,muroran:e,naie:e,nakagawa:e,nakasatsunai:e,nakatombetsu:e,nanae:e,nanporo:e,nayoro:e,nemuro:e,niikappu:e,niki:e,nishiokoppe:e,noboribetsu:e,numata:e,obihiro:e,obira:e,oketo:e,okoppe:e,otaru:e,otobe:e,otofuke:e,otoineppu:e,oumu:e,ozora:e,pippu:e,rankoshi:e,rebun:e,rikubetsu:e,rishiri:e,rishirifuji:e,saroma:e,sarufutsu:e,shakotan:e,shari:e,shibecha:e,shibetsu:e,shikabe:e,shikaoi:e,shimamaki:e,shimizu:e,shimokawa:e,shinshinotsu:e,shintoku:e,shiranuka:e,shiraoi:e,shiriuchi:e,sobetsu:e,sunagawa:e,taiki:e,takasu:e,takikawa:e,takinoue:e,teshikaga:e,tobetsu:e,tohma:e,tomakomai:e,tomari:e,toya:e,toyako:e,toyotomi:e,toyoura:e,tsubetsu:e,tsukigata:e,urakawa:e,urausu:e,uryu:e,utashinai:e,wakkanai:e,wassamu:e,yakumo:e,yoichi:e}],hyogo:[1,{aioi:e,akashi:e,ako:e,amagasaki:e,aogaki:e,asago:e,ashiya:e,awaji:e,fukusaki:e,goshiki:e,harima:e,himeji:e,ichikawa:e,inagawa:e,itami:e,kakogawa:e,kamigori:e,kamikawa:e,kasai:e,kasuga:e,kawanishi:e,miki:e,minamiawaji:e,nishinomiya:e,nishiwaki:e,ono:e,sanda:e,sannan:e,sasayama:e,sayo:e,shingu:e,shinonsen:e,shiso:e,sumoto:e,taishi:e,taka:e,takarazuka:e,takasago:e,takino:e,tamba:e,tatsuno:e,toyooka:e,yabu:e,yashiro:e,yoka:e,yokawa:e}],ibaraki:[1,{ami:e,asahi:e,bando:e,chikusei:e,daigo:e,fujishiro:e,hitachi:e,hitachinaka:e,hitachiomiya:e,hitachiota:e,ibaraki:e,ina:e,inashiki:e,itako:e,iwama:e,joso:e,kamisu:e,kasama:e,kashima:e,kasumigaura:e,koga:e,miho:e,mito:e,moriya:e,naka:e,namegata:e,oarai:e,ogawa:e,omitama:e,ryugasaki:e,sakai:e,sakuragawa:e,shimodate:e,shimotsuma:e,shirosato:e,sowa:e,suifu:e,takahagi:e,tamatsukuri:e,tokai:e,tomobe:e,tone:e,toride:e,tsuchiura:e,tsukuba:e,uchihara:e,ushiku:e,yachiyo:e,yamagata:e,yawara:e,yuki:e}],ishikawa:[1,{anamizu:e,hakui:e,hakusan:e,kaga:e,kahoku:e,kanazawa:e,kawakita:e,komatsu:e,nakanoto:e,nanao:e,nomi:e,nonoichi:e,noto:e,shika:e,suzu:e,tsubata:e,tsurugi:e,uchinada:e,wajima:e}],iwate:[1,{fudai:e,fujisawa:e,hanamaki:e,hiraizumi:e,hirono:e,ichinohe:e,ichinoseki:e,iwaizumi:e,iwate:e,joboji:e,kamaishi:e,kanegasaki:e,karumai:e,kawai:e,kitakami:e,kuji:e,kunohe:e,kuzumaki:e,miyako:e,mizusawa:e,morioka:e,ninohe:e,noda:e,ofunato:e,oshu:e,otsuchi:e,rikuzentakata:e,shiwa:e,shizukuishi:e,sumita:e,tanohata:e,tono:e,yahaba:e,yamada:e}],kagawa:[1,{ayagawa:e,higashikagawa:e,kanonji:e,kotohira:e,manno:e,marugame:e,mitoyo:e,naoshima:e,sanuki:e,tadotsu:e,takamatsu:e,tonosho:e,uchinomi:e,utazu:e,zentsuji:e}],kagoshima:[1,{akune:e,amami:e,hioki:e,isa:e,isen:e,izumi:e,kagoshima:e,kanoya:e,kawanabe:e,kinko:e,kouyama:e,makurazaki:e,matsumoto:e,minamitane:e,nakatane:e,nishinoomote:e,satsumasendai:e,soo:e,tarumizu:e,yusui:e}],kanagawa:[1,{aikawa:e,atsugi:e,ayase:e,chigasaki:e,ebina:e,fujisawa:e,hadano:e,hakone:e,hiratsuka:e,isehara:e,kaisei:e,kamakura:e,kiyokawa:e,matsuda:e,minamiashigara:e,miura:e,nakai:e,ninomiya:e,odawara:e,oi:e,oiso:e,sagamihara:e,samukawa:e,tsukui:e,yamakita:e,yamato:e,yokosuka:e,yugawara:e,zama:e,zushi:e}],kochi:[1,{aki:e,geisei:e,hidaka:e,higashitsuno:e,ino:e,kagami:e,kami:e,kitagawa:e,kochi:e,mihara:e,motoyama:e,muroto:e,nahari:e,nakamura:e,nankoku:e,nishitosa:e,niyodogawa:e,ochi:e,okawa:e,otoyo:e,otsuki:e,sakawa:e,sukumo:e,susaki:e,tosa:e,tosashimizu:e,toyo:e,tsuno:e,umaji:e,yasuda:e,yusuhara:e}],kumamoto:[1,{amakusa:e,arao:e,aso:e,choyo:e,gyokuto:e,kamiamakusa:e,kikuchi:e,kumamoto:e,mashiki:e,mifune:e,minamata:e,minamioguni:e,nagasu:e,nishihara:e,oguni:e,ozu:e,sumoto:e,takamori:e,uki:e,uto:e,yamaga:e,yamato:e,yatsushiro:e}],kyoto:[1,{ayabe:e,fukuchiyama:e,higashiyama:e,ide:e,ine:e,joyo:e,kameoka:e,kamo:e,kita:e,kizu:e,kumiyama:e,kyotamba:e,kyotanabe:e,kyotango:e,maizuru:e,minami:e,minamiyamashiro:e,miyazu:e,muko:e,nagaokakyo:e,nakagyo:e,nantan:e,oyamazaki:e,sakyo:e,seika:e,tanabe:e,uji:e,ujitawara:e,wazuka:e,yamashina:e,yawata:e}],mie:[1,{asahi:e,inabe:e,ise:e,kameyama:e,kawagoe:e,kiho:e,kisosaki:e,kiwa:e,komono:e,kumano:e,kuwana:e,matsusaka:e,meiwa:e,mihama:e,minamiise:e,misugi:e,miyama:e,nabari:e,shima:e,suzuka:e,tado:e,taiki:e,taki:e,tamaki:e,toba:e,tsu:e,udono:e,ureshino:e,watarai:e,yokkaichi:e}],miyagi:[1,{furukawa:e,higashimatsushima:e,ishinomaki:e,iwanuma:e,kakuda:e,kami:e,kawasaki:e,marumori:e,matsushima:e,minamisanriku:e,misato:e,murata:e,natori:e,ogawara:e,ohira:e,onagawa:e,osaki:e,rifu:e,semine:e,shibata:e,shichikashuku:e,shikama:e,shiogama:e,shiroishi:e,tagajo:e,taiwa:e,tome:e,tomiya:e,wakuya:e,watari:e,yamamoto:e,zao:e}],miyazaki:[1,{aya:e,ebino:e,gokase:e,hyuga:e,kadogawa:e,kawaminami:e,kijo:e,kitagawa:e,kitakata:e,kitaura:e,kobayashi:e,kunitomi:e,kushima:e,mimata:e,miyakonojo:e,miyazaki:e,morotsuka:e,nichinan:e,nishimera:e,nobeoka:e,saito:e,shiiba:e,shintomi:e,takaharu:e,takanabe:e,takazaki:e,tsuno:e}],nagano:[1,{achi:e,agematsu:e,anan:e,aoki:e,asahi:e,azumino:e,chikuhoku:e,chikuma:e,chino:e,fujimi:e,hakuba:e,hara:e,hiraya:e,iida:e,iijima:e,iiyama:e,iizuna:e,ikeda:e,ikusaka:e,ina:e,karuizawa:e,kawakami:e,kiso:e,kisofukushima:e,kitaaiki:e,komagane:e,komoro:e,matsukawa:e,matsumoto:e,miasa:e,minamiaiki:e,minamimaki:e,minamiminowa:e,minowa:e,miyada:e,miyota:e,mochizuki:e,nagano:e,nagawa:e,nagiso:e,nakagawa:e,nakano:e,nozawaonsen:e,obuse:e,ogawa:e,okaya:e,omachi:e,omi:e,ookuwa:e,ooshika:e,otaki:e,otari:e,sakae:e,sakaki:e,saku:e,sakuho:e,shimosuwa:e,shinanomachi:e,shiojiri:e,suwa:e,suzaka:e,takagi:e,takamori:e,takayama:e,tateshina:e,tatsuno:e,togakushi:e,togura:e,tomi:e,ueda:e,wada:e,yamagata:e,yamanouchi:e,yasaka:e,yasuoka:e}],nagasaki:[1,{chijiwa:e,futsu:e,goto:e,hasami:e,hirado:e,iki:e,isahaya:e,kawatana:e,kuchinotsu:e,matsuura:e,nagasaki:e,obama:e,omura:e,oseto:e,saikai:e,sasebo:e,seihi:e,shimabara:e,shinkamigoto:e,togitsu:e,tsushima:e,unzen:e}],nara:[1,{ando:e,gose:e,heguri:e,higashiyoshino:e,ikaruga:e,ikoma:e,kamikitayama:e,kanmaki:e,kashiba:e,kashihara:e,katsuragi:e,kawai:e,kawakami:e,kawanishi:e,koryo:e,kurotaki:e,mitsue:e,miyake:e,nara:e,nosegawa:e,oji:e,ouda:e,oyodo:e,sakurai:e,sango:e,shimoichi:e,shimokitayama:e,shinjo:e,soni:e,takatori:e,tawaramoto:e,tenkawa:e,tenri:e,uda:e,yamatokoriyama:e,yamatotakada:e,yamazoe:e,yoshino:e}],niigata:[1,{aga:e,agano:e,gosen:e,itoigawa:e,izumozaki:e,joetsu:e,kamo:e,kariwa:e,kashiwazaki:e,minamiuonuma:e,mitsuke:e,muika:e,murakami:e,myoko:e,nagaoka:e,niigata:e,ojiya:e,omi:e,sado:e,sanjo:e,seiro:e,seirou:e,sekikawa:e,shibata:e,tagami:e,tainai:e,tochio:e,tokamachi:e,tsubame:e,tsunan:e,uonuma:e,yahiko:e,yoita:e,yuzawa:e}],oita:[1,{beppu:e,bungoono:e,bungotakada:e,hasama:e,hiji:e,himeshima:e,hita:e,kamitsue:e,kokonoe:e,kuju:e,kunisaki:e,kusu:e,oita:e,saiki:e,taketa:e,tsukumi:e,usa:e,usuki:e,yufu:e}],okayama:[1,{akaiwa:e,asakuchi:e,bizen:e,hayashima:e,ibara:e,kagamino:e,kasaoka:e,kibichuo:e,kumenan:e,kurashiki:e,maniwa:e,misaki:e,nagi:e,niimi:e,nishiawakura:e,okayama:e,satosho:e,setouchi:e,shinjo:e,shoo:e,soja:e,takahashi:e,tamano:e,tsuyama:e,wake:e,yakage:e}],okinawa:[1,{aguni:e,ginowan:e,ginoza:e,gushikami:e,haebaru:e,higashi:e,hirara:e,iheya:e,ishigaki:e,ishikawa:e,itoman:e,izena:e,kadena:e,kin:e,kitadaito:e,kitanakagusuku:e,kumejima:e,kunigami:e,minamidaito:e,motobu:e,nago:e,naha:e,nakagusuku:e,nakijin:e,nanjo:e,nishihara:e,ogimi:e,okinawa:e,onna:e,shimoji:e,taketomi:e,tarama:e,tokashiki:e,tomigusuku:e,tonaki:e,urasoe:e,uruma:e,yaese:e,yomitan:e,yonabaru:e,yonaguni:e,zamami:e}],osaka:[1,{abeno:e,chihayaakasaka:e,chuo:e,daito:e,fujiidera:e,habikino:e,hannan:e,higashiosaka:e,higashisumiyoshi:e,higashiyodogawa:e,hirakata:e,ibaraki:e,ikeda:e,izumi:e,izumiotsu:e,izumisano:e,kadoma:e,kaizuka:e,kanan:e,kashiwara:e,katano:e,kawachinagano:e,kishiwada:e,kita:e,kumatori:e,matsubara:e,minato:e,minoh:e,misaki:e,moriguchi:e,neyagawa:e,nishi:e,nose:e,osakasayama:e,sakai:e,sayama:e,sennan:e,settsu:e,shijonawate:e,shimamoto:e,suita:e,tadaoka:e,taishi:e,tajiri:e,takaishi:e,takatsuki:e,tondabayashi:e,toyonaka:e,toyono:e,yao:e}],saga:[1,{ariake:e,arita:e,fukudomi:e,genkai:e,hamatama:e,hizen:e,imari:e,kamimine:e,kanzaki:e,karatsu:e,kashima:e,kitagata:e,kitahata:e,kiyama:e,kouhoku:e,kyuragi:e,nishiarita:e,ogi:e,omachi:e,ouchi:e,saga:e,shiroishi:e,taku:e,tara:e,tosu:e,yoshinogari:e}],saitama:[1,{arakawa:e,asaka:e,chichibu:e,fujimi:e,fujimino:e,fukaya:e,hanno:e,hanyu:e,hasuda:e,hatogaya:e,hatoyama:e,hidaka:e,higashichichibu:e,higashimatsuyama:e,honjo:e,ina:e,iruma:e,iwatsuki:e,kamiizumi:e,kamikawa:e,kamisato:e,kasukabe:e,kawagoe:e,kawaguchi:e,kawajima:e,kazo:e,kitamoto:e,koshigaya:e,kounosu:e,kuki:e,kumagaya:e,matsubushi:e,minano:e,misato:e,miyashiro:e,miyoshi:e,moroyama:e,nagatoro:e,namegawa:e,niiza:e,ogano:e,ogawa:e,ogose:e,okegawa:e,omiya:e,otaki:e,ranzan:e,ryokami:e,saitama:e,sakado:e,satte:e,sayama:e,shiki:e,shiraoka:e,soka:e,sugito:e,toda:e,tokigawa:e,tokorozawa:e,tsurugashima:e,urawa:e,warabi:e,yashio:e,yokoze:e,yono:e,yorii:e,yoshida:e,yoshikawa:e,yoshimi:e}],shiga:[1,{aisho:e,gamo:e,higashiomi:e,hikone:e,koka:e,konan:e,kosei:e,koto:e,kusatsu:e,maibara:e,moriyama:e,nagahama:e,nishiazai:e,notogawa:e,omihachiman:e,otsu:e,ritto:e,ryuoh:e,takashima:e,takatsuki:e,torahime:e,toyosato:e,yasu:e}],shimane:[1,{akagi:e,ama:e,gotsu:e,hamada:e,higashiizumo:e,hikawa:e,hikimi:e,izumo:e,kakinoki:e,masuda:e,matsue:e,misato:e,nishinoshima:e,ohda:e,okinoshima:e,okuizumo:e,shimane:e,tamayu:e,tsuwano:e,unnan:e,yakumo:e,yasugi:e,yatsuka:e}],shizuoka:[1,{arai:e,atami:e,fuji:e,fujieda:e,fujikawa:e,fujinomiya:e,fukuroi:e,gotemba:e,haibara:e,hamamatsu:e,higashiizu:e,ito:e,iwata:e,izu:e,izunokuni:e,kakegawa:e,kannami:e,kawanehon:e,kawazu:e,kikugawa:e,kosai:e,makinohara:e,matsuzaki:e,minamiizu:e,mishima:e,morimachi:e,nishiizu:e,numazu:e,omaezaki:e,shimada:e,shimizu:e,shimoda:e,shizuoka:e,susono:e,yaizu:e,yoshida:e}],tochigi:[1,{ashikaga:e,bato:e,haga:e,ichikai:e,iwafune:e,kaminokawa:e,kanuma:e,karasuyama:e,kuroiso:e,mashiko:e,mibu:e,moka:e,motegi:e,nasu:e,nasushiobara:e,nikko:e,nishikata:e,nogi:e,ohira:e,ohtawara:e,oyama:e,sakura:e,sano:e,shimotsuke:e,shioya:e,takanezawa:e,tochigi:e,tsuga:e,ujiie:e,utsunomiya:e,yaita:e}],tokushima:[1,{aizumi:e,anan:e,ichiba:e,itano:e,kainan:e,komatsushima:e,matsushige:e,mima:e,minami:e,miyoshi:e,mugi:e,nakagawa:e,naruto:e,sanagochi:e,shishikui:e,tokushima:e,wajiki:e}],tokyo:[1,{adachi:e,akiruno:e,akishima:e,aogashima:e,arakawa:e,bunkyo:e,chiyoda:e,chofu:e,chuo:e,edogawa:e,fuchu:e,fussa:e,hachijo:e,hachioji:e,hamura:e,higashikurume:e,higashimurayama:e,higashiyamato:e,hino:e,hinode:e,hinohara:e,inagi:e,itabashi:e,katsushika:e,kita:e,kiyose:e,kodaira:e,koganei:e,kokubunji:e,komae:e,koto:e,kouzushima:e,kunitachi:e,machida:e,meguro:e,minato:e,mitaka:e,mizuho:e,musashimurayama:e,musashino:e,nakano:e,nerima:e,ogasawara:e,okutama:e,ome:e,oshima:e,ota:e,setagaya:e,shibuya:e,shinagawa:e,shinjuku:e,suginami:e,sumida:e,tachikawa:e,taito:e,tama:e,toshima:e}],tottori:[1,{chizu:e,hino:e,kawahara:e,koge:e,kotoura:e,misasa:e,nanbu:e,nichinan:e,sakaiminato:e,tottori:e,wakasa:e,yazu:e,yonago:e}],toyama:[1,{asahi:e,fuchu:e,fukumitsu:e,funahashi:e,himi:e,imizu:e,inami:e,johana:e,kamiichi:e,kurobe:e,nakaniikawa:e,namerikawa:e,nanto:e,nyuzen:e,oyabe:e,taira:e,takaoka:e,tateyama:e,toga:e,tonami:e,toyama:e,unazuki:e,uozu:e,yamada:e}],wakayama:[1,{arida:e,aridagawa:e,gobo:e,hashimoto:e,hidaka:e,hirogawa:e,inami:e,iwade:e,kainan:e,kamitonda:e,katsuragi:e,kimino:e,kinokawa:e,kitayama:e,koya:e,koza:e,kozagawa:e,kudoyama:e,kushimoto:e,mihama:e,misato:e,nachikatsuura:e,shingu:e,shirahama:e,taiji:e,tanabe:e,wakayama:e,yuasa:e,yura:e}],yamagata:[1,{asahi:e,funagata:e,higashine:e,iide:e,kahoku:e,kaminoyama:e,kaneyama:e,kawanishi:e,mamurogawa:e,mikawa:e,murayama:e,nagai:e,nakayama:e,nanyo:e,nishikawa:e,obanazawa:e,oe:e,oguni:e,ohkura:e,oishida:e,sagae:e,sakata:e,sakegawa:e,shinjo:e,shirataka:e,shonai:e,takahata:e,tendo:e,tozawa:e,tsuruoka:e,yamagata:e,yamanobe:e,yonezawa:e,yuza:e}],yamaguchi:[1,{abu:e,hagi:e,hikari:e,hofu:e,iwakuni:e,kudamatsu:e,mitou:e,nagato:e,oshima:e,shimonoseki:e,shunan:e,tabuse:e,tokuyama:e,toyota:e,ube:e,yuu:e}],yamanashi:[1,{chuo:e,doshi:e,fuefuki:e,fujikawa:e,fujikawaguchiko:e,fujiyoshida:e,hayakawa:e,hokuto:e,ichikawamisato:e,kai:e,kofu:e,koshu:e,kosuge:e,"minami-alps":e,minobu:e,nakamichi:e,nanbu:e,narusawa:e,nirasaki:e,nishikatsura:e,oshino:e,otsuki:e,showa:e,tabayama:e,tsuru:e,uenohara:e,yamanakako:e,yamanashi:e}],"xn--ehqz56n":e,\u4E09\u91CD:e,"xn--1lqs03n":e,\u4EAC\u90FD:e,"xn--qqqt11m":e,\u4F50\u8CC0:e,"xn--f6qx53a":e,\u5175\u5EAB:e,"xn--djrs72d6uy":e,\u5317\u6D77\u9053:e,"xn--mkru45i":e,\u5343\u8449:e,"xn--0trq7p7nn":e,\u548C\u6B4C\u5C71:e,"xn--5js045d":e,\u57FC\u7389:e,"xn--kbrq7o":e,\u5927\u5206:e,"xn--pssu33l":e,\u5927\u962A:e,"xn--ntsq17g":e,\u5948\u826F:e,"xn--uisz3g":e,\u5BAE\u57CE:e,"xn--6btw5a":e,\u5BAE\u5D0E:e,"xn--1ctwo":e,\u5BCC\u5C71:e,"xn--6orx2r":e,\u5C71\u53E3:e,"xn--rht61e":e,\u5C71\u5F62:e,"xn--rht27z":e,\u5C71\u68A8:e,"xn--nit225k":e,\u5C90\u961C:e,"xn--rht3d":e,\u5CA1\u5C71:e,"xn--djty4k":e,\u5CA9\u624B:e,"xn--klty5x":e,\u5CF6\u6839:e,"xn--kltx9a":e,\u5E83\u5CF6:e,"xn--kltp7d":e,\u5FB3\u5CF6:e,"xn--c3s14m":e,\u611B\u5A9B:e,"xn--vgu402c":e,\u611B\u77E5:e,"xn--efvn9s":e,\u65B0\u6F5F:e,"xn--1lqs71d":e,\u6771\u4EAC:e,"xn--4pvxs":e,\u6803\u6728:e,"xn--uuwu58a":e,\u6C96\u7E04:e,"xn--zbx025d":e,\u6ECB\u8CC0:e,"xn--8pvr4u":e,\u718A\u672C:e,"xn--5rtp49c":e,\u77F3\u5DDD:e,"xn--ntso0iqx3a":e,\u795E\u5948\u5DDD:e,"xn--elqq16h":e,\u798F\u4E95:e,"xn--4it168d":e,\u798F\u5CA1:e,"xn--klt787d":e,\u798F\u5CF6:e,"xn--rny31h":e,\u79CB\u7530:e,"xn--7t0a264c":e,\u7FA4\u99AC:e,"xn--uist22h":e,\u8328\u57CE:e,"xn--8ltr62k":e,\u9577\u5D0E:e,"xn--2m4a15e":e,\u9577\u91CE:e,"xn--32vp30h":e,\u9752\u68EE:e,"xn--4it797k":e,\u9759\u5CA1:e,"xn--5rtq34k":e,\u9999\u5DDD:e,"xn--k7yn95e":e,\u9AD8\u77E5:e,"xn--tor131o":e,\u9CE5\u53D6:e,"xn--d5qv7z876c":e,\u9E7F\u5150\u5CF6:e,kawasaki:f,kitakyushu:f,kobe:f,nagoya:f,sapporo:f,sendai:f,yokohama:f,buyshop:a,fashionstore:a,handcrafted:a,kawaiishop:a,supersale:a,theshop:a,"0am":a,"0g0":a,"0j0":a,"0t0":a,mydns:a,pgw:a,wjg:a,usercontent:a,angry:a,babyblue:a,babymilk:a,backdrop:a,bambina:a,bitter:a,blush:a,boo:a,boy:a,boyfriend:a,but:a,candypop:a,capoo:a,catfood:a,cheap:a,chicappa:a,chillout:a,chips:a,chowder:a,chu:a,ciao:a,cocotte:a,coolblog:a,cranky:a,cutegirl:a,daa:a,deca:a,deci:a,digick:a,egoism:a,fakefur:a,fem:a,flier:a,floppy:a,fool:a,frenchkiss:a,girlfriend:a,girly:a,gloomy:a,gonna:a,greater:a,hacca:a,heavy:a,her:a,hiho:a,hippy:a,holy:a,hungry:a,icurus:a,itigo:a,jellybean:a,kikirara:a,kill:a,kilo:a,kuron:a,littlestar:a,lolipopmc:a,lolitapunk:a,lomo:a,lovepop:a,lovesick:a,main:a,mods:a,mond:a,mongolian:a,moo:a,namaste:a,nikita:a,nobushi:a,noor:a,oops:a,parallel:a,parasite:a,pecori:a,peewee:a,penne:a,pepper:a,perma:a,pigboat:a,pinoko:a,punyu:a,pupu:a,pussycat:a,pya:a,raindrop:a,readymade:a,sadist:a,schoolbus:a,secret:a,staba:a,stripper:a,sub:a,sunnyday:a,thick:a,tonkotsu:a,under:a,upper:a,velvet:a,verse:a,versus:a,vivian:a,watson:a,weblike:a,whitesnow:a,zombie:a,hateblo:a,hatenablog:a,hatenadiary:a,"2-d":a,bona:a,crap:a,daynight:a,eek:a,flop:a,halfmoon:a,jeez:a,matrix:a,mimoza:a,netgamers:a,nyanta:a,o0o0:a,rdy:a,rgr:a,rulez:a,sakurastorage:[0,{isk01:J,isk02:J}],saloon:a,sblo:a,skr:a,tank:a,"uh-oh":a,undo:a,webaccel:[0,{rs:a,user:a}],websozai:a,xii:a}],ke:[1,{ac:e,co:e,go:e,info:e,me:e,mobi:e,ne:e,or:e,sc:e}],kg:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,us:a}],kh:f,ki:Ce,km:[1,{ass:e,com:e,edu:e,gov:e,mil:e,nom:e,org:e,prd:e,tm:e,asso:e,coop:e,gouv:e,medecin:e,notaires:e,pharmaciens:e,presse:e,veterinaire:e}],kn:[1,{edu:e,gov:e,net:e,org:e}],kp:[1,{com:e,edu:e,gov:e,org:e,rep:e,tra:e}],kr:[1,{ac:e,ai:e,co:e,es:e,go:e,hs:e,io:e,it:e,kg:e,me:e,mil:e,ms:e,ne:e,or:e,pe:e,re:e,sc:e,busan:e,chungbuk:e,chungnam:e,daegu:e,daejeon:e,gangwon:e,gwangju:e,gyeongbuk:e,gyeonggi:e,gyeongnam:e,incheon:e,jeju:e,jeonbuk:e,jeonnam:e,seoul:e,ulsan:e,c01:a,"eliv-dns":a}],kw:[1,{com:e,edu:e,emb:e,gov:e,ind:e,net:e,org:e}],ky:W,kz:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,jcloud:a}],la:[1,{com:e,edu:e,gov:e,info:e,int:e,net:e,org:e,per:e,bnr:a}],lb:t,lc:[1,{co:e,com:e,edu:e,gov:e,net:e,org:e,oy:a}],li:e,lk:[1,{ac:e,assn:e,com:e,edu:e,gov:e,grp:e,hotel:e,int:e,ltd:e,net:e,ngo:e,org:e,sch:e,soc:e,web:e}],lr:t,ls:[1,{ac:e,biz:e,co:e,edu:e,gov:e,info:e,net:e,org:e,sc:e}],lt:d,lu:[1,{"123website":a}],lv:[1,{asn:e,com:e,conf:e,edu:e,gov:e,id:e,mil:e,net:e,org:e}],ly:[1,{com:e,edu:e,gov:e,id:e,med:e,net:e,org:e,plc:e,sch:e}],ma:[1,{ac:e,co:e,gov:e,net:e,org:e,press:e}],mc:[1,{asso:e,tm:e}],md:[1,{ir:a}],me:[1,{ac:e,co:e,edu:e,gov:e,its:e,net:e,org:e,priv:e,c66:a,craft:a,edgestack:a,filegear:a,glitch:a,"filegear-sg":a,lohmus:a,barsy:a,mcdir:a,brasilia:a,ddns:a,dnsfor:a,hopto:a,loginto:a,noip:a,webhop:a,soundcast:a,tcp4:a,vp4:a,diskstation:a,dscloud:a,i234:a,myds:a,synology:a,transip:F,nohost:a}],mg:[1,{co:e,com:e,edu:e,gov:e,mil:e,nom:e,org:e,prd:e}],mh:e,mil:e,mk:[1,{com:e,edu:e,gov:e,inf:e,name:e,net:e,org:e}],ml:[1,{ac:e,art:e,asso:e,com:e,edu:e,gouv:e,gov:e,info:e,inst:e,net:e,org:e,pr:e,presse:e}],mm:f,mn:[1,{edu:e,gov:e,org:e,nyc:a}],mo:t,mobi:[1,{barsy:a,dscloud:a}],mp:[1,{ju:a}],mq:e,mr:d,ms:[1,{com:e,edu:e,gov:e,net:e,org:e,minisite:a}],mt:W,mu:[1,{ac:e,co:e,com:e,gov:e,net:e,or:e,org:e}],museum:e,mv:[1,{aero:e,biz:e,com:e,coop:e,edu:e,gov:e,info:e,int:e,mil:e,museum:e,name:e,net:e,org:e,pro:e}],mw:[1,{ac:e,biz:e,co:e,com:e,coop:e,edu:e,gov:e,int:e,net:e,org:e}],mx:[1,{com:e,edu:e,gob:e,net:e,org:e}],my:[1,{biz:e,com:e,edu:e,gov:e,mil:e,name:e,net:e,org:e}],mz:[1,{ac:e,adv:e,co:e,edu:e,gov:e,mil:e,net:e,org:e}],na:[1,{alt:e,co:e,com:e,gov:e,net:e,org:e}],name:[1,{her:De,his:De}],nc:[1,{asso:e,nom:e}],ne:e,net:[1,{adobeaemcloud:a,"adobeio-static":a,adobeioruntime:a,akadns:a,akamai:a,"akamai-staging":a,akamaiedge:a,"akamaiedge-staging":a,akamaihd:a,"akamaihd-staging":a,akamaiorigin:a,"akamaiorigin-staging":a,akamaized:a,"akamaized-staging":a,edgekey:a,"edgekey-staging":a,edgesuite:a,"edgesuite-staging":a,alwaysdata:a,myamaze:a,cloudfront:a,appudo:a,"atlassian-dev":[0,{prod:P}],myfritz:a,onavstack:a,shopselect:a,blackbaudcdn:a,boomla:a,bplaced:a,square7:a,cdn77:[0,{r:a}],"cdn77-ssl":a,gb:a,hu:a,jp:a,se:a,uk:a,clickrising:a,"ddns-ip":a,"dns-cloud":a,"dns-dynamic":a,cloudaccess:a,cloudflare:[2,{cdn:a}],cloudflareanycast:P,cloudflarecn:P,cloudflareglobal:P,ctfcloud:a,"feste-ip":a,"knx-server":a,"static-access":a,cryptonomic:o,dattolocal:a,mydatto:a,debian:a,definima:a,deno:a,"at-band-camp":a,blogdns:a,"broke-it":a,buyshouses:a,dnsalias:a,dnsdojo:a,"does-it":a,dontexist:a,dynalias:a,dynathome:a,endofinternet:a,"from-az":a,"from-co":a,"from-la":a,"from-ny":a,"gets-it":a,"ham-radio-op":a,homeftp:a,homeip:a,homelinux:a,homeunix:a,"in-the-band":a,"is-a-chef":a,"is-a-geek":a,"isa-geek":a,"kicks-ass":a,"office-on-the":a,podzone:a,"scrapper-site":a,selfip:a,"sells-it":a,servebbs:a,serveftp:a,thruhere:a,webhop:a,casacam:a,dynu:a,dynv6:a,twmail:a,ru:a,channelsdvr:[2,{u:a}],fastly:[0,{freetls:a,map:a,prod:[0,{a,global:a}],ssl:[0,{a,b:a,global:a}]}],fastlylb:[2,{map:a}],edgeapp:a,"keyword-on":a,"live-on":a,"server-on":a,"cdn-edges":a,heteml:a,cloudfunctions:a,"grafana-dev":a,iobb:a,moonscale:a,"in-dsl":a,"in-vpn":a,oninferno:a,botdash:a,"apps-1and1":a,ipifony:a,cloudjiffy:[2,{"fra1-de":a,"west1-us":a}],elastx:[0,{"jls-sto1":a,"jls-sto2":a,"jls-sto3":a}],massivegrid:[0,{paas:[0,{"fr-1":a,"lon-1":a,"lon-2":a,"ny-1":a,"ny-2":a,"sg-1":a}]}],saveincloud:[0,{jelastic:a,"nordeste-idc":a}],scaleforce:V,kinghost:a,uni5:a,krellian:a,ggff:a,localcert:a,localhostcert:a,localto:o,barsy:a,memset:a,"azure-api":a,"azure-mobile":a,azureedge:a,azurefd:a,azurestaticapps:[2,{1:a,2:a,3:a,4:a,5:a,6:a,7:a,centralus:a,eastasia:a,eastus2:a,westeurope:a,westus2:a}],azurewebsites:a,cloudapp:a,trafficmanager:a,windows:[0,{core:[0,{blob:a}],servicebus:a}],mynetname:[0,{sn:a}],routingthecloud:a,bounceme:a,ddns:a,"eating-organic":a,mydissent:a,myeffect:a,mymediapc:a,mypsx:a,mysecuritycamera:a,nhlfan:a,"no-ip":a,pgafan:a,privatizehealthinsurance:a,redirectme:a,serveblog:a,serveminecraft:a,sytes:a,dnsup:a,hicam:a,"now-dns":a,ownip:a,vpndns:a,cloudycluster:a,ovh:[0,{hosting:o,webpaas:o}],rackmaze:a,myradweb:a,in:a,"subsc-pay":a,squares:a,schokokeks:a,"firewall-gateway":a,seidat:a,senseering:a,siteleaf:a,mafelo:a,myspreadshop:a,"vps-host":[2,{jelastic:[0,{atl:a,njs:a,ric:a}]}],srcf:[0,{soc:a,user:a}],supabase:a,dsmynas:a,familyds:a,ts:[2,{c:o}],torproject:[2,{pages:a}],vusercontent:a,"reserve-online":a,"community-pro":a,meinforum:a,yandexcloud:[2,{storage:a,website:a}],za:a}],nf:[1,{arts:e,com:e,firm:e,info:e,net:e,other:e,per:e,rec:e,store:e,web:e}],ng:[1,{com:e,edu:e,gov:e,i:e,mil:e,mobi:e,name:e,net:e,org:e,sch:e,biz:[2,{co:a,dl:a,go:a,lg:a,on:a}],col:a,firm:a,gen:a,ltd:a,ngo:a,plc:a}],ni:[1,{ac:e,biz:e,co:e,com:e,edu:e,gob:e,in:e,info:e,int:e,mil:e,net:e,nom:e,org:e,web:e}],nl:[1,{co:a,"hosting-cluster":a,gov:a,khplay:a,"123website":a,myspreadshop:a,transurl:o,cistron:a,demon:a}],no:[1,{fhs:e,folkebibl:e,fylkesbibl:e,idrett:e,museum:e,priv:e,vgs:e,dep:e,herad:e,kommune:e,mil:e,stat:e,aa:p,ah:p,bu:p,fm:p,hl:p,hm:p,"jan-mayen":p,mr:p,nl:p,nt:p,of:p,ol:p,oslo:p,rl:p,sf:p,st:p,svalbard:p,tm:p,tr:p,va:p,vf:p,akrehamn:e,"xn--krehamn-dxa":e,\u00E5krehamn:e,algard:e,"xn--lgrd-poac":e,\u00E5lg\u00E5rd:e,arna:e,bronnoysund:e,"xn--brnnysund-m8ac":e,br\u00F8nn\u00F8ysund:e,brumunddal:e,bryne:e,drobak:e,"xn--drbak-wua":e,dr\u00F8bak:e,egersund:e,fetsund:e,floro:e,"xn--flor-jra":e,flor\u00F8:e,fredrikstad:e,hokksund:e,honefoss:e,"xn--hnefoss-q1a":e,h\u00F8nefoss:e,jessheim:e,jorpeland:e,"xn--jrpeland-54a":e,j\u00F8rpeland:e,kirkenes:e,kopervik:e,krokstadelva:e,langevag:e,"xn--langevg-jxa":e,langev\u00E5g:e,leirvik:e,mjondalen:e,"xn--mjndalen-64a":e,mj\u00F8ndalen:e,"mo-i-rana":e,mosjoen:e,"xn--mosjen-eya":e,mosj\u00F8en:e,nesoddtangen:e,orkanger:e,osoyro:e,"xn--osyro-wua":e,os\u00F8yro:e,raholt:e,"xn--rholt-mra":e,r\u00E5holt:e,sandnessjoen:e,"xn--sandnessjen-ogb":e,sandnessj\u00F8en:e,skedsmokorset:e,slattum:e,spjelkavik:e,stathelle:e,stavern:e,stjordalshalsen:e,"xn--stjrdalshalsen-sqb":e,stj\u00F8rdalshalsen:e,tananger:e,tranby:e,vossevangen:e,aarborte:e,aejrie:e,afjord:e,"xn--fjord-lra":e,\u00E5fjord:e,agdenes:e,akershus:Ee,aknoluokta:e,"xn--koluokta-7ya57h":e,\u00E1k\u014Boluokta:e,al:e,"xn--l-1fa":e,\u00E5l:e,alaheadju:e,"xn--laheadju-7ya":e,\u00E1laheadju:e,alesund:e,"xn--lesund-hua":e,\u00E5lesund:e,alstahaug:e,alta:e,"xn--lt-liac":e,\u00E1lt\u00E1:e,alvdal:e,amli:e,"xn--mli-tla":e,\u00E5mli:e,amot:e,"xn--mot-tla":e,\u00E5mot:e,andasuolo:e,andebu:e,andoy:e,"xn--andy-ira":e,and\u00F8y:e,ardal:e,"xn--rdal-poa":e,\u00E5rdal:e,aremark:e,arendal:e,"xn--s-1fa":e,\u00E5s:e,aseral:e,"xn--seral-lra":e,\u00E5seral:e,asker:e,askim:e,askoy:e,"xn--asky-ira":e,ask\u00F8y:e,askvoll:e,asnes:e,"xn--snes-poa":e,\u00E5snes:e,audnedaln:e,aukra:e,aure:e,aurland:e,"aurskog-holand":e,"xn--aurskog-hland-jnb":e,"aurskog-h\xF8land":e,austevoll:e,austrheim:e,averoy:e,"xn--avery-yua":e,aver\u00F8y:e,badaddja:e,"xn--bdddj-mrabd":e,b\u00E5d\u00E5ddj\u00E5:e,"xn--brum-voa":e,b\u00E6rum:e,bahcavuotna:e,"xn--bhcavuotna-s4a":e,b\u00E1hcavuotna:e,bahccavuotna:e,"xn--bhccavuotna-k7a":e,b\u00E1hccavuotna:e,baidar:e,"xn--bidr-5nac":e,b\u00E1id\u00E1r:e,bajddar:e,"xn--bjddar-pta":e,b\u00E1jddar:e,balat:e,"xn--blt-elab":e,b\u00E1l\u00E1t:e,balestrand:e,ballangen:e,balsfjord:e,bamble:e,bardu:e,barum:e,batsfjord:e,"xn--btsfjord-9za":e,b\u00E5tsfjord:e,bearalvahki:e,"xn--bearalvhki-y4a":e,bearalv\u00E1hki:e,beardu:e,beiarn:e,berg:e,bergen:e,berlevag:e,"xn--berlevg-jxa":e,berlev\u00E5g:e,bievat:e,"xn--bievt-0qa":e,biev\u00E1t:e,bindal:e,birkenes:e,bjarkoy:e,"xn--bjarky-fya":e,bjark\u00F8y:e,bjerkreim:e,bjugn:e,bodo:e,"xn--bod-2na":e,bod\u00F8:e,bokn:e,bomlo:e,"xn--bmlo-gra":e,b\u00F8mlo:e,bremanger:e,bronnoy:e,"xn--brnny-wuac":e,br\u00F8nn\u00F8y:e,budejju:e,buskerud:Ee,bygland:e,bykle:e,cahcesuolo:e,"xn--hcesuolo-7ya35b":e,\u010D\u00E1hcesuolo:e,davvenjarga:e,"xn--davvenjrga-y4a":e,davvenj\u00E1rga:e,davvesiida:e,deatnu:e,dielddanuorri:e,divtasvuodna:e,divttasvuotna:e,donna:e,"xn--dnna-gra":e,d\u00F8nna:e,dovre:e,drammen:e,drangedal:e,dyroy:e,"xn--dyry-ira":e,dyr\u00F8y:e,eid:e,eidfjord:e,eidsberg:e,eidskog:e,eidsvoll:e,eigersund:e,elverum:e,enebakk:e,engerdal:e,etne:e,etnedal:e,evenassi:e,"xn--eveni-0qa01ga":e,even\u00E1\u0161\u0161i:e,evenes:e,"evje-og-hornnes":e,farsund:e,fauske:e,fedje:e,fet:e,finnoy:e,"xn--finny-yua":e,finn\u00F8y:e,fitjar:e,fjaler:e,fjell:e,fla:e,"xn--fl-zia":e,fl\u00E5:e,flakstad:e,flatanger:e,flekkefjord:e,flesberg:e,flora:e,folldal:e,forde:e,"xn--frde-gra":e,f\u00F8rde:e,forsand:e,fosnes:e,"xn--frna-woa":e,fr\u00E6na:e,frana:e,frei:e,frogn:e,froland:e,frosta:e,froya:e,"xn--frya-hra":e,fr\u00F8ya:e,fuoisku:e,fuossko:e,fusa:e,fyresdal:e,gaivuotna:e,"xn--givuotna-8ya":e,g\u00E1ivuotna:e,galsa:e,"xn--gls-elac":e,g\u00E1ls\u00E1:e,gamvik:e,gangaviika:e,"xn--ggaviika-8ya47h":e,g\u00E1\u014Bgaviika:e,gaular:e,gausdal:e,giehtavuoatna:e,gildeskal:e,"xn--gildeskl-g0a":e,gildesk\u00E5l:e,giske:e,gjemnes:e,gjerdrum:e,gjerstad:e,gjesdal:e,gjovik:e,"xn--gjvik-wua":e,gj\u00F8vik:e,gloppen:e,gol:e,gran:e,grane:e,granvin:e,gratangen:e,grimstad:e,grong:e,grue:e,gulen:e,guovdageaidnu:e,ha:e,"xn--h-2fa":e,h\u00E5:e,habmer:e,"xn--hbmer-xqa":e,h\u00E1bmer:e,hadsel:e,"xn--hgebostad-g3a":e,h\u00E6gebostad:e,hagebostad:e,halden:e,halsa:e,hamar:e,hamaroy:e,hammarfeasta:e,"xn--hmmrfeasta-s4ac":e,h\u00E1mm\u00E1rfeasta:e,hammerfest:e,hapmir:e,"xn--hpmir-xqa":e,h\u00E1pmir:e,haram:e,hareid:e,harstad:e,hasvik:e,hattfjelldal:e,haugesund:e,hedmark:[0,{os:e,valer:e,"xn--vler-qoa":e,v\u00E5ler:e}],hemne:e,hemnes:e,hemsedal:e,hitra:e,hjartdal:e,hjelmeland:e,hobol:e,"xn--hobl-ira":e,hob\u00F8l:e,hof:e,hol:e,hole:e,holmestrand:e,holtalen:e,"xn--holtlen-hxa":e,holt\u00E5len:e,hordaland:[0,{os:e}],hornindal:e,horten:e,hoyanger:e,"xn--hyanger-q1a":e,h\u00F8yanger:e,hoylandet:e,"xn--hylandet-54a":e,h\u00F8ylandet:e,hurdal:e,hurum:e,hvaler:e,hyllestad:e,ibestad:e,inderoy:e,"xn--indery-fya":e,inder\u00F8y:e,iveland:e,ivgu:e,jevnaker:e,jolster:e,"xn--jlster-bya":e,j\u00F8lster:e,jondal:e,kafjord:e,"xn--kfjord-iua":e,k\u00E5fjord:e,karasjohka:e,"xn--krjohka-hwab49j":e,k\u00E1r\u00E1\u0161johka:e,karasjok:e,karlsoy:e,karmoy:e,"xn--karmy-yua":e,karm\u00F8y:e,kautokeino:e,klabu:e,"xn--klbu-woa":e,kl\u00E6bu:e,klepp:e,kongsberg:e,kongsvinger:e,kraanghke:e,"xn--kranghke-b0a":e,kr\u00E5anghke:e,kragero:e,"xn--krager-gya":e,krager\u00F8:e,kristiansand:e,kristiansund:e,krodsherad:e,"xn--krdsherad-m8a":e,kr\u00F8dsherad:e,"xn--kvfjord-nxa":e,kv\u00E6fjord:e,"xn--kvnangen-k0a":e,kv\u00E6nangen:e,kvafjord:e,kvalsund:e,kvam:e,kvanangen:e,kvinesdal:e,kvinnherad:e,kviteseid:e,kvitsoy:e,"xn--kvitsy-fya":e,kvits\u00F8y:e,laakesvuemie:e,"xn--lrdal-sra":e,l\u00E6rdal:e,lahppi:e,"xn--lhppi-xqa":e,l\u00E1hppi:e,lardal:e,larvik:e,lavagis:e,lavangen:e,leangaviika:e,"xn--leagaviika-52b":e,lea\u014Bgaviika:e,lebesby:e,leikanger:e,leirfjord:e,leka:e,leksvik:e,lenvik:e,lerdal:e,lesja:e,levanger:e,lier:e,lierne:e,lillehammer:e,lillesand:e,lindas:e,"xn--linds-pra":e,lind\u00E5s:e,lindesnes:e,loabat:e,"xn--loabt-0qa":e,loab\u00E1t:e,lodingen:e,"xn--ldingen-q1a":e,l\u00F8dingen:e,lom:e,loppa:e,lorenskog:e,"xn--lrenskog-54a":e,l\u00F8renskog:e,loten:e,"xn--lten-gra":e,l\u00F8ten:e,lund:e,lunner:e,luroy:e,"xn--lury-ira":e,lur\u00F8y:e,luster:e,lyngdal:e,lyngen:e,malatvuopmi:e,"xn--mlatvuopmi-s4a":e,m\u00E1latvuopmi:e,malselv:e,"xn--mlselv-iua":e,m\u00E5lselv:e,malvik:e,mandal:e,marker:e,marnardal:e,masfjorden:e,masoy:e,"xn--msy-ula0h":e,m\u00E5s\u00F8y:e,"matta-varjjat":e,"xn--mtta-vrjjat-k7af":e,"m\xE1tta-v\xE1rjjat":e,meland:e,meldal:e,melhus:e,meloy:e,"xn--mely-ira":e,mel\u00F8y:e,meraker:e,"xn--merker-kua":e,mer\u00E5ker:e,midsund:e,"midtre-gauldal":e,moareke:e,"xn--moreke-jua":e,mo\u00E5reke:e,modalen:e,modum:e,molde:e,"more-og-romsdal":[0,{heroy:e,sande:e}],"xn--mre-og-romsdal-qqb":[0,{"xn--hery-ira":e,sande:e}],"m\xF8re-og-romsdal":[0,{her\u00F8y:e,sande:e}],moskenes:e,moss:e,mosvik:e,muosat:e,"xn--muost-0qa":e,muos\u00E1t:e,naamesjevuemie:e,"xn--nmesjevuemie-tcba":e,n\u00E5\u00E5mesjevuemie:e,"xn--nry-yla5g":e,n\u00E6r\u00F8y:e,namdalseid:e,namsos:e,namsskogan:e,nannestad:e,naroy:e,narviika:e,narvik:e,naustdal:e,navuotna:e,"xn--nvuotna-hwa":e,n\u00E1vuotna:e,"nedre-eiker":e,nesna:e,nesodden:e,nesseby:e,nesset:e,nissedal:e,nittedal:e,"nord-aurdal":e,"nord-fron":e,"nord-odal":e,norddal:e,nordkapp:e,nordland:[0,{bo:e,"xn--b-5ga":e,b\u00F8:e,heroy:e,"xn--hery-ira":e,her\u00F8y:e}],"nordre-land":e,nordreisa:e,"nore-og-uvdal":e,notodden:e,notteroy:e,"xn--nttery-byae":e,n\u00F8tter\u00F8y:e,odda:e,oksnes:e,"xn--ksnes-uua":e,\u00F8ksnes:e,omasvuotna:e,oppdal:e,oppegard:e,"xn--oppegrd-ixa":e,oppeg\u00E5rd:e,orkdal:e,orland:e,"xn--rland-uua":e,\u00F8rland:e,orskog:e,"xn--rskog-uua":e,\u00F8rskog:e,orsta:e,"xn--rsta-fra":e,\u00F8rsta:e,osen:e,osteroy:e,"xn--ostery-fya":e,oster\u00F8y:e,ostfold:[0,{valer:e}],"xn--stfold-9xa":[0,{"xn--vler-qoa":e}],\u00F8stfold:[0,{v\u00E5ler:e}],"ostre-toten":e,"xn--stre-toten-zcb":e,"\xF8stre-toten":e,overhalla:e,"ovre-eiker":e,"xn--vre-eiker-k8a":e,"\xF8vre-eiker":e,oyer:e,"xn--yer-zna":e,\u00F8yer:e,oygarden:e,"xn--ygarden-p1a":e,\u00F8ygarden:e,"oystre-slidre":e,"xn--ystre-slidre-ujb":e,"\xF8ystre-slidre":e,porsanger:e,porsangu:e,"xn--porsgu-sta26f":e,pors\u00E1\u014Bgu:e,porsgrunn:e,rade:e,"xn--rde-ula":e,r\u00E5de:e,radoy:e,"xn--rady-ira":e,rad\u00F8y:e,"xn--rlingen-mxa":e,r\u00E6lingen:e,rahkkeravju:e,"xn--rhkkervju-01af":e,r\u00E1hkker\u00E1vju:e,raisa:e,"xn--risa-5na":e,r\u00E1isa:e,rakkestad:e,ralingen:e,rana:e,randaberg:e,rauma:e,rendalen:e,rennebu:e,rennesoy:e,"xn--rennesy-v1a":e,rennes\u00F8y:e,rindal:e,ringebu:e,ringerike:e,ringsaker:e,risor:e,"xn--risr-ira":e,ris\u00F8r:e,rissa:e,roan:e,rodoy:e,"xn--rdy-0nab":e,r\u00F8d\u00F8y:e,rollag:e,romsa:e,romskog:e,"xn--rmskog-bya":e,r\u00F8mskog:e,roros:e,"xn--rros-gra":e,r\u00F8ros:e,rost:e,"xn--rst-0na":e,r\u00F8st:e,royken:e,"xn--ryken-vua":e,r\u00F8yken:e,royrvik:e,"xn--ryrvik-bya":e,r\u00F8yrvik:e,ruovat:e,rygge:e,salangen:e,salat:e,"xn--slat-5na":e,s\u00E1lat:e,"xn--slt-elab":e,s\u00E1l\u00E1t:e,saltdal:e,samnanger:e,sandefjord:e,sandnes:e,sandoy:e,"xn--sandy-yua":e,sand\u00F8y:e,sarpsborg:e,sauda:e,sauherad:e,sel:e,selbu:e,selje:e,seljord:e,siellak:e,sigdal:e,siljan:e,sirdal:e,skanit:e,"xn--sknit-yqa":e,sk\u00E1nit:e,skanland:e,"xn--sknland-fxa":e,sk\u00E5nland:e,skaun:e,skedsmo:e,ski:e,skien:e,skierva:e,"xn--skierv-uta":e,skierv\u00E1:e,skiptvet:e,skjak:e,"xn--skjk-soa":e,skj\u00E5k:e,skjervoy:e,"xn--skjervy-v1a":e,skjerv\u00F8y:e,skodje:e,smola:e,"xn--smla-hra":e,sm\u00F8la:e,snaase:e,"xn--snase-nra":e,sn\u00E5ase:e,snasa:e,"xn--snsa-roa":e,sn\u00E5sa:e,snillfjord:e,snoasa:e,sogndal:e,sogne:e,"xn--sgne-gra":e,s\u00F8gne:e,sokndal:e,sola:e,solund:e,somna:e,"xn--smna-gra":e,s\u00F8mna:e,"sondre-land":e,"xn--sndre-land-0cb":e,"s\xF8ndre-land":e,songdalen:e,"sor-aurdal":e,"xn--sr-aurdal-l8a":e,"s\xF8r-aurdal":e,"sor-fron":e,"xn--sr-fron-q1a":e,"s\xF8r-fron":e,"sor-odal":e,"xn--sr-odal-q1a":e,"s\xF8r-odal":e,"sor-varanger":e,"xn--sr-varanger-ggb":e,"s\xF8r-varanger":e,sorfold:e,"xn--srfold-bya":e,s\u00F8rfold:e,sorreisa:e,"xn--srreisa-q1a":e,s\u00F8rreisa:e,sortland:e,sorum:e,"xn--srum-gra":e,s\u00F8rum:e,spydeberg:e,stange:e,stavanger:e,steigen:e,steinkjer:e,stjordal:e,"xn--stjrdal-s1a":e,stj\u00F8rdal:e,stokke:e,"stor-elvdal":e,stord:e,stordal:e,storfjord:e,strand:e,stranda:e,stryn:e,sula:e,suldal:e,sund:e,sunndal:e,surnadal:e,sveio:e,svelvik:e,sykkylven:e,tana:e,telemark:[0,{bo:e,"xn--b-5ga":e,b\u00F8:e}],time:e,tingvoll:e,tinn:e,tjeldsund:e,tjome:e,"xn--tjme-hra":e,tj\u00F8me:e,tokke:e,tolga:e,tonsberg:e,"xn--tnsberg-q1a":e,t\u00F8nsberg:e,torsken:e,"xn--trna-woa":e,tr\u00E6na:e,trana:e,tranoy:e,"xn--trany-yua":e,tran\u00F8y:e,troandin:e,trogstad:e,"xn--trgstad-r1a":e,tr\u00F8gstad:e,tromsa:e,tromso:e,"xn--troms-zua":e,troms\u00F8:e,trondheim:e,trysil:e,tvedestrand:e,tydal:e,tynset:e,tysfjord:e,tysnes:e,"xn--tysvr-vra":e,tysv\u00E6r:e,tysvar:e,ullensaker:e,ullensvang:e,ulvik:e,unjarga:e,"xn--unjrga-rta":e,unj\u00E1rga:e,utsira:e,vaapste:e,vadso:e,"xn--vads-jra":e,vads\u00F8:e,"xn--vry-yla5g":e,v\u00E6r\u00F8y:e,vaga:e,"xn--vg-yiab":e,v\u00E5g\u00E5:e,vagan:e,"xn--vgan-qoa":e,v\u00E5gan:e,vagsoy:e,"xn--vgsy-qoa0j":e,v\u00E5gs\u00F8y:e,vaksdal:e,valle:e,vang:e,vanylven:e,vardo:e,"xn--vard-jra":e,vard\u00F8:e,varggat:e,"xn--vrggt-xqad":e,v\u00E1rgg\u00E1t:e,varoy:e,vefsn:e,vega:e,vegarshei:e,"xn--vegrshei-c0a":e,veg\u00E5rshei:e,vennesla:e,verdal:e,verran:e,vestby:e,vestfold:[0,{sande:e}],vestnes:e,"vestre-slidre":e,"vestre-toten":e,vestvagoy:e,"xn--vestvgy-ixa6o":e,vestv\u00E5g\u00F8y:e,vevelstad:e,vik:e,vikna:e,vindafjord:e,voagat:e,volda:e,voss:e,co:a,"123hjemmeside":a,myspreadshop:a}],np:f,nr:Ce,nu:[1,{merseine:a,mine:a,shacknet:a,enterprisecloud:a}],nz:[1,{ac:e,co:e,cri:e,geek:e,gen:e,govt:e,health:e,iwi:e,kiwi:e,maori:e,"xn--mori-qsa":e,m\u0101ori:e,mil:e,net:e,org:e,parliament:e,school:e,cloudns:a}],om:[1,{co:e,com:e,edu:e,gov:e,med:e,museum:e,net:e,org:e,pro:e}],onion:e,org:[1,{altervista:a,pimienta:a,poivron:a,potager:a,sweetpepper:a,cdn77:[0,{c:a,rsc:a}],"cdn77-secure":[0,{origin:[0,{ssl:a}]}],ae:a,cloudns:a,"ip-dynamic":a,ddnss:a,dpdns:a,duckdns:a,tunk:a,blogdns:a,blogsite:a,boldlygoingnowhere:a,dnsalias:a,dnsdojo:a,doesntexist:a,dontexist:a,doomdns:a,dvrdns:a,dynalias:a,dyndns:[2,{go:a,home:a}],endofinternet:a,endoftheinternet:a,"from-me":a,"game-host":a,gotdns:a,"hobby-site":a,homedns:a,homeftp:a,homelinux:a,homeunix:a,"is-a-bruinsfan":a,"is-a-candidate":a,"is-a-celticsfan":a,"is-a-chef":a,"is-a-geek":a,"is-a-knight":a,"is-a-linux-user":a,"is-a-patsfan":a,"is-a-soxfan":a,"is-found":a,"is-lost":a,"is-saved":a,"is-very-bad":a,"is-very-evil":a,"is-very-good":a,"is-very-nice":a,"is-very-sweet":a,"isa-geek":a,"kicks-ass":a,misconfused:a,podzone:a,readmyblog:a,selfip:a,sellsyourhome:a,servebbs:a,serveftp:a,servegame:a,"stuff-4-sale":a,webhop:a,accesscam:a,camdvr:a,freeddns:a,mywire:a,webredirect:a,twmail:a,eu:[2,{al:a,asso:a,at:a,au:a,be:a,bg:a,ca:a,cd:a,ch:a,cn:a,cy:a,cz:a,de:a,dk:a,edu:a,ee:a,es:a,fi:a,fr:a,gr:a,hr:a,hu:a,ie:a,il:a,in:a,int:a,is:a,it:a,jp:a,kr:a,lt:a,lu:a,lv:a,me:a,mk:a,mt:a,my:a,net:a,ng:a,nl:a,no:a,nz:a,pl:a,pt:a,ro:a,ru:a,se:a,si:a,sk:a,tr:a,uk:a,us:a}],fedorainfracloud:a,fedorapeople:a,fedoraproject:[0,{cloud:a,os:N,stg:[0,{os:N}]}],freedesktop:a,hatenadiary:a,hepforge:a,"in-dsl":a,"in-vpn":a,js:a,barsy:a,mayfirst:a,routingthecloud:a,bmoattachments:a,"cable-modem":a,collegefan:a,couchpotatofries:a,hopto:a,mlbfan:a,myftp:a,mysecuritycamera:a,nflfan:a,"no-ip":a,"read-books":a,ufcfan:a,zapto:a,dynserv:a,"now-dns":a,"is-local":a,httpbin:a,pubtls:a,jpn:a,"my-firewall":a,myfirewall:a,spdns:a,"small-web":a,dsmynas:a,familyds:a,teckids:J,tuxfamily:a,diskstation:a,hk:a,us:a,toolforge:a,wmcloud:a,wmflabs:a,za:a}],pa:[1,{abo:e,ac:e,com:e,edu:e,gob:e,ing:e,med:e,net:e,nom:e,org:e,sld:e}],pe:[1,{com:e,edu:e,gob:e,mil:e,net:e,nom:e,org:e}],pf:[1,{com:e,edu:e,org:e}],pg:f,ph:[1,{com:e,edu:e,gov:e,i:e,mil:e,net:e,ngo:e,org:e,cloudns:a}],pk:[1,{ac:e,biz:e,com:e,edu:e,fam:e,gkp:e,gob:e,gog:e,gok:e,gop:e,gos:e,gov:e,net:e,org:e,web:e}],pl:[1,{com:e,net:e,org:e,agro:e,aid:e,atm:e,auto:e,biz:e,edu:e,gmina:e,gsm:e,info:e,mail:e,media:e,miasta:e,mil:e,nieruchomosci:e,nom:e,pc:e,powiat:e,priv:e,realestate:e,rel:e,sex:e,shop:e,sklep:e,sos:e,szkola:e,targi:e,tm:e,tourism:e,travel:e,turystyka:e,gov:[1,{ap:e,griw:e,ic:e,is:e,kmpsp:e,konsulat:e,kppsp:e,kwp:e,kwpsp:e,mup:e,mw:e,oia:e,oirm:e,oke:e,oow:e,oschr:e,oum:e,pa:e,pinb:e,piw:e,po:e,pr:e,psp:e,psse:e,pup:e,rzgw:e,sa:e,sdn:e,sko:e,so:e,sr:e,starostwo:e,ug:e,ugim:e,um:e,umig:e,upow:e,uppo:e,us:e,uw:e,uzs:e,wif:e,wiih:e,winb:e,wios:e,witd:e,wiw:e,wkz:e,wsa:e,wskr:e,wsse:e,wuoz:e,wzmiuw:e,zp:e,zpisdn:e}],augustow:e,"babia-gora":e,bedzin:e,beskidy:e,bialowieza:e,bialystok:e,bielawa:e,bieszczady:e,boleslawiec:e,bydgoszcz:e,bytom:e,cieszyn:e,czeladz:e,czest:e,dlugoleka:e,elblag:e,elk:e,glogow:e,gniezno:e,gorlice:e,grajewo:e,ilawa:e,jaworzno:e,"jelenia-gora":e,jgora:e,kalisz:e,karpacz:e,kartuzy:e,kaszuby:e,katowice:e,"kazimierz-dolny":e,kepno:e,ketrzyn:e,klodzko:e,kobierzyce:e,kolobrzeg:e,konin:e,konskowola:e,kutno:e,lapy:e,lebork:e,legnica:e,lezajsk:e,limanowa:e,lomza:e,lowicz:e,lubin:e,lukow:e,malbork:e,malopolska:e,mazowsze:e,mazury:e,mielec:e,mielno:e,mragowo:e,naklo:e,nowaruda:e,nysa:e,olawa:e,olecko:e,olkusz:e,olsztyn:e,opoczno:e,opole:e,ostroda:e,ostroleka:e,ostrowiec:e,ostrowwlkp:e,pila:e,pisz:e,podhale:e,podlasie:e,polkowice:e,pomorskie:e,pomorze:e,prochowice:e,pruszkow:e,przeworsk:e,pulawy:e,radom:e,"rawa-maz":e,rybnik:e,rzeszow:e,sanok:e,sejny:e,skoczow:e,slask:e,slupsk:e,sosnowiec:e,"stalowa-wola":e,starachowice:e,stargard:e,suwalki:e,swidnica:e,swiebodzin:e,swinoujscie:e,szczecin:e,szczytno:e,tarnobrzeg:e,tgory:e,turek:e,tychy:e,ustka:e,walbrzych:e,warmia:e,warszawa:e,waw:e,wegrow:e,wielun:e,wlocl:e,wloclawek:e,wodzislaw:e,wolomin:e,wroclaw:e,zachpomor:e,zagan:e,zarow:e,zgora:e,zgorzelec:e,art:a,gliwice:a,krakow:a,poznan:a,wroc:a,zakopane:a,beep:a,"ecommerce-shop":a,cfolks:a,dfirma:a,dkonto:a,you2:a,shoparena:a,homesklep:a,sdscloud:a,unicloud:a,lodz:a,pabianice:a,plock:a,sieradz:a,skierniewice:a,zgierz:a,krasnik:a,leczna:a,lubartow:a,lublin:a,poniatowa:a,swidnik:a,co:a,torun:a,simplesite:a,myspreadshop:a,gda:a,gdansk:a,gdynia:a,med:a,sopot:a,bielsko:a}],pm:[1,{own:a,name:a}],pn:[1,{co:e,edu:e,gov:e,net:e,org:e}],post:e,pr:[1,{biz:e,com:e,edu:e,gov:e,info:e,isla:e,name:e,net:e,org:e,pro:e,ac:e,est:e,prof:e}],pro:[1,{aaa:e,aca:e,acct:e,avocat:e,bar:e,cpa:e,eng:e,jur:e,law:e,med:e,recht:e,"12chars":a,cloudns:a,barsy:a,ngrok:a}],ps:[1,{com:e,edu:e,gov:e,net:e,org:e,plo:e,sec:e}],pt:[1,{com:e,edu:e,gov:e,int:e,net:e,nome:e,org:e,publ:e,"123paginaweb":a}],pw:[1,{gov:e,cloudns:a,x443:a}],py:[1,{com:e,coop:e,edu:e,gov:e,mil:e,net:e,org:e}],qa:[1,{com:e,edu:e,gov:e,mil:e,name:e,net:e,org:e,sch:e}],re:[1,{asso:e,com:e,netlib:a,can:a}],ro:[1,{arts:e,com:e,firm:e,info:e,nom:e,nt:e,org:e,rec:e,store:e,tm:e,www:e,co:a,shop:a,barsy:a}],rs:[1,{ac:e,co:e,edu:e,gov:e,in:e,org:e,brendly:Re,barsy:a,ox:a}],ru:[1,{ac:a,edu:a,gov:a,int:a,mil:a,eurodir:a,adygeya:a,bashkiria:a,bir:a,cbg:a,com:a,dagestan:a,grozny:a,kalmykia:a,kustanai:a,marine:a,mordovia:a,msk:a,mytis:a,nalchik:a,nov:a,pyatigorsk:a,spb:a,vladikavkaz:a,vladimir:a,na4u:a,mircloud:a,myjino:[2,{hosting:o,landing:o,spectrum:o,vps:o}],cldmail:[0,{hb:a}],mcdir:[2,{vps:a}],mcpre:a,net:a,org:a,pp:a,lk3:a,ras:a}],rw:[1,{ac:e,co:e,coop:e,gov:e,mil:e,net:e,org:e}],sa:[1,{com:e,edu:e,gov:e,med:e,net:e,org:e,pub:e,sch:e}],sb:t,sc:t,sd:[1,{com:e,edu:e,gov:e,info:e,med:e,net:e,org:e,tv:e}],se:[1,{a:e,ac:e,b:e,bd:e,brand:e,c:e,d:e,e,f:e,fh:e,fhsk:e,fhv:e,g:e,h:e,i:e,k:e,komforb:e,kommunalforbund:e,komvux:e,l:e,lanbib:e,m:e,n:e,naturbruksgymn:e,o:e,org:e,p:e,parti:e,pp:e,press:e,r:e,s:e,t:e,tm:e,u:e,w:e,x:e,y:e,z:e,com:a,iopsys:a,"123minsida":a,itcouldbewor:a,myspreadshop:a}],sg:[1,{com:e,edu:e,gov:e,net:e,org:e,enscaled:a}],sh:[1,{com:e,gov:e,mil:e,net:e,org:e,hashbang:a,botda:a,platform:[0,{ent:a,eu:a,us:a}],now:a}],si:[1,{f5:a,gitapp:a,gitpage:a}],sj:e,sk:e,sl:t,sm:e,sn:[1,{art:e,com:e,edu:e,gouv:e,org:e,perso:e,univ:e}],so:[1,{com:e,edu:e,gov:e,me:e,net:e,org:e,surveys:a}],sr:e,ss:[1,{biz:e,co:e,com:e,edu:e,gov:e,me:e,net:e,org:e,sch:e}],st:[1,{co:e,com:e,consulado:e,edu:e,embaixada:e,mil:e,net:e,org:e,principe:e,saotome:e,store:e,helioho:a,kirara:a,noho:a}],su:[1,{abkhazia:a,adygeya:a,aktyubinsk:a,arkhangelsk:a,armenia:a,ashgabad:a,azerbaijan:a,balashov:a,bashkiria:a,bryansk:a,bukhara:a,chimkent:a,dagestan:a,"east-kazakhstan":a,exnet:a,georgia:a,grozny:a,ivanovo:a,jambyl:a,kalmykia:a,kaluga:a,karacol:a,karaganda:a,karelia:a,khakassia:a,krasnodar:a,kurgan:a,kustanai:a,lenug:a,mangyshlak:a,mordovia:a,msk:a,murmansk:a,nalchik:a,navoi:a,"north-kazakhstan":a,nov:a,obninsk:a,penza:a,pokrovsk:a,sochi:a,spb:a,tashkent:a,termez:a,togliatti:a,troitsk:a,tselinograd:a,tula:a,tuva:a,vladikavkaz:a,vladimir:a,vologda:a}],sv:[1,{com:e,edu:e,gob:e,org:e,red:e}],sx:d,sy:i,sz:[1,{ac:e,co:e,org:e}],tc:e,td:e,tel:e,tf:[1,{sch:a}],tg:e,th:[1,{ac:e,co:e,go:e,in:e,mi:e,net:e,or:e,online:a,shop:a}],tj:[1,{ac:e,biz:e,co:e,com:e,edu:e,go:e,gov:e,int:e,mil:e,name:e,net:e,nic:e,org:e,test:e,web:e}],tk:e,tl:d,tm:[1,{co:e,com:e,edu:e,gov:e,mil:e,net:e,nom:e,org:e}],tn:[1,{com:e,ens:e,fin:e,gov:e,ind:e,info:e,intl:e,mincom:e,nat:e,net:e,org:e,perso:e,tourism:e,orangecloud:a}],to:[1,{611:a,com:e,edu:e,gov:e,mil:e,net:e,org:e,oya:a,x0:a,quickconnect:ke,vpnplus:a}],tr:[1,{av:e,bbs:e,bel:e,biz:e,com:e,dr:e,edu:e,gen:e,gov:e,info:e,k12:e,kep:e,mil:e,name:e,net:e,org:e,pol:e,tel:e,tsk:e,tv:e,web:e,nc:d}],tt:[1,{biz:e,co:e,com:e,edu:e,gov:e,info:e,mil:e,name:e,net:e,org:e,pro:e}],tv:[1,{"better-than":a,dyndns:a,"on-the-web":a,"worse-than":a,from:a,sakura:a}],tw:[1,{club:e,com:[1,{mymailer:a}],ebiz:e,edu:e,game:e,gov:e,idv:e,mil:e,net:e,org:e,url:a,mydns:a}],tz:[1,{ac:e,co:e,go:e,hotel:e,info:e,me:e,mil:e,mobi:e,ne:e,or:e,sc:e,tv:e}],ua:[1,{com:e,edu:e,gov:e,in:e,net:e,org:e,cherkassy:e,cherkasy:e,chernigov:e,chernihiv:e,chernivtsi:e,chernovtsy:e,ck:e,cn:e,cr:e,crimea:e,cv:e,dn:e,dnepropetrovsk:e,dnipropetrovsk:e,donetsk:e,dp:e,if:e,"ivano-frankivsk":e,kh:e,kharkiv:e,kharkov:e,kherson:e,khmelnitskiy:e,khmelnytskyi:e,kiev:e,kirovograd:e,km:e,kr:e,kropyvnytskyi:e,krym:e,ks:e,kv:e,kyiv:e,lg:e,lt:e,lugansk:e,luhansk:e,lutsk:e,lv:e,lviv:e,mk:e,mykolaiv:e,nikolaev:e,od:e,odesa:e,odessa:e,pl:e,poltava:e,rivne:e,rovno:e,rv:e,sb:e,sebastopol:e,sevastopol:e,sm:e,sumy:e,te:e,ternopil:e,uz:e,uzhgorod:e,uzhhorod:e,vinnica:e,vinnytsia:e,vn:e,volyn:e,yalta:e,zakarpattia:e,zaporizhzhe:e,zaporizhzhia:e,zhitomir:e,zhytomyr:e,zp:e,zt:e,cc:a,inf:a,ltd:a,cx:a,ie:a,biz:a,co:a,pp:a,v:a}],ug:[1,{ac:e,co:e,com:e,edu:e,go:e,gov:e,mil:e,ne:e,or:e,org:e,sc:e,us:e}],uk:[1,{ac:e,co:[1,{bytemark:[0,{dh:a,vm:a}],layershift:V,barsy:a,barsyonline:a,retrosnub:Pe,"nh-serv":a,"no-ip":a,adimo:a,myspreadshop:a}],gov:[1,{api:a,campaign:a,service:a}],ltd:e,me:e,net:e,nhs:e,org:[1,{glug:a,lug:a,lugs:a,affinitylottery:a,raffleentry:a,weeklylottery:a}],plc:e,police:e,sch:f,conn:a,copro:a,hosp:a,"independent-commission":a,"independent-inquest":a,"independent-inquiry":a,"independent-panel":a,"independent-review":a,"public-inquiry":a,"royal-commission":a,pymnt:a,barsy:a,nimsite:a,oraclegovcloudapps:o}],us:[1,{dni:e,isa:e,nsn:e,ak:c,al:c,ar:c,as:c,az:c,ca:c,co:c,ct:c,dc:c,de:[1,{cc:e,lib:a}],fl:c,ga:c,gu:c,hi:L,ia:c,id:c,il:c,in:c,ks:c,ky:c,la:c,ma:[1,{k12:[1,{chtr:e,paroch:e,pvt:e}],cc:e,lib:e}],md:c,me:c,mi:[1,{k12:e,cc:e,lib:e,"ann-arbor":e,cog:e,dst:e,eaton:e,gen:e,mus:e,tec:e,washtenaw:e}],mn:c,mo:c,ms:c,mt:c,nc:c,nd:L,ne:c,nh:c,nj:c,nm:c,nv:c,ny:c,oh:c,ok:c,or:c,pa:c,pr:c,ri:L,sc:c,sd:L,tn:c,tx:c,ut:c,va:c,vi:c,vt:c,wa:c,wi:c,wv:[1,{cc:e}],wy:c,cloudns:a,"is-by":a,"land-4-sale":a,"stuff-4-sale":a,heliohost:a,enscaled:[0,{phx:a}],mircloud:a,ngo:a,golffan:a,noip:a,pointto:a,freeddns:a,srv:[2,{gh:a,gl:a}],platterp:a,servername:a}],uy:[1,{com:e,edu:e,gub:e,mil:e,net:e,org:e}],uz:[1,{co:e,com:e,net:e,org:e}],va:e,vc:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,gv:[2,{d:a}],"0e":o,mydns:a}],ve:[1,{arts:e,bib:e,co:e,com:e,e12:e,edu:e,emprende:e,firm:e,gob:e,gov:e,info:e,int:e,mil:e,net:e,nom:e,org:e,rar:e,rec:e,store:e,tec:e,web:e}],vg:[1,{edu:e}],vi:[1,{co:e,com:e,k12:e,net:e,org:e}],vn:[1,{ac:e,ai:e,biz:e,com:e,edu:e,gov:e,health:e,id:e,info:e,int:e,io:e,name:e,net:e,org:e,pro:e,angiang:e,bacgiang:e,backan:e,baclieu:e,bacninh:e,"baria-vungtau":e,bentre:e,binhdinh:e,binhduong:e,binhphuoc:e,binhthuan:e,camau:e,cantho:e,caobang:e,daklak:e,daknong:e,danang:e,dienbien:e,dongnai:e,dongthap:e,gialai:e,hagiang:e,haiduong:e,haiphong:e,hanam:e,hanoi:e,hatinh:e,haugiang:e,hoabinh:e,hungyen:e,khanhhoa:e,kiengiang:e,kontum:e,laichau:e,lamdong:e,langson:e,laocai:e,longan:e,namdinh:e,nghean:e,ninhbinh:e,ninhthuan:e,phutho:e,phuyen:e,quangbinh:e,quangnam:e,quangngai:e,quangninh:e,quangtri:e,soctrang:e,sonla:e,tayninh:e,thaibinh:e,thainguyen:e,thanhhoa:e,thanhphohochiminh:e,thuathienhue:e,tiengiang:e,travinh:e,tuyenquang:e,vinhlong:e,vinhphuc:e,yenbai:e}],vu:W,wf:[1,{biz:a,sch:a}],ws:[1,{com:e,edu:e,gov:e,net:e,org:e,advisor:o,cloud66:a,dyndns:a,mypets:a}],yt:[1,{org:a}],"xn--mgbaam7a8h":e,\u0627\u0645\u0627\u0631\u0627\u062A:e,"xn--y9a3aq":e,\u0570\u0561\u0575:e,"xn--54b7fta0cc":e,\u09AC\u09BE\u0982\u09B2\u09BE:e,"xn--90ae":e,\u0431\u0433:e,"xn--mgbcpq6gpa1a":e,\u0627\u0644\u0628\u062D\u0631\u064A\u0646:e,"xn--90ais":e,\u0431\u0435\u043B:e,"xn--fiqs8s":e,\u4E2D\u56FD:e,"xn--fiqz9s":e,\u4E2D\u570B:e,"xn--lgbbat1ad8j":e,\u0627\u0644\u062C\u0632\u0627\u0626\u0631:e,"xn--wgbh1c":e,\u0645\u0635\u0631:e,"xn--e1a4c":e,\u0435\u044E:e,"xn--qxa6a":e,\u03B5\u03C5:e,"xn--mgbah1a3hjkrd":e,\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627:e,"xn--node":e,\u10D2\u10D4:e,"xn--qxam":e,\u03B5\u03BB:e,"xn--j6w193g":[1,{"xn--gmqw5a":e,"xn--55qx5d":e,"xn--mxtq1m":e,"xn--wcvs22d":e,"xn--uc0atv":e,"xn--od0alg":e}],\u9999\u6E2F:[1,{\u500B\u4EBA:e,\u516C\u53F8:e,\u653F\u5E9C:e,\u6559\u80B2:e,\u7D44\u7E54:e,\u7DB2\u7D61:e}],"xn--2scrj9c":e,\u0CAD\u0CBE\u0CB0\u0CA4:e,"xn--3hcrj9c":e,\u0B2D\u0B3E\u0B30\u0B24:e,"xn--45br5cyl":e,\u09AD\u09BE\u09F0\u09A4:e,"xn--h2breg3eve":e,\u092D\u093E\u0930\u0924\u092E\u094D:e,"xn--h2brj9c8c":e,\u092D\u093E\u0930\u094B\u0924:e,"xn--mgbgu82a":e,\u0680\u0627\u0631\u062A:e,"xn--rvc1e0am3e":e,\u0D2D\u0D3E\u0D30\u0D24\u0D02:e,"xn--h2brj9c":e,\u092D\u093E\u0930\u0924:e,"xn--mgbbh1a":e,\u0628\u0627\u0631\u062A:e,"xn--mgbbh1a71e":e,\u0628\u06BE\u0627\u0631\u062A:e,"xn--fpcrj9c3d":e,\u0C2D\u0C3E\u0C30\u0C24\u0C4D:e,"xn--gecrj9c":e,\u0AAD\u0ABE\u0AB0\u0AA4:e,"xn--s9brj9c":e,\u0A2D\u0A3E\u0A30\u0A24:e,"xn--45brj9c":e,\u09AD\u09BE\u09B0\u09A4:e,"xn--xkc2dl3a5ee0h":e,\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE:e,"xn--mgba3a4f16a":e,\u0627\u06CC\u0631\u0627\u0646:e,"xn--mgba3a4fra":e,\u0627\u064A\u0631\u0627\u0646:e,"xn--mgbtx2b":e,\u0639\u0631\u0627\u0642:e,"xn--mgbayh7gpa":e,\u0627\u0644\u0627\u0631\u062F\u0646:e,"xn--3e0b707e":e,\uD55C\uAD6D:e,"xn--80ao21a":e,\u049B\u0430\u0437:e,"xn--q7ce6a":e,\u0EA5\u0EB2\u0EA7:e,"xn--fzc2c9e2c":e,\u0DBD\u0D82\u0D9A\u0DCF:e,"xn--xkc2al3hye2a":e,\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8:e,"xn--mgbc0a9azcg":e,\u0627\u0644\u0645\u063A\u0631\u0628:e,"xn--d1alf":e,\u043C\u043A\u0434:e,"xn--l1acc":e,\u043C\u043E\u043D:e,"xn--mix891f":e,\u6FB3\u9580:e,"xn--mix082f":e,\u6FB3\u95E8:e,"xn--mgbx4cd0ab":e,\u0645\u0644\u064A\u0633\u064A\u0627:e,"xn--mgb9awbf":e,\u0639\u0645\u0627\u0646:e,"xn--mgbai9azgqp6j":e,\u067E\u0627\u06A9\u0633\u062A\u0627\u0646:e,"xn--mgbai9a5eva00b":e,\u067E\u0627\u0643\u0633\u062A\u0627\u0646:e,"xn--ygbi2ammx":e,\u0641\u0644\u0633\u0637\u064A\u0646:e,"xn--90a3ac":[1,{"xn--80au":e,"xn--90azh":e,"xn--d1at":e,"xn--c1avg":e,"xn--o1ac":e,"xn--o1ach":e}],\u0441\u0440\u0431:[1,{\u0430\u043A:e,\u043E\u0431\u0440:e,\u043E\u0434:e,\u043E\u0440\u0433:e,\u043F\u0440:e,\u0443\u043F\u0440:e}],"xn--p1ai":e,\u0440\u0444:e,"xn--wgbl6a":e,\u0642\u0637\u0631:e,"xn--mgberp4a5d4ar":e,\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629:e,"xn--mgberp4a5d4a87g":e,\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629:e,"xn--mgbqly7c0a67fbc":e,\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3:e,"xn--mgbqly7cvafr":e,\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647:e,"xn--mgbpl2fh":e,\u0633\u0648\u062F\u0627\u0646:e,"xn--yfro4i67o":e,\u65B0\u52A0\u5761:e,"xn--clchc0ea0b2g2a9gcd":e,\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD:e,"xn--ogbpf8fl":e,\u0633\u0648\u0631\u064A\u0629:e,"xn--mgbtf8fl":e,\u0633\u0648\u0631\u064A\u0627:e,"xn--o3cw4h":[1,{"xn--o3cyx2a":e,"xn--12co0c3b4eva":e,"xn--m3ch0j3a":e,"xn--h3cuzk1di":e,"xn--12c1fe0br":e,"xn--12cfi8ixb8l":e}],\u0E44\u0E17\u0E22:[1,{\u0E17\u0E2B\u0E32\u0E23:e,\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08:e,\u0E40\u0E19\u0E47\u0E15:e,\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25:e,\u0E28\u0E36\u0E01\u0E29\u0E32:e,\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23:e}],"xn--pgbs0dh":e,\u062A\u0648\u0646\u0633:e,"xn--kpry57d":e,\u53F0\u7063:e,"xn--kprw13d":e,\u53F0\u6E7E:e,"xn--nnx388a":e,\u81FA\u7063:e,"xn--j1amh":e,\u0443\u043A\u0440:e,"xn--mgb2ddes":e,\u0627\u0644\u064A\u0645\u0646:e,xxx:e,ye:i,za:[0,{ac:e,agric:e,alt:e,co:e,edu:e,gov:e,grondar:e,law:e,mil:e,net:e,ngo:e,nic:e,nis:e,nom:e,org:e,school:e,tm:e,web:e}],zm:[1,{ac:e,biz:e,co:e,com:e,edu:e,gov:e,info:e,mil:e,net:e,org:e,sch:e}],zw:[1,{ac:e,co:e,gov:e,mil:e,org:e}],aaa:e,aarp:e,abb:e,abbott:e,abbvie:e,abc:e,able:e,abogado:e,abudhabi:e,academy:[1,{official:a}],accenture:e,accountant:e,accountants:e,aco:e,actor:e,ads:e,adult:e,aeg:e,aetna:e,afl:e,africa:e,agakhan:e,agency:e,aig:e,airbus:e,airforce:e,airtel:e,akdn:e,alibaba:e,alipay:e,allfinanz:e,allstate:e,ally:e,alsace:e,alstom:e,amazon:e,americanexpress:e,americanfamily:e,amex:e,amfam:e,amica:e,amsterdam:e,analytics:e,android:e,anquan:e,anz:e,aol:e,apartments:e,app:[1,{adaptable:a,aiven:a,beget:o,brave:n,clerk:a,clerkstage:a,wnext:a,csb:[2,{preview:a}],convex:a,deta:a,ondigitalocean:a,easypanel:a,encr:a,evervault:r,expo:[2,{staging:a}],edgecompute:a,"on-fleek":a,flutterflow:a,e2b:a,framer:a,hosted:o,run:o,web:a,hasura:a,botdash:a,loginline:a,lovable:a,medusajs:a,messerli:a,netfy:a,netlify:a,ngrok:a,"ngrok-free":a,developer:o,noop:a,northflank:o,upsun:o,replit:l,nyat:a,snowflake:[0,{"*":a,privatelink:o}],streamlit:a,storipress:a,telebit:a,typedream:a,vercel:a,bookonline:a,wdh:a,windsurf:a,zeabur:a,zerops:o}],apple:e,aquarelle:e,arab:e,aramco:e,archi:e,army:e,art:e,arte:e,asda:e,associates:e,athleta:e,attorney:e,auction:e,audi:e,audible:e,audio:e,auspost:e,author:e,auto:e,autos:e,aws:[1,{sagemaker:[0,{"ap-northeast-1":m,"ap-northeast-2":m,"ap-south-1":m,"ap-southeast-1":m,"ap-southeast-2":m,"ca-central-1":x,"eu-central-1":m,"eu-west-1":m,"eu-west-2":m,"us-east-1":x,"us-east-2":x,"us-west-2":x,"af-south-1":u,"ap-east-1":u,"ap-northeast-3":u,"ap-south-2":g,"ap-southeast-3":u,"ap-southeast-4":g,"ca-west-1":[0,{notebook:a,"notebook-fips":a}],"eu-central-2":u,"eu-north-1":u,"eu-south-1":u,"eu-south-2":u,"eu-west-3":u,"il-central-1":u,"me-central-1":u,"me-south-1":u,"sa-east-1":u,"us-gov-east-1":I,"us-gov-west-1":I,"us-west-1":[0,{notebook:a,"notebook-fips":a,studio:a}],experiments:o}],repost:[0,{private:o}],on:[0,{"ap-northeast-1":s,"ap-southeast-1":s,"ap-southeast-2":s,"eu-central-1":s,"eu-north-1":s,"eu-west-1":s,"us-east-1":s,"us-east-2":s,"us-west-2":s}]}],axa:e,azure:e,baby:e,baidu:e,banamex:e,band:e,bank:e,bar:e,barcelona:e,barclaycard:e,barclays:e,barefoot:e,bargains:e,baseball:e,basketball:[1,{aus:a,nz:a}],bauhaus:e,bayern:e,bbc:e,bbt:e,bbva:e,bcg:e,bcn:e,beats:e,beauty:e,beer:e,bentley:e,berlin:e,best:e,bestbuy:e,bet:e,bharti:e,bible:e,bid:e,bike:e,bing:e,bingo:e,bio:e,black:e,blackfriday:e,blockbuster:e,blog:e,bloomberg:e,blue:e,bms:e,bmw:e,bnpparibas:e,boats:e,boehringer:e,bofa:e,bom:e,bond:e,boo:e,book:e,booking:e,bosch:e,bostik:e,boston:e,bot:e,boutique:e,box:e,bradesco:e,bridgestone:e,broadway:e,broker:e,brother:e,brussels:e,build:[1,{v0:a,windsurf:a}],builders:[1,{cloudsite:a}],business:v,buy:e,buzz:e,bzh:e,cab:e,cafe:e,cal:e,call:e,calvinklein:e,cam:e,camera:e,camp:[1,{emf:[0,{at:a}]}],canon:e,capetown:e,capital:e,capitalone:e,car:e,caravan:e,cards:e,care:e,career:e,careers:e,cars:e,casa:[1,{nabu:[0,{ui:a}]}],case:e,cash:e,casino:e,catering:e,catholic:e,cba:e,cbn:e,cbre:e,center:e,ceo:e,cern:e,cfa:e,cfd:e,chanel:e,channel:e,charity:e,chase:e,chat:e,cheap:e,chintai:e,christmas:e,chrome:e,church:e,cipriani:e,circle:e,cisco:e,citadel:e,citi:e,citic:e,city:e,claims:e,cleaning:e,click:e,clinic:e,clinique:e,clothing:e,cloud:[1,{convex:a,elementor:a,encoway:[0,{eu:a}],statics:o,ravendb:a,axarnet:[0,{"es-1":a}],diadem:a,jelastic:[0,{vip:a}],jele:a,"jenv-aruba":[0,{aruba:[0,{eur:[0,{it1:a}]}],it1:a}],keliweb:[2,{cs:a}],oxa:[2,{tn:a,uk:a}],primetel:[2,{uk:a}],reclaim:[0,{ca:a,uk:a,us:a}],trendhosting:[0,{ch:a,de:a}],jotelulu:a,kuleuven:a,laravel:a,linkyard:a,magentosite:o,matlab:a,observablehq:a,perspecta:a,vapor:a,"on-rancher":o,scw:[0,{baremetal:[0,{"fr-par-1":a,"fr-par-2":a,"nl-ams-1":a}],"fr-par":[0,{cockpit:a,fnc:[2,{functions:a}],k8s:G,s3:a,"s3-website":a,whm:a}],instances:[0,{priv:a,pub:a}],k8s:a,"nl-ams":[0,{cockpit:a,k8s:G,s3:a,"s3-website":a,whm:a}],"pl-waw":[0,{cockpit:a,k8s:G,s3:a,"s3-website":a}],scalebook:a,smartlabeling:a}],servebolt:a,onstackit:[0,{runs:a}],trafficplex:a,"unison-services":a,urown:a,voorloper:a,zap:a}],club:[1,{cloudns:a,jele:a,barsy:a}],clubmed:e,coach:e,codes:[1,{owo:o}],coffee:e,college:e,cologne:e,commbank:e,community:[1,{nog:a,ravendb:a,myforum:a}],company:e,compare:e,computer:e,comsec:e,condos:e,construction:e,consulting:e,contact:e,contractors:e,cooking:e,cool:[1,{elementor:a,de:a}],corsica:e,country:e,coupon:e,coupons:e,courses:e,cpa:e,credit:e,creditcard:e,creditunion:e,cricket:e,crown:e,crs:e,cruise:e,cruises:e,cuisinella:e,cymru:e,cyou:e,dad:e,dance:e,data:e,date:e,dating:e,datsun:e,day:e,dclk:e,dds:e,deal:e,dealer:e,deals:e,degree:e,delivery:e,dell:e,deloitte:e,delta:e,democrat:e,dental:e,dentist:e,desi:e,design:[1,{graphic:a,bss:a}],dev:[1,{"12chars":a,myaddr:a,panel:a,lcl:o,lclstage:o,stg:o,stgstage:o,pages:a,r2:a,workers:a,deno:a,"deno-staging":a,deta:a,evervault:r,fly:a,githubpreview:a,gateway:o,hrsn:[2,{psl:[0,{sub:a,wc:[0,{"*":a,sub:o}]}]}],botdash:a,inbrowser:o,"is-a-good":a,"is-a":a,iserv:a,runcontainers:a,localcert:[0,{user:o}],loginline:a,barsy:a,mediatech:a,modx:a,ngrok:a,"ngrok-free":a,"is-a-fullstack":a,"is-cool":a,"is-not-a":a,localplayer:a,xmit:a,"platter-app":a,replit:[2,{archer:a,bones:a,canary:a,global:a,hacker:a,id:a,janeway:a,kim:a,kira:a,kirk:a,odo:a,paris:a,picard:a,pike:a,prerelease:a,reed:a,riker:a,sisko:a,spock:a,staging:a,sulu:a,tarpit:a,teams:a,tucker:a,wesley:a,worf:a}],crm:[0,{d:o,w:o,wa:o,wb:o,wc:o,wd:o,we:o,wf:o}],vercel:a,webhare:o}],dhl:e,diamonds:e,diet:e,digital:[1,{cloudapps:[2,{london:a}]}],direct:[1,{libp2p:a}],directory:e,discount:e,discover:e,dish:e,diy:e,dnp:e,docs:e,doctor:e,dog:e,domains:e,dot:e,download:e,drive:e,dtv:e,dubai:e,dunlop:e,dupont:e,durban:e,dvag:e,dvr:e,earth:e,eat:e,eco:e,edeka:e,education:v,email:[1,{crisp:[0,{on:a}],tawk:Ae,tawkto:Ae}],emerck:e,energy:e,engineer:e,engineering:e,enterprises:e,epson:e,equipment:e,ericsson:e,erni:e,esq:e,estate:[1,{compute:o}],eurovision:e,eus:[1,{party:Ie}],events:[1,{koobin:a,co:a}],exchange:e,expert:e,exposed:e,express:e,extraspace:e,fage:e,fail:e,fairwinds:e,faith:e,family:e,fan:e,fans:e,farm:[1,{storj:a}],farmers:e,fashion:e,fast:e,fedex:e,feedback:e,ferrari:e,ferrero:e,fidelity:e,fido:e,film:e,final:e,finance:e,financial:v,fire:e,firestone:e,firmdale:e,fish:e,fishing:e,fit:e,fitness:e,flickr:e,flights:e,flir:e,florist:e,flowers:e,fly:e,foo:e,food:e,football:e,ford:e,forex:e,forsale:e,forum:e,foundation:e,fox:e,free:e,fresenius:e,frl:e,frogans:e,frontier:e,ftr:e,fujitsu:e,fun:e,fund:e,furniture:e,futbol:e,fyi:e,gal:e,gallery:e,gallo:e,gallup:e,game:e,games:[1,{pley:a,sheezy:a}],gap:e,garden:e,gay:[1,{pages:a}],gbiz:e,gdn:[1,{cnpy:a}],gea:e,gent:e,genting:e,george:e,ggee:e,gift:e,gifts:e,gives:e,giving:e,glass:e,gle:e,global:[1,{appwrite:a}],globo:e,gmail:e,gmbh:e,gmo:e,gmx:e,godaddy:e,gold:e,goldpoint:e,golf:e,goo:e,goodyear:e,goog:[1,{cloud:a,translate:a,usercontent:o}],google:e,gop:e,got:e,grainger:e,graphics:e,gratis:e,green:e,gripe:e,grocery:e,group:[1,{discourse:a}],gucci:e,guge:e,guide:e,guitars:e,guru:e,hair:e,hamburg:e,hangout:e,haus:e,hbo:e,hdfc:e,hdfcbank:e,health:[1,{hra:a}],healthcare:e,help:e,helsinki:e,here:e,hermes:e,hiphop:e,hisamitsu:e,hitachi:e,hiv:e,hkt:e,hockey:e,holdings:e,holiday:e,homedepot:e,homegoods:e,homes:e,homesense:e,honda:e,horse:e,hospital:e,host:[1,{cloudaccess:a,freesite:a,easypanel:a,fastvps:a,myfast:a,tempurl:a,wpmudev:a,jele:a,mircloud:a,wp2:a,half:a}],hosting:[1,{opencraft:a}],hot:e,hotels:e,hotmail:e,house:e,how:e,hsbc:e,hughes:e,hyatt:e,hyundai:e,ibm:e,icbc:e,ice:e,icu:e,ieee:e,ifm:e,ikano:e,imamat:e,imdb:e,immo:e,immobilien:e,inc:e,industries:e,infiniti:e,ing:e,ink:e,institute:e,insurance:e,insure:e,international:e,intuit:e,investments:e,ipiranga:e,irish:e,ismaili:e,ist:e,istanbul:e,itau:e,itv:e,jaguar:e,java:e,jcb:e,jeep:e,jetzt:e,jewelry:e,jio:e,jll:e,jmp:e,jnj:e,joburg:e,jot:e,joy:e,jpmorgan:e,jprs:e,juegos:e,juniper:e,kaufen:e,kddi:e,kerryhotels:e,kerryproperties:e,kfh:e,kia:e,kids:e,kim:e,kindle:e,kitchen:e,kiwi:e,koeln:e,komatsu:e,kosher:e,kpmg:e,kpn:e,krd:[1,{co:a,edu:a}],kred:e,kuokgroup:e,kyoto:e,lacaixa:e,lamborghini:e,lamer:e,lancaster:e,land:e,landrover:e,lanxess:e,lasalle:e,lat:e,latino:e,latrobe:e,law:e,lawyer:e,lds:e,lease:e,leclerc:e,lefrak:e,legal:e,lego:e,lexus:e,lgbt:e,lidl:e,life:e,lifeinsurance:e,lifestyle:e,lighting:e,like:e,lilly:e,limited:e,limo:e,lincoln:e,link:[1,{myfritz:a,cyon:a,dweb:o,inbrowser:o,nftstorage:K,mypep:a,storacha:K,w3s:K}],live:[1,{aem:a,hlx:a,ewp:o}],living:e,llc:e,llp:e,loan:e,loans:e,locker:e,locus:e,lol:[1,{omg:a}],london:e,lotte:e,lotto:e,love:e,lpl:e,lplfinancial:e,ltd:e,ltda:e,lundbeck:e,luxe:e,luxury:e,madrid:e,maif:e,maison:e,makeup:e,man:e,management:e,mango:e,map:e,market:e,marketing:e,markets:e,marriott:e,marshalls:e,mattel:e,mba:e,mckinsey:e,med:e,media:H,meet:e,melbourne:e,meme:e,memorial:e,men:e,menu:[1,{barsy:a,barsyonline:a}],merck:e,merckmsd:e,miami:e,microsoft:e,mini:e,mint:e,mit:e,mitsubishi:e,mlb:e,mls:e,mma:e,mobile:e,moda:e,moe:e,moi:e,mom:[1,{ind:a}],monash:e,money:e,monster:e,mormon:e,mortgage:e,moscow:e,moto:e,motorcycles:e,mov:e,movie:e,msd:e,mtn:e,mtr:e,music:e,nab:e,nagoya:e,navy:e,nba:e,nec:e,netbank:e,netflix:e,network:[1,{alces:o,co:a,arvo:a,azimuth:a,tlon:a}],neustar:e,new:e,news:[1,{noticeable:a}],next:e,nextdirect:e,nexus:e,nfl:e,ngo:e,nhk:e,nico:e,nike:e,nikon:e,ninja:e,nissan:e,nissay:e,nokia:e,norton:e,now:e,nowruz:e,nowtv:e,nra:e,nrw:e,ntt:e,nyc:e,obi:e,observer:e,office:e,okinawa:e,olayan:e,olayangroup:e,ollo:e,omega:e,one:[1,{kin:o,service:a}],ong:[1,{obl:a}],onl:e,online:[1,{eero:a,"eero-stage":a,websitebuilder:a,barsy:a}],ooo:e,open:e,oracle:e,orange:[1,{tech:a}],organic:e,origins:e,osaka:e,otsuka:e,ott:e,ovh:[1,{nerdpol:a}],page:[1,{aem:a,hlx:a,hlx3:a,translated:a,codeberg:a,heyflow:a,prvcy:a,rocky:a,pdns:a,plesk:a}],panasonic:e,paris:e,pars:e,partners:e,parts:e,party:e,pay:e,pccw:e,pet:e,pfizer:e,pharmacy:e,phd:e,philips:e,phone:e,photo:e,photography:e,photos:H,physio:e,pics:e,pictet:e,pictures:[1,{1337:a}],pid:e,pin:e,ping:e,pink:e,pioneer:e,pizza:[1,{ngrok:a}],place:v,play:e,playstation:e,plumbing:e,plus:e,pnc:e,pohl:e,poker:e,politie:e,porn:e,pramerica:e,praxi:e,press:e,prime:e,prod:e,productions:e,prof:e,progressive:e,promo:e,properties:e,property:e,protection:e,pru:e,prudential:e,pub:[1,{id:o,kin:o,barsy:a}],pwc:e,qpon:e,quebec:e,quest:e,racing:e,radio:e,read:e,realestate:e,realtor:e,realty:e,recipes:e,red:e,redstone:e,redumbrella:e,rehab:e,reise:e,reisen:e,reit:e,reliance:e,ren:e,rent:e,rentals:e,repair:e,report:e,republican:e,rest:e,restaurant:e,review:e,reviews:e,rexroth:e,rich:e,richardli:e,ricoh:e,ril:e,rio:e,rip:[1,{clan:a}],rocks:[1,{myddns:a,stackit:a,"lima-city":a,webspace:a}],rodeo:e,rogers:e,room:e,rsvp:e,rugby:e,ruhr:e,run:[1,{appwrite:o,development:a,ravendb:a,liara:[2,{iran:a}],servers:a,build:o,code:o,database:o,migration:o,onporter:a,repl:a,stackit:a,val:[0,{express:a,web:a}],wix:a}],rwe:e,ryukyu:e,saarland:e,safe:e,safety:e,sakura:e,sale:e,salon:e,samsclub:e,samsung:e,sandvik:e,sandvikcoromant:e,sanofi:e,sap:e,sarl:e,sas:e,save:e,saxo:e,sbi:e,sbs:e,scb:e,schaeffler:e,schmidt:e,scholarships:e,school:e,schule:e,schwarz:e,science:e,scot:[1,{gov:[2,{service:a}]}],search:e,seat:e,secure:e,security:e,seek:e,select:e,sener:e,services:[1,{loginline:a}],seven:e,sew:e,sex:e,sexy:e,sfr:e,shangrila:e,sharp:e,shell:e,shia:e,shiksha:e,shoes:e,shop:[1,{base:a,hoplix:a,barsy:a,barsyonline:a,shopware:a}],shopping:e,shouji:e,show:e,silk:e,sina:e,singles:e,site:[1,{square:a,canva:fe,cloudera:o,convex:a,cyon:a,fastvps:a,figma:a,heyflow:a,jele:a,jouwweb:a,loginline:a,barsy:a,notion:a,omniwe:a,opensocial:a,madethis:a,platformsh:o,tst:o,byen:a,srht:a,novecore:a,cpanel:a,wpsquared:a}],ski:e,skin:e,sky:e,skype:e,sling:e,smart:e,smile:e,sncf:e,soccer:e,social:e,softbank:e,software:e,sohu:e,solar:e,solutions:e,song:e,sony:e,soy:e,spa:e,space:[1,{myfast:a,heiyu:a,hf:[2,{static:a}],"app-ionos":a,project:a,uber:a,xs4all:a}],sport:e,spot:e,srl:e,stada:e,staples:e,star:e,statebank:e,statefarm:e,stc:e,stcgroup:e,stockholm:e,storage:e,store:[1,{barsy:a,sellfy:a,shopware:a,storebase:a}],stream:e,studio:e,study:e,style:e,sucks:e,supplies:e,supply:e,support:[1,{barsy:a}],surf:e,surgery:e,suzuki:e,swatch:e,swiss:e,sydney:e,systems:[1,{knightpoint:a}],tab:e,taipei:e,talk:e,taobao:e,target:e,tatamotors:e,tatar:e,tattoo:e,tax:e,taxi:e,tci:e,tdk:e,team:[1,{discourse:a,jelastic:a}],tech:[1,{cleverapps:a}],technology:v,temasek:e,tennis:e,teva:e,thd:e,theater:e,theatre:e,tiaa:e,tickets:e,tienda:e,tips:e,tires:e,tirol:e,tjmaxx:e,tjx:e,tkmaxx:e,tmall:e,today:[1,{prequalifyme:a}],tokyo:e,tools:[1,{addr:Te,myaddr:a}],top:[1,{ntdll:a,wadl:o}],toray:e,toshiba:e,total:e,tours:e,town:e,toyota:e,toys:e,trade:e,trading:e,training:e,travel:e,travelers:e,travelersinsurance:e,trust:e,trv:e,tube:e,tui:e,tunes:e,tushu:e,tvs:e,ubank:e,ubs:e,unicom:e,university:e,uno:e,uol:e,ups:e,vacations:e,vana:e,vanguard:e,vegas:e,ventures:e,verisign:e,versicherung:e,vet:e,viajes:e,video:e,vig:e,viking:e,villas:e,vin:e,vip:e,virgin:e,visa:e,vision:e,viva:e,vivo:e,vlaanderen:e,vodka:e,volvo:e,vote:e,voting:e,voto:e,voyage:e,wales:e,walmart:e,walter:e,wang:e,wanggou:e,watch:e,watches:e,weather:e,weatherchannel:e,webcam:e,weber:e,website:H,wed:e,wedding:e,weibo:e,weir:e,whoswho:e,wien:e,wiki:H,williamhill:e,win:e,windows:e,wine:e,winners:e,wme:e,wolterskluwer:e,woodside:e,work:e,works:e,world:e,wow:e,wtc:e,wtf:e,xbox:e,xerox:e,xihuan:e,xin:e,"xn--11b4c3d":e,\u0915\u0949\u092E:e,"xn--1ck2e1b":e,\u30BB\u30FC\u30EB:e,"xn--1qqw23a":e,\u4F5B\u5C71:e,"xn--30rr7y":e,\u6148\u5584:e,"xn--3bst00m":e,\u96C6\u56E2:e,"xn--3ds443g":e,\u5728\u7EBF:e,"xn--3pxu8k":e,\u70B9\u770B:e,"xn--42c2d9a":e,\u0E04\u0E2D\u0E21:e,"xn--45q11c":e,\u516B\u5366:e,"xn--4gbrim":e,\u0645\u0648\u0642\u0639:e,"xn--55qw42g":e,\u516C\u76CA:e,"xn--55qx5d":e,\u516C\u53F8:e,"xn--5su34j936bgsg":e,\u9999\u683C\u91CC\u62C9:e,"xn--5tzm5g":e,\u7F51\u7AD9:e,"xn--6frz82g":e,\u79FB\u52A8:e,"xn--6qq986b3xl":e,\u6211\u7231\u4F60:e,"xn--80adxhks":e,\u043C\u043E\u0441\u043A\u0432\u0430:e,"xn--80aqecdr1a":e,\u043A\u0430\u0442\u043E\u043B\u0438\u043A:e,"xn--80asehdb":e,\u043E\u043D\u043B\u0430\u0439\u043D:e,"xn--80aswg":e,\u0441\u0430\u0439\u0442:e,"xn--8y0a063a":e,\u8054\u901A:e,"xn--9dbq2a":e,\u05E7\u05D5\u05DD:e,"xn--9et52u":e,\u65F6\u5C1A:e,"xn--9krt00a":e,\u5FAE\u535A:e,"xn--b4w605ferd":e,\u6DE1\u9A6C\u9521:e,"xn--bck1b9a5dre4c":e,\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3:e,"xn--c1avg":e,\u043E\u0440\u0433:e,"xn--c2br7g":e,\u0928\u0947\u091F:e,"xn--cck2b3b":e,\u30B9\u30C8\u30A2:e,"xn--cckwcxetd":e,\u30A2\u30DE\u30BE\u30F3:e,"xn--cg4bki":e,\uC0BC\uC131:e,"xn--czr694b":e,\u5546\u6807:e,"xn--czrs0t":e,\u5546\u5E97:e,"xn--czru2d":e,\u5546\u57CE:e,"xn--d1acj3b":e,\u0434\u0435\u0442\u0438:e,"xn--eckvdtc9d":e,\u30DD\u30A4\u30F3\u30C8:e,"xn--efvy88h":e,\u65B0\u95FB:e,"xn--fct429k":e,\u5BB6\u96FB:e,"xn--fhbei":e,\u0643\u0648\u0645:e,"xn--fiq228c5hs":e,\u4E2D\u6587\u7F51:e,"xn--fiq64b":e,\u4E2D\u4FE1:e,"xn--fjq720a":e,\u5A31\u4E50:e,"xn--flw351e":e,\u8C37\u6B4C:e,"xn--fzys8d69uvgm":e,\u96FB\u8A0A\u76C8\u79D1:e,"xn--g2xx48c":e,\u8D2D\u7269:e,"xn--gckr3f0f":e,\u30AF\u30E9\u30A6\u30C9:e,"xn--gk3at1e":e,\u901A\u8CA9:e,"xn--hxt814e":e,\u7F51\u5E97:e,"xn--i1b6b1a6a2e":e,\u0938\u0902\u0917\u0920\u0928:e,"xn--imr513n":e,\u9910\u5385:e,"xn--io0a7i":e,\u7F51\u7EDC:e,"xn--j1aef":e,\u043A\u043E\u043C:e,"xn--jlq480n2rg":e,\u4E9A\u9A6C\u900A:e,"xn--jvr189m":e,\u98DF\u54C1:e,"xn--kcrx77d1x4a":e,\u98DE\u5229\u6D66:e,"xn--kput3i":e,\u624B\u673A:e,"xn--mgba3a3ejt":e,\u0627\u0631\u0627\u0645\u0643\u0648:e,"xn--mgba7c0bbn0a":e,\u0627\u0644\u0639\u0644\u064A\u0627\u0646:e,"xn--mgbab2bd":e,\u0628\u0627\u0632\u0627\u0631:e,"xn--mgbca7dzdo":e,\u0627\u0628\u0648\u0638\u0628\u064A:e,"xn--mgbi4ecexp":e,\u0643\u0627\u062B\u0648\u0644\u064A\u0643:e,"xn--mgbt3dhd":e,\u0647\u0645\u0631\u0627\u0647:e,"xn--mk1bu44c":e,\uB2F7\uCEF4:e,"xn--mxtq1m":e,\u653F\u5E9C:e,"xn--ngbc5azd":e,\u0634\u0628\u0643\u0629:e,"xn--ngbe9e0a":e,\u0628\u064A\u062A\u0643:e,"xn--ngbrx":e,\u0639\u0631\u0628:e,"xn--nqv7f":e,\u673A\u6784:e,"xn--nqv7fs00ema":e,\u7EC4\u7EC7\u673A\u6784:e,"xn--nyqy26a":e,\u5065\u5EB7:e,"xn--otu796d":e,\u62DB\u8058:e,"xn--p1acf":[1,{"xn--90amc":a,"xn--j1aef":a,"xn--j1ael8b":a,"xn--h1ahn":a,"xn--j1adp":a,"xn--c1avg":a,"xn--80aaa0cvac":a,"xn--h1aliz":a,"xn--90a1af":a,"xn--41a":a}],\u0440\u0443\u0441:[1,{\u0431\u0438\u0437:a,\u043A\u043E\u043C:a,\u043A\u0440\u044B\u043C:a,\u043C\u0438\u0440:a,\u043C\u0441\u043A:a,\u043E\u0440\u0433:a,\u0441\u0430\u043C\u0430\u0440\u0430:a,\u0441\u043E\u0447\u0438:a,\u0441\u043F\u0431:a,\u044F:a}],"xn--pssy2u":e,\u5927\u62FF:e,"xn--q9jyb4c":e,\u307F\u3093\u306A:e,"xn--qcka1pmc":e,\u30B0\u30FC\u30B0\u30EB:e,"xn--rhqv96g":e,\u4E16\u754C:e,"xn--rovu88b":e,\u66F8\u7C4D:e,"xn--ses554g":e,\u7F51\u5740:e,"xn--t60b56a":e,\uB2F7\uB137:e,"xn--tckwe":e,\u30B3\u30E0:e,"xn--tiq49xqyj":e,\u5929\u4E3B\u6559:e,"xn--unup4y":e,\u6E38\u620F:e,"xn--vermgensberater-ctb":e,verm\u00F6gensberater:e,"xn--vermgensberatung-pwb":e,verm\u00F6gensberatung:e,"xn--vhquv":e,\u4F01\u4E1A:e,"xn--vuq861b":e,\u4FE1\u606F:e,"xn--w4r85el8fhu5dnra":e,\u5609\u91CC\u5927\u9152\u5E97:e,"xn--w4rs40l":e,\u5609\u91CC:e,"xn--xhq521b":e,\u5E7F\u4E1C:e,"xn--zfr164b":e,\u653F\u52A1:e,xyz:[1,{botdash:a,telebit:o}],yachts:e,yahoo:e,yamaxun:e,yandex:e,yodobashi:e,yoga:e,yokohama:e,you:e,youtube:e,yun:e,zappos:e,zara:e,zero:e,zip:e,zone:[1,{cloud66:a,triton:o,stackit:a,lima:a}],zuerich:e}]})();function He(e,a,t,i){let o=null,n=a;for(;n!==void 0&&((n[0]&i)!==0&&(o={index:t+1,isIcann:n[0]===1,isPrivate:n[0]===2}),t!==-1);){let r=n[1];n=Object.prototype.hasOwnProperty.call(r,e[t])?r[e[t]]:r["*"],t-=1}return o}function le(e,a,t){var i;if(se(e,a,t))return;let o=e.split("."),n=(a.allowPrivateDomains?2:0)|(a.allowIcannDomains?1:0),r=He(o,Me,o.length-1,n);if(r!==null){t.isIcann=r.isIcann,t.isPrivate=r.isPrivate,t.publicSuffix=o.slice(r.index+1).join(".");return}let l=He(o,We,o.length-1,n);if(l!==null){t.isIcann=l.isIcann,t.isPrivate=l.isPrivate,t.publicSuffix=o.slice(l.index).join(".");return}t.isIcann=!1,t.isPrivate=!1,t.publicSuffix=(i=o[o.length-1])!==null&&i!==void 0?i:null}var Le=ne();function $e(e,a={}){return ie(Le),re(e,3,le,a,Le).domain}var la=new Set(["gmail.com","googlemail.com","yahoo.com","ymail.com","hotmail.com","outlook.com","live.com","msn.com","icloud.com","me.com","mac.com","aol.com","proton.me","protonmail.com","gmx.com","gmx.de","mail.com","yandex.com","zoho.com","hey.com","fastmail.com","tutanota.com"]);function A(e){let a=e.includes("@")?e.split("@").pop():e,t=$e(a.trim().toLowerCase());return!t||la.has(t)?null:t}function C(e,a){let t=new Date(e),i=t.getUTCDate(),o=new Date(Date.UTC(t.getUTCFullYear(),t.getUTCMonth()+a,1,t.getUTCHours(),t.getUTCMinutes())),n=new Date(Date.UTC(o.getUTCFullYear(),o.getUTCMonth()+1,0)).getUTCDate();return o.setUTCDate(Math.min(i,n)),o.getTime()}var w=(e,a)=>e+a*864e5;var ua=["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO"],ue={gdpr:{id:"gdpr",name:"EU General Data Protection Regulation (GDPR)",regions:ua,deleteArticle:"Article 17 GDPR (right to erasure)",objectArticle:"Article 21(2) and (3) GDPR (right to object to direct marketing)",deadline:e=>C(e,1),extendedDeadline:e=>C(e,3),deadlineText:"one month (Article 12(3) GDPR), extendable by two further months with notice and reasons",complaintTo:"the data protection authority of the EU/EEA country where you live (Article 77 GDPR)"},uk_gdpr:{id:"uk_gdpr",name:"UK GDPR and Data Protection Act 2018",regions:["GB"],deleteArticle:"Article 17 UK GDPR (right to erasure)",objectArticle:"Article 21(2) and (3) UK GDPR (right to object to direct marketing)",deadline:e=>C(e,1),extendedDeadline:e=>C(e,3),deadlineText:"one month (Article 12(3) UK GDPR), extendable by two further months with notice and reasons",complaintTo:"the Information Commissioner's Office (ico.org.uk)"},ccpa:{id:"ccpa",name:"California Consumer Privacy Act (CCPA), as amended by the CPRA",regions:["US-CA"],deleteArticle:"Cal. Civ. Code \xA7 1798.105 (right to delete)",objectArticle:"Cal. Civ. Code \xA7 1798.120 (right to opt out of sale or sharing)",deadline:e=>w(e,45),extendedDeadline:e=>w(e,90),deadlineText:"45 days, extendable once by 45 more days with notice",complaintTo:"the California Privacy Protection Agency (cppa.ca.gov)"},pipeda:{id:"pipeda",name:"Canada's Personal Information Protection and Electronic Documents Act (PIPEDA)",regions:["CA"],deleteArticle:"PIPEDA Schedule 1, Principles 4.3.8 (withdrawal of consent) and 4.5.3 (destruction of personal information no longer needed)",objectArticle:"PIPEDA Schedule 1, Principle 4.3.8 (withdrawal of consent), for marketing",deadline:e=>w(e,30),extendedDeadline:e=>w(e,60),deadlineText:"30 days, the PIPEDA time limit for individual requests (s. 8(3)), extendable by up to 30 days with written notice (s. 8(4))",complaintTo:"the Office of the Privacy Commissioner of Canada (priv.gc.ca)"},ndpa:{id:"ndpa",name:"the Nigeria Data Protection Act 2023 and the NDPC General Application and Implementation Directive 2025",regions:["NG"],deleteArticle:"section 34 of the Nigeria Data Protection Act 2023 and Article 38 of the GAID 2025 (right to be forgotten)",objectArticle:"section 36 of the Nigeria Data Protection Act 2023 (right to object) and Article 38(1)(d) of the GAID 2025",deadline:e=>w(e,30),extendedDeadline:e=>w(e,30),deadlineText:"30 days (the period in the NDPC's data subject complaint form, GAID 2025)",complaintTo:"the Nigeria Data Protection Commission (ndpc.gov.ng), Article 39 GAID 2025"},policy:{id:"policy",name:"the company's own privacy policy",regions:[],deleteArticle:"your privacy policy's deletion commitment",objectArticle:"your privacy policy's marketing opt-out",deadline:e=>w(e,30),extendedDeadline:e=>w(e,30),deadlineText:"30 days",complaintTo:"your national consumer or data protection authority"}};function Ye(e,a,t){return`https://mail.google.com/mail/?${new URLSearchParams({view:"cm",fs:"1",to:e,su:a,body:t}).toString()}`}var ca=864e5,Y=e=>new Date(e).toISOString().slice(0,10),Fe=[["scheduled",/\b(is|has been) scheduled to be (permanently )?deleted\b|\bwill be (permanently )?deleted (in \d+ days|\d+ days after)\b/i],["no_account",/\b(couldn['’]?t|could not|can['’]?t|cannot|unable to|wasn['’]?t able to|were not able to|weren['’]?t able to) (find|locate|match|identify) (an?|any|your) ([\w ]{0,20})?(account|record)s?\b|\b(unable to|could not|couldn['’]?t) match your email( address)? (with|to) an? [\w ]{0,20}account\b|\bdon['’]?t see an account linked to\b|\bno account (is )?(linked|associated|registered) (to|with)\b/i],["verify_link",/\b(check your email to (complete|confirm|verify)|verify my identity|verification (code|request|link)|one-time code|enter the code|confirm your identity by clicking|email verification request)\b/i],["confirm_sender",/\b(respond directly from (that|this|the) email|from the email address linked to your account|third[- ]party (service|services)|confirmation that this request was (indeed )?made by you)\b/i],["go_ahead",/\bplease confirm that you(['’]d| would) like (your|the) (data|account|information) to be (deleted|erased|removed)\b|\brespond with (either )?["“”\s]*(yes|i agree)\b|\b(written|your) (confirmation|consent) to (proceed|move forward|go ahead)\b|\breply (with )?["“”\s]*(yes|confirm)["“”\s]* to (proceed|confirm)\b/i],["clarify",/\b(confirm what (you would like|you'd like) (deleted|to delete)|what (data|information) (you would like|you'd like) (deleted|removed))\b/i],["provide_info",/\b(could you please provide|please provide (us with )?the following|we (will )?need the following)\b/i],["log_in_delete",/\b(log ?in|sign in) and (submit|fill|complete|request|delete)\b|\bwe(['’]ll| will) need you to delete your [\w ]{0,20}account\b|\b(just )?log ?in to [a-z0-9-]+\.[a-z]{2,}\b and follow\b|\bcan only be completed by you\b|\byou must (initiate|start|request) the deletion yourself\b/i],["use_form",/\bsubmit a request through our [\w ]{0,20}form\b|\b((fill out|complete|submit)( our| the)?( data subject( rights)?| privacy| deletion)?( request)? (form|webform)|privacy form|request form|data subject rights request form)\b/i],["log_in_delete",/(^|\b(please|you (must|need to|can|will need to)|and)\s)(sign (in|into)|log ?in)( to)? (to )?your [\w ]{0,20}account\b|\byou can (also )?delete your [\w ]{0,20}(account|profile)\b|\bsettings page\b|\bself-service\b|\bdelete (your|the) [\w ]{0,20}account (yourself|from)\b|(?<!request to )\bpermanently delete your account\b|\b(easy|simple) steps\b|\bdelete my data\b/i]],lo=Fe.map(([e,a])=>({ask:e,pattern:a.source}));function da(e){return e.replace(/\s*\n+\s*/g,`
`).split(/(?<=[.!?])\s+|\n/).map(a=>a.trim()).filter(a=>a.length>3)}function ce(e){let a=da(e);for(let[i,o]of Fe){let n=a.find(r=>o.test(r));if(n)return{ask:i,quote:n}}let t=a.filter(i=>/[a-z]{3}/i.test(i)&&!/^[#\-—_=*\s]|reply above this line|^(hi|hello|hey)\b[^.]{0,30}[!,.]?$/i.test(i)&&!/<[^>]+@[^>]+>/.test(i));return{ask:"wait",quote:t.find(i=>/receiv|got your|thank|review|in touch|case|ticket/i.test(i))??t[0]??""}}var ma={use_form:/\bform\b|webform|data subject|privacy[- ]?(portal|center|centre|central)|delet|eras/i,log_in_delete:/delet|eras|close[- ]?(your[- ]?)?account|take control/i,verify_link:/verif|identity|confirm/i},Oe=/account|settings|privacy|request/i,Ge=/unsubscribe|preferences|\/comm\/|notification|manage (your )?(email|subscription)|facebook|twitter|\/\/(www\.)?x\.com\/|linkedin|instagram|youtube|apps\.apple|play\.google|mailto:|maps\/search|subscription|licens/i;function ha(e,a,t=""){let i=ma[e];if(!i)return null;let o=a.filter(s=>!Ge.test(s.url)&&!Ge.test(s.text)),n=t.replace(/\s+/g,"").toLowerCase(),r=s=>{let u=s.url.replace(/^https?:\/\//,"").replace(/\/$/,"").toLowerCase();return u.length>6&&n.includes(u)?5:0},l=s=>r(s)+(i.test(s.text)?4:0)+(i.test(s.url)?3:0)+(Oe.test(s.text)?1:0)+(Oe.test(s.url)?1:0),d=[...o].sort((s,u)=>l(u)-l(s))[0];return d&&l(d)>=3?d:null}function pa(e,a){switch(e){case"gdpr":return a==="id"?["The EDPB's Guidelines 01/2022 (para. 73) say it is disproportionate to ask for a copy of an identity document when the account holder is already authenticated; you can confirm it is me through this email address."]:["Article 12(2) GDPR requires you to facilitate the exercise of my rights, and the EDPB's Guidelines 01/2022 confirm a request may be sent to a controller's official contact point instead of its preferred channel. I sent it to your privacy address."];case"uk_gdpr":return a==="id"?[]:["Article 12(2) UK GDPR requires you to facilitate the exercise of my rights. I sent this request to your privacy address."];case"ndpa":return["Section 34(1) of the Nigeria Data Protection Act 2023 gives me the right to obtain erasure from you without constraint or unreasonable delay, and section 35(2) requires withdrawing consent to be as easy as giving it."];default:return[]}}function D(e,a,t,i,o){let n=/^re\s*:/i.test(i.trim())?i.trim():`Re: ${i.trim()}`,r=n.includes(e.ref)?n:`${n} [${e.ref}]`,l=["Hello,","",...o,"",`Reference: ${e.ref}`,"","Kind regards,",a||e.accountEmail].join(`
`);return{type:"email",label:"Write the reply",to:t,subject:r,body:l,url:Ye(t,r,l)}}function Ue(e,a,t){let i=e.match(t);return i?a+Number(i[1])*ca:void 0}function Ve(e,a,t){let i=ue[e.law],o=a.from.includes("noreply")||a.from.includes("no-reply")?e.to??a.from:a.from,n=ha(a.ask,a.links.filter(s=>ga(e,s.url,a.from)),a.quote??ce(a.text).quote),r=e.company,l=s=>pa(e.law,s),d=`Please go ahead and erase my ${r} account and all personal data you hold about me.`;switch(a.ask){case"confirm_sender":{let s=[`This request comes from ${e.accountEmail}, the email address on my ${r} account, and I sent it myself from this address. It was not sent by a third-party service.`,d,...l("sender")];return{ask:"confirm_sender",headline:`${r} wants to know the request really comes from you`,why:`It does: it was sent from ${e.accountEmail}. One short reply from this address answers it.`,legal:l("sender"),action:D(e,t,o,a.subject,s),alt:n?{type:"open",label:"Or delete it in your account",url:n.url}:void 0}}case"log_in_delete":return{ask:"log_in_delete",headline:`${r} asks you to sign in and delete the account yourself`,why:"This is a fair ask: signing in is how they check it is you. It is also the quickest way to get it done.",legal:[],action:n?{type:"open",label:"Open their deletion page",url:n.url}:{type:"wait",label:"Sign in to your account and look for Delete account in the settings"}};case"use_form":{let s=["You asked me to use your form. I made this request to your privacy address, which is a valid way to make it.",d,...l("channel"),`If you need to check it is me, please send a confirmation link to ${e.accountEmail}.`],u=D(e,t,o,a.subject,s);return{ask:"use_form",headline:`${r} wants its own form filled in`,why:"The form is usually the quickest. You do not have to use it: your email to their privacy address counts, and the reply below says so.",legal:l("channel"),action:n?{type:"open",label:"Open their form",url:n.url}:u,alt:n?u:void 0}}case"verify_link":{let s=Ue(a.text,a.at,/within (\d+) days/i)??(/expire in \d+ minutes/i.test(a.text)?a.at+6e5:void 0),u=s!==void 0&&s<Date.now();return{ask:"verify_link",headline:u?`${r}'s check-it's-you code has expired`:`${r} sent a link or code to check it is you`,why:u?"Ask for a new code on their privacy page, then use it straight away.":"This is a fair check, done through your own email. Click it before it runs out, or the request closes.",legal:[],action:n?{type:"open",label:u?"Open their privacy page":"Verify now",url:n.url}:{type:"wait",label:"Open the email and use the code or link in it"},by:s,byMeaning:s?"expires":void 0}}case"go_ahead":return{ask:"go_ahead",headline:`${r} is ready to delete and wants a written yes`,why:"Reply YES and they go ahead. Their warning that it is permanent is what you asked for.",legal:[],action:D(e,t,o,a.subject,["YES. I AGREE.",`I understand the deletion is permanent and cannot be undone, and I give you my consent to go ahead and delete my ${r} account and all data linked to it.`])};case"clarify":return{ask:"clarify",headline:`${r} asks what you want deleted`,why:"Answer: everything. One reply settles it.",legal:[],action:D(e,t,o,a.subject,[`I would like you to delete my whole ${r} account and all personal data you hold about me, including any copies, backups and marketing lists.`,`The account is registered to ${e.accountEmail}.`])};case"provide_info":return{ask:"provide_info",headline:`${r} asks for more details`,why:"Give only what links you to the account: your name and the account email. Nothing more is needed to find it.",legal:l("id"),action:D(e,t,o,a.subject,[`The account is registered to ${e.accountEmail}${t?`, in the name ${t}`:""}, and this reply comes from that address.`,d,...l("id")])};case"scheduled":{let s=Ue(a.text,a.at,/deleted (?:in )?(\d+) days\b/i);return{ask:"scheduled",headline:`${r} will delete the account${s?` on ${Y(s)}`:""}`,why:"Do not sign in before then: signing in cancels the deletion.",legal:[],action:{type:"wait",label:s?`Nothing to do. Stay signed out until ${Y(s)}.`:"Nothing to do. Stay signed out."},by:s,byMeaning:s?"do_not_sign_in_before":void 0}}case"no_account":return{ask:"no_account",headline:`${r} found no account under ${e.accountEmail}`,why:"Then there is nothing of yours to delete under this address. If you signed up with a different email, send the request again from that one.",legal:[],action:{type:"wait",label:"Nothing more to do"}};default:{let s=i.deadline(e.events.find(u=>u.type==="sent")?.at??e.createdAt);return{ask:"wait",headline:`${r} has your request`,why:`Nothing to do yet. They have until ${Y(s)} under ${i.name}.`,legal:[],action:{type:"wait",label:`Wait until ${Y(s)}`}}}}}var ya=new Set(["onetrust.com","ketch.com","privacyportal.co","ethyca.com","transcend.io","datagrail.io","securiti.ai","trustarc.com","osano.com","mineos.ai"]),Ne=new Set(["zendesk.com","atlassian.net","freshdesk.com","helpscout.net","zohodesk.com"]);function ga(e,a,t){let i="";try{i=new URL(a).hostname}catch{return!1}let o=A(i);if(!o)return!1;let n=t?A(t):null;if([e.domain,e.to?A(e.to):null,n&&!Ne.has(n)?n:null].filter(Boolean).includes(o)||ya.has(o))return!0;let l=e.domain.split(".")[0];return Ne.has(o)&&i.split(".")[0].includes(l)}var Be=[{id:1,company:"Substack",from:"privacy@substackinc.com",subject:"[Request Received]",receivedAt:"2026-11-20T17:11:00.000Z",text:`##- Please type your reply above this line -##

Hi there,
Thank you for reaching out to Substack Standards & Enforcement. This is an automated reply to let you know the team monitoring this mailbox is equipped to answer questions related to Substack's Privacy Policy.
If your inquiry is not related to Privacy, your issue may be closed without a response.
For any general or account related questions, we recommend visiting our Help Center .
To contact our Support team, please visit here .
Thank you,
Substack

[60LDP3-027P2]`,label:"wait"},{id:2,company:"Substack",from:"privacy@substackinc.com",subject:"Request to delete my personal data [ER-GGJBD]",receivedAt:"2026-11-22T00:42:00.000Z",text:`##- Please type your reply above this line -##

Hi there,

[agent] from Substack Standards & Enforcement here. Thanks for writing in!

Before I make any permanent changes, please confirm that you'd like your data to be deleted per GDPR and I'll be more than happy to complete your request.

Thanks for your patience!

[agent] @ Substack

[60LDP3-027P2]`,label:"go_ahead"},{id:3,company:"Medium",from:"privacy@medium.zendesk.com",subject:"Our subject access request process is self-service",receivedAt:"2026-11-20T17:11:00.000Z",text:`Hello,
Thanks for writing in.
Our subject access request and account deletion process is self-service. For security and verification reasons, we are unable to process requests made by third-party services.
To access your personal data
All you need to do is sign into your account, which you can do using your email address or linked social media account if you have one. Then follow these instructions to download your personal data from the settings page.
To delete your personal data
Deletion can be performed by the user from the Settings page, following these instructions.
To delete your account yourself, you can use your email address to sign in to Medium and delete the Medium account following the steps below.
On the web, go to your Settings page and click Delete account at the bottom of the page.
In the app, go to the You (\u{1F464}) tab and tap Settings > Account > Delete account.
Please be aware that this deletion is permanent , and any stories, drafts, notes, recommends, and publication relationships you have on the account will be gone forever.
Should you wish to have Medium delete the account on your behalf, for verification reasons we require the request to be made directly by the user, from the email address on file. To protect the security of your account, we will not accept deletion requests made by parties other than the account holder directly.
For reference, our Privacy Policy, including a EU data protection statement, is accessible here:
Medium Privacy Policy
Our Help Center also has some supplemental information at the link below:
Data Protection FAQ for European Users
Thanks,
The Medium Support Team

Sent by Medium
\xB7
3500 South DuPont Highway , Suite IQ-101, Dover, DE 19901

Help center
\xB7
Privacy policy

[MWPKX7-2YYD1]`,label:"confirm_sender"},{id:4,company:"Medium",from:"privacy@medium.zendesk.com",subject:"Re: Request to delete my personal data [ER-97G4D] (1760918)",receivedAt:"2026-11-23T23:08:00.000Z",text:`Hello,

Thanks for writing in.

More information about Medium's compliance with GDPR and CCPA is available in this article .

Medium does not sell your information , regardless of your residency. We use the information we collect to provide, maintain, and improve our Services, which includes publishing and distributing user-generated content, personalizing the posts you see, and operating our metered paywall.

To delete your account yourself, you can use your email address to sign in to Medium and delete the Medium account following the steps below.
On the web, go to your Settings page and click Delete account at the bottom of the page.
In the app, tap on your profile image on the bottom right corner and then access Settings from the icon on the top right corner. From there, go to Account > Delete account .

Please be aware that this deletion is permanent , and any stories, drafts, notes, claps, and publication relationships you have on the account will be gone forever.

If you wish to export your content first, you can do so on your settings page:
medium.com/me/settings

If you are unable to complete this action yourself, please respond to this email.

Thanks,
[agent]
User Services

Sent by Medium
\xB7
3500 South DuPont Highway , Suite IQ-101, Dover, DE 19901

Help center
\xB7
Privacy policy

[MWPKX7-2YYD1]`,label:"log_in_delete"},{id:5,company:"Atlassian (Trello)",from:"advocates@atlassiansupport.atlassian.net",subject:"CA-4339435 Request to delete my personal data [ER-WETHF]",receivedAt:"2026-11-20T17:12:00.000Z",text:`\u2014-\u2014-\u2014-\u2014

Thanks for reaching out, we've received your request!

If you have additional edits or information regarding this request, please update this ticket for more streamlined service.

Our contact centers are currently experiencing a high volume of calls and tickets. This may result in longer response times, but we're committed to prioritizing critical requests and resolving your question as soon as possible.

In the meantime, we invite you to have a look at our FAQs page:

Customers FAQs Page

Partner Sales Support Resources

Automation for Jira commented:

We\u2019re currently experiencing higher-than-usual volume, so our replies may be slower than usual.

If you have already filed a ticket, please avoid filing another for the same request, as we will attend to requests in the order they were received. Thank you for your patience.

Currently the status is: 'Atlassian Received'

View request \xB7 Turn off this request's notifications

This is shared with erased.demo.inbox@gmail.com .

Help Center, powered by Jira Service Desk , sent you this message.

Sent on November 20, 2026 5:12:57 PM UTC`,label:"wait"},{id:6,company:"Loom",from:"advocates@atlassiansupport.atlassian.net",subject:"CA-4339437 Request to delete my personal data [ER-G9GRH]",receivedAt:"2026-11-20T17:12:00.000Z",text:`\u2014-\u2014-\u2014-\u2014

Thanks for reaching out, we've received your request!

If you have additional edits or information regarding this request, please update this ticket for more streamlined service.

Our contact centers are currently experiencing a high volume of calls and tickets. This may result in longer response times, but we're committed to prioritizing critical requests and resolving your question as soon as possible.

In the meantime, we invite you to have a look at our FAQs page:

Customers FAQs Page

Partner Sales Support Resources

Automation for Jira commented:

We\u2019re currently experiencing higher-than-usual volume, so our replies may be slower than usual.

If you have already filed a ticket, please avoid filing another for the same request, as we will attend to requests in the order they were received. Thank you for your patience.

Currently the status is: 'Atlassian Received'

View request \xB7 Turn off this request's notifications

This is shared with erased.demo.inbox@gmail.com .

Help Center, powered by Jira Service Desk , sent you this message.

Sent on November 20, 2026 5:12:57 PM UTC`,label:"wait"},{id:7,company:"Loom",from:"advocates@atlassiansupport.atlassian.net",subject:"CA-4339437 Request to delete my personal data [ER-G9GRH]",receivedAt:"2026-11-20T18:00:00.000Z",text:`\u2014-\u2014-\u2014-\u2014

[agent] commented:

Hi there!

Thank you for bringing this to our attention! My name is [agent], and I\u2019m from the Atlassian Commercial Operations Team. We truly appreciate your patience as we carefully review each inquiry.

I acknowledge that you want to cancel your subscription and possibly delete your account and any associated data. No worries; I'm here to help ensure the cancellation and deletion proceed smoothly.

If you wish to proceed with deleting your Atlassian account, it involves 4 easy steps to ensure that all your data is securely and completely removed from our systems:

Step 1 : Deactivate your subscriptions and cloud site/org products/apps . This also triggers the deactivation of your cloud site.

Step 2 : Trigger the deletion of product data . This also initiates the deletion of your cloud site.

Step 3 : Delete your organization . This needs to be done via self-serve and will take 30 days to complete once triggered.

Step 4 : Delete your Atlassian account . This also needs to be done via self-serve and will take 14 days to complete once triggered.

Important : Once the deletion process is complete, please note the following:

Users will no longer be able to log in to the site

Data will be immediately and permanently deleted

If deletion is processed, the URL can only be reclaimed after 30 days. Therefore, the site URL will become available for anyone to use

Org-level apps (Rovo, Goals, Index Objects, etc.) will be deleted within 14 days. Once all products are removed, the empty organization can then be deleted.

This action cannot be undone.

Deleting your apps and site will permanently remove all associated data, and this action is irreversible. We strongly recommend that you [+Track storage and move data across apps | Atlassian Support+| https://support. atlassian.com/security-and- access-policies/docs/track- storage-and-move-data-across- products/ ] before we proceed.

To proceed with the cancellation and deletion, we'll need your written confirmation . Please respond with either " YES " or " I AGREE " to acknowledge that you understand the implications of this action and give us your consent to move forward.

I'm looking forward to hearing back from you.

Kind regards,

[agent]

Atlassian Commercial Operations | AMER

Learn about Rovo and Teamwork Collection

More questions? Click here to visit our Licensing FAQ!

Currently the status is: 'We're working on it!'

View request \xB7 Turn off this request's notifications

This is shared with erased.demo.inbox@gmail.com .

Help Center, powered by Jira Service Desk , sent you this message.

Sent on November 20, 2026 6:00:01 PM UTC`,label:"go_ahead"},{id:8,company:"Loom",from:"advocates@atlassiansupport.atlassian.net",subject:"CA-4339437 Request to delete my personal data [ER-G9GRH]",receivedAt:"2026-11-23T08:57:00.000Z",text:`\u2014-\u2014-\u2014-\u2014

[agent] commented:

Hi Erased Demo,

Thank you for confirming! We have now triggered the deactivation and product data deletion for all your site and org products and apps. Please note that product data deletion takes 24 hours to complete.

Once that's done, the following steps can only be completed by you directly for security purposes. When you're ready, please proceed with the next steps at your own pace:

Trigger your organization\u2019s deletion by following the steps here . Please note that org deletion takes 30 days to complete once initiated. After 30 days, you can go ahead and proceed with,

Delete your Atlassian account by following the steps here ; the process takes 14 days to complete once initiated.

Once all steps are complete, your data will be securely and permanently deleted from our systems.

If you have any questions along the way, don't hesitate to reach out. We're always here to help!

Kind regards,

[agent]

Atlassian Commercial Operations | AMER

Learn about Rovo and Teamwork Collection

More questions? Click here to visit our Licensing FAQ!

Currently the status is: 'We're working on it!'

View request \xB7 Turn off this request's notifications

This is shared with erased.demo.inbox@gmail.com .

Help Center, powered by Jira Service Desk , sent you this message.

Sent on November 23, 2026 8:57:13 AM UTC`,label:"log_in_delete"},{id:9,company:"Figma",from:"privacy+noreply@figma.com",subject:"Request to delete my personal data [ER-ZJVYZ]",receivedAt:"2026-11-20T17:12:00.000Z",text:`Hello,

Thank you for reaching out to Figma\u2019s Privacy team. Your privacy and data protection are of the utmost importance to us. We have received your email and would like to provide you with the following information which should help to address your inquiries:

1. Please contact our support team at support@figma.com if:

- Your matter is urgent or requires immediate attention

- Your matter relates to a billing or contractual matter with Figma since we at privacy@figma.com are unable to help you with these matters.

2. Data Subject Requests

If you are making a request as a data subject, we will respond within 30 days of your inquiry, unless an exception applies or we confirm otherwise.

For all data deletion requests made by or on behalf of the data subject, deleting the data subject\u2019s Figma account is how one can initiate the erasure request. You can delete your Figma account (and thus your personal data processed by Figma) by following the instructions here: How to Delete Your Figma Account ( https://help.figma.com/hc/en- us/articles/360039826814- Delete-your-Figma-account ).

3. Sub-processors and Supplemental Measures

Our Sub-processor list, available at: https://www.figma.com/sub- processors/ , outlines (amongst other details) the adequacy mechanism supporting the transfer for a given Sub-processor.

Should you wish to review our Supplemental Measures, please see Exhibit C in the Figma DPA.

4. Additional Information can be found in the following resources:

- Figma\u2019s Privacy Policy ( https://www.figma.com/ privacy/ )

- Figma's Data Processing Addendum ( https://www.figma.com/dpa/ )

If the above does not fully address your inquiry, please let us know in a follow-up email in the same thread to privacy@figma.com . We appreciate your patience and will respond to you as soon as possible.

Sincerely,

Figma Privacy Team`,label:"log_in_delete"},{id:10,company:"Airtable",from:"privacy+ad7a0fd8-6be9-4c7b-addf-8850e3f73c12@privacy.airtable.com",subject:"Confirmation of Your Data Deletion Request",receivedAt:"2026-11-20T17:13:00.000Z",text:`Hi!
Thank you for contacting Airtable regarding your data deletion request. We have received your request and are working to process it. We will provide you with an update shortly on next steps.
Our Identity Verification Process:
We will need to verify your identity before processing your deletion request. In order to verify your identity, we will generally require either the successful login to your account (if applicable) and/or the matching of sufficient information you provide us to the information we maintain about you in our systems. Although we try to limit the personal information collected in connection with a request to delete, certain requests may require us to obtain additional personal information from you. In certain circumstances, we may decline a request to exercise the right to delete, particularly where we are unable to verify your identity or locate your information in our systems, or as permitted by law.
Please note that future communications with regard to this request from us may be filtered by your email provider; we recommend checking your spam or junk folder periodically.
If you have any questions, feel free to reach out to privacy@airtable.com .
Thank you,
The Airtable Privacy Team

-`,label:"wait"},{id:11,company:"Airtable",from:"privacy@airtable.com",subject:"Request to delete my personal data [ER-DDZD4]",receivedAt:"2026-11-20T17:15:00.000Z",text:`Hi,

Thank you for contacting us. We have received you request to delete personal data we hold about you and are working to process it. Additionally, we have processed your request to unsubscribe. You will no longer receive promotional communications from us. Please note it may take up to 48 hours to take effect.

(if applicable) As long as you have an Airtable account, you may still receive product related emails pertaining to your account as well as legally required emails (e.g., updates to privacy policy or terms).

If you have any further questions or need additional assistance, please feel free to reach out.

Thanks,

The Airtable Privacy Team`,label:"wait"},{id:12,company:"Airtable",from:"privacy+e206f41e-1bb4-4695-965c-529f1eaf6612@privacy.airtable.com",subject:"Your Data Deletion Request - Completed",receivedAt:"2026-11-24T17:43:00.000Z",text:`Hi!
Thank you for reaching out to Airtable regarding the deletion of your personal data.
What We've Done: We've confirmed that your personal data associated with the email address you used to contact us has been deleted from our Sales and Marketing systems.
Remaining Actions (If Applicable):
For other relationships with Airtable (e.g., Employee, Job Candidate, Customer Employee, Contractor): To process any further aspects of your request, please complete our Data Subject Request Form: https://privacy.airtable.com/ . This form helps us understand your specific connection to Airtable and what additional data may need to be addressed.

For Deleting Your Airtable Account: If you have an active Airtable account, you must initiate the deletion yourself by:
Logging into your Airtable account

Following these Account Deletion Instructions
This self-service process is a required security measure to verify your identity.

On a mobile web browser, you may need to request the "desktop site version."
iOS Users: Link to Instructions for Desktop Site on iPhone

Android Users: Link to Instructions for Desktop Site on Android

Important - Next Steps: We have completed all actions we can perform automatically (deletion of your data from Sales and Marketing systems). Any additional requests require action on your part:
If you need other data deleted: Complete the Data Subject Request Form to specify what additional information should be removed

If you have an Airtable account to delete: Follow the self-service account deletion process above

If you have no other requests: No further action is needed from either party

Request Closure: Unless you complete the Data Subject Request Form or respond with additional details within the next 5 business days, we will consider this matter closed as we have fulfilled the deletion of your data from our Sales and Marketing systems.
You can always reopen this request by reaching out to privacy@airtable.com or submitting the Data Subject Request Form.
Thank you,
The Airtable Privacy Team

-`,label:"log_in_delete"},{id:13,company:"Zapier",from:"privacy@zapier.com",subject:"Request to delete my personal data [ER-JJZSE]",receivedAt:"2026-11-20T17:13:00.000Z",text:`Hi there!
This is our helpful Zapbot confirming we've received your support request.
Here are a few things we'll need from you to help our humans help you faster! If you haven't already included any of these, please reply back to this message with the following:

A link to the Zap you're working on

1 (or more!) screenshots that show us what you're seeing

A link to a single Task from your Task History if applicable (click and send us the URL to an individual entry)

Our current response time is around 24 hours, though we will get back to you faster when possible!
In the meantime, you might also want to check out the resources on our Zapier Help Center to see if we already have what you're looking for.
Have a great day,
- Your friendly neighborhood Zapbot!

[GP42XX-7VNV9]`,label:"wait"},{id:14,company:"Zapier",from:"privacy@zapier.com",subject:"Request to delete my personal data [ER-JJZSE]",receivedAt:"2026-11-20T17:15:00.000Z",text:`Hi there,

Thanks for reaching out! My name\u2019s [agent] and I\u2019m a Technical Support Specialist here at Zapier. I hope you're having a great day so far\u2014happy to lend a hand here.

In order to protect your account and personal data, this type of request must be submitted from within your Zapier account (and not a third-party service) so that we can verify your identity.

Please log into your Zapier account and resubmit this request at https://zapier.com/app/get- help .

Best,
--
[agent] - Zapier Support
P.S. Have you heard about Next Gen Zaps? Describe what you want in plain language inside AI tools like Claude, Cursor or ChatGPT and deploy it directly to Zapier. Learn more at zapier.com/workflow/early- access

[GP42XX-7VNV9]`,label:"confirm_sender"},{id:15,company:"Zapier",from:"privacy@zapier.com",subject:"Request to delete my personal data [ER-JJZSE]",receivedAt:"2026-11-21T18:02:00.000Z",text:`Hi erased,
This is an automated follow-up to make sure you had a chance to review the information sent over by our Technical Support Specialist. Here is the most recent response from a Technical Support Specialist on the ticket:

[agent] (Global Support)
20 Nov 2026, 17:15 UTC
Hi there,

Thanks for reaching out! My name\u2019s [agent] and I\u2019m a Technical Support Specialist here at Zapier. I hope you're having a great day so far\u2014happy to lend a hand here.

In order to protect your account and personal data, this type of request must be submitted from within your Zapier account (and not a third-party service) so that we can verify your identity.

Please log into your Zapier account and resubmit this request at https://zapier.com/app/get- help .

Best,
--
[agent] - Zapier Support
P.S. Have you heard about Next Gen Zaps? Describe what you want in plain language inside AI tools like Claude, Cursor or ChatGPT and deploy it directly to Zapier. Learn more at zapier.com/workflow/early- access

If you have additional questions, reply to this email, and we'll get back to you.
If we don't hear from you within a few days, we'll close this ticket.
Thanks,
Zapier Support

[GP42XX-7VNV9]`,label:"confirm_sender"},{id:16,company:"Zapier",from:"privacy@zapier.com",subject:"Request to delete my personal data [ER-JJZSE]",receivedAt:"2026-11-22T18:01:00.000Z",text:`Hi erased demo,
We contacted you a few days ago to see if you had a chance to review the latest updates on your support case. Here is the most recent response from a Technical Support Specialist on the ticket:

[agent] (Global Support)
20 Nov 2026, 17:15 UTC
Hi there,

Thanks for reaching out! My name\u2019s [agent] and I\u2019m a Technical Support Specialist here at Zapier. I hope you're having a great day so far\u2014happy to lend a hand here.

In order to protect your account and personal data, this type of request must be submitted from within your Zapier account (and not a third-party service) so that we can verify your identity.

Please log into your Zapier account and resubmit this request at https://zapier.com/app/get- help .

Best,
--
[agent] - Zapier Support
P.S. Have you heard about Next Gen Zaps? Describe what you want in plain language inside AI tools like Claude, Cursor or ChatGPT and deploy it directly to Zapier. Learn more at zapier.com/workflow/early- access

We haven't heard a response from you, so we're going to close this ticket. If you have any other questions about the issue we discussed in this ticket, reply to this email and your ticket will re-open automatically.
Thanks,
Zapier Support

[GP42XX-7VNV9]`,label:"confirm_sender"},{id:17,company:"Zapier",from:"privacy@zapier.com",subject:"Request to delete my personal data [ER-JJZSE]",receivedAt:"2026-11-23T02:42:00.000Z",text:`Hi there,

[agent] here with Zapier Support \u2014 stepping in for [agent] while he's offline. I hope that's okay.

Thanks for sending us a verified request for deletion of your data. There are two steps to the process, one for you and one for us:

FOR YOU : We\u2019ll need you to delete your Zapier account. For security reasons, we can\u2019t do this for you. It doesn't take long, though: just login to zapier.com and follow the instructions at: https://zapier.com/app/ settings/advanced/delete .
Once you\u2019ve completed this process, your account and any Zap Workflows or developer integrations built on it will be deleted. This action is irreversible.
Please note that until you delete your Zapier account, personal data of yours will remain on our systems.

FOR US : We'll review our internal records and delete personal data of yours consistent with our obligations.
This process may take us up to one month and we\u2019ll write you back once it has been completed.
Deletion of your personal data includes removal from Zapier marketing subscriptions and other related communications that you may be currently receiving. If you choose to reengage with Zapier in the future, then we will once again have personal data about you in our records.

We\u2019re sad to see you go but grateful that you\u2019ve given Zapier a try! If there\u2019s anything we can do to help with this situation, please let us know.

Kind regards,
--
[agent] - Zapier Support
P.S. Have you heard about Next Gen Zaps? Describe what you want in plain language inside AI tools like Claude, Cursor or ChatGPT and deploy it directly to Zapier. Learn more at zapier.com/workflow/early- access

[GP42XX-7VNV9]`,label:"log_in_delete"},{id:18,company:"Zapier",from:"privacy@zapier.com",subject:"Request to delete my personal data [ER-JJZSE]",receivedAt:"2026-11-24T03:01:00.000Z",text:`Hi erased,
This is an automated follow-up to make sure you had a chance to review the information sent over by our Technical Support Specialist. Here is the most recent response from a Technical Support Specialist on the ticket:

[agent] (Global Support)
23 Nov 2026, 02:42 UTC
Hi there,

[agent] here with Zapier Support \u2014 stepping in for [agent] while he's offline. I hope that's okay.

Thanks for sending us a verified request for deletion of your data. There are two steps to the process, one for you and one for us:

FOR YOU : We\u2019ll need you to delete your Zapier account. For security reasons, we can\u2019t do this for you. It doesn't take long, though: just login to zapier.com and follow the instructions at: https://zapier.com/app/ settings/advanced/delete .
Once you\u2019ve completed this process, your account and any Zap Workflows or developer integrations built on it will be deleted. This action is irreversible.
Please note that until you delete your Zapier account, personal data of yours will remain on our systems.

FOR US : We'll review our internal records and delete personal data of yours consistent with our obligations.
This process may take us up to one month and we\u2019ll write you back once it has been completed.
Deletion of your personal data includes removal from Zapier marketing subscriptions and other related communications that you may be currently receiving. If you choose to reengage with Zapier in the future, then we will once again have personal data about you in our records.

We\u2019re sad to see you go but grateful that you\u2019ve given Zapier a try! If there\u2019s anything we can do to help with this situation, please let us know.

Kind regards,
--
[agent] - Zapier Support
P.S. Have you heard about Next Gen Zaps? Describe what you want in plain language inside AI tools like Claude, Cursor or ChatGPT and deploy it directly to Zapier. Learn more at zapier.com/workflow/early- access

If you have additional questions, reply to this email, and we'll get back to you.
If we don't hear from you within a few days, we'll close this ticket.
Thanks,
Zapier Support

[GP42XX-7VNV9]`,label:"log_in_delete"},{id:19,company:"Spotify",from:"support@spotify.com",subject:"Spotify Support [ thread::jp62FnxYeDSKOK7HXMatpx4:: ]",receivedAt:"2026-11-20T17:36:00.000Z",text:`Hello,

Thanks for your message. We understand you want ti erase your account's information.

We don't see an account linked to the email address you are contacting us from.

To check, send us a message from the email address linked to your account and we'll help you to erase your information.

[agent],

Spotify Customer Support

Did you know we have an extensive help section on our website ?

Our support team will never ask for your password, full credit or debit card details, or CVV. In some cases, we may require certain payment information to help with your request.

This e-mail (including any attachments) may contain information that is confidential and/or privileged. It is intended only for the recipient(s). If you have reason to believe that you are not the intended recipient of this e-mail, please contact the sender immediately and delete the e-mail from your device.`,label:"no_account"},{id:20,company:"Spotify",from:"support@spotify.com",subject:"Spotify Support",receivedAt:"2026-11-22T17:36:00.000Z",text:`Hi there,

Thanks for recently contacting Spotify customer service! We would love to hear your feedback about how we did in helping you with your question or issue. Please click here to take a few moments to complete our quick survey.

Have a great day!

Spotify Customer Support

Please do not reply to this email. For further assistance, visit our contact form .

ref:00DDpxIW.500Qx00000p2VLh: ref`,label:"wait"},{id:21,company:"Grammarly",from:"privacy@grammarly.zendesk.com",subject:"We\u2019re on it!  Your Customer Care request #9130102",receivedAt:"2026-11-20T17:15:00.000Z",text:`Hey there! Thanks so much for reaching out \u{1F44B}
Just wanted to let you know we've received your message with the subject "[EXTERNAL] Request to delete my personal data [ER-88AC9]" , and soon we\u2019ll be able to help you out. It might take us a bit longer to get back to you due to a higher volume of requests; we appreciate your understanding.
While you wait, feel free to explore our Help Center at help.superhuman.com (Superhuman Go, Agents, Mail, and Docs) or at support.grammarly.com (Grammarly) for some helpful tips, or try chatting with our chatbot to find quick solutions.
If you have any more context you want to share, just reply to this thread to keep it in one place.
Thanks for your patience and talk soon \u2728

This email is a service from Grammarly Support. Delivered by Zendesk

[V0NK4R-YVP0R]`,label:"wait"},{id:22,company:"Vimeo",from:"privacy@vimeo.com",subject:"Request to delete my personal data [ER-CDSXS] : Ticket 28952538",receivedAt:"2026-11-20T17:53:00.000Z",text:`Hello,
Thank you for contacting Vimeo. We\u2019ve received your message and will review it as soon as possible. For reference, your case number is 28952538.
If you have additional information to share, you can reply directly to this email.
Important: creating a new ticket for the same issue may slow down our response time. Keeping all replies in this thread ensures we can help you more efficiently.
Best regards,
Vimeo Team

[LE9MLY-J7DVJ]`,label:"wait"},{id:23,company:"Vimeo",from:"privacy@vimeo.com",subject:"Re: Vimeo Support Request #28952538",receivedAt:"2026-11-20T17:55:00.000Z",text:`Your request ( #28952538 ) has been updated.
[agent] (Vimeo Trust & Safety)
Nov 20, 2026, 12:55 EST
Hi there,

Thanks for reaching out.

As a security precaution, I am responding to erased.demo.inbox@gmail.com . If possible, please respond directly from that email. If you can\u2019t access the email address to reply from it, we will still need you to reply to this message before we can take any action on your account.
Signed,

Vimeo Trust & Safety

Help Center
This email is a service from Vimeo Support.

[LE9MLY-J7DVJ]`,label:"confirm_sender"},{id:24,company:"Vimeo",from:"privacy@vimeo.com",subject:"Re: Vimeo Support Request #28952538",receivedAt:"2026-11-23T02:48:00.000Z",text:`Your request ( #28952538 ) has been updated.
[agent] (Vimeo Trust & Safety)
Nov 22, 2026, 21:48 EST
Hello,

This email confirms that our agents have received your request, and we're working to follow up on it. We may need to ask you for additional information before we can process the request, in which case we will reach back out. We do our best to process individual rights requests expeditiously, which in general will be 30 days from the date of your request.

We'll be in touch if we need anything else from you in the meantime.
Signed,

Vimeo Trust & Safety

Help Center
This email is a service from Vimeo Support.

[LE9MLY-J7DVJ]`,label:"wait"},{id:25,company:"Slack",from:"noreply-privacy@salesforce.com",subject:"Salesforce Privacy Request",receivedAt:"2026-11-20T17:15:00.000Z",text:`Dear erased,

We are writing with regards to your request regarding your personal data. To allow us to respond to your request, please complete our Privacy Form where you will be able to provide all the relevant information required in order to properly action your request (such as your country and/or state of residence) and verify your identity. You will also be able to specify which Salesforce products you want to include in your request (such as Slack, Tableau, Heroku, etc.).

If you would like to unsubscribe to marketing from Salesforce, you can unsubscribe here and you can opt out of marketing communications via our online form .

Best regards,

Salesforce Privacy`,label:"use_form"},{id:26,company:"Slack",from:"noreply-privacy@salesforce.com",subject:"Salesforce\u2019s Privacy Resources",receivedAt:"2026-11-20T17:15:00.000Z",text:`Dear erased demo,

Thank you for contacting Salesforce.

Your privacy is very important to us and we are taking steps to respond to your request. In all future communications with us, please reference your case number 00325496.

If your email was to request to exercise any applicable data subject rights or is a query regarding the processing of your personal data by Salesforce, please complete our Privacy Form where you will be able to provide all the relevant information required in order to properly action your request (such as your country and/or state of residence) and verify your identity. You will also be able to specify which Salesforce products you want to include in your request.

While we deal with your request, please do also review the following information which might assist with your query:

If you would like to unsubscribe to marketing from Salesforce, please unsubscribe here .

If you would like to opt out from Audience Studio, please opt out here .

If you are looking for more Privacy resources, please visit our Privacy website . In particular, please review Salesforce\u2019s Privacy Statement to learn about our commitment to privacy.

If you are seeking Salesforce\u2019s most up-to-date Data Processing Addendum, our pre-signed addendum can be found here and our DPA faqs can be found here .

If you are a current Salesforce customer, please reach out directly to your Account Executive who is best equipped to answer your questions.

Best regards,

Salesforce Privacy

\xA9 salesforce.com , inc. All rights reserved.

Salesforce Tower, 415 Mission Street, 3rd Floor, San Francisco, CA 94105 United States`,label:"use_form"},{id:27,company:"Slack",from:"noreply-privacy@salesforce.com",subject:"Salesforce Privacy Request",receivedAt:"2026-11-23T01:47:00.000Z",text:`Dear erased,

We are writing with regards to your request regarding your personal data. To allow us to respond to your request, please complete our Privacy Form where you will be able to provide all the relevant information required in order to properly action your request (such as your country and/or state of residence) and verify your identity. You will also be able to specify which Salesforce products you want to include in your request (such as Slack, Tableau, Heroku, etc.).

If you would like to unsubscribe to marketing from Salesforce, you can unsubscribe here and you can opt out of marketing communications via our online form .

Best regards,

Salesforce Privacy`,label:"use_form"},{id:28,company:"Slack",from:"noreply-privacy@salesforce.com",subject:"Salesforce\u2019s Privacy Resources",receivedAt:"2026-11-23T01:47:00.000Z",text:`Dear erased demo,

Thank you for contacting Salesforce.

Your privacy is very important to us and we are taking steps to respond to your request. In all future communications with us, please reference your case number 00325605.

If your email was to request to exercise any applicable data subject rights or is a query regarding the processing of your personal data by Salesforce, please complete our Privacy Form where you will be able to provide all the relevant information required in order to properly action your request (such as your country and/or state of residence) and verify your identity. You will also be able to specify which Salesforce products you want to include in your request.

While we deal with your request, please do also review the following information which might assist with your query:

If you would like to unsubscribe to marketing from Salesforce, please unsubscribe here .

If you would like to opt out from Audience Studio, please opt out here .

If you are looking for more Privacy resources, please visit our Privacy website . In particular, please review Salesforce\u2019s Privacy Statement to learn about our commitment to privacy.

If you are seeking Salesforce\u2019s most up-to-date Data Processing Addendum, our pre-signed addendum can be found here and our DPA faqs can be found here .

If you are a current Salesforce customer, please reach out directly to your Account Executive who is best equipped to answer your questions.

Best regards,

Salesforce Privacy

\xA9 salesforce.com , inc. All rights reserved.

Salesforce Tower, 415 Mission Street, 3rd Floor, San Francisco, CA 94105 United States`,label:"use_form"},{id:29,company:"Zoom",from:"customercare@zoom.us",subject:"Re: Request to delete my personal data [ER-U385M]",receivedAt:"2026-11-20T17:17:00.000Z",text:`Next Steps: Data Deletion & Unsubscribe 1. To request deletion of your personal data, complete the Data Subject Rights Request Form here: https://privacyportal. onetrust.com/webform/65962359- ef0d-4399-9db4-572d06de08aa/ f277f9f7-bfee-4233-815e- 80e290139bc2 .

2. To opt out of marketing communications, unsubscribe by clicking the unsubscribe link at the bottom of Zoom marketing emails, or copy the following link into your browser and enter the email address that you would like to have unsubscribed at the end of the URL as indicated by the placeholder in brackets before launching the page: https://www.zoom.us/ unsubscribe/u?email=[INSERT YOUR EMAIL ADDRESS HERE]

Sign In

Hello,

Thank you for contacting the Zoom Privacy Team. This mailbox is intended only for inquiries and requests related to Zoom's privacy practices. Learn more here: Privacy at Zoom .

To exercise any of your rights as to personal data controlled by Zoom, see below:

Access, delete, or correct your data: Complete the Data Subject Rights Request Form here . Please note: If you do not have a Zoom account and joined a Zoom meeting as a guest, contact the host of the Zoom meeting you attended to exercise your data subject rights.

Opt out of the \u201Csale\u201D or \u201Csharing\u201D of personal data for targeted advertising purposes: Zoom does not sell personal data governed by this Privacy Statement in the conventional sense. However, like many companies, we may use advertising and analytics services based on cookies and similar technologies. Opt out of the use of cookies and similar technologies on our website by clicking Your Privacy Choices or Cookies Settings on the bottom of our homepage , and setting your preferences. You will need to set your preferences from each device and each web browser from which you wish to opt out. This feature uses a cookie to remember your preference, so if you clear all cookies from your browser, you will need to re-select your preferred settings.

Opt out of the sale of personal data (Zoom Common Room only):

Sales of business contact related data may occur through our Zoom Common Room (ZCR) offering. Please see the Zoom Common Room Privacy Statement for more information. To exercise your right to opt out of the sale of personal data through the ZCR data enrichment services, please click here .

Unsubscribe from marketing communications: Unsubscribe from our marketing communications by clicking the unsubscribe link at the bottom of Zoom marketing emails or by copying the following link into your browser and entering the email address that you would like to have unsubscribed at the end of the URL as indicated by the placeholder in brackets before launching the page: https://www.zoom.us/ unsubscribe/u?email= [INSERT YOUR EMAIL ADDRESS HERE]

Shine the Light: California\u2019s Shine the Light law requires a business to disclose, upon a customer\u2019s request, the types of personal information the company shared with third parties for the third parties\u2019 own direct marketing purposes during the immediately preceding calendar year. Zoom has not made any such disclosures of your personal information in the immediately preceding calendar year. For more information on how Zoom collects and processes personal data, please visit the Zoom Privacy Statement .

In the Zoom Trust Center , you\u2019ll discover many resources related to Privacy, Security, Compliance, and Safety.

Should you wish to report a violation to Zoom's Terms of Service , or Acceptable Use Guidelines , you can do so here .

For support or billing related questions, please visit Zoom Support or Billing and Account Management .

Kind Regards,

The Zoom Privacy Team

Visit zoom.com
55 Almaden Blvd, 6th Floor
San Jose, CA 95113

Ref:MSG31920658_ JauX40XPynjtXnF5T4j

image
2K`,label:"use_form"},{id:30,company:"Zoom",from:"customercare@zoom.us",subject:"Re: Request to delete my personal data [ER-U385M]",receivedAt:"2026-11-23T14:45:00.000Z",text:`Sign In

Your request ( PRI0137246 ) has been updated. Reply to this email or follow the link above.

2026-11-23 06:45:18 PST - Zoom Privacy Team Additional comments
Hello,

Thank you for contacting the Zoom Privacy Team.

Zoom is unable to match your email address with a Zoom account. If you have a Zoom account and would like to exercise any of your rights as to personal data controlled by Zoom, please complete the Data Subject Rights Request Form located here .

If you do not have a Zoom account and joined a Zoom meeting as a guest please direct your request to the meeting host.

Kind Regards,
The Zoom Privacy Team

2026-11-22 17:52:53 PST - erased.demo.inbox@gmail.com Additional comments
Hello,

You asked me to use your form. I made this request to your privacy address, which is a valid way to make it.
Please go ahead and erase my Zoom account and all personal data you hold about me.
Section 34(1) of the Nigeria Data Protection Act 2023 gives me the right to obtain erasure from you without constraint or unreasonable delay, and section 35(2) requires withdrawing consent to be as easy as giving it.
If you need to check it is me, please send a confirmation link to erased.demo.inbox@gmail.com .

Reference: ER-U385M

Kind regards,
erased demo`,label:"no_account"},{id:31,company:"Wix",from:"notifications-support@wix.com",subject:"We received your request (Case no. 3000449597) | Wix Customer Care Ref:033887993",receivedAt:"2026-11-20T17:21:00.000Z",text:`We\u2019re on it

Hi,

Thanks for contacting Wix Customer Care.

We just wanted to let you know we received your request ( - case no.

3000449597 ). An Expert will be in touch with you via email as soon as possible.

In the meantime, you can find answers on your own in the
Wix Help Center .

100 Gansevoort St., New York, NY 10014 \u2022 Wix.com Ltd. \u2022 Wix.com Inc. \u2022 Wix.com

Help Center |
Privacy Policy |
Terms of Use`,label:"wait"},{id:32,company:"Wix",from:"privacy@wix.com",subject:"RE: Request to delete my personal data [ER-N5E27] Ref:007600177",receivedAt:"2026-11-20T17:35:00.000Z",text:`Hello,

Hope this email finds you well and thank you for contacting Wix Customer Care

We understand you're requesting to delete your personal data. In order to assist you with this, please click here to fill out the form and request the permanent deletion of your Wix account.

Important:

You must sign in to your Wix account prior to clicking the link.

If you have multiple Wix accounts, you must submit a separate request for each one.

Regarding your Marketing emails you've been receiving, we recommend that you cancel all subscriptions related to marketing campaigns. If you continue to experience problems after doing so, do not hesitate to contact us again.

Kind regards,
[agent]
Wix Customer Care`,label:"use_form"},{id:33,company:"Wix",from:"notifications-support@wix.com",subject:"Re: We've received your request to permanently delete your account data Ref:060526038",receivedAt:"2026-11-23T02:12:00.000Z",text:`Hi,
Following your request to permanently delete your Wix.com account and data,
we've deactivated your account, you will no longer be able to log into your account.
Thanks,
The Wix.com team`,label:"wait"},{id:34,company:"Wix",from:"notifications-support@wix.com",subject:"We received your request (Case no. 3000455103) | Wix Customer Care Ref:033892527",receivedAt:"2026-11-23T02:12:00.000Z",text:`We\u2019re on it

Hi,

Thanks for contacting Wix Customer Care.

We just wanted to let you know we received your request ( We've received your request to permanently delete your account data - case no.

3000455103 ). An Expert will be in touch with you via email as soon as possible.

In the meantime, you can find answers on your own in the
Wix Help Center .

100 Gansevoort St., New York, NY 10014 \u2022 Wix.com Ltd. \u2022 Wix.com Inc. \u2022 Wix.com

Help Center |
Privacy Policy |
Terms of Use`,label:"wait"},{id:35,company:"Wix",from:"notifications-support@wix.com",subject:"Re: We've received your request to permanently delete your account data Ref:060526037",receivedAt:"2026-11-23T02:12:00.000Z",text:`Hi,
We've reviewed your request to permanently delete your Wix.com account and data.
Please note the following important information:
\u2022 All of your subscriptions and premium plans will be cancelled.
\u2022 Your account will get deactivated, and you will no longer be able to log into your account.
\u2022 Your data from all Wix services and products will be deleted 7 days after receiving this message, This process cannot be reverted.
What does this mean for you?:
\u2022 When contacting Wix support, we will not recognize your account details, as they have been deleted from our system.
\u2022 Your invoices will be deleted from your account, it is not possible to retrieve then now.
\u2022 You will no longer receive any communication from Wix.com for this account.
There is some data that we can't delete:
\u2022 Due to system restrictions, if you have transferred a site, your site's media (e.g. images) cannot be deleted permanently.
\u2022 After your site is deleted it can no longer be crawled by search engines, however, it may take some time before your site's pages stop appearing in search results.
\u2022 Wix cannot delete information associated with Third Party Apps that you've added to your site. Click here to learn how to retrieve data from your Third Part Apps.
\u2022 Information needed for compliance with a legal obligation or if required for the establishment, exercise or defence of legal claims.

Thanks,
The Wix.com team`,label:"scheduled"},{id:36,company:"Wix",from:"support@wix.com",subject:"Confirmation of your personal data deletion request Ref:049700248",receivedAt:"2026-11-23T10:06:00.000Z",text:`Hello,
We\u2019re writing to confirm that your Wix account has been deactivated and that the process to delete your account data has begun.
You will no longer be able to sign in to the account.

Kind regards,
Wix Customer Care`,label:"wait"},{id:37,company:"monday.com",from:"assist@cx.monday.com",subject:"Re: Request to delete my personal data [ER-TWVYB]",receivedAt:"2026-11-20T17:17:00.000Z",text:`Hi ,

Thank you for your request.

To help us process your request correctly, please complete our request form. The form allows us to understand the nature of your request and verify that you are authorized to submit it before we take further action.

Please fill out our request form here.

To help us process your request, please complete the form within the next 30 days. If we do not receive a response within that timeframe, we may consider your request withdrawn and close it.

Note: By submitting this form, you acknowledge that we may process personal data in connection with your request, and you represent that you are authorized to submit it. If you did not make this request, or if you do not want us to proceed, kindly let us know by replying to this email.

All the best,

monday.com

--

Disclaimer: This response is generated by an AI support bot and is not intended to discuss sensitive matters; monday.com makes no guarantee of the accuracy of such a response.

If you'd rather speak to a human agent, ask for one directly.`,label:"use_form"},{id:38,company:"monday.com",from:"assist@cx.monday.com",subject:"Re: Request to delete my personal data [ER-TWVYB]",receivedAt:"2026-11-23T01:52:00.000Z",text:`Hello,

Hey there, monday.com \u2019s AI support bot here.

I went ahead and transferred your request to one of our support team members.

For reference, your ticket ID is: #5340856

A separate email thread with our support team will be opened for this ticket. Please use that thread if you\u2019d like to provide additional information.

You can check all the support requests you\u2019ve submitted by following the steps in the article below:

My Requests

Rest assured, our team received your request and will follow up as soon as possible.

We appreciate your patience and cooperation!

Best regards, [Quoted text hidden]`,label:"wait"},{id:39,company:"monday.com",from:"privacy@monday.zendesk.com",subject:"Quick update from us regarding your support request #5340856",receivedAt:"2026-11-23T03:57:00.000Z",text:`##- Please type your reply above this line -##

Hey there,
We'd like to provide you with a quick update from us regarding your support request.
has reviewed your email and believes that it would be best if we escalate this request directly to another team member who specializes in this topic.
While the response time might be a bit delayed, we're hoping that having the right specialist take ownership here will drive the most effective resolution going forward.
If you have any additional details that you would like to add, please do add them in the thread below.
Always here to help!
monday.com 's Customer Experience Team

This email is a service from monday.com .

[DD076M-0X9XP]`,label:"wait"},{id:40,company:"monday.com",from:"privacy@monday.zendesk.com",subject:"Re: Request to delete my personal data [ER-TWVYB] (#5340856)",receivedAt:"2026-11-23T06:09:00.000Z",text:`##- Please type your reply above this line -##

[agent] ( monday.com )
Nov 23, 2026, 1:09 AM EST
Hi,

Thank you for your request, and for taking the time to exercise your privacy rights.

We received your request concerning data associated with you at monday.com . Before taking further action, we are required to verify the validity of your request. Please respond to this email with:

Confirmation that this request was indeed made by you,
Elaboration on your relationship with monday.com and why you think we may have been exposed to your personal data.

By confirming, you acknowledge that we may send personal data concerning your request to this email address, and warrant that you are authorized to receive the data requested.

If you did not make this request, or if you do not want us to proceed with it, kindly let us know. Please respond within the next 30 days in order for us to process your request.

All the best,
monday.com Legal Team`,label:"confirm_sender"},{id:41,company:"Prezi",from:"privacy@prezi.zendesk.com",subject:"We got your request: Prezi Support",receivedAt:"2026-11-20T17:16:00.000Z",text:`## In replies all text above this line is added to the ticket ##

Hello and thanks for reaching out to us.
This is an automated message to let you know that we received your help request. Based on the current request volume, you can generally expect a reply within 5-7 business days. Please do not create a separate request, as it may cause delayed response times.
Meanwhile, you can respond to this email and let our team know if any important info wasn't part of your original request.
If your request is related to a recent charge or a failed transaction, please include the following information in your message:

last 4 digits of credit card used

full name of the cardholder

date of transaction

amount of the transaction

billing postal/zip code associated with the card

if using PayPal, the e-mail address associated with you PayPal account
Don't forget, you can find the answers to many common questions in our Knowledge Base:
Billing Support | Answers to Billing Questions
Prezi Support Center | Account and settings
Thanks for your continued patience, and we'll be in touch soon.
Hope you have a wonderful day,
Prezi Support Team

This email is a service from Prezi. Delivered by Zendesk .

[21JR9X-XG97N]`,label:"wait"},{id:42,company:"SurveyMonkey",from:"support@surveymonkey.com",subject:"Re.: Request to delete my personal data [ER-MDAK7]",receivedAt:"2026-11-20T17:16:00.000Z",text:`Thank you for contacting SurveyMonkey's Office of the Data Protection Officer (ODPO), which has responsibilities for the European Economic Area (EEA), United Kingdom (UK), and Switzerland. We take our responsibility to act as a contact for supervisory authorities and data subjects seriously and will respond to your inquiry as quickly as possible.

If you are a customer with a non-DPO related question that is listed on this Support page , you may accelerate the response process by contacting SurveyMonkey's Customer Support team directly.

If you are contacting SurveyMonkey to sign a new Data Processing Agreement with EU Standard Contractual Clauses and/or the UK IDTA and you are a self-serve user, the SurveyMonkey online DPA applies to you by default. The EU SCCs and the UK IDTA addendum are incorporated by reference. You do not need to add or sign additional documentation and SurveyMonkey has declined to agree to additional contractual terms.

If you are contacting SurveyMonkey to sign a new Data Processing Agreement with EU Standard Contractual Clauses and/or the UK IDTA and you are a sales-assisted user, the SurveyMonkey Governing Service Agreement applies to you (unless you have a custom contract). SurveyMonkey's data protection commitments can be found in section 7. If you have questions about your contract including the EU SCCs or the UK IDTA, please reach out to your SurveyMonkey Account Executive.

If your question is not related to the specific topics discussed above, the ODPO will respond shortly.

[ ref:_00D301HuKJ._500Pi2h1UlY: ref ] autoresponse-identity`,label:"wait"},{id:43,company:"Meetup",from:"privacy@meetup.com",subject:"[Meetup] Re: 2114497",receivedAt:"2026-11-20T17:18:00.000Z",text:`##- Please type your reply above this line -##

Your request (2114497) has been updated. To add additional comments, reply to this email.

Meetup Community Support (Meetup)
Nov 20, 2026, 12:18 EST
Hi there,
Thank you for reaching out to Meetup Trust & Safety.
We understand that you want to permanently delete your account and personal data.
Log in and submit the form in Request permanent deletion of your data .
Cancel any active Meetup+ or Organizer subscriptions .
Step down as an organizer or close the groups you manage .
Wait for verification. After your request is verified, your account and personal data will be permanently deleted. If any data must be retained by law, you\u2019ll be informed of the reason and legal basis.
To stop marketing emails, use the unsubscribe link in a marketing email or update your account\u2019s email preferences.
To opt out of sharing your information for targeted advertising, follow the opt-out instructions in the Cookie Policy .
Please reach out again if the issue continues or something doesn\u2019t match your experience.
This response was generated by our AI assistant, which uses our verified resources to provide the quickest and most accurate support possible.
Warm regards,
[agent]
Meetup Community Support`,label:"log_in_delete"},{id:44,company:"Eventbrite",from:"support@eventbrite.com",subject:"Resolving case #8889428: Request to delete my personal data [ER-UCYMS], ref:!00D7008atE.!500Pk01GZcru:ref",receivedAt:"2026-11-20T17:17:00.000Z",text:`Hi erased,
Thank you for contacting Eventbrite Privacy. Eventbrite provides you with several tools you can use to manage your personal data. Please see below for helpful privacy resources.
To access your personal data , visit the Eventbrite Privacy Center and click \u201CTake Control of Your Data.\u201D Then, click \u201CDownload my data\u201D and follow the instructions provided.
To delete your personal data , visit the Eventbrite Privacy Center and click \u201CTake Control of Your Data.\u201D Then, click \u201CDelete my data\u201D and follow the instructions provided. Please note that if you have created an Eventbrite account you will need to close your Eventbrite account before you can delete your data. You can close your account by visiting the Close Account section of your Eventbrite account and follow the steps in-product. Please note that this action is permanent and can\u2019t be reversed.
To get more information , such as to review our privacy practices , customer Data Processing Agreement (DPA) or to update your cookie preferences, visit our Privacy Policy and Organizer DPA .

If you need additional support , please respond directly to this email to route your query to one of our support agents. We will review your request and provide you a response within 30 days.
Thanks,
Eventbrite Customer Experience

ref:!00D7008atE.!500Pk01GZcru: ref
00X5Y0000039LDbUAM

Eventbrite, Inc.

95 Third Street, 2nd Floor

San Francisco, CA 94103`,label:"log_in_delete"},{id:45,company:"Box",from:"privacy@box.zendesk.com",subject:"Box Product Support - Case #3683736",receivedAt:"2026-11-20T17:17:00.000Z",text:`Case: #3683736
Support Subscription: Personal/Free User
Your request has been received and we will be in touch as soon as possible.
In the meantime, please search our extensive self-help information on our Support site or start or join a conversation in our Community .
If you want to know more about our response times, priority definitions, and support service offerings check out this reference .

More Resources:
Community Forums and Help Articles |
Self-Paced Training & Classes |

This email is a service from Box Customer Success.

[M9MV3N-YZ3KK]`,label:"wait"},{id:46,company:"Box",from:"privacy@box.zendesk.com",subject:"Box Product Support - Update on Case #3683736",receivedAt:"2026-11-20T17:33:00.000Z",text:`Hello there,

Thank you for reaching out to the Box Privacy Team.

This email confirms that we have received your deletion request.

For Personal Box Accounts:

If you have a personal Box account, we must verify that you are the account owner before we can permanently delete the account and any content stored within it.

Please complete the steps below at any time. To protect the security and integrity of your account, it will not be deleted until the verification process is complete.

1. Visit: https://app.box.com/account and sign into your personal Box account.
2. Click 'Permanently Delete Your Account.'

For the complete guide, please view our support article found here .

For All Other Personal Information:

We are also reviewing your deletion request as it may relate to information to which Box is the data controller (e.g. marketing information).

To learn more about privacy at Box, please review the Box Privacy Notice or visit the Box Trust Center .

Thank you,
Box Privacy Team

More Resources:
Community Forums and Help Articles |
Self-Paced Training & Classes |

This email is a service from Box Customer Success.

[M9MV3N-YZ3KK]`,label:"log_in_delete"},{id:47,company:"Asana",from:"support@asana.com",subject:"Case 11067285: Request to delete my personal data [ER-6J752]",receivedAt:"2026-11-20T17:18:00.000Z",text:`Hi erased demo,

This is an automated confirmation that your support case has been received.

Your case regarding Request to delete my personal data [ER-6J752] is now being reviewed by our Support team. Your case number is 11067285. We\u2019ll email you directly at the address you provided.

You can also view and respond to all of your cases by logging in to the Asana Help Center , then clicking \u201CGet Support\u201D in the top-right corner.

If you have additional information you\u2019d like to provide, please reply back to this message, otherwise stay tuned for an update from us shortly.

Thanks,
Asana Support

Helpful Resources: Search the Asana Help Center for information on specific features
Learn how to use and master Asana with our Asana Academy
Browse the Asana Forum for similar questions or post your own
thread::9J6mOrTedMm1UHJFcXm- NTg::`,label:"wait"},{id:48,company:"Asana",from:"privacy@asana.com",subject:"Case 11067285: Request to delete my personal data [ER-6J752]",receivedAt:"2026-11-20T17:32:00.000Z",text:`Hi there,

Thanks for getting in touch. My name is [agent] from Asana Support. I understand you'd like to delete your account. I would be happy to assist you today with your account deletion request.

To formally submit a request to have your personal information deleted, please complete our Data Subject Request form here . This is the process outlined in Asana\u2019s Privacy Statement for privacy and data deletion requests.

Once submitted, the appropriate team will be able to review and process your request.

I\u2019m sorry to see you go, but I hope this helps make the process as straightforward as possible. If you have any questions about submitting the request or need any clarification, please let us know.

I'm going to mark your inquiry as resolved, but if anything else comes up related to this issue, simply reply to this email within the next 48 hours, and it will be automatically reopened. After that window, further questions can be submitted as a new request.

You'll receive a short Asana Support survey after this case closes. Our team and I would love to hear any feedback from you, as it helps us understand what's working and what could improve your experience. Thank you in advance!

Best,

[agent]

Asana Customer Support

Getting Started, Video Tutorials, FAQ: https://help.asana.com

Courses, Live Trainings, and Certifications: https://academy.asana.com`,label:"use_form"},{id:49,company:"Asana",from:"privacy@asana.com",subject:"Case 11067285: Request to delete my personal data [ER-6J752]",receivedAt:"2026-11-23T20:24:00.000Z",text:`Hi there,

Thank you once again for your patience. I wanted to let you know that your case is being transferred to our team, which is best equipped to assist with your concern regarding your account and its data deletion request.

While I don\u2019t have an exact turnaround time just yet, please rest assured that all details you\u2019ve shared so far have been documented to ensure a smooth handover and continued support.

If you have any further questions or additional information you\u2019d like us to note in the meantime, please don\u2019t hesitate to let us know.

Best,

[agent]

Asana Customer Support

Getting Started, Video Tutorials, FAQ: https://help.asana.com

Courses, Live Trainings, and Certifications: https://academy.asana.com`,label:"wait"},{id:50,company:"Asana",from:"noreply@privacy-central.securiti.ai",subject:"DSR Request received. Verify your email to process request.",receivedAt:"2026-11-23T22:14:00.000Z",text:"Hi erased demo , Thank you for submitting the following data subject rights requests: Erasure Request In order to verify your identity we ask that you use the email verification link in this email. After confirming your identity we will process your inquiry promptly and respond within the legal time limits. Confirm Email Please do not hesitate to contact us if you have any further questions. For security purposes, the above link will expire in 1 day(s). With kind regards Asana",label:"verify_link"},{id:51,company:"Asana",from:"privacy@asana.com",subject:"Case 11067285: Request to delete my personal data [ER-6J752]",receivedAt:"2026-11-23T22:16:00.000Z",text:`Hi there,

[agent] here from Asana Support and thank you for reaching out and for your patience.

I can confirm that your Asana account associated with erased.demo.inbox@gmail.com has now been deleted. I have also submitted the Global Data Protection Rights Requests form on your behalf. Please check your email to complete the form submission.

Please let me know if you have any questions!

Best regards,

[agent]

Asana Customer Support

thread::9J6mOrTedMm1UHJFcXm- NTg::`,label:"verify_link"},{id:52,company:"Skillshare",from:"help@skillshare.com",subject:"Hello from Skillshare Support!",receivedAt:"2026-11-20T17:18:00.000Z",text:`Hi erased,
Thanks for reaching out to Skillshare Support! We are confirming that we have received your message ( #2291635 ).
We're experiencing higher-than-expected demand at this time and will attend to your ticket as soon as we can. We appreciate your patience.
In the meantime please check out our Help Center for answers to some frequently asked questions: https://help.skillshare.com/
All the best,
Skillshare Support

[WYL0K5-NLZMM]`,label:"wait"},{id:53,company:"Skillshare",from:"help@skillshare.com",subject:"We're on it \u2014 thanks for your patience",receivedAt:"2026-11-21T18:02:00.000Z",text:`Hi erased demo,
Just a quick note to say thank you for hanging in there \u2014 we haven\u2019t forgotten about your message.
Our Support team is currently responding to a higher volume of messages than usual, but your ticket is in queue and important to us.
In the meantime, you might find what you need in our Help Center \u2014 it\u2019s got answers to many common questions.
Thanks again for your patience \u2014 we really appreciate it.
All the best,
Skillshare Support

[WYL0K5-NLZMM]`,label:"wait"},{id:54,company:"Skillshare",from:"help@skillshare.com",subject:"Request to delete my personal data [ER-US2PY]",receivedAt:"2026-11-22T05:51:00.000Z",text:`Hi There,

Thanks for reaching out to Skillshare. I'm [agent] and I'll be assisting you today.

We're sorry to see you go and we sincerely apologize for any inconvenience the email notifications have caused! If there's anything I can help you out with or answer for you first, please let me know. We\u2019d love to keep you as a Member!

Please check out this guide for details on what happens to your account when it is deleted, as this action is irreversible.

If you\u2019d like to continue with your account's deletion, please submit a request through our Online Form here:
https://preferences. skillshare.com/privacy

I'll close this ticket in the meantime, but feel free to reach out if you have any further questions.

[agent]
https://help.skillshare.com/

Inspire your friends, family, or team with a Skillshare membership\u2014available in 3-, 6-, or 12-month options.
\u{1F381} Send a gift

[WYL0K5-NLZMM]`,label:"use_form"},{id:55,company:"Typeform",from:"gdpr@typeform.com",subject:"[Request received] | [EXT] Request to delete my personal data [ER-AW5BE]",receivedAt:"2026-11-20T17:49:00.000Z",text:`Hello,
Thanks for reaching out. We got your message and we\u2019ll contact you as soon as humanly possible. You\u2019re not alone\u2026promise.

Do any of these articles answer your question?

How do I exercise my GDPR rights? GDPR (the European General Data Protection Regulation) is designed to give you more rights and control over your... Read more
\u2714 Yes, close my request View article

Right to be forgotten In the European Union, GDPR gives you the right to be forgotten, officially known as the right to erasure. It\u2019s not... Read more
\u2714 Yes, close my request View article

What is GDPR? At Typeform, we take your data privacy and security seriously. This article explains the basics of the European... Read more
\u2714 Yes, close my request View article

Help Center |
Ask the Community |
Log in

You have been sent this message because you recently opened a help request with Typeform.`,label:"wait"},{id:56,company:"Typeform",from:"gdpr@typeform.com",subject:"Request to delete my personal data [ER-AW5BE]",receivedAt:"2026-11-20T18:47:00.000Z",text:`Hello there,

Thanks so much for reaching out!

I wasn\u2019t able to find a Typeform account under the email address you\u2019re contacting us from. If you have already deleted your account, we will not be able to find it in our records.

If you have submitted responses to typeforms created by someone at Typeform, for example, maybe when applying for a job with us, then don't worry as we delete these responses within 30 days.

If you want us to delete respondent information that you have sent through a typeform created by a third party, please note that, as outlined in our Privacy Policy , the responsibility to process and manage the data collected by typeforms is that of the form creator. This includes the handling of GDPR requests from respondents like you. You can learn more here .

That being said, we\u2019re here to help facilitate your request as much as we can. However, you'll have to provide us a list of those typeforms you've sent your details to.

In order for us to facilitate your request, could you please provide the following:

Some information on your request and which right you would like to access
The name or email address of the typeform creator
The URL of the typeform you completed

Once we have the above, we\u2019ll reach out to the form owner but please keep in mind, that we can\u2019t promise that they will accommodate your requests. For further information please take a read of our GDPR Help Center article here .

I\u2019ll look forward to your response.

All the best,
Ben | Team Typeform

Original message
[Quoted text hidden]

Help Center |
Ask the Community |
Log in

You have been sent this message because you recently opened a help request with Typeform.

[60LD1R-WJ66V]`,label:"no_account"},{id:57,company:"Typeform",from:"gdpr@typeform.com",subject:"Request to delete my personal data [ER-AW5BE]",receivedAt:"2026-11-23T11:19:00.000Z",text:`Hello there,

Thanks for your reply.

I wasn\u2019t able to find a Typeform account associated with the email address you\u2019re contacting us from. Could you please send us the URL of one of your typeforms? With this I'll be able to check which email address it's associated with. Also, if there's any other email address you may have created the account under, just let me know and I'll be happy to check for you.

If you have already deleted your account, we will not be able to find it in our records.

If you have submitted responses to typeforms created by someone at Typeform, for example, maybe when applying for a job with us, then don't worry as we delete these responses within 30 days.

If you want us to delete respondent information that you have sent through a typeform created by a third party, please note that, as outlined in our Privacy Policy , the responsibility to process and manage the data collected by typeforms is that of the form creator. This includes the handling of GDPR requests from respondents like you. You can learn more here .

That being said, we\u2019re here to help facilitate your request as much as we can. However, you'll have to provide us a list of those typeforms you've sent your details to.

In order for us to facilitate your request, could you please provide the following:

Some information on your request and which right you would like to access
The name or email address of the typeform creator
The URL of the typeform you completed

Once we have the above, we\u2019ll reach out to the form owner but please keep in mind, that we can\u2019t promise that they will accommodate your requests. For further information please take a read of our GDPR Help Center article here .

I\u2019ll look forward to your response.

All the best,
Ben | Team Typeform

Help Center |
Ask the Community |
Log in

You have been sent this message because you recently opened a help request with Typeform.

[60LD1R-WJ66V]`,label:"no_account"},{id:58,company:"Notion",from:"privacy@makenotion.com",subject:"[Request received]",receivedAt:"2026-11-20T17:49:00.000Z",text:`We received your message (5535049)! One of our team members will be in touch with you via email soon. If we can help with anything else in the meantime, feel free to reply to this email. Have a great day!

[Z2KN2K-VVPZ1]`,label:"wait"},{id:59,company:"Notion",from:"privacy@makenotion.com",subject:"Request to delete my personal data [ER-6VN4F]",receivedAt:"2026-11-20T18:58:00.000Z",text:`We\u2019ve responded to your message (5535049). If you need further assistance, please reply to this email.

[agent] (Notion)
Nov 20, 2026, 10:58 PST
Hello there,

Thanks for reaching out about this.

In order to make sure we follow your instructions properly, please confirm what you would like deleted? Would you like to fully delete your account and personal data, or something else? Please note that deleting your personal data is irreversible.

Please be very specific so we can address your request as quickly as possible.

Best,
[agent]`,label:"clarify"},{id:60,company:"Notion",from:"privacy@makenotion.com",subject:"Request to delete my personal data [ER-6VN4F]",receivedAt:"2026-11-22T19:02:00.000Z",text:`Hi erased demo,
It\u2019s been a couple days since we\u2019ve heard from you, so this is an automated message to remind you that we\u2019re looking forward to your response on your ticket. If you don\u2019t need any further help, you can reply to let us know and we\u2019ll close the ticket. If you need more help, please reply. If we don\u2019t hear back, the ticket will be automatically closed.
As a reminder, here\u2019s what the ticket was about`,label:"wait"},{id:61,company:"Notion",from:"privacy@makenotion.com",subject:"Request to delete my personal data [ER-6VN4F]",receivedAt:"2026-11-23T23:45:00.000Z",text:`We\u2019ve responded to your message (5535049). If you need further assistance, please reply to this email.

[agent] (Notion)
Nov 23, 2026, 15:45 PST
Hi there,

Thanks for reaching out!

I've passed your request to delete your personal data on to our team.

Should we need additional information from you we will reach out to you again. We will let you know once the deletion is complete.

Best,
[agent]`,label:"wait"},{id:62,company:"Kaggle",from:"support@kaggle.zendesk.com",subject:"[Kaggle] Re: Dear Kaggle privacy team, I am writing to request that you erase all personal data you hold about me, under section 34 of the Nigeria Data Protect...",receivedAt:"2026-11-21T16:29:00.000Z",text:`Your request (278172) has been updated. To add additional comments, reply to this email.

Kaggle Support Team (Kaggle)
Nov 21, 2026, 8:29 AM PST
Hello,

Thank you for your inquiry. We couldn't find an account associated with that email address erased.demo.inbox@gmail.com . Could you please double-check and share the correct email ID so we can assist you further?`,label:"no_account"},{id:63,company:"Calendly",from:"noreply@m.ketch.com",subject:"Identity Verification",receivedAt:"2026-11-20T17:43:00.000Z",text:`Dear erased,

Thank you for submitting your request. As required by law, we have sent you an email verification request to confirm your identity.

You must respond within 7 days or your request will expire.

Your Request ID is 62d8dff7-e096-4770-9b86- 2597d35d4735, please keep this for your records.

Verify My Identity

Or copy and paste this link into your web browser:
https://calendly. privacyportal.co/identity? token= eyJhbGciOiJIUzI1NiIsInR5cCI6Ik pXVCJ9. eyJhdWQiOiJjYWxlbmRseSIsImV4cC I6MTc5NTgwMTQwMCwiaXNzIjoiS2V0 Y2giLCJ0ZW5hbnQiOiJjYWxlbmRseS IsInJlcXVlc3RJRCI6IjYyZDhkZmY3 LWUwOTYtNDc3MC05Yjg2LTI1OTdkMz VkNDczNSIsImxleGlzTmV4aXNBcHBJ bnN0YW5jZUlEIjoiIiwibGV4aXNOZX hpc0J1dHRvblRleHQiOiIiLCJhdXRo ZW50aWNhdG9ySUQiOiIiLCJhdXRoZW 50aWNhdG9yVHlwZSI6MCwiYXV0aGVu dGljYXRvckJ1dHRvblRleHQiOiIiLC Jpc0N1c3RvbUlEViI6ZmFsc2UsImlz U3RhbmRhcmRJRFYiOnRydWUsImlzSW RNZSI6ZmFsc2UsImlkTWVVUkwiOiIi LCJpZE1lQnV0dG9uVGV4dCI6IiJ9. Bf7sJJ_g7yGDTuO4Z45iAj- GVA06g63NzfrmnU4pWFA

\xA9 2026 Calendly. All Rights Reserved`,label:"verify_link"},{id:64,company:"Miro",from:"customer_support@miro.com",subject:"[Request received \u2014 #1070680] Request to delete my personal data [ER-GXP7F]",receivedAt:"2026-11-20T17:55:00.000Z",text:`##- Please type your reply above this line -##

Dear erased,
We have received your support request.
Here are some resources that allow you to take immediate action:
\u2022 You can delete content from Miro boards you have edit access to, including files and objects you have uploaded or shared to a Miro board. You can also delete an entire Miro board. For details, please visit our Help Center article: \u2018 how to delete a board \u2019.
\u2022 You can delete information from your Miro profile to the extent that data is not crucial to manage your profile or Miro\u2019s relationship with you. For more details, please visit our Help Center article: \u2018 profile settings \u2019.
\u2022 You can also delete your Miro profile entirely at any time by logging into your account and by following the steps outlined in the Help Center article: \u2018 how to delete your profile \u2019. Profile deletion is permanent and cannot be reversed. Note that profile deletion does not cancel your active subscriptions. To stop further renewals, please cancel your subscription in settings .
\u2022 You can delete templates or your profile from Miroverse. For more details, please visit the Frequently Asked Questions section of our Help Center articles: \u2018 How to get published on Miroverse \u2019 and \u2018 Miroverse profile pages \u2019.
You can delete posts or your profile from Miro Community. For more details, please visit the \u2018 Community Forum FAQs \u2019
If you would still like Miro\u2019s Customer Support team to take any specific action related to your Miro profile that is connected with your email address, please respond to this message.
Thank you,
Miro Customer Support

This email is a service from Miro Support.

[JMK0D7-M1K4V]`,label:"log_in_delete"},{id:65,company:"Miro",from:"customer_support@miro.com",subject:"Request #1070680: How would you rate the support you received from Miro?",receivedAt:"2026-11-23T18:02:00.000Z",text:`##- Please type your reply above this line -##

Hi erased,
Thank you for reaching out to the Miro Support Team. We hope that you found the solution you were looking for. In case you still require further assistance, please let us know by responding to this email. We\u2019re always here to help!
At Miro, we're constantly trying to improve, and your feedback is crucial to us. We would be incredibly grateful if you could share your thoughts in the survey below, and evaluate the support provided by John. This will only take a moment since the survey has just two quick questions.

Share your feedback \u2192

While this survey concerns your support experience, we would love to hear any product-related feedback you might have. For this, our Wish List is the right place!
Your opinion and insights help us to provide top-notch support to all Miro users. Thank you for taking the time to help us make a better version of Miro.
All the best,
Tibo,
Head of Customer Support
______________________________ _____
Here\u2019s a reminder of your request`,label:"wait"},{id:66,company:"Canva",from:"no-reply@account.canva.com",subject:"Your Canva account will be deleted in 14 days",receivedAt:"2026-11-20T18:05:00.000Z",text:`You\u2019ve got 14 days to restore your account

Your Canva account is scheduled to be deleted

We've received a request to delete your Canva account. Your account is scheduled to be permanently deleted in 14 days, and you will also lose access to Affinity.

Once your account is deleted, you will lose:

Access to Canva and all products by Canva

All created designs, templates, folders, uploaded media and designs in Canva

Any teams that you created

Apps that you created

Restoring your account

Log in to your account within 14 days to restore it. Please note you need an active Canva account to continue using Affinity.

Not sure why you're getting this email?

If you think there's been a mistake, contact support .

Thank you for using Canva.

You're receiving this email because you have a Canva account. This email is not a marketing or promotional email. That is why this email does not contain an unsubscribe link. You will receive this email even if you have unsubscribed from Canva's marketing emails.

Canva Pty Ltd, 110 Kippax St, NSW 2010, Australia

ABN 80 158 929 938 | Privacy Policy`,label:"scheduled"}];var b=e=>document.getElementById(e),y=e=>String(e??"").replace(/[&<>"]/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[a]),pe=matchMedia("(prefers-reduced-motion: reduce)").matches,E=e=>new Promise(a=>setTimeout(a,pe?0:e)),ye=new IntersectionObserver(e=>e.forEach(a=>{a.isIntersecting&&(a.target.classList.add("in"),ye.unobserve(a.target))}),{rootMargin:"0px 0px -8% 0px"});document.querySelectorAll(".reveal").forEach(e=>ye.observe(e));function he(e,a,t=1600){if(pe){e.textContent=a.toLocaleString("en-US");return}let i=performance.now(),o=n=>{let r=Math.min(1,(n-i)/t),l=1-Math.pow(1-r,3);e.textContent=Math.round(a*l).toLocaleString("en-US"),r<1&&requestAnimationFrame(o)};requestAnimationFrame(o)}var Ke=new IntersectionObserver(e=>e.forEach(a=>{a.isIntersecting&&(he(a.target,Number(a.target.dataset.count)),Ke.unobserve(a.target))}),{threshold:.6});document.querySelectorAll("[data-count]").forEach(e=>Ke.observe(e));var ba=[["Substack","Breached 23 Oct 2025 \xB7 663,121 accounts","red"],["Crunchyroll","Breached 12 Mar 2026 \xB7 1,195,684 accounts","red"],["Vimeo","Breached 28 Apr 2026 \xB7 119,167 accounts","red"],["LinkedIn","On the public breach list","red"]];async function ka(){await E(500),he(b("scan-n"),845,2600),he(b("scan-s"),365,2600);let e=b("scan-rows");for(let[a,[t,i]]of ba.entries())await E(a===0?700:520),e.insertAdjacentHTML("beforeend",`<li><span class="ic">${y(t[0])}</span><span class="who"><b>${y(t)}</b><span>${y(i)}</span></span><span class="tag red">after you joined</span></li>`),b("scan-b").textContent=String(a+1);await E(520),e.insertAdjacentHTML("beforeend",'<li><span class="ic">+</span><span class="who"><b>841 more companies</b><span>each with when you joined</span></span><span class="tag device">on device</span></li>')}ka();var Xe=b("rail"),va=b("rail-fill"),wa=[...Xe.querySelectorAll(".step")];function Qe(){let e=Xe.getBoundingClientRect(),a=innerHeight*.55,t=Math.max(0,Math.min(e.height-12,a-e.top));va.style.height=`${t}px`;for(let i of wa)i.classList.toggle("lit",i.getBoundingClientRect().top<a)}addEventListener("scroll",Qe,{passive:!0});Qe();var ge=[2,3,50,25,66,19].map(e=>Be.find(a=>a.id===e)).filter(Boolean),de=0;async function ea(e){let a=++de;document.querySelectorAll(".chip").forEach(g=>g.classList.toggle("on",g.getAttribute("data-id")===String(e.id))),b("mail-hd").innerHTML=`From ${y(e.from)} \xB7 ${y(e.receivedAt.slice(0,10))}<b>${y(e.subject)}</b>`;let t=b("mail-bd"),i=b("coachcard");i.innerHTML='<p class="ph"><span class="reading">Reading\u2026</span></p>';let o=e.text.trim(),n=Math.max(6,Math.ceil(o.length/70));for(let g=0;g<=o.length;g+=n){if(a!==de)return;t.innerHTML=y(o.slice(0,g))+'<span class="caret"></span>',t.scrollTop=t.scrollHeight,await E(14)}let r=ce(o);if(t.innerHTML=r.quote?y(o).replace(y(r.quote),`<mark>${y(r.quote)}</mark>`):y(o),t.querySelector("mark")?.scrollIntoView({block:"center",behavior:pe?"auto":"smooth"}),await E(450),a!==de)return;let l=Date.parse(e.receivedAt),d=e.subject.match(/\bER-[A-Z0-9]{5}\b/)?.[0]??"ER-PRACT",s={id:"demo",domain:A(e.from.split("@")[1]??"")||"example.com",kind:"delete",law:"gdpr",ref:d,company:e.company,route:"email",to:e.from,formUrl:null,accountEmail:"you@example.com",createdAt:l-3*864e5,events:[{type:"sent",at:l-3*864e5}]},u=Ve(s,{ask:r.ask,at:l,from:e.from,subject:e.subject,text:o,links:[],quote:r.quote},""),m=u.action;i.innerHTML=`<span class="tag ${r.ask==="wait"?"":"amber"}">${r.ask==="wait"?"Nothing asked yet":"They ask one thing of you"}</span>
    <h3>${y(u.headline)}</h3><p class="why">${y(u.why)}</p>
    ${u.legal.map(g=>`<p class="law">${y(g)}</p>`).join("")}
    ${m.type==="email"?`<pre>${y(m.body)}</pre>`:`<p><b>${y(m.label)}</b></p>`}`}b("chips").innerHTML=ge.map(e=>`<button class="chip" data-id="${e.id}">${y(e.company)}</button>`).join("");document.querySelectorAll(".chip").forEach(e=>e.onclick=()=>ea(ge.find(a=>String(a.id)===e.dataset.id)));var aa=new IntersectionObserver(e=>{e[0].isIntersecting&&(ea(ge[0]),aa.disconnect())},{threshold:.4});aa.observe(b("chips"));var Je=[["mkt","Still emailing after the request","var(--red)"],["hoop","Asked for one more step","var(--amber)"],["done","Deleted or scheduled","var(--mint)"],["none","No account found","var(--blue)"],["wait","Received, waiting","var(--dim)"]],xa={still_marketing:"Sent marketing after the request",log_in_delete:"Sign in and delete it yourself",use_form:"Use our form",verify_link:"Click a check-it's-you link",confirm_sender:"Prove the request comes from you",go_ahead:"Reply YES",clarify:"Say what to delete",provide_info:"Send more details"},O=e=>e.hoops.some(a=>a.ask==="still_marketing")?"mkt":e.outcome==="deleted"||e.outcome==="scheduled"?"done":e.outcome==="no_account"?"none":e.hoops.length?"hoop":"wait",me=e=>new Date(e).toLocaleDateString("en-GB",{day:"numeric",month:"short",timeZone:"UTC"});async function ja(){let a=(await(await fetch("/run.json",{cache:"no-store"})).json()).requests,t=Object.fromEntries(Je.map(([n],r)=>[n,r]));a.sort((n,r)=>t[O(n)]-t[O(r)]||n.company.localeCompare(r.company));let i=n=>a.filter(r=>O(r)===n).length;b("legend").innerHTML=Je.map(([n,r,l])=>`<button data-k="${n}"><i style="background:${l}"></i>${r} \xB7 <span class="mono">${i(n)}</span></button>`).join(""),b("wall").innerHTML=a.map((n,r)=>{let l=O(n),d=l==="mkt"?"still emailing":l==="done"?n.outcome==="deleted"?"deleted":"deletion scheduled":l==="none"?"no account":l==="hoop"?"one more step":n.replies.length?"received":"no reply yet";return`<button class="tile ${l} reveal" style="--d:${r%6*.04}s" data-i="${r}"><b>${y(n.company)}</b><span>${d}</span></button>`}).join(""),document.querySelectorAll("#wall .reveal").forEach(n=>ye.observe(n));let o="";document.querySelectorAll("#legend button").forEach(n=>n.onclick=()=>{o=o===n.dataset.k?"":n.dataset.k,document.querySelectorAll("#legend button").forEach(r=>r.classList.toggle("on",r.dataset.k===o)),document.querySelectorAll(".tile").forEach(r=>r.classList.toggle("dim",!!o&&!r.classList.contains(o)))}),document.querySelectorAll(".tile").forEach(n=>n.onclick=()=>{document.querySelectorAll(".tile").forEach(m=>m.classList.toggle("on",m===n));let r=a[Number(n.dataset.i)],l=[...r.hoops].sort((m,g)=>g.at-m.at)[0],d=[...r.replies].filter(m=>m.quote&&m.quote.length>12).sort((m,g)=>g.at-m.at)[0],s=l?`${xa[l.ask]??l.ask} \xB7 ${me(l.at)}`:d?`Replied \xB7 ${me(d.at)}`:"No reply yet",u=l?.quote??d?.quote??"";b("detail").innerHTML=`<b>${y(r.company)}</b> <span class="muted">\xB7 request sent ${me(r.sentAt)} \xB7 ${y(s)}</span>${u?`<div class="q2">"${y(u)}"</div>`:""}`})}ja().catch(()=>b("wall-lede").textContent="The live run could not be loaded right now.");
