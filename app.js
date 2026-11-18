const $=id=>document.getElementById(id), q=new URLSearchParams(location.search), output=q.has('overlay'), key='advocate-v1', other=h=>h==='Linus'?'Luke':'Linus';
const defaults={setup:'Enter',next:'Space',back:'Shift+Space',Linus:'1',Luke:'2',Heads:'H',Tails:'T',flip:'F',pause:'P',restart:'R',add:'Equal',subtract:'Minus',toggle:'O',timer:'C',clear:'Ctrl+Shift+X',end:'Ctrl+Shift+E'};
const initial=()=>({stage:0,topic:'Should AI be used to reverse-engineer games?',Heads:'Protect game developers',Tails:'Defend user freedom',think:30,Linus:120,Luke:120,left:'Linus',layout:'split',placement:'center',theme:'wan',caller:null,call:null,result:null,flipAt:0,remaining:0,total:0,deadline:0,visible:true,timerVisible:true,done:false,enabled:true,keys:{...defaults}});
let s=initial(), recording=null;
try{s={...s,...JSON.parse(localStorage.getItem(key)||'{}')}}catch{}
const channel=typeof BroadcastChannel!=='undefined'?new BroadcastChannel(key):null;
function receive(v){if(v&&typeof v.stage==='number'){s=v;render()}}
if(channel)channel.onmessage=e=>receive(e.data);
window.addEventListener('storage',e=>{if(e.key===key&&e.newValue)try{receive(JSON.parse(e.newValue))}catch{}});
function save(){localStorage.setItem(key,JSON.stringify(s));channel?.postMessage(s);render()}
const remaining=()=>s.deadline?Math.max(0,Math.ceil((s.deadline-Date.now())/1000)):s.remaining;
const speaker=()=>s.stage===3?s.caller:s.stage===4?other(s.caller):null;
function start(n){s.total=s.remaining=n;s.deadline=n?Date.now()+n*1000:0}
function face(h){return s.result?(h===s.caller?s.result:otherFace(s.result)):(h===s.left?'Heads':'Tails')}
function otherFace(f){return f==='Heads'?'Tails':'Heads'}
function action(a){
if(output)return;
if(a==='setup'&&s.stage===0){for(const [id,k] of [['topic','topic'],['heads','Heads'],['tails','Tails']]){if(!$(id).value.trim())return;s[k]=$(id).value.trim()}for(const [id,k,min] of [['think','think',0],['linus','Linus',1],['luke','Luke',1]]){const n=Number($(id).value);if(!Number.isFinite(n)||n<min||n>3600)return;s[k]=Math.floor(n)}s.stage=1}
else if(a==='reset'){const old=s;s={...initial(),topic:old.topic,Heads:old.Heads,Tails:old.Tails,think:old.think,Linus:old.Linus,Luke:old.Luke,layout:old.layout,placement:old.placement,theme:old.theme,left:old.left,keys:old.keys,enabled:old.enabled};fill()}
else if(a==='clear'){s.visible=false}
else if(a==='toggle'){s.visible=!s.visible}
else if(a==='timer'){s.timerVisible=!s.timerVisible}
else if(a==='end'){s.done=true;s.deadline=0;s.visible=false}
else if(s.done)return;
else if(s.stage===1&&!s.result&&!s.flipAt&&['Linus','Luke'].includes(a)){s.caller=a;s.call=null}
else if(s.stage===1&&!s.result&&!s.flipAt&&s.caller&&['Heads','Tails'].includes(a)){s.call=a}
else if((a==='flip'||a==='next')&&s.stage===1&&s.caller&&s.call&&!s.result&&!s.flipAt){s.flipAt=Date.now()+1500}
else if(a==='next'&&s.stage===1&&s.result){s.stage=2;start(s.think)}
else if(a==='next'&&s.stage===2){s.stage=3;start(s[s.caller])}
else if(a==='next'&&s.stage===3){s.stage=4;start(s[other(s.caller)])}
else if(a==='next'&&s.stage===4){s.done=true;s.deadline=0}
else if(a==='back'&&s.stage>1){s.stage--;s.deadline=0;s.remaining=s.total=s.stage===2?s.think:s.stage===3?s[s.caller]:0}
else if(a==='pause'&&s.stage>=2){if(s.deadline){s.remaining=remaining();s.deadline=0}else if(s.remaining)s.deadline=Date.now()+s.remaining*1000}
else if(a==='restart'&&s.stage>=2)start(s.total);
else if(['add','subtract'].includes(a)&&s.stage>=2){let n=Math.max(0,Math.min(3600,remaining()+(a==='add'?10:-10)));s.remaining=n;s.total=Math.max(s.total,n);if(s.deadline)s.deadline=n?Date.now()+n*1000:0}
else return;
save()
}
function el(tag,cls,txt){const e=document.createElement(tag);e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function render(){
const p=$('screen'),f=output?q.get('overlay'):$('format').value, single=['linus','luke','square'].includes(f),stack=f==='stack', hosts=single?[f==='luke'?'Luke':'Linus']:[s.left,other(s.left)];
p.className=single?'single':'';if(!output){p.style.aspectRatio=stack||f==='linus'||f==='luke'?'9/16':f==='square'?'1':'16/9';p.style.maxWidth=stack||f==='linus'||f==='luke'?'360px':f==='square'?'600px':'';p.style.margin='auto'}
p.replaceChildren();if(!s.visible)return;
const grid=el('div','grid');if(single||stack)grid.style.gridTemplateColumns='1fr';p.append(grid);
function header(){let h=el('div','header');h.append(el('div','brand',"DEVIL'S ADVOCATE"),el('div','',s.topic));return h}
function clock(){let t=el('div','timer');let n=remaining();t.append(el('small','',s.done?'COMPLETE':n===0?'TIME IS UP':s.stage===2?'THINKING':(speaker()||'')+' SPEAKING'),el('div',n<=10?'urgent':'',String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')));return t}
if(s.layout==='full'||s.layout==='minimal'){let h=header();h.style.gridColumn='1/-1';grid.append(h)}
for(const host of hosts){let col=el('div','');if(stack)col.style.minHeight='48vh';if(s.layout==='split'||s.layout==='combined')col.append(header());let pos=el('div','position'+(speaker()===host&&!s.done?' active':''));pos.style.borderColor=s.theme==='mono'?'#aaa':s.theme==='duel'?(face(host)==='Heads'?'#ef7650':'#609df0'):'#f47b42';pos.append(el('small','',s.result?host.toUpperCase()+(speaker()===host?' · SPEAKING':''):face(host).toUpperCase()),el('div','',s[face(host)]));col.append(pos);if(s.stage>=2&&s.timerVisible&&['individual','inline'].includes(s.placement)&&(s.stage===2||speaker()===host)){let t=clock();t.style.position='static';t.style.transform='none';col.append(t)}grid.append(col)}
if(s.stage===1){let t=el('div','timer');let c=el('div','coin'+(s.flipAt?' spin':''),s.result?s.result[0]:'?');t.append(c,el('small','',s.flipAt?'FLIPPING…':s.result?s.result.toUpperCase()+' · '+s.caller.toUpperCase()+' FIRST':s.caller?(s.caller+' calls '+(s.call||'…')).toUpperCase():'COIN TOSS'));p.append(t)}
if(s.stage>=2&&s.timerVisible&&!['hidden','individual','inline'].includes(s.placement)){let t=clock();if(s.placement==='bottom'){t.style.top='auto';t.style.bottom='5%'}p.append(t)}
if(!output){$('status').textContent='Stage '+(s.stage+1)+' / 5 · '+(s.done?'Complete':['Setup','Coin toss','Thinking','First argument','Second argument'][s.stage]);$('actions').querySelectorAll('button').forEach(b=>{let a=b.dataset.action;b.disabled=(['Linus','Luke','Heads','Tails','flip'].includes(a)&&(s.stage!==1||!!s.result||!!s.flipAt))||(['pause','restart','add','subtract'].includes(a)&&(s.stage<2||s.done))});}
}
function fill(){for(const [id,k] of [['topic','topic'],['heads','Heads'],['tails','Tails'],['think','think'],['linus','Linus'],['luke','Luke'],['layout','layout'],['placement','placement'],['theme','theme'],['left','left']])$(id).value=s[k];$('enabled').checked=s.enabled;drawKeys()}
function drawKeys(){const box=$('keys');box.replaceChildren();for(const a of Object.keys(defaults)){let row=el('div','row'),b=el('button','',recording===a?'Press keys…':s.keys[a]||'Unassigned'),clear=el('button','','Clear');b.onclick=()=>{recording=a;drawKeys();document.body.focus()};clear.onclick=()=>{s.keys[a]='';save();drawKeys()};row.append(el('span','',a),b,clear);box.append(row)}}
function combo(e){if(['Shift','Control','Alt','Meta'].includes(e.key))return '';let k=e.code==='Space'?'Space':e.code.startsWith('Key')?e.code.slice(3):e.code.startsWith('Digit')?e.code.slice(5):e.code;return [e.ctrlKey?'Ctrl':'',e.altKey?'Alt':'',e.shiftKey?'Shift':'',e.metaKey?'Meta':'',k].filter(Boolean).join('+')}
if(output){document.body.classList.add('output')}else{
document.body.tabIndex=-1;
for(const a of ['Linus','Luke','Heads','Tails','flip','next','back','pause','restart','add','subtract','toggle','timer','clear','end','reset']){let b=el('button','',a);b.dataset.action=a;$('actions').append(b)}
document.addEventListener('click',e=>{const a=e.target.closest('[data-action]')?.dataset.action;if(a)action(a)});
for(const id of ['layout','placement','theme','left'])$(id).onchange=()=>{s[id]=$(id).value;save()};
$('format').onchange=render;$('enabled').onchange=()=>{s.enabled=$('enabled').checked;save()};
for(const f of ['wide','linus','luke','stack','square']){let a=el('a','',f+' overlay');a.href='?overlay='+f;a.target='_blank';a.rel='noopener';$('links').append(a,document.createTextNode(' · '))}
$('defaults').onclick=()=>{s.keys={...defaults};save();drawKeys()};
$('export').onclick=()=>{let a=el('a','');a.href=URL.createObjectURL(new Blob([JSON.stringify(s.keys,null,2)],{type:'application/json'}));a.download='advocate-hotkeys.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('import').onchange=async()=>{try{let v=JSON.parse(await $('import').files[0].text()),k={};for(const a of Object.keys(defaults)){if(typeof v[a]!=='string')throw Error('Missing '+a);k[a]=v[a]}let used=Object.values(k).filter(Boolean);if(new Set(used).size!==used.length)throw Error('Duplicate bindings');s.keys=k;save();drawKeys();$('message').textContent='Imported'}catch(e){$('message').textContent=e.message}};
document.addEventListener('keydown',e=>{if(e.repeat)return;let k=combo(e);if(!k)return;if(recording){e.preventDefault();if(e.key==='Escape'){recording=null;drawKeys();return}if(Object.keys(s.keys).some(a=>a!==recording&&s.keys[a]===k)){$('message').textContent='Shortcut already assigned';return}s.keys[recording]=k;recording=null;save();drawKeys();return}if(!s.enabled||e.target.closest('input,select,textarea,button,[contenteditable]'))return;let a=Object.keys(s.keys).find(a=>s.keys[a]===k);if(a){e.preventDefault();action(a)}});
fill()}
setInterval(()=>{if(!output&&s.flipAt&&Date.now()>=s.flipAt){s.result=crypto.getRandomValues(new Uint32Array(1))[0]%2?'Heads':'Tails';s.flipAt=0;save()}else if(s.deadline||s.flipAt)render()},200);
render();
