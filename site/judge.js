var Ra=()=>{};var Da=function(e){let t=[],a=0;for(let o=0;o<e.length;o++){let n=e.charCodeAt(o);n<128?t[a++]=n:n<2048?(t[a++]=n>>6|192,t[a++]=n&63|128):(n&64512)===55296&&o+1<e.length&&(e.charCodeAt(o+1)&64512)===56320?(n=65536+((n&1023)<<10)+(e.charCodeAt(++o)&1023),t[a++]=n>>18|240,t[a++]=n>>12&63|128,t[a++]=n>>6&63|128,t[a++]=n&63|128):(t[a++]=n>>12|224,t[a++]=n>>6&63|128,t[a++]=n&63|128)}return t},lo=function(e){let t=[],a=0,o=0;for(;a<e.length;){let n=e[a++];if(n<128)t[o++]=String.fromCharCode(n);else if(n>191&&n<224){let i=e[a++];t[o++]=String.fromCharCode((n&31)<<6|i&63)}else if(n>239&&n<365){let i=e[a++],s=e[a++],r=e[a++],l=((n&7)<<18|(i&63)<<12|(s&63)<<6|r&63)-65536;t[o++]=String.fromCharCode(55296+(l>>10)),t[o++]=String.fromCharCode(56320+(l&1023))}else{let i=e[a++],s=e[a++];t[o++]=String.fromCharCode((n&15)<<12|(i&63)<<6|s&63)}}return t.join("")},Ae={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let a=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,o=[];for(let n=0;n<e.length;n+=3){let i=e[n],s=n+1<e.length,r=s?e[n+1]:0,l=n+2<e.length,c=l?e[n+2]:0,u=i>>2,d=(i&3)<<4|r>>4,g=(r&15)<<2|c>>6,x=c&63;l||(x=64,s||(g=64)),o.push(a[u],a[d],a[g],a[x])}return o.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(Da(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):lo(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let a=t?this.charToByteMapWebSafe_:this.charToByteMap_,o=[];for(let n=0;n<e.length;){let i=a[e.charAt(n++)],r=n<e.length?a[e.charAt(n)]:0;++n;let c=n<e.length?a[e.charAt(n)]:64;++n;let d=n<e.length?a[e.charAt(n)]:64;if(++n,i==null||r==null||c==null||d==null)throw new tt;let g=i<<2|r>>4;if(o.push(g),c!==64){let x=r<<4&240|c>>2;if(o.push(x),d!==64){let S=c<<6&192|d;o.push(S)}}}return o},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},tt=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},uo=function(e){let t=Da(e);return Ae.encodeByteArray(t,!0)},at=function(e){return uo(e).replace(/\./g,"")},Pa=function(e){try{return Ae.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function G(e){return ja(void 0,e)}function ja(e,t){if(!(t instanceof Object))return t;switch(t.constructor){case Date:let a=t;return new Date(a.getTime());case Object:e===void 0&&(e={});break;case Array:e=[];break;default:return t}for(let a in t)!t.hasOwnProperty(a)||!mo(a)||(e[a]=ja(e[a],t[a]));return e}function mo(e){return e!=="__proto__"}function ue(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var ho=()=>ue().__FIREBASE_DEFAULTS__,po=()=>{if(typeof process>"u"||typeof process.env>"u")return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},fo=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let t=e&&Pa(e[1]);return t&&JSON.parse(t)},go=()=>{try{return Ra()||ho()||po()||fo()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}};var nt=()=>go()?.config;var P=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,a)=>{this.resolve=t,this.reject=a})}wrapCallback(t){return(a,o)=>{a?this.reject(a):this.resolve(o),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(a):t(a,o))}}};function de(){try{return typeof indexedDB=="object"}catch{return!1}}function qa(){return new Promise((e,t)=>{try{let a=!0,o="validate-browser-context-for-indexeddb-analytics-module",n=self.indexedDB.open(o);n.onsuccess=()=>{n.result.close(),a||self.indexedDB.deleteDatabase(o),e(!0)},n.onupgradeneeded=()=>{a=!1},n.onerror=()=>{t(n.error?.message||"")}}catch(a){t(a)}})}var yo="FirebaseError",L=class e extends Error{constructor(t,a,o){super(a),this.code=t,this.customData=o,this.name=yo,Object.setPrototypeOf(this,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,X.prototype.create)}},X=class{constructor(t,a,o){this.service=t,this.serviceName=a,this.errors=o}create(t,...a){let o=a[0]||{},n=`${this.service}/${t}`,i=this.errors[t],s=i?bo(i,o):"Error",r=`${this.serviceName}: ${s} (${n}).`;return new L(n,r,o)}};function bo(e,t){try{let a=0,o="";for(;a<e.length;){let n=e.indexOf("{$",a);if(n===-1){o+=e.substring(a);break}let i=e.indexOf("}",n+2);if(i===-1){o+=e.substring(a);break}let s=e.substring(n+2,i),r=t[s];o+=e.substring(a,n)+(r!=null?String(r):`<${s}?>`),a=i+1}return o}catch{return e}}function Se(e,t){if(e===t)return!0;let a=Object.keys(e),o=Object.keys(t);for(let n of a){if(!o.includes(n))return!1;let i=e[n],s=t[n];if(Oa(i)&&Oa(s)){if(!Se(i,s))return!1}else if(i!==s)return!1}for(let n of o)if(!a.includes(n))return!1;return!0}function Oa(e){return e!==null&&typeof e=="object"}var ko=1e3,wo=2,vo=14400*1e3,xo=.5;function Na(e,t=ko,a=wo){let o=t*Math.pow(a,e),n=Math.round(xo*o*(Math.random()-.5)*2);return Math.min(vo,o+n)}function Te(e){return e&&e._delegate?e._delegate:e}var R=class{constructor(t,a,o){this.name=t,this.instanceFactory=a,this.type=o,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}};var Q="[DEFAULT]";var ot=class{constructor(t,a){this.name=t,this.container=a,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){let a=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(a)){let o=new P;if(this.instancesDeferred.set(a,o),this.isInitialized(a)||this.shouldAutoInitialize())try{let n=this.getOrInitializeService({instanceIdentifier:a});n&&o.resolve(n)}catch{}}return this.instancesDeferred.get(a).promise}getImmediate(t){let a=this.normalizeInstanceIdentifier(t?.identifier),o=t?.optional??!1;if(this.isInitialized(a)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:a})}catch(n){if(o)return null;throw n}else{if(o)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(Eo(t))try{this.getOrInitializeService({instanceIdentifier:Q})}catch{}for(let[a,o]of this.instancesDeferred.entries()){let n=this.normalizeInstanceIdentifier(a);try{let i=this.getOrInitializeService({instanceIdentifier:n});o.resolve(i)}catch{}}}}clearInstance(t=Q){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){let t=Array.from(this.instances.values());await Promise.all([...t.filter(a=>"INTERNAL"in a).map(a=>a.INTERNAL.delete()),...t.filter(a=>"_delete"in a).map(a=>a._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=Q){return this.instances.has(t)}getOptions(t=Q){return this.instancesOptions.get(t)||{}}initialize(t={}){let{options:a={}}=t,o=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(o))throw Error(`${this.name}(${o}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let n=this.getOrInitializeService({instanceIdentifier:o,options:a});for(let[i,s]of this.instancesDeferred.entries()){let r=this.normalizeInstanceIdentifier(i);o===r&&s.resolve(n)}return n}onInit(t,a){let o=this.normalizeInstanceIdentifier(a),n=this.onInitCallbacks.get(o)??new Set;n.add(t),this.onInitCallbacks.set(o,n);let i=this.instances.get(o);return i&&t(i,o),()=>{n.delete(t)}}invokeOnInitCallbacks(t,a){let o=this.onInitCallbacks.get(a);if(o)for(let n of o)try{n(t,a)}catch{}}getOrInitializeService({instanceIdentifier:t,options:a={}}){let o=this.instances.get(t);if(!o&&this.component&&(o=this.component.instanceFactory(this.container,{instanceIdentifier:_o(t),options:a}),this.instances.set(t,o),this.instancesOptions.set(t,a),this.invokeOnInitCallbacks(o,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,o)}catch{}return o||null}normalizeInstanceIdentifier(t=Q){return this.component?this.component.multipleInstances?t:Q:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function _o(e){return e===Q?void 0:e}function Eo(e){return e.instantiationMode==="EAGER"}var Ce=class{constructor(t){this.name=t,this.providers=new Map}addComponent(t){let a=this.getProvider(t.name);if(a.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);a.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);let a=new ot(t,this);return this.providers.set(t,a),a}getProviders(){return Array.from(this.providers.values())}};var Ao=[],b;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(b||(b={}));var So={debug:b.DEBUG,verbose:b.VERBOSE,info:b.INFO,warn:b.WARN,error:b.ERROR,silent:b.SILENT},To=b.INFO,Co={[b.DEBUG]:"log",[b.VERBOSE]:"log",[b.INFO]:"info",[b.WARN]:"warn",[b.ERROR]:"error"},Io=(e,t,...a)=>{if(t<e.logLevel)return;let o=new Date().toISOString(),n=Co[t];if(n)console[n](`[${o}]  ${e.name}:`,...a);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)},W=class{constructor(t){this.name=t,this._logLevel=To,this._logHandler=Io,this._userLogHandler=null,Ao.push(this)}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in b))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?So[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,b.DEBUG,...t),this._logHandler(this,b.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,b.VERBOSE,...t),this._logHandler(this,b.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,b.INFO,...t),this._logHandler(this,b.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,b.WARN,...t),this._logHandler(this,b.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,b.ERROR,...t),this._logHandler(this,b.ERROR,...t)}};var Ro=(e,t)=>t.some(a=>e instanceof a),La,Ma;function Oo(){return La||(La=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Do(){return Ma||(Ma=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var za=new WeakMap,st=new WeakMap,$a=new WeakMap,it=new WeakMap,ct=new WeakMap;function Po(e){let t=new Promise((a,o)=>{let n=()=>{e.removeEventListener("success",i),e.removeEventListener("error",s)},i=()=>{a(j(e.result)),n()},s=()=>{o(e.error),n()};e.addEventListener("success",i),e.addEventListener("error",s)});return t.then(a=>{a instanceof IDBCursor&&za.set(a,e)}).catch(()=>{}),ct.set(t,e),t}function jo(e){if(st.has(e))return;let t=new Promise((a,o)=>{let n=()=>{e.removeEventListener("complete",i),e.removeEventListener("error",s),e.removeEventListener("abort",s)},i=()=>{a(),n()},s=()=>{o(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",i),e.addEventListener("error",s),e.addEventListener("abort",s)});st.set(e,t)}var rt={get(e,t,a){if(e instanceof IDBTransaction){if(t==="done")return st.get(e);if(t==="objectStoreNames")return e.objectStoreNames||$a.get(e);if(t==="store")return a.objectStoreNames[1]?void 0:a.objectStore(a.objectStoreNames[0])}return j(e[t])},set(e,t,a){return e[t]=a,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Ha(e){rt=e(rt)}function qo(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...a){let o=e.call(Ie(this),t,...a);return $a.set(o,t.sort?t.sort():[t]),j(o)}:Do().includes(e)?function(...t){return e.apply(Ie(this),t),j(za.get(this))}:function(...t){return j(e.apply(Ie(this),t))}}function No(e){return typeof e=="function"?qo(e):(e instanceof IDBTransaction&&jo(e),Ro(e,Oo())?new Proxy(e,rt):e)}function j(e){if(e instanceof IDBRequest)return Po(e);if(it.has(e))return it.get(e);let t=No(e);return t!==e&&(it.set(e,t),ct.set(t,e)),t}var Ie=e=>ct.get(e);function Fa(e,t,{blocked:a,upgrade:o,blocking:n,terminated:i}={}){let s=indexedDB.open(e,t),r=j(s);return o&&s.addEventListener("upgradeneeded",l=>{o(j(s.result),l.oldVersion,l.newVersion,j(s.transaction),l)}),a&&s.addEventListener("blocked",l=>a(l.oldVersion,l.newVersion,l)),r.then(l=>{i&&l.addEventListener("close",()=>i()),n&&l.addEventListener("versionchange",c=>n(c.oldVersion,c.newVersion,c))}).catch(()=>{}),r}var Lo=["get","getKey","getAll","getAllKeys","count"],Mo=["put","add","delete","clear"],lt=new Map;function Ua(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(lt.get(t))return lt.get(t);let a=t.replace(/FromIndex$/,""),o=t!==a,n=Mo.includes(a);if(!(a in(o?IDBIndex:IDBObjectStore).prototype)||!(n||Lo.includes(a)))return;let i=async function(s,...r){let l=this.transaction(s,n?"readwrite":"readonly"),c=l.store;return o&&(c=c.index(r.shift())),(await Promise.all([c[a](...r),n&&l.done]))[0]};return lt.set(t,i),i}Ha(e=>({...e,get:(t,a,o)=>Ua(t,a)||e.get(t,a,o),has:(t,a)=>!!Ua(t,a)||e.has(t,a)}));var dt=class{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(a=>{if(zo(a)){let o=a.getImmediate();return`${o.library}/${o.version}`}else return null}).filter(a=>a).join(" ")}};function zo(e){return e.getComponent()?.type==="VERSION"}var mt="@firebase/app",Ga="0.16.6";var z=new W("@firebase/app"),$o="@firebase/app-compat",Ho="@firebase/analytics-compat",Uo="@firebase/analytics",Fo="@firebase/app-check-compat",Go="@firebase/app-check",Wo="@firebase/auth",Bo="@firebase/auth-compat",Vo="@firebase/crashlytics",Yo="@firebase/database",Zo="@firebase/data-connect",Ko="@firebase/database-compat",Jo="@firebase/functions",Xo="@firebase/functions-compat",Qo="@firebase/installations",ei="@firebase/installations-compat",ti="@firebase/messaging",ai="@firebase/messaging-compat",ni="@firebase/performance",oi="@firebase/performance-compat",ii="@firebase/remote-config",si="@firebase/remote-config-compat",ri="@firebase/storage",ci="@firebase/storage-compat",li="@firebase/firestore",ui="@firebase/ai",di="@firebase/firestore-compat",mi="firebase";var ht="[DEFAULT]",hi={[mt]:"fire-core",[$o]:"fire-core-compat",[Uo]:"fire-analytics",[Ho]:"fire-analytics-compat",[Go]:"fire-app-check",[Fo]:"fire-app-check-compat",[Wo]:"fire-auth",[Bo]:"fire-auth-compat",[Vo]:"fire-cls",[Yo]:"fire-rtdb",[Zo]:"fire-data-connect",[Ko]:"fire-rtdb-compat",[Jo]:"fire-fn",[Xo]:"fire-fn-compat",[Qo]:"fire-iid",[ei]:"fire-iid-compat",[ti]:"fire-fcm",[ai]:"fire-fcm-compat",[ni]:"fire-perf",[oi]:"fire-perf-compat",[ii]:"fire-rc",[si]:"fire-rc-compat",[ri]:"fire-gcs",[ci]:"fire-gcs-compat",[li]:"fire-fst",[di]:"fire-fst-compat",[ui]:"fire-vertex","fire-js":"fire-js",[mi]:"fire-js-all"};var Re=new Map,pi=new Map,pt=new Map;function Wa(e,t){try{e.container.addComponent(t)}catch(a){z.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,a)}}function B(e){let t=e.name;if(pt.has(t))return z.debug(`There were multiple attempts to register component ${t}.`),!1;pt.set(t,e);for(let a of Re.values())Wa(a,e);for(let a of pi.values())Wa(a,e);return!0}function he(e,t){let a=e.container.getProvider("heartbeat").getImmediate({optional:!0});return a&&a.triggerHeartbeat(),e.container.getProvider(t)}function Za(e){return e==null?!1:e.settings!==void 0}var fi={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},M=new X("app","Firebase",fi);var ft=class{constructor(t,a,o){this._isDeleted=!1,this._options={...t},this._config={...a},this._name=a.name,this._automaticDataCollectionEnabled=a.automaticDataCollectionEnabled,this._container=o,this.container.addComponent(new R("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw M.create("app-deleted",{appName:this._name})}};function bt(e,t={}){let a=e;typeof t!="object"&&(t={name:t});let o={name:ht,automaticDataCollectionEnabled:!0,...t},n=o.name;if(typeof n!="string"||!n)throw M.create("bad-app-name",{appName:String(n)});if(a||(a=nt()),!a)throw M.create("no-options");let i=Re.get(n);if(i)if(Se(a,i.options)){if(Se(o,i.config))return i;throw M.create("duplicate-app",{appName:n,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(o)})}else throw M.create("duplicate-app",{appName:n,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(a)});let s=new Ce(n);for(let l of pt.values())s.addComponent(l);let r=new ft(a,o,s);return Re.set(n,r),r}function Oe(e=ht){let t=Re.get(e);if(!t&&e===ht&&nt())return bt();if(!t)throw M.create("no-app",{appName:e});return t}function q(e,t,a){let o=hi[e]??e;a&&(o+=`-${a}`);let n=o.match(/\s|\//),i=t.match(/\s|\//);if(n||i){let s=[`Unable to register library "${o}" with version "${t}":`];n&&s.push(`library name "${o}" contains illegal characters (whitespace or "/")`),n&&i&&s.push("and"),i&&s.push(`version name "${t}" contains illegal characters (whitespace or "/")`),z.warn(s.join(" "));return}B(new R(`${o}-version`,()=>({library:o,version:t}),"VERSION"))}var gi="firebase-heartbeat-database",yi=1,me="firebase-heartbeat-store",ut=null;function Ka(){return ut||(ut=Fa(gi,yi,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(me)}catch(a){console.warn(a)}}}}).catch(e=>{throw M.create("idb-open",{originalErrorMessage:e.message})})),ut}async function bi(e){try{let a=(await Ka()).transaction(me),o=await a.objectStore(me).get(Ja(e));return await a.done,o}catch(t){if(t instanceof L)z.warn(t.message);else{let a=M.create("idb-get",{originalErrorMessage:t?.message});z.warn(a.message)}}}async function Ba(e,t){try{let o=(await Ka()).transaction(me,"readwrite");await o.objectStore(me).put(t,Ja(e)),await o.done}catch(a){if(a instanceof L)z.warn(a.message);else{let o=M.create("idb-set",{originalErrorMessage:a?.message});z.warn(o.message)}}}function Ja(e){return`${e.name}!${e.options.appId}`}var ki=1024,wi=30,gt=class{constructor(t){this.container=t,this._heartbeatsCache=null;let a=this.container.getProvider("app").getImmediate();this._storage=new yt(a),this._heartbeatsCachePromise=this._storage.read().then(o=>(this._heartbeatsCache=o,o))}async triggerHeartbeat(){try{let a=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=Va();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(n=>n.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:a}),this._heartbeatsCache.heartbeats.length>wi){let n=xi(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(n,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){z.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let t=Va(),{heartbeatsToSend:a,unsentEntries:o}=vi(this._heartbeatsCache.heartbeats),n=at(JSON.stringify({version:2,heartbeats:a}));return this._heartbeatsCache.lastSentHeartbeatDate=t,o.length>0?(this._heartbeatsCache.heartbeats=o,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),n}catch(t){return z.warn(t),""}}};function Va(){return new Date().toISOString().substring(0,10)}function vi(e,t=ki){let a=[],o=e.slice();for(let n of e){let i=a.find(s=>s.agent===n.agent);if(i){if(i.dates.push(n.date),Ya(a)>t){i.dates.pop();break}}else if(a.push({agent:n.agent,dates:[n.date]}),Ya(a)>t){a.pop();break}o=o.slice(1)}return{heartbeatsToSend:a,unsentEntries:o}}var yt=class{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return de()?qa().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let a=await bi(this.app);return a?.heartbeats?a:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){let o=await this.read();return Ba(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??o.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){let o=await this.read();return Ba(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??o.lastSentHeartbeatDate,heartbeats:[...o.heartbeats,...t.heartbeats]})}else return}};function Ya(e){return at(JSON.stringify({version:2,heartbeats:e})).length}function xi(e){if(e.length===0)return-1;let t=0,a=e[0].date;for(let o=1;o<e.length;o++)e[o].date<a&&(a=e[o].date,t=o);return t}function _i(e){B(new R("platform-logger",t=>new dt(t),"PRIVATE")),B(new R("heartbeat",t=>new gt(t),"PRIVATE")),q(mt,Ga,e),q(mt,Ga,"esm2020"),q("fire-js","")}_i("");var Ei="firebase",Ai="13.3.0";q(Ei,Ai,"app");var vt=new Map,nn={activated:!1,tokenObservers:[]},Si={initialized:!1,enabled:!1};function _(e){return vt.get(e)||{...nn}}function Ti(e,t){return vt.set(e,t),vt.get(e)}function qe(){return Si}var on="https://content-firebaseappcheck.googleapis.com/v1";var Ci="exchangeRecaptchaEnterpriseToken",Ii="exchangeDebugToken",Xa={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},Ri=1440*60*1e3;var xt=class{constructor(t,a,o,n,i){if(this.operation=t,this.retryPolicy=a,this.getWaitDuration=o,this.lowerBound=n,this.upperBound=i,this.pending=null,this.nextErrorWaitInterval=n,n>i)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(t){this.stop();try{this.pending=new P,this.pending.promise.catch(a=>{}),await Oi(this.getNextRun(t)),this.pending.resolve(),await this.pending.promise,this.pending=new P,this.pending.promise.catch(a=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(a){this.retryPolicy(a)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(t){if(t)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{let a=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),a}}};function Oi(e){return new Promise(t=>{setTimeout(t,e)})}var Di={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},C=new X("appCheck","AppCheck",Di);function Qa(e=!1){return e?self.grecaptcha?.enterprise:self.grecaptcha}function At(e){if(!_(e).activated)throw C.create("use-before-activation",{appName:e.name})}function sn(e){let t=Math.round(e/1e3),a=Math.floor(t/(3600*24)),o=Math.floor((t-a*3600*24)/3600),n=Math.floor((t-a*3600*24-o*3600)/60),i=t-a*3600*24-o*3600-n*60,s="";return a&&(s+=De(a)+"d:"),o&&(s+=De(o)+"h:"),s+=De(n)+"m:"+De(i)+"s",s}function De(e){return e===0?"00":e>=10?e.toString():"0"+e}async function St({url:e,body:t},a){let o={"Content-Type":"application/json"},n=a.getImmediate({optional:!0});if(n){let d=await n.getHeartbeatsHeader();d&&(o["X-Firebase-Client"]=d)}let i={method:"POST",body:JSON.stringify(t),headers:o},s;try{s=await fetch(e,i)}catch(d){throw C.create("fetch-network-error",{originalErrorMessage:d?.message})}if(s.status!==200)throw C.create("fetch-status-error",{httpStatus:s.status});let r;try{r=await s.json()}catch(d){throw C.create("fetch-parse-error",{originalErrorMessage:d?.message})}let l=r.ttl.match(/^([\d.]+)(s)$/);if(!l||!l[2]||isNaN(Number(l[1])))throw C.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${r.ttl}`});let c=Number(l[1])*1e3,u=Date.now();return{token:r.token,expireTimeMillis:u+c,issuedAtTimeMillis:u}}function Pi(e,t){let{projectId:a,appId:o,apiKey:n}=e.options;return{url:`${on}/projects/${a}/apps/${o}:${Ci}?key=${n}`,body:{recaptcha_enterprise_token:t}}}function rn(e,t){let{projectId:a,appId:o,apiKey:n}=e.options;return{url:`${on}/projects/${a}/apps/${o}:${Ii}?key=${n}`,body:{debug_token:t}}}var ji="firebase-app-check-database",qi=1,pe="firebase-app-check-store",cn="debug-token",Pe=null;function ln(){return Pe||(Pe=new Promise((e,t)=>{try{let a=indexedDB.open(ji,qi);a.onsuccess=o=>{e(o.target.result)},a.onerror=o=>{t(C.create("storage-open",{originalErrorMessage:o.target.error?.message}))},a.onupgradeneeded=o=>{let n=o.target.result;switch(o.oldVersion){case 0:n.createObjectStore(pe,{keyPath:"compositeKey"})}}}catch(a){t(C.create("storage-open",{originalErrorMessage:a?.message}))}}),Pe)}function Ni(e){return dn(mn(e))}function Li(e,t){return un(mn(e),t)}function Mi(e){return un(cn,e)}function zi(){return dn(cn)}async function un(e,t){let o=(await ln()).transaction(pe,"readwrite"),i=o.objectStore(pe).put({compositeKey:e,value:t});return new Promise((s,r)=>{i.onsuccess=l=>{s()},o.onerror=l=>{r(C.create("storage-set",{originalErrorMessage:l.target.error?.message}))}})}async function dn(e){let a=(await ln()).transaction(pe,"readonly"),n=a.objectStore(pe).get(e);return new Promise((i,s)=>{n.onsuccess=r=>{let l=r.target.result;i(l?l.value:void 0)},a.onerror=r=>{s(C.create("storage-get",{originalErrorMessage:r.target.error?.message}))}})}function mn(e){return`${e.options.appId}-${e.name}`}var V=new W("@firebase/app-check");async function $i(e){if(de()){let t;try{t=await Ni(e)}catch(a){V.warn(`Failed to read token from IndexedDB. Error: ${a}`)}return t}}function kt(e,t){return de()?Li(e,t).catch(a=>{V.warn(`Failed to write token to IndexedDB. Error: ${a}`)}):Promise.resolve()}async function Hi(e){let t;try{t=await zi()}catch{}if(t)return t;{let a=crypto.randomUUID(),o=`To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${a}

`,n=e?.options.appId,i=e?.options.projectId;return i&&n?o+=`You can do so in the Firebase Console:
https://console.firebase.google.com/project/${i}/appcheck/apps?selectedAppId=${n}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${a} --project ${i} --app ${n}

`:o+=`You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`,o+=`Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`,console.log(o),Mi(a).catch(s=>V.warn(`Failed to persist debug token to IndexedDB. Error: ${s}`)),a}}function Tt(){return qe().enabled}async function Ct(){let e=qe();if(e.enabled&&e.token)return e.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function Ui(e){let t=ue(),a=qe();if(a.initialized=!0,typeof t.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&t.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;a.enabled=!0;let o=new P;a.token=o,typeof t.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?o.resolve(t.FIREBASE_APPCHECK_DEBUG_TOKEN):o.resolve(Hi(e))}var Fi={error:"UNKNOWN_ERROR"};function Gi(e){return Ae.encodeString(JSON.stringify(e),!1)}async function _t(e,t=!1,a=!1){let o=e.app;At(o);let n=_(o),i=n.token,s;if(i&&!ie(i)&&(n.token=void 0,i=void 0),!i){let c=await n.cachedTokenPromise;c&&(ie(c)?i=c:await kt(o,void 0))}if(!t&&i&&ie(i))return{token:i.token};let r=!1;if(Tt())try{let c=await Ct();n.exchangeTokenPromise||(n.exchangeTokenPromise=St(rn(o,c),e.heartbeatServiceProvider).finally(()=>{n.exchangeTokenPromise=void 0}),r=!0);let u=await n.exchangeTokenPromise;return await kt(o,u),n.token=u,{token:u.token}}catch(c){return c.code==="appCheck/throttled"||c.code==="appCheck/initial-throttle"?V.warn(c.message):a&&V.error(c),wt(c)}try{n.exchangeTokenPromise||(n.exchangeTokenPromise=n.provider.getToken().finally(()=>{n.exchangeTokenPromise=void 0}),r=!0),i=await _(o).exchangeTokenPromise}catch(c){c.code==="appCheck/throttled"||c.code==="appCheck/initial-throttle"?V.warn(c.message):a&&V.error(c),s=c}let l;return i?s?ie(i)?l={token:i.token,internalError:s}:l=wt(s):(l={token:i.token},n.token=i,await kt(o,i)):l=wt(s),r&&fn(o,l),l}async function Wi(e){let t=e.app;At(t);let{provider:a}=_(t);if(Tt()){let o=await Ct(),n=rn(t,o);n.body.limited_use=!0;let{token:i}=await St(n,e.heartbeatServiceProvider);return{token:i}}else{let{token:o}=await a.getToken(!0);return{token:o}}}function hn(e,t,a,o){let{app:n}=e,i=_(n),s={next:a,error:o,type:t};if(i.tokenObservers=[...i.tokenObservers,s],i.token&&ie(i.token)){let r=i.token;Promise.resolve().then(()=>{a({token:r.token}),en(e)}).catch(()=>{})}i.cachedTokenPromise.then(()=>en(e))}function pn(e,t){let a=_(e),o=a.tokenObservers.filter(n=>n.next!==t);o.length===0&&a.tokenRefresher&&a.tokenRefresher.isRunning()&&a.tokenRefresher.stop(),a.tokenObservers=o}function en(e){let{app:t}=e,a=_(t),o=a.tokenRefresher;o||(o=Bi(e),a.tokenRefresher=o),!o.isRunning()&&a.isTokenAutoRefreshEnabled&&o.start()}function Bi(e){let{app:t}=e;return new xt(async()=>{let a=_(t),o;if(a.token?o=await _t(e,!0):o=await _t(e),o.error)throw o.error;if(o.internalError)throw o.internalError},()=>!0,()=>{let a=_(t);if(a.token){let o=a.token.issuedAtTimeMillis+(a.token.expireTimeMillis-a.token.issuedAtTimeMillis)*.5+3e5,n=a.token.expireTimeMillis-300*1e3;return o=Math.min(o,n),Math.max(0,o-Date.now())}else return 0},Xa.RETRIAL_MIN_WAIT,Xa.RETRIAL_MAX_WAIT)}function fn(e,t){let a=_(e).tokenObservers;for(let o of a)try{o.type==="EXTERNAL"&&t.error!=null?o.error(t.error):o.next(t)}catch{}}function ie(e){return e.expireTimeMillis-Date.now()>0}function wt(e){return{token:Gi(Fi),error:e}}var Et=class{constructor(t,a){this.app=t,this.heartbeatServiceProvider=a}_delete(){let{tokenObservers:t}=_(this.app);for(let a of t)pn(this.app,a.next);return Promise.resolve()}};function Vi(e,t){return new Et(e,t)}function Yi(e){return{getToken:t=>_t(e,t),getLimitedUseToken:()=>Wi(e),addTokenListener:t=>hn(e,"INTERNAL",t),removeTokenListener:t=>pn(e.app,t)}}var Zi="@firebase/app-check",Ki="0.13.1";var Ji="https://www.google.com/recaptcha/enterprise.js";function Xi(e,t){let a=new P,o=_(e);o.reCAPTCHAState={initialized:a};let n=Qi(e),i=Qa(!0);return i?tn(e,t,i,n,a):as(()=>{let s=Qa(!0);if(!s)throw new Error("no recaptcha");tn(e,t,s,n,a)}),a.promise}function tn(e,t,a,o,n){a.ready(()=>{ts(e,t,a,o),n.resolve(a)})}function Qi(e){let t=`fire_app_check_${e.name}`,a=document.createElement("div");return a.id=t,a.style.display="none",document.body.appendChild(a),t}async function es(e){At(e);let a=await _(e).reCAPTCHAState.initialized.promise;return new Promise((o,n)=>{let i=_(e).reCAPTCHAState;a.ready(()=>{o(a.execute(i.widgetId,{action:"fire_app_check"}))})})}function ts(e,t,a,o){let n=a.render(o,{sitekey:t,size:"invisible",callback:()=>{_(e).reCAPTCHAState.succeeded=!0},"error-callback":()=>{_(e).reCAPTCHAState.succeeded=!1}}),i=_(e);i.reCAPTCHAState={...i.reCAPTCHAState,widgetId:n}}function as(e){let t=document.createElement("script");t.src=Ji+"?render=explicit",t.onload=e,document.head.appendChild(t)}var je=class e{constructor(t){this._siteKey=t,this._throttleData=null}async getToken(t=!1){os(this._throttleData);let a=await es(this._app).catch(n=>{throw C.create("recaptcha-error")});if(!_(this._app).reCAPTCHAState?.succeeded)throw C.create("recaptcha-error");let o;try{let n=Pi(this._app,a);t&&(n.body.limited_use=!0),o=await St(n,this._heartbeatServiceProvider)}catch(n){throw n.code?.includes("fetch-status-error")?(this._throttleData=ns(Number(n.customData?.httpStatus),this._throttleData),C.create("initial-throttle",{time:sn(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):n}return this._throttleData=null,o}initialize(t){this._app=t,this._heartbeatServiceProvider=he(t,"heartbeat"),Xi(t,this._siteKey).catch(()=>{})}isEqual(t){return t instanceof e?this._siteKey===t._siteKey:!1}};function ns(e,t){if(e===404||e===403)return{backoffCount:1,allowRequestsAfter:Date.now()+Ri,httpStatus:e};{let a=t?t.backoffCount:0,o=Na(a,1e3,2);return{backoffCount:a+1,allowRequestsAfter:Date.now()+o,httpStatus:e}}}function os(e){if(e&&Date.now()-e.allowRequestsAfter<=0)throw C.create("throttled",{time:sn(e.allowRequestsAfter-Date.now()),httpStatus:e.httpStatus})}function gn(e=Oe(),t){e=Te(e);let a=he(e,"app-check");if(qe().initialized||Ui(e),Tt()&&Ct().then(n=>{console.log(`Firebase App Check debug token: ${n}`)}),a.isInitialized()){let n=a.getImmediate(),i=a.getOptions();if(i&&!!i.isTokenAutoRefreshEnabled==!!t.isTokenAutoRefreshEnabled&&i.provider?.isEqual(t.provider))return n;throw C.create("already-initialized",{appName:e.name})}let o=a.initialize({options:t});return is(e,t.provider,t.isTokenAutoRefreshEnabled),_(e).isTokenAutoRefreshEnabled&&hn(o,"INTERNAL",()=>{}),o}function is(e,t,a=!1){let o=Ti(e,{...nn});o.activated=!0,o.provider=t,o.cachedTokenPromise=$i(e).then(n=>(n&&ie(n)&&(o.token=n,fn(e,{token:n.token})),n)),o.isTokenAutoRefreshEnabled=a&&e.automaticDataCollectionEnabled,!e.automaticDataCollectionEnabled&&a&&V.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),o.provider.initialize(e)}var ss="app-check",an="app-check-internal";function rs(){B(new R(ss,e=>{let t=e.getProvider("app").getImmediate(),a=e.getProvider("heartbeat");return Vi(t,a)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,a)=>{e.getProvider(an).initialize()})),B(new R(an,e=>{let t=e.getProvider("app-check").getImmediate();return Yi(t)},"PUBLIC").setInstantiationMode("EXPLICIT")),q(Zi,Ki)}rs();var yn="@firebase/ai",Pt="3.1.0";var se="AI",cs="global",ls="firebasevertexai.googleapis.com",Le="v1beta",bn=Pt,us="gl-js",ds="hybrid",ms=180*1e3,hs="gemini-3.5-flash-lite";var h=class e extends L{constructor(t,a,o){let n=se,i=`${n}/${t}`,s=`${n}: ${a} (${i})`;super(t,s),this.code=t,this.customErrorData=o,Error.captureStackTrace&&Error.captureStackTrace(this,e),Object.setPrototypeOf(this,e.prototype),this.toString=()=>s}};var kn=["user","model","function","system"];var An={HARM_SEVERITY_NEGLIGIBLE:"HARM_SEVERITY_NEGLIGIBLE",HARM_SEVERITY_LOW:"HARM_SEVERITY_LOW",HARM_SEVERITY_MEDIUM:"HARM_SEVERITY_MEDIUM",HARM_SEVERITY_HIGH:"HARM_SEVERITY_HIGH",HARM_SEVERITY_UNSUPPORTED:"HARM_SEVERITY_UNSUPPORTED"};var A={STOP:"STOP",MAX_TOKENS:"MAX_TOKENS",SAFETY:"SAFETY",RECITATION:"RECITATION",OTHER:"OTHER",BLOCKLIST:"BLOCKLIST",PROHIBITED_CONTENT:"PROHIBITED_CONTENT",SPII:"SPII",MALFORMED_FUNCTION_CALL:"MALFORMED_FUNCTION_CALL",IMAGE_SAFETY:"IMAGE_SAFETY",IMAGE_PROHIBITED_CONTENT:"IMAGE_PROHIBITED_CONTENT",IMAGE_OTHER:"IMAGE_OTHER",NO_IMAGE:"NO_IMAGE",IMAGE_RECITATION:"IMAGE_RECITATION",LANGUAGE:"LANGUAGE",UNEXPECTED_TOOL_CALL:"UNEXPECTED_TOOL_CALL",TOO_MANY_TOOL_CALLS:"TOO_MANY_TOOL_CALLS",MISSING_THOUGHT_SIGNATURE:"MISSING_THOUGHT_SIGNATURE",MALFORMED_RESPONSE:"MALFORMED_RESPONSE"};var T={PREFER_ON_DEVICE:"prefer_on_device",ONLY_ON_DEVICE:"only_on_device",ONLY_IN_CLOUD:"only_in_cloud",PREFER_IN_CLOUD:"prefer_in_cloud"},Y={ON_DEVICE:"on_device",IN_CLOUD:"in_cloud"};var m={ERROR:"error",REQUEST_ERROR:"request-error",RESPONSE_ERROR:"response-error",FETCH_ERROR:"fetch-error",SESSION_CLOSED:"session-closed",INVALID_CONTENT:"invalid-content",API_NOT_ENABLED:"api-not-enabled",ALREADY_INITIALIZED:"already-initialized",INVALID_SCHEMA:"invalid-schema",NO_API_KEY:"no-api-key",NO_APP_ID:"no-app-id",NO_MODEL:"no-model",NO_PROJECT_ID:"no-project-id",PARSE_FAILED:"parse-failed",UNSUPPORTED:"unsupported"};var H={AGENT_PLATFORM:"AGENT_PLATFORM",GOOGLE_AI:"GOOGLE_AI"};var Me=class{constructor(t){this.backendType=t}},te=class extends Me{constructor(){super(H.GOOGLE_AI)}_getModelPath(t,a){return`/${Le}/projects/${t}/${a}`}_getTemplatePath(t,a){return`/${Le}/projects/${t}/templates/${a}`}},ze=class extends Me{constructor(t){super(H.AGENT_PLATFORM),this.location=cs,t&&(this.location=t)}_getModelPath(t,a){return`/${Le}/projects/${t}/locations/${this.location}/${a}`}_getTemplatePath(t,a){return`/${Le}/projects/${t}/locations/${this.location}/templates/${a}`}};function ps(e){if(e instanceof te)return`${se}/googleai`;if(e instanceof ze)return`${se}/agentplatform/${e.location}`;throw new h(m.ERROR,`Invalid backend: ${JSON.stringify(e.backendType)}`)}function fs(e){let t=e.split("/");if(t[0]!==se)throw new h(m.ERROR,`Invalid instance identifier, unknown prefix '${t[0]}'`);switch(t[1]){case"agentplatform":let o=t[2];if(!o)throw new h(m.ERROR,`Invalid instance identifier, unknown location '${e}'`);return new ze(o);case"googleai":return new te;default:throw new h(m.ERROR,`Invalid instance identifier string: '${e}'`)}}var E=new W("@firebase/ai"),$;(function(e){e.UNAVAILABLE="unavailable",e.DOWNLOADABLE="downloadable",e.DOWNLOADING="downloading",e.AVAILABLE="available"})($||($={}));var Sn={type:"text",languages:["en"]},It=[Sn,{type:"image"}],Rt=[Sn],$e=class e{constructor(t,a,o){this.languageModelProvider=t,this.mode=a,this.downloadPromise=null,this.onDeviceParams={createOptions:{expectedInputs:It,expectedOutputs:Rt}},o&&(this.onDeviceParams=o,this.onDeviceParams.createOptions?(this.onDeviceParams.createOptions.expectedInputs||(this.onDeviceParams.createOptions.expectedInputs=It),this.onDeviceParams.createOptions.expectedOutputs||(this.onDeviceParams.createOptions.expectedOutputs=Rt)):this.onDeviceParams.createOptions={expectedInputs:It,expectedOutputs:Rt})}async isAvailable(t){if(!this.mode)return E.debug("On-device inference unavailable because mode is undefined."),!1;if(this.mode===T.ONLY_IN_CLOUD)return E.debug('On-device inference unavailable because mode is "only_in_cloud".'),!1;let a=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);if(this.mode===T.ONLY_ON_DEVICE){if(a===$.UNAVAILABLE)throw new h(m.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(a===$.DOWNLOADABLE||a===$.DOWNLOADING){E.debug("Waiting for download of LanguageModel to complete.");try{await this.downloadPromise}catch(o){throw new h(m.ERROR,o.message)}return!0}return!0}return a!==$.AVAILABLE?(E.debug(`On-device inference unavailable because availability is "${a}".`),!1):e.isOnDeviceRequest(t)?!0:(E.debug("On-device inference unavailable because request is incompatible."),!1)}async generateContent(t){let a=await this.createSession(),o=await Promise.all(t.contents.map(e.toLanguageModelMessage)),n=await a.prompt(o,this.onDeviceParams.promptOptions);return e.toResponse(n)}async generateContentStream(t){let a=await this.createSession(),o=await Promise.all(t.contents.map(e.toLanguageModelMessage)),n=a.promptStreaming(o,this.onDeviceParams.promptOptions);return e.toStreamResponse(n)}async countTokens(t){throw new h(m.REQUEST_ERROR,"Count Tokens is not yet available for on-device model.")}static isOnDeviceRequest(t){if(t.contents.length===0)return E.debug("Empty prompt rejected for on-device inference."),!1;for(let a of t.contents){if(a.parts.some(o=>"functionResponse"in o))return E.debug("Content with a function response part rejected for on-device inference."),!1;for(let o of a.parts)if("inlineData"in o&&o.inlineData&&e.SUPPORTED_MIME_TYPES.indexOf(o.inlineData.mimeType)===-1)return E.debug(`Unsupported mime type "${o.inlineData.mimeType}" rejected for on-device inference.`),!1}return!0}async downloadIfAvailable(t){let a=await this.languageModelProvider?.availability(this.onDeviceParams.createOptions);return(a===$.DOWNLOADABLE||a===$.DOWNLOADING)&&this.download(t),a}download(t){if(this.downloadPromise)return;let a={...this.onDeviceParams.createOptions};a&&!a.monitor&&t&&(a.monitor=o=>{o.addEventListener("downloadprogress",n=>{t(n.loaded)})}),this.downloadPromise=this.languageModelProvider?.create(a).finally(()=>{this.downloadPromise=null})}static async toLanguageModelMessage(t){let a=await Promise.all(t.parts.map(e.toLanguageModelMessageContent));return{role:e.toLanguageModelMessageRole(t.role),content:a}}static async toLanguageModelMessageContent(t){if("text"in t&&typeof t.text=="string")return{type:"text",value:t.text};if("inlineData"in t&&t.inlineData){let o=await(await fetch(`data:${t.inlineData.mimeType};base64,${t.inlineData.data}`)).blob();return{type:"image",value:await createImageBitmap(o)}}throw new h(m.REQUEST_ERROR,"Processing of this Part type is not currently supported.")}static toLanguageModelMessageRole(t){return t==="model"?"assistant":"user"}async createSession(){if(!this.languageModelProvider)throw new h(m.UNSUPPORTED,"Chrome AI requested for unsupported browser version.");let t=await this.languageModelProvider.create(this.onDeviceParams.createOptions);return this.oldSession&&this.oldSession.destroy(),this.oldSession=t,t}static toResponse(t){return{json:async()=>({candidates:[{content:{parts:[{text:t}]}}]})}}static toStreamResponse(t){let a=new TextEncoder;return{body:t.pipeThrough(new TransformStream({transform(o,n){let i=JSON.stringify({candidates:[{content:{role:"model",parts:[{text:o}]}}]});n.enqueue(a.encode(`data: ${i}

`))}}))}}};$e.SUPPORTED_MIME_TYPES=["image/jpeg","image/png"];function gs(e,t,a){let n=(t||ue()).LanguageModel;if(n&&e)return new $e(n,e,a)}var jt=class{constructor(t,a,o,n,i){this.app=t,this.backend=a,this.chromeAdapterFactory=i;let s=n?.getImmediate({optional:!0}),r=o?.getImmediate({optional:!0});this.auth=r||null,this.appCheck=s||null}_delete(){return Promise.resolve()}set options(t){this._options=t}get options(){return this._options}};function ys(e,{instanceIdentifier:t}){if(!t)throw new h(m.ERROR,"AIService instance identifier is undefined.");let a=fs(t),o=e.getProvider("app").getImmediate(),n=e.getProvider("auth-internal"),i=e.getProvider("app-check-internal");return new jt(o,a,n,i,gs)}function bs(e){if(e.app?.options?.apiKey)if(e.app?.options?.projectId){if(!e.app?.options?.appId)throw new h(m.NO_APP_ID,'The "appId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid app ID.')}else throw new h(m.NO_PROJECT_ID,'The "projectId" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid project ID.');else throw new h(m.NO_API_KEY,'The "apiKey" field is empty in the local Firebase config. Firebase AI requires this field to contain a valid API key.');let t={apiKey:e.app.options.apiKey,project:e.app.options.projectId,appId:e.app.options.appId,automaticDataCollectionEnabled:e.app.automaticDataCollectionEnabled,backend:e.backend};if(Za(e.app)&&e.app.settings.appCheckToken){let a=e.app.settings.appCheckToken;t.getAppCheckToken=()=>Promise.resolve({token:a})}else e.appCheck&&(e.options?.useLimitedUseAppCheckTokens?t.getAppCheckToken=()=>e.appCheck.getLimitedUseToken():t.getAppCheckToken=()=>e.appCheck.getToken());return e.auth&&(t.getAuthToken=()=>e.auth.getToken()),t}var qt=class e{constructor(t,a){this._apiSettings=bs(t),this.model=e.normalizeModelName(a,this._apiSettings.backend.backendType)}static normalizeModelName(t,a){return a===H.GOOGLE_AI?e.normalizeGoogleAIModelName(t):e.normalizeVertexAIModelName(t)}static normalizeGoogleAIModelName(t){return`models/${t}`}static normalizeVertexAIModelName(t){let a;return t.includes("/")?t.startsWith("models/")?a=`publishers/google/${t}`:a=t:a=`publishers/google/models/${t}`,a}};var ks="Timeout has expired.",Ot="AbortError",Nt=class{constructor(t){this.params=t}toString(){let t=new URL(this.baseUrl);return t.pathname=this.pathname,t.search=this.queryParams.toString(),t.toString()}get pathname(){return this.params.templateId?`${this.params.apiSettings.backend._getTemplatePath(this.params.apiSettings.project,this.params.templateId)}:${this.params.task}`:`${this.params.apiSettings.backend._getModelPath(this.params.apiSettings.project,this.params.model)}:${this.params.task}`}get baseUrl(){return this.params.singleRequestOptions?.baseUrl??`https://${ls}`}get queryParams(){let t=new URLSearchParams;return this.params.stream&&t.set("alt","sse"),t}};function ws(e){let t=[];return t.push(`${us}/${bn}`),t.push(`fire/${bn}`),(e.params.apiSettings.inferenceMode===T.PREFER_ON_DEVICE||e.params.apiSettings.inferenceMode===T.PREFER_IN_CLOUD)&&t.push(ds),t.join(" ")}async function vs(e){let t=new Headers;if(t.append("Content-Type","application/json"),t.append("x-goog-api-client",ws(e)),t.append("x-goog-api-key",e.params.apiSettings.apiKey),e.params.apiSettings.automaticDataCollectionEnabled&&t.append("X-Firebase-Appid",e.params.apiSettings.appId),e.params.apiSettings.getAppCheckToken){let a=await e.params.apiSettings.getAppCheckToken();a&&(t.append("X-Firebase-AppCheck",a.token),a.error&&E.warn(`Unable to obtain a valid App Check token: ${a.error.message}`))}if(e.params.apiSettings.getAuthToken){let a=await e.params.apiSettings.getAuthToken();a&&t.append("Authorization",`Firebase ${a.accessToken}`)}return t}async function $t(e,t){let a=new Nt(e),o,n=e.singleRequestOptions?.signal,i=e.singleRequestOptions?.timeout!=null&&e.singleRequestOptions.timeout>=0?e.singleRequestOptions.timeout:ms,s=new AbortController,r=setTimeout(()=>{s.abort(new DOMException(ks,Ot)),E.debug(`Aborting request to ${a} due to timeout (${i}ms)`)},i),l=AbortSignal.any(n?[n,s.signal]:[s.signal]);if(n&&n.aborted)throw clearTimeout(r),new DOMException(n.reason??"Aborted externally before fetch",Ot);try{let c={method:"POST",headers:await vs(a),signal:l,body:t};if(o=await fetch(a.toString(),c),!o.ok){let u="",d;try{let g=await o.json();u=g.error.message,g.error.details&&(u+=` ${JSON.stringify(g.error.details)}`,d=g.error.details)}catch{}throw o.status===403&&d&&d.some(g=>g.reason==="SERVICE_DISABLED")&&d.some(g=>g.links?.[0]?.description.includes("Google developers console API activation"))?new h(m.API_NOT_ENABLED,`The Firebase AI SDK requires the Firebase AI API ('firebasevertexai.googleapis.com') to be enabled in your Firebase project. Enable this API by visiting the Firebase Console at https://console.firebase.google.com/project/${a.params.apiSettings.project}/ailogic/ and clicking "Get started". If you enabled this API recently, wait a few minutes for the action to propagate to our systems and then retry.`,{status:o.status,statusText:o.statusText,errorDetails:d}):new h(m.FETCH_ERROR,`Error fetching from ${a}: [${o.status} ${o.statusText}] ${u}`,{status:o.status,statusText:o.statusText,errorDetails:d})}}catch(c){let u=c;throw c.code!==m.FETCH_ERROR&&c.code!==m.API_NOT_ENABLED&&c instanceof Error&&c.name!==Ot&&(u=new h(m.ERROR,`Error fetching from ${a.toString()}: ${c.message}`),u.stack=c.stack),u}finally{clearTimeout(r)}return o}function Ne(e){if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&E.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),Cn(e.candidates[0]))throw new h(m.RESPONSE_ERROR,`Response error: ${ee(e)}. Response body stored in error.response`,{response:e});return!0}else return!1}function N(e){return"type"in e&&e.type?e:e.text!==void 0?{...e,type:"text"}:e.inlineData!==void 0?{...e,type:"inlineData"}:e.functionCall!==void 0?{...e,type:"functionCall"}:e.functionResponse!==void 0?{...e,type:"functionResponse"}:e.fileData!==void 0?{...e,type:"fileData"}:e.executableCode!==void 0?{...e,type:"executableCode"}:e.codeExecutionResult!==void 0?{...e,type:"codeExecutionResult"}:e}function He(e,t=Y.IN_CLOUD){if(e.candidates?.[0]&&!e.candidates[0].hasOwnProperty("index")&&(e.candidates[0].index=0),e.candidates)for(let o of e.candidates)o.content?.parts&&(o.content.parts=o.content.parts.map(N));let a=xs(e);return a.inferenceSource=t,a}function xs(e){return e.text=()=>{if(Ne(e))return wn(e,t=>!("thought"in t&&t.thought));if(e.promptFeedback)throw new h(m.RESPONSE_ERROR,`Text not available. ${ee(e)}`,{response:e});return""},e.thoughtSummary=()=>{if(Ne(e)){let t=wn(e,a=>!!("thought"in a&&a.thought));return t===""?void 0:t}else if(e.promptFeedback)throw new h(m.RESPONSE_ERROR,`Thought summary not available. ${ee(e)}`,{response:e})},e.inlineDataParts=()=>{if(Ne(e))return _s(e);if(e.promptFeedback)throw new h(m.RESPONSE_ERROR,`Data not available. ${ee(e)}`,{response:e})},e.functionCalls=()=>{if(Ne(e))return Tn(e);if(e.promptFeedback)throw new h(m.RESPONSE_ERROR,`Function call not available. ${ee(e)}`,{response:e})},e}function wn(e,t){let a=[];if(e.candidates?.[0].content?.parts)for(let o of e.candidates?.[0].content?.parts){let n=N(o);n.type==="text"&&t(n)&&a.push(n.text)}return a.length>0?a.join(""):""}function Tn(e){if(!e)return;let t=[];if(e.candidates?.[0].content?.parts)for(let a of e.candidates?.[0].content?.parts){let o=N(a);o.type==="functionCall"&&t.push(o.functionCall)}if(t.length>0)return t}function _s(e){let t=[];if(e.candidates?.[0].content?.parts)for(let a of e.candidates?.[0].content?.parts){let o=N(a);o.type==="inlineData"&&t.push(o)}if(t.length>0)return t}var Es=[A.RECITATION,A.SAFETY,A.BLOCKLIST,A.PROHIBITED_CONTENT,A.SPII,A.MALFORMED_FUNCTION_CALL,A.IMAGE_SAFETY,A.IMAGE_PROHIBITED_CONTENT,A.IMAGE_OTHER,A.NO_IMAGE,A.IMAGE_RECITATION,A.LANGUAGE,A.UNEXPECTED_TOOL_CALL,A.TOO_MANY_TOOL_CALLS,A.MISSING_THOUGHT_SIGNATURE,A.MALFORMED_RESPONSE];function Cn(e){return!!e.finishReason&&Es.some(t=>t===e.finishReason)}function ee(e){let t="";if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)t+="Response was blocked",e.promptFeedback?.blockReason&&(t+=` due to ${e.promptFeedback.blockReason}`),e.promptFeedback?.blockReasonMessage&&(t+=`: ${e.promptFeedback.blockReasonMessage}`);else if(e.candidates?.[0]){let a=e.candidates[0];Cn(a)&&(t+=`Candidate was blocked due to ${a.finishReason}`,a.finishMessage&&(t+=`: ${a.finishMessage}`))}return t}function Ht(e){if(e!=null){if(typeof e=="string")return{role:"system",parts:[{type:"text",text:e}]};if(e.type==="text"||"text"in e&&typeof e.text=="string")return{role:"system",parts:[G(N(e))]};if(e.parts){let t=e.parts.map(a=>G(N(a)));return e.role?{...e,parts:t}:{role:"system",parts:t}}}}function fe(e){let t=[];if(typeof e=="string")t=[{type:"text",text:e}];else for(let a of e)typeof a=="string"?t.push({type:"text",text:a}):t.push(G(N(a)));return As(t)}function As(e){let t={role:"user",parts:[]},a=!1,o=!1;for(let n of e)n.type==="functionResponse"||"functionResponse"in n?o=!0:a=!0,t.parts.push(n);if(a&&o)throw new h(m.INVALID_CONTENT,"Within a single message, FunctionResponse cannot be mixed with other type of Part in the request for sending chat message.");if(!a&&!o)throw new h(m.INVALID_CONTENT,"No Content is provided for sending chat message.");return t}function Dt(e){let t;if(e.contents){let a=e;t={...a,contents:a.contents.map(o=>({...o,parts:o.parts?o.parts.map(N):[]}))}}else t={contents:[fe(e)]};return e.systemInstruction&&(t.systemInstruction=Ht(e.systemInstruction)),t}function Ss(e){return e.parts&&Array.isArray(e.parts)?{...e,parts:e.parts.map(Ut)}:e}function Ut(e){let t;if("type"in e){let{type:a,...o}=e;t=o}else t=e;return t.functionResponse&&(t={...t,functionResponse:Ss(t.functionResponse)}),t}function Ft(e){return e.parts?{...e,parts:e.parts.map(Ut)}:e}function In(e){return e==null||typeof e=="string"?e:"parts"in e&&Array.isArray(e.parts)?Ft(e):Ut(e)}function Rn(e){let t={...e};return t.contents&&(t.contents=t.contents.map(Ft)),t.systemInstruction&&(t.systemInstruction=In(t.systemInstruction)),t}function Ts(e){let t={...e};return t.contents&&(t.contents=t.contents.map(Ft)),t.systemInstruction&&(t.systemInstruction=In(t.systemInstruction)),t}function On(e){if(e.safetySettings?.forEach(t=>{if(t.method)throw new h(m.UNSUPPORTED,"SafetySetting.method is not supported in the the Gemini Developer API. Please remove this property.")}),e.generationConfig?.topK){let t=Math.round(e.generationConfig.topK);t!==e.generationConfig.topK&&(E.warn("topK in GenerationConfig has been rounded to the nearest integer to match the format for requests to the Gemini Developer API."),e.generationConfig.topK=t)}return e}function Gt(e){return{candidates:e.candidates?Is(e.candidates):void 0,promptFeedback:e.promptFeedback?Rs(e.promptFeedback):void 0,usageMetadata:e.usageMetadata}}function Cs(e,t){return{generateContentRequest:{model:t,...e}}}function Is(e){let t=[],a;return t&&e.forEach(o=>{let n;if(o.citationMetadata&&(n={citations:o.citationMetadata.citationSources}),o.safetyRatings&&(a=o.safetyRatings.map(s=>({...s,severity:s.severity??An.HARM_SEVERITY_UNSUPPORTED,probabilityScore:s.probabilityScore??0,severityScore:s.severityScore??0}))),o.content?.parts?.some(s=>"videoMetadata"in s&&s.videoMetadata))throw new h(m.UNSUPPORTED,"Part.videoMetadata is not supported in the Gemini Developer API. Please remove this property.");let i={index:o.index,content:o.content,finishReason:o.finishReason,finishMessage:o.finishMessage,safetyRatings:a,citationMetadata:n,groundingMetadata:o.groundingMetadata,urlContextMetadata:o.urlContextMetadata};t.push(i)}),t}function Rs(e){let t=[];return(e.safetyRatings??[]).forEach(o=>{t.push({category:o.category,probability:o.probability,severity:o.severity??An.HARM_SEVERITY_UNSUPPORTED,probabilityScore:o.probabilityScore??0,severityScore:o.severityScore??0,blocked:o.blocked})}),{blockReason:e.blockReason,safetyRatings:t,blockReasonMessage:e.blockReasonMessage}}var vn=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;async function Os(e,t,a){let o=e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=qs(o),[i,s]=n.tee(),{response:r,firstValue:l}=await Ds(s,t,a);return{stream:js(i,t,a),response:r,firstValue:l}}async function Ds(e,t,a){let[o,n]=e.tee(),i=o.getReader(),{value:s}=await i.read();return{firstValue:s,response:Ps(n,t,a)}}async function Ps(e,t,a){let o=[],n=e.getReader();for(;;){let{done:i,value:s}=await n.read();if(i){let r=Ns(o);return t.backend.backendType===H.GOOGLE_AI&&(r=Gt(r)),He(r,a)}o.push(s)}}async function*js(e,t,a){let o=e.getReader();for(;;){let{value:n,done:i}=await o.read();if(i)break;let s;t.backend.backendType===H.GOOGLE_AI?s=He(Gt(n),a):s=He(n,a);let r=s.candidates?.[0];!r?.content?.parts&&!r?.finishReason&&!r?.citationMetadata&&!r?.urlContextMetadata||(yield s)}}function qs(e){let t=e.getReader();return new ReadableStream({start(o){let n="";return i();function i(){return t.read().then(({value:s,done:r})=>{if(r){if(n.trim()){o.error(new h(m.PARSE_FAILED,"Failed to parse stream"));return}o.close();return}n+=s;let l=n.match(vn),c;for(;l;){try{c=JSON.parse(l[1])}catch{o.error(new h(m.PARSE_FAILED,`Error parsing JSON response: "${l[1]}`));return}o.enqueue(c),n=n.substring(l[0].length),l=n.match(vn)}return i()})}}})}function Ns(e){let a={promptFeedback:e[e.length-1]?.promptFeedback};for(let o of e)if(o.candidates)for(let n of o.candidates){let i=n.index||0;a.candidates||(a.candidates=[]),a.candidates[i]||(a.candidates[i]={index:n.index}),a.candidates[i].citationMetadata=n.citationMetadata,a.candidates[i].finishReason=n.finishReason,a.candidates[i].finishMessage=n.finishMessage,a.candidates[i].safetyRatings=n.safetyRatings,a.candidates[i].groundingMetadata=n.groundingMetadata;let s=n.urlContextMetadata;if(typeof s=="object"&&s!==null&&Object.keys(s).length>0&&(a.candidates[i].urlContextMetadata=s),n.content){if(!n.content.parts)continue;a.candidates[i].content||(a.candidates[i].content={role:n.content.role||"user",parts:[]});for(let r of n.content.parts){if("text"in r&&r.text==="")continue;if(Object.keys(r).length===0)throw new h(m.INVALID_CONTENT,"Part should have at least one property, but there are none. This is likely caused by a malformed response from the backend.");let l=N({...r});Object.keys(l).length>0&&a.candidates[i].content.parts.push(l)}}}return a}var Ls=[m.FETCH_ERROR,m.ERROR,m.API_NOT_ENABLED];async function Dn(e,t,a,o){if(!t)return{response:await o(),inferenceSource:Y.IN_CLOUD};switch(t.mode){case T.ONLY_ON_DEVICE:if(await t.isAvailable(e))return{response:await a(),inferenceSource:Y.ON_DEVICE};throw new h(m.UNSUPPORTED,"Inference mode is ONLY_ON_DEVICE, but an on-device model is not available.");case T.ONLY_IN_CLOUD:return{response:await o(),inferenceSource:Y.IN_CLOUD};case T.PREFER_IN_CLOUD:try{return{response:await o(),inferenceSource:Y.IN_CLOUD}}catch(n){if(n instanceof h&&Ls.includes(n.code)&&await t.isAvailable(e))return{response:await a(),inferenceSource:Y.ON_DEVICE};throw n}case T.PREFER_ON_DEVICE:return await t.isAvailable(e)?{response:await a(),inferenceSource:Y.ON_DEVICE}:{response:await o(),inferenceSource:Y.IN_CLOUD};default:throw new h(m.ERROR,`Unexpected infererence mode: ${t.mode}`)}}async function Ms(e,t,a,o){return a=Rn(a),e.backend.backendType===H.GOOGLE_AI&&(a=On(a)),$t({task:"streamGenerateContent",model:t,apiSettings:e,stream:!0,singleRequestOptions:o},JSON.stringify(a))}async function Pn(e,t,a,o,n){let i=await Dn(a,o,()=>o.generateContentStream(a),()=>Ms(e,t,a,n));return Os(i.response,e,i.inferenceSource)}async function zs(e,t,a,o){return a=Rn(a),e.backend.backendType===H.GOOGLE_AI&&(a=On(a)),$t({model:t,task:"generateContent",apiSettings:e,stream:!1,singleRequestOptions:o},JSON.stringify(a))}async function jn(e,t,a,o,n){let i=await Dn(a,o,()=>o.generateContent(a),()=>zs(e,t,a,n)),s=await $s(i.response,e);return{response:He(s,i.inferenceSource)}}async function $s(e,t){let a=await e.json();return t.backend.backendType===H.GOOGLE_AI?Gt(a):a}var xn="SILENT_ERROR",_n=10,Lt=class{constructor(t,a,o){this.params=a,this.requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiSettings=t}async getHistory(){return await this._sendPromise,G(this._history).map(t=>({...t,parts:t.parts?t.parts.map(N):[]}))}async _sendMessage(t,a){let o={};await this._sendPromise;let n=[];return this._sendPromise=this._sendPromise.then(async()=>{let i,s=0,r=this.requestOptions?.maxSequentialFunctionCalls??_n;do{let l;if(i){s++;let d=await this._callFunctionsAsNeeded(i);l=fe(d)}else l=fe(t);let c=this._formatRequest(l,[...n]);n.push(l);let u=await this._callGenerateContent(c,a);if(u)if(o=u,i=this._getCallableFunctionCalls(u.response),u.response.candidates&&u.response.candidates.length>0){let d={parts:u.response.candidates?.[0].content.parts||[],role:u.response.candidates?.[0].content.role||"model"};n.push(G(d))}else{let d=ee(u.response);d&&E.warn(`sendMessage() was unsuccessful. ${d}. Inspect response object for details.`)}else i=void 0}while(i&&s<r);i&&s>=r&&E.warn(`Automatic function calling exceeded the limit of ${r} function calls. Returning last model response.`)}),await this._sendPromise,this._history=this._history.concat(n),o}async _sendMessageStream(t,a){await this._sendPromise;let o=[],i=(async()=>{let s,r=0,l=this.requestOptions?.maxSequentialFunctionCalls??_n,c;do{let u;if(s){r++;let g=await this._callFunctionsAsNeeded(s);u=fe(g)}else u=fe(t);let d=this._formatRequest(u,[...o]);if(o.push(u),c=await this._callGenerateContentStream(d,a),s=this._getCallableFunctionCalls(c.firstValue),s&&c.firstValue&&c.firstValue.candidates&&c.firstValue.candidates.length>0){let g={...c.firstValue.candidates[0].content};g.role||(g.role="model"),o.push(g)}}while(s&&r<l);return s&&r>=l&&E.warn(`Automatic function calling exceeded the limit of ${l} function calls. Returning last model response.`),{stream:c.stream,response:c.response}})();return this._sendPromise=this._sendPromise.then(async()=>i).catch(s=>{throw new Error(xn)}).then(s=>s.response).then(s=>{if(s.candidates&&s.candidates.length>0){this._history=this._history.concat(o);let r={...s.candidates[0].content};r.role||(r.role="model"),this._history.push(G(r))}else{let r=ee(s);r&&E.warn(`sendMessageStream() was unsuccessful. ${r}. Inspect response object for details.`)}}).catch(s=>{s.message!==xn&&s.name!=="AbortError"&&E.error(s)}),i}_getCallableFunctionCalls(t){let a=this.params?.tools?.find(n=>n.functionDeclarations);if(!a?.functionDeclarations)return;let o=Tn(t);if(o){for(let n of o)if(!a.functionDeclarations?.some(s=>s.name===n.name&&typeof s.functionReference=="function"))return;return o}}async _callFunctionsAsNeeded(t){let a=[],o=[],n=this.params?.tools?.find(i=>i.functionDeclarations);if(n&&n.functionDeclarations){for(let s of t){let r=n.functionDeclarations.find(l=>l.name===s.name);if(r?.functionReference){let l=Promise.resolve(r.functionReference(s.args)).catch(c=>{let u=new h(m.ERROR,`Error in user-defined function "${r.name}": ${c.message}`);throw u.stack=c.stack,u});a.push({name:s.name,id:s.id,results:l}),o.push(l)}}await Promise.all(o);let i=[];for(let{name:s,id:r,results:l}of a){let c={name:s,response:await l};r&&(c.id=r),i.push({type:"functionResponse",functionResponse:c})}return i}else throw new h(m.REQUEST_ERROR,'No function declarations were provided in "tools".')}};var Hs=["text","inlineData","functionCall","functionResponse","thought","thoughtSignature"],Us={user:["text","inlineData","functionResponse"],function:["functionResponse"],model:["text","functionCall","thought","thoughtSignature"],system:["text"]},En={user:["model"],function:["model"],model:["user","function"],system:[]};function Fs(e){let t=null;for(let a of e){let{role:o,parts:n}=a;if(!t&&o!=="user")throw new h(m.INVALID_CONTENT,`First Content should be with role 'user', got ${o}`);if(!kn.includes(o))throw new h(m.INVALID_CONTENT,`Each item should include role field. Got ${o} but valid roles are: ${JSON.stringify(kn)}`);if(!Array.isArray(n))throw new h(m.INVALID_CONTENT,"Content should have 'parts' property with an array of Parts");if(n.length===0)throw new h(m.INVALID_CONTENT,"Each Content should have at least one part");let i={text:0,inlineData:0,functionCall:0,functionResponse:0,thought:0,thoughtSignature:0,fileData:0,executableCode:0,codeExecutionResult:0};for(let r of n){if(r.type)i[r.type]+=1;else for(let l of["text","inlineData","functionCall","functionResponse","fileData","executableCode","codeExecutionResult"])l in r&&(i[l]+=1);"thought"in r&&r.thought&&(i.thought+=1),"thoughtSignature"in r&&r.thoughtSignature&&(i.thoughtSignature+=1)}let s=Us[o];for(let r of Hs)if(!s.includes(r)&&i[r]>0)throw new h(m.INVALID_CONTENT,`Content with role '${o}' can't contain '${r}' part`);if(t&&!En[o].includes(t.role))throw new h(m.INVALID_CONTENT,`Content with role '${o}' can't follow '${t.role}'. Valid previous roles: ${JSON.stringify(En)}`);t=a}}var Mt=class extends Lt{constructor(t,a,o,n,i){super(t,n,i),this.model=a,this.chromeAdapter=o,this.params=n,this.requestOptions=i,n?.history&&(Fs(n.history),this._history=G(n.history)),this.params?.systemInstruction!=null&&(this.params={...this.params,systemInstruction:Ht(this.params.systemInstruction)})}_formatRequest(t,a){return{safetySettings:this.params?.safetySettings,generationConfig:this.params?.generationConfig,tools:this.params?.tools,toolConfig:this.params?.toolConfig,systemInstruction:this.params?.systemInstruction,contents:[...this._history,...a,t]}}_callGenerateContent(t,a){return jn(this._apiSettings,this.model,t,this.chromeAdapter,{...this.requestOptions,...a})}_callGenerateContentStream(t,a){return Pn(this._apiSettings,this.model,t,this.chromeAdapter,{...this.requestOptions,...a})}async sendMessage(t,a){return this._sendMessage(t,a)}async sendMessageStream(t,a){return this._sendMessageStream(t,a)}};async function Gs(e,t,a,o){a=Ts(a);let n="";if(e.backend.backendType===H.GOOGLE_AI){let s=Cs(a,t);n=JSON.stringify(s)}else n=JSON.stringify(a);return(await $t({model:t,task:"countTokens",apiSettings:e,stream:!1,singleRequestOptions:o},n)).json()}async function Ws(e,t,a,o,n){if(o?.mode===T.ONLY_ON_DEVICE)throw new h(m.UNSUPPORTED,"countTokens() is not supported for on-device models.");return Gs(e,t,a,n)}var zt=class extends qt{constructor(t,a,o,n){super(t,a.model),this.chromeAdapter=n,this.generationConfig=a.generationConfig||{},Bs(this.generationConfig),this.safetySettings=a.safetySettings||[],this.tools=a.tools,this.toolConfig=a.toolConfig,this.systemInstruction=Ht(a.systemInstruction),this.requestOptions=o||{}}async initializeDeviceModel(t){if(!this.chromeAdapter||this.chromeAdapter.mode===T.ONLY_IN_CLOUD)return;if(await this.chromeAdapter.downloadIfAvailable(t)===$.UNAVAILABLE){let o=new h(m.API_NOT_ENABLED,"Local LanguageModel API not available in this environment.");if(this.chromeAdapter.mode===T.ONLY_ON_DEVICE)throw o;E.debug(o.message)}await this.chromeAdapter.downloadPromise}async generateContent(t,a){let o=Dt(t);return jn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...o},this.chromeAdapter,{...this.requestOptions,...a})}async generateContentStream(t,a){let o=Dt(t),{stream:n,response:i}=await Pn(this._apiSettings,this.model,{generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,...o},this.chromeAdapter,{...this.requestOptions,...a});return{stream:n,response:i}}startChat(t){return new Mt(this._apiSettings,this.model,this.chromeAdapter,{tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,generationConfig:this.generationConfig,safetySettings:this.safetySettings,...t},this.requestOptions)}async countTokens(t,a){let o=Dt(t);return Ws(this._apiSettings,this.model,o,this.chromeAdapter,{...this.requestOptions,...a})}};function Bs(e){if(e.thinkingConfig?.thinkingBudget!=null&&e.thinkingConfig?.thinkingLevel)throw new h(m.UNSUPPORTED,"Cannot set both thinkingBudget and thinkingLevel in a config.");if(e.responseSchema!=null&&e.responseJsonSchema!=null)throw new h(m.UNSUPPORTED,"Cannot set both responseSchema and responseJsonSchema in a config.");if((e.responseSchema!=null||e.responseJsonSchema!=null)&&e.responseMimeType!=="application/json"&&e.responseMimeType!=="text/x.enum")throw new h(m.UNSUPPORTED,'responseMimeType must be set to "application/json" or "text/x.enum" if responseSchema or responseJsonSchema are set.')}var Vs="audio-processor",rc=`
  class AudioProcessor extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.targetSampleRate = options.processorOptions.targetSampleRate;
      // 'sampleRate' is a global variable available inside the AudioWorkletGlobalScope,
      // representing the native sample rate of the AudioContext.
      this.inputSampleRate = sampleRate;
    }

    /**
     * This method is called by the browser's audio engine for each block of audio data.
     * Input is a single input, with a single channel (input[0][0]).
     */
    process(inputs) {
      const input = inputs[0];
      if (input && input.length > 0 && input[0].length > 0) {
        const pcmData = input[0]; // Float32Array of raw audio samples.
        
        // Simple linear interpolation for resampling.
        const resampled = new Float32Array(Math.round(pcmData.length * this.targetSampleRate / this.inputSampleRate));
        const ratio = pcmData.length / resampled.length;
        for (let i = 0; i < resampled.length; i++) {
          resampled[i] = pcmData[Math.floor(i * ratio)];
        }

        // Convert Float32 (-1, 1) samples to Int16 (-32768, 32767)
        const resampledInt16 = new Int16Array(resampled.length);
        for (let i = 0; i < resampled.length; i++) {
          const sample = Math.max(-1, Math.min(1, resampled[i]));
          if (sample < 0) {
            resampledInt16[i] = sample * 32768;
          } else {
            resampledInt16[i] = sample * 32767;
          }
        }
        
        this.port.postMessage(resampledInt16);
      }
      // Return true to keep the processor alive and processing the next audio block.
      return true;
    }
  }

  // Register the processor with a name that can be used to instantiate it from the main thread.
  registerProcessor('${Vs}', AudioProcessor);
`;function qn(e=Oe(),t){e=Te(e);let a=he(e,se),o=t?.backend??new te,n=ps(o),i=a.getImmediate({identifier:n}),s=i.options;if(s){let r=t?.useLimitedUseAppCheckTokens,l=!!s.useLimitedUseAppCheckTokens;if(r!=null&&!!r!==l)throw new h(m.ALREADY_INITIALIZED,`getAI() has already been called for app "${e.name}" and this backend with useLimitedUseAppCheckTokens: ${l}. This option cannot be changed after the AI instance has been initialized. Pass the desired options to the first getAI() call for this app and backend, or omit useLimitedUseAppCheckTokens to reuse the existing instance.`);return i}return i.options={useLimitedUseAppCheckTokens:t?.useLimitedUseAppCheckTokens??!1},i}var Ys=["mode","onDeviceParams","inCloudParams"];function Ue(e,t,a){let o=t,n;if(o.mode){for(let r of Object.keys(t))Ys.includes(r)||E.warn(`When a hybrid inference mode is specified (mode is currently set to ${o.mode}), "${r}" cannot be configured at the top level. Configuration for in-cloud and on-device must be done separately in inCloudParams and onDeviceParams. Configuration values set outside of inCloudParams and onDeviceParams will be ignored.`);n=o.inCloudParams||{model:hs}}else n=t;if(!n.model)throw new h(m.NO_MODEL,"Must provide a model name. Example: getGenerativeModel({ model: 'my-model-name' })");let i=e.chromeAdapterFactory?.(o.mode,typeof window>"u"?void 0:window,o.onDeviceParams),s=new zt(e,n,a,i);return s._apiSettings.inferenceMode=o.mode,s}function Zs(){B(new R(se,ys,"PUBLIC").setMultipleInstances(!0)),q(yn,Pt),q(yn,Pt,"esm2020")}Zs();var Nn={apiKey:"AIzaSyAbSG59wFNc9zTtkVIePV5sYLeZvU9Rfew",authDomain:"forget-me-hybrid.firebaseapp.com",projectId:"forget-me-hybrid",storageBucket:"forget-me-hybrid.firebasestorage.app",messagingSenderId:"798434253190",appId:"1:798434253190:web:8c21bad2081942d239b407"},ge="6Le2wDMuAAAAANSUyebwEmxvOiSt5mbj0EwknS4N";var Ln=e=>e.normalize("NFKC").replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g," ").trim().toLowerCase();function Wt(e,t){if(!e)return!1;let a=Ln(e);return a.length>=8&&Ln(t).includes(a)}function Bt(e,t=80){let a=e.replace(/\r/g,"").split(/\n{1,}/).map(n=>n.replace(/\s+/g," ").trim()).filter(Boolean),o=[];for(let n of a)for(let i of n.match(/.+?(?:[.!?]+["')\]]*(?=\s|$)|$)/g)??[]){let s=i.trim();if(s.length>=2&&o.push(s),o.length>=t)return o}return o}var Vt=e=>e.map((t,a)=>`[${a+1}] ${t}`).join(`
`),Yt=(e,t)=>Number.isInteger(t)&&t>=1&&t<=e.length?e[t-1]:"";function Ks(e,t){return e.endsWith(t)?e.length===t.length||e[e.length-t.length-1]===".":!1}function Js(e,t){let a=e.length-t.length-2,o=e.lastIndexOf(".",a);return o===-1?e:e.slice(o+1)}function Zt(e,t,a){if(a.validHosts!==null){let n=a.validHosts;for(let i of n)if(Ks(t,i))return i}let o=0;if(t.startsWith("."))for(;o<t.length&&t[o]===".";)o+=1;return e.length===t.length-o?null:Js(t,e)}function Kt(e,t){return e.slice(0,-t.length-1)}function Fe(e,t){let a=0,o=e.length,n=!1;if(!t){if(e.startsWith("data:"))return null;for(;a<e.length&&e.charCodeAt(a)<=32;)a+=1;for(;o>a+1&&e.charCodeAt(o-1)<=32;)o-=1;if(e.charCodeAt(a)===47&&e.charCodeAt(a+1)===47)a+=2;else{let c=e.indexOf(":/",a);if(c!==-1){let u=c-a,d=e.charCodeAt(a),g=e.charCodeAt(a+1),x=e.charCodeAt(a+2),S=e.charCodeAt(a+3),k=e.charCodeAt(a+4);if(!(u===5&&d===104&&g===116&&x===116&&S===112&&k===115)){if(!(u===4&&d===104&&g===116&&x===116&&S===112)){if(!(u===3&&d===119&&g===115&&x===115)){if(!(u===2&&d===119&&g===115))for(let O=a;O<c;O+=1){let I=e.charCodeAt(O)|32;if(!(I>=97&&I<=122||I>=48&&I<=57||I===46||I===45||I===43))return null}}}}for(a=c+2;e.charCodeAt(a)===47;)a+=1}}let s=-1,r=-1,l=-1;for(let c=a;c<o;c+=1){let u=e.charCodeAt(c);if(u===35||u===47||u===63){o=c;break}else u===64?s=c:u===93?r=c:u===58?l=c:u>=65&&u<=90&&(n=!0)}if(s!==-1&&s>a&&s<o&&(a=s+1),e.charCodeAt(a)===91)return r!==-1?e.slice(a+1,r).toLowerCase():null;l!==-1&&l>a&&l<o&&(o=l)}for(;o>a+1&&e.charCodeAt(o-1)===46;)o-=1;let i=a!==0||o!==e.length?e.slice(a,o):e;return n?i.toLowerCase():i}function Xs(e){if(e.length<7||e.length>15)return!1;let t=0;for(let a=0;a<e.length;a+=1){let o=e.charCodeAt(a);if(o===46)t+=1;else if(o<48||o>57)return!1}return t===3&&e.charCodeAt(0)!==46&&e.charCodeAt(e.length-1)!==46}function Qs(e){if(e.length<3)return!1;let t=e.startsWith("[")?1:0,a=e.length;if(e[a-1]==="]"&&(a-=1),a-t>39)return!1;let o=!1;for(;t<a;t+=1){let n=e.charCodeAt(t);if(n===58)o=!0;else if(!(n>=48&&n<=57||n>=97&&n<=102||n>=65&&n<=90))return!1}return o}function Jt(e){return Qs(e)||Xs(e)}function Mn(e){return e>=97&&e<=122||e>=48&&e<=57||e>127}function Xt(e){if(e.length>255||e.length===0||!Mn(e.charCodeAt(0))&&e.charCodeAt(0)!==46&&e.charCodeAt(0)!==95)return!1;let t=-1,a=-1,o=e.length;for(let n=0;n<o;n+=1){let i=e.charCodeAt(n);if(i===46){if(n-t>64||a===46||a===45||a===95)return!1;t=n}else if(!(Mn(i)||i===45||i===95))return!1;a=i}return o-t-1<=63&&a!==45}function zn({allowIcannDomains:e=!0,allowPrivateDomains:t=!1,detectIp:a=!0,extractHostname:o=!0,mixedInputs:n=!0,validHosts:i=null,validateHostname:s=!0}){return{allowIcannDomains:e,allowPrivateDomains:t,detectIp:a,extractHostname:o,mixedInputs:n,validHosts:i,validateHostname:s}}var er=zn({});function Qt(e){return e===void 0?er:zn(e)}function ea(e,t){return t.length===e.length?"":e.slice(0,-t.length-1)}function ta(){return{domain:null,domainWithoutSuffix:null,hostname:null,isIcann:null,isIp:null,isPrivate:null,publicSuffix:null,subdomain:null}}function aa(e){e.domain=null,e.domainWithoutSuffix=null,e.hostname=null,e.isIcann=null,e.isIp=null,e.isPrivate=null,e.publicSuffix=null,e.subdomain=null}function na(e,t,a,o,n){let i=Qt(o);return typeof e!="string"||(i.extractHostname?i.mixedInputs?n.hostname=Fe(e,Xt(e)):n.hostname=Fe(e,!1):n.hostname=e,t===0||n.hostname===null)||i.detectIp&&(n.isIp=Jt(n.hostname),n.isIp)?n:i.validateHostname&&i.extractHostname&&!Xt(n.hostname)?(n.hostname=null,n):(a(n.hostname,i,n),t===2||n.publicSuffix===null||(n.domain=Zt(n.publicSuffix,n.hostname,i),t===3||n.domain===null)||(n.subdomain=ea(n.hostname,n.domain),t===4)||(n.domainWithoutSuffix=Kt(n.domain,n.publicSuffix)),n)}function oa(e,t,a){if(!t.allowPrivateDomains&&e.length>3){let o=e.length-1,n=e.charCodeAt(o),i=e.charCodeAt(o-1),s=e.charCodeAt(o-2),r=e.charCodeAt(o-3);if(n===109&&i===111&&s===99&&r===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="com",!0;if(n===103&&i===114&&s===111&&r===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="org",!0;if(n===117&&i===100&&s===101&&r===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="edu",!0;if(n===118&&i===111&&s===103&&r===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="gov",!0;if(n===116&&i===101&&s===110&&r===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="net",!0;if(n===101&&i===100&&s===46)return a.isIcann=!0,a.isPrivate=!1,a.publicSuffix="de",!0}return!1}var $n=(function(){let e=[1,{}],t=[2,{}],a=[0,{city:e}];return[0,{ck:[0,{www:e}],jp:[0,{kawasaki:a,kitakyushu:a,kobe:a,nagoya:a,sapporo:a,sendai:a,yokohama:a}],dev:[0,{hrsn:[0,{psl:[0,{wc:[0,{ignored:t,sub:[0,{ignored:t}]}]}]}]}]}]})(),Hn=(function(){let e=[1,{}],t=[2,{}],a=[1,{com:e,edu:e,gov:e,net:e,org:e}],o=[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e}],n=[0,{"*":t}],i=[2,{s:n}],s=[0,{relay:t}],r=[2,{id:t}],l=[1,{gov:e}],c=[0,{"transfer-webapp":t}],u=[0,{notebook:t,studio:t}],d=[0,{labeling:t,notebook:t,studio:t}],g=[0,{notebook:t}],x=[0,{labeling:t,notebook:t,"notebook-fips":t,studio:t}],S=[0,{notebook:t,"notebook-fips":t,studio:t,"studio-fips":t}],k=[0,{"*":e}],O=[1,{co:t}],I=[0,{objects:t}],ae=[2,{nodes:t}],ma=[0,{my:n}],K=[0,{s3:t,"s3-accesspoint":t,"s3-website":t}],ha=[0,{s3:t,"s3-accesspoint":t}],pa=[0,{direct:t}],F=[0,{"webview-assets":t}],J=[0,{vfs:t,"webview-assets":t}],ce=[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:K,s3:t,"s3-accesspoint":t,"s3-object-lambda":t,"s3-website":t,"aws-cloud9":F,cloud9:J}],ke=[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:ha,s3:t,"s3-accesspoint":t,"s3-object-lambda":t,"s3-website":t,"aws-cloud9":F,cloud9:J}],ne=[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:K,s3:t,"s3-accesspoint":t,"s3-object-lambda":t,"s3-website":t,"analytics-gateway":t,"aws-cloud9":F,cloud9:J}],oe=[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:K,s3:t,"s3-accesspoint":t,"s3-object-lambda":t,"s3-website":t}],we=[0,{s3:t,"s3-accesspoint":t,"s3-accesspoint-fips":t,"s3-fips":t,"s3-website":t}],fa=[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:we,s3:t,"s3-accesspoint":t,"s3-accesspoint-fips":t,"s3-fips":t,"s3-object-lambda":t,"s3-website":t,"aws-cloud9":F,cloud9:J}],ga=[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:we,s3:t,"s3-accesspoint":t,"s3-accesspoint-fips":t,"s3-deprecated":t,"s3-fips":t,"s3-object-lambda":t,"s3-website":t,"analytics-gateway":t,"aws-cloud9":F,cloud9:J}],co=[0,{s3:t,"s3-accesspoint":t,"s3-accesspoint-fips":t,"s3-fips":t}],ya=[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:co,s3:t,"s3-accesspoint":t,"s3-accesspoint-fips":t,"s3-fips":t,"s3-object-lambda":t,"s3-website":t}],y=[0,{auth:t}],ve=[0,{auth:t,"auth-fips":t}],ba=[0,{"auth-fips":t}],ka=[0,{apps:t}],Ye=[0,{paas:t}],wa=[2,{eu:t}],Ze=[0,{app:t}],Ke=[0,{site:t}],xe=[1,{com:e,edu:e,net:e,org:e}],Je=[0,{j:t}],va=[0,{dyn:t}],xa=[1,{co:e,com:e,edu:e,gov:e,net:e,org:e}],_a=[0,{p:t}],Ea=[0,{user:t}],Aa=[0,{shop:t}],le=[0,{cdn:t}],Xe=[0,{cust:t,reservd:t}],Sa=[0,{cust:t}],Qe=[0,{s3:t}],Ta=[1,{biz:e,com:e,edu:e,gov:e,info:e,net:e,org:e}],et=[0,{ipfs:t}],_e=[1,{framer:t}],Ca=[0,{forgot:t}],w=[1,{gs:e}],Ia=[0,{nes:e}],p=[1,{k12:e,cc:e,lib:e}],Ee=[1,{cc:e,lib:e}];return[0,{ac:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,drr:t,feedback:t,forms:t}],ad:e,ae:[1,{ac:e,co:e,gov:e,mil:e,net:e,org:e,sch:e}],aero:[1,{airline:e,airport:e,"accident-investigation":e,"accident-prevention":e,aerobatic:e,aeroclub:e,aerodrome:e,agents:e,"air-surveillance":e,"air-traffic-control":e,aircraft:e,airtraffic:e,ambulance:e,association:e,author:e,ballooning:e,broker:e,caa:e,cargo:e,catering:e,certification:e,championship:e,charter:e,civilaviation:e,club:e,conference:e,consultant:e,consulting:e,control:e,council:e,crew:e,design:e,dgca:e,educator:e,emergency:e,engine:e,engineer:e,entertainment:e,equipment:e,exchange:e,express:e,federation:e,flight:e,freight:e,fuel:e,gliding:e,government:e,groundhandling:e,group:e,hanggliding:e,homebuilt:e,insurance:e,journal:e,journalist:e,leasing:e,logistics:e,magazine:e,maintenance:e,marketplace:e,media:e,microlight:e,modelling:e,navigation:e,parachuting:e,paragliding:e,"passenger-association":e,pilot:e,press:e,production:e,recreation:e,repbody:e,res:e,research:e,rotorcraft:e,safety:e,scientist:e,services:e,show:e,skydiving:e,software:e,student:e,taxi:e,trader:e,trading:e,trainer:e,union:e,workinggroup:e,works:e}],af:a,ag:[1,{co:e,com:e,net:e,nom:e,org:e,obj:t}],ai:[1,{com:e,net:e,off:e,org:e,uwu:t,framer:t}],al:o,am:[1,{co:e,com:e,commune:e,net:e,org:e,radio:t}],ao:[1,{co:e,ed:e,edu:e,gov:e,gv:e,it:e,og:e,org:e,pb:e}],aq:e,ar:[1,{bet:e,com:e,coop:e,edu:e,gob:e,gov:e,int:e,mil:e,musica:e,mutual:e,net:e,org:e,seg:e,senasa:e,tur:e}],arpa:[1,{e164:e,home:e,"in-addr":e,ip6:e,iris:e,uri:e,urn:e}],as:l,asia:[1,{cloudns:t,daemon:t,dix:t}],at:[1,{ac:[1,{sth:e}],co:e,gv:e,or:e,funkfeuer:[0,{wien:t}],futurecms:[0,{"*":t,ex:n,in:n}],futurehosting:t,futuremailing:t,ortsinfo:[0,{ex:n,kunden:n}],biz:t,info:t,"123webseite":t,priv:t,myspreadshop:t,"12hp":t,"2ix":t,"4lima":t,"lima-city":t}],au:[1,{asn:e,com:[1,{cloudlets:[0,{mel:t}],myspreadshop:t}],edu:[1,{act:e,catholic:e,nsw:[1,{schools:e}],nt:e,qld:e,sa:e,tas:e,vic:e,wa:e}],gov:[1,{qld:e,sa:e,tas:e,vic:e,wa:e}],id:e,net:e,org:e,conf:e,oz:e,act:e,nsw:e,nt:e,qld:e,sa:e,tas:e,vic:e,wa:e}],aw:[1,{com:e}],ax:e,az:[1,{biz:e,co:e,com:e,edu:e,gov:e,info:e,int:e,mil:e,name:e,net:e,org:e,pp:e,pro:e}],ba:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,rs:t}],bb:[1,{biz:e,co:e,com:e,edu:e,gov:e,info:e,net:e,org:e,store:e,tv:e}],bd:k,be:[1,{ac:e,cloudns:t,webhosting:t,interhostsolutions:[0,{cloud:t}],kuleuven:[0,{ezproxy:t}],"123website":t,myspreadshop:t,transurl:n}],bf:l,bg:[1,{0:e,1:e,2:e,3:e,4:e,5:e,6:e,7:e,8:e,9:e,a:e,b:e,c:e,d:e,e,f:e,g:e,h:e,i:e,j:e,k:e,l:e,m:e,n:e,o:e,p:e,q:e,r:e,s:e,t:e,u:e,v:e,w:e,x:e,y:e,z:e,barsy:t}],bh:a,bi:[1,{co:e,com:e,edu:e,or:e,org:e}],biz:[1,{activetrail:t,"cloud-ip":t,cloudns:t,jozi:t,dyndns:t,"for-better":t,"for-more":t,"for-some":t,"for-the":t,selfip:t,webhop:t,orx:t,mmafan:t,myftp:t,"no-ip":t,dscloud:t}],bj:[1,{africa:e,agro:e,architectes:e,assur:e,avocats:e,co:e,com:e,eco:e,econo:e,edu:e,info:e,loisirs:e,money:e,net:e,org:e,ote:e,restaurant:e,resto:e,tourism:e,univ:e}],bm:a,bn:[1,{com:e,edu:e,gov:e,net:e,org:e,co:t}],bo:[1,{com:e,edu:e,gob:e,int:e,mil:e,net:e,org:e,tv:e,web:e,academia:e,agro:e,arte:e,blog:e,bolivia:e,ciencia:e,cooperativa:e,democracia:e,deporte:e,ecologia:e,economia:e,empresa:e,indigena:e,industria:e,info:e,medicina:e,movimiento:e,musica:e,natural:e,nombre:e,noticias:e,patria:e,plurinacional:e,politica:e,profesional:e,pueblo:e,revista:e,salud:e,tecnologia:e,tksat:e,transporte:e,wiki:e}],br:[1,{"9guacu":e,abc:e,adm:e,adv:e,agr:e,aju:e,am:e,anani:e,aparecida:e,app:e,arq:e,art:e,ato:e,b:e,barueri:e,belem:e,bet:e,bhz:e,bib:e,bio:e,blog:e,bmd:e,boavista:e,bsb:e,campinagrande:e,campinas:e,caxias:e,cim:e,cng:e,cnt:e,com:[1,{simplesite:t}],contagem:e,coop:e,coz:e,cri:e,cuiaba:e,curitiba:e,def:e,des:e,det:e,dev:e,ecn:e,eco:e,edu:e,emp:e,enf:e,eng:e,esp:e,etc:e,eti:e,far:e,feira:e,flog:e,floripa:e,fm:e,fnd:e,fortal:e,fot:e,foz:e,fst:e,g12:e,geo:e,ggf:e,goiania:e,gov:[1,{ac:e,al:e,am:e,ap:e,ba:e,ce:e,df:e,es:e,go:e,ma:e,mg:e,ms:e,mt:e,pa:e,pb:e,pe:e,pi:e,pr:e,rj:e,rn:e,ro:e,rr:e,rs:e,sc:e,se:e,sp:e,to:e}],gru:e,imb:e,ind:e,inf:e,jab:e,jampa:e,jdf:e,joinville:e,jor:e,jus:e,leg:[1,{ac:t,al:t,am:t,ap:t,ba:t,ce:t,df:t,es:t,go:t,ma:t,mg:t,ms:t,mt:t,pa:t,pb:t,pe:t,pi:t,pr:t,rj:t,rn:t,ro:t,rr:t,rs:t,sc:t,se:t,sp:t,to:t}],leilao:e,lel:e,log:e,londrina:e,macapa:e,maceio:e,manaus:e,maringa:e,mat:e,med:e,mil:e,morena:e,mp:e,mus:e,natal:e,net:e,niteroi:e,nom:k,not:e,ntr:e,odo:e,ong:e,org:e,osasco:e,palmas:e,poa:e,ppg:e,pro:e,psc:e,psi:e,pvh:e,qsl:e,radio:e,rec:e,recife:e,rep:e,ribeirao:e,rio:e,riobranco:e,riopreto:e,salvador:e,sampa:e,santamaria:e,santoandre:e,saobernardo:e,saogonca:e,seg:e,sjc:e,slg:e,slz:e,sorocaba:e,srv:e,taxi:e,tc:e,tec:e,teo:e,the:e,tmp:e,trd:e,tur:e,tv:e,udi:e,vet:e,vix:e,vlog:e,wiki:e,zlg:e}],bs:[1,{com:e,edu:e,gov:e,net:e,org:e,we:t}],bt:a,bv:e,bw:[1,{ac:e,co:e,gov:e,net:e,org:e}],by:[1,{gov:e,mil:e,com:e,of:e,mediatech:t}],bz:[1,{co:e,com:e,edu:e,gov:e,net:e,org:e,za:t,mydns:t,gsj:t}],ca:[1,{ab:e,bc:e,mb:e,nb:e,nf:e,nl:e,ns:e,nt:e,nu:e,on:e,pe:e,qc:e,sk:e,yk:e,gc:e,barsy:t,awdev:n,co:t,"no-ip":t,myspreadshop:t,box:t}],cat:e,cc:[1,{cleverapps:t,cloudns:t,ftpaccess:t,"game-server":t,myphotos:t,scrapping:t,twmail:t,csx:t,fantasyleague:t,spawn:[0,{instances:t}]}],cd:l,cf:e,cg:e,ch:[1,{square7:t,cloudns:t,cloudscale:[0,{cust:t,lpg:I,rma:I}],flow:[0,{ae:[0,{alp1:t}],appengine:t}],"linkyard-cloud":t,gotdns:t,dnsking:t,"123website":t,myspreadshop:t,firenet:[0,{"*":t,svc:n}],"12hp":t,"2ix":t,"4lima":t,"lima-city":t}],ci:[1,{ac:e,"xn--aroport-bya":e,a\u00E9roport:e,asso:e,co:e,com:e,ed:e,edu:e,go:e,gouv:e,int:e,net:e,or:e,org:e}],ck:k,cl:[1,{co:e,gob:e,gov:e,mil:e,cloudns:t}],cm:[1,{co:e,com:e,gov:e,net:e}],cn:[1,{ac:e,com:[1,{amazonaws:[0,{"cn-north-1":[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:K,s3:t,"s3-accesspoint":t,"s3-deprecated":t,"s3-object-lambda":t,"s3-website":t}],"cn-northwest-1":[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:ha,s3:t,"s3-accesspoint":t,"s3-object-lambda":t,"s3-website":t}],compute:n,airflow:[0,{"cn-north-1":n,"cn-northwest-1":n}],eb:[0,{"cn-north-1":t,"cn-northwest-1":t}],elb:n}],sagemaker:[0,{"cn-north-1":u,"cn-northwest-1":u}]}],edu:e,gov:e,mil:e,net:e,org:e,"xn--55qx5d":e,\u516C\u53F8:e,"xn--od0alg":e,\u7DB2\u7D61:e,"xn--io0a7i":e,\u7F51\u7EDC:e,ah:e,bj:e,cq:e,fj:e,gd:e,gs:e,gx:e,gz:e,ha:e,hb:e,he:e,hi:e,hk:e,hl:e,hn:e,jl:e,js:e,jx:e,ln:e,mo:e,nm:e,nx:e,qh:e,sc:e,sd:e,sh:[1,{as:t}],sn:e,sx:e,tj:e,tw:e,xj:e,xz:e,yn:e,zj:e,"canva-apps":t,canvasite:ma,myqnapcloud:t,quickconnect:pa}],co:[1,{com:e,edu:e,gov:e,mil:e,net:e,nom:e,org:e,carrd:t,crd:t,otap:n,leadpages:t,lpages:t,mypi:t,xmit:n,firewalledreplit:r,repl:r,supabase:t}],com:[1,{a2hosted:t,cpserver:t,adobeaemcloud:[2,{dev:n}],africa:t,airkitapps:t,"airkitapps-au":t,aivencloud:t,alibabacloudcs:t,kasserver:t,amazonaws:[0,{"af-south-1":ce,"ap-east-1":ke,"ap-northeast-1":ne,"ap-northeast-2":ne,"ap-northeast-3":ce,"ap-south-1":ne,"ap-south-2":oe,"ap-southeast-1":ne,"ap-southeast-2":ne,"ap-southeast-3":oe,"ap-southeast-4":oe,"ap-southeast-5":[0,{"execute-api":t,dualstack:K,s3:t,"s3-accesspoint":t,"s3-deprecated":t,"s3-object-lambda":t,"s3-website":t}],"ca-central-1":fa,"ca-west-1":[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:we,s3:t,"s3-accesspoint":t,"s3-accesspoint-fips":t,"s3-fips":t,"s3-object-lambda":t,"s3-website":t}],"eu-central-1":ne,"eu-central-2":oe,"eu-north-1":ke,"eu-south-1":ce,"eu-south-2":oe,"eu-west-1":[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:K,s3:t,"s3-accesspoint":t,"s3-deprecated":t,"s3-object-lambda":t,"s3-website":t,"analytics-gateway":t,"aws-cloud9":F,cloud9:J}],"eu-west-2":ke,"eu-west-3":ce,"il-central-1":[0,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:K,s3:t,"s3-accesspoint":t,"s3-object-lambda":t,"s3-website":t,"aws-cloud9":F,cloud9:[0,{vfs:t}]}],"me-central-1":oe,"me-south-1":ke,"sa-east-1":ce,"us-east-1":[2,{"execute-api":t,"emrappui-prod":t,"emrnotebooks-prod":t,"emrstudio-prod":t,dualstack:we,s3:t,"s3-accesspoint":t,"s3-accesspoint-fips":t,"s3-deprecated":t,"s3-fips":t,"s3-object-lambda":t,"s3-website":t,"analytics-gateway":t,"aws-cloud9":F,cloud9:J}],"us-east-2":ga,"us-gov-east-1":ya,"us-gov-west-1":ya,"us-west-1":fa,"us-west-2":ga,compute:n,"compute-1":n,airflow:[0,{"af-south-1":n,"ap-east-1":n,"ap-northeast-1":n,"ap-northeast-2":n,"ap-northeast-3":n,"ap-south-1":n,"ap-south-2":n,"ap-southeast-1":n,"ap-southeast-2":n,"ap-southeast-3":n,"ap-southeast-4":n,"ca-central-1":n,"ca-west-1":n,"eu-central-1":n,"eu-central-2":n,"eu-north-1":n,"eu-south-1":n,"eu-south-2":n,"eu-west-1":n,"eu-west-2":n,"eu-west-3":n,"il-central-1":n,"me-central-1":n,"me-south-1":n,"sa-east-1":n,"us-east-1":n,"us-east-2":n,"us-west-1":n,"us-west-2":n}],s3:t,"s3-1":t,"s3-ap-east-1":t,"s3-ap-northeast-1":t,"s3-ap-northeast-2":t,"s3-ap-northeast-3":t,"s3-ap-south-1":t,"s3-ap-southeast-1":t,"s3-ap-southeast-2":t,"s3-ca-central-1":t,"s3-eu-central-1":t,"s3-eu-north-1":t,"s3-eu-west-1":t,"s3-eu-west-2":t,"s3-eu-west-3":t,"s3-external-1":t,"s3-fips-us-gov-east-1":t,"s3-fips-us-gov-west-1":t,"s3-global":[0,{accesspoint:[0,{mrap:t}]}],"s3-me-south-1":t,"s3-sa-east-1":t,"s3-us-east-2":t,"s3-us-gov-east-1":t,"s3-us-gov-west-1":t,"s3-us-west-1":t,"s3-us-west-2":t,"s3-website-ap-northeast-1":t,"s3-website-ap-southeast-1":t,"s3-website-ap-southeast-2":t,"s3-website-eu-west-1":t,"s3-website-sa-east-1":t,"s3-website-us-east-1":t,"s3-website-us-gov-west-1":t,"s3-website-us-west-1":t,"s3-website-us-west-2":t,elb:n}],amazoncognito:[0,{"af-south-1":y,"ap-east-1":y,"ap-northeast-1":y,"ap-northeast-2":y,"ap-northeast-3":y,"ap-south-1":y,"ap-south-2":y,"ap-southeast-1":y,"ap-southeast-2":y,"ap-southeast-3":y,"ap-southeast-4":y,"ap-southeast-5":y,"ca-central-1":y,"ca-west-1":y,"eu-central-1":y,"eu-central-2":y,"eu-north-1":y,"eu-south-1":y,"eu-south-2":y,"eu-west-1":y,"eu-west-2":y,"eu-west-3":y,"il-central-1":y,"me-central-1":y,"me-south-1":y,"sa-east-1":y,"us-east-1":ve,"us-east-2":ve,"us-gov-east-1":ba,"us-gov-west-1":ba,"us-west-1":ve,"us-west-2":ve}],amplifyapp:t,awsapprunner:n,awsapps:t,elasticbeanstalk:[2,{"af-south-1":t,"ap-east-1":t,"ap-northeast-1":t,"ap-northeast-2":t,"ap-northeast-3":t,"ap-south-1":t,"ap-southeast-1":t,"ap-southeast-2":t,"ap-southeast-3":t,"ca-central-1":t,"eu-central-1":t,"eu-north-1":t,"eu-south-1":t,"eu-west-1":t,"eu-west-2":t,"eu-west-3":t,"il-central-1":t,"me-south-1":t,"sa-east-1":t,"us-east-1":t,"us-east-2":t,"us-gov-east-1":t,"us-gov-west-1":t,"us-west-1":t,"us-west-2":t}],awsglobalaccelerator:t,siiites:t,appspacehosted:t,appspaceusercontent:t,"on-aptible":t,myasustor:t,"balena-devices":t,boutir:t,bplaced:t,cafjs:t,"canva-apps":t,"cdn77-storage":t,br:t,cn:t,de:t,eu:t,jpn:t,mex:t,ru:t,sa:t,uk:t,us:t,za:t,"clever-cloud":[0,{services:n}],dnsabr:t,"ip-ddns":t,jdevcloud:t,wpdevcloud:t,"cf-ipfs":t,"cloudflare-ipfs":t,trycloudflare:t,co:t,devinapps:n,builtwithdark:t,datadetect:[0,{demo:t,instance:t}],dattolocal:t,dattorelay:t,dattoweb:t,mydatto:t,digitaloceanspaces:n,discordsays:t,discordsez:t,drayddns:t,dreamhosters:t,durumis:t,mydrobo:t,blogdns:t,cechire:t,dnsalias:t,dnsdojo:t,doesntexist:t,dontexist:t,doomdns:t,"dyn-o-saur":t,dynalias:t,"dyndns-at-home":t,"dyndns-at-work":t,"dyndns-blog":t,"dyndns-free":t,"dyndns-home":t,"dyndns-ip":t,"dyndns-mail":t,"dyndns-office":t,"dyndns-pics":t,"dyndns-remote":t,"dyndns-server":t,"dyndns-web":t,"dyndns-wiki":t,"dyndns-work":t,"est-a-la-maison":t,"est-a-la-masion":t,"est-le-patron":t,"est-mon-blogueur":t,"from-ak":t,"from-al":t,"from-ar":t,"from-ca":t,"from-ct":t,"from-dc":t,"from-de":t,"from-fl":t,"from-ga":t,"from-hi":t,"from-ia":t,"from-id":t,"from-il":t,"from-in":t,"from-ks":t,"from-ky":t,"from-ma":t,"from-md":t,"from-mi":t,"from-mn":t,"from-mo":t,"from-ms":t,"from-mt":t,"from-nc":t,"from-nd":t,"from-ne":t,"from-nh":t,"from-nj":t,"from-nm":t,"from-nv":t,"from-oh":t,"from-ok":t,"from-or":t,"from-pa":t,"from-pr":t,"from-ri":t,"from-sc":t,"from-sd":t,"from-tn":t,"from-tx":t,"from-ut":t,"from-va":t,"from-vt":t,"from-wa":t,"from-wi":t,"from-wv":t,"from-wy":t,getmyip:t,gotdns:t,"hobby-site":t,homelinux:t,homeunix:t,iamallama:t,"is-a-anarchist":t,"is-a-blogger":t,"is-a-bookkeeper":t,"is-a-bulls-fan":t,"is-a-caterer":t,"is-a-chef":t,"is-a-conservative":t,"is-a-cpa":t,"is-a-cubicle-slave":t,"is-a-democrat":t,"is-a-designer":t,"is-a-doctor":t,"is-a-financialadvisor":t,"is-a-geek":t,"is-a-green":t,"is-a-guru":t,"is-a-hard-worker":t,"is-a-hunter":t,"is-a-landscaper":t,"is-a-lawyer":t,"is-a-liberal":t,"is-a-libertarian":t,"is-a-llama":t,"is-a-musician":t,"is-a-nascarfan":t,"is-a-nurse":t,"is-a-painter":t,"is-a-personaltrainer":t,"is-a-photographer":t,"is-a-player":t,"is-a-republican":t,"is-a-rockstar":t,"is-a-socialist":t,"is-a-student":t,"is-a-teacher":t,"is-a-techie":t,"is-a-therapist":t,"is-an-accountant":t,"is-an-actor":t,"is-an-actress":t,"is-an-anarchist":t,"is-an-artist":t,"is-an-engineer":t,"is-an-entertainer":t,"is-certified":t,"is-gone":t,"is-into-anime":t,"is-into-cars":t,"is-into-cartoons":t,"is-into-games":t,"is-leet":t,"is-not-certified":t,"is-slick":t,"is-uberleet":t,"is-with-theband":t,"isa-geek":t,"isa-hockeynut":t,issmarterthanyou:t,"likes-pie":t,likescandy:t,"neat-url":t,"saves-the-whales":t,selfip:t,"sells-for-less":t,"sells-for-u":t,servebbs:t,"simple-url":t,"space-to-rent":t,"teaches-yoga":t,writesthisblog:t,ddnsfree:t,ddnsgeek:t,giize:t,gleeze:t,kozow:t,loseyourip:t,ooguy:t,theworkpc:t,mytuleap:t,"tuleap-partners":t,encoreapi:t,evennode:[0,{"eu-1":t,"eu-2":t,"eu-3":t,"eu-4":t,"us-1":t,"us-2":t,"us-3":t,"us-4":t}],onfabrica:t,"fastly-edge":t,"fastly-terrarium":t,"fastvps-server":t,mydobiss:t,firebaseapp:t,fldrv:t,forgeblocks:t,framercanvas:t,"freebox-os":t,freeboxos:t,freemyip:t,aliases121:t,gentapps:t,gentlentapis:t,githubusercontent:t,"0emm":n,appspot:[2,{r:n}],blogspot:t,codespot:t,googleapis:t,googlecode:t,pagespeedmobilizer:t,withgoogle:t,withyoutube:t,grayjayleagues:t,hatenablog:t,hatenadiary:t,herokuapp:t,gr:t,smushcdn:t,wphostedmail:t,wpmucdn:t,pixolino:t,"apps-1and1":t,"live-website":t,dopaas:t,"hosted-by-previder":Ye,hosteur:[0,{"rag-cloud":t,"rag-cloud-ch":t}],"ik-server":[0,{jcloud:t,"jcloud-ver-jpc":t}],jelastic:[0,{demo:t}],massivegrid:Ye,wafaicloud:[0,{jed:t,ryd:t}],webadorsite:t,joyent:[0,{cns:n}],lpusercontent:t,linode:[0,{members:t,nodebalancer:n}],linodeobjects:n,linodeusercontent:[0,{ip:t}],localtonet:t,lovableproject:t,barsycenter:t,barsyonline:t,modelscape:t,mwcloudnonprod:t,polyspace:t,mazeplay:t,miniserver:t,atmeta:t,fbsbx:ka,meteorapp:wa,routingthecloud:t,mydbserver:t,hostedpi:t,"mythic-beasts":[0,{caracal:t,customer:t,fentiger:t,lynx:t,ocelot:t,oncilla:t,onza:t,sphinx:t,vs:t,x:t,yali:t}],nospamproxy:[0,{cloud:[2,{o365:t}]}],"4u":t,nfshost:t,"3utilities":t,blogsyte:t,ciscofreak:t,damnserver:t,ddnsking:t,ditchyourip:t,dnsiskinky:t,dynns:t,geekgalaxy:t,"health-carereform":t,homesecuritymac:t,homesecuritypc:t,myactivedirectory:t,mysecuritycamera:t,myvnc:t,"net-freaks":t,onthewifi:t,point2this:t,quicksytes:t,securitytactics:t,servebeer:t,servecounterstrike:t,serveexchange:t,serveftp:t,servegame:t,servehalflife:t,servehttp:t,servehumour:t,serveirc:t,servemp3:t,servep2p:t,servepics:t,servequake:t,servesarcasm:t,stufftoread:t,unusualperson:t,workisboring:t,myiphost:t,observableusercontent:[0,{static:t}],simplesite:t,orsites:t,operaunite:t,"customer-oci":[0,{"*":t,oci:n,ocp:n,ocs:n}],oraclecloudapps:n,oraclegovcloudapps:n,"authgear-staging":t,authgearapps:t,skygearapp:t,outsystemscloud:t,ownprovider:t,pgfog:t,pagexl:t,gotpantheon:t,paywhirl:n,upsunapp:t,"postman-echo":t,prgmr:[0,{xen:t}],pythonanywhere:wa,qa2:t,"alpha-myqnapcloud":t,"dev-myqnapcloud":t,mycloudnas:t,mynascloud:t,myqnapcloud:t,qualifioapp:t,ladesk:t,qbuser:t,quipelements:n,rackmaze:t,"readthedocs-hosted":t,rhcloud:t,onrender:t,render:Ze,"subsc-pay":t,"180r":t,dojin:t,sakuratan:t,sakuraweb:t,x0:t,code:[0,{builder:n,"dev-builder":n,"stg-builder":n}],salesforce:[0,{platform:[0,{"code-builder-stg":[0,{test:[0,{"001":n}]}]}]}],logoip:t,scrysec:t,"firewall-gateway":t,myshopblocks:t,myshopify:t,shopitsite:t,"1kapp":t,appchizi:t,applinzi:t,sinaapp:t,vipsinaapp:t,streamlitapp:t,"try-snowplow":t,"playstation-cloud":t,myspreadshop:t,"w-corp-staticblitz":t,"w-credentialless-staticblitz":t,"w-staticblitz":t,"stackhero-network":t,stdlib:[0,{api:t}],strapiapp:[2,{media:t}],"streak-link":t,streaklinks:t,streakusercontent:t,"temp-dns":t,dsmynas:t,familyds:t,mytabit:t,taveusercontent:t,"tb-hosting":Ke,reservd:t,thingdustdata:t,"townnews-staging":t,typeform:[0,{pro:t}],hk:t,it:t,"deus-canvas":t,vultrobjects:n,wafflecell:t,hotelwithflight:t,"reserve-online":t,cprapid:t,pleskns:t,remotewd:t,wiardweb:[0,{pages:t}],wixsite:t,wixstudio:t,messwithdns:t,"woltlab-demo":t,wpenginepowered:[2,{js:t}],xnbay:[2,{u2:t,"u2-local":t}],yolasite:t}],coop:e,cr:[1,{ac:e,co:e,ed:e,fi:e,go:e,or:e,sa:e}],cu:[1,{com:e,edu:e,gob:e,inf:e,nat:e,net:e,org:e}],cv:[1,{com:e,edu:e,id:e,int:e,net:e,nome:e,org:e,publ:e}],cw:xe,cx:[1,{gov:e,cloudns:t,ath:t,info:t,assessments:t,calculators:t,funnels:t,paynow:t,quizzes:t,researched:t,tests:t}],cy:[1,{ac:e,biz:e,com:[1,{scaleforce:Je}],ekloges:e,gov:e,ltd:e,mil:e,net:e,org:e,press:e,pro:e,tm:e}],cz:[1,{contentproxy9:[0,{rsc:t}],realm:t,e4:t,co:t,metacentrum:[0,{cloud:n,custom:t}],muni:[0,{cloud:[0,{flt:t,usr:t}]}]}],de:[1,{bplaced:t,square7:t,com:t,cosidns:va,dnsupdater:t,"dynamisches-dns":t,"internet-dns":t,"l-o-g-i-n":t,ddnss:[2,{dyn:t,dyndns:t}],"dyn-ip24":t,dyndns1:t,"home-webserver":[2,{dyn:t}],"myhome-server":t,dnshome:t,fuettertdasnetz:t,isteingeek:t,istmein:t,lebtimnetz:t,leitungsen:t,traeumtgerade:t,frusky:n,goip:t,"xn--gnstigbestellen-zvb":t,g\u00FCnstigbestellen:t,"xn--gnstigliefern-wob":t,g\u00FCnstigliefern:t,"hs-heilbronn":[0,{it:[0,{pages:t,"pages-research":t}]}],"dyn-berlin":t,"in-berlin":t,"in-brb":t,"in-butter":t,"in-dsl":t,"in-vpn":t,iservschule:t,"mein-iserv":t,schulplattform:t,schulserver:t,"test-iserv":t,keymachine:t,"git-repos":t,"lcube-server":t,"svn-repos":t,barsy:t,webspaceconfig:t,"123webseite":t,rub:t,"ruhr-uni-bochum":[2,{noc:[0,{io:t}]}],logoip:t,"firewall-gateway":t,"my-gateway":t,"my-router":t,spdns:t,speedpartner:[0,{customer:t}],myspreadshop:t,"taifun-dns":t,"12hp":t,"2ix":t,"4lima":t,"lima-city":t,"dd-dns":t,"dray-dns":t,draydns:t,"dyn-vpn":t,dynvpn:t,"mein-vigor":t,"my-vigor":t,"my-wan":t,"syno-ds":t,"synology-diskstation":t,"synology-ds":t,uberspace:n,"virtual-user":t,virtualuser:t,"community-pro":t,diskussionsbereich:t}],dj:e,dk:[1,{biz:t,co:t,firm:t,reg:t,store:t,"123hjemmeside":t,myspreadshop:t}],dm:xa,do:[1,{art:e,com:e,edu:e,gob:e,gov:e,mil:e,net:e,org:e,sld:e,web:e}],dz:[1,{art:e,asso:e,com:e,edu:e,gov:e,net:e,org:e,pol:e,soc:e,tm:e}],ec:[1,{com:e,edu:e,fin:e,gob:e,gov:e,info:e,k12:e,med:e,mil:e,net:e,org:e,pro:e,base:t,official:t}],edu:[1,{rit:[0,{"git-pages":t}]}],ee:[1,{aip:e,com:e,edu:e,fie:e,gov:e,lib:e,med:e,org:e,pri:e,riik:e}],eg:[1,{ac:e,com:e,edu:e,eun:e,gov:e,info:e,me:e,mil:e,name:e,net:e,org:e,sci:e,sport:e,tv:e}],er:k,es:[1,{com:e,edu:e,gob:e,nom:e,org:e,"123miweb":t,myspreadshop:t}],et:[1,{biz:e,com:e,edu:e,gov:e,info:e,name:e,net:e,org:e}],eu:[1,{airkitapps:t,cloudns:t,dogado:[0,{jelastic:t}],barsy:t,spdns:t,transurl:n,diskstation:t}],fi:[1,{aland:e,dy:t,"xn--hkkinen-5wa":t,h\u00E4kkinen:t,iki:t,cloudplatform:[0,{fi:t}],datacenter:[0,{demo:t,paas:t}],kapsi:t,"123kotisivu":t,myspreadshop:t}],fj:[1,{ac:e,biz:e,com:e,gov:e,info:e,mil:e,name:e,net:e,org:e,pro:e}],fk:k,fm:[1,{com:e,edu:e,net:e,org:e,radio:t,user:n}],fo:e,fr:[1,{asso:e,com:e,gouv:e,nom:e,prd:e,tm:e,avoues:e,cci:e,greta:e,"huissier-justice":e,"en-root":t,"fbx-os":t,fbxos:t,"freebox-os":t,freeboxos:t,goupile:t,"123siteweb":t,"on-web":t,"chirurgiens-dentistes-en-france":t,dedibox:t,aeroport:t,avocat:t,chambagri:t,"chirurgiens-dentistes":t,"experts-comptables":t,medecin:t,notaires:t,pharmacien:t,port:t,veterinaire:t,myspreadshop:t,ynh:t}],ga:e,gb:e,gd:[1,{edu:e,gov:e}],ge:[1,{com:e,edu:e,gov:e,net:e,org:e,pvt:e,school:e}],gf:e,gg:[1,{co:e,net:e,org:e,botdash:t,kaas:t,stackit:t,panel:[2,{daemon:t}]}],gh:[1,{com:e,edu:e,gov:e,mil:e,org:e}],gi:[1,{com:e,edu:e,gov:e,ltd:e,mod:e,org:e}],gl:[1,{co:e,com:e,edu:e,net:e,org:e,biz:t}],gm:e,gn:[1,{ac:e,com:e,edu:e,gov:e,net:e,org:e}],gov:e,gp:[1,{asso:e,com:e,edu:e,mobi:e,net:e,org:e}],gq:e,gr:[1,{com:e,edu:e,gov:e,net:e,org:e,barsy:t,simplesite:t}],gs:e,gt:[1,{com:e,edu:e,gob:e,ind:e,mil:e,net:e,org:e}],gu:[1,{com:e,edu:e,gov:e,guam:e,info:e,net:e,org:e,web:e}],gw:e,gy:xa,hk:[1,{com:e,edu:e,gov:e,idv:e,net:e,org:e,"xn--ciqpn":e,\u4E2A\u4EBA:e,"xn--gmqw5a":e,\u500B\u4EBA:e,"xn--55qx5d":e,\u516C\u53F8:e,"xn--mxtq1m":e,\u653F\u5E9C:e,"xn--lcvr32d":e,\u654E\u80B2:e,"xn--wcvs22d":e,\u6559\u80B2:e,"xn--gmq050i":e,\u7B87\u4EBA:e,"xn--uc0atv":e,\u7D44\u7E54:e,"xn--uc0ay4a":e,\u7D44\u7EC7:e,"xn--od0alg":e,\u7DB2\u7D61:e,"xn--zf0avx":e,\u7DB2\u7EDC:e,"xn--mk0axi":e,\u7EC4\u7E54:e,"xn--tn0ag":e,\u7EC4\u7EC7:e,"xn--od0aq3b":e,\u7F51\u7D61:e,"xn--io0a7i":e,\u7F51\u7EDC:e,inc:t,ltd:t}],hm:e,hn:[1,{com:e,edu:e,gob:e,mil:e,net:e,org:e}],hr:[1,{com:e,from:e,iz:e,name:e,brendly:Aa}],ht:[1,{adult:e,art:e,asso:e,com:e,coop:e,edu:e,firm:e,gouv:e,info:e,med:e,net:e,org:e,perso:e,pol:e,pro:e,rel:e,shop:e,rt:t}],hu:[1,{2e3:e,agrar:e,bolt:e,casino:e,city:e,co:e,erotica:e,erotika:e,film:e,forum:e,games:e,hotel:e,info:e,ingatlan:e,jogasz:e,konyvelo:e,lakas:e,media:e,news:e,org:e,priv:e,reklam:e,sex:e,shop:e,sport:e,suli:e,szex:e,tm:e,tozsde:e,utazas:e,video:e}],id:[1,{ac:e,biz:e,co:e,desa:e,go:e,mil:e,my:e,net:e,or:e,ponpes:e,sch:e,web:e,zone:t}],ie:[1,{gov:e,myspreadshop:t}],il:[1,{ac:e,co:[1,{ravpage:t,mytabit:t,tabitorder:t}],gov:e,idf:e,k12:e,muni:e,net:e,org:e}],"xn--4dbrk0ce":[1,{"xn--4dbgdty6c":e,"xn--5dbhl8d":e,"xn--8dbq2a":e,"xn--hebda8b":e}],\u05D9\u05E9\u05E8\u05D0\u05DC:[1,{\u05D0\u05E7\u05D3\u05DE\u05D9\u05D4:e,\u05D9\u05E9\u05D5\u05D1:e,\u05E6\u05D4\u05DC:e,\u05DE\u05DE\u05E9\u05DC:e}],im:[1,{ac:e,co:[1,{ltd:e,plc:e}],com:e,net:e,org:e,tt:e,tv:e}],in:[1,{"5g":e,"6g":e,ac:e,ai:e,am:e,bihar:e,biz:e,business:e,ca:e,cn:e,co:e,com:e,coop:e,cs:e,delhi:e,dr:e,edu:e,er:e,firm:e,gen:e,gov:e,gujarat:e,ind:e,info:e,int:e,internet:e,io:e,me:e,mil:e,net:e,nic:e,org:e,pg:e,post:e,pro:e,res:e,travel:e,tv:e,uk:e,up:e,us:e,cloudns:t,barsy:t,web:t,supabase:t}],info:[1,{cloudns:t,"dynamic-dns":t,"barrel-of-knowledge":t,"barrell-of-knowledge":t,dyndns:t,"for-our":t,"groks-the":t,"groks-this":t,"here-for-more":t,knowsitall:t,selfip:t,webhop:t,barsy:t,mayfirst:t,mittwald:t,mittwaldserver:t,typo3server:t,dvrcam:t,ilovecollege:t,"no-ip":t,forumz:t,nsupdate:t,dnsupdate:t,"v-info":t}],int:[1,{eu:e}],io:[1,{2038:t,co:e,com:e,edu:e,gov:e,mil:e,net:e,nom:e,org:e,"on-acorn":n,myaddr:t,apigee:t,"b-data":t,beagleboard:t,bitbucket:t,bluebite:t,boxfuse:t,brave:i,browsersafetymark:t,bubble:le,bubbleapps:t,bigv:[0,{uk0:t}],cleverapps:t,cloudbeesusercontent:t,dappnode:[0,{dyndns:t}],darklang:t,definima:t,dedyn:t,"fh-muenster":t,shw:t,forgerock:[0,{id:t}],github:t,gitlab:t,lolipop:t,"hasura-app":t,hostyhosting:t,hypernode:t,moonscale:n,beebyte:Ye,beebyteapp:[0,{sekd1:t}],jele:t,webthings:t,loginline:t,barsy:t,azurecontainer:n,ngrok:[2,{ap:t,au:t,eu:t,in:t,jp:t,sa:t,us:t}],nodeart:[0,{stage:t}],pantheonsite:t,pstmn:[2,{mock:t}],protonet:t,qcx:[2,{sys:n}],qoto:t,vaporcloud:t,myrdbx:t,"rb-hosting":Ke,"on-k3s":n,"on-rio":n,readthedocs:t,resindevice:t,resinstaging:[0,{devices:t}],hzc:t,sandcats:t,scrypted:[0,{client:t}],"mo-siemens":t,lair:ka,stolos:n,musician:t,utwente:t,edugit:t,telebit:t,thingdust:[0,{dev:Xe,disrec:Xe,prod:Sa,testing:Xe}],tickets:t,webflow:t,webflowtest:t,editorx:t,wixstudio:t,basicserver:t,virtualserver:t}],iq:o,ir:[1,{ac:e,co:e,gov:e,id:e,net:e,org:e,sch:e,"xn--mgba3a4f16a":e,\u0627\u06CC\u0631\u0627\u0646:e,"xn--mgba3a4fra":e,\u0627\u064A\u0631\u0627\u0646:e,arvanedge:t}],is:e,it:[1,{edu:e,gov:e,abr:e,abruzzo:e,"aosta-valley":e,aostavalley:e,bas:e,basilicata:e,cal:e,calabria:e,cam:e,campania:e,"emilia-romagna":e,emiliaromagna:e,emr:e,"friuli-v-giulia":e,"friuli-ve-giulia":e,"friuli-vegiulia":e,"friuli-venezia-giulia":e,"friuli-veneziagiulia":e,"friuli-vgiulia":e,"friuliv-giulia":e,"friulive-giulia":e,friulivegiulia:e,"friulivenezia-giulia":e,friuliveneziagiulia:e,friulivgiulia:e,fvg:e,laz:e,lazio:e,lig:e,liguria:e,lom:e,lombardia:e,lombardy:e,lucania:e,mar:e,marche:e,mol:e,molise:e,piedmont:e,piemonte:e,pmn:e,pug:e,puglia:e,sar:e,sardegna:e,sardinia:e,sic:e,sicilia:e,sicily:e,taa:e,tos:e,toscana:e,"trentin-sud-tirol":e,"xn--trentin-sd-tirol-rzb":e,"trentin-s\xFCd-tirol":e,"trentin-sudtirol":e,"xn--trentin-sdtirol-7vb":e,"trentin-s\xFCdtirol":e,"trentin-sued-tirol":e,"trentin-suedtirol":e,trentino:e,"trentino-a-adige":e,"trentino-aadige":e,"trentino-alto-adige":e,"trentino-altoadige":e,"trentino-s-tirol":e,"trentino-stirol":e,"trentino-sud-tirol":e,"xn--trentino-sd-tirol-c3b":e,"trentino-s\xFCd-tirol":e,"trentino-sudtirol":e,"xn--trentino-sdtirol-szb":e,"trentino-s\xFCdtirol":e,"trentino-sued-tirol":e,"trentino-suedtirol":e,"trentinoa-adige":e,trentinoaadige:e,"trentinoalto-adige":e,trentinoaltoadige:e,"trentinos-tirol":e,trentinostirol:e,"trentinosud-tirol":e,"xn--trentinosd-tirol-rzb":e,"trentinos\xFCd-tirol":e,trentinosudtirol:e,"xn--trentinosdtirol-7vb":e,trentinos\u00FCdtirol:e,"trentinosued-tirol":e,trentinosuedtirol:e,"trentinsud-tirol":e,"xn--trentinsd-tirol-6vb":e,"trentins\xFCd-tirol":e,trentinsudtirol:e,"xn--trentinsdtirol-nsb":e,trentins\u00FCdtirol:e,"trentinsued-tirol":e,trentinsuedtirol:e,tuscany:e,umb:e,umbria:e,"val-d-aosta":e,"val-daosta":e,"vald-aosta":e,valdaosta:e,"valle-aosta":e,"valle-d-aosta":e,"valle-daosta":e,valleaosta:e,"valled-aosta":e,valledaosta:e,"vallee-aoste":e,"xn--valle-aoste-ebb":e,"vall\xE9e-aoste":e,"vallee-d-aoste":e,"xn--valle-d-aoste-ehb":e,"vall\xE9e-d-aoste":e,valleeaoste:e,"xn--valleaoste-e7a":e,vall\u00E9eaoste:e,valleedaoste:e,"xn--valledaoste-ebb":e,vall\u00E9edaoste:e,vao:e,vda:e,ven:e,veneto:e,ag:e,agrigento:e,al:e,alessandria:e,"alto-adige":e,altoadige:e,an:e,ancona:e,"andria-barletta-trani":e,"andria-trani-barletta":e,andriabarlettatrani:e,andriatranibarletta:e,ao:e,aosta:e,aoste:e,ap:e,aq:e,aquila:e,ar:e,arezzo:e,"ascoli-piceno":e,ascolipiceno:e,asti:e,at:e,av:e,avellino:e,ba:e,balsan:e,"balsan-sudtirol":e,"xn--balsan-sdtirol-nsb":e,"balsan-s\xFCdtirol":e,"balsan-suedtirol":e,bari:e,"barletta-trani-andria":e,barlettatraniandria:e,belluno:e,benevento:e,bergamo:e,bg:e,bi:e,biella:e,bl:e,bn:e,bo:e,bologna:e,bolzano:e,"bolzano-altoadige":e,bozen:e,"bozen-sudtirol":e,"xn--bozen-sdtirol-2ob":e,"bozen-s\xFCdtirol":e,"bozen-suedtirol":e,br:e,brescia:e,brindisi:e,bs:e,bt:e,bulsan:e,"bulsan-sudtirol":e,"xn--bulsan-sdtirol-nsb":e,"bulsan-s\xFCdtirol":e,"bulsan-suedtirol":e,bz:e,ca:e,cagliari:e,caltanissetta:e,"campidano-medio":e,campidanomedio:e,campobasso:e,"carbonia-iglesias":e,carboniaiglesias:e,"carrara-massa":e,carraramassa:e,caserta:e,catania:e,catanzaro:e,cb:e,ce:e,"cesena-forli":e,"xn--cesena-forl-mcb":e,"cesena-forl\xEC":e,cesenaforli:e,"xn--cesenaforl-i8a":e,cesenaforl\u00EC:e,ch:e,chieti:e,ci:e,cl:e,cn:e,co:e,como:e,cosenza:e,cr:e,cremona:e,crotone:e,cs:e,ct:e,cuneo:e,cz:e,"dell-ogliastra":e,dellogliastra:e,en:e,enna:e,fc:e,fe:e,fermo:e,ferrara:e,fg:e,fi:e,firenze:e,florence:e,fm:e,foggia:e,"forli-cesena":e,"xn--forl-cesena-fcb":e,"forl\xEC-cesena":e,forlicesena:e,"xn--forlcesena-c8a":e,forl\u00ECcesena:e,fr:e,frosinone:e,ge:e,genoa:e,genova:e,go:e,gorizia:e,gr:e,grosseto:e,"iglesias-carbonia":e,iglesiascarbonia:e,im:e,imperia:e,is:e,isernia:e,kr:e,"la-spezia":e,laquila:e,laspezia:e,latina:e,lc:e,le:e,lecce:e,lecco:e,li:e,livorno:e,lo:e,lodi:e,lt:e,lu:e,lucca:e,macerata:e,mantova:e,"massa-carrara":e,massacarrara:e,matera:e,mb:e,mc:e,me:e,"medio-campidano":e,mediocampidano:e,messina:e,mi:e,milan:e,milano:e,mn:e,mo:e,modena:e,monza:e,"monza-brianza":e,"monza-e-della-brianza":e,monzabrianza:e,monzaebrianza:e,monzaedellabrianza:e,ms:e,mt:e,na:e,naples:e,napoli:e,no:e,novara:e,nu:e,nuoro:e,og:e,ogliastra:e,"olbia-tempio":e,olbiatempio:e,or:e,oristano:e,ot:e,pa:e,padova:e,padua:e,palermo:e,parma:e,pavia:e,pc:e,pd:e,pe:e,perugia:e,"pesaro-urbino":e,pesarourbino:e,pescara:e,pg:e,pi:e,piacenza:e,pisa:e,pistoia:e,pn:e,po:e,pordenone:e,potenza:e,pr:e,prato:e,pt:e,pu:e,pv:e,pz:e,ra:e,ragusa:e,ravenna:e,rc:e,re:e,"reggio-calabria":e,"reggio-emilia":e,reggiocalabria:e,reggioemilia:e,rg:e,ri:e,rieti:e,rimini:e,rm:e,rn:e,ro:e,roma:e,rome:e,rovigo:e,sa:e,salerno:e,sassari:e,savona:e,si:e,siena:e,siracusa:e,so:e,sondrio:e,sp:e,sr:e,ss:e,"xn--sdtirol-n2a":e,s\u00FCdtirol:e,suedtirol:e,sv:e,ta:e,taranto:e,te:e,"tempio-olbia":e,tempioolbia:e,teramo:e,terni:e,tn:e,to:e,torino:e,tp:e,tr:e,"trani-andria-barletta":e,"trani-barletta-andria":e,traniandriabarletta:e,tranibarlettaandria:e,trapani:e,trento:e,treviso:e,trieste:e,ts:e,turin:e,tv:e,ud:e,udine:e,"urbino-pesaro":e,urbinopesaro:e,va:e,varese:e,vb:e,vc:e,ve:e,venezia:e,venice:e,verbania:e,vercelli:e,verona:e,vi:e,"vibo-valentia":e,vibovalentia:e,vicenza:e,viterbo:e,vr:e,vs:e,vt:e,vv:e,"12chars":t,ibxos:t,iliadboxos:t,neen:[0,{jc:t}],"123homepage":t,"16-b":t,"32-b":t,"64-b":t,myspreadshop:t,syncloud:t}],je:[1,{co:e,net:e,org:e,of:t}],jm:k,jo:[1,{agri:e,ai:e,com:e,edu:e,eng:e,fm:e,gov:e,mil:e,net:e,org:e,per:e,phd:e,sch:e,tv:e}],jobs:e,jp:[1,{ac:e,ad:e,co:e,ed:e,go:e,gr:e,lg:e,ne:[1,{aseinet:Ea,gehirn:t,ivory:t,"mail-box":t,mints:t,mokuren:t,opal:t,sakura:t,sumomo:t,topaz:t}],or:e,aichi:[1,{aisai:e,ama:e,anjo:e,asuke:e,chiryu:e,chita:e,fuso:e,gamagori:e,handa:e,hazu:e,hekinan:e,higashiura:e,ichinomiya:e,inazawa:e,inuyama:e,isshiki:e,iwakura:e,kanie:e,kariya:e,kasugai:e,kira:e,kiyosu:e,komaki:e,konan:e,kota:e,mihama:e,miyoshi:e,nishio:e,nisshin:e,obu:e,oguchi:e,oharu:e,okazaki:e,owariasahi:e,seto:e,shikatsu:e,shinshiro:e,shitara:e,tahara:e,takahama:e,tobishima:e,toei:e,togo:e,tokai:e,tokoname:e,toyoake:e,toyohashi:e,toyokawa:e,toyone:e,toyota:e,tsushima:e,yatomi:e}],akita:[1,{akita:e,daisen:e,fujisato:e,gojome:e,hachirogata:e,happou:e,higashinaruse:e,honjo:e,honjyo:e,ikawa:e,kamikoani:e,kamioka:e,katagami:e,kazuno:e,kitaakita:e,kosaka:e,kyowa:e,misato:e,mitane:e,moriyoshi:e,nikaho:e,noshiro:e,odate:e,oga:e,ogata:e,semboku:e,yokote:e,yurihonjo:e}],aomori:[1,{aomori:e,gonohe:e,hachinohe:e,hashikami:e,hiranai:e,hirosaki:e,itayanagi:e,kuroishi:e,misawa:e,mutsu:e,nakadomari:e,noheji:e,oirase:e,owani:e,rokunohe:e,sannohe:e,shichinohe:e,shingo:e,takko:e,towada:e,tsugaru:e,tsuruta:e}],chiba:[1,{abiko:e,asahi:e,chonan:e,chosei:e,choshi:e,chuo:e,funabashi:e,futtsu:e,hanamigawa:e,ichihara:e,ichikawa:e,ichinomiya:e,inzai:e,isumi:e,kamagaya:e,kamogawa:e,kashiwa:e,katori:e,katsuura:e,kimitsu:e,kisarazu:e,kozaki:e,kujukuri:e,kyonan:e,matsudo:e,midori:e,mihama:e,minamiboso:e,mobara:e,mutsuzawa:e,nagara:e,nagareyama:e,narashino:e,narita:e,noda:e,oamishirasato:e,omigawa:e,onjuku:e,otaki:e,sakae:e,sakura:e,shimofusa:e,shirako:e,shiroi:e,shisui:e,sodegaura:e,sosa:e,tako:e,tateyama:e,togane:e,tohnosho:e,tomisato:e,urayasu:e,yachimata:e,yachiyo:e,yokaichiba:e,yokoshibahikari:e,yotsukaido:e}],ehime:[1,{ainan:e,honai:e,ikata:e,imabari:e,iyo:e,kamijima:e,kihoku:e,kumakogen:e,masaki:e,matsuno:e,matsuyama:e,namikata:e,niihama:e,ozu:e,saijo:e,seiyo:e,shikokuchuo:e,tobe:e,toon:e,uchiko:e,uwajima:e,yawatahama:e}],fukui:[1,{echizen:e,eiheiji:e,fukui:e,ikeda:e,katsuyama:e,mihama:e,minamiechizen:e,obama:e,ohi:e,ono:e,sabae:e,sakai:e,takahama:e,tsuruga:e,wakasa:e}],fukuoka:[1,{ashiya:e,buzen:e,chikugo:e,chikuho:e,chikujo:e,chikushino:e,chikuzen:e,chuo:e,dazaifu:e,fukuchi:e,hakata:e,higashi:e,hirokawa:e,hisayama:e,iizuka:e,inatsuki:e,kaho:e,kasuga:e,kasuya:e,kawara:e,keisen:e,koga:e,kurate:e,kurogi:e,kurume:e,minami:e,miyako:e,miyama:e,miyawaka:e,mizumaki:e,munakata:e,nakagawa:e,nakama:e,nishi:e,nogata:e,ogori:e,okagaki:e,okawa:e,oki:e,omuta:e,onga:e,onojo:e,oto:e,saigawa:e,sasaguri:e,shingu:e,shinyoshitomi:e,shonai:e,soeda:e,sue:e,tachiarai:e,tagawa:e,takata:e,toho:e,toyotsu:e,tsuiki:e,ukiha:e,umi:e,usui:e,yamada:e,yame:e,yanagawa:e,yukuhashi:e}],fukushima:[1,{aizubange:e,aizumisato:e,aizuwakamatsu:e,asakawa:e,bandai:e,date:e,fukushima:e,furudono:e,futaba:e,hanawa:e,higashi:e,hirata:e,hirono:e,iitate:e,inawashiro:e,ishikawa:e,iwaki:e,izumizaki:e,kagamiishi:e,kaneyama:e,kawamata:e,kitakata:e,kitashiobara:e,koori:e,koriyama:e,kunimi:e,miharu:e,mishima:e,namie:e,nango:e,nishiaizu:e,nishigo:e,okuma:e,omotego:e,ono:e,otama:e,samegawa:e,shimogo:e,shirakawa:e,showa:e,soma:e,sukagawa:e,taishin:e,tamakawa:e,tanagura:e,tenei:e,yabuki:e,yamato:e,yamatsuri:e,yanaizu:e,yugawa:e}],gifu:[1,{anpachi:e,ena:e,gifu:e,ginan:e,godo:e,gujo:e,hashima:e,hichiso:e,hida:e,higashishirakawa:e,ibigawa:e,ikeda:e,kakamigahara:e,kani:e,kasahara:e,kasamatsu:e,kawaue:e,kitagata:e,mino:e,minokamo:e,mitake:e,mizunami:e,motosu:e,nakatsugawa:e,ogaki:e,sakahogi:e,seki:e,sekigahara:e,shirakawa:e,tajimi:e,takayama:e,tarui:e,toki:e,tomika:e,wanouchi:e,yamagata:e,yaotsu:e,yoro:e}],gunma:[1,{annaka:e,chiyoda:e,fujioka:e,higashiagatsuma:e,isesaki:e,itakura:e,kanna:e,kanra:e,katashina:e,kawaba:e,kiryu:e,kusatsu:e,maebashi:e,meiwa:e,midori:e,minakami:e,naganohara:e,nakanojo:e,nanmoku:e,numata:e,oizumi:e,ora:e,ota:e,shibukawa:e,shimonita:e,shinto:e,showa:e,takasaki:e,takayama:e,tamamura:e,tatebayashi:e,tomioka:e,tsukiyono:e,tsumagoi:e,ueno:e,yoshioka:e}],hiroshima:[1,{asaminami:e,daiwa:e,etajima:e,fuchu:e,fukuyama:e,hatsukaichi:e,higashihiroshima:e,hongo:e,jinsekikogen:e,kaita:e,kui:e,kumano:e,kure:e,mihara:e,miyoshi:e,naka:e,onomichi:e,osakikamijima:e,otake:e,saka:e,sera:e,seranishi:e,shinichi:e,shobara:e,takehara:e}],hokkaido:[1,{abashiri:e,abira:e,aibetsu:e,akabira:e,akkeshi:e,asahikawa:e,ashibetsu:e,ashoro:e,assabu:e,atsuma:e,bibai:e,biei:e,bifuka:e,bihoro:e,biratori:e,chippubetsu:e,chitose:e,date:e,ebetsu:e,embetsu:e,eniwa:e,erimo:e,esan:e,esashi:e,fukagawa:e,fukushima:e,furano:e,furubira:e,haboro:e,hakodate:e,hamatonbetsu:e,hidaka:e,higashikagura:e,higashikawa:e,hiroo:e,hokuryu:e,hokuto:e,honbetsu:e,horokanai:e,horonobe:e,ikeda:e,imakane:e,ishikari:e,iwamizawa:e,iwanai:e,kamifurano:e,kamikawa:e,kamishihoro:e,kamisunagawa:e,kamoenai:e,kayabe:e,kembuchi:e,kikonai:e,kimobetsu:e,kitahiroshima:e,kitami:e,kiyosato:e,koshimizu:e,kunneppu:e,kuriyama:e,kuromatsunai:e,kushiro:e,kutchan:e,kyowa:e,mashike:e,matsumae:e,mikasa:e,minamifurano:e,mombetsu:e,moseushi:e,mukawa:e,muroran:e,naie:e,nakagawa:e,nakasatsunai:e,nakatombetsu:e,nanae:e,nanporo:e,nayoro:e,nemuro:e,niikappu:e,niki:e,nishiokoppe:e,noboribetsu:e,numata:e,obihiro:e,obira:e,oketo:e,okoppe:e,otaru:e,otobe:e,otofuke:e,otoineppu:e,oumu:e,ozora:e,pippu:e,rankoshi:e,rebun:e,rikubetsu:e,rishiri:e,rishirifuji:e,saroma:e,sarufutsu:e,shakotan:e,shari:e,shibecha:e,shibetsu:e,shikabe:e,shikaoi:e,shimamaki:e,shimizu:e,shimokawa:e,shinshinotsu:e,shintoku:e,shiranuka:e,shiraoi:e,shiriuchi:e,sobetsu:e,sunagawa:e,taiki:e,takasu:e,takikawa:e,takinoue:e,teshikaga:e,tobetsu:e,tohma:e,tomakomai:e,tomari:e,toya:e,toyako:e,toyotomi:e,toyoura:e,tsubetsu:e,tsukigata:e,urakawa:e,urausu:e,uryu:e,utashinai:e,wakkanai:e,wassamu:e,yakumo:e,yoichi:e}],hyogo:[1,{aioi:e,akashi:e,ako:e,amagasaki:e,aogaki:e,asago:e,ashiya:e,awaji:e,fukusaki:e,goshiki:e,harima:e,himeji:e,ichikawa:e,inagawa:e,itami:e,kakogawa:e,kamigori:e,kamikawa:e,kasai:e,kasuga:e,kawanishi:e,miki:e,minamiawaji:e,nishinomiya:e,nishiwaki:e,ono:e,sanda:e,sannan:e,sasayama:e,sayo:e,shingu:e,shinonsen:e,shiso:e,sumoto:e,taishi:e,taka:e,takarazuka:e,takasago:e,takino:e,tamba:e,tatsuno:e,toyooka:e,yabu:e,yashiro:e,yoka:e,yokawa:e}],ibaraki:[1,{ami:e,asahi:e,bando:e,chikusei:e,daigo:e,fujishiro:e,hitachi:e,hitachinaka:e,hitachiomiya:e,hitachiota:e,ibaraki:e,ina:e,inashiki:e,itako:e,iwama:e,joso:e,kamisu:e,kasama:e,kashima:e,kasumigaura:e,koga:e,miho:e,mito:e,moriya:e,naka:e,namegata:e,oarai:e,ogawa:e,omitama:e,ryugasaki:e,sakai:e,sakuragawa:e,shimodate:e,shimotsuma:e,shirosato:e,sowa:e,suifu:e,takahagi:e,tamatsukuri:e,tokai:e,tomobe:e,tone:e,toride:e,tsuchiura:e,tsukuba:e,uchihara:e,ushiku:e,yachiyo:e,yamagata:e,yawara:e,yuki:e}],ishikawa:[1,{anamizu:e,hakui:e,hakusan:e,kaga:e,kahoku:e,kanazawa:e,kawakita:e,komatsu:e,nakanoto:e,nanao:e,nomi:e,nonoichi:e,noto:e,shika:e,suzu:e,tsubata:e,tsurugi:e,uchinada:e,wajima:e}],iwate:[1,{fudai:e,fujisawa:e,hanamaki:e,hiraizumi:e,hirono:e,ichinohe:e,ichinoseki:e,iwaizumi:e,iwate:e,joboji:e,kamaishi:e,kanegasaki:e,karumai:e,kawai:e,kitakami:e,kuji:e,kunohe:e,kuzumaki:e,miyako:e,mizusawa:e,morioka:e,ninohe:e,noda:e,ofunato:e,oshu:e,otsuchi:e,rikuzentakata:e,shiwa:e,shizukuishi:e,sumita:e,tanohata:e,tono:e,yahaba:e,yamada:e}],kagawa:[1,{ayagawa:e,higashikagawa:e,kanonji:e,kotohira:e,manno:e,marugame:e,mitoyo:e,naoshima:e,sanuki:e,tadotsu:e,takamatsu:e,tonosho:e,uchinomi:e,utazu:e,zentsuji:e}],kagoshima:[1,{akune:e,amami:e,hioki:e,isa:e,isen:e,izumi:e,kagoshima:e,kanoya:e,kawanabe:e,kinko:e,kouyama:e,makurazaki:e,matsumoto:e,minamitane:e,nakatane:e,nishinoomote:e,satsumasendai:e,soo:e,tarumizu:e,yusui:e}],kanagawa:[1,{aikawa:e,atsugi:e,ayase:e,chigasaki:e,ebina:e,fujisawa:e,hadano:e,hakone:e,hiratsuka:e,isehara:e,kaisei:e,kamakura:e,kiyokawa:e,matsuda:e,minamiashigara:e,miura:e,nakai:e,ninomiya:e,odawara:e,oi:e,oiso:e,sagamihara:e,samukawa:e,tsukui:e,yamakita:e,yamato:e,yokosuka:e,yugawara:e,zama:e,zushi:e}],kochi:[1,{aki:e,geisei:e,hidaka:e,higashitsuno:e,ino:e,kagami:e,kami:e,kitagawa:e,kochi:e,mihara:e,motoyama:e,muroto:e,nahari:e,nakamura:e,nankoku:e,nishitosa:e,niyodogawa:e,ochi:e,okawa:e,otoyo:e,otsuki:e,sakawa:e,sukumo:e,susaki:e,tosa:e,tosashimizu:e,toyo:e,tsuno:e,umaji:e,yasuda:e,yusuhara:e}],kumamoto:[1,{amakusa:e,arao:e,aso:e,choyo:e,gyokuto:e,kamiamakusa:e,kikuchi:e,kumamoto:e,mashiki:e,mifune:e,minamata:e,minamioguni:e,nagasu:e,nishihara:e,oguni:e,ozu:e,sumoto:e,takamori:e,uki:e,uto:e,yamaga:e,yamato:e,yatsushiro:e}],kyoto:[1,{ayabe:e,fukuchiyama:e,higashiyama:e,ide:e,ine:e,joyo:e,kameoka:e,kamo:e,kita:e,kizu:e,kumiyama:e,kyotamba:e,kyotanabe:e,kyotango:e,maizuru:e,minami:e,minamiyamashiro:e,miyazu:e,muko:e,nagaokakyo:e,nakagyo:e,nantan:e,oyamazaki:e,sakyo:e,seika:e,tanabe:e,uji:e,ujitawara:e,wazuka:e,yamashina:e,yawata:e}],mie:[1,{asahi:e,inabe:e,ise:e,kameyama:e,kawagoe:e,kiho:e,kisosaki:e,kiwa:e,komono:e,kumano:e,kuwana:e,matsusaka:e,meiwa:e,mihama:e,minamiise:e,misugi:e,miyama:e,nabari:e,shima:e,suzuka:e,tado:e,taiki:e,taki:e,tamaki:e,toba:e,tsu:e,udono:e,ureshino:e,watarai:e,yokkaichi:e}],miyagi:[1,{furukawa:e,higashimatsushima:e,ishinomaki:e,iwanuma:e,kakuda:e,kami:e,kawasaki:e,marumori:e,matsushima:e,minamisanriku:e,misato:e,murata:e,natori:e,ogawara:e,ohira:e,onagawa:e,osaki:e,rifu:e,semine:e,shibata:e,shichikashuku:e,shikama:e,shiogama:e,shiroishi:e,tagajo:e,taiwa:e,tome:e,tomiya:e,wakuya:e,watari:e,yamamoto:e,zao:e}],miyazaki:[1,{aya:e,ebino:e,gokase:e,hyuga:e,kadogawa:e,kawaminami:e,kijo:e,kitagawa:e,kitakata:e,kitaura:e,kobayashi:e,kunitomi:e,kushima:e,mimata:e,miyakonojo:e,miyazaki:e,morotsuka:e,nichinan:e,nishimera:e,nobeoka:e,saito:e,shiiba:e,shintomi:e,takaharu:e,takanabe:e,takazaki:e,tsuno:e}],nagano:[1,{achi:e,agematsu:e,anan:e,aoki:e,asahi:e,azumino:e,chikuhoku:e,chikuma:e,chino:e,fujimi:e,hakuba:e,hara:e,hiraya:e,iida:e,iijima:e,iiyama:e,iizuna:e,ikeda:e,ikusaka:e,ina:e,karuizawa:e,kawakami:e,kiso:e,kisofukushima:e,kitaaiki:e,komagane:e,komoro:e,matsukawa:e,matsumoto:e,miasa:e,minamiaiki:e,minamimaki:e,minamiminowa:e,minowa:e,miyada:e,miyota:e,mochizuki:e,nagano:e,nagawa:e,nagiso:e,nakagawa:e,nakano:e,nozawaonsen:e,obuse:e,ogawa:e,okaya:e,omachi:e,omi:e,ookuwa:e,ooshika:e,otaki:e,otari:e,sakae:e,sakaki:e,saku:e,sakuho:e,shimosuwa:e,shinanomachi:e,shiojiri:e,suwa:e,suzaka:e,takagi:e,takamori:e,takayama:e,tateshina:e,tatsuno:e,togakushi:e,togura:e,tomi:e,ueda:e,wada:e,yamagata:e,yamanouchi:e,yasaka:e,yasuoka:e}],nagasaki:[1,{chijiwa:e,futsu:e,goto:e,hasami:e,hirado:e,iki:e,isahaya:e,kawatana:e,kuchinotsu:e,matsuura:e,nagasaki:e,obama:e,omura:e,oseto:e,saikai:e,sasebo:e,seihi:e,shimabara:e,shinkamigoto:e,togitsu:e,tsushima:e,unzen:e}],nara:[1,{ando:e,gose:e,heguri:e,higashiyoshino:e,ikaruga:e,ikoma:e,kamikitayama:e,kanmaki:e,kashiba:e,kashihara:e,katsuragi:e,kawai:e,kawakami:e,kawanishi:e,koryo:e,kurotaki:e,mitsue:e,miyake:e,nara:e,nosegawa:e,oji:e,ouda:e,oyodo:e,sakurai:e,sango:e,shimoichi:e,shimokitayama:e,shinjo:e,soni:e,takatori:e,tawaramoto:e,tenkawa:e,tenri:e,uda:e,yamatokoriyama:e,yamatotakada:e,yamazoe:e,yoshino:e}],niigata:[1,{aga:e,agano:e,gosen:e,itoigawa:e,izumozaki:e,joetsu:e,kamo:e,kariwa:e,kashiwazaki:e,minamiuonuma:e,mitsuke:e,muika:e,murakami:e,myoko:e,nagaoka:e,niigata:e,ojiya:e,omi:e,sado:e,sanjo:e,seiro:e,seirou:e,sekikawa:e,shibata:e,tagami:e,tainai:e,tochio:e,tokamachi:e,tsubame:e,tsunan:e,uonuma:e,yahiko:e,yoita:e,yuzawa:e}],oita:[1,{beppu:e,bungoono:e,bungotakada:e,hasama:e,hiji:e,himeshima:e,hita:e,kamitsue:e,kokonoe:e,kuju:e,kunisaki:e,kusu:e,oita:e,saiki:e,taketa:e,tsukumi:e,usa:e,usuki:e,yufu:e}],okayama:[1,{akaiwa:e,asakuchi:e,bizen:e,hayashima:e,ibara:e,kagamino:e,kasaoka:e,kibichuo:e,kumenan:e,kurashiki:e,maniwa:e,misaki:e,nagi:e,niimi:e,nishiawakura:e,okayama:e,satosho:e,setouchi:e,shinjo:e,shoo:e,soja:e,takahashi:e,tamano:e,tsuyama:e,wake:e,yakage:e}],okinawa:[1,{aguni:e,ginowan:e,ginoza:e,gushikami:e,haebaru:e,higashi:e,hirara:e,iheya:e,ishigaki:e,ishikawa:e,itoman:e,izena:e,kadena:e,kin:e,kitadaito:e,kitanakagusuku:e,kumejima:e,kunigami:e,minamidaito:e,motobu:e,nago:e,naha:e,nakagusuku:e,nakijin:e,nanjo:e,nishihara:e,ogimi:e,okinawa:e,onna:e,shimoji:e,taketomi:e,tarama:e,tokashiki:e,tomigusuku:e,tonaki:e,urasoe:e,uruma:e,yaese:e,yomitan:e,yonabaru:e,yonaguni:e,zamami:e}],osaka:[1,{abeno:e,chihayaakasaka:e,chuo:e,daito:e,fujiidera:e,habikino:e,hannan:e,higashiosaka:e,higashisumiyoshi:e,higashiyodogawa:e,hirakata:e,ibaraki:e,ikeda:e,izumi:e,izumiotsu:e,izumisano:e,kadoma:e,kaizuka:e,kanan:e,kashiwara:e,katano:e,kawachinagano:e,kishiwada:e,kita:e,kumatori:e,matsubara:e,minato:e,minoh:e,misaki:e,moriguchi:e,neyagawa:e,nishi:e,nose:e,osakasayama:e,sakai:e,sayama:e,sennan:e,settsu:e,shijonawate:e,shimamoto:e,suita:e,tadaoka:e,taishi:e,tajiri:e,takaishi:e,takatsuki:e,tondabayashi:e,toyonaka:e,toyono:e,yao:e}],saga:[1,{ariake:e,arita:e,fukudomi:e,genkai:e,hamatama:e,hizen:e,imari:e,kamimine:e,kanzaki:e,karatsu:e,kashima:e,kitagata:e,kitahata:e,kiyama:e,kouhoku:e,kyuragi:e,nishiarita:e,ogi:e,omachi:e,ouchi:e,saga:e,shiroishi:e,taku:e,tara:e,tosu:e,yoshinogari:e}],saitama:[1,{arakawa:e,asaka:e,chichibu:e,fujimi:e,fujimino:e,fukaya:e,hanno:e,hanyu:e,hasuda:e,hatogaya:e,hatoyama:e,hidaka:e,higashichichibu:e,higashimatsuyama:e,honjo:e,ina:e,iruma:e,iwatsuki:e,kamiizumi:e,kamikawa:e,kamisato:e,kasukabe:e,kawagoe:e,kawaguchi:e,kawajima:e,kazo:e,kitamoto:e,koshigaya:e,kounosu:e,kuki:e,kumagaya:e,matsubushi:e,minano:e,misato:e,miyashiro:e,miyoshi:e,moroyama:e,nagatoro:e,namegawa:e,niiza:e,ogano:e,ogawa:e,ogose:e,okegawa:e,omiya:e,otaki:e,ranzan:e,ryokami:e,saitama:e,sakado:e,satte:e,sayama:e,shiki:e,shiraoka:e,soka:e,sugito:e,toda:e,tokigawa:e,tokorozawa:e,tsurugashima:e,urawa:e,warabi:e,yashio:e,yokoze:e,yono:e,yorii:e,yoshida:e,yoshikawa:e,yoshimi:e}],shiga:[1,{aisho:e,gamo:e,higashiomi:e,hikone:e,koka:e,konan:e,kosei:e,koto:e,kusatsu:e,maibara:e,moriyama:e,nagahama:e,nishiazai:e,notogawa:e,omihachiman:e,otsu:e,ritto:e,ryuoh:e,takashima:e,takatsuki:e,torahime:e,toyosato:e,yasu:e}],shimane:[1,{akagi:e,ama:e,gotsu:e,hamada:e,higashiizumo:e,hikawa:e,hikimi:e,izumo:e,kakinoki:e,masuda:e,matsue:e,misato:e,nishinoshima:e,ohda:e,okinoshima:e,okuizumo:e,shimane:e,tamayu:e,tsuwano:e,unnan:e,yakumo:e,yasugi:e,yatsuka:e}],shizuoka:[1,{arai:e,atami:e,fuji:e,fujieda:e,fujikawa:e,fujinomiya:e,fukuroi:e,gotemba:e,haibara:e,hamamatsu:e,higashiizu:e,ito:e,iwata:e,izu:e,izunokuni:e,kakegawa:e,kannami:e,kawanehon:e,kawazu:e,kikugawa:e,kosai:e,makinohara:e,matsuzaki:e,minamiizu:e,mishima:e,morimachi:e,nishiizu:e,numazu:e,omaezaki:e,shimada:e,shimizu:e,shimoda:e,shizuoka:e,susono:e,yaizu:e,yoshida:e}],tochigi:[1,{ashikaga:e,bato:e,haga:e,ichikai:e,iwafune:e,kaminokawa:e,kanuma:e,karasuyama:e,kuroiso:e,mashiko:e,mibu:e,moka:e,motegi:e,nasu:e,nasushiobara:e,nikko:e,nishikata:e,nogi:e,ohira:e,ohtawara:e,oyama:e,sakura:e,sano:e,shimotsuke:e,shioya:e,takanezawa:e,tochigi:e,tsuga:e,ujiie:e,utsunomiya:e,yaita:e}],tokushima:[1,{aizumi:e,anan:e,ichiba:e,itano:e,kainan:e,komatsushima:e,matsushige:e,mima:e,minami:e,miyoshi:e,mugi:e,nakagawa:e,naruto:e,sanagochi:e,shishikui:e,tokushima:e,wajiki:e}],tokyo:[1,{adachi:e,akiruno:e,akishima:e,aogashima:e,arakawa:e,bunkyo:e,chiyoda:e,chofu:e,chuo:e,edogawa:e,fuchu:e,fussa:e,hachijo:e,hachioji:e,hamura:e,higashikurume:e,higashimurayama:e,higashiyamato:e,hino:e,hinode:e,hinohara:e,inagi:e,itabashi:e,katsushika:e,kita:e,kiyose:e,kodaira:e,koganei:e,kokubunji:e,komae:e,koto:e,kouzushima:e,kunitachi:e,machida:e,meguro:e,minato:e,mitaka:e,mizuho:e,musashimurayama:e,musashino:e,nakano:e,nerima:e,ogasawara:e,okutama:e,ome:e,oshima:e,ota:e,setagaya:e,shibuya:e,shinagawa:e,shinjuku:e,suginami:e,sumida:e,tachikawa:e,taito:e,tama:e,toshima:e}],tottori:[1,{chizu:e,hino:e,kawahara:e,koge:e,kotoura:e,misasa:e,nanbu:e,nichinan:e,sakaiminato:e,tottori:e,wakasa:e,yazu:e,yonago:e}],toyama:[1,{asahi:e,fuchu:e,fukumitsu:e,funahashi:e,himi:e,imizu:e,inami:e,johana:e,kamiichi:e,kurobe:e,nakaniikawa:e,namerikawa:e,nanto:e,nyuzen:e,oyabe:e,taira:e,takaoka:e,tateyama:e,toga:e,tonami:e,toyama:e,unazuki:e,uozu:e,yamada:e}],wakayama:[1,{arida:e,aridagawa:e,gobo:e,hashimoto:e,hidaka:e,hirogawa:e,inami:e,iwade:e,kainan:e,kamitonda:e,katsuragi:e,kimino:e,kinokawa:e,kitayama:e,koya:e,koza:e,kozagawa:e,kudoyama:e,kushimoto:e,mihama:e,misato:e,nachikatsuura:e,shingu:e,shirahama:e,taiji:e,tanabe:e,wakayama:e,yuasa:e,yura:e}],yamagata:[1,{asahi:e,funagata:e,higashine:e,iide:e,kahoku:e,kaminoyama:e,kaneyama:e,kawanishi:e,mamurogawa:e,mikawa:e,murayama:e,nagai:e,nakayama:e,nanyo:e,nishikawa:e,obanazawa:e,oe:e,oguni:e,ohkura:e,oishida:e,sagae:e,sakata:e,sakegawa:e,shinjo:e,shirataka:e,shonai:e,takahata:e,tendo:e,tozawa:e,tsuruoka:e,yamagata:e,yamanobe:e,yonezawa:e,yuza:e}],yamaguchi:[1,{abu:e,hagi:e,hikari:e,hofu:e,iwakuni:e,kudamatsu:e,mitou:e,nagato:e,oshima:e,shimonoseki:e,shunan:e,tabuse:e,tokuyama:e,toyota:e,ube:e,yuu:e}],yamanashi:[1,{chuo:e,doshi:e,fuefuki:e,fujikawa:e,fujikawaguchiko:e,fujiyoshida:e,hayakawa:e,hokuto:e,ichikawamisato:e,kai:e,kofu:e,koshu:e,kosuge:e,"minami-alps":e,minobu:e,nakamichi:e,nanbu:e,narusawa:e,nirasaki:e,nishikatsura:e,oshino:e,otsuki:e,showa:e,tabayama:e,tsuru:e,uenohara:e,yamanakako:e,yamanashi:e}],"xn--ehqz56n":e,\u4E09\u91CD:e,"xn--1lqs03n":e,\u4EAC\u90FD:e,"xn--qqqt11m":e,\u4F50\u8CC0:e,"xn--f6qx53a":e,\u5175\u5EAB:e,"xn--djrs72d6uy":e,\u5317\u6D77\u9053:e,"xn--mkru45i":e,\u5343\u8449:e,"xn--0trq7p7nn":e,\u548C\u6B4C\u5C71:e,"xn--5js045d":e,\u57FC\u7389:e,"xn--kbrq7o":e,\u5927\u5206:e,"xn--pssu33l":e,\u5927\u962A:e,"xn--ntsq17g":e,\u5948\u826F:e,"xn--uisz3g":e,\u5BAE\u57CE:e,"xn--6btw5a":e,\u5BAE\u5D0E:e,"xn--1ctwo":e,\u5BCC\u5C71:e,"xn--6orx2r":e,\u5C71\u53E3:e,"xn--rht61e":e,\u5C71\u5F62:e,"xn--rht27z":e,\u5C71\u68A8:e,"xn--nit225k":e,\u5C90\u961C:e,"xn--rht3d":e,\u5CA1\u5C71:e,"xn--djty4k":e,\u5CA9\u624B:e,"xn--klty5x":e,\u5CF6\u6839:e,"xn--kltx9a":e,\u5E83\u5CF6:e,"xn--kltp7d":e,\u5FB3\u5CF6:e,"xn--c3s14m":e,\u611B\u5A9B:e,"xn--vgu402c":e,\u611B\u77E5:e,"xn--efvn9s":e,\u65B0\u6F5F:e,"xn--1lqs71d":e,\u6771\u4EAC:e,"xn--4pvxs":e,\u6803\u6728:e,"xn--uuwu58a":e,\u6C96\u7E04:e,"xn--zbx025d":e,\u6ECB\u8CC0:e,"xn--8pvr4u":e,\u718A\u672C:e,"xn--5rtp49c":e,\u77F3\u5DDD:e,"xn--ntso0iqx3a":e,\u795E\u5948\u5DDD:e,"xn--elqq16h":e,\u798F\u4E95:e,"xn--4it168d":e,\u798F\u5CA1:e,"xn--klt787d":e,\u798F\u5CF6:e,"xn--rny31h":e,\u79CB\u7530:e,"xn--7t0a264c":e,\u7FA4\u99AC:e,"xn--uist22h":e,\u8328\u57CE:e,"xn--8ltr62k":e,\u9577\u5D0E:e,"xn--2m4a15e":e,\u9577\u91CE:e,"xn--32vp30h":e,\u9752\u68EE:e,"xn--4it797k":e,\u9759\u5CA1:e,"xn--5rtq34k":e,\u9999\u5DDD:e,"xn--k7yn95e":e,\u9AD8\u77E5:e,"xn--tor131o":e,\u9CE5\u53D6:e,"xn--d5qv7z876c":e,\u9E7F\u5150\u5CF6:e,kawasaki:k,kitakyushu:k,kobe:k,nagoya:k,sapporo:k,sendai:k,yokohama:k,buyshop:t,fashionstore:t,handcrafted:t,kawaiishop:t,supersale:t,theshop:t,"0am":t,"0g0":t,"0j0":t,"0t0":t,mydns:t,pgw:t,wjg:t,usercontent:t,angry:t,babyblue:t,babymilk:t,backdrop:t,bambina:t,bitter:t,blush:t,boo:t,boy:t,boyfriend:t,but:t,candypop:t,capoo:t,catfood:t,cheap:t,chicappa:t,chillout:t,chips:t,chowder:t,chu:t,ciao:t,cocotte:t,coolblog:t,cranky:t,cutegirl:t,daa:t,deca:t,deci:t,digick:t,egoism:t,fakefur:t,fem:t,flier:t,floppy:t,fool:t,frenchkiss:t,girlfriend:t,girly:t,gloomy:t,gonna:t,greater:t,hacca:t,heavy:t,her:t,hiho:t,hippy:t,holy:t,hungry:t,icurus:t,itigo:t,jellybean:t,kikirara:t,kill:t,kilo:t,kuron:t,littlestar:t,lolipopmc:t,lolitapunk:t,lomo:t,lovepop:t,lovesick:t,main:t,mods:t,mond:t,mongolian:t,moo:t,namaste:t,nikita:t,nobushi:t,noor:t,oops:t,parallel:t,parasite:t,pecori:t,peewee:t,penne:t,pepper:t,perma:t,pigboat:t,pinoko:t,punyu:t,pupu:t,pussycat:t,pya:t,raindrop:t,readymade:t,sadist:t,schoolbus:t,secret:t,staba:t,stripper:t,sub:t,sunnyday:t,thick:t,tonkotsu:t,under:t,upper:t,velvet:t,verse:t,versus:t,vivian:t,watson:t,weblike:t,whitesnow:t,zombie:t,hateblo:t,hatenablog:t,hatenadiary:t,"2-d":t,bona:t,crap:t,daynight:t,eek:t,flop:t,halfmoon:t,jeez:t,matrix:t,mimoza:t,netgamers:t,nyanta:t,o0o0:t,rdy:t,rgr:t,rulez:t,sakurastorage:[0,{isk01:Qe,isk02:Qe}],saloon:t,sblo:t,skr:t,tank:t,"uh-oh":t,undo:t,webaccel:[0,{rs:t,user:t}],websozai:t,xii:t}],ke:[1,{ac:e,co:e,go:e,info:e,me:e,mobi:e,ne:e,or:e,sc:e}],kg:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,us:t}],kh:k,ki:Ta,km:[1,{ass:e,com:e,edu:e,gov:e,mil:e,nom:e,org:e,prd:e,tm:e,asso:e,coop:e,gouv:e,medecin:e,notaires:e,pharmaciens:e,presse:e,veterinaire:e}],kn:[1,{edu:e,gov:e,net:e,org:e}],kp:[1,{com:e,edu:e,gov:e,org:e,rep:e,tra:e}],kr:[1,{ac:e,ai:e,co:e,es:e,go:e,hs:e,io:e,it:e,kg:e,me:e,mil:e,ms:e,ne:e,or:e,pe:e,re:e,sc:e,busan:e,chungbuk:e,chungnam:e,daegu:e,daejeon:e,gangwon:e,gwangju:e,gyeongbuk:e,gyeonggi:e,gyeongnam:e,incheon:e,jeju:e,jeonbuk:e,jeonnam:e,seoul:e,ulsan:e,c01:t,"eliv-dns":t}],kw:[1,{com:e,edu:e,emb:e,gov:e,ind:e,net:e,org:e}],ky:xe,kz:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,jcloud:t}],la:[1,{com:e,edu:e,gov:e,info:e,int:e,net:e,org:e,per:e,bnr:t}],lb:a,lc:[1,{co:e,com:e,edu:e,gov:e,net:e,org:e,oy:t}],li:e,lk:[1,{ac:e,assn:e,com:e,edu:e,gov:e,grp:e,hotel:e,int:e,ltd:e,net:e,ngo:e,org:e,sch:e,soc:e,web:e}],lr:a,ls:[1,{ac:e,biz:e,co:e,edu:e,gov:e,info:e,net:e,org:e,sc:e}],lt:l,lu:[1,{"123website":t}],lv:[1,{asn:e,com:e,conf:e,edu:e,gov:e,id:e,mil:e,net:e,org:e}],ly:[1,{com:e,edu:e,gov:e,id:e,med:e,net:e,org:e,plc:e,sch:e}],ma:[1,{ac:e,co:e,gov:e,net:e,org:e,press:e}],mc:[1,{asso:e,tm:e}],md:[1,{ir:t}],me:[1,{ac:e,co:e,edu:e,gov:e,its:e,net:e,org:e,priv:e,c66:t,craft:t,edgestack:t,filegear:t,glitch:t,"filegear-sg":t,lohmus:t,barsy:t,mcdir:t,brasilia:t,ddns:t,dnsfor:t,hopto:t,loginto:t,noip:t,webhop:t,soundcast:t,tcp4:t,vp4:t,diskstation:t,dscloud:t,i234:t,myds:t,synology:t,transip:Ke,nohost:t}],mg:[1,{co:e,com:e,edu:e,gov:e,mil:e,nom:e,org:e,prd:e}],mh:e,mil:e,mk:[1,{com:e,edu:e,gov:e,inf:e,name:e,net:e,org:e}],ml:[1,{ac:e,art:e,asso:e,com:e,edu:e,gouv:e,gov:e,info:e,inst:e,net:e,org:e,pr:e,presse:e}],mm:k,mn:[1,{edu:e,gov:e,org:e,nyc:t}],mo:a,mobi:[1,{barsy:t,dscloud:t}],mp:[1,{ju:t}],mq:e,mr:l,ms:[1,{com:e,edu:e,gov:e,net:e,org:e,minisite:t}],mt:xe,mu:[1,{ac:e,co:e,com:e,gov:e,net:e,or:e,org:e}],museum:e,mv:[1,{aero:e,biz:e,com:e,coop:e,edu:e,gov:e,info:e,int:e,mil:e,museum:e,name:e,net:e,org:e,pro:e}],mw:[1,{ac:e,biz:e,co:e,com:e,coop:e,edu:e,gov:e,int:e,net:e,org:e}],mx:[1,{com:e,edu:e,gob:e,net:e,org:e}],my:[1,{biz:e,com:e,edu:e,gov:e,mil:e,name:e,net:e,org:e}],mz:[1,{ac:e,adv:e,co:e,edu:e,gov:e,mil:e,net:e,org:e}],na:[1,{alt:e,co:e,com:e,gov:e,net:e,org:e}],name:[1,{her:Ca,his:Ca}],nc:[1,{asso:e,nom:e}],ne:e,net:[1,{adobeaemcloud:t,"adobeio-static":t,adobeioruntime:t,akadns:t,akamai:t,"akamai-staging":t,akamaiedge:t,"akamaiedge-staging":t,akamaihd:t,"akamaihd-staging":t,akamaiorigin:t,"akamaiorigin-staging":t,akamaized:t,"akamaized-staging":t,edgekey:t,"edgekey-staging":t,edgesuite:t,"edgesuite-staging":t,alwaysdata:t,myamaze:t,cloudfront:t,appudo:t,"atlassian-dev":[0,{prod:le}],myfritz:t,onavstack:t,shopselect:t,blackbaudcdn:t,boomla:t,bplaced:t,square7:t,cdn77:[0,{r:t}],"cdn77-ssl":t,gb:t,hu:t,jp:t,se:t,uk:t,clickrising:t,"ddns-ip":t,"dns-cloud":t,"dns-dynamic":t,cloudaccess:t,cloudflare:[2,{cdn:t}],cloudflareanycast:le,cloudflarecn:le,cloudflareglobal:le,ctfcloud:t,"feste-ip":t,"knx-server":t,"static-access":t,cryptonomic:n,dattolocal:t,mydatto:t,debian:t,definima:t,deno:t,"at-band-camp":t,blogdns:t,"broke-it":t,buyshouses:t,dnsalias:t,dnsdojo:t,"does-it":t,dontexist:t,dynalias:t,dynathome:t,endofinternet:t,"from-az":t,"from-co":t,"from-la":t,"from-ny":t,"gets-it":t,"ham-radio-op":t,homeftp:t,homeip:t,homelinux:t,homeunix:t,"in-the-band":t,"is-a-chef":t,"is-a-geek":t,"isa-geek":t,"kicks-ass":t,"office-on-the":t,podzone:t,"scrapper-site":t,selfip:t,"sells-it":t,servebbs:t,serveftp:t,thruhere:t,webhop:t,casacam:t,dynu:t,dynv6:t,twmail:t,ru:t,channelsdvr:[2,{u:t}],fastly:[0,{freetls:t,map:t,prod:[0,{a:t,global:t}],ssl:[0,{a:t,b:t,global:t}]}],fastlylb:[2,{map:t}],edgeapp:t,"keyword-on":t,"live-on":t,"server-on":t,"cdn-edges":t,heteml:t,cloudfunctions:t,"grafana-dev":t,iobb:t,moonscale:t,"in-dsl":t,"in-vpn":t,oninferno:t,botdash:t,"apps-1and1":t,ipifony:t,cloudjiffy:[2,{"fra1-de":t,"west1-us":t}],elastx:[0,{"jls-sto1":t,"jls-sto2":t,"jls-sto3":t}],massivegrid:[0,{paas:[0,{"fr-1":t,"lon-1":t,"lon-2":t,"ny-1":t,"ny-2":t,"sg-1":t}]}],saveincloud:[0,{jelastic:t,"nordeste-idc":t}],scaleforce:Je,kinghost:t,uni5:t,krellian:t,ggff:t,localcert:t,localhostcert:t,localto:n,barsy:t,memset:t,"azure-api":t,"azure-mobile":t,azureedge:t,azurefd:t,azurestaticapps:[2,{1:t,2:t,3:t,4:t,5:t,6:t,7:t,centralus:t,eastasia:t,eastus2:t,westeurope:t,westus2:t}],azurewebsites:t,cloudapp:t,trafficmanager:t,windows:[0,{core:[0,{blob:t}],servicebus:t}],mynetname:[0,{sn:t}],routingthecloud:t,bounceme:t,ddns:t,"eating-organic":t,mydissent:t,myeffect:t,mymediapc:t,mypsx:t,mysecuritycamera:t,nhlfan:t,"no-ip":t,pgafan:t,privatizehealthinsurance:t,redirectme:t,serveblog:t,serveminecraft:t,sytes:t,dnsup:t,hicam:t,"now-dns":t,ownip:t,vpndns:t,cloudycluster:t,ovh:[0,{hosting:n,webpaas:n}],rackmaze:t,myradweb:t,in:t,"subsc-pay":t,squares:t,schokokeks:t,"firewall-gateway":t,seidat:t,senseering:t,siteleaf:t,mafelo:t,myspreadshop:t,"vps-host":[2,{jelastic:[0,{atl:t,njs:t,ric:t}]}],srcf:[0,{soc:t,user:t}],supabase:t,dsmynas:t,familyds:t,ts:[2,{c:n}],torproject:[2,{pages:t}],vusercontent:t,"reserve-online":t,"community-pro":t,meinforum:t,yandexcloud:[2,{storage:t,website:t}],za:t}],nf:[1,{arts:e,com:e,firm:e,info:e,net:e,other:e,per:e,rec:e,store:e,web:e}],ng:[1,{com:e,edu:e,gov:e,i:e,mil:e,mobi:e,name:e,net:e,org:e,sch:e,biz:[2,{co:t,dl:t,go:t,lg:t,on:t}],col:t,firm:t,gen:t,ltd:t,ngo:t,plc:t}],ni:[1,{ac:e,biz:e,co:e,com:e,edu:e,gob:e,in:e,info:e,int:e,mil:e,net:e,nom:e,org:e,web:e}],nl:[1,{co:t,"hosting-cluster":t,gov:t,khplay:t,"123website":t,myspreadshop:t,transurl:n,cistron:t,demon:t}],no:[1,{fhs:e,folkebibl:e,fylkesbibl:e,idrett:e,museum:e,priv:e,vgs:e,dep:e,herad:e,kommune:e,mil:e,stat:e,aa:w,ah:w,bu:w,fm:w,hl:w,hm:w,"jan-mayen":w,mr:w,nl:w,nt:w,of:w,ol:w,oslo:w,rl:w,sf:w,st:w,svalbard:w,tm:w,tr:w,va:w,vf:w,akrehamn:e,"xn--krehamn-dxa":e,\u00E5krehamn:e,algard:e,"xn--lgrd-poac":e,\u00E5lg\u00E5rd:e,arna:e,bronnoysund:e,"xn--brnnysund-m8ac":e,br\u00F8nn\u00F8ysund:e,brumunddal:e,bryne:e,drobak:e,"xn--drbak-wua":e,dr\u00F8bak:e,egersund:e,fetsund:e,floro:e,"xn--flor-jra":e,flor\u00F8:e,fredrikstad:e,hokksund:e,honefoss:e,"xn--hnefoss-q1a":e,h\u00F8nefoss:e,jessheim:e,jorpeland:e,"xn--jrpeland-54a":e,j\u00F8rpeland:e,kirkenes:e,kopervik:e,krokstadelva:e,langevag:e,"xn--langevg-jxa":e,langev\u00E5g:e,leirvik:e,mjondalen:e,"xn--mjndalen-64a":e,mj\u00F8ndalen:e,"mo-i-rana":e,mosjoen:e,"xn--mosjen-eya":e,mosj\u00F8en:e,nesoddtangen:e,orkanger:e,osoyro:e,"xn--osyro-wua":e,os\u00F8yro:e,raholt:e,"xn--rholt-mra":e,r\u00E5holt:e,sandnessjoen:e,"xn--sandnessjen-ogb":e,sandnessj\u00F8en:e,skedsmokorset:e,slattum:e,spjelkavik:e,stathelle:e,stavern:e,stjordalshalsen:e,"xn--stjrdalshalsen-sqb":e,stj\u00F8rdalshalsen:e,tananger:e,tranby:e,vossevangen:e,aarborte:e,aejrie:e,afjord:e,"xn--fjord-lra":e,\u00E5fjord:e,agdenes:e,akershus:Ia,aknoluokta:e,"xn--koluokta-7ya57h":e,\u00E1k\u014Boluokta:e,al:e,"xn--l-1fa":e,\u00E5l:e,alaheadju:e,"xn--laheadju-7ya":e,\u00E1laheadju:e,alesund:e,"xn--lesund-hua":e,\u00E5lesund:e,alstahaug:e,alta:e,"xn--lt-liac":e,\u00E1lt\u00E1:e,alvdal:e,amli:e,"xn--mli-tla":e,\u00E5mli:e,amot:e,"xn--mot-tla":e,\u00E5mot:e,andasuolo:e,andebu:e,andoy:e,"xn--andy-ira":e,and\u00F8y:e,ardal:e,"xn--rdal-poa":e,\u00E5rdal:e,aremark:e,arendal:e,"xn--s-1fa":e,\u00E5s:e,aseral:e,"xn--seral-lra":e,\u00E5seral:e,asker:e,askim:e,askoy:e,"xn--asky-ira":e,ask\u00F8y:e,askvoll:e,asnes:e,"xn--snes-poa":e,\u00E5snes:e,audnedaln:e,aukra:e,aure:e,aurland:e,"aurskog-holand":e,"xn--aurskog-hland-jnb":e,"aurskog-h\xF8land":e,austevoll:e,austrheim:e,averoy:e,"xn--avery-yua":e,aver\u00F8y:e,badaddja:e,"xn--bdddj-mrabd":e,b\u00E5d\u00E5ddj\u00E5:e,"xn--brum-voa":e,b\u00E6rum:e,bahcavuotna:e,"xn--bhcavuotna-s4a":e,b\u00E1hcavuotna:e,bahccavuotna:e,"xn--bhccavuotna-k7a":e,b\u00E1hccavuotna:e,baidar:e,"xn--bidr-5nac":e,b\u00E1id\u00E1r:e,bajddar:e,"xn--bjddar-pta":e,b\u00E1jddar:e,balat:e,"xn--blt-elab":e,b\u00E1l\u00E1t:e,balestrand:e,ballangen:e,balsfjord:e,bamble:e,bardu:e,barum:e,batsfjord:e,"xn--btsfjord-9za":e,b\u00E5tsfjord:e,bearalvahki:e,"xn--bearalvhki-y4a":e,bearalv\u00E1hki:e,beardu:e,beiarn:e,berg:e,bergen:e,berlevag:e,"xn--berlevg-jxa":e,berlev\u00E5g:e,bievat:e,"xn--bievt-0qa":e,biev\u00E1t:e,bindal:e,birkenes:e,bjarkoy:e,"xn--bjarky-fya":e,bjark\u00F8y:e,bjerkreim:e,bjugn:e,bodo:e,"xn--bod-2na":e,bod\u00F8:e,bokn:e,bomlo:e,"xn--bmlo-gra":e,b\u00F8mlo:e,bremanger:e,bronnoy:e,"xn--brnny-wuac":e,br\u00F8nn\u00F8y:e,budejju:e,buskerud:Ia,bygland:e,bykle:e,cahcesuolo:e,"xn--hcesuolo-7ya35b":e,\u010D\u00E1hcesuolo:e,davvenjarga:e,"xn--davvenjrga-y4a":e,davvenj\u00E1rga:e,davvesiida:e,deatnu:e,dielddanuorri:e,divtasvuodna:e,divttasvuotna:e,donna:e,"xn--dnna-gra":e,d\u00F8nna:e,dovre:e,drammen:e,drangedal:e,dyroy:e,"xn--dyry-ira":e,dyr\u00F8y:e,eid:e,eidfjord:e,eidsberg:e,eidskog:e,eidsvoll:e,eigersund:e,elverum:e,enebakk:e,engerdal:e,etne:e,etnedal:e,evenassi:e,"xn--eveni-0qa01ga":e,even\u00E1\u0161\u0161i:e,evenes:e,"evje-og-hornnes":e,farsund:e,fauske:e,fedje:e,fet:e,finnoy:e,"xn--finny-yua":e,finn\u00F8y:e,fitjar:e,fjaler:e,fjell:e,fla:e,"xn--fl-zia":e,fl\u00E5:e,flakstad:e,flatanger:e,flekkefjord:e,flesberg:e,flora:e,folldal:e,forde:e,"xn--frde-gra":e,f\u00F8rde:e,forsand:e,fosnes:e,"xn--frna-woa":e,fr\u00E6na:e,frana:e,frei:e,frogn:e,froland:e,frosta:e,froya:e,"xn--frya-hra":e,fr\u00F8ya:e,fuoisku:e,fuossko:e,fusa:e,fyresdal:e,gaivuotna:e,"xn--givuotna-8ya":e,g\u00E1ivuotna:e,galsa:e,"xn--gls-elac":e,g\u00E1ls\u00E1:e,gamvik:e,gangaviika:e,"xn--ggaviika-8ya47h":e,g\u00E1\u014Bgaviika:e,gaular:e,gausdal:e,giehtavuoatna:e,gildeskal:e,"xn--gildeskl-g0a":e,gildesk\u00E5l:e,giske:e,gjemnes:e,gjerdrum:e,gjerstad:e,gjesdal:e,gjovik:e,"xn--gjvik-wua":e,gj\u00F8vik:e,gloppen:e,gol:e,gran:e,grane:e,granvin:e,gratangen:e,grimstad:e,grong:e,grue:e,gulen:e,guovdageaidnu:e,ha:e,"xn--h-2fa":e,h\u00E5:e,habmer:e,"xn--hbmer-xqa":e,h\u00E1bmer:e,hadsel:e,"xn--hgebostad-g3a":e,h\u00E6gebostad:e,hagebostad:e,halden:e,halsa:e,hamar:e,hamaroy:e,hammarfeasta:e,"xn--hmmrfeasta-s4ac":e,h\u00E1mm\u00E1rfeasta:e,hammerfest:e,hapmir:e,"xn--hpmir-xqa":e,h\u00E1pmir:e,haram:e,hareid:e,harstad:e,hasvik:e,hattfjelldal:e,haugesund:e,hedmark:[0,{os:e,valer:e,"xn--vler-qoa":e,v\u00E5ler:e}],hemne:e,hemnes:e,hemsedal:e,hitra:e,hjartdal:e,hjelmeland:e,hobol:e,"xn--hobl-ira":e,hob\u00F8l:e,hof:e,hol:e,hole:e,holmestrand:e,holtalen:e,"xn--holtlen-hxa":e,holt\u00E5len:e,hordaland:[0,{os:e}],hornindal:e,horten:e,hoyanger:e,"xn--hyanger-q1a":e,h\u00F8yanger:e,hoylandet:e,"xn--hylandet-54a":e,h\u00F8ylandet:e,hurdal:e,hurum:e,hvaler:e,hyllestad:e,ibestad:e,inderoy:e,"xn--indery-fya":e,inder\u00F8y:e,iveland:e,ivgu:e,jevnaker:e,jolster:e,"xn--jlster-bya":e,j\u00F8lster:e,jondal:e,kafjord:e,"xn--kfjord-iua":e,k\u00E5fjord:e,karasjohka:e,"xn--krjohka-hwab49j":e,k\u00E1r\u00E1\u0161johka:e,karasjok:e,karlsoy:e,karmoy:e,"xn--karmy-yua":e,karm\u00F8y:e,kautokeino:e,klabu:e,"xn--klbu-woa":e,kl\u00E6bu:e,klepp:e,kongsberg:e,kongsvinger:e,kraanghke:e,"xn--kranghke-b0a":e,kr\u00E5anghke:e,kragero:e,"xn--krager-gya":e,krager\u00F8:e,kristiansand:e,kristiansund:e,krodsherad:e,"xn--krdsherad-m8a":e,kr\u00F8dsherad:e,"xn--kvfjord-nxa":e,kv\u00E6fjord:e,"xn--kvnangen-k0a":e,kv\u00E6nangen:e,kvafjord:e,kvalsund:e,kvam:e,kvanangen:e,kvinesdal:e,kvinnherad:e,kviteseid:e,kvitsoy:e,"xn--kvitsy-fya":e,kvits\u00F8y:e,laakesvuemie:e,"xn--lrdal-sra":e,l\u00E6rdal:e,lahppi:e,"xn--lhppi-xqa":e,l\u00E1hppi:e,lardal:e,larvik:e,lavagis:e,lavangen:e,leangaviika:e,"xn--leagaviika-52b":e,lea\u014Bgaviika:e,lebesby:e,leikanger:e,leirfjord:e,leka:e,leksvik:e,lenvik:e,lerdal:e,lesja:e,levanger:e,lier:e,lierne:e,lillehammer:e,lillesand:e,lindas:e,"xn--linds-pra":e,lind\u00E5s:e,lindesnes:e,loabat:e,"xn--loabt-0qa":e,loab\u00E1t:e,lodingen:e,"xn--ldingen-q1a":e,l\u00F8dingen:e,lom:e,loppa:e,lorenskog:e,"xn--lrenskog-54a":e,l\u00F8renskog:e,loten:e,"xn--lten-gra":e,l\u00F8ten:e,lund:e,lunner:e,luroy:e,"xn--lury-ira":e,lur\u00F8y:e,luster:e,lyngdal:e,lyngen:e,malatvuopmi:e,"xn--mlatvuopmi-s4a":e,m\u00E1latvuopmi:e,malselv:e,"xn--mlselv-iua":e,m\u00E5lselv:e,malvik:e,mandal:e,marker:e,marnardal:e,masfjorden:e,masoy:e,"xn--msy-ula0h":e,m\u00E5s\u00F8y:e,"matta-varjjat":e,"xn--mtta-vrjjat-k7af":e,"m\xE1tta-v\xE1rjjat":e,meland:e,meldal:e,melhus:e,meloy:e,"xn--mely-ira":e,mel\u00F8y:e,meraker:e,"xn--merker-kua":e,mer\u00E5ker:e,midsund:e,"midtre-gauldal":e,moareke:e,"xn--moreke-jua":e,mo\u00E5reke:e,modalen:e,modum:e,molde:e,"more-og-romsdal":[0,{heroy:e,sande:e}],"xn--mre-og-romsdal-qqb":[0,{"xn--hery-ira":e,sande:e}],"m\xF8re-og-romsdal":[0,{her\u00F8y:e,sande:e}],moskenes:e,moss:e,mosvik:e,muosat:e,"xn--muost-0qa":e,muos\u00E1t:e,naamesjevuemie:e,"xn--nmesjevuemie-tcba":e,n\u00E5\u00E5mesjevuemie:e,"xn--nry-yla5g":e,n\u00E6r\u00F8y:e,namdalseid:e,namsos:e,namsskogan:e,nannestad:e,naroy:e,narviika:e,narvik:e,naustdal:e,navuotna:e,"xn--nvuotna-hwa":e,n\u00E1vuotna:e,"nedre-eiker":e,nesna:e,nesodden:e,nesseby:e,nesset:e,nissedal:e,nittedal:e,"nord-aurdal":e,"nord-fron":e,"nord-odal":e,norddal:e,nordkapp:e,nordland:[0,{bo:e,"xn--b-5ga":e,b\u00F8:e,heroy:e,"xn--hery-ira":e,her\u00F8y:e}],"nordre-land":e,nordreisa:e,"nore-og-uvdal":e,notodden:e,notteroy:e,"xn--nttery-byae":e,n\u00F8tter\u00F8y:e,odda:e,oksnes:e,"xn--ksnes-uua":e,\u00F8ksnes:e,omasvuotna:e,oppdal:e,oppegard:e,"xn--oppegrd-ixa":e,oppeg\u00E5rd:e,orkdal:e,orland:e,"xn--rland-uua":e,\u00F8rland:e,orskog:e,"xn--rskog-uua":e,\u00F8rskog:e,orsta:e,"xn--rsta-fra":e,\u00F8rsta:e,osen:e,osteroy:e,"xn--ostery-fya":e,oster\u00F8y:e,ostfold:[0,{valer:e}],"xn--stfold-9xa":[0,{"xn--vler-qoa":e}],\u00F8stfold:[0,{v\u00E5ler:e}],"ostre-toten":e,"xn--stre-toten-zcb":e,"\xF8stre-toten":e,overhalla:e,"ovre-eiker":e,"xn--vre-eiker-k8a":e,"\xF8vre-eiker":e,oyer:e,"xn--yer-zna":e,\u00F8yer:e,oygarden:e,"xn--ygarden-p1a":e,\u00F8ygarden:e,"oystre-slidre":e,"xn--ystre-slidre-ujb":e,"\xF8ystre-slidre":e,porsanger:e,porsangu:e,"xn--porsgu-sta26f":e,pors\u00E1\u014Bgu:e,porsgrunn:e,rade:e,"xn--rde-ula":e,r\u00E5de:e,radoy:e,"xn--rady-ira":e,rad\u00F8y:e,"xn--rlingen-mxa":e,r\u00E6lingen:e,rahkkeravju:e,"xn--rhkkervju-01af":e,r\u00E1hkker\u00E1vju:e,raisa:e,"xn--risa-5na":e,r\u00E1isa:e,rakkestad:e,ralingen:e,rana:e,randaberg:e,rauma:e,rendalen:e,rennebu:e,rennesoy:e,"xn--rennesy-v1a":e,rennes\u00F8y:e,rindal:e,ringebu:e,ringerike:e,ringsaker:e,risor:e,"xn--risr-ira":e,ris\u00F8r:e,rissa:e,roan:e,rodoy:e,"xn--rdy-0nab":e,r\u00F8d\u00F8y:e,rollag:e,romsa:e,romskog:e,"xn--rmskog-bya":e,r\u00F8mskog:e,roros:e,"xn--rros-gra":e,r\u00F8ros:e,rost:e,"xn--rst-0na":e,r\u00F8st:e,royken:e,"xn--ryken-vua":e,r\u00F8yken:e,royrvik:e,"xn--ryrvik-bya":e,r\u00F8yrvik:e,ruovat:e,rygge:e,salangen:e,salat:e,"xn--slat-5na":e,s\u00E1lat:e,"xn--slt-elab":e,s\u00E1l\u00E1t:e,saltdal:e,samnanger:e,sandefjord:e,sandnes:e,sandoy:e,"xn--sandy-yua":e,sand\u00F8y:e,sarpsborg:e,sauda:e,sauherad:e,sel:e,selbu:e,selje:e,seljord:e,siellak:e,sigdal:e,siljan:e,sirdal:e,skanit:e,"xn--sknit-yqa":e,sk\u00E1nit:e,skanland:e,"xn--sknland-fxa":e,sk\u00E5nland:e,skaun:e,skedsmo:e,ski:e,skien:e,skierva:e,"xn--skierv-uta":e,skierv\u00E1:e,skiptvet:e,skjak:e,"xn--skjk-soa":e,skj\u00E5k:e,skjervoy:e,"xn--skjervy-v1a":e,skjerv\u00F8y:e,skodje:e,smola:e,"xn--smla-hra":e,sm\u00F8la:e,snaase:e,"xn--snase-nra":e,sn\u00E5ase:e,snasa:e,"xn--snsa-roa":e,sn\u00E5sa:e,snillfjord:e,snoasa:e,sogndal:e,sogne:e,"xn--sgne-gra":e,s\u00F8gne:e,sokndal:e,sola:e,solund:e,somna:e,"xn--smna-gra":e,s\u00F8mna:e,"sondre-land":e,"xn--sndre-land-0cb":e,"s\xF8ndre-land":e,songdalen:e,"sor-aurdal":e,"xn--sr-aurdal-l8a":e,"s\xF8r-aurdal":e,"sor-fron":e,"xn--sr-fron-q1a":e,"s\xF8r-fron":e,"sor-odal":e,"xn--sr-odal-q1a":e,"s\xF8r-odal":e,"sor-varanger":e,"xn--sr-varanger-ggb":e,"s\xF8r-varanger":e,sorfold:e,"xn--srfold-bya":e,s\u00F8rfold:e,sorreisa:e,"xn--srreisa-q1a":e,s\u00F8rreisa:e,sortland:e,sorum:e,"xn--srum-gra":e,s\u00F8rum:e,spydeberg:e,stange:e,stavanger:e,steigen:e,steinkjer:e,stjordal:e,"xn--stjrdal-s1a":e,stj\u00F8rdal:e,stokke:e,"stor-elvdal":e,stord:e,stordal:e,storfjord:e,strand:e,stranda:e,stryn:e,sula:e,suldal:e,sund:e,sunndal:e,surnadal:e,sveio:e,svelvik:e,sykkylven:e,tana:e,telemark:[0,{bo:e,"xn--b-5ga":e,b\u00F8:e}],time:e,tingvoll:e,tinn:e,tjeldsund:e,tjome:e,"xn--tjme-hra":e,tj\u00F8me:e,tokke:e,tolga:e,tonsberg:e,"xn--tnsberg-q1a":e,t\u00F8nsberg:e,torsken:e,"xn--trna-woa":e,tr\u00E6na:e,trana:e,tranoy:e,"xn--trany-yua":e,tran\u00F8y:e,troandin:e,trogstad:e,"xn--trgstad-r1a":e,tr\u00F8gstad:e,tromsa:e,tromso:e,"xn--troms-zua":e,troms\u00F8:e,trondheim:e,trysil:e,tvedestrand:e,tydal:e,tynset:e,tysfjord:e,tysnes:e,"xn--tysvr-vra":e,tysv\u00E6r:e,tysvar:e,ullensaker:e,ullensvang:e,ulvik:e,unjarga:e,"xn--unjrga-rta":e,unj\u00E1rga:e,utsira:e,vaapste:e,vadso:e,"xn--vads-jra":e,vads\u00F8:e,"xn--vry-yla5g":e,v\u00E6r\u00F8y:e,vaga:e,"xn--vg-yiab":e,v\u00E5g\u00E5:e,vagan:e,"xn--vgan-qoa":e,v\u00E5gan:e,vagsoy:e,"xn--vgsy-qoa0j":e,v\u00E5gs\u00F8y:e,vaksdal:e,valle:e,vang:e,vanylven:e,vardo:e,"xn--vard-jra":e,vard\u00F8:e,varggat:e,"xn--vrggt-xqad":e,v\u00E1rgg\u00E1t:e,varoy:e,vefsn:e,vega:e,vegarshei:e,"xn--vegrshei-c0a":e,veg\u00E5rshei:e,vennesla:e,verdal:e,verran:e,vestby:e,vestfold:[0,{sande:e}],vestnes:e,"vestre-slidre":e,"vestre-toten":e,vestvagoy:e,"xn--vestvgy-ixa6o":e,vestv\u00E5g\u00F8y:e,vevelstad:e,vik:e,vikna:e,vindafjord:e,voagat:e,volda:e,voss:e,co:t,"123hjemmeside":t,myspreadshop:t}],np:k,nr:Ta,nu:[1,{merseine:t,mine:t,shacknet:t,enterprisecloud:t}],nz:[1,{ac:e,co:e,cri:e,geek:e,gen:e,govt:e,health:e,iwi:e,kiwi:e,maori:e,"xn--mori-qsa":e,m\u0101ori:e,mil:e,net:e,org:e,parliament:e,school:e,cloudns:t}],om:[1,{co:e,com:e,edu:e,gov:e,med:e,museum:e,net:e,org:e,pro:e}],onion:e,org:[1,{altervista:t,pimienta:t,poivron:t,potager:t,sweetpepper:t,cdn77:[0,{c:t,rsc:t}],"cdn77-secure":[0,{origin:[0,{ssl:t}]}],ae:t,cloudns:t,"ip-dynamic":t,ddnss:t,dpdns:t,duckdns:t,tunk:t,blogdns:t,blogsite:t,boldlygoingnowhere:t,dnsalias:t,dnsdojo:t,doesntexist:t,dontexist:t,doomdns:t,dvrdns:t,dynalias:t,dyndns:[2,{go:t,home:t}],endofinternet:t,endoftheinternet:t,"from-me":t,"game-host":t,gotdns:t,"hobby-site":t,homedns:t,homeftp:t,homelinux:t,homeunix:t,"is-a-bruinsfan":t,"is-a-candidate":t,"is-a-celticsfan":t,"is-a-chef":t,"is-a-geek":t,"is-a-knight":t,"is-a-linux-user":t,"is-a-patsfan":t,"is-a-soxfan":t,"is-found":t,"is-lost":t,"is-saved":t,"is-very-bad":t,"is-very-evil":t,"is-very-good":t,"is-very-nice":t,"is-very-sweet":t,"isa-geek":t,"kicks-ass":t,misconfused:t,podzone:t,readmyblog:t,selfip:t,sellsyourhome:t,servebbs:t,serveftp:t,servegame:t,"stuff-4-sale":t,webhop:t,accesscam:t,camdvr:t,freeddns:t,mywire:t,webredirect:t,twmail:t,eu:[2,{al:t,asso:t,at:t,au:t,be:t,bg:t,ca:t,cd:t,ch:t,cn:t,cy:t,cz:t,de:t,dk:t,edu:t,ee:t,es:t,fi:t,fr:t,gr:t,hr:t,hu:t,ie:t,il:t,in:t,int:t,is:t,it:t,jp:t,kr:t,lt:t,lu:t,lv:t,me:t,mk:t,mt:t,my:t,net:t,ng:t,nl:t,no:t,nz:t,pl:t,pt:t,ro:t,ru:t,se:t,si:t,sk:t,tr:t,uk:t,us:t}],fedorainfracloud:t,fedorapeople:t,fedoraproject:[0,{cloud:t,os:Ze,stg:[0,{os:Ze}]}],freedesktop:t,hatenadiary:t,hepforge:t,"in-dsl":t,"in-vpn":t,js:t,barsy:t,mayfirst:t,routingthecloud:t,bmoattachments:t,"cable-modem":t,collegefan:t,couchpotatofries:t,hopto:t,mlbfan:t,myftp:t,mysecuritycamera:t,nflfan:t,"no-ip":t,"read-books":t,ufcfan:t,zapto:t,dynserv:t,"now-dns":t,"is-local":t,httpbin:t,pubtls:t,jpn:t,"my-firewall":t,myfirewall:t,spdns:t,"small-web":t,dsmynas:t,familyds:t,teckids:Qe,tuxfamily:t,diskstation:t,hk:t,us:t,toolforge:t,wmcloud:t,wmflabs:t,za:t}],pa:[1,{abo:e,ac:e,com:e,edu:e,gob:e,ing:e,med:e,net:e,nom:e,org:e,sld:e}],pe:[1,{com:e,edu:e,gob:e,mil:e,net:e,nom:e,org:e}],pf:[1,{com:e,edu:e,org:e}],pg:k,ph:[1,{com:e,edu:e,gov:e,i:e,mil:e,net:e,ngo:e,org:e,cloudns:t}],pk:[1,{ac:e,biz:e,com:e,edu:e,fam:e,gkp:e,gob:e,gog:e,gok:e,gop:e,gos:e,gov:e,net:e,org:e,web:e}],pl:[1,{com:e,net:e,org:e,agro:e,aid:e,atm:e,auto:e,biz:e,edu:e,gmina:e,gsm:e,info:e,mail:e,media:e,miasta:e,mil:e,nieruchomosci:e,nom:e,pc:e,powiat:e,priv:e,realestate:e,rel:e,sex:e,shop:e,sklep:e,sos:e,szkola:e,targi:e,tm:e,tourism:e,travel:e,turystyka:e,gov:[1,{ap:e,griw:e,ic:e,is:e,kmpsp:e,konsulat:e,kppsp:e,kwp:e,kwpsp:e,mup:e,mw:e,oia:e,oirm:e,oke:e,oow:e,oschr:e,oum:e,pa:e,pinb:e,piw:e,po:e,pr:e,psp:e,psse:e,pup:e,rzgw:e,sa:e,sdn:e,sko:e,so:e,sr:e,starostwo:e,ug:e,ugim:e,um:e,umig:e,upow:e,uppo:e,us:e,uw:e,uzs:e,wif:e,wiih:e,winb:e,wios:e,witd:e,wiw:e,wkz:e,wsa:e,wskr:e,wsse:e,wuoz:e,wzmiuw:e,zp:e,zpisdn:e}],augustow:e,"babia-gora":e,bedzin:e,beskidy:e,bialowieza:e,bialystok:e,bielawa:e,bieszczady:e,boleslawiec:e,bydgoszcz:e,bytom:e,cieszyn:e,czeladz:e,czest:e,dlugoleka:e,elblag:e,elk:e,glogow:e,gniezno:e,gorlice:e,grajewo:e,ilawa:e,jaworzno:e,"jelenia-gora":e,jgora:e,kalisz:e,karpacz:e,kartuzy:e,kaszuby:e,katowice:e,"kazimierz-dolny":e,kepno:e,ketrzyn:e,klodzko:e,kobierzyce:e,kolobrzeg:e,konin:e,konskowola:e,kutno:e,lapy:e,lebork:e,legnica:e,lezajsk:e,limanowa:e,lomza:e,lowicz:e,lubin:e,lukow:e,malbork:e,malopolska:e,mazowsze:e,mazury:e,mielec:e,mielno:e,mragowo:e,naklo:e,nowaruda:e,nysa:e,olawa:e,olecko:e,olkusz:e,olsztyn:e,opoczno:e,opole:e,ostroda:e,ostroleka:e,ostrowiec:e,ostrowwlkp:e,pila:e,pisz:e,podhale:e,podlasie:e,polkowice:e,pomorskie:e,pomorze:e,prochowice:e,pruszkow:e,przeworsk:e,pulawy:e,radom:e,"rawa-maz":e,rybnik:e,rzeszow:e,sanok:e,sejny:e,skoczow:e,slask:e,slupsk:e,sosnowiec:e,"stalowa-wola":e,starachowice:e,stargard:e,suwalki:e,swidnica:e,swiebodzin:e,swinoujscie:e,szczecin:e,szczytno:e,tarnobrzeg:e,tgory:e,turek:e,tychy:e,ustka:e,walbrzych:e,warmia:e,warszawa:e,waw:e,wegrow:e,wielun:e,wlocl:e,wloclawek:e,wodzislaw:e,wolomin:e,wroclaw:e,zachpomor:e,zagan:e,zarow:e,zgora:e,zgorzelec:e,art:t,gliwice:t,krakow:t,poznan:t,wroc:t,zakopane:t,beep:t,"ecommerce-shop":t,cfolks:t,dfirma:t,dkonto:t,you2:t,shoparena:t,homesklep:t,sdscloud:t,unicloud:t,lodz:t,pabianice:t,plock:t,sieradz:t,skierniewice:t,zgierz:t,krasnik:t,leczna:t,lubartow:t,lublin:t,poniatowa:t,swidnik:t,co:t,torun:t,simplesite:t,myspreadshop:t,gda:t,gdansk:t,gdynia:t,med:t,sopot:t,bielsko:t}],pm:[1,{own:t,name:t}],pn:[1,{co:e,edu:e,gov:e,net:e,org:e}],post:e,pr:[1,{biz:e,com:e,edu:e,gov:e,info:e,isla:e,name:e,net:e,org:e,pro:e,ac:e,est:e,prof:e}],pro:[1,{aaa:e,aca:e,acct:e,avocat:e,bar:e,cpa:e,eng:e,jur:e,law:e,med:e,recht:e,"12chars":t,cloudns:t,barsy:t,ngrok:t}],ps:[1,{com:e,edu:e,gov:e,net:e,org:e,plo:e,sec:e}],pt:[1,{com:e,edu:e,gov:e,int:e,net:e,nome:e,org:e,publ:e,"123paginaweb":t}],pw:[1,{gov:e,cloudns:t,x443:t}],py:[1,{com:e,coop:e,edu:e,gov:e,mil:e,net:e,org:e}],qa:[1,{com:e,edu:e,gov:e,mil:e,name:e,net:e,org:e,sch:e}],re:[1,{asso:e,com:e,netlib:t,can:t}],ro:[1,{arts:e,com:e,firm:e,info:e,nom:e,nt:e,org:e,rec:e,store:e,tm:e,www:e,co:t,shop:t,barsy:t}],rs:[1,{ac:e,co:e,edu:e,gov:e,in:e,org:e,brendly:Aa,barsy:t,ox:t}],ru:[1,{ac:t,edu:t,gov:t,int:t,mil:t,eurodir:t,adygeya:t,bashkiria:t,bir:t,cbg:t,com:t,dagestan:t,grozny:t,kalmykia:t,kustanai:t,marine:t,mordovia:t,msk:t,mytis:t,nalchik:t,nov:t,pyatigorsk:t,spb:t,vladikavkaz:t,vladimir:t,na4u:t,mircloud:t,myjino:[2,{hosting:n,landing:n,spectrum:n,vps:n}],cldmail:[0,{hb:t}],mcdir:[2,{vps:t}],mcpre:t,net:t,org:t,pp:t,lk3:t,ras:t}],rw:[1,{ac:e,co:e,coop:e,gov:e,mil:e,net:e,org:e}],sa:[1,{com:e,edu:e,gov:e,med:e,net:e,org:e,pub:e,sch:e}],sb:a,sc:a,sd:[1,{com:e,edu:e,gov:e,info:e,med:e,net:e,org:e,tv:e}],se:[1,{a:e,ac:e,b:e,bd:e,brand:e,c:e,d:e,e,f:e,fh:e,fhsk:e,fhv:e,g:e,h:e,i:e,k:e,komforb:e,kommunalforbund:e,komvux:e,l:e,lanbib:e,m:e,n:e,naturbruksgymn:e,o:e,org:e,p:e,parti:e,pp:e,press:e,r:e,s:e,t:e,tm:e,u:e,w:e,x:e,y:e,z:e,com:t,iopsys:t,"123minsida":t,itcouldbewor:t,myspreadshop:t}],sg:[1,{com:e,edu:e,gov:e,net:e,org:e,enscaled:t}],sh:[1,{com:e,gov:e,mil:e,net:e,org:e,hashbang:t,botda:t,platform:[0,{ent:t,eu:t,us:t}],now:t}],si:[1,{f5:t,gitapp:t,gitpage:t}],sj:e,sk:e,sl:a,sm:e,sn:[1,{art:e,com:e,edu:e,gouv:e,org:e,perso:e,univ:e}],so:[1,{com:e,edu:e,gov:e,me:e,net:e,org:e,surveys:t}],sr:e,ss:[1,{biz:e,co:e,com:e,edu:e,gov:e,me:e,net:e,org:e,sch:e}],st:[1,{co:e,com:e,consulado:e,edu:e,embaixada:e,mil:e,net:e,org:e,principe:e,saotome:e,store:e,helioho:t,kirara:t,noho:t}],su:[1,{abkhazia:t,adygeya:t,aktyubinsk:t,arkhangelsk:t,armenia:t,ashgabad:t,azerbaijan:t,balashov:t,bashkiria:t,bryansk:t,bukhara:t,chimkent:t,dagestan:t,"east-kazakhstan":t,exnet:t,georgia:t,grozny:t,ivanovo:t,jambyl:t,kalmykia:t,kaluga:t,karacol:t,karaganda:t,karelia:t,khakassia:t,krasnodar:t,kurgan:t,kustanai:t,lenug:t,mangyshlak:t,mordovia:t,msk:t,murmansk:t,nalchik:t,navoi:t,"north-kazakhstan":t,nov:t,obninsk:t,penza:t,pokrovsk:t,sochi:t,spb:t,tashkent:t,termez:t,togliatti:t,troitsk:t,tselinograd:t,tula:t,tuva:t,vladikavkaz:t,vladimir:t,vologda:t}],sv:[1,{com:e,edu:e,gob:e,org:e,red:e}],sx:l,sy:o,sz:[1,{ac:e,co:e,org:e}],tc:e,td:e,tel:e,tf:[1,{sch:t}],tg:e,th:[1,{ac:e,co:e,go:e,in:e,mi:e,net:e,or:e,online:t,shop:t}],tj:[1,{ac:e,biz:e,co:e,com:e,edu:e,go:e,gov:e,int:e,mil:e,name:e,net:e,nic:e,org:e,test:e,web:e}],tk:e,tl:l,tm:[1,{co:e,com:e,edu:e,gov:e,mil:e,net:e,nom:e,org:e}],tn:[1,{com:e,ens:e,fin:e,gov:e,ind:e,info:e,intl:e,mincom:e,nat:e,net:e,org:e,perso:e,tourism:e,orangecloud:t}],to:[1,{611:t,com:e,edu:e,gov:e,mil:e,net:e,org:e,oya:t,x0:t,quickconnect:pa,vpnplus:t}],tr:[1,{av:e,bbs:e,bel:e,biz:e,com:e,dr:e,edu:e,gen:e,gov:e,info:e,k12:e,kep:e,mil:e,name:e,net:e,org:e,pol:e,tel:e,tsk:e,tv:e,web:e,nc:l}],tt:[1,{biz:e,co:e,com:e,edu:e,gov:e,info:e,mil:e,name:e,net:e,org:e,pro:e}],tv:[1,{"better-than":t,dyndns:t,"on-the-web":t,"worse-than":t,from:t,sakura:t}],tw:[1,{club:e,com:[1,{mymailer:t}],ebiz:e,edu:e,game:e,gov:e,idv:e,mil:e,net:e,org:e,url:t,mydns:t}],tz:[1,{ac:e,co:e,go:e,hotel:e,info:e,me:e,mil:e,mobi:e,ne:e,or:e,sc:e,tv:e}],ua:[1,{com:e,edu:e,gov:e,in:e,net:e,org:e,cherkassy:e,cherkasy:e,chernigov:e,chernihiv:e,chernivtsi:e,chernovtsy:e,ck:e,cn:e,cr:e,crimea:e,cv:e,dn:e,dnepropetrovsk:e,dnipropetrovsk:e,donetsk:e,dp:e,if:e,"ivano-frankivsk":e,kh:e,kharkiv:e,kharkov:e,kherson:e,khmelnitskiy:e,khmelnytskyi:e,kiev:e,kirovograd:e,km:e,kr:e,kropyvnytskyi:e,krym:e,ks:e,kv:e,kyiv:e,lg:e,lt:e,lugansk:e,luhansk:e,lutsk:e,lv:e,lviv:e,mk:e,mykolaiv:e,nikolaev:e,od:e,odesa:e,odessa:e,pl:e,poltava:e,rivne:e,rovno:e,rv:e,sb:e,sebastopol:e,sevastopol:e,sm:e,sumy:e,te:e,ternopil:e,uz:e,uzhgorod:e,uzhhorod:e,vinnica:e,vinnytsia:e,vn:e,volyn:e,yalta:e,zakarpattia:e,zaporizhzhe:e,zaporizhzhia:e,zhitomir:e,zhytomyr:e,zp:e,zt:e,cc:t,inf:t,ltd:t,cx:t,ie:t,biz:t,co:t,pp:t,v:t}],ug:[1,{ac:e,co:e,com:e,edu:e,go:e,gov:e,mil:e,ne:e,or:e,org:e,sc:e,us:e}],uk:[1,{ac:e,co:[1,{bytemark:[0,{dh:t,vm:t}],layershift:Je,barsy:t,barsyonline:t,retrosnub:Sa,"nh-serv":t,"no-ip":t,adimo:t,myspreadshop:t}],gov:[1,{api:t,campaign:t,service:t}],ltd:e,me:e,net:e,nhs:e,org:[1,{glug:t,lug:t,lugs:t,affinitylottery:t,raffleentry:t,weeklylottery:t}],plc:e,police:e,sch:k,conn:t,copro:t,hosp:t,"independent-commission":t,"independent-inquest":t,"independent-inquiry":t,"independent-panel":t,"independent-review":t,"public-inquiry":t,"royal-commission":t,pymnt:t,barsy:t,nimsite:t,oraclegovcloudapps:n}],us:[1,{dni:e,isa:e,nsn:e,ak:p,al:p,ar:p,as:p,az:p,ca:p,co:p,ct:p,dc:p,de:[1,{cc:e,lib:t}],fl:p,ga:p,gu:p,hi:Ee,ia:p,id:p,il:p,in:p,ks:p,ky:p,la:p,ma:[1,{k12:[1,{chtr:e,paroch:e,pvt:e}],cc:e,lib:e}],md:p,me:p,mi:[1,{k12:e,cc:e,lib:e,"ann-arbor":e,cog:e,dst:e,eaton:e,gen:e,mus:e,tec:e,washtenaw:e}],mn:p,mo:p,ms:p,mt:p,nc:p,nd:Ee,ne:p,nh:p,nj:p,nm:p,nv:p,ny:p,oh:p,ok:p,or:p,pa:p,pr:p,ri:Ee,sc:p,sd:Ee,tn:p,tx:p,ut:p,va:p,vi:p,vt:p,wa:p,wi:p,wv:[1,{cc:e}],wy:p,cloudns:t,"is-by":t,"land-4-sale":t,"stuff-4-sale":t,heliohost:t,enscaled:[0,{phx:t}],mircloud:t,ngo:t,golffan:t,noip:t,pointto:t,freeddns:t,srv:[2,{gh:t,gl:t}],platterp:t,servername:t}],uy:[1,{com:e,edu:e,gub:e,mil:e,net:e,org:e}],uz:[1,{co:e,com:e,net:e,org:e}],va:e,vc:[1,{com:e,edu:e,gov:e,mil:e,net:e,org:e,gv:[2,{d:t}],"0e":n,mydns:t}],ve:[1,{arts:e,bib:e,co:e,com:e,e12:e,edu:e,emprende:e,firm:e,gob:e,gov:e,info:e,int:e,mil:e,net:e,nom:e,org:e,rar:e,rec:e,store:e,tec:e,web:e}],vg:[1,{edu:e}],vi:[1,{co:e,com:e,k12:e,net:e,org:e}],vn:[1,{ac:e,ai:e,biz:e,com:e,edu:e,gov:e,health:e,id:e,info:e,int:e,io:e,name:e,net:e,org:e,pro:e,angiang:e,bacgiang:e,backan:e,baclieu:e,bacninh:e,"baria-vungtau":e,bentre:e,binhdinh:e,binhduong:e,binhphuoc:e,binhthuan:e,camau:e,cantho:e,caobang:e,daklak:e,daknong:e,danang:e,dienbien:e,dongnai:e,dongthap:e,gialai:e,hagiang:e,haiduong:e,haiphong:e,hanam:e,hanoi:e,hatinh:e,haugiang:e,hoabinh:e,hungyen:e,khanhhoa:e,kiengiang:e,kontum:e,laichau:e,lamdong:e,langson:e,laocai:e,longan:e,namdinh:e,nghean:e,ninhbinh:e,ninhthuan:e,phutho:e,phuyen:e,quangbinh:e,quangnam:e,quangngai:e,quangninh:e,quangtri:e,soctrang:e,sonla:e,tayninh:e,thaibinh:e,thainguyen:e,thanhhoa:e,thanhphohochiminh:e,thuathienhue:e,tiengiang:e,travinh:e,tuyenquang:e,vinhlong:e,vinhphuc:e,yenbai:e}],vu:xe,wf:[1,{biz:t,sch:t}],ws:[1,{com:e,edu:e,gov:e,net:e,org:e,advisor:n,cloud66:t,dyndns:t,mypets:t}],yt:[1,{org:t}],"xn--mgbaam7a8h":e,\u0627\u0645\u0627\u0631\u0627\u062A:e,"xn--y9a3aq":e,\u0570\u0561\u0575:e,"xn--54b7fta0cc":e,\u09AC\u09BE\u0982\u09B2\u09BE:e,"xn--90ae":e,\u0431\u0433:e,"xn--mgbcpq6gpa1a":e,\u0627\u0644\u0628\u062D\u0631\u064A\u0646:e,"xn--90ais":e,\u0431\u0435\u043B:e,"xn--fiqs8s":e,\u4E2D\u56FD:e,"xn--fiqz9s":e,\u4E2D\u570B:e,"xn--lgbbat1ad8j":e,\u0627\u0644\u062C\u0632\u0627\u0626\u0631:e,"xn--wgbh1c":e,\u0645\u0635\u0631:e,"xn--e1a4c":e,\u0435\u044E:e,"xn--qxa6a":e,\u03B5\u03C5:e,"xn--mgbah1a3hjkrd":e,\u0645\u0648\u0631\u064A\u062A\u0627\u0646\u064A\u0627:e,"xn--node":e,\u10D2\u10D4:e,"xn--qxam":e,\u03B5\u03BB:e,"xn--j6w193g":[1,{"xn--gmqw5a":e,"xn--55qx5d":e,"xn--mxtq1m":e,"xn--wcvs22d":e,"xn--uc0atv":e,"xn--od0alg":e}],\u9999\u6E2F:[1,{\u500B\u4EBA:e,\u516C\u53F8:e,\u653F\u5E9C:e,\u6559\u80B2:e,\u7D44\u7E54:e,\u7DB2\u7D61:e}],"xn--2scrj9c":e,\u0CAD\u0CBE\u0CB0\u0CA4:e,"xn--3hcrj9c":e,\u0B2D\u0B3E\u0B30\u0B24:e,"xn--45br5cyl":e,\u09AD\u09BE\u09F0\u09A4:e,"xn--h2breg3eve":e,\u092D\u093E\u0930\u0924\u092E\u094D:e,"xn--h2brj9c8c":e,\u092D\u093E\u0930\u094B\u0924:e,"xn--mgbgu82a":e,\u0680\u0627\u0631\u062A:e,"xn--rvc1e0am3e":e,\u0D2D\u0D3E\u0D30\u0D24\u0D02:e,"xn--h2brj9c":e,\u092D\u093E\u0930\u0924:e,"xn--mgbbh1a":e,\u0628\u0627\u0631\u062A:e,"xn--mgbbh1a71e":e,\u0628\u06BE\u0627\u0631\u062A:e,"xn--fpcrj9c3d":e,\u0C2D\u0C3E\u0C30\u0C24\u0C4D:e,"xn--gecrj9c":e,\u0AAD\u0ABE\u0AB0\u0AA4:e,"xn--s9brj9c":e,\u0A2D\u0A3E\u0A30\u0A24:e,"xn--45brj9c":e,\u09AD\u09BE\u09B0\u09A4:e,"xn--xkc2dl3a5ee0h":e,\u0B87\u0BA8\u0BCD\u0BA4\u0BBF\u0BAF\u0BBE:e,"xn--mgba3a4f16a":e,\u0627\u06CC\u0631\u0627\u0646:e,"xn--mgba3a4fra":e,\u0627\u064A\u0631\u0627\u0646:e,"xn--mgbtx2b":e,\u0639\u0631\u0627\u0642:e,"xn--mgbayh7gpa":e,\u0627\u0644\u0627\u0631\u062F\u0646:e,"xn--3e0b707e":e,\uD55C\uAD6D:e,"xn--80ao21a":e,\u049B\u0430\u0437:e,"xn--q7ce6a":e,\u0EA5\u0EB2\u0EA7:e,"xn--fzc2c9e2c":e,\u0DBD\u0D82\u0D9A\u0DCF:e,"xn--xkc2al3hye2a":e,\u0B87\u0BB2\u0B99\u0BCD\u0B95\u0BC8:e,"xn--mgbc0a9azcg":e,\u0627\u0644\u0645\u063A\u0631\u0628:e,"xn--d1alf":e,\u043C\u043A\u0434:e,"xn--l1acc":e,\u043C\u043E\u043D:e,"xn--mix891f":e,\u6FB3\u9580:e,"xn--mix082f":e,\u6FB3\u95E8:e,"xn--mgbx4cd0ab":e,\u0645\u0644\u064A\u0633\u064A\u0627:e,"xn--mgb9awbf":e,\u0639\u0645\u0627\u0646:e,"xn--mgbai9azgqp6j":e,\u067E\u0627\u06A9\u0633\u062A\u0627\u0646:e,"xn--mgbai9a5eva00b":e,\u067E\u0627\u0643\u0633\u062A\u0627\u0646:e,"xn--ygbi2ammx":e,\u0641\u0644\u0633\u0637\u064A\u0646:e,"xn--90a3ac":[1,{"xn--80au":e,"xn--90azh":e,"xn--d1at":e,"xn--c1avg":e,"xn--o1ac":e,"xn--o1ach":e}],\u0441\u0440\u0431:[1,{\u0430\u043A:e,\u043E\u0431\u0440:e,\u043E\u0434:e,\u043E\u0440\u0433:e,\u043F\u0440:e,\u0443\u043F\u0440:e}],"xn--p1ai":e,\u0440\u0444:e,"xn--wgbl6a":e,\u0642\u0637\u0631:e,"xn--mgberp4a5d4ar":e,\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0629:e,"xn--mgberp4a5d4a87g":e,\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u0629:e,"xn--mgbqly7c0a67fbc":e,\u0627\u0644\u0633\u0639\u0648\u062F\u06CC\u06C3:e,"xn--mgbqly7cvafr":e,\u0627\u0644\u0633\u0639\u0648\u062F\u064A\u0647:e,"xn--mgbpl2fh":e,\u0633\u0648\u062F\u0627\u0646:e,"xn--yfro4i67o":e,\u65B0\u52A0\u5761:e,"xn--clchc0ea0b2g2a9gcd":e,\u0B9A\u0BBF\u0B99\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0BC2\u0BB0\u0BCD:e,"xn--ogbpf8fl":e,\u0633\u0648\u0631\u064A\u0629:e,"xn--mgbtf8fl":e,\u0633\u0648\u0631\u064A\u0627:e,"xn--o3cw4h":[1,{"xn--o3cyx2a":e,"xn--12co0c3b4eva":e,"xn--m3ch0j3a":e,"xn--h3cuzk1di":e,"xn--12c1fe0br":e,"xn--12cfi8ixb8l":e}],\u0E44\u0E17\u0E22:[1,{\u0E17\u0E2B\u0E32\u0E23:e,\u0E18\u0E38\u0E23\u0E01\u0E34\u0E08:e,\u0E40\u0E19\u0E47\u0E15:e,\u0E23\u0E31\u0E10\u0E1A\u0E32\u0E25:e,\u0E28\u0E36\u0E01\u0E29\u0E32:e,\u0E2D\u0E07\u0E04\u0E4C\u0E01\u0E23:e}],"xn--pgbs0dh":e,\u062A\u0648\u0646\u0633:e,"xn--kpry57d":e,\u53F0\u7063:e,"xn--kprw13d":e,\u53F0\u6E7E:e,"xn--nnx388a":e,\u81FA\u7063:e,"xn--j1amh":e,\u0443\u043A\u0440:e,"xn--mgb2ddes":e,\u0627\u0644\u064A\u0645\u0646:e,xxx:e,ye:o,za:[0,{ac:e,agric:e,alt:e,co:e,edu:e,gov:e,grondar:e,law:e,mil:e,net:e,ngo:e,nic:e,nis:e,nom:e,org:e,school:e,tm:e,web:e}],zm:[1,{ac:e,biz:e,co:e,com:e,edu:e,gov:e,info:e,mil:e,net:e,org:e,sch:e}],zw:[1,{ac:e,co:e,gov:e,mil:e,org:e}],aaa:e,aarp:e,abb:e,abbott:e,abbvie:e,abc:e,able:e,abogado:e,abudhabi:e,academy:[1,{official:t}],accenture:e,accountant:e,accountants:e,aco:e,actor:e,ads:e,adult:e,aeg:e,aetna:e,afl:e,africa:e,agakhan:e,agency:e,aig:e,airbus:e,airforce:e,airtel:e,akdn:e,alibaba:e,alipay:e,allfinanz:e,allstate:e,ally:e,alsace:e,alstom:e,amazon:e,americanexpress:e,americanfamily:e,amex:e,amfam:e,amica:e,amsterdam:e,analytics:e,android:e,anquan:e,anz:e,aol:e,apartments:e,app:[1,{adaptable:t,aiven:t,beget:n,brave:i,clerk:t,clerkstage:t,wnext:t,csb:[2,{preview:t}],convex:t,deta:t,ondigitalocean:t,easypanel:t,encr:t,evervault:s,expo:[2,{staging:t}],edgecompute:t,"on-fleek":t,flutterflow:t,e2b:t,framer:t,hosted:n,run:n,web:t,hasura:t,botdash:t,loginline:t,lovable:t,medusajs:t,messerli:t,netfy:t,netlify:t,ngrok:t,"ngrok-free":t,developer:n,noop:t,northflank:n,upsun:n,replit:r,nyat:t,snowflake:[0,{"*":t,privatelink:n}],streamlit:t,storipress:t,telebit:t,typedream:t,vercel:t,bookonline:t,wdh:t,windsurf:t,zeabur:t,zerops:n}],apple:e,aquarelle:e,arab:e,aramco:e,archi:e,army:e,art:e,arte:e,asda:e,associates:e,athleta:e,attorney:e,auction:e,audi:e,audible:e,audio:e,auspost:e,author:e,auto:e,autos:e,aws:[1,{sagemaker:[0,{"ap-northeast-1":d,"ap-northeast-2":d,"ap-south-1":d,"ap-southeast-1":d,"ap-southeast-2":d,"ca-central-1":x,"eu-central-1":d,"eu-west-1":d,"eu-west-2":d,"us-east-1":x,"us-east-2":x,"us-west-2":x,"af-south-1":u,"ap-east-1":u,"ap-northeast-3":u,"ap-south-2":g,"ap-southeast-3":u,"ap-southeast-4":g,"ca-west-1":[0,{notebook:t,"notebook-fips":t}],"eu-central-2":u,"eu-north-1":u,"eu-south-1":u,"eu-south-2":u,"eu-west-3":u,"il-central-1":u,"me-central-1":u,"me-south-1":u,"sa-east-1":u,"us-gov-east-1":S,"us-gov-west-1":S,"us-west-1":[0,{notebook:t,"notebook-fips":t,studio:t}],experiments:n}],repost:[0,{private:n}],on:[0,{"ap-northeast-1":c,"ap-southeast-1":c,"ap-southeast-2":c,"eu-central-1":c,"eu-north-1":c,"eu-west-1":c,"us-east-1":c,"us-east-2":c,"us-west-2":c}]}],axa:e,azure:e,baby:e,baidu:e,banamex:e,band:e,bank:e,bar:e,barcelona:e,barclaycard:e,barclays:e,barefoot:e,bargains:e,baseball:e,basketball:[1,{aus:t,nz:t}],bauhaus:e,bayern:e,bbc:e,bbt:e,bbva:e,bcg:e,bcn:e,beats:e,beauty:e,beer:e,bentley:e,berlin:e,best:e,bestbuy:e,bet:e,bharti:e,bible:e,bid:e,bike:e,bing:e,bingo:e,bio:e,black:e,blackfriday:e,blockbuster:e,blog:e,bloomberg:e,blue:e,bms:e,bmw:e,bnpparibas:e,boats:e,boehringer:e,bofa:e,bom:e,bond:e,boo:e,book:e,booking:e,bosch:e,bostik:e,boston:e,bot:e,boutique:e,box:e,bradesco:e,bridgestone:e,broadway:e,broker:e,brother:e,brussels:e,build:[1,{v0:t,windsurf:t}],builders:[1,{cloudsite:t}],business:O,buy:e,buzz:e,bzh:e,cab:e,cafe:e,cal:e,call:e,calvinklein:e,cam:e,camera:e,camp:[1,{emf:[0,{at:t}]}],canon:e,capetown:e,capital:e,capitalone:e,car:e,caravan:e,cards:e,care:e,career:e,careers:e,cars:e,casa:[1,{nabu:[0,{ui:t}]}],case:e,cash:e,casino:e,catering:e,catholic:e,cba:e,cbn:e,cbre:e,center:e,ceo:e,cern:e,cfa:e,cfd:e,chanel:e,channel:e,charity:e,chase:e,chat:e,cheap:e,chintai:e,christmas:e,chrome:e,church:e,cipriani:e,circle:e,cisco:e,citadel:e,citi:e,citic:e,city:e,claims:e,cleaning:e,click:e,clinic:e,clinique:e,clothing:e,cloud:[1,{convex:t,elementor:t,encoway:[0,{eu:t}],statics:n,ravendb:t,axarnet:[0,{"es-1":t}],diadem:t,jelastic:[0,{vip:t}],jele:t,"jenv-aruba":[0,{aruba:[0,{eur:[0,{it1:t}]}],it1:t}],keliweb:[2,{cs:t}],oxa:[2,{tn:t,uk:t}],primetel:[2,{uk:t}],reclaim:[0,{ca:t,uk:t,us:t}],trendhosting:[0,{ch:t,de:t}],jotelulu:t,kuleuven:t,laravel:t,linkyard:t,magentosite:n,matlab:t,observablehq:t,perspecta:t,vapor:t,"on-rancher":n,scw:[0,{baremetal:[0,{"fr-par-1":t,"fr-par-2":t,"nl-ams-1":t}],"fr-par":[0,{cockpit:t,fnc:[2,{functions:t}],k8s:ae,s3:t,"s3-website":t,whm:t}],instances:[0,{priv:t,pub:t}],k8s:t,"nl-ams":[0,{cockpit:t,k8s:ae,s3:t,"s3-website":t,whm:t}],"pl-waw":[0,{cockpit:t,k8s:ae,s3:t,"s3-website":t}],scalebook:t,smartlabeling:t}],servebolt:t,onstackit:[0,{runs:t}],trafficplex:t,"unison-services":t,urown:t,voorloper:t,zap:t}],club:[1,{cloudns:t,jele:t,barsy:t}],clubmed:e,coach:e,codes:[1,{owo:n}],coffee:e,college:e,cologne:e,commbank:e,community:[1,{nog:t,ravendb:t,myforum:t}],company:e,compare:e,computer:e,comsec:e,condos:e,construction:e,consulting:e,contact:e,contractors:e,cooking:e,cool:[1,{elementor:t,de:t}],corsica:e,country:e,coupon:e,coupons:e,courses:e,cpa:e,credit:e,creditcard:e,creditunion:e,cricket:e,crown:e,crs:e,cruise:e,cruises:e,cuisinella:e,cymru:e,cyou:e,dad:e,dance:e,data:e,date:e,dating:e,datsun:e,day:e,dclk:e,dds:e,deal:e,dealer:e,deals:e,degree:e,delivery:e,dell:e,deloitte:e,delta:e,democrat:e,dental:e,dentist:e,desi:e,design:[1,{graphic:t,bss:t}],dev:[1,{"12chars":t,myaddr:t,panel:t,lcl:n,lclstage:n,stg:n,stgstage:n,pages:t,r2:t,workers:t,deno:t,"deno-staging":t,deta:t,evervault:s,fly:t,githubpreview:t,gateway:n,hrsn:[2,{psl:[0,{sub:t,wc:[0,{"*":t,sub:n}]}]}],botdash:t,inbrowser:n,"is-a-good":t,"is-a":t,iserv:t,runcontainers:t,localcert:[0,{user:n}],loginline:t,barsy:t,mediatech:t,modx:t,ngrok:t,"ngrok-free":t,"is-a-fullstack":t,"is-cool":t,"is-not-a":t,localplayer:t,xmit:t,"platter-app":t,replit:[2,{archer:t,bones:t,canary:t,global:t,hacker:t,id:t,janeway:t,kim:t,kira:t,kirk:t,odo:t,paris:t,picard:t,pike:t,prerelease:t,reed:t,riker:t,sisko:t,spock:t,staging:t,sulu:t,tarpit:t,teams:t,tucker:t,wesley:t,worf:t}],crm:[0,{d:n,w:n,wa:n,wb:n,wc:n,wd:n,we:n,wf:n}],vercel:t,webhare:n}],dhl:e,diamonds:e,diet:e,digital:[1,{cloudapps:[2,{london:t}]}],direct:[1,{libp2p:t}],directory:e,discount:e,discover:e,dish:e,diy:e,dnp:e,docs:e,doctor:e,dog:e,domains:e,dot:e,download:e,drive:e,dtv:e,dubai:e,dunlop:e,dupont:e,durban:e,dvag:e,dvr:e,earth:e,eat:e,eco:e,edeka:e,education:O,email:[1,{crisp:[0,{on:t}],tawk:_a,tawkto:_a}],emerck:e,energy:e,engineer:e,engineering:e,enterprises:e,epson:e,equipment:e,ericsson:e,erni:e,esq:e,estate:[1,{compute:n}],eurovision:e,eus:[1,{party:Ea}],events:[1,{koobin:t,co:t}],exchange:e,expert:e,exposed:e,express:e,extraspace:e,fage:e,fail:e,fairwinds:e,faith:e,family:e,fan:e,fans:e,farm:[1,{storj:t}],farmers:e,fashion:e,fast:e,fedex:e,feedback:e,ferrari:e,ferrero:e,fidelity:e,fido:e,film:e,final:e,finance:e,financial:O,fire:e,firestone:e,firmdale:e,fish:e,fishing:e,fit:e,fitness:e,flickr:e,flights:e,flir:e,florist:e,flowers:e,fly:e,foo:e,food:e,football:e,ford:e,forex:e,forsale:e,forum:e,foundation:e,fox:e,free:e,fresenius:e,frl:e,frogans:e,frontier:e,ftr:e,fujitsu:e,fun:e,fund:e,furniture:e,futbol:e,fyi:e,gal:e,gallery:e,gallo:e,gallup:e,game:e,games:[1,{pley:t,sheezy:t}],gap:e,garden:e,gay:[1,{pages:t}],gbiz:e,gdn:[1,{cnpy:t}],gea:e,gent:e,genting:e,george:e,ggee:e,gift:e,gifts:e,gives:e,giving:e,glass:e,gle:e,global:[1,{appwrite:t}],globo:e,gmail:e,gmbh:e,gmo:e,gmx:e,godaddy:e,gold:e,goldpoint:e,golf:e,goo:e,goodyear:e,goog:[1,{cloud:t,translate:t,usercontent:n}],google:e,gop:e,got:e,grainger:e,graphics:e,gratis:e,green:e,gripe:e,grocery:e,group:[1,{discourse:t}],gucci:e,guge:e,guide:e,guitars:e,guru:e,hair:e,hamburg:e,hangout:e,haus:e,hbo:e,hdfc:e,hdfcbank:e,health:[1,{hra:t}],healthcare:e,help:e,helsinki:e,here:e,hermes:e,hiphop:e,hisamitsu:e,hitachi:e,hiv:e,hkt:e,hockey:e,holdings:e,holiday:e,homedepot:e,homegoods:e,homes:e,homesense:e,honda:e,horse:e,hospital:e,host:[1,{cloudaccess:t,freesite:t,easypanel:t,fastvps:t,myfast:t,tempurl:t,wpmudev:t,jele:t,mircloud:t,wp2:t,half:t}],hosting:[1,{opencraft:t}],hot:e,hotels:e,hotmail:e,house:e,how:e,hsbc:e,hughes:e,hyatt:e,hyundai:e,ibm:e,icbc:e,ice:e,icu:e,ieee:e,ifm:e,ikano:e,imamat:e,imdb:e,immo:e,immobilien:e,inc:e,industries:e,infiniti:e,ing:e,ink:e,institute:e,insurance:e,insure:e,international:e,intuit:e,investments:e,ipiranga:e,irish:e,ismaili:e,ist:e,istanbul:e,itau:e,itv:e,jaguar:e,java:e,jcb:e,jeep:e,jetzt:e,jewelry:e,jio:e,jll:e,jmp:e,jnj:e,joburg:e,jot:e,joy:e,jpmorgan:e,jprs:e,juegos:e,juniper:e,kaufen:e,kddi:e,kerryhotels:e,kerryproperties:e,kfh:e,kia:e,kids:e,kim:e,kindle:e,kitchen:e,kiwi:e,koeln:e,komatsu:e,kosher:e,kpmg:e,kpn:e,krd:[1,{co:t,edu:t}],kred:e,kuokgroup:e,kyoto:e,lacaixa:e,lamborghini:e,lamer:e,lancaster:e,land:e,landrover:e,lanxess:e,lasalle:e,lat:e,latino:e,latrobe:e,law:e,lawyer:e,lds:e,lease:e,leclerc:e,lefrak:e,legal:e,lego:e,lexus:e,lgbt:e,lidl:e,life:e,lifeinsurance:e,lifestyle:e,lighting:e,like:e,lilly:e,limited:e,limo:e,lincoln:e,link:[1,{myfritz:t,cyon:t,dweb:n,inbrowser:n,nftstorage:et,mypep:t,storacha:et,w3s:et}],live:[1,{aem:t,hlx:t,ewp:n}],living:e,llc:e,llp:e,loan:e,loans:e,locker:e,locus:e,lol:[1,{omg:t}],london:e,lotte:e,lotto:e,love:e,lpl:e,lplfinancial:e,ltd:e,ltda:e,lundbeck:e,luxe:e,luxury:e,madrid:e,maif:e,maison:e,makeup:e,man:e,management:e,mango:e,map:e,market:e,marketing:e,markets:e,marriott:e,marshalls:e,mattel:e,mba:e,mckinsey:e,med:e,media:_e,meet:e,melbourne:e,meme:e,memorial:e,men:e,menu:[1,{barsy:t,barsyonline:t}],merck:e,merckmsd:e,miami:e,microsoft:e,mini:e,mint:e,mit:e,mitsubishi:e,mlb:e,mls:e,mma:e,mobile:e,moda:e,moe:e,moi:e,mom:[1,{ind:t}],monash:e,money:e,monster:e,mormon:e,mortgage:e,moscow:e,moto:e,motorcycles:e,mov:e,movie:e,msd:e,mtn:e,mtr:e,music:e,nab:e,nagoya:e,navy:e,nba:e,nec:e,netbank:e,netflix:e,network:[1,{alces:n,co:t,arvo:t,azimuth:t,tlon:t}],neustar:e,new:e,news:[1,{noticeable:t}],next:e,nextdirect:e,nexus:e,nfl:e,ngo:e,nhk:e,nico:e,nike:e,nikon:e,ninja:e,nissan:e,nissay:e,nokia:e,norton:e,now:e,nowruz:e,nowtv:e,nra:e,nrw:e,ntt:e,nyc:e,obi:e,observer:e,office:e,okinawa:e,olayan:e,olayangroup:e,ollo:e,omega:e,one:[1,{kin:n,service:t}],ong:[1,{obl:t}],onl:e,online:[1,{eero:t,"eero-stage":t,websitebuilder:t,barsy:t}],ooo:e,open:e,oracle:e,orange:[1,{tech:t}],organic:e,origins:e,osaka:e,otsuka:e,ott:e,ovh:[1,{nerdpol:t}],page:[1,{aem:t,hlx:t,hlx3:t,translated:t,codeberg:t,heyflow:t,prvcy:t,rocky:t,pdns:t,plesk:t}],panasonic:e,paris:e,pars:e,partners:e,parts:e,party:e,pay:e,pccw:e,pet:e,pfizer:e,pharmacy:e,phd:e,philips:e,phone:e,photo:e,photography:e,photos:_e,physio:e,pics:e,pictet:e,pictures:[1,{1337:t}],pid:e,pin:e,ping:e,pink:e,pioneer:e,pizza:[1,{ngrok:t}],place:O,play:e,playstation:e,plumbing:e,plus:e,pnc:e,pohl:e,poker:e,politie:e,porn:e,pramerica:e,praxi:e,press:e,prime:e,prod:e,productions:e,prof:e,progressive:e,promo:e,properties:e,property:e,protection:e,pru:e,prudential:e,pub:[1,{id:n,kin:n,barsy:t}],pwc:e,qpon:e,quebec:e,quest:e,racing:e,radio:e,read:e,realestate:e,realtor:e,realty:e,recipes:e,red:e,redstone:e,redumbrella:e,rehab:e,reise:e,reisen:e,reit:e,reliance:e,ren:e,rent:e,rentals:e,repair:e,report:e,republican:e,rest:e,restaurant:e,review:e,reviews:e,rexroth:e,rich:e,richardli:e,ricoh:e,ril:e,rio:e,rip:[1,{clan:t}],rocks:[1,{myddns:t,stackit:t,"lima-city":t,webspace:t}],rodeo:e,rogers:e,room:e,rsvp:e,rugby:e,ruhr:e,run:[1,{appwrite:n,development:t,ravendb:t,liara:[2,{iran:t}],servers:t,build:n,code:n,database:n,migration:n,onporter:t,repl:t,stackit:t,val:[0,{express:t,web:t}],wix:t}],rwe:e,ryukyu:e,saarland:e,safe:e,safety:e,sakura:e,sale:e,salon:e,samsclub:e,samsung:e,sandvik:e,sandvikcoromant:e,sanofi:e,sap:e,sarl:e,sas:e,save:e,saxo:e,sbi:e,sbs:e,scb:e,schaeffler:e,schmidt:e,scholarships:e,school:e,schule:e,schwarz:e,science:e,scot:[1,{gov:[2,{service:t}]}],search:e,seat:e,secure:e,security:e,seek:e,select:e,sener:e,services:[1,{loginline:t}],seven:e,sew:e,sex:e,sexy:e,sfr:e,shangrila:e,sharp:e,shell:e,shia:e,shiksha:e,shoes:e,shop:[1,{base:t,hoplix:t,barsy:t,barsyonline:t,shopware:t}],shopping:e,shouji:e,show:e,silk:e,sina:e,singles:e,site:[1,{square:t,canva:ma,cloudera:n,convex:t,cyon:t,fastvps:t,figma:t,heyflow:t,jele:t,jouwweb:t,loginline:t,barsy:t,notion:t,omniwe:t,opensocial:t,madethis:t,platformsh:n,tst:n,byen:t,srht:t,novecore:t,cpanel:t,wpsquared:t}],ski:e,skin:e,sky:e,skype:e,sling:e,smart:e,smile:e,sncf:e,soccer:e,social:e,softbank:e,software:e,sohu:e,solar:e,solutions:e,song:e,sony:e,soy:e,spa:e,space:[1,{myfast:t,heiyu:t,hf:[2,{static:t}],"app-ionos":t,project:t,uber:t,xs4all:t}],sport:e,spot:e,srl:e,stada:e,staples:e,star:e,statebank:e,statefarm:e,stc:e,stcgroup:e,stockholm:e,storage:e,store:[1,{barsy:t,sellfy:t,shopware:t,storebase:t}],stream:e,studio:e,study:e,style:e,sucks:e,supplies:e,supply:e,support:[1,{barsy:t}],surf:e,surgery:e,suzuki:e,swatch:e,swiss:e,sydney:e,systems:[1,{knightpoint:t}],tab:e,taipei:e,talk:e,taobao:e,target:e,tatamotors:e,tatar:e,tattoo:e,tax:e,taxi:e,tci:e,tdk:e,team:[1,{discourse:t,jelastic:t}],tech:[1,{cleverapps:t}],technology:O,temasek:e,tennis:e,teva:e,thd:e,theater:e,theatre:e,tiaa:e,tickets:e,tienda:e,tips:e,tires:e,tirol:e,tjmaxx:e,tjx:e,tkmaxx:e,tmall:e,today:[1,{prequalifyme:t}],tokyo:e,tools:[1,{addr:va,myaddr:t}],top:[1,{ntdll:t,wadl:n}],toray:e,toshiba:e,total:e,tours:e,town:e,toyota:e,toys:e,trade:e,trading:e,training:e,travel:e,travelers:e,travelersinsurance:e,trust:e,trv:e,tube:e,tui:e,tunes:e,tushu:e,tvs:e,ubank:e,ubs:e,unicom:e,university:e,uno:e,uol:e,ups:e,vacations:e,vana:e,vanguard:e,vegas:e,ventures:e,verisign:e,versicherung:e,vet:e,viajes:e,video:e,vig:e,viking:e,villas:e,vin:e,vip:e,virgin:e,visa:e,vision:e,viva:e,vivo:e,vlaanderen:e,vodka:e,volvo:e,vote:e,voting:e,voto:e,voyage:e,wales:e,walmart:e,walter:e,wang:e,wanggou:e,watch:e,watches:e,weather:e,weatherchannel:e,webcam:e,weber:e,website:_e,wed:e,wedding:e,weibo:e,weir:e,whoswho:e,wien:e,wiki:_e,williamhill:e,win:e,windows:e,wine:e,winners:e,wme:e,wolterskluwer:e,woodside:e,work:e,works:e,world:e,wow:e,wtc:e,wtf:e,xbox:e,xerox:e,xihuan:e,xin:e,"xn--11b4c3d":e,\u0915\u0949\u092E:e,"xn--1ck2e1b":e,\u30BB\u30FC\u30EB:e,"xn--1qqw23a":e,\u4F5B\u5C71:e,"xn--30rr7y":e,\u6148\u5584:e,"xn--3bst00m":e,\u96C6\u56E2:e,"xn--3ds443g":e,\u5728\u7EBF:e,"xn--3pxu8k":e,\u70B9\u770B:e,"xn--42c2d9a":e,\u0E04\u0E2D\u0E21:e,"xn--45q11c":e,\u516B\u5366:e,"xn--4gbrim":e,\u0645\u0648\u0642\u0639:e,"xn--55qw42g":e,\u516C\u76CA:e,"xn--55qx5d":e,\u516C\u53F8:e,"xn--5su34j936bgsg":e,\u9999\u683C\u91CC\u62C9:e,"xn--5tzm5g":e,\u7F51\u7AD9:e,"xn--6frz82g":e,\u79FB\u52A8:e,"xn--6qq986b3xl":e,\u6211\u7231\u4F60:e,"xn--80adxhks":e,\u043C\u043E\u0441\u043A\u0432\u0430:e,"xn--80aqecdr1a":e,\u043A\u0430\u0442\u043E\u043B\u0438\u043A:e,"xn--80asehdb":e,\u043E\u043D\u043B\u0430\u0439\u043D:e,"xn--80aswg":e,\u0441\u0430\u0439\u0442:e,"xn--8y0a063a":e,\u8054\u901A:e,"xn--9dbq2a":e,\u05E7\u05D5\u05DD:e,"xn--9et52u":e,\u65F6\u5C1A:e,"xn--9krt00a":e,\u5FAE\u535A:e,"xn--b4w605ferd":e,\u6DE1\u9A6C\u9521:e,"xn--bck1b9a5dre4c":e,\u30D5\u30A1\u30C3\u30B7\u30E7\u30F3:e,"xn--c1avg":e,\u043E\u0440\u0433:e,"xn--c2br7g":e,\u0928\u0947\u091F:e,"xn--cck2b3b":e,\u30B9\u30C8\u30A2:e,"xn--cckwcxetd":e,\u30A2\u30DE\u30BE\u30F3:e,"xn--cg4bki":e,\uC0BC\uC131:e,"xn--czr694b":e,\u5546\u6807:e,"xn--czrs0t":e,\u5546\u5E97:e,"xn--czru2d":e,\u5546\u57CE:e,"xn--d1acj3b":e,\u0434\u0435\u0442\u0438:e,"xn--eckvdtc9d":e,\u30DD\u30A4\u30F3\u30C8:e,"xn--efvy88h":e,\u65B0\u95FB:e,"xn--fct429k":e,\u5BB6\u96FB:e,"xn--fhbei":e,\u0643\u0648\u0645:e,"xn--fiq228c5hs":e,\u4E2D\u6587\u7F51:e,"xn--fiq64b":e,\u4E2D\u4FE1:e,"xn--fjq720a":e,\u5A31\u4E50:e,"xn--flw351e":e,\u8C37\u6B4C:e,"xn--fzys8d69uvgm":e,\u96FB\u8A0A\u76C8\u79D1:e,"xn--g2xx48c":e,\u8D2D\u7269:e,"xn--gckr3f0f":e,\u30AF\u30E9\u30A6\u30C9:e,"xn--gk3at1e":e,\u901A\u8CA9:e,"xn--hxt814e":e,\u7F51\u5E97:e,"xn--i1b6b1a6a2e":e,\u0938\u0902\u0917\u0920\u0928:e,"xn--imr513n":e,\u9910\u5385:e,"xn--io0a7i":e,\u7F51\u7EDC:e,"xn--j1aef":e,\u043A\u043E\u043C:e,"xn--jlq480n2rg":e,\u4E9A\u9A6C\u900A:e,"xn--jvr189m":e,\u98DF\u54C1:e,"xn--kcrx77d1x4a":e,\u98DE\u5229\u6D66:e,"xn--kput3i":e,\u624B\u673A:e,"xn--mgba3a3ejt":e,\u0627\u0631\u0627\u0645\u0643\u0648:e,"xn--mgba7c0bbn0a":e,\u0627\u0644\u0639\u0644\u064A\u0627\u0646:e,"xn--mgbab2bd":e,\u0628\u0627\u0632\u0627\u0631:e,"xn--mgbca7dzdo":e,\u0627\u0628\u0648\u0638\u0628\u064A:e,"xn--mgbi4ecexp":e,\u0643\u0627\u062B\u0648\u0644\u064A\u0643:e,"xn--mgbt3dhd":e,\u0647\u0645\u0631\u0627\u0647:e,"xn--mk1bu44c":e,\uB2F7\uCEF4:e,"xn--mxtq1m":e,\u653F\u5E9C:e,"xn--ngbc5azd":e,\u0634\u0628\u0643\u0629:e,"xn--ngbe9e0a":e,\u0628\u064A\u062A\u0643:e,"xn--ngbrx":e,\u0639\u0631\u0628:e,"xn--nqv7f":e,\u673A\u6784:e,"xn--nqv7fs00ema":e,\u7EC4\u7EC7\u673A\u6784:e,"xn--nyqy26a":e,\u5065\u5EB7:e,"xn--otu796d":e,\u62DB\u8058:e,"xn--p1acf":[1,{"xn--90amc":t,"xn--j1aef":t,"xn--j1ael8b":t,"xn--h1ahn":t,"xn--j1adp":t,"xn--c1avg":t,"xn--80aaa0cvac":t,"xn--h1aliz":t,"xn--90a1af":t,"xn--41a":t}],\u0440\u0443\u0441:[1,{\u0431\u0438\u0437:t,\u043A\u043E\u043C:t,\u043A\u0440\u044B\u043C:t,\u043C\u0438\u0440:t,\u043C\u0441\u043A:t,\u043E\u0440\u0433:t,\u0441\u0430\u043C\u0430\u0440\u0430:t,\u0441\u043E\u0447\u0438:t,\u0441\u043F\u0431:t,\u044F:t}],"xn--pssy2u":e,\u5927\u62FF:e,"xn--q9jyb4c":e,\u307F\u3093\u306A:e,"xn--qcka1pmc":e,\u30B0\u30FC\u30B0\u30EB:e,"xn--rhqv96g":e,\u4E16\u754C:e,"xn--rovu88b":e,\u66F8\u7C4D:e,"xn--ses554g":e,\u7F51\u5740:e,"xn--t60b56a":e,\uB2F7\uB137:e,"xn--tckwe":e,\u30B3\u30E0:e,"xn--tiq49xqyj":e,\u5929\u4E3B\u6559:e,"xn--unup4y":e,\u6E38\u620F:e,"xn--vermgensberater-ctb":e,verm\u00F6gensberater:e,"xn--vermgensberatung-pwb":e,verm\u00F6gensberatung:e,"xn--vhquv":e,\u4F01\u4E1A:e,"xn--vuq861b":e,\u4FE1\u606F:e,"xn--w4r85el8fhu5dnra":e,\u5609\u91CC\u5927\u9152\u5E97:e,"xn--w4rs40l":e,\u5609\u91CC:e,"xn--xhq521b":e,\u5E7F\u4E1C:e,"xn--zfr164b":e,\u653F\u52A1:e,xyz:[1,{botdash:t,telebit:n}],yachts:e,yahoo:e,yamaxun:e,yandex:e,yodobashi:e,yoga:e,yokohama:e,you:e,youtube:e,yun:e,zappos:e,zara:e,zero:e,zip:e,zone:[1,{cloud66:t,triton:n,stackit:t,lima:t}],zuerich:e}]})();function Un(e,t,a,o){let n=null,i=t;for(;i!==void 0&&((i[0]&o)!==0&&(n={index:a+1,isIcann:i[0]===1,isPrivate:i[0]===2}),a!==-1);){let s=i[1];i=Object.prototype.hasOwnProperty.call(s,e[a])?s[e[a]]:s["*"],a-=1}return n}function ia(e,t,a){var o;if(oa(e,t,a))return;let n=e.split("."),i=(t.allowPrivateDomains?2:0)|(t.allowIcannDomains?1:0),s=Un(n,$n,n.length-1,i);if(s!==null){a.isIcann=s.isIcann,a.isPrivate=s.isPrivate,a.publicSuffix=n.slice(s.index+1).join(".");return}let r=Un(n,Hn,n.length-1,i);if(r!==null){a.isIcann=r.isIcann,a.isPrivate=r.isPrivate,a.publicSuffix=n.slice(r.index).join(".");return}a.isIcann=!1,a.isPrivate=!1,a.publicSuffix=(o=n[n.length-1])!==null&&o!==void 0?o:null}var Fn=ta();function Gn(e,t={}){return aa(Fn),na(e,3,ia,t,Fn).domain}var tr=new Set(["gmail.com","googlemail.com","yahoo.com","ymail.com","hotmail.com","outlook.com","live.com","msn.com","icloud.com","me.com","mac.com","aol.com","proton.me","protonmail.com","gmx.com","gmx.de","mail.com","yandex.com","zoho.com","hey.com","fastmail.com","tutanota.com"]);function re(e){let t=e.includes("@")?e.split("@").pop():e,a=Gn(t.trim().toLowerCase());return!a||tr.has(a)?null:a}function ye(e,t){let a=new Date(e),o=a.getUTCDate(),n=new Date(Date.UTC(a.getUTCFullYear(),a.getUTCMonth()+t,1,a.getUTCHours(),a.getUTCMinutes())),i=new Date(Date.UTC(n.getUTCFullYear(),n.getUTCMonth()+1,0)).getUTCDate();return n.setUTCDate(Math.min(o,i)),n.getTime()}var U=(e,t)=>e+t*864e5;var ar=["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE","IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE","IS","LI","NO"],sa={gdpr:{id:"gdpr",name:"EU General Data Protection Regulation (GDPR)",regions:ar,deleteArticle:"Article 17 GDPR (right to erasure)",objectArticle:"Article 21(2) and (3) GDPR (right to object to direct marketing)",deadline:e=>ye(e,1),extendedDeadline:e=>ye(e,3),deadlineText:"one month (Article 12(3) GDPR), extendable by two further months with notice and reasons",complaintTo:"the data protection authority of the EU/EEA country where you live (Article 77 GDPR)"},uk_gdpr:{id:"uk_gdpr",name:"UK GDPR and Data Protection Act 2018",regions:["GB"],deleteArticle:"Article 17 UK GDPR (right to erasure)",objectArticle:"Article 21(2) and (3) UK GDPR (right to object to direct marketing)",deadline:e=>ye(e,1),extendedDeadline:e=>ye(e,3),deadlineText:"one month (Article 12(3) UK GDPR), extendable by two further months with notice and reasons",complaintTo:"the Information Commissioner's Office (ico.org.uk)"},ccpa:{id:"ccpa",name:"California Consumer Privacy Act (CCPA), as amended by the CPRA",regions:["US-CA"],deleteArticle:"Cal. Civ. Code \xA7 1798.105 (right to delete)",objectArticle:"Cal. Civ. Code \xA7 1798.120 (right to opt out of sale or sharing)",deadline:e=>U(e,45),extendedDeadline:e=>U(e,90),deadlineText:"45 days, extendable once by 45 more days with notice",complaintTo:"the California Privacy Protection Agency (cppa.ca.gov)"},pipeda:{id:"pipeda",name:"Canada's Personal Information Protection and Electronic Documents Act (PIPEDA)",regions:["CA"],deleteArticle:"PIPEDA Schedule 1, Principles 4.3.8 (withdrawal of consent) and 4.5.3 (destruction of personal information no longer needed)",objectArticle:"PIPEDA Schedule 1, Principle 4.3.8 (withdrawal of consent), for marketing",deadline:e=>U(e,30),extendedDeadline:e=>U(e,60),deadlineText:"30 days, the PIPEDA time limit for individual requests (s. 8(3)), extendable by up to 30 days with written notice (s. 8(4))",complaintTo:"the Office of the Privacy Commissioner of Canada (priv.gc.ca)"},ndpa:{id:"ndpa",name:"the Nigeria Data Protection Act 2023 and the NDPC General Application and Implementation Directive 2025",regions:["NG"],deleteArticle:"section 34 of the Nigeria Data Protection Act 2023 and Article 38 of the GAID 2025 (right to be forgotten)",objectArticle:"section 36 of the Nigeria Data Protection Act 2023 (right to object) and Article 38(1)(d) of the GAID 2025",deadline:e=>U(e,30),extendedDeadline:e=>U(e,30),deadlineText:"30 days (the period in the NDPC's data subject complaint form, GAID 2025)",complaintTo:"the Nigeria Data Protection Commission (ndpc.gov.ng), Article 39 GAID 2025"},policy:{id:"policy",name:"the company's own privacy policy",regions:[],deleteArticle:"your privacy policy's deletion commitment",objectArticle:"your privacy policy's marketing opt-out",deadline:e=>U(e,30),extendedDeadline:e=>U(e,30),deadlineText:"30 days",complaintTo:"your national consumer or data protection authority"}};function Wn(e,t,a){return`https://mail.google.com/mail/?${new URLSearchParams({view:"cm",fs:"1",to:e,su:t,body:a}).toString()}`}var We=["wait","scheduled","no_account","verify_link","go_ahead","confirm_sender","clarify","provide_info","use_form","log_in_delete"],nr=864e5,Ge=e=>new Date(e).toISOString().slice(0,10),Kn=[["scheduled",/\b(is|has been) scheduled to be (permanently )?deleted\b|\bwill be (permanently )?deleted (in \d+ days|\d+ days after)\b/i],["no_account",/\b(couldn['’]?t|could not|can['’]?t|cannot|unable to|wasn['’]?t able to|were not able to|weren['’]?t able to) (find|locate|match|identify) (an?|any|your) ([\w ]{0,20})?(account|record)s?\b|\b(unable to|could not|couldn['’]?t) match your email( address)? (with|to) an? [\w ]{0,20}account\b|\bdon['’]?t see an account linked to\b|\bno account (is )?(linked|associated|registered) (to|with)\b/i],["verify_link",/\b(check your email to (complete|confirm|verify)|verify my identity|verification (code|request|link)|one-time code|enter the code|confirm your identity by clicking|email verification request)\b/i],["confirm_sender",/\b(respond directly from (that|this|the) email|from the email address linked to your account|third[- ]party (service|services)|confirmation that this request was (indeed )?made by you)\b/i],["go_ahead",/\bplease confirm that you(['’]d| would) like (your|the) (data|account|information) to be (deleted|erased|removed)\b|\brespond with (either )?["“”\s]*(yes|i agree)\b|\b(written|your) (confirmation|consent) to (proceed|move forward|go ahead)\b|\breply (with )?["“”\s]*(yes|confirm)["“”\s]* to (proceed|confirm)\b/i],["clarify",/\b(confirm what (you would like|you'd like) (deleted|to delete)|what (data|information) (you would like|you'd like) (deleted|removed))\b/i],["provide_info",/\b(could you please provide|please provide (us with )?the following|we (will )?need the following)\b/i],["log_in_delete",/\b(log ?in|sign in) and (submit|fill|complete|request|delete)\b|\bwe(['’]ll| will) need you to delete your [\w ]{0,20}account\b|\b(just )?log ?in to [a-z0-9-]+\.[a-z]{2,}\b and follow\b|\bcan only be completed by you\b|\byou must (initiate|start|request) the deletion yourself\b/i],["use_form",/\bsubmit a request through our [\w ]{0,20}form\b|\b((fill out|complete|submit)( our| the)?( data subject( rights)?| privacy| deletion)?( request)? (form|webform)|privacy form|request form|data subject rights request form)\b/i],["log_in_delete",/(^|\b(please|you (must|need to|can|will need to)|and)\s)(sign (in|into)|log ?in)( to)? (to )?your [\w ]{0,20}account\b|\byou can (also )?delete your [\w ]{0,20}(account|profile)\b|\bsettings page\b|\bself-service\b|\bdelete (your|the) [\w ]{0,20}account (yourself|from)\b|(?<!request to )\bpermanently delete your account\b|\b(easy|simple) steps\b|\bdelete my data\b/i]],Jc=Kn.map(([e,t])=>({ask:e,pattern:t.source}));function or(e){return e.replace(/\s*\n+\s*/g,`
`).split(/(?<=[.!?])\s+|\n/).map(t=>t.trim()).filter(t=>t.length>3)}function ra(e){let t=or(e);for(let[o,n]of Kn){let i=t.find(s=>n.test(s));if(i)return{ask:o,quote:i}}let a=t.filter(o=>/[a-z]{3}/i.test(o)&&!/^[#\-—_=*\s]|reply above this line|^(hi|hello|hey)\b[^.]{0,30}[!,.]?$/i.test(o)&&!/<[^>]+@[^>]+>/.test(o));return{ask:"wait",quote:a.find(o=>/receiv|got your|thank|review|in touch|case|ticket/i.test(o))??a[0]??""}}var ir={use_form:/\bform\b|webform|data subject|privacy[- ]?(portal|center|centre|central)|delet|eras/i,log_in_delete:/delet|eras|close[- ]?(your[- ]?)?account|take control/i,verify_link:/verif|identity|confirm/i},Bn=/account|settings|privacy|request/i,Vn=/unsubscribe|preferences|\/comm\/|notification|manage (your )?(email|subscription)|facebook|twitter|\/\/(www\.)?x\.com\/|linkedin|instagram|youtube|apps\.apple|play\.google|mailto:|maps\/search|subscription|licens/i;function sr(e,t,a=""){let o=ir[e];if(!o)return null;let n=t.filter(c=>!Vn.test(c.url)&&!Vn.test(c.text)),i=a.replace(/\s+/g,"").toLowerCase(),s=c=>{let u=c.url.replace(/^https?:\/\//,"").replace(/\/$/,"").toLowerCase();return u.length>6&&i.includes(u)?5:0},r=c=>s(c)+(o.test(c.text)?4:0)+(o.test(c.url)?3:0)+(Bn.test(c.text)?1:0)+(Bn.test(c.url)?1:0),l=[...n].sort((c,u)=>r(u)-r(c))[0];return l&&r(l)>=3?l:null}function rr(e,t){switch(e){case"gdpr":return t==="id"?["The EDPB's Guidelines 01/2022 (para. 73) say it is disproportionate to ask for a copy of an identity document when the account holder is already authenticated; you can confirm it is me through this email address."]:["Article 12(2) GDPR requires you to facilitate the exercise of my rights, and the EDPB's Guidelines 01/2022 confirm a request may be sent to a controller's official contact point instead of its preferred channel. I sent it to your privacy address."];case"uk_gdpr":return t==="id"?[]:["Article 12(2) UK GDPR requires you to facilitate the exercise of my rights. I sent this request to your privacy address."];case"ndpa":return["Section 34(1) of the Nigeria Data Protection Act 2023 gives me the right to obtain erasure from you without constraint or unreasonable delay, and section 35(2) requires withdrawing consent to be as easy as giving it."];default:return[]}}function be(e,t,a,o,n){let i=/^re\s*:/i.test(o.trim())?o.trim():`Re: ${o.trim()}`,s=i.includes(e.ref)?i:`${i} [${e.ref}]`,r=["Hello,","",...n,"",`Reference: ${e.ref}`,"","Kind regards,",t||e.accountEmail].join(`
`);return{type:"email",label:"Write the reply",to:a,subject:s,body:r,url:Wn(a,s,r)}}function Yn(e,t,a){let o=e.match(a);return o?t+Number(o[1])*nr:void 0}function Jn(e,t,a){let o=sa[e.law],n=t.from.includes("noreply")||t.from.includes("no-reply")?e.to??t.from:t.from,i=sr(t.ask,t.links.filter(c=>lr(e,c.url,t.from)),t.quote??ra(t.text).quote),s=e.company,r=c=>rr(e.law,c),l=`Please go ahead and erase my ${s} account and all personal data you hold about me.`;switch(t.ask){case"confirm_sender":{let c=[`This request comes from ${e.accountEmail}, the email address on my ${s} account, and I sent it myself from this address. It was not sent by a third-party service.`,l,...r("sender")];return{ask:"confirm_sender",headline:`${s} wants to know the request really comes from you`,why:`It does: it was sent from ${e.accountEmail}. One short reply from this address answers it.`,legal:r("sender"),action:be(e,a,n,t.subject,c),alt:i?{type:"open",label:"Or delete it in your account",url:i.url}:void 0}}case"log_in_delete":return{ask:"log_in_delete",headline:`${s} asks you to sign in and delete the account yourself`,why:"This is a fair ask: signing in is how they check it is you. It is also the quickest way to get it done.",legal:[],action:i?{type:"open",label:"Open their deletion page",url:i.url}:{type:"wait",label:"Sign in to your account and look for Delete account in the settings"}};case"use_form":{let c=["You asked me to use your form. I made this request to your privacy address, which is a valid way to make it.",l,...r("channel"),`If you need to check it is me, please send a confirmation link to ${e.accountEmail}.`],u=be(e,a,n,t.subject,c);return{ask:"use_form",headline:`${s} wants its own form filled in`,why:"The form is usually the quickest. You do not have to use it: your email to their privacy address counts, and the reply below says so.",legal:r("channel"),action:i?{type:"open",label:"Open their form",url:i.url}:u,alt:i?u:void 0}}case"verify_link":{let c=Yn(t.text,t.at,/within (\d+) days/i)??(/expire in \d+ minutes/i.test(t.text)?t.at+6e5:void 0),u=c!==void 0&&c<Date.now();return{ask:"verify_link",headline:u?`${s}'s check-it's-you code has expired`:`${s} sent a link or code to check it is you`,why:u?"Ask for a new code on their privacy page, then use it straight away.":"This is a fair check, done through your own email. Click it before it runs out, or the request closes.",legal:[],action:i?{type:"open",label:u?"Open their privacy page":"Verify now",url:i.url}:{type:"wait",label:"Open the email and use the code or link in it"},by:c,byMeaning:c?"expires":void 0}}case"go_ahead":return{ask:"go_ahead",headline:`${s} is ready to delete and wants a written yes`,why:"Reply YES and they go ahead. Their warning that it is permanent is what you asked for.",legal:[],action:be(e,a,n,t.subject,["YES. I AGREE.",`I understand the deletion is permanent and cannot be undone, and I give you my consent to go ahead and delete my ${s} account and all data linked to it.`])};case"clarify":return{ask:"clarify",headline:`${s} asks what you want deleted`,why:"Answer: everything. One reply settles it.",legal:[],action:be(e,a,n,t.subject,[`I would like you to delete my whole ${s} account and all personal data you hold about me, including any copies, backups and marketing lists.`,`The account is registered to ${e.accountEmail}.`])};case"provide_info":return{ask:"provide_info",headline:`${s} asks for more details`,why:"Give only what links you to the account: your name and the account email. Nothing more is needed to find it.",legal:r("id"),action:be(e,a,n,t.subject,[`The account is registered to ${e.accountEmail}${a?`, in the name ${a}`:""}, and this reply comes from that address.`,l,...r("id")])};case"scheduled":{let c=Yn(t.text,t.at,/deleted (?:in )?(\d+) days\b/i);return{ask:"scheduled",headline:`${s} will delete the account${c?` on ${Ge(c)}`:""}`,why:"Do not sign in before then: signing in cancels the deletion.",legal:[],action:{type:"wait",label:c?`Nothing to do. Stay signed out until ${Ge(c)}.`:"Nothing to do. Stay signed out."},by:c,byMeaning:c?"do_not_sign_in_before":void 0}}case"no_account":return{ask:"no_account",headline:`${s} found no account under ${e.accountEmail}`,why:"Then there is nothing of yours to delete under this address. If you signed up with a different email, send the request again from that one.",legal:[],action:{type:"wait",label:"Nothing more to do"}};default:{let c=o.deadline(e.events.find(u=>u.type==="sent")?.at??e.createdAt);return{ask:"wait",headline:`${s} has your request`,why:`Nothing to do yet. They have until ${Ge(c)} under ${o.name}.`,legal:[],action:{type:"wait",label:`Wait until ${Ge(c)}`}}}}}var cr=new Set(["onetrust.com","ketch.com","privacyportal.co","ethyca.com","transcend.io","datagrail.io","securiti.ai","trustarc.com","osano.com","mineos.ai"]),Zn=new Set(["zendesk.com","atlassian.net","freshdesk.com","helpscout.net","zohodesk.com"]);function lr(e,t,a){let o="";try{o=new URL(t).hostname}catch{return!1}let n=re(o);if(!n)return!1;let i=a?re(a):null;if([e.domain,e.to?re(e.to):null,i&&!Zn.has(i)?i:null].filter(Boolean).includes(n)||cr.has(n))return!0;let r=e.domain.split(".")[0];return Zn.has(n)&&o.split(".")[0].includes(r)}var Xn=6e3;var ca={type:"object",properties:{ask:{type:"string",enum:We},proof:{type:"integer",description:"Number of the one sentence that shows what they ask."}},required:["ask","proof"]};var Qn=`This email, given as numbered sentences, is a company's reply to a person who asked it to delete their data. Most such replies only confirm they received it: then answer "wait". Answer something else only if the email clearly tells the person to do one thing now:
"scheduled" - it says the account is already scheduled to be deleted.
"no_account" - it says no account was found for the person's email address.
"verify_link" - click a verification link or enter a code.
"go_ahead" - reply YES, I AGREE or similar to confirm they may delete.
"confirm_sender" - write again from the account's own email address, or it says it cannot accept requests from third-party services.
"clarify" - say what should be deleted.
"provide_info" - send more details.
"use_form" - fill in a privacy or request form.
"log_in_delete" - sign in and delete the account themselves.
Mentions of a help center, a ticket number or logging in to view the case do not count. Give the number of the one sentence that shows the answer.`;var eo=[{id:1,company:"Substack",from:"privacy@substackinc.com",subject:"[Request Received]",receivedAt:"2026-11-20T17:11:00.000Z",text:`##- Please type your reply above this line -##

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

ABN 80 158 929 938 | Privacy Policy`,label:"scheduled"}];var to={device:"Apple M1, 16 GB (EC2 mac2.metal), Chrome 158, Gemini Nano via Firebase AI Logic ONLY_ON_DEVICE",ranAt:"2026-11-27T12:40:00Z",set:"evals/replies.json: 66 real company replies to 30 deletion requests from the public demo inbox, labelled by hand, staff names removed",all66:{nanoAlone:"51/66",shipped:"66/66",shippedNote:"in-sample: the phrase rules were updated after reading these replies",onDevice:"66/66",medianMs:3123,nanoQuoteFound:"64/66",earlierRuns:[{ranAt:"2026-11-24T20:04:17.199Z",nanoAlone:"52/66",shipped:"66/66",onDevice:"66/66"}]},heldOut:{what:"29 replies that arrived after the rules were committed on 21 Nov 2026 17:30 UTC (bb99e49)",nanoAlone:"20/29",rulesAlone:"17/29",shippedMix:"21/29"},rows:[{id:1,company:"Substack",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2657,rules:"wait",final:"wait"},{id:2,company:"Substack",label:"go_ahead",model:"go_ahead",quoteOk:!0,source:"on_device",ms:2530,rules:"go_ahead",final:"go_ahead"},{id:3,company:"Medium",label:"confirm_sender",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:4049,rules:"confirm_sender",final:"confirm_sender"},{id:4,company:"Medium",label:"log_in_delete",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:3536,rules:"log_in_delete",final:"log_in_delete"},{id:5,company:"Atlassian (Trello)",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:3123,rules:"wait",final:"wait"},{id:6,company:"Loom",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:3156,rules:"wait",final:"wait"},{id:7,company:"Loom",label:"go_ahead",model:"go_ahead",quoteOk:!0,source:"on_device",ms:4511,rules:"go_ahead",final:"go_ahead"},{id:8,company:"Loom",label:"log_in_delete",model:"scheduled",quoteOk:!0,source:"on_device",ms:3522,rules:"log_in_delete",final:"log_in_delete"},{id:9,company:"Figma",label:"log_in_delete",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:4054,rules:"log_in_delete",final:"log_in_delete"},{id:10,company:"Airtable",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:3148,rules:"wait",final:"wait"},{id:11,company:"Airtable",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2598,rules:"wait",final:"wait"},{id:12,company:"Airtable",label:"log_in_delete",model:"use_form",quoteOk:!0,source:"on_device",ms:3835,rules:"log_in_delete",final:"log_in_delete"},{id:13,company:"Zapier",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2882,rules:"wait",final:"wait"},{id:14,company:"Zapier",label:"confirm_sender",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:3188,rules:"confirm_sender",final:"confirm_sender"},{id:15,company:"Zapier",label:"confirm_sender",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:4150,rules:"confirm_sender",final:"confirm_sender"},{id:16,company:"Zapier",label:"confirm_sender",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:4134,rules:"confirm_sender",final:"confirm_sender"},{id:17,company:"Zapier",label:"log_in_delete",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:4113,rules:"log_in_delete",final:"log_in_delete"},{id:18,company:"Zapier",label:"log_in_delete",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:4292,rules:"log_in_delete",final:"log_in_delete"},{id:19,company:"Spotify",label:"no_account",model:"no_account",quoteOk:!0,source:"on_device",ms:3052,rules:"no_account",final:"no_account"},{id:20,company:"Spotify",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2412,rules:"wait",final:"wait"},{id:21,company:"Grammarly",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2861,rules:"wait",final:"wait"},{id:22,company:"Vimeo",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2573,rules:"wait",final:"wait"},{id:23,company:"Vimeo",label:"confirm_sender",model:"wait",quoteOk:!0,source:"on_device",ms:2786,rules:"confirm_sender",final:"confirm_sender"},{id:24,company:"Vimeo",label:"wait",model:"wait",quoteOk:!1,source:"on_device",ms:2917,rules:"wait",final:"wait"},{id:25,company:"Slack",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:2668,rules:"use_form",final:"use_form"},{id:26,company:"Slack",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:3927,rules:"use_form",final:"use_form"},{id:27,company:"Slack",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:2612,rules:"use_form",final:"use_form"},{id:28,company:"Slack",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:3851,rules:"use_form",final:"use_form"},{id:29,company:"Zoom",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:5204,rules:"use_form",final:"use_form"},{id:30,company:"Zoom",label:"no_account",model:"verify_link",quoteOk:!0,source:"on_device",ms:3916,rules:"no_account",final:"no_account"},{id:31,company:"Wix",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2725,rules:"wait",final:"wait"},{id:32,company:"Wix",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:2858,rules:"use_form",final:"use_form"},{id:33,company:"Wix",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2411,rules:"wait",final:"wait"},{id:34,company:"Wix",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2813,rules:"wait",final:"wait"},{id:35,company:"Wix",label:"scheduled",model:"wait",quoteOk:!0,source:"on_device",ms:3304,rules:"scheduled",final:"scheduled"},{id:36,company:"Wix",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2408,rules:"wait",final:"wait"},{id:37,company:"monday.com",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:3071,rules:"use_form",final:"use_form"},{id:38,company:"monday.com",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2649,rules:"wait",final:"wait"},{id:39,company:"monday.com",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2718,rules:"wait",final:"wait"},{id:40,company:"monday.com",label:"confirm_sender",model:"clarify",quoteOk:!0,source:"on_device",ms:3126,rules:"confirm_sender",final:"confirm_sender"},{id:41,company:"Prezi",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:3304,rules:"wait",final:"wait"},{id:42,company:"SurveyMonkey",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:3304,rules:"wait",final:"wait"},{id:43,company:"Meetup",label:"log_in_delete",model:"log_in_delete",quoteOk:!0,source:"on_device",ms:3572,rules:"log_in_delete",final:"log_in_delete"},{id:44,company:"Eventbrite",label:"log_in_delete",model:"wait",quoteOk:!0,source:"on_device",ms:3790,rules:"log_in_delete",final:"log_in_delete"},{id:45,company:"Box",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2560,rules:"wait",final:"wait"},{id:46,company:"Box",label:"log_in_delete",model:"log_in_delete",quoteOk:!1,source:"on_device",ms:3584,rules:"log_in_delete",final:"log_in_delete"},{id:47,company:"Asana",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2870,rules:"wait",final:"wait"},{id:48,company:"Asana",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:3436,rules:"use_form",final:"use_form"},{id:49,company:"Asana",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2704,rules:"wait",final:"wait"},{id:50,company:"Asana",label:"verify_link",model:"verify_link",quoteOk:!0,source:"on_device",ms:2547,rules:"verify_link",final:"verify_link"},{id:51,company:"Asana",label:"verify_link",model:"use_form",quoteOk:!0,source:"on_device",ms:2672,rules:"verify_link",final:"verify_link"},{id:52,company:"Skillshare",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2364,rules:"wait",final:"wait"},{id:53,company:"Skillshare",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2426,rules:"wait",final:"wait"},{id:54,company:"Skillshare",label:"use_form",model:"use_form",quoteOk:!0,source:"on_device",ms:3137,rules:"use_form",final:"use_form"},{id:55,company:"Typeform",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2993,rules:"wait",final:"wait"},{id:56,company:"Typeform",label:"no_account",model:"provide_info",quoteOk:!0,source:"on_device",ms:3937,rules:"no_account",final:"no_account"},{id:57,company:"Typeform",label:"no_account",model:"clarify",quoteOk:!0,source:"on_device",ms:3864,rules:"no_account",final:"no_account"},{id:58,company:"Notion",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2408,rules:"wait",final:"wait"},{id:59,company:"Notion",label:"clarify",model:"clarify",quoteOk:!0,source:"on_device",ms:2707,rules:"clarify",final:"clarify"},{id:60,company:"Notion",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2410,rules:"wait",final:"wait"},{id:61,company:"Notion",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:2521,rules:"wait",final:"wait"},{id:62,company:"Kaggle",label:"no_account",model:"no_account",quoteOk:!0,source:"on_device",ms:2691,rules:"no_account",final:"no_account"},{id:63,company:"Calendly",label:"verify_link",model:"verify_link",quoteOk:!0,source:"on_device",ms:3928,rules:"verify_link",final:"verify_link"},{id:64,company:"Miro",label:"log_in_delete",model:"wait",quoteOk:!0,source:"on_device",ms:3791,rules:"log_in_delete",final:"log_in_delete"},{id:65,company:"Miro",label:"wait",model:"wait",quoteOk:!0,source:"on_device",ms:3159,rules:"wait",final:"wait"},{id:66,company:"Canva",label:"scheduled",model:"scheduled",quoteOk:!0,source:"on_device",ms:3253,rules:"scheduled",final:"scheduled"}],repeat:{ranAt:"2026-11-26T21:49:03.860Z",what:"Same 66 replies, same Mac, build of 26 Nov 2026",nanoAlone:"51/66",nanoQuoteFound:"66/66",onDevice:"66/66",medianMs:3221,file:"evals/results-mac-26nov.json"},judge:{ranAt:"2026-11-27T13:40:00Z",what:"Read all 10 on /judge in Chrome 158 on an Apple M1, cloud box off",result:"10/10 match the hand label \xB7 10/10 read by Gemini Nano on the computer \xB7 median 2.9 s after a 25.2 s first call"},more:[["Android, Firebase Test Lab virtual phone, 26 Nov (no Gemini Nano there, so PREFER_ON_DEVICE went to the cloud)","Gemini alone 58/66 \xB7 rules + Gemini 62-64/66 across two runs \xB7 66/66 read in the cloud"],["Android, real phones in Test Lab, 26 Nov (Pixel 10, Pixel 10 Pro, Pixel 9, Galaxy S25, Galaxy S26)","The app installs and opens on all five"],["App Check with reCAPTCHA Enterprise, 26 Nov","Website: token exchange accepted \xB7 extension: token from /appcheck.html, cloud call accepted \xB7 Android: token in 1.8 s (Test Lab) \xB7 iPhone: token in 8-12 s (simulator, CI)"],["iPhone, CI on every push","Builds with Xcode 26.6 \xB7 66/66 hand labels match the rules \xB7 a recorded run reads a real reply through HybridModel"]],heldOut2:{what:"3 replies that arrived after the second freeze (26 Nov 22:38 UTC) and before 27 Nov 14:30 UTC, labelled before any reader ran",nanoAlone:"3/3",cloudAlone:"2/3",rulesAlone:"2/3",shippedMix:"2/3",onDevice:"3/3"}};var mr=["gemini-3.5-flash-lite","gemini-3.5-flash"],hr=[2,3,23,4,19,25,50,66,59,1],pr=eo,fr=new Map(to.rows.map(e=>[e.id,e])),Be=hr.map(e=>pr.find(t=>t.id===e)).filter(e=>!!e),D=[],f=e=>document.getElementById(e),v=e=>e.replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t]),Z={wait:"nothing yet: wait",scheduled:"already scheduled",no_account:"no account found",verify_link:"click a check-it's-you link",go_ahead:"reply YES",confirm_sender:"confirm it's really you",clarify:"say what to delete",provide_info:"send details",use_form:"use their form",log_in_delete:"sign in and delete it"},oo=bt(Nn);ge&&gn(oo,{provider:new je(ge),isTokenAutoRefreshEnabled:!0});var io=qn(oo,{backend:new te}),Ve={createOptions:{expectedInputs:[{type:"text",languages:["en"]}],expectedOutputs:[{type:"text",languages:["en"]}]},promptOptions:{responseConstraint:ca}},gr=Ue(io,{mode:T.ONLY_ON_DEVICE,onDeviceParams:Ve}),ao=mr.map(e=>Ue(io,{mode:T.PREFER_ON_DEVICE,onDeviceParams:Ve,inCloudParams:{model:e,generationConfig:{responseMimeType:"application/json",responseJsonSchema:ca}}})),no=e=>/\b429\b|quota|RESOURCE_EXHAUSTED|\b503\b|overloaded/i.test(String(e?.message??e)),so=()=>self.LanguageModel;async function yr(){let e=so();return e?e.availability(Ve.createOptions).catch(()=>"unavailable"):"unavailable"}async function ua(){let e=await yr(),t=f("nano"),a={available:"Gemini Nano is ready in this Chrome",downloadable:"Gemini Nano can be downloaded to this Chrome",downloading:"Gemini Nano is downloading",unavailable:"No Gemini Nano in this browser"};return t.textContent=a[e]??`Gemini Nano: ${e}`,t.className="tag "+(e==="available"?"device":"amber"),f("appcheck").className="tag "+(ge?"device":""),f("get").hidden=!(e==="downloadable"||e==="downloading"),f("appcheck").textContent=ge?"App Check: reCAPTCHA Enterprise":"App Check: off on this page",e==="unavailable"&&!f("cloud").checked?f("hint").textContent="This browser cannot run Gemini Nano. Switch on the cloud option above to read the practice emails with Gemini in the cloud.":f("hint").textContent="",e}async function br(){let e=so();if(e){f("get").setAttribute("disabled","");try{(await e.create({...Ve.createOptions,monitor(a){a.addEventListener("downloadprogress",o=>f("nano").textContent=`Downloading Gemini Nano: ${Math.round((o.loaded??0)*100)}%`)}})).destroy()}catch(t){f("nano").textContent=`Download did not start: ${t.message}`}f("get").removeAttribute("disabled"),await ua()}}async function kr(e,t,a){let o=Bt(a.slice(0,Xn)),n=f("cloud").checked,i=performance.now(),s=null,r="",l="rules only",c="";try{let x=`${Qn}

From: ${e}
Subject: ${t}

${Vt(o)}`,S;if(!n)S=await gr.generateContent(x);else for(let[O,I]of ao.entries())try{S=await I.generateContent(x);break}catch(ae){if(!no(ae)||O===ao.length-1)throw ae}if(!S)throw new Error("no answer");let k=JSON.parse(S.response.text());s=We.includes(k.ask)?k.ask:null,r=Yt(o,k.proof),l=S.response.inferenceSource==="on_device"?"Gemini Nano on this computer":S.response.inferenceSource==="in_cloud"?"Gemini in the cloud":String(S.response.inferenceSource??"unknown")}catch(x){c=no(x)?"Gemini in the cloud has reached its free limit for now, so the known phrases answered this one. With Gemini Nano in Chrome nothing goes to the cloud.":x.message}let u=Math.round(performance.now()-i),d=ra(a),g=d.ask==="wait"&&!!s&&s!=="wait"&&Wt(r,a);return{model:s,quote:r,where:l,error:c,ms:u,rules:d,final:g?s:d.ask,by:g?"model":"rules",finalQuote:g?r:d.quote}}function wr(e,t,a,o,n,i,s){let r=f("law").value,l=f("email").value.trim()||"ada@example.com",c=f("name").value.trim(),u=a.match(/\bER-[A-Z0-9]{5}\b/)?.[0]??"ER-PRACT",d={id:"practice",domain:re(t.split("@")[1]??"")||"example.com",kind:"delete",law:r,ref:u,company:e,route:"email",to:t,formUrl:null,accountEmail:l,createdAt:s-3*864e5,events:[{type:"sent",at:s-3*864e5}]};return Jn(d,{ask:n,at:s,from:t,subject:a,text:o,links:[],quote:i},c)}function vr(e){let t=e.action,a=t.type==="email"?`<div class="mail"><div class="q">To ${v(t.to)} \xB7 ${v(t.subject)}</div><pre>${v(t.body)}</pre>
       <button class="btn small" data-copy="${v(t.body)}">Copy the reply</button> <a class="btn small ghost" target="_blank" rel="noopener" href="${v(t.url)}">Open it in Gmail</a></div>`:`<p><b>${v(t.label)}</b></p>`;return`<h3>${v(e.headline)}</h3><p>${v(e.why)}</p>${e.legal.map(o=>`<p class="q">${v(o)}</p>`).join("")}${a}`}async function da(e){let t=!e,a=e?.company??(f("pcompany").value.trim()||"The company"),o=e?.from??(f("pfrom").value.trim()||"privacy@example.com"),n=e?.subject??"Re: Request to delete my personal data",i=e?.text??f("ptext").value;if(!i.trim())return;let s=f(t?"presult":"result");s.innerHTML=`<p class="reading">Reading${f("cloud").checked?"":" on this computer"}\u2026</p>`;let r=await kr(o,n,i),l=e?Date.parse(e.receivedAt):Date.now(),c=wr(a,o,n,i,r.final,r.finalQuote,l),u=e?fr.get(e.id):void 0,d=e?r.final===e.label?'<span class="tag device">matches our hand label</span>':`<span class="tag red">our hand label: ${Z[e.label]}</span>`:"";s.innerHTML=`
    <div class="pills"><span class="tag ${r.where.includes("Nano")?"device":""}">${v(r.where)}${r.ms?` \xB7 ${r.ms} ms`:""}</span>${d}</div>
    ${r.error?`<p class="q">${v(r.error.slice(0,260))}</p>`:""}
    <table class="mini"><tr><th>Who</th><th>Says they ask you to</th><th>Shown by</th></tr>
      <tr><td>Model</td><td>${r.model?Z[r.model]:"\u2013"}</td><td class="q">${r.quote?"\u201C"+v(r.quote)+"\u201D":""}</td></tr>
      <tr><td>Known phrases</td><td>${Z[r.rules.ask]}</td><td class="q">${r.rules.quote?"\u201C"+v(r.rules.quote)+"\u201D":""}</td></tr>
      <tr><td><b>Decision</b></td><td><b>${Z[r.final]}</b></td><td class="q">decided by ${r.by==="rules"?"known phrases":"the model (no known phrase matched)"}</td></tr>
      ${u?`<tr><td>On our Mac</td><td>${u.model?Z[u.model]:"\u2013"}</td><td class="q">Gemini Nano, ${u.ms} ms (published run)</td></tr>`:""}
    </table>
    <div class="advice">${vr(c)}</div>`,D.unshift({id:e?.id??"yours",company:a,where:r.where,ms:r.ms,model:r.model,rules:r.rules.ask,final:r.final,by:r.by,label:e?.label}),ro(),e&&_r(e.id,r.final===e.label)}function xr(){let e=D.filter(r=>r.label);if(!e.length)return;let t=(r,l,c)=>{let u=f(r);u.textContent!==l&&(u.textContent=l,u.classList.remove("bump"),u.offsetWidth,u.classList.add("bump")),u.classList.toggle("good",c)},a=e.filter(r=>r.label===r.final).length,o=D.filter(r=>r.where.includes("Nano")).length,n=D.map(r=>r.ms).filter(Boolean).sort((r,l)=>r-l);t("sc-right",`${a} / ${e.length}`,a===e.length);let i=D.filter(r=>r.where.includes("cloud")).length,s=o===0&&i>0;t("sc-dev",`${s?i:o} / ${D.length}`,o===D.length),f("sc-dev").nextElementSibling.textContent=s?"read by Gemini in the cloud (no Gemini Nano in this browser)":"read by Gemini Nano on this computer",t("sc-ms",n.length?`${(n[Math.floor(n.length/2)]/1e3).toFixed(1)} s`:"\u2013",!1)}function ro(){xr();let e=D.filter(t=>t.label).length;f("runs").innerHTML=D.length?`<table class="cards"><thead><tr><th>Reply</th><th>Read by</th><th>Time</th><th>Model said</th><th>Decision</th><th>Hand label</th></tr></thead><tbody>${D.map(t=>`<tr>
    <td data-label="Reply">${v(t.company)}${t.id==="yours"?" (yours)":""}</td><td data-label="Read by">${v(t.where)}</td><td data-label="Time">${t.ms} ms</td>
    <td data-label="Model said">${t.model?Z[t.model]:"\u2013"}</td><td data-label="Decision">${Z[t.final]} <span class="q">(${t.by})</span></td>
    <td data-label="Hand label">${t.label?(t.label===t.final?"\u2713 ":"\u2717 ")+Z[t.label]:"\u2013"}</td></tr>`).join("")}</tbody></table>
    <p class="q">${e?`${D.filter(t=>t.label&&t.label===t.final).length} of ${e} practice reads match the hand label.`:""}</p>`:'<p class="muted">Nothing read yet.</p>'}function _r(e,t){let a=document.querySelector(`[data-id="${e}"] .mark`);a&&(a.textContent=t?"\u2713":"\u2717")}function la(e){document.querySelectorAll(".inbox li").forEach(t=>t.classList.toggle("on",t.getAttribute("data-id")===String(e.id))),f("mailview").innerHTML=`<div class="q">From ${v(e.from)} \xB7 ${v(e.receivedAt.slice(0,10))}</div><h3>${v(e.subject)}</h3><pre>${v(e.text)}</pre>`,f("result").innerHTML="",f("read").onclick=()=>da(e)}function Er(){f("inbox").innerHTML=Be.map(e=>`<li data-id="${e.id}"><b>${v(e.company)}</b><span class="q">${v(e.subject.slice(0,60))}</span><span class="mark"></span></li>`).join(""),document.querySelectorAll(".inbox li").forEach(e=>e.onclick=()=>la(Be.find(t=>String(t.id)===e.dataset.id))),la(Be[0]),f("get").onclick=br,f("cloud").onchange=ua,f("pread").onclick=()=>da(null),f("all").onclick=async()=>{f("all").setAttribute("disabled","");for(let e of Be)la(e),await da(e);f("all").removeAttribute("disabled")},document.addEventListener("click",e=>{let t=e.target.closest("[data-copy]");t&&navigator.clipboard.writeText(t.dataset.copy??"").then(()=>t.textContent="Copied")}),ro(),ua()}Er();
/*! Bundled license information:

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

firebase/app/dist/esm/index.esm.js:
@firebase/app-check/dist/esm/index.esm.js:
@firebase/app-check/dist/esm/index.esm.js:
@firebase/app-check/dist/esm/index.esm.js:
@firebase/app-check/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app-check/dist/esm/index.esm.js:
@firebase/app-check/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2024 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/ai/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
