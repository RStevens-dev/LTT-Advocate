import {setupPeers} from './peer.js?v=0.4.0';
import {remainingMs,assignment,clamp,nextLabel,layoutFor,expired} from './core.mjs?v=0.4.0';
const $=id=>document.getElementById(id), q=new URLSearchParams(location.search), output=q.has('overlay'), session=q.get('session')||'default', key='advocate-v1'+(session==='default'?'':':'+session), other=h=>h==='Linus'?'Luke':'Linus';
const defaults={setup:'Enter',next:'Space',back:'Shift+Space',Linus:'1',Luke:'2',Heads:'H',Tails:'T',flip:'F',pause:'P',restart:'R',add:'Equal',subtract:'Minus',toggle:'O',timer:'C',clear:'Ctrl+Shift+X',end:'Ctrl+Shift+E'};
const initial=()=>({stage:0,topic:'Should AI be used to reverse-engineer games?',Heads:'Protect game developers',Tails:'Defend user freedom',think:30,Linus:120,Luke:120,left:'Linus',layout:'split',placement:'center',theme:'wan',caller:null,call:null,result:null,flipAt:0,remaining:0,total:0,deadline:0,visible:true,timerVisible:true,done:false,enabled:true,keys:{...defaults},outputs:{},failAfter:15,rule:'landed',order:'caller',rebuttal:0,round:0,first:null,pausedMs:0,profiles:{}});
let s=initial(), recording=null, clean=false;
let peerTransport,lastSeen=0,offset=0,testKeys=false;const displayId=crypto.randomUUID(), displays=new Map(); const pairing=output&&q.has('pair');
try{s={...s,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel(key):null;
function receive(v){if(output&&v&&Number.isInteger(v.stage)&&v.stage>=0&&v.stage<=4){lastSeen=Date.now();offset=v.sentAt? v.sentAt-lastSeen:0;s={...initial(),...v};render()}}
if(channel)channel.onmessage=e=>{if(!output&&e.data?.request){displays.set(e.data.id,{name:e.data.name,at:Date.now()});channel.postMessage({...s,sentAt:Date.now()});}else receive(e.data)};
window.addEventListener('storage',e=>{if(e.key===key&&e.newValue)try{receive(JSON.parse(e.newValue))}catch{}});
function save(){try{localStorage.setItem(key,JSON.stringify(s))}catch{}channel?.postMessage({...s,sentAt:Date.now()});peerTransport?.publish();render()}
const ms=()=>remainingMs(s.deadline,s.pausedMs??s.remaining*1000,Date.now()+offset);const remaining=()=>Math.ceil(ms()/1000);
const speaker=()=>s.stage===3?(s.first||s.caller):s.stage===4?other(s.first||s.caller):null;
function start(n){s.total=s.remaining=n;s.pausedMs=n*1000;s.deadline=n?Date.now()+n*1000:0}
function face(h){return s.result?(h===s.caller?assignment(s.result,s.call,s.rule):otherFace(assignment(s.result,s.call,s.rule))):(h===s.left?'Heads':'Tails')}
function otherFace(f){return f==='Heads'?'Tails':'Heads'}
function action(a){
if(output)return;
if(a==='setup'&&s.stage===0){for(const [id,k] of [['topic','topic'],['heads','Heads'],['tails','Tails']]){if(!$(id).value.trim())return;s[k]=$(id).value.trim()}for(const [id,k,min] of [['think','think',0],['linus','Linus',1],['luke','Luke',1]]){const n=Number($(id).value);if(!Number.isFinite(n)||n<min||n>3600)return;s[k]=Math.floor(n)}s.rule=$('rule').value;s.order=$('order').value;s.rebuttal=Number($('rebuttal').value)||0;s.stage=1}
else if(a==='reset'){const old=s;s={...initial(),topic:old.topic,Heads:old.Heads,Tails:old.Tails,think:old.think,Linus:old.Linus,Luke:old.Luke,layout:old.layout,placement:old.placement,theme:old.theme,left:old.left,keys:old.keys,enabled:old.enabled,outputs:old.outputs,failAfter:old.failAfter,rule:old.rule,order:old.order,rebuttal:old.rebuttal,profiles:old.profiles};fill()}
else if(a==='clear'){s.visible=false}
else if(a==='toggle'){s.visible=!s.visible}
else if(a==='timer'){s.timerVisible=!s.timerVisible}
else if(a==='end'){s.done=true;s.deadline=0;s.visible=false}
else if(s.done)return;
else if(s.stage===1&&!s.result&&!s.flipAt&&['Linus','Luke'].includes(a)){s.caller=a;s.call=null}
else if(s.stage===1&&!s.result&&!s.flipAt&&s.caller&&['Heads','Tails'].includes(a)){s.call=a}
else if((a==='flip'||a==='next')&&s.stage===1&&s.caller&&s.call&&!s.result&&!s.flipAt){s.flipAt=Date.now()+1500}
else if(a==='next'&&s.stage===1&&s.result){s.stage=2;start(s.think)}
else if(a==='next'&&s.stage===2){s.stage=3;start(s[s.first||s.caller])}
else if(a==='next'&&s.stage===3){s.stage=4;start(s.round?s.rebuttal:s[other(s.first||s.caller)])}
else if(a==='next'&&s.stage===4){if(s.rebuttal&&!s.round){s.round=1;s.stage=3;start(s.rebuttal)}else{s.pausedMs=ms();s.remaining=remaining();s.done=true;s.deadline=0}}
else if(a==='back'&&s.stage>1){s.stage--;s.deadline=0;s.remaining=s.total=s.stage===2?s.think:s.stage===3?s[s.first||s.caller]:0;s.pausedMs=s.remaining*1000}
else if(a==='pause'&&s.stage>=2){if(s.deadline){s.pausedMs=ms();s.remaining=remaining();s.deadline=0}else if(s.remaining)s.deadline=Date.now()+s.pausedMs}
else if(a==='restart'&&s.stage>=2)start(s.total);
else if(['add','subtract'].includes(a)&&s.stage>=2){let n=Math.max(0,Math.min(3600,remaining()+(a==='add'?10:-10)));s.remaining=n;s.pausedMs=n*1000;s.total=Math.max(s.total,n);if(s.deadline)s.deadline=n?Date.now()+n*1000:0}
else return;
save()
}
function el(tag,cls,txt){const e=document.createElement(tag);e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function render(){
const p=$('screen'),f=output?q.get('overlay'):$('format').value, single=['linus','luke','square'].includes(f),stack=f==='stack', hosts=single?[f==='luke'?'Luke':'Linus']:[s.left,other(s.left)];
p.className=(single?'single ':'')+(!output&&clean?'clean':'');if(!output){p.style.aspectRatio=stack||f==='linus'||f==='luke'?'9/16':f==='square'?'1':'16/9';p.style.maxWidth=stack||f==='linus'||f==='luke'?'360px':f==='square'?'600px':'';p.style.margin='auto'}
p.replaceChildren();if(!output&&!clean)p.append(mockCamera(hosts,stack,single));if(!s.visible||(output&&(!lastSeen||expired(lastSeen,Date.now(),s.failAfter)))){if(!output)$('status').textContent='Overlay hidden · Toggle to restore';return;}
const l=layoutFor(s,f);const grid=el('div','grid');grid.style.padding=(l.inset??1)+'cqw';if(single||stack)grid.style.gridTemplateColumns='1fr';p.append(grid);
function header(){let h=el('div','header');h.append(el('div','brand',"DEVIL'S ADVOCATE"),el('div','',s.topic));return h}
function clock(){let t=el('div','timer');let n=remaining();t.append(el('small','',s.done?'COMPLETE':n===0?'TIME IS UP':s.stage===2?'THINKING':(speaker()||'')+' SPEAKING'),el('div',n<=10?'urgent':'',String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')));return t}
if(l.layout==='full'||l.layout==='minimal'){let h=header();h.style.gridColumn='1/-1';grid.append(h)}
for(const host of hosts){let col=el('div','');if(stack)col.style.minHeight='48vh';if(l.layout==='split'||l.layout==='combined')col.append(header());let pos=el('div','position'+(speaker()===host&&!s.done?' active':''));pos.style.borderColor=l.theme==='mono'?'#aaa':l.theme==='duel'?(face(host)==='Heads'?'#ef7650':'#609df0'):'#f47b42';pos.append(el('small','',s.result?host.toUpperCase()+(speaker()===host?' · SPEAKING':''):face(host).toUpperCase()),el('div','',s[face(host)]));col.append(pos);if(s.stage>=2&&s.timerVisible&&l.showTimer!==false&&['individual','inline'].includes(l.placement)&&(s.stage===2||speaker()===host)){let t=clock();t.style.position='static';t.style.transform='none';col.append(t)}grid.append(col)}
if(s.stage===1){let t=el('div','timer');let c=el('div','coin'+(s.flipAt?' spin':''),s.result?s.result[0]:'?');t.append(c,el('small','',s.flipAt?'FLIPPING…':s.result?s.result.toUpperCase()+' · '+(s.first||s.caller).toUpperCase()+' FIRST':s.caller?(s.caller+' calls '+(s.call||'…')).toUpperCase():'COIN TOSS'));p.append(t)}
if(s.stage>=2&&s.timerVisible&&!['hidden','individual','inline'].includes(l.placement)){let t=clock();if(l.placement==='bottom'){t.style.top='auto';t.style.bottom='5%'}t.style.left=(l.timerX??50)+'%';if(l.placement!=='bottom')t.style.top=(l.timerY??45)+'%';t.style.scale=(l.scale??100)/100;p.append(t)}
if(!output){$('liveclock').textContent=String(Math.floor(remaining()/60)).padStart(2,'0')+':'+String(remaining()%60).padStart(2,'0');$('stages').textContent=['Setup','Coin toss','Thinking','Argument 1','Argument 2'].map((x,i)=>i===s.stage?'['+x+']':x).join('  →  ');$('status').textContent='Stage '+(s.stage+1)+' / 5 · '+(s.done?'Complete':['Setup','Coin toss','Thinking','First argument','Second argument'][s.stage]);$('actions').querySelectorAll('button').forEach(b=>{let a=b.dataset.action;b.textContent=(a==='next'?nextLabel(s):a==='pause'?(s.deadline?'Pause':'Resume'):a==='clear'?'EMERGENCY CLEAR':a)+(s.keys[a]?' · '+s.keys[a]:'');b.disabled=(a==='next'&&(s.done||s.stage===0||(s.stage===1&&!s.result&&(!s.call||!!s.flipAt))))||(['Linus','Luke','Heads','Tails','flip'].includes(a)&&(s.stage!==1||!!s.result||!!s.flipAt))||(['pause','restart','add','subtract'].includes(a)&&(s.stage<2||s.done))});}
}
function fill(){for(const [id,k] of [['topic','topic'],['heads','Heads'],['tails','Tails'],['think','think'],['linus','Linus'],['luke','Luke'],['layout','layout'],['placement','placement'],['theme','theme'],['left','left']])$(id).value=s[k];$('enabled').checked=s.enabled;drawKeys()}
function drawKeys(){const box=$('keys');box.replaceChildren();for(const a of Object.keys(defaults)){let row=el('div','row'),b=el('button','',recording===a?'Press keys…':s.keys[a]||'Unassigned'),clear=el('button','','Clear');b.onclick=()=>{recording=a;drawKeys();document.body.focus()};clear.onclick=()=>{s.keys[a]='';save();drawKeys()};row.append(el('span','',a),b,clear);box.append(row)}}
function combo(e){if(['Shift','Control','Alt','Meta'].includes(e.key))return '';let k=e.code==='Space'?'Space':e.code.startsWith('Key')?e.code.slice(3):e.code.startsWith('Digit')?e.code.slice(5):e.code;return [e.ctrlKey?'Ctrl':'',e.altKey?'Alt':'',e.shiftKey?'Shift':'',e.metaKey?'Meta':'',k].filter(Boolean).join('+')}
if(output){document.body.classList.add('output');if(pairing)document.body.classList.add('pairing');}else{
document.body.tabIndex=-1;
for(const a of ['Linus','Luke','Heads','Tails','flip','next','back','pause','restart','add','subtract','toggle','timer','clear','end','reset']){let b=el('button','',a);b.dataset.action=a;$('actions').append(b)}
document.addEventListener('click',e=>{const a=e.target.closest('[data-action]')?.dataset.action;if(a)action(a)});
for(const id of ['layout','placement','theme','left'])$(id).onchange=()=>{if(id==='left')s.left=$(id).value;else {let f=$('format').value;s.outputs[f]={...s.outputs[f],[id]:$(id).value}}save()};
function layoutFields(){let l=layoutFor(s,$('format').value);for(let id of ['layout','placement','theme','timerX','timerY','scale','inset'])$(id).value=l[id]??({timerX:50,timerY:45,scale:100,inset:1}[id]);$('showTimer').checked=l.showTimer!==false}
for(let id of ['timerX','timerY','scale','inset','showTimer'])$(id).oninput=()=>{let f=$('format').value;s.outputs[f]={...s.outputs[f],[id]:id==='showTimer'?$(id).checked:Number($(id).value)};save()};
$('failAfter').value=s.failAfter;$('failAfter').onchange=()=>{s.failAfter=Number($('failAfter').value);save()};$('rule').value=s.rule;$('order').value=s.order;$('rebuttal').value=s.rebuttal;
$('newsession').onclick=()=>window.open('?session='+crypto.randomUUID(),'_blank');$('sessionlabel').textContent=session;
$('testkeys').onchange=()=>testKeys=$('testkeys').checked;$('saveprofile').onclick=()=>{let n=$('profilename').value.trim();if(n){s.profiles[n]={...s.keys};save()}};$('loadprofile').onclick=()=>{let k=s.profiles[$('profilename').value.trim()];if(k){s.keys={...k};save();drawKeys()}};layoutFields();
$('mocktoggle').onclick=()=>{clean=!clean;$('mocktoggle').textContent=clean?'Mock camera preview':'Transparent preview';render()};$('format').onchange=()=>{layoutFields();render()};$('enabled').onchange=()=>{s.enabled=$('enabled').checked;save()};
for(const f of ['wide','linus','luke','stack','square']){let row=el('div','row'),a=el('button','','Launch '+f+' display');a.onclick=()=>window.open('display.html?overlay='+f+'&session='+encodeURIComponent(session),'advocate-'+f,'popup,width='+ (f==='wide'?960:420)+',height='+(f==='wide'?540:740));row.append(a);$('links').append(row)}
$('defaults').onclick=()=>{s.keys={...defaults};save();drawKeys()};
$('export').onclick=()=>{let a=el('a','');a.href=URL.createObjectURL(new Blob([JSON.stringify(s.keys,null,2)],{type:'application/json'}));a.download='advocate-hotkeys.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('import').onchange=async()=>{try{let v=JSON.parse(await $('import').files[0].text()),k={};for(const a of Object.keys(defaults)){if(typeof v[a]!=='string')throw Error('Missing '+a);k[a]=v[a]}let used=Object.values(k).filter(Boolean);if(new Set(used).size!==used.length)throw Error('Duplicate bindings');s.keys=k;save();drawKeys();$('message').textContent='Imported'}catch(e){$('message').textContent=e.message}};
document.addEventListener('keydown',e=>{if(e.repeat)return;let k=combo(e);if(!k)return;if(recording){e.preventDefault();if(e.key==='Escape'){recording=null;drawKeys();return}if(Object.keys(s.keys).some(a=>a!==recording&&s.keys[a]===k)){$('message').textContent='Shortcut already assigned';return}s.keys[recording]=k;recording=null;save();drawKeys();return}if(!s.enabled||e.target.closest('input,select,textarea,button,[contenteditable]'))return;let a=Object.keys(s.keys).find(a=>s.keys[a]===k);if(a){e.preventDefault();if(testKeys)$('message').textContent='Detected: '+a;else action(a)}});
fill()}
setInterval(()=>{if(!output&&s.flipAt&&Date.now()>=s.flipAt){s.result=crypto.getRandomValues(new Uint32Array(1))[0]%2?'Heads':'Tails';s.flipAt=0;s.first=s.order==='other'?other(s.caller):s.order==='Linus'||s.order==='Luke'?s.order:s.caller;save()}else if(s.deadline||s.flipAt)render()},200);
render();

peerTransport=setupPeers({output,pairing,read:()=>({...s,sentAt:Date.now()}),receive});
if(pairing){let b=el('button','','Hide pairing panel / go on air');b.onclick=()=>document.body.classList.remove('pairing');$('pairpanel').prepend(b);document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.toggle('pairing')})}
function heartbeat(){if(output){channel?.postMessage({request:true,id:displayId,name:q.get('overlay')});render()}else{channel?.postMessage({...s,sentAt:Date.now()});peerTransport?.publish();$('displayhealth').textContent=[...displays.values()].filter(d=>Date.now()-d.at<6000).map(d=>d.name+' online').join(' · ')||'No automatic displays connected'}}
setInterval(heartbeat,2000);heartbeat();if(!output)save();

function mockCamera(hosts,stack,single){
const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
svg.setAttribute('class','mockcamera');svg.setAttribute('viewBox',single||stack?'0 0 360 640':'0 0 640 360');svg.setAttribute('preserveAspectRatio','none');
const wide=!single&&!stack;
svg.innerHTML='<defs><pattern id="hex" width="100" height="58" patternUnits="userSpaceOnUse"><path d="M0 14L25 0H75L100 14V44L75 58H25L0 44Z" fill="none" stroke="#111" stroke-width="3" opacity=".4"/></pattern></defs><rect width="100%" height="100%" fill="url(#hex)"/>';
hosts.forEach((host,i)=>{let x=wide?(i?476:164):180,y=wide?177:stack?(i?475:165):330;let g=document.createElementNS(ns,'g');g.setAttribute('transform','translate('+x+' '+y+')');g.innerHTML='<rect x="-62" y="-35" width="124" height="177" rx="20" fill="#292b30" stroke="#717279" stroke-width="2"/><circle r="29" fill="#b0a5a0"/><path d="M-79 130V82Q-79 38 0 38T79 82V130Z" fill="#222329"/><path d="M-33 0a33 33 0 0 1 66 0" fill="none" stroke="#111216" stroke-width="8"/><rect x="-145" y="125" width="290" height="45" fill="#37383c"/><path d="M-75 91H45L64 135H-58Z" fill="#17181c" stroke="#777"/><path d="M100 120L47 45" stroke="#141519" stroke-width="7"/>';let t=document.createElementNS(ns,'text');t.setAttribute('y','155');t.setAttribute('text-anchor','middle');t.setAttribute('fill','#ddd');t.setAttribute('font-size','12');t.textContent=host.toUpperCase();g.append(t);svg.append(g)});return svg
}
