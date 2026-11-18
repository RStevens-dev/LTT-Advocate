// No STUN, TURN, signaling service or media permissions.
export function setupPeers({output,pairing,read,receive}){
const peers=new Set(), panel=document.getElementById('pairpanel');
const node=(tag,text)=>{let e=document.createElement(tag);if(text)e.textContent=text;return e};
function button(label,fn){let b=node('button',label);b.onclick=async()=>{b.disabled=true;try{await fn()}catch(e){status.textContent=e.message}finally{b.disabled=false}};return b}
const status=node('p','Local peer-to-peer · no external signaling');
function send(p){if(p.dc?.readyState==='open')try{p.dc.send(JSON.stringify({type:'state',state:read()}))}catch{}}
function create(){
if(!window.RTCPeerConnection)throw Error('WebRTC is unavailable in this browser');
let p={pc:new RTCPeerConnection({iceServers:[]}),dc:null};peers.add(p);
p.pc.onconnectionstatechange=()=>{p.label.textContent=p.pc.connectionState;if(p.pc.connectionState==='failed')p.label.textContent='Failed — pair again'};
return p
}
function wire(p,dc){p.dc=dc;dc.onopen=()=>{p.label.textContent='Connected';if(!output)send(p)};dc.onclose=()=>p.label.textContent='Disconnected — pair again';dc.onerror=()=>p.label.textContent='Channel error';dc.onmessage=e=>{if(!output)return;try{let m=JSON.parse(e.data);if(m.type==='state')receive(m.state)}catch{}}}
async function gather(pc){if(pc.iceGatheringState==='complete')return;await new Promise((resolve,reject)=>{let timeout=setTimeout(()=>{pc.removeEventListener('icegatheringstatechange',check);reject(Error('ICE gathering timed out; retry pairing'))},15000);function check(){if(pc.iceGatheringState==='complete'){clearTimeout(timeout);pc.removeEventListener('icegatheringstatechange',check);resolve()}}pc.addEventListener('icegatheringstatechange',check);check()})}
function parse(t,type){let v=JSON.parse(t);if(v.type!==type||typeof v.sdp!=='string')throw Error('Expected '+type+' connection code');return v}
function row(){
let p=create(), box=node('fieldset'), name=node('input');name.placeholder='Display name';name.value='Display '+peers.size;p.label=node('strong','Not connected');let input=node('textarea'), code=node('textarea');input.placeholder=output?'Paste producer offer':'Paste display response';code.readOnly=true;code.placeholder='Generated connection code';for(let e of [input,code]){e.rows=4;e.style.cssText='display:block;width:100%;margin:8px 0'}
box.append(name,p.label,input,code);
if(output){p.pc.ondatachannel=e=>wire(p,e.channel);box.append(button('Accept offer / generate response',async()=>{await p.pc.setRemoteDescription(parse(input.value,'offer'));await p.pc.setLocalDescription(await p.pc.createAnswer());await gather(p.pc);code.value=JSON.stringify(p.pc.localDescription)}))}
else{wire(p,p.pc.createDataChannel('advocate',{ordered:true}));box.append(button('Generate offer',async()=>{await p.pc.setLocalDescription(await p.pc.createOffer());await gather(p.pc);code.value=JSON.stringify(p.pc.localDescription)}),button('Accept response',async()=>{await p.pc.setRemoteDescription(parse(input.value,'answer'))}))}
box.append(button('Select connection code',()=>{code.focus();code.select()}),button('Disconnect',()=>{p.pc.close();peers.delete(p);box.remove()}));panel.append(box)
}
if(panel){panel.append(status);if(!output||pairing)panel.append(button(output?'Pair with producer':'Pair another display',row))}
return {publish(){if(!output)for(let p of peers)send(p)},close(){for(let p of peers)p.pc.close();peers.clear()}}
}
