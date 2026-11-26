var _e=()=>{};var ye=function(e){let t=[],n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t},ft=function(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){let s=e[n++];t[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){let s=e[n++],o=e[n++],c=e[n++],a=((i&7)<<18|(s&63)<<12|(o&63)<<6|c&63)-65536;t[r++]=String.fromCharCode(55296+(a>>10)),t[r++]=String.fromCharCode(56320+(a&1023))}else{let s=e[n++],o=e[n++];t[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return t.join("")},P={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){let s=e[i],o=i+1<e.length,c=o?e[i+1]:0,a=i+2<e.length,l=a?e[i+2]:0,m=s>>2,d=(s&3)<<4|c>>4,R=(c&15)<<2|l>>6,x=l&63;a||(x=64,o||(R=64)),r.push(n[m],n[d],n[R],n[x])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(ye(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):ft(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){let s=n[e.charAt(i++)],c=i<e.length?n[e.charAt(i)]:0;++i;let l=i<e.length?n[e.charAt(i)]:64;++i;let d=i<e.length?n[e.charAt(i)]:64;if(++i,s==null||c==null||l==null||d==null)throw new U;let R=s<<2|c>>4;if(r.push(R),l!==64){let x=c<<4&240|l>>2;if(r.push(x),d!==64){let lt=l<<6&192|d;r.push(lt)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},U=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},ut=function(e){let t=ye(e);return P.encodeByteArray(t,!0)},W=function(e){return ut(e).replace(/\./g,"")},Ae=function(e){try{return P.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function V(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var ht=()=>V().__FIREBASE_DEFAULTS__,dt=()=>{if(typeof process>"u"||typeof process.env>"u")return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},pt=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let t=e&&Ae(e[1]);return t&&JSON.parse(t)},gt=()=>{try{return _e()||ht()||dt()||pt()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}};var K=()=>gt()?.config;var b=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}};function S(){try{return typeof indexedDB=="object"}catch{return!1}}function ke(){return new Promise((e,t)=>{try{let n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{t(i.error?.message||"")}}catch(n){t(n)}})}var mt="FirebaseError",y=class e extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=mt,Object.setPrototypeOf(this,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,A.prototype.create)}},A=class{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){let r=n[0]||{},i=`${this.service}/${t}`,s=this.errors[t],o=s?bt(s,r):"Error",c=`${this.serviceName}: ${o} (${i}).`;return new y(i,c,r)}};function bt(e,t){try{let n=0,r="";for(;n<e.length;){let i=e.indexOf("{$",n);if(i===-1){r+=e.substring(n);break}let s=e.indexOf("}",i+2);if(s===-1){r+=e.substring(n);break}let o=e.substring(i+2,s),c=t[o];r+=e.substring(n,i)+(c!=null?String(c):`<${o}?>`),n=s+1}return r}catch{return e}}function N(e,t){if(e===t)return!0;let n=Object.keys(e),r=Object.keys(t);for(let i of n){if(!r.includes(i))return!1;let s=e[i],o=t[i];if(we(s)&&we(o)){if(!N(s,o))return!1}else if(s!==o)return!1}for(let i of r)if(!n.includes(i))return!1;return!0}function we(e){return e!==null&&typeof e=="object"}var Et=1e3,_t=2,wt=14400*1e3,yt=.5;function Ce(e,t=Et,n=_t){let r=t*Math.pow(n,e),i=Math.round(yt*r*(Math.random()-.5)*2);return Math.min(wt,r+i)}function ve(e){return e&&e._delegate?e._delegate:e}var p=class{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}};var k="[DEFAULT]";var G=class{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){let n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){let r=new b;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){let n=this.normalizeInstanceIdentifier(t?.identifier),r=t?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(kt(t))try{this.getOrInitializeService({instanceIdentifier:k})}catch{}for(let[n,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(t=k){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){let t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=k){return this.instances.has(t)}getOptions(t=k){return this.instancesOptions.get(t)||{}}initialize(t={}){let{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(let[s,o]of this.instancesDeferred.entries()){let c=this.normalizeInstanceIdentifier(s);r===c&&o.resolve(i)}return i}onInit(t,n){let r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(t),this.onInitCallbacks.set(r,i);let s=this.instances.get(r);return s&&t(s,r),()=>{i.delete(t)}}invokeOnInitCallbacks(t,n){let r=this.onInitCallbacks.get(n);if(r)for(let i of r)try{i(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:At(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=k){return this.component?this.component.multipleInstances?t:k:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function At(e){return e===k?void 0:e}function kt(e){return e.instantiationMode==="EAGER"}var B=class{constructor(t){this.name=t,this.providers=new Map}addComponent(t){let n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);let n=new G(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}};var Ct=[],f;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(f||(f={}));var vt={debug:f.DEBUG,verbose:f.VERBOSE,info:f.INFO,warn:f.WARN,error:f.ERROR,silent:f.SILENT},Tt=f.INFO,Dt={[f.DEBUG]:"log",[f.VERBOSE]:"log",[f.INFO]:"info",[f.WARN]:"warn",[f.ERROR]:"error"},St=(e,t,...n)=>{if(t<e.logLevel)return;let r=new Date().toISOString(),i=Dt[t];if(i)console[i](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)},v=class{constructor(t){this.name=t,this._logLevel=Tt,this._logHandler=St,this._userLogHandler=null,Ct.push(this)}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in f))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?vt[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,f.DEBUG,...t),this._logHandler(this,f.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,f.VERBOSE,...t),this._logHandler(this,f.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,f.INFO,...t),this._logHandler(this,f.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,f.WARN,...t),this._logHandler(this,f.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,f.ERROR,...t),this._logHandler(this,f.ERROR,...t)}};var It=(e,t)=>t.some(n=>e instanceof n),Te,De;function Ot(){return Te||(Te=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Rt(){return De||(De=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var Se=new WeakMap,J=new WeakMap,Ie=new WeakMap,q=new WeakMap,X=new WeakMap;function xt(e){let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("success",s),e.removeEventListener("error",o)},s=()=>{n(g(e.result)),i()},o=()=>{r(e.error),i()};e.addEventListener("success",s),e.addEventListener("error",o)});return t.then(n=>{n instanceof IDBCursor&&Se.set(n,e)}).catch(()=>{}),X.set(t,e),t}function Pt(e){if(J.has(e))return;let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("complete",s),e.removeEventListener("error",o),e.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",s),e.addEventListener("error",o),e.addEventListener("abort",o)});J.set(e,t)}var Y={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return J.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Ie.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return g(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Oe(e){Y=e(Y)}function Nt(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){let r=e.call(M(this),t,...n);return Ie.set(r,t.sort?t.sort():[t]),g(r)}:Rt().includes(e)?function(...t){return e.apply(M(this),t),g(Se.get(this))}:function(...t){return g(e.apply(M(this),t))}}function Bt(e){return typeof e=="function"?Nt(e):(e instanceof IDBTransaction&&Pt(e),It(e,Ot())?new Proxy(e,Y):e)}function g(e){if(e instanceof IDBRequest)return xt(e);if(q.has(e))return q.get(e);let t=Bt(e);return t!==e&&(q.set(e,t),X.set(t,e)),t}var M=e=>X.get(e);function xe(e,t,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){let o=indexedDB.open(e,t),c=g(o);return r&&o.addEventListener("upgradeneeded",a=>{r(g(o.result),a.oldVersion,a.newVersion,g(o.transaction),a)}),n&&o.addEventListener("blocked",a=>n(a.oldVersion,a.newVersion,a)),c.then(a=>{s&&a.addEventListener("close",()=>s()),i&&a.addEventListener("versionchange",l=>i(l.oldVersion,l.newVersion,l))}).catch(()=>{}),c}var Mt=["get","getKey","getAll","getAllKeys","count"],$t=["put","add","delete","clear"],Z=new Map;function Re(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(Z.get(t))return Z.get(t);let n=t.replace(/FromIndex$/,""),r=t!==n,i=$t.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||Mt.includes(n)))return;let s=async function(o,...c){let a=this.transaction(o,i?"readwrite":"readonly"),l=a.store;return r&&(l=l.index(c.shift())),(await Promise.all([l[n](...c),i&&a.done]))[0]};return Z.set(t,s),s}Oe(e=>({...e,get:(t,n,r)=>Re(t,n)||e.get(t,n,r),has:(t,n)=>!!Re(t,n)||e.has(t,n)}));var ee=class{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(Lt(n)){let r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}};function Lt(e){return e.getComponent()?.type==="VERSION"}var te="@firebase/app",Pe="0.16.6";var _=new v("@firebase/app"),Ht="@firebase/app-compat",Ft="@firebase/analytics-compat",zt="@firebase/analytics",jt="@firebase/app-check-compat",Ut="@firebase/app-check",Wt="@firebase/auth",Vt="@firebase/auth-compat",Kt="@firebase/crashlytics",Gt="@firebase/database",qt="@firebase/data-connect",Jt="@firebase/database-compat",Yt="@firebase/functions",Xt="@firebase/functions-compat",Zt="@firebase/installations",Qt="@firebase/installations-compat",en="@firebase/messaging",tn="@firebase/messaging-compat",nn="@firebase/performance",rn="@firebase/performance-compat",sn="@firebase/remote-config",on="@firebase/remote-config-compat",an="@firebase/storage",cn="@firebase/storage-compat",ln="@firebase/firestore",fn="@firebase/ai",un="@firebase/firestore-compat",hn="firebase";var ne="[DEFAULT]",dn={[te]:"fire-core",[Ht]:"fire-core-compat",[zt]:"fire-analytics",[Ft]:"fire-analytics-compat",[Ut]:"fire-app-check",[jt]:"fire-app-check-compat",[Wt]:"fire-auth",[Vt]:"fire-auth-compat",[Kt]:"fire-cls",[Gt]:"fire-rtdb",[qt]:"fire-data-connect",[Jt]:"fire-rtdb-compat",[Yt]:"fire-fn",[Xt]:"fire-fn-compat",[Zt]:"fire-iid",[Qt]:"fire-iid-compat",[en]:"fire-fcm",[tn]:"fire-fcm-compat",[nn]:"fire-perf",[rn]:"fire-perf-compat",[sn]:"fire-rc",[on]:"fire-rc-compat",[an]:"fire-gcs",[cn]:"fire-gcs-compat",[ln]:"fire-fst",[un]:"fire-fst-compat",[fn]:"fire-vertex","fire-js":"fire-js",[hn]:"fire-js-all"};var $=new Map,pn=new Map,re=new Map;function Ne(e,t){try{e.container.addComponent(t)}catch(n){_.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function T(e){let t=e.name;if(re.has(t))return _.debug(`There were multiple attempts to register component ${t}.`),!1;re.set(t,e);for(let n of $.values())Ne(n,e);for(let n of pn.values())Ne(n,e);return!0}function ae(e,t){let n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}var gn={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},E=new A("app","Firebase",gn);var ie=class{constructor(t,n,r){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new p("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw E.create("app-deleted",{appName:this._name})}};function ce(e,t={}){let n=e;typeof t!="object"&&(t={name:t});let r={name:ne,automaticDataCollectionEnabled:!0,...t},i=r.name;if(typeof i!="string"||!i)throw E.create("bad-app-name",{appName:String(i)});if(n||(n=K()),!n)throw E.create("no-options");let s=$.get(i);if(s)if(N(n,s.options)){if(N(r,s.config))return s;throw E.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(r)})}else throw E.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(n)});let o=new B(i);for(let a of re.values())o.addComponent(a);let c=new ie(n,r,o);return $.set(i,c),c}function Le(e=ne){let t=$.get(e);if(!t&&e===ne&&K())return ce();if(!t)throw E.create("no-app",{appName:e});return t}function C(e,t,n){let r=dn[e]??e;n&&(r+=`-${n}`);let i=r.match(/\s|\//),s=t.match(/\s|\//);if(i||s){let o=[`Unable to register library "${r}" with version "${t}":`];i&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&o.push("and"),s&&o.push(`version name "${t}" contains illegal characters (whitespace or "/")`),_.warn(o.join(" "));return}T(new p(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}var mn="firebase-heartbeat-database",bn=1,I="firebase-heartbeat-store",Q=null;function He(){return Q||(Q=xe(mn,bn,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(I)}catch(n){console.warn(n)}}}}).catch(e=>{throw E.create("idb-open",{originalErrorMessage:e.message})})),Q}async function En(e){try{let n=(await He()).transaction(I),r=await n.objectStore(I).get(Fe(e));return await n.done,r}catch(t){if(t instanceof y)_.warn(t.message);else{let n=E.create("idb-get",{originalErrorMessage:t?.message});_.warn(n.message)}}}async function Be(e,t){try{let r=(await He()).transaction(I,"readwrite");await r.objectStore(I).put(t,Fe(e)),await r.done}catch(n){if(n instanceof y)_.warn(n.message);else{let r=E.create("idb-set",{originalErrorMessage:n?.message});_.warn(r.message)}}}function Fe(e){return`${e.name}!${e.options.appId}`}var _n=1024,wn=30,se=class{constructor(t){this.container=t,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new oe(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=Me();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>wn){let i=An(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){_.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let t=Me(),{heartbeatsToSend:n,unsentEntries:r}=yn(this._heartbeatsCache.heartbeats),i=W(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return _.warn(t),""}}};function Me(){return new Date().toISOString().substring(0,10)}function yn(e,t=_n){let n=[],r=e.slice();for(let i of e){let s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),$e(n)>t){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),$e(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var oe=class{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return S()?ke().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await En(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){let r=await this.read();return Be(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){let r=await this.read();return Be(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}};function $e(e){return W(JSON.stringify({version:2,heartbeats:e})).length}function An(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}function kn(e){T(new p("platform-logger",t=>new ee(t),"PRIVATE")),T(new p("heartbeat",t=>new se(t),"PRIVATE")),C(te,Pe,e),C(te,Pe,"esm2020"),C("fire-js","")}kn("");var Cn="firebase",vn="13.3.0";C(Cn,vn,"app");var ue=new Map,Ke={activated:!1,tokenObservers:[]},Tn={initialized:!1,enabled:!1};function u(e){return ue.get(e)||{...Ke}}function Dn(e,t){return ue.set(e,t),ue.get(e)}function j(){return Tn}var Ge="https://content-firebaseappcheck.googleapis.com/v1";var Sn="exchangeRecaptchaEnterpriseToken",In="exchangeDebugToken",ze={RETRIAL_MIN_WAIT:30*1e3,RETRIAL_MAX_WAIT:960*1e3},On=1440*60*1e3;var he=class{constructor(t,n,r,i,s){if(this.operation=t,this.retryPolicy=n,this.getWaitDuration=r,this.lowerBound=i,this.upperBound=s,this.pending=null,this.nextErrorWaitInterval=i,i>s)throw new Error("Proactive refresh lower bound greater than upper bound!")}start(){this.nextErrorWaitInterval=this.lowerBound,this.process(!0).catch(()=>{})}stop(){this.pending&&(this.pending.reject("cancelled"),this.pending=null)}isRunning(){return!!this.pending}async process(t){this.stop();try{this.pending=new b,this.pending.promise.catch(n=>{}),await Rn(this.getNextRun(t)),this.pending.resolve(),await this.pending.promise,this.pending=new b,this.pending.promise.catch(n=>{}),await this.operation(),this.pending.resolve(),await this.pending.promise,this.process(!0).catch(()=>{})}catch(n){this.retryPolicy(n)?this.process(!1).catch(()=>{}):this.stop()}}getNextRun(t){if(t)return this.nextErrorWaitInterval=this.lowerBound,this.getWaitDuration();{let n=this.nextErrorWaitInterval;return this.nextErrorWaitInterval*=2,this.nextErrorWaitInterval>this.upperBound&&(this.nextErrorWaitInterval=this.upperBound),n}}};function Rn(e){return new Promise(t=>{setTimeout(t,e)})}var xn={"already-initialized":"You have already called initializeAppCheck() for FirebaseApp {$appName} with different options. To avoid this error, call initializeAppCheck() with the same options as when it was originally called. This will return the already initialized instance.","use-before-activation":"App Check is being used before initializeAppCheck() is called for FirebaseApp {$appName}. Call initializeAppCheck() before instantiating other Firebase services.","fetch-network-error":"Fetch failed to connect to a network. Check Internet connection. Original error: {$originalErrorMessage}.","fetch-parse-error":"Fetch client could not parse response. Original error: {$originalErrorMessage}.","fetch-status-error":"Fetch server returned an HTTP error status. HTTP status: {$httpStatus}.","storage-open":"Error thrown when opening storage. Original error: {$originalErrorMessage}.","storage-get":"Error thrown when reading from storage. Original error: {$originalErrorMessage}.","storage-set":"Error thrown when writing to storage. Original error: {$originalErrorMessage}.","recaptcha-error":"ReCAPTCHA error.","initial-throttle":"{$httpStatus} error. Attempts allowed again after {$time}",throttled:"Requests throttled due to previous {$httpStatus} error. Attempts allowed again after {$time}"},h=new A("appCheck","AppCheck",xn);function je(e=!1){return e?self.grecaptcha?.enterprise:self.grecaptcha}function pe(e){if(!u(e).activated)throw h.create("use-before-activation",{appName:e.name})}function qe(e){let t=Math.round(e/1e3),n=Math.floor(t/(3600*24)),r=Math.floor((t-n*3600*24)/3600),i=Math.floor((t-n*3600*24-r*3600)/60),s=t-n*3600*24-r*3600-i*60,o="";return n&&(o+=L(n)+"d:"),r&&(o+=L(r)+"h:"),o+=L(i)+"m:"+L(s)+"s",o}function L(e){return e===0?"00":e>=10?e.toString():"0"+e}async function ge({url:e,body:t},n){let r={"Content-Type":"application/json"},i=n.getImmediate({optional:!0});if(i){let d=await i.getHeartbeatsHeader();d&&(r["X-Firebase-Client"]=d)}let s={method:"POST",body:JSON.stringify(t),headers:r},o;try{o=await fetch(e,s)}catch(d){throw h.create("fetch-network-error",{originalErrorMessage:d?.message})}if(o.status!==200)throw h.create("fetch-status-error",{httpStatus:o.status});let c;try{c=await o.json()}catch(d){throw h.create("fetch-parse-error",{originalErrorMessage:d?.message})}let a=c.ttl.match(/^([\d.]+)(s)$/);if(!a||!a[2]||isNaN(Number(a[1])))throw h.create("fetch-parse-error",{originalErrorMessage:`ttl field (timeToLive) is not in standard Protobuf Duration format: ${c.ttl}`});let l=Number(a[1])*1e3,m=Date.now();return{token:c.token,expireTimeMillis:m+l,issuedAtTimeMillis:m}}function Pn(e,t){let{projectId:n,appId:r,apiKey:i}=e.options;return{url:`${Ge}/projects/${n}/apps/${r}:${Sn}?key=${i}`,body:{recaptcha_enterprise_token:t}}}function Je(e,t){let{projectId:n,appId:r,apiKey:i}=e.options;return{url:`${Ge}/projects/${n}/apps/${r}:${In}?key=${i}`,body:{debug_token:t}}}var Nn="firebase-app-check-database",Bn=1,O="firebase-app-check-store",Ye="debug-token",H=null;function Xe(){return H||(H=new Promise((e,t)=>{try{let n=indexedDB.open(Nn,Bn);n.onsuccess=r=>{e(r.target.result)},n.onerror=r=>{t(h.create("storage-open",{originalErrorMessage:r.target.error?.message}))},n.onupgradeneeded=r=>{let i=r.target.result;switch(r.oldVersion){case 0:i.createObjectStore(O,{keyPath:"compositeKey"})}}}catch(n){t(h.create("storage-open",{originalErrorMessage:n?.message}))}}),H)}function Mn(e){return Qe(et(e))}function $n(e,t){return Ze(et(e),t)}function Ln(e){return Ze(Ye,e)}function Hn(){return Qe(Ye)}async function Ze(e,t){let r=(await Xe()).transaction(O,"readwrite"),s=r.objectStore(O).put({compositeKey:e,value:t});return new Promise((o,c)=>{s.onsuccess=a=>{o()},r.onerror=a=>{c(h.create("storage-set",{originalErrorMessage:a.target.error?.message}))}})}async function Qe(e){let n=(await Xe()).transaction(O,"readonly"),i=n.objectStore(O).get(e);return new Promise((s,o)=>{i.onsuccess=c=>{let a=c.target.result;s(a?a.value:void 0)},n.onerror=c=>{o(h.create("storage-get",{originalErrorMessage:c.target.error?.message}))}})}function et(e){return`${e.options.appId}-${e.name}`}var w=new v("@firebase/app-check");async function Fn(e){if(S()){let t;try{t=await Mn(e)}catch(n){w.warn(`Failed to read token from IndexedDB. Error: ${n}`)}return t}}function le(e,t){return S()?$n(e,t).catch(n=>{w.warn(`Failed to write token to IndexedDB. Error: ${n}`)}):Promise.resolve()}async function zn(e){let t;try{t=await Hn()}catch{}if(t)return t;{let n=crypto.randomUUID(),r=`To use this token for app debugging, register it with your project.

Firebase App Check debug token: ${n}

`,i=e?.options.appId,s=e?.options.projectId;return s&&i?r+=`You can do so in the Firebase Console:
https://console.firebase.google.com/project/${s}/appcheck/apps?selectedAppId=${i}

Or using the Firebase CLI:
firebase appcheck:debugtokens:create ${n} --project ${s} --app ${i}

`:r+=`You will need to add it to your app's App Check settings in the Firebase Console for it to work.

`,r+=`Note: To keep your project secure, please revoke and delete this token using the
Firebase Console or the CLI (\`firebase appcheck:debugtokens:delete\`) when you finish debugging.

Warning: This debug token is a secret and should not be shared or uploaded to source code.

Debug Token Guide: https://firebase.google.com/docs/app-check/web/debug-provider
Firebase CLI install instructions: https://firebase.google.com/docs/cli
`,console.log(r),Ln(n).catch(o=>w.warn(`Failed to persist debug token to IndexedDB. Error: ${o}`)),n}}function me(){return j().enabled}async function be(){let e=j();if(e.enabled&&e.token)return e.token.promise;throw Error(`
            Can't get debug token in production mode.
        `)}function jn(e){let t=V(),n=j();if(n.initialized=!0,typeof t.FIREBASE_APPCHECK_DEBUG_TOKEN!="string"&&t.FIREBASE_APPCHECK_DEBUG_TOKEN!==!0)return;n.enabled=!0;let r=new b;n.token=r,typeof t.FIREBASE_APPCHECK_DEBUG_TOKEN=="string"?r.resolve(t.FIREBASE_APPCHECK_DEBUG_TOKEN):r.resolve(zn(e))}var Un={error:"UNKNOWN_ERROR"};function Wn(e){return P.encodeString(JSON.stringify(e),!1)}async function F(e,t=!1,n=!1){let r=e.app;pe(r);let i=u(r),s=i.token,o;if(s&&!D(s)&&(i.token=void 0,s=void 0),!s){let l=await i.cachedTokenPromise;l&&(D(l)?s=l:await le(r,void 0))}if(!t&&s&&D(s))return{token:s.token};let c=!1;if(me())try{let l=await be();i.exchangeTokenPromise||(i.exchangeTokenPromise=ge(Je(r,l),e.heartbeatServiceProvider).finally(()=>{i.exchangeTokenPromise=void 0}),c=!0);let m=await i.exchangeTokenPromise;return await le(r,m),i.token=m,{token:m.token}}catch(l){return l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?w.warn(l.message):n&&w.error(l),fe(l)}try{i.exchangeTokenPromise||(i.exchangeTokenPromise=i.provider.getToken().finally(()=>{i.exchangeTokenPromise=void 0}),c=!0),s=await u(r).exchangeTokenPromise}catch(l){l.code==="appCheck/throttled"||l.code==="appCheck/initial-throttle"?w.warn(l.message):n&&w.error(l),o=l}let a;return s?o?D(s)?a={token:s.token,internalError:o}:a=fe(o):(a={token:s.token},i.token=s,await le(r,s)):a=fe(o),c&&rt(r,a),a}async function Vn(e){let t=e.app;pe(t);let{provider:n}=u(t);if(me()){let r=await be(),i=Je(t,r);i.body.limited_use=!0;let{token:s}=await ge(i,e.heartbeatServiceProvider);return{token:s}}else{let{token:r}=await n.getToken(!0);return{token:r}}}function tt(e,t,n,r){let{app:i}=e,s=u(i),o={next:n,error:r,type:t};if(s.tokenObservers=[...s.tokenObservers,o],s.token&&D(s.token)){let c=s.token;Promise.resolve().then(()=>{n({token:c.token}),Ue(e)}).catch(()=>{})}s.cachedTokenPromise.then(()=>Ue(e))}function nt(e,t){let n=u(e),r=n.tokenObservers.filter(i=>i.next!==t);r.length===0&&n.tokenRefresher&&n.tokenRefresher.isRunning()&&n.tokenRefresher.stop(),n.tokenObservers=r}function Ue(e){let{app:t}=e,n=u(t),r=n.tokenRefresher;r||(r=Kn(e),n.tokenRefresher=r),!r.isRunning()&&n.isTokenAutoRefreshEnabled&&r.start()}function Kn(e){let{app:t}=e;return new he(async()=>{let n=u(t),r;if(n.token?r=await F(e,!0):r=await F(e),r.error)throw r.error;if(r.internalError)throw r.internalError},()=>!0,()=>{let n=u(t);if(n.token){let r=n.token.issuedAtTimeMillis+(n.token.expireTimeMillis-n.token.issuedAtTimeMillis)*.5+3e5,i=n.token.expireTimeMillis-300*1e3;return r=Math.min(r,i),Math.max(0,r-Date.now())}else return 0},ze.RETRIAL_MIN_WAIT,ze.RETRIAL_MAX_WAIT)}function rt(e,t){let n=u(e).tokenObservers;for(let r of n)try{r.type==="EXTERNAL"&&t.error!=null?r.error(t.error):r.next(t)}catch{}}function D(e){return e.expireTimeMillis-Date.now()>0}function fe(e){return{token:Wn(Un),error:e}}var de=class{constructor(t,n){this.app=t,this.heartbeatServiceProvider=n}_delete(){let{tokenObservers:t}=u(this.app);for(let n of t)nt(this.app,n.next);return Promise.resolve()}};function Gn(e,t){return new de(e,t)}function qn(e){return{getToken:t=>F(e,t),getLimitedUseToken:()=>Vn(e),addTokenListener:t=>tt(e,"INTERNAL",t),removeTokenListener:t=>nt(e.app,t)}}var Jn="@firebase/app-check",Yn="0.13.1";var Xn="https://www.google.com/recaptcha/enterprise.js";function Zn(e,t){let n=new b,r=u(e);r.reCAPTCHAState={initialized:n};let i=Qn(e),s=je(!0);return s?We(e,t,s,i,n):nr(()=>{let o=je(!0);if(!o)throw new Error("no recaptcha");We(e,t,o,i,n)}),n.promise}function We(e,t,n,r,i){n.ready(()=>{tr(e,t,n,r),i.resolve(n)})}function Qn(e){let t=`fire_app_check_${e.name}`,n=document.createElement("div");return n.id=t,n.style.display="none",document.body.appendChild(n),t}async function er(e){pe(e);let n=await u(e).reCAPTCHAState.initialized.promise;return new Promise((r,i)=>{let s=u(e).reCAPTCHAState;n.ready(()=>{r(n.execute(s.widgetId,{action:"fire_app_check"}))})})}function tr(e,t,n,r){let i=n.render(r,{sitekey:t,size:"invisible",callback:()=>{u(e).reCAPTCHAState.succeeded=!0},"error-callback":()=>{u(e).reCAPTCHAState.succeeded=!1}}),s=u(e);s.reCAPTCHAState={...s.reCAPTCHAState,widgetId:i}}function nr(e){let t=document.createElement("script");t.src=Xn+"?render=explicit",t.onload=e,document.head.appendChild(t)}var z=class e{constructor(t){this._siteKey=t,this._throttleData=null}async getToken(t=!1){ir(this._throttleData);let n=await er(this._app).catch(i=>{throw h.create("recaptcha-error")});if(!u(this._app).reCAPTCHAState?.succeeded)throw h.create("recaptcha-error");let r;try{let i=Pn(this._app,n);t&&(i.body.limited_use=!0),r=await ge(i,this._heartbeatServiceProvider)}catch(i){throw i.code?.includes("fetch-status-error")?(this._throttleData=rr(Number(i.customData?.httpStatus),this._throttleData),h.create("initial-throttle",{time:qe(this._throttleData.allowRequestsAfter-Date.now()),httpStatus:this._throttleData.httpStatus})):i}return this._throttleData=null,r}initialize(t){this._app=t,this._heartbeatServiceProvider=ae(t,"heartbeat"),Zn(t,this._siteKey).catch(()=>{})}isEqual(t){return t instanceof e?this._siteKey===t._siteKey:!1}};function rr(e,t){if(e===404||e===403)return{backoffCount:1,allowRequestsAfter:Date.now()+On,httpStatus:e};{let n=t?t.backoffCount:0,r=Ce(n,1e3,2);return{backoffCount:n+1,allowRequestsAfter:Date.now()+r,httpStatus:e}}}function ir(e){if(e&&Date.now()-e.allowRequestsAfter<=0)throw h.create("throttled",{time:qe(e.allowRequestsAfter-Date.now()),httpStatus:e.httpStatus})}function it(e=Le(),t){e=ve(e);let n=ae(e,"app-check");if(j().initialized||jn(e),me()&&be().then(i=>{console.log(`Firebase App Check debug token: ${i}`)}),n.isInitialized()){let i=n.getImmediate(),s=n.getOptions();if(s&&!!s.isTokenAutoRefreshEnabled==!!t.isTokenAutoRefreshEnabled&&s.provider?.isEqual(t.provider))return i;throw h.create("already-initialized",{appName:e.name})}let r=n.initialize({options:t});return sr(e,t.provider,t.isTokenAutoRefreshEnabled),u(e).isTokenAutoRefreshEnabled&&tt(r,"INTERNAL",()=>{}),r}function sr(e,t,n=!1){let r=Dn(e,{...Ke});r.activated=!0,r.provider=t,r.cachedTokenPromise=Fn(e).then(i=>(i&&D(i)&&(r.token=i,rt(e,{token:i.token})),i)),r.isTokenAutoRefreshEnabled=n&&e.automaticDataCollectionEnabled,!e.automaticDataCollectionEnabled&&n&&w.warn("`isTokenAutoRefreshEnabled` is true but `automaticDataCollectionEnabled` was set to false during `initializeApp()`. This blocks automatic token refresh."),r.provider.initialize(e)}async function st(e,t){let n=await F(e,t);if(n.error)throw n.error;if(n.internalError)throw n.internalError;return{token:n.token}}var or="app-check",Ve="app-check-internal";function ar(){T(new p(or,e=>{let t=e.getProvider("app").getImmediate(),n=e.getProvider("heartbeat");return Gn(t,n)},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,n)=>{e.getProvider(Ve).initialize()})),T(new p(Ve,e=>{let t=e.getProvider("app-check").getImmediate();return qn(t)},"PUBLIC").setInstantiationMode("EXPLICIT")),C(Jn,Yn)}ar();var ot={apiKey:"AIzaSyAbSG59wFNc9zTtkVIePV5sYLeZvU9Rfew",authDomain:"forget-me-hybrid.firebaseapp.com",projectId:"forget-me-hybrid",storageBucket:"forget-me-hybrid.firebasestorage.app",messagingSenderId:"798434253190",appId:"1:798434253190:web:8c21bad2081942d239b407"},at="6Le2wDMuAAAAANSUyebwEmxvOiSt5mbj0EwknS4N";function cr(e){let t=window,n=location.ancestorOrigins?.[0]??"";n.startsWith("chrome-extension://")?window.parent.postMessage(e,n):t.ErasedAndroid?t.ErasedAndroid.token(JSON.stringify(e)):t.webkit?.messageHandlers?.erased&&t.webkit.messageHandlers.erased.postMessage(JSON.stringify(e)),document.getElementById("out").textContent=e.token?"App Check token ready.":`No token: ${e.error}`}var lr=e=>{try{return JSON.parse(atob(e.split(".")[1].replace(/-/g,"+").replace(/_/g,"/"))).exp*1e3}catch{return Date.now()+30*6e4}},fr=it(ce(ot),{provider:new z(at),isTokenAutoRefreshEnabled:!1}),ct=!1;setTimeout(()=>Ee({type:"erased-appcheck",error:"reCAPTCHA did not answer in 20 s"}),2e4);var Ee=e=>{ct||(ct=!0,cr(e))};st(fr,!1).then(e=>Ee({type:"erased-appcheck",token:e.token,expireTimeMillis:lr(e.token)})).catch(e=>Ee({type:"erased-appcheck",error:String(e.message).slice(0,300)}));
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
*/
