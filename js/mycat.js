import{ComfyApp,app}from"../../../scripts/app.js";import{api}from"../../../scripts/api.js";export async function loadResource(t,e=""){if(document.querySelector(`script[src="${t}"]`))console.log("script already exists",t);else{const e=document.createElement("script");e.src=t,document.head.appendChild(e);try{await new Promise(((o,a)=>{e.onload=o,e.onerror=()=>a(new Error(`Failed to load script: ${t}`))}))}catch(t){console.error(t.message)}}if(e){if(!document.querySelector(`link[href="${e}"]`)){const t=document.createElement("link");t.rel="stylesheet",t.href=e,document.head.appendChild(t);try{await new Promise(((o,a)=>{t.onload=o,t.onerror=()=>a(new Error(`Failed to load stylesheet: ${e}`))}))}catch(t){console.error(t.message)}}}}let toastHasLoaded=!1;async function loadToast(){if(!toastHasLoaded){const t="https://cdn.jsdelivr.net/npm/toastify-js",e="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css";await loadResource(t,e),toastHasLoaded=!0}}export async function showToast(t,e="info",o=3e3){await loadToast(),console.log("showToast",t,e,o),"info"==e?Toastify({text:t,duration:o,close:!1,gravity:"top",position:"center",backgroundColor:"#3498db",stopOnFocus:!1}).showToast():"error"==e?Toastify({text:t,duration:o,close:!0,gravity:"top",position:"center",backgroundColor:"#FF4444",stopOnFocus:!0}).showToast():"warning"==e&&Toastify({text:t,duration:o,close:!0,gravity:"top",position:"center",backgroundColor:"#FFA500",stopOnFocus:!0}).showToast()}let messageBoxHasLoaded=!1;export async function loadMessageBox(){messageBoxHasLoaded||(await loadResource("https://cdn.jsdelivr.net/npm/sweetalert2@11","https://cdn.jsdelivr.net/npm/@sweetalert2/theme-bootstrap-4/bootstrap-4.css"),messageBoxHasLoaded=!0)}async function serverShowMessageBox(t,e){await loadMessageBox();const o={...t,heightAuto:!1};try{const t=await Swal.fire(o);api.fetchApi("/cryptocat/message",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`id=${e}&message=${t.isConfirmed?"1":"0"}`})}catch(t){console.error("Dialog error:",t),api.fetchApi("/cryptocat/message",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`id=${e}&message=0`})}window.addEventListener("beforeunload",(function(){fetch("/cryptocat/message",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:`id=${e}&message=0`,keepalive:!0})}),{once:!0})}api.addEventListener("cryptocat_toast",(t=>{showToast(t.detail.content,t.detail.type,t.detail.duration)})),api.addEventListener("cryptocat_dialog",(t=>{serverShowMessageBox(JSON.parse(t.detail.json_content),t.detail.id)}));export async function showMessageBox(t,e,o){await loadMessageBox(),Swal.fire({title:t,text:e,icon:o})}let loginDialogHasLoaded=!1;export async function initLoginDialog(t=!1){if(t?localStorage.setItem("cryptocat_api_host","test.riceround.online"):localStorage.removeItem("cryptocat_api_host"),!loginDialogHasLoaded)try{const t="https://unpkg.com/vue@3/dist/vue.global.js";await loadResource(t,"");const e="https://cdn.jsdelivr.net/npm/element-plus",o="https://cdn.jsdelivr.net/npm/element-plus/dist/index.css";await loadResource(e,o);const a="cryptocat/static/login-dialog.umd.cjs",n="cryptocat/static/mycat.css";await loadResource(a,n),loginDialogHasLoaded=!0}catch(t){console.error("load login-dialog failed",t)}}function generateUUID(){let t="";for(let e=0;e<32;e++){t+=Math.floor(16*Math.random()).toString(16)}return t}api.addEventListener("cryptocat_login_dialog",(t=>{const e=t.detail.client_key,o=t.detail.title;console.log("cryptocat_login_dialog",e,o),window.showLoginDialog(e,o)})),api.addEventListener("cryptocat_clear_user_info",(async t=>{window.clearUserInfo();const e=t.detail.clear_key;"all"==e?(localStorage.removeItem("Comfy.Settings.CryptoCat.User.long_token"),localStorage.removeItem("cryptocat_user_token"),localStorage.removeItem("cryptocat_long_token")):"long_token"==e?(localStorage.removeItem("Comfy.Settings.CryptoCat.User.long_token"),localStorage.removeItem("cryptocat_long_token")):"user_token"==e&&localStorage.removeItem("cryptocat_user_token")})),app.registerExtension({name:"cryptocat.mycat",setup(){initLoginDialog()},async beforeRegisterNodeDef(t,e,o){if("SaveCryptoNode"===e.name){const e=400,o="input_anything",a=t.prototype.onConnectionsChange;t.prototype.onConnectionsChange=function(t,e,n,s,i){if(!s||1!==t)return;let r=!1;if(!n&&this.inputs.length>1){const t=(new Error).stack;t.includes("LGraphNode.prototype.connect")||t.includes("LGraphNode.connect")||t.includes("loadGraphData")||!this.inputs[e].name.startsWith(o)||(this.removeInput(e),r=!0)}if(n){if(0===this.inputs.length||null!=this.inputs[this.inputs.length-1].link&&this.inputs[this.inputs.length-1].name.startsWith(o)){const t=0===this.inputs.length?o:`${o}${this.inputs.length}`;this.addInput(t,"*"),r=!0}}if(r)for(let t=0;t<this.inputs.length;t++){let e=this.inputs[t];e.name.startsWith(o)&&(e.name=0===t?o:`${o}${t}`)}return a?.apply(this,[t,e,n,s,i])};const n=t.prototype.onNodeCreated;t.prototype.onNodeCreated=function(){const t=n?n.apply(this):void 0;return void 0!==this.size?.[0]&&(this.size[0]=e),t},t.prototype.onResize=function(t){return void 0!==t?.[0]&&(t[0]=e),t}}},nodeCreated(t,e){"SaveCryptoNode"==t.comfyClass&&t.addWidget("button","Generate UUID","generate_uuid",(()=>{const e=generateUUID(),o=t.widgets.find((t=>"template_id"===t.name));o&&(o.value=e)}))}});