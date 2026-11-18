export const remainingMs=(deadline,paused,now)=>deadline?Math.max(0,deadline-now):Math.max(0,paused);
export const opposite=f=>f==='Heads'?'Tails':'Heads';
export function assignment(result,call,rule){return rule==='call-wins'? (result===call?'Heads':'Tails'):result}
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,n));
export const formats=['wide','linus','luke','stack','square'];
export function nextLabel(s){if(s.done)return 'Complete';if(s.stage===0)return 'Lock setup';if(s.stage===1)return s.result?'Start thinking':'Flip coin';if(s.stage===2)return 'Cue '+(s.first||s.caller);if(s.stage===3)return 'Cue '+((s.first||s.caller)==='Linus'?'Luke':'Linus');return s.rebuttal&&!s.round?'Start rebuttals':'Finish debate'}
export function layoutFor(s,f){return {...s,...(s.outputs?.[f]||{})}}
export function expired(last,now,seconds){return seconds>0&&now-last>seconds*1000}
