// Visual layout editor: per-format, mirrored element overrides. No backend required.
export function installLayoutEditor({getState,getFormat,save,render,screen,enabled}){
 const groups=[['topic','Topic banners','.header'],['positions','Position banners','.position'],['timer','Timers','.timer'],['coin','Coin graphic','.coin'],['brand','Brand labels','.brand']];
 const styles=document.createElement('style');styles.textContent=`
 #layout-editor{background:#23252c;border:1px solid #575b65;border-radius:10px;padding:12px;margin:12px 0;color:#fff;font:13px system-ui}
 #layout-editor .editor-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}
 #layout-editor label{display:inline-flex;align-items:center;gap:5px;margin:0}
 #layout-editor input[type=number]{width:78px}
 #layout-editor select{max-width:200px}
 #layout-editor .hint{color:#b9bdc8;font-size:12px}
 #screen.editor-active [data-edit-key]{cursor:move;outline:1px dashed #ffb17c;outline-offset:2px;touch-action:none}
 #screen.editor-active [data-edit-key].editor-selected{outline:3px solid #ffe0aa;outline-offset:3px}
 `;document.head.append(styles);
 const host=document.createElement('section');host.id='layout-editor';host.innerHTML=`
 <strong>Visual layout editor</strong><div class="hint">Edit one side; mirrored elements follow unless you unlink them. Settings are saved per output format.</div>
 <div class="editor-row"><label><input id="ve-enabled" type="checkbox"> Enable drag editing</label><label><input id="ve-mirror" type="checkbox" checked> Mirror paired elements</label></div>
 <div class="editor-row"><label>Element <select id="ve-element"></select></label><label>Side <select id="ve-side"><option value="0">First / left</option><option value="1">Second / right</option></select></label></div>
 <div class="editor-row"><label><input id="ve-visible" type="checkbox" checked> Visible</label><label>X % <input id="ve-x" type="number" min="-100" max="100" step="1"></label><label>Y % <input id="ve-y" type="number" min="-100" max="100" step="1"></label><label>Scale % <input id="ve-scale" type="number" min="10" max="300" step="5"></label></div>
 <div class="editor-row"><label>Opacity % <input id="ve-opacity" type="number" min="0" max="100"></label><label>Font size % <input id="ve-font" type="number" min="25" max="300"></label><label>Text align <select id="ve-align"><option>center</option><option>left</option><option>right</option></select></label></div>
 <div class="editor-row"><button id="ve-reset">Reset selected</button><button id="ve-resetall">Reset this format</button><button id="ve-export">Export layouts</button><label>Import layouts <input id="ve-import" type="file" accept=".json,application/json"></label></div>
 <div class="hint" id="ve-message">Drag an outlined element in the preview or use the numeric controls. Mirroring applies across the two host panels; the center coin and timer are single elements.</div>`;
 const controls=document.getElementById('controls');controls.prepend(host);
 const $=id=>host.querySelector('#'+id), state=()=>getState(),fmt=()=>getFormat();
 groups.forEach(([id,label])=>{const o=document.createElement('option');o.value=id;o.textContent=label;$('ve-element').append(o)});
 const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
 const current=()=>{let s=state();return s.outputs?.[fmt()]?.elements||{}};
 const elementKey=()=>$('ve-element').value+':'+$('ve-side').value;
 const mirrorKey=k=>k.endsWith(':0')?k.slice(0,-1)+'1':k.endsWith(':1')?k.slice(0,-1)+'0':k;
 const isPair=k=>!k.startsWith('coin:')&&!k.startsWith('timer:');
 const edit=(key,patch,paired=$('ve-mirror').checked)=>{let s=state(),f=fmt();s.outputs??={};let o=s.outputs[f]??={};o.elements??={};o.elements[key]={...(o.elements[key]||{}),...patch};if(paired&&isPair(key)){let opposite=mirrorKey(key);o.elements[opposite]={...(o.elements[opposite]||{}),...patch,x:patch.x===undefined?(o.elements[opposite]?.x??0):-patch.x}}save();};
 const selected=()=>current()[elementKey()]||{};
 function sync(){let v=selected();$('ve-visible').checked=v.visible!==false;$('ve-x').value=v.x??0;$('ve-y').value=v.y??0;$('ve-scale').value=v.scale??100;$('ve-opacity').value=v.opacity??100;$('ve-font').value=v.font??100;$('ve-align').value=v.align||'center';}
 $('ve-element').onchange=sync;$('ve-side').onchange=sync;
 $('ve-enabled').onchange=()=>{render();sync()};
 for(let [id,prop,min,max] of [['ve-x','x',-100,100],['ve-y','y',-100,100],['ve-scale','scale',10,300],['ve-opacity','opacity',0,100],['ve-font','font',25,300]])$(id).onchange=()=>edit(elementKey(),{[prop]:clamp(Number($(id).value)||0,min,max)});
 $('ve-visible').onchange=()=>edit(elementKey(),{visible:$('ve-visible').checked});
 $('ve-align').onchange=()=>edit(elementKey(),{align:$('ve-align').value});
 $('ve-reset').onclick=()=>{let s=state(),f=fmt(),e=s.outputs?.[f]?.elements;if(e){delete e[elementKey()];if($('ve-mirror').checked)delete e[mirrorKey(elementKey())];save();sync()}};
 $('ve-resetall').onclick=()=>{if(!confirm('Reset all visual element overrides for '+fmt()+'?'))return;let e=state().outputs?.[fmt()];if(e){delete e.elements;save();sync()}};
 $('ve-export').onclick=()=>{let a=document.createElement('a'),blob=new Blob([JSON.stringify(Object.fromEntries(Object.entries(state().outputs||{}).map(([f,o])=>[f,o.elements||{}])),null,2)],{type:'application/json'});a.href=URL.createObjectURL(blob);a.download='advocate-layouts.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
 $('ve-import').onchange=async()=>{try{let data=JSON.parse(await $('ve-import').files[0].text());if(!data||typeof data!=='object'||Array.isArray(data))throw Error('Invalid layouts');for(let [f,items] of Object.entries(data)){if(!['wide','linus','luke','stack','square'].includes(f)||!items||typeof items!=='object'||Array.isArray(items))throw Error('Invalid format');for(let [key,v] of Object.entries(items)){if(!/^(topic|positions|timer|coin|brand):[01]$/.test(key)||!v||typeof v!=='object')throw Error('Invalid element');for(let [p,n] of Object.entries(v)){if(!['x','y','scale','opacity','font','visible','align'].includes(p))throw Error('Invalid property');if(p==='visible'&&typeof n!=='boolean'||p==='align'&&!['left','right','center'].includes(n)||!['visible','align'].includes(p)&&(!Number.isFinite(n)||Math.abs(n)>300))throw Error('Invalid value')}}}for(let [f,items] of Object.entries(data)){state().outputs??={};state().outputs[f]??={};state().outputs[f].elements=items}save();sync();$('ve-message').textContent='Layouts imported'}catch(e){$('ve-message').textContent=e.message}};
 let dragging=null;
 screen().addEventListener('pointerdown',e=>{if(!$('ve-enabled').checked)return;let node=e.target.closest('[data-edit-key]');if(!node)return;let key=node.dataset.editKey,[group,side]=key.split(':');$('ve-element').value=group;$('ve-side').value=side;sync();dragging={id:e.pointerId,key,x:e.clientX,y:e.clientY,start:{...selected()},width:screen().getBoundingClientRect().width,height:screen().getBoundingClientRect().height};e.preventDefault()});
 window.addEventListener('pointermove',e=>{if(!dragging||dragging.id!==e.pointerId)return;let d=dragging;edit(d.key,{x:clamp((d.start.x||0)+(e.clientX-d.x)/d.width*100,-100,100),y:clamp((d.start.y||0)+(e.clientY-d.y)/d.height*100,-100,100)});sync()});
 for(let ev of ['pointerup','pointercancel'])window.addEventListener(ev,()=>{dragging=null});
 function apply(){let p=screen(),active=$('ve-enabled').checked;p.classList.toggle('editor-active',active);for(let [group,,selector] of groups){let nodes=[...p.querySelectorAll(selector)];nodes.forEach((node,i)=>{let side=i===0?0:1,key=group+':'+side,v=current()[key]||{};node.dataset.editKey=key;node.classList.toggle('editor-selected',active&&key===elementKey());if(v.visible===false)node.style.display='none';node.style.translate=(v.x||0)+'cqw '+(v.y||0)+'cqw';node.style.scale=String((v.scale??100)/100);node.style.opacity=String((v.opacity??100)/100);node.style.fontSize=v.font===undefined?'':(v.font/100)+'em';node.style.textAlign=v.align||''})}}
 sync();return {apply,sync};
}
