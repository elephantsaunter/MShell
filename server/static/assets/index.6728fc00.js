var be=Object.defineProperty,ge=Object.defineProperties;var ve=Object.getOwnPropertyDescriptors;var te=Object.getOwnPropertySymbols;var ye=Object.prototype.hasOwnProperty,_e=Object.prototype.propertyIsEnumerable;var ne=(e,l,y)=>l in e?be(e,l,{enumerable:!0,configurable:!0,writable:!0,value:y}):e[l]=y,q=(e,l)=>{for(var y in l||(l={}))ye.call(l,y)&&ne(e,y,l[y]);if(te)for(var y of te(l))_e.call(l,y)&&ne(e,y,l[y]);return e},P=(e,l)=>ge(e,ve(l));import{x as G,t as L,r as Z,a as J,A as H,s as j,e as s,Q as X,f as _,h as C,i,G as t,w as B,F as Y,E as K,k as g,P as x,l as R,D as S,j as ee,J as Ce,o as De}from"./vendor.c08e96cf.js";import{A as F}from"./Api.ab367e46.js";import{p as Ie}from"./api.7a509bb1.js";import{_ as Ve}from"./SshTerminal.e17a41c4.js";import{E as oe}from"./Enum.2b540114.js";import{n as le}from"./assert.6143fd7f.js";import{_ as ae}from"./codemirror.0620304e.js";import{g as we,c as se}from"./index.ef81b75e.js";const T={list:F.create("/machines","get"),info:F.create("/machines/{id}/sysinfo","get"),stats:F.create("/machines/{id}/stats","get"),closeCli:F.create("/machines/{id}/close-cli","delete"),saveMachine:F.create("/machines","post"),del:F.create("/machines/{id}","delete"),scripts:F.create("/machines/{machineId}/scripts","get"),runScript:F.create("/machines/{machineId}/scripts/{scriptId}/run","get"),saveScript:F.create("/machines/{machineId}/scripts","post"),deleteScript:F.create("/machines/{machineId}/scripts/{scriptId}","delete"),files:F.create("/machines/{id}/files","get"),lsFile:F.create("/machines/{machineId}/files/{fileId}/read-dir","get"),rmFile:F.create("/machines/{machineId}/files/{fileId}/remove","delete"),uploadFile:F.create("/machines/files/upload","post"),fileContent:F.create("/machines/{machineId}/files/{fileId}/read","get"),updateFileContent:F.create("/machines/{machineId}/files/{id}/write","post"),addConf:F.create("/machines/{machineId}/files","post"),delConf:F.create("/machines/{machineId}/files/{id}","delete"),terminal:F.create("/api/machines/{id}/terminal","get")};var O={scriptTypeEnum:new oe().add("RESULT","\u6709\u7ED3\u679C",1).add("NO_RESULT","\u65E0\u7ED3\u679C",2).add("REAL_TIME","\u5B9E\u65F6\u4EA4\u4E92",3),FileTypeEnum:new oe().add("DIRECTORY","\u76EE\u5F55",1).add("FILE","\u6587\u4EF6",2)},re=G({name:"ScriptEdit",components:{codemirror:ae},props:{visible:{type:Boolean},data:{type:Object},title:{type:String},machineId:{type:Number},isCommon:{type:Boolean}},setup(e,{emit:l}){const{isCommon:y,machineId:a}=L(e),$=Z(null),I=J({dialogVisible:!1,submitDisabled:!1,form:{id:null,name:"",machineId:0,description:"",script:"",params:null,type:null},btnLoading:!1});H(e,c=>{c.data?I.form=q({},c.data):(I.form={},I.form.script=""),I.dialogVisible=c.visible});const f=()=>{I.form.machineId=y.value?9999999:a.value,console.log("machineid:",a),$.value.validate(c=>{if(c)le(I.form.name,"\u540D\u79F0\u4E0D\u80FD\u4E3A\u7A7A"),le(I.form.description,"\u63CF\u8FF0\u4E0D\u80FD\u4E3A\u7A7A"),le(I.form.script,"\u5185\u5BB9\u4E0D\u80FD\u4E3A\u7A7A"),T.saveScript.request(I.form).then(()=>{j.success("\u4FDD\u5B58\u6210\u529F"),l("submitSuccess"),I.submitDisabled=!1,h()},()=>{I.submitDisabled=!1});else return!1})},h=()=>{l("update:visible",!1),l("cancel")};return P(q({},L(I)),{enums:O,mockDataForm:$,btnOk:f,cancel:h})}}),Ll=`#content .CodeMirror {
  height: 300px !important;
}`;const Fe={class:"mock-data-dialog"},$e={class:"dialog-footer"},ke=g("\u4FDD \u5B58"),Ee=g("\u5173 \u95ED");function Be(e,l,y,a,$,I){const f=s("el-input"),h=s("el-form-item"),c=s("el-option"),d=s("el-select"),V=s("codemirror"),m=s("el-form"),D=s("el-button"),b=s("el-dialog"),U=X("auth");return _(),C("div",Fe,[i(b,{title:e.title,modelValue:e.dialogVisible,"onUpdate:modelValue":l[7]||(l[7]=n=>e.dialogVisible=n),"close-on-click-modal":!1,"before-close":e.cancel,"show-close":!0,"destroy-on-close":!0,width:"800px"},{footer:t(()=>[i("div",$e,[B(i(D,{type:"primary",loading:e.btnLoading,onClick:e.btnOk,size:"mini",disabled:e.submitDisabled},{default:t(()=>[ke]),_:1},8,["loading","onClick","disabled"]),[[U,"machine:script:save"]]),i(D,{onClick:l[6]||(l[6]=n=>e.cancel()),disabled:e.submitDisabled,size:"mini"},{default:t(()=>[Ee]),_:1},8,["disabled"])])]),default:t(()=>[i(m,{model:e.form,ref:"mockDataForm","label-width":"70px",size:"small"},{default:t(()=>[i(h,{prop:"method",label:"\u540D\u79F0"},{default:t(()=>[i(f,{modelValue:e.form.name,"onUpdate:modelValue":l[1]||(l[1]=n=>e.form.name=n),modelModifiers:{trim:!0},placeholder:"\u8BF7\u8F93\u5165\u540D\u79F0"},null,8,["modelValue"])]),_:1}),i(h,{prop:"description",label:"\u63CF\u8FF0"},{default:t(()=>[i(f,{modelValue:e.form.description,"onUpdate:modelValue":l[2]||(l[2]=n=>e.form.description=n),modelModifiers:{trim:!0},placeholder:"\u8BF7\u8F93\u5165\u63CF\u8FF0"},null,8,["modelValue"])]),_:1}),i(h,{prop:"type",label:"\u7C7B\u578B"},{default:t(()=>[i(d,{modelValue:e.form.type,"onUpdate:modelValue":l[3]||(l[3]=n=>e.form.type=n),"default-first-option":"",style:{width:"100%"},placeholder:"\u8BF7\u9009\u62E9\u7C7B\u578B"},{default:t(()=>[(_(!0),C(Y,null,K(e.enums.scriptTypeEnum,n=>(_(),C(c,{key:n.value,label:n.label,value:n.value},null,8,["label","value"]))),128))]),_:1},8,["modelValue"])]),_:1}),i(h,{prop:"params",label:"\u53C2\u6570"},{default:t(()=>[i(f,{modelValue:e.form.params,"onUpdate:modelValue":l[4]||(l[4]=n=>e.form.params=n),modelModifiers:{trim:!0},placeholder:"\u53C2\u6570\u6570\u7EC4json\uFF0C\u82E5\u65E0\u53EF\u4E0D\u586B"},null,8,["modelValue"])]),_:1}),i(h,{prop:"script",label:"\u5185\u5BB9",id:"content"},{default:t(()=>[i(V,{ref:"cmEditor",modelValue:e.form.script,"onUpdate:modelValue":l[5]||(l[5]=n=>e.form.script=n),language:"shell"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["title","modelValue","before-close"])])}re.render=Be;var de=G({name:"ServiceManage",components:{ScriptEdit:re,SshTerminal:Ve},props:{visible:{type:Boolean},machineId:{type:Number},title:{type:String}},setup(e,l){const y=Z(null),a=J({dialogVisible:!1,type:0,currentId:null,currentData:null,editDialog:{visible:!1,data:null,title:"",machineId:9999999},scriptTable:[],scriptParamsDialog:{visible:!1,params:{},paramsFormItem:[]},resultDialog:{visible:!1,result:""},terminalDialog:{visible:!1,cmd:"",machineId:0}});H(e,n=>{e.machineId&&$(),a.dialogVisible=n.visible});const $=async()=>{a.currentId=null,a.currentData=null;const n=a.type==0?e.machineId:9999999,k=await T.scripts.request({machineId:n});a.scriptTable=k.list},I=async n=>{if(n.params){a.scriptParamsDialog.paramsFormItem=JSON.parse(n.params),a.scriptParamsDialog.visible=!0;return}h(n)},f=async n=>{a.scriptParamsDialog.visible&&y.value.validate(k=>{if(k)h(n),a.scriptParamsDialog.params={},a.scriptParamsDialog.visible=!1,y.value.resetFields();else return!1})},h=async n=>{const k=n.type==O.scriptTypeEnum.NO_RESULT.value;if(n.type==O.scriptTypeEnum.RESULT.value||k){const A=await T.runScript.request({machineId:e.machineId,scriptId:n.id,params:a.scriptParamsDialog.params});if(k){j.success("\u6267\u884C\u5B8C\u6210");return}a.resultDialog.result=A,a.resultDialog.visible=!0;return}if(n.type==O.scriptTypeEnum.REAL_TIME.value){n=n.script,a.scriptParamsDialog.params&&(n=c(n,a.scriptParamsDialog.params)),a.terminalDialog.cmd=n,a.terminalDialog.visible=!0,a.terminalDialog.machineId=e.machineId;return}};function c(n,k){return n.replace(/\{{.\w+\}}/g,A=>{const z=A.substring(3,A.length-2),r=k[z];return r!=null||r!=null?r:""})}const d=()=>{a.terminalDialog.visible=!1,a.terminalDialog.machineId=0},V=n=>{!n||(a.currentId=n.id,a.currentData=n)},m=n=>{a.editDialog.machineId=e.machineId,a.editDialog.data=n,n?a.editDialog.title="\u67E5\u770B\u7F16\u8F91\u811A\u672C":a.editDialog.title="\u65B0\u589E\u811A\u672C",a.editDialog.visible=!0},D=()=>{$()},b=n=>{x.confirm(`\u6B64\u64CD\u4F5C\u5C06\u5220\u9664 [${n.name}], \u662F\u5426\u7EE7\u7EED?`,"\u63D0\u793A",{confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(()=>{T.deleteScript.request({machineId:e.machineId,scriptId:n.id}).then(()=>{$()})})},U=()=>{l.emit("update:visible",!1),l.emit("update:machineId",null),l.emit("cancel"),a.scriptTable=[]};return P(q({},L(a)),{paramsForm:y,enums:O,getScripts:$,runScript:I,hasParamsRun:f,closeTermnial:d,choose:V,editScript:m,submitSuccess:D,deleteRow:b,handleClose:U})}}),Rl="";const Te={class:"file-manage"},Ue={class:"toolbar"},Se={style:{float:"left"}},Ae={style:{float:"right"}},ze=g("\u67E5\u770B"),je=g("\u6DFB\u52A0"),Me=g("\u5220\u9664"),qe=i("i",null,null,-1),Ne=g("\u786E\u5B9A"),Pe=g("\u6267\u884C"),Le={class:"dialog-footer"},Re=g("\u786E \u5B9A"),Oe={style:{"white-space":"pre-line",padding:"10px",color:"#000000"}};function We(e,l,y,a,$,I){const f=s("el-option"),h=s("el-select"),c=s("el-button"),d=s("el-radio"),V=s("el-table-column"),m=s("el-table"),D=s("el-dialog"),b=s("el-input"),U=s("el-form-item"),n=s("el-form"),k=s("ssh-terminal"),A=s("script-edit"),z=X("auth");return _(),C("div",Te,[i(D,{title:e.title,modelValue:e.dialogVisible,"onUpdate:modelValue":l[6]||(l[6]=r=>e.dialogVisible=r),"destroy-on-close":!0,"show-close":!0,"before-close":e.handleClose,width:"60%"},{default:t(()=>[i("div",Ue,[i("div",Se,[i(h,{modelValue:e.type,"onUpdate:modelValue":l[1]||(l[1]=r=>e.type=r),onChange:e.getScripts,size:"mini",placeholder:"\u8BF7\u9009\u62E9"},{default:t(()=>[i(f,{key:0,label:"\u79C1\u6709",value:0}),i(f,{key:1,label:"\u516C\u5171",value:1})]),_:1},8,["modelValue","onChange"])]),i("div",Ae,[i(c,{onClick:l[2]||(l[2]=r=>e.editScript(e.currentData)),disabled:e.currentId==null,type:"primary",icon:"el-icon-tickets",size:"mini",plain:""},{default:t(()=>[ze]),_:1},8,["disabled"]),B(i(c,{type:"primary",onClick:l[3]||(l[3]=r=>e.editScript(null)),icon:"el-icon-plus",size:"mini",plain:""},{default:t(()=>[je]),_:1},512),[[z,"machine:script:save"]]),B(i(c,{disabled:e.currentId==null,type:"danger",onClick:l[4]||(l[4]=r=>e.deleteRow(e.currentData)),icon:"el-icon-delete",size:"mini",plain:""},{default:t(()=>[Me]),_:1},8,["disabled"]),[[z,"machine:script:del"]])])]),i(m,{data:e.scriptTable,onCurrentChange:e.choose,stripe:"",border:"",size:"mini",style:{width:"100%"}},{default:t(()=>[i(V,{label:"\u9009\u62E9",width:"55px"},{default:t(r=>[i(d,{modelValue:e.currentId,"onUpdate:modelValue":l[5]||(l[5]=o=>e.currentId=o),label:r.row.id},{default:t(()=>[qe]),_:2},1032,["modelValue","label"])]),_:1}),i(V,{prop:"name",label:"\u540D\u79F0","min-width":70}),i(V,{prop:"description",label:"\u63CF\u8FF0","min-width":100,"show-overflow-tooltip":""}),i(V,{prop:"name",label:"\u7C7B\u578B","min-width":50},{default:t(r=>[g(R(e.enums.scriptTypeEnum.getLabelByValue(r.row.type)),1)]),_:1}),i(V,{label:"\u64CD\u4F5C"},{default:t(r=>[r.row.id==null?(_(),C(c,{key:0,onClick:o=>e.addFiles(r.row),type:"success",icon:"el-icon-success",size:"mini",plain:""},{default:t(()=>[Ne]),_:2},1032,["onClick"])):S("",!0),r.row.id!=null?B((_(),C(c,{key:1,onClick:o=>e.runScript(r.row),type:"primary",icon:"el-icon-tickets",size:"mini",plain:""},{default:t(()=>[Pe]),_:2},1032,["onClick"])),[[z,"machine:script:run"]]):S("",!0)]),_:1})]),_:1},8,["data","onCurrentChange"])]),_:1},8,["title","modelValue","before-close"]),i(D,{title:"\u811A\u672C\u53C2\u6570",modelValue:e.scriptParamsDialog.visible,"onUpdate:modelValue":l[8]||(l[8]=r=>e.scriptParamsDialog.visible=r),width:"400px"},{footer:t(()=>[i("span",Le,[i(c,{type:"primary",onClick:l[7]||(l[7]=r=>e.hasParamsRun(e.currentData)),size:"mini"},{default:t(()=>[Re]),_:1})])]),default:t(()=>[i(n,{ref:"paramsForm",model:e.scriptParamsDialog.params,"label-width":"70px",size:"mini"},{default:t(()=>[(_(!0),C(Y,null,K(e.scriptParamsDialog.paramsFormItem,r=>(_(),C(U,{key:r.name,prop:r.model,label:r.name,required:""},{default:t(()=>[i(b,{modelValue:e.scriptParamsDialog.params[r.model],"onUpdate:modelValue":o=>e.scriptParamsDialog.params[r.model]=o,placeholder:r.placeholder,autocomplete:"off"},null,8,["modelValue","onUpdate:modelValue","placeholder"])]),_:2},1032,["prop","label"]))),128))]),_:1},8,["model"])]),_:1},8,["modelValue"]),i(D,{title:"\u6267\u884C\u7ED3\u679C",modelValue:e.resultDialog.visible,"onUpdate:modelValue":l[10]||(l[10]=r=>e.resultDialog.visible=r),width:"50%"},{default:t(()=>[i("div",Oe,[i(b,{modelValue:e.resultDialog.result,"onUpdate:modelValue":l[9]||(l[9]=r=>e.resultDialog.result=r),rows:20,type:"textarea"},null,8,["modelValue"])])]),_:1},8,["modelValue"]),e.terminalDialog.visible?(_(),C(D,{key:0,title:"\u7EC8\u7AEF",modelValue:e.terminalDialog.visible,"onUpdate:modelValue":l[11]||(l[11]=r=>e.terminalDialog.visible=r),width:"70%","close-on-click-modal":!1,modal:!1,onClose:e.closeTermnial},{default:t(()=>[i(k,{ref:"terminal",cmd:e.terminalDialog.cmd,machineId:e.terminalDialog.machineId,height:"600px"},null,8,["cmd","machineId"])]),_:1},8,["modelValue","onClose"])):S("",!0),i(A,{visible:e.editDialog.visible,"onUpdate:visible":l[12]||(l[12]=r=>e.editDialog.visible=r),data:e.editDialog.data,"onUpdate:data":l[13]||(l[13]=r=>e.editDialog.data=r),title:e.editDialog.title,machineId:e.editDialog.machineId,"onUpdate:machineId":l[14]||(l[14]=r=>e.editDialog.machineId=r),isCommon:e.type==1,onSubmitSuccess:e.submitSuccess},null,8,["visible","data","title","machineId","isCommon","onSubmitSuccess"])])}de.render=We;var ue=G({name:"FileManage",components:{codemirror:ae},props:{visible:{type:Boolean},machineId:{type:Number},title:{type:String}},setup(e,{emit:l}){const y=T.addConf,a=T.delConf,$=T.updateFileContent,I=T.files,f=Z(null),h=we("token"),c={tabSize:2,mode:"text/x-sh",theme:"panda-syntax",line:!0,lint:!0,gutters:["CodeMirror-lint-markers"],indentWithTabs:!0,smartIndent:!0,matchBrackets:!0,autofocus:!0,styleSelectedText:!0,styleActiveLine:!0,foldGutter:!0,hintOptions:{completeSingle:!0}},d=J({dialogVisible:!1,form:{id:null,type:null,name:"",remark:""},fileTable:[],btnLoading:!1,fileContent:{fileId:0,content:"",contentVisible:!1,dialogTitle:"",path:"",type:"shell"},tree:{title:"",visible:!1,folder:{id:0},node:{childNodes:[]},resolve:{}},props:{label:"name",children:"zones",isLeaf:"leaf"}});H(e,u=>{u.machineId&&V(),d.dialogVisible=u.visible});const V=async()=>{const u=await I.request({id:e.machineId});d.fileTable=u.list},m=()=>{d.fileTable=[{}].concat(d.fileTable)},D=async u=>{u.machineId=e.machineId,await y.request(u),j.success("\u6DFB\u52A0\u6210\u529F"),V()},b=(u,w)=>{w.id?x.confirm(`\u6B64\u64CD\u4F5C\u5C06\u5220\u9664 [${w.name}], \u662F\u5426\u7EE7\u7EED?`,"\u63D0\u793A",{confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(()=>{a.request({machineId:e.machineId,id:w.id}).then(()=>{d.fileTable.splice(u,1)})}):d.fileTable.splice(u,1)},U=u=>{if(u.type==1){d.tree.folder=u,d.tree.title=u.name,r(d.tree.node,d.tree.resolve),d.tree.visible=!0;return}n(u.id,u.path)},n=async(u,w)=>{const E=await T.fileContent.request({fileId:u,path:w,machineId:e.machineId});d.fileContent.content=E,d.fileContent.fileId=u,d.fileContent.dialogTitle=w,d.fileContent.path=w,d.fileContent.type=k(w),d.fileContent.contentVisible=!0},k=u=>u.endsWith(".sh")?"shell":u.endsWith("js")||u.endsWith("json")?"javascript":u.endsWith("Dockerfile")?"dockerfile":u.endsWith("nginx.conf")?"nginx":u.endsWith("yaml")||u.endsWith("yml")?"yaml":u.endsWith("xml")||u.endsWith("html")?"html":"text",A=async()=>{await $.request({content:d.fileContent.content,id:d.fileContent.fileId,path:d.fileContent.path,machineId:e.machineId}),j.success("\u4FEE\u6539\u6210\u529F"),d.fileContent.contentVisible=!1,d.fileContent.content=""},z=()=>{l("update:visible",!1),l("update:machineId",null),l("cancel"),d.fileTable=[],d.tree.folder={id:0}},r=async(u,w)=>{if(typeof w!="function")return;const E=d.tree.folder;if(u.level===0){d.tree.node=u,d.tree.resolve=w;const W=E?E.path:"/";return w([{name:W,type:"d",path:W}])}let N;const M=u.data;!M||M.name==M.path?N=E.path:N=M.path;const ie=await T.lsFile.request({fileId:E.id,machineId:e.machineId,path:N});for(const W of ie)W.type!="d"&&(W.leaf=!0);return w(ie)},o=(u,w)=>{const E=w.path;x.confirm(`\u6B64\u64CD\u4F5C\u5C06\u5220\u9664 [${E}], \u662F\u5426\u7EE7\u7EED?`,"\u63D0\u793A",{confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}).then(()=>{T.rmFile.request({fileId:d.tree.folder.id,path:E,machineId:e.machineId}).then(()=>{j.success("\u5220\u9664\u6210\u529F"),f.value.remove(u)})}).catch(()=>{})},p=(u,w)=>{const E=document.createElement("a");E.setAttribute("href",`${se.baseApiUrl}/machines/${e.machineId}/files/${d.tree.folder.id}/read?type=1&path=${w.path}&token=${h}`),E.click()},v=()=>`${se.baseApiUrl}/machines/${e.machineId}/files/${d.tree.folder.id}/upload?token=${h}`,Q=u=>{u.code!==200&&j.error(u.msg)},ce=u=>{j.success(`'${u.name}' \u4E0A\u4F20\u4E2D,\u8BF7\u5173\u6CE8\u7ED3\u679C\u901A\u77E5`)},fe=u=>{const w=u.path;return["/","//","/usr","/usr/","/usr/bin","/opt","/run","/etc","/proc","/var","/mnt","/boot","/dev","/home","/media","/root"].indexOf(w)!=-1},he=u=>{const w=Number(u);if(u&&!isNaN(w)){const E=["B","KB","MB","GB","TB","PB","EB","ZB","YB","BB"];let N=0,M=w;if(w>=1024)for(;M>1024;)M=M/1024,N++;return`${M.toFixed(2)}${E[N]}`}return"-"};return P(q({},L(d)),{fileTree:f,enums:O,token:h,cmOptions:c,add:m,getFiles:V,addFiles:D,deleteRow:b,getConf:U,getFileContent:n,updateContent:A,handleClose:z,loadNode:r,deleteFile:o,downloadFile:p,getUploadFile:v,beforeUpload:ce,uploadSuccess:Q,dontOperate:fe,formatFileSize:he})}}),Ol="";const Ge={class:"file-manage"},Je={class:"toolbar"},Ye={style:{float:"right"}},Ke=g("\u6DFB\u52A0"),Qe=g("\u786E\u5B9A"),Ze=g("\u67E5\u770B"),He=g("\u5220\u9664"),Xe={style:{height:"45vh",overflow:"auto"}},xe={class:"custom-tree-node"},el={class:"el-dropdown-link"},ll={key:0},il=i("i",{class:"el-icon-folder"},null,-1),tl={key:1},nl=i("i",{class:"el-icon-folder-opened"},null,-1),ol={key:2},al=i("i",{class:"el-icon-document"},null,-1),sl={style:{display:"inline-block"}},rl={key:0,style:{color:"#67c23a"}},dl=g(" \u67E5\u770B "),ul=g(" \u4E0A\u4F20 "),ml=g("\u4E0B\u8F7D"),pl=g("\u5220\u9664 "),cl={class:"dialog-footer"},fl=g("\u4FDD \u5B58"),hl=g("\u5173 \u95ED");function bl(e,l,y,a,$,I){const f=s("el-button"),h=s("el-input"),c=s("el-table-column"),d=s("el-option"),V=s("el-select"),m=s("el-table"),D=s("el-dialog"),b=s("el-link"),U=s("el-dropdown-item"),n=s("el-upload"),k=s("el-dropdown-menu"),A=s("el-dropdown"),z=s("el-tree"),r=s("codemirror"),o=X("auth");return _(),C("div",Ge,[i(D,{title:e.title,modelValue:e.dialogVisible,"onUpdate:modelValue":l[1]||(l[1]=p=>e.dialogVisible=p),"show-close":!0,"before-close":e.handleClose,width:"800px"},{default:t(()=>[i("div",Je,[i("div",Ye,[B(i(f,{type:"primary",onClick:e.add,icon:"el-icon-plus",size:"mini",plain:""},{default:t(()=>[Ke]),_:1},8,["onClick"]),[[o,"machine:file:add"]])])]),i(m,{data:e.fileTable,stripe:"",style:{width:"100%"}},{default:t(()=>[i(c,{prop:"name",label:"\u540D\u79F0",width:""},{default:t(p=>[i(h,{modelValue:p.row.name,"onUpdate:modelValue":v=>p.row.name=v,size:"mini",disabled:p.row.id!=null,clearable:""},null,8,["modelValue","onUpdate:modelValue","disabled"])]),_:1}),i(c,{prop:"name",label:"\u7C7B\u578B","min-width":"50px"},{default:t(p=>[i(V,{disabled:p.row.id!=null,size:"mini",modelValue:p.row.type,"onUpdate:modelValue":v=>p.row.type=v,style:{width:"100px"},placeholder:"\u8BF7\u9009\u62E9"},{default:t(()=>[(_(!0),C(Y,null,K(e.enums.FileTypeEnum,v=>(_(),C(d,{key:v.value,label:v.label,value:v.value},null,8,["label","value"]))),128))]),_:2},1032,["disabled","modelValue","onUpdate:modelValue"])]),_:1}),i(c,{prop:"path",label:"\u8DEF\u5F84",width:""},{default:t(p=>[i(h,{modelValue:p.row.path,"onUpdate:modelValue":v=>p.row.path=v,disabled:p.row.id!=null,size:"mini",clearable:""},null,8,["modelValue","onUpdate:modelValue","disabled"])]),_:1}),i(c,{label:"\u64CD\u4F5C",width:""},{default:t(p=>[p.row.id==null?(_(),C(f,{key:0,onClick:v=>e.addFiles(p.row),type:"success",icon:"el-icon-success",size:"mini",plain:""},{default:t(()=>[Qe]),_:2},1032,["onClick"])):S("",!0),p.row.id!=null?(_(),C(f,{key:1,onClick:v=>e.getConf(p.row),type:"primary",icon:"el-icon-tickets",size:"mini",plain:""},{default:t(()=>[Ze]),_:2},1032,["onClick"])):S("",!0),B(i(f,{type:"danger",onClick:v=>e.deleteRow(p.$index,p.row),icon:"el-icon-delete",size:"mini",plain:""},{default:t(()=>[He]),_:2},1032,["onClick"]),[[o,"machine:file:del"]])]),_:1})]),_:1},8,["data"])]),_:1},8,["title","modelValue","before-close"]),i(D,{title:e.tree.title,modelValue:e.tree.visible,"onUpdate:modelValue":l[3]||(l[3]=p=>e.tree.visible=p),"close-on-click-modal":!1,width:"680px"},{default:t(()=>[i("div",Xe,[e.tree.visible?(_(),C(z,{key:0,ref:"fileTree",load:e.loadNode,props:e.props,lazy:"","node-key":"id","expand-on-click-node":!0},{default:t(({node:p,data:v})=>[i("span",xe,[i(A,{size:"small",trigger:"contextmenu"},{dropdown:t(()=>[i(k,null,{default:t(()=>[i(U,null,{default:t(()=>[v.type=="-"&&v.size<1*1024*1024?(_(),C(b,{key:0,onClick:ee(Q=>e.getFileContent(e.tree.folder.id,v.path),["prevent"]),type:"info",icon:"el-icon-view",underline:!1},{default:t(()=>[dl]),_:2},1032,["onClick"])):S("",!0)]),_:2},1024),v.type=="d"?(_(),C(U,{key:0},{default:t(()=>[i(n,{"before-upload":e.beforeUpload,"on-success":e.uploadSuccess,headers:{token:e.token},data:{fileId:e.tree.folder.id,path:v.path,machineId:e.machineId},action:e.getUploadFile({path:v.path}),"show-file-list":!1,name:"file",multiple:"",limit:100,style:{display:"inline-block","margin-left":"2px"}},{default:t(()=>[B(i(b,{onClick:l[2]||(l[2]=ee(()=>{},["prevent"])),icon:"el-icon-upload",underline:!1},{default:t(()=>[ul]),_:1},512),[[o,"machine:file:upload"]])]),_:2},1032,["before-upload","on-success","headers","data","action"])]),_:2},1024)):S("",!0),i(U,null,{default:t(()=>[v.type=="-"?B((_(),C(b,{key:0,onClick:ee(Q=>e.downloadFile(p,v),["prevent"]),type:"primary",icon:"el-icon-download",underline:!1,style:{"margin-left":"2px"}},{default:t(()=>[ml]),_:2},1032,["onClick"])),[[o,"machine:file:write"]]):S("",!0)]),_:2},1024),i(U,null,{default:t(()=>[e.dontOperate(v)?S("",!0):B((_(),C(b,{key:0,onClick:ee(Q=>e.deleteFile(p,v),["prevent"]),type:"danger",icon:"el-icon-delete",underline:!1,style:{"margin-left":"2px"}},{default:t(()=>[pl]),_:2},1032,["onClick"])),[[o,"machine:file:rm"]])]),_:2},1024)]),_:2},1024)]),default:t(()=>[i("span",el,[v.type=="d"&&!p.expanded?(_(),C("span",ll,[il])):S("",!0),v.type=="d"&&p.expanded?(_(),C("span",tl,[nl])):S("",!0),v.type=="-"?(_(),C("span",ol,[al])):S("",!0),i("span",sl,[g(R(p.label)+" ",1),v.type=="-"?(_(),C("span",rl,"\xA0\xA0["+R(e.formatFileSize(v.size))+"]",1)):S("",!0)])])]),_:2},1024)])]),_:1},8,["load","props"])):S("",!0)])]),_:1},8,["title","modelValue"]),i(D,{"destroy-on-close":!0,title:e.fileContent.dialogTitle,modelValue:e.fileContent.contentVisible,"onUpdate:modelValue":l[6]||(l[6]=p=>e.fileContent.contentVisible=p),"close-on-click-modal":!1,top:"5vh",width:"70%"},{footer:t(()=>[i("div",cl,[B(i(f,{type:"primary",onClick:e.updateContent,size:"mini"},{default:t(()=>[fl]),_:1},8,["onClick"]),[[o,"machine:file:write"]]),i(f,{onClick:l[5]||(l[5]=p=>e.fileContent.contentVisible=!1),size:"mini"},{default:t(()=>[hl]),_:1})])]),default:t(()=>[i("div",null,[i(r,{"can-change-mode":!0,ref:"cmEditor",modelValue:e.fileContent.content,"onUpdate:modelValue":l[4]||(l[4]=p=>e.fileContent.content=p),language:e.fileContent.type},null,8,["modelValue","language"])])]),_:1},8,["title","modelValue"])])}ue.render=bl;var me=G({name:"MachineEdit",props:{visible:{type:Boolean},projects:{type:Array},machine:{type:[Boolean,Object]},title:{type:String}},setup(e,{emit:l}){const y=Z(null),a=J({dialogVisible:!1,projects:[],form:{id:null,projectId:null,projectName:null,name:null,port:22,username:null,password:null},btnLoading:!1,rules:{projectId:[{required:!0,message:"\u8BF7\u9009\u62E9\u9879\u76EE",trigger:["change","blur"]}],envId:[{required:!0,message:"\u8BF7\u9009\u62E9\u73AF\u5883",trigger:["change","blur"]}],name:[{required:!0,message:"\u8BF7\u8F93\u5165\u522B\u540D",trigger:["change","blur"]}],ip:[{required:!0,message:"\u8BF7\u8F93\u5165\u4E3B\u673Aip",trigger:["change","blur"]}],port:[{required:!0,message:"\u8BF7\u8F93\u5165\u7AEF\u53E3",trigger:["change","blur"]}],username:[{required:!0,message:"\u8BF7\u8F93\u5165\u7528\u6237\u540D",trigger:["change","blur"]}],password:[{required:!0,message:"\u8BF7\u8F93\u5165\u5BC6\u7801",trigger:["change","blur"]}]}});H(e,async h=>{a.dialogVisible=h.visible,a.projects=h.projects,h.machine?a.form=q({},h.machine):a.form={port:22}});const $=h=>{for(let c of a.projects)c.id==h&&(a.form.projectName=c.name)},I=async()=>{y.value.validate(h=>{if(h)T.saveMachine.request(a.form).then(()=>{j.success("\u4FDD\u5B58\u6210\u529F"),l("val-change",a.form),a.btnLoading=!0,setTimeout(()=>{a.btnLoading=!1},1e3),f()});else return j.error("\u8BF7\u6B63\u786E\u586B\u5199\u4FE1\u606F"),!1})},f=()=>{l("update:visible",!1),l("cancel"),setTimeout(()=>{y.value.resetFields(),a.form={}},200)};return P(q({},L(a)),{machineForm:y,changeProject:$,btnOk:I,cancel:f})}}),Wl="";const gl={class:"dialog-footer"},vl=g("\u786E \u5B9A"),yl=g("\u53D6 \u6D88");function _l(e,l,y,a,$,I){const f=s("el-option"),h=s("el-select"),c=s("el-form-item"),d=s("el-input"),V=s("el-form"),m=s("el-button"),D=s("el-dialog");return _(),C("div",null,[i(D,{title:e.title,modelValue:e.dialogVisible,"onUpdate:modelValue":l[8]||(l[8]=b=>e.dialogVisible=b),"show-close":!1,"before-close":e.cancel,width:"35%"},{footer:t(()=>[i("div",gl,[i(m,{type:"primary",loading:e.btnLoading,onClick:e.btnOk,size:"mini"},{default:t(()=>[vl]),_:1},8,["loading","onClick"]),i(m,{onClick:l[7]||(l[7]=b=>e.cancel()),size:"mini"},{default:t(()=>[yl]),_:1})])]),default:t(()=>[i(V,{model:e.form,ref:"machineForm",rules:e.rules,"label-width":"85px",size:"small"},{default:t(()=>[i(c,{prop:"projectId",label:"\u9879\u76EE:",required:""},{default:t(()=>[i(h,{style:{width:"100%"},modelValue:e.form.projectId,"onUpdate:modelValue":l[1]||(l[1]=b=>e.form.projectId=b),placeholder:"\u8BF7\u9009\u62E9\u9879\u76EE",onChange:e.changeProject,filterable:""},{default:t(()=>[(_(!0),C(Y,null,K(e.projects,b=>(_(),C(f,{key:b.id,label:`${b.name} [${b.remark}]`,value:b.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue","onChange"])]),_:1}),i(c,{prop:"name",label:"\u540D\u79F0:",required:""},{default:t(()=>[i(d,{modelValue:e.form.name,"onUpdate:modelValue":l[2]||(l[2]=b=>e.form.name=b),modelModifiers:{trim:!0},placeholder:"\u8BF7\u8F93\u5165\u673A\u5668\u522B\u540D","auto-complete":"off"},null,8,["modelValue"])]),_:1}),i(c,{prop:"ip",label:"ip:",required:""},{default:t(()=>[i(d,{modelValue:e.form.ip,"onUpdate:modelValue":l[3]||(l[3]=b=>e.form.ip=b),modelModifiers:{trim:!0},placeholder:"\u8BF7\u8F93\u5165\u4E3B\u673Aip","auto-complete":"off"},null,8,["modelValue"])]),_:1}),i(c,{prop:"port",label:"port:",required:""},{default:t(()=>[i(d,{type:"number",modelValue:e.form.port,"onUpdate:modelValue":l[4]||(l[4]=b=>e.form.port=b),modelModifiers:{trim:!0},placeholder:"\u8BF7\u8F93\u5165\u7AEF\u53E3"},null,8,["modelValue"])]),_:1}),i(c,{prop:"username",label:"\u7528\u6237\u540D:",required:""},{default:t(()=>[i(d,{modelValue:e.form.username,"onUpdate:modelValue":l[5]||(l[5]=b=>e.form.username=b),modelModifiers:{trim:!0},placeholder:"\u8BF7\u8F93\u5165\u7528\u6237\u540D"},null,8,["modelValue"])]),_:1}),i(c,{prop:"password",label:"\u5BC6\u7801:",required:""},{default:t(()=>[i(d,{type:"password","show-password":"",modelValue:e.form.password,"onUpdate:modelValue":l[6]||(l[6]=b=>e.form.password=b),modelModifiers:{trim:!0},placeholder:"\u8BF7\u8F93\u5165\u5BC6\u7801",autocomplete:"new-password"},null,8,["modelValue"])]),_:1})]),_:1},8,["model","rules"])]),_:1},8,["title","modelValue","before-close"])])}me.render=_l;var pe=G({name:"MachineList",components:{ServiceManage:de,FileManage:ue,MachineEdit:me},setup(){const e=Ce(),l=J({projects:[],params:{pageNum:1,pageSize:10,host:null,clusterId:null},data:{list:[],total:10},currentId:null,currentData:null,infoDialog:{visible:!1,info:""},serviceDialog:{visible:!1,machineId:0,title:""},fileDialog:{visible:!1,machineId:0,title:""},monitorDialog:{visible:!1,machineId:0},machineEditDialog:{visible:!1,data:null,title:"\u65B0\u589E\u673A\u5668"}});De(async()=>{V(),l.projects=(await Ie.projects.request({pageNum:1,pageSize:100})).list});const y=m=>{!m||(l.currentId=m.id,l.currentData=m)},a=m=>{const{href:D}=e.resolve({path:"/machine/terminal",query:{id:m.id,name:m.name}});window.open(D,"_blank")},$=async m=>{await T.closeCli.request({id:m.id}),j.success("\u5173\u95ED\u6210\u529F"),V()},I=m=>{let D;m?(l.machineEditDialog.data=l.currentData,D="\u7F16\u8F91\u673A\u5668"):(l.machineEditDialog.data={port:22},D="\u6DFB\u52A0\u673A\u5668"),l.machineEditDialog.title=D,l.machineEditDialog.visible=!0},f=async m=>{try{await x.confirm("\u786E\u5B9A\u5220\u9664\u8BE5\u673A\u5668\u4FE1\u606F? \u8BE5\u64CD\u4F5C\u5C06\u540C\u65F6\u5220\u9664\u811A\u672C\u53CA\u6587\u4EF6\u914D\u7F6E\u4FE1\u606F","\u63D0\u793A",{confirmButtonText:"\u786E\u5B9A",cancelButtonText:"\u53D6\u6D88",type:"warning"}),await T.del.request({id:m}),j.success("\u64CD\u4F5C\u6210\u529F"),l.currentId=null,l.currentData=null,V()}catch(D){}},h=m=>{l.serviceDialog.machineId=m.id,l.serviceDialog.visible=!0,l.serviceDialog.title=`${m.name} => ${m.ip}`},c=()=>{l.currentId=null,l.currentData=null,V()},d=m=>{l.fileDialog.visible=!0,l.fileDialog.machineId=m.id,l.fileDialog.title=`${m.name} => ${m.ip}`},V=async()=>{const m=await T.list.request(l.params);l.data=m};return P(q({},L(l)),{choose:y,showTerminal:a,openFormDialog:I,deleteMachine:f,closeCli:$,serviceManager:h,submitSuccess:c,fileManage:d,search:V})}}),Gl=`
.el-dialog__body {
    padding: 2px 2px;
}
`;const Cl=g("\u6DFB\u52A0"),Dl=g("\u7F16\u8F91"),Il=g("\u5220\u9664"),Vl=g("\u6587\u4EF6"),wl={style:{float:"right"}},Fl=i("i",null,null,-1),$l=g("\u811A\u672C"),kl=g("\u7EC8\u7AEF"),El=g("\u5173\u95ED\u8FDE\u63A5");function Bl(e,l,y,a,$,I){const f=s("el-button"),h=s("el-option"),c=s("el-select"),d=s("el-input"),V=s("el-radio"),m=s("el-table-column"),D=s("el-table"),b=s("el-pagination"),U=s("el-row"),n=s("el-card"),k=s("machine-edit"),A=s("service-manage"),z=s("file-manage"),r=X("auth");return _(),C("div",null,[i(n,null,{default:t(()=>[i("div",null,[B(i(f,{type:"primary",icon:"el-icon-plus",size:"mini",onClick:l[1]||(l[1]=o=>e.openFormDialog(!1)),plain:""},{default:t(()=>[Cl]),_:1},512),[[r,"machine:add"]]),B(i(f,{type:"primary",icon:"el-icon-edit",size:"mini",disabled:e.currentId==null,onClick:l[2]||(l[2]=o=>e.openFormDialog(e.currentData)),plain:""},{default:t(()=>[Dl]),_:1},8,["disabled"]),[[r,"machine:update"]]),B(i(f,{disabled:e.currentId==null,onClick:l[3]||(l[3]=o=>e.deleteMachine(e.currentId)),type:"danger",icon:"el-icon-delete",size:"mini"},{default:t(()=>[Il]),_:1},8,["disabled"]),[[r,"machine:del"]]),B(i(f,{type:"success",icon:"el-icon-files",disabled:e.currentId==null,onClick:l[4]||(l[4]=o=>e.fileManage(e.currentData)),size:"mini",plain:""},{default:t(()=>[Vl]),_:1},8,["disabled"]),[[r,"machine:file"]]),i("div",wl,[i(c,{size:"small",modelValue:e.params.projectId,"onUpdate:modelValue":l[5]||(l[5]=o=>e.params.projectId=o),placeholder:"\u8BF7\u9009\u62E9\u9879\u76EE",onClear:e.search,filterable:"",clearable:""},{default:t(()=>[(_(!0),C(Y,null,K(e.projects,o=>(_(),C(h,{key:o.id,label:`${o.name} [${o.remark}]`,value:o.id},null,8,["label","value"]))),128))]),_:1},8,["modelValue","onClear"]),i(d,{class:"ml5",placeholder:"\u8BF7\u8F93\u5165ip",size:"small",style:{width:"300px"},modelValue:e.params.ip,"onUpdate:modelValue":l[6]||(l[6]=o=>e.params.ip=o),onClear:e.search,plain:"",clearable:""},null,8,["modelValue","onClear"]),i(f,{class:"ml5",onClick:e.search,type:"success",icon:"el-icon-search",size:"small"},null,8,["onClick"])])]),i(D,{data:e.data.list,stripe:"",style:{width:"100%"},onCurrentChange:e.choose},{default:t(()=>[i(m,{label:"\u9009\u62E9",width:"55px"},{default:t(o=>[i(V,{modelValue:e.currentId,"onUpdate:modelValue":l[7]||(l[7]=p=>e.currentId=p),label:o.row.id},{default:t(()=>[Fl]),_:2},1032,["modelValue","label"])]),_:1}),i(m,{prop:"name",label:"\u540D\u79F0","min-width":"130"}),i(m,{prop:"ip",label:"ip:port","min-width":"130"},{default:t(o=>[g(R(`${o.row.ip}:${o.row.port}`),1)]),_:1}),i(m,{prop:"username",label:"\u7528\u6237\u540D","min-width":"75"}),i(m,{prop:"projectName",label:"\u9879\u76EE","min-width":"120"}),i(m,{prop:"ip",label:"hasCli",width:"70"},{default:t(o=>[g(R(`${o.row.hasCli?"\u662F":"\u5426"}`),1)]),_:1}),i(m,{prop:"createTime",label:"\u521B\u5EFA\u65F6\u95F4",width:"160"},{default:t(o=>[g(R(e.$filters.dateFormat(o.row.createTime)),1)]),_:1}),i(m,{prop:"creator",label:"\u521B\u5EFA\u8005","min-width":"55"}),i(m,{label:"\u64CD\u4F5C","min-width":"260",fixed:"right"},{default:t(o=>[i(f,{type:"success",onClick:p=>e.serviceManager(o.row),size:"mini",plain:""},{default:t(()=>[$l]),_:2},1032,["onClick"]),B(i(f,{type:"primary",onClick:p=>e.showTerminal(o.row),size:"mini",plain:""},{default:t(()=>[kl]),_:2},1032,["onClick"]),[[r,"machine:terminal"]]),i(f,{disabled:!o.row.hasCli,type:"danger",onClick:p=>e.closeCli(o.row),size:"mini",plain:""},{default:t(()=>[El]),_:2},1032,["disabled","onClick"])]),_:1})]),_:1},8,["data","onCurrentChange"]),i(U,{style:{"margin-top":"20px"},type:"flex",justify:"end"},{default:t(()=>[i(b,{style:{"text-align":"right"},total:e.data.total,layout:"prev, pager, next, total, jumper","current-page":e.params.pageNum,"onUpdate:current-page":l[8]||(l[8]=o=>e.params.pageNum=o),"page-size":e.params.pageSize},null,8,["total","current-page","page-size"])]),_:1})]),_:1}),i(k,{title:e.machineEditDialog.title,projects:e.projects,visible:e.machineEditDialog.visible,"onUpdate:visible":l[9]||(l[9]=o=>e.machineEditDialog.visible=o),machine:e.machineEditDialog.data,"onUpdate:machine":l[10]||(l[10]=o=>e.machineEditDialog.data=o),onValChange:e.submitSuccess},null,8,["title","projects","visible","machine","onValChange"]),i(A,{title:e.serviceDialog.title,visible:e.serviceDialog.visible,"onUpdate:visible":l[11]||(l[11]=o=>e.serviceDialog.visible=o),machineId:e.serviceDialog.machineId,"onUpdate:machineId":l[12]||(l[12]=o=>e.serviceDialog.machineId=o)},null,8,["title","visible","machineId"]),i(z,{title:e.fileDialog.title,visible:e.fileDialog.visible,"onUpdate:visible":l[13]||(l[13]=o=>e.fileDialog.visible=o),machineId:e.fileDialog.machineId,"onUpdate:machineId":l[14]||(l[14]=o=>e.fileDialog.machineId=o)},null,8,["title","visible","machineId"])])}pe.render=Bl;export default pe;