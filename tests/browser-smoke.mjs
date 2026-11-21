import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright';

const port=19087;
const server=spawn('python3',['-m','http.server',String(port),'--bind','127.0.0.1'],{stdio:'ignore'});
const browser=await chromium.launch({headless:true});
try{
  const context=await browser.newContext();
  const producer=await context.newPage();
  const errors=[];
  producer.on('pageerror',e=>errors.push('producer: '+e.message));
  for(let attempt=0;attempt<30;attempt++){try{await producer.goto('http://127.0.0.1:'+port+'/?session=smoke',{waitUntil:'load',timeout:1000});break}catch(e){if(attempt===29)throw e;await new Promise(resolve=>setTimeout(resolve,100))}}
  const display=await context.newPage();
  display.on('pageerror',e=>errors.push('display: '+e.message));
  await display.goto('http://127.0.0.1:'+port+'/display.html?overlay=wide&session=smoke',{waitUntil:'load'});
  await producer.locator('[data-action="setup"]').click();
  await display.waitForFunction(()=>document.querySelector('#screen .coinrotor')!==null,null,{timeout:10000});
  await display.evaluate(()=>{window.__originalGrid=document.querySelector('#screen .grid');window.__originalCoin=document.querySelector('#screen .coinrotor')});
  await display.waitForTimeout(4500);
  const retained=await display.evaluate(()=>document.querySelector('#screen .grid')===window.__originalGrid&&document.querySelector('#screen .coinrotor')===window.__originalCoin);
  assert.equal(retained,true,'wide display graphics must survive repeated heartbeats');
  assert.deepEqual(errors,[],'no page errors');
  await producer.locator('[data-action="Linus"]').click();
  await producer.locator('[data-action="Heads"]').click();
  await producer.locator('[data-action="forceTails"]').click();
  await display.waitForFunction(()=>document.querySelector('#screen .coin.spin')!==null);
  await producer.waitForTimeout(2900);
  await display.waitForFunction(()=>document.querySelector('#screen .coinglint')!==null);
  const angle=await display.locator('.coinglint').evaluate(e=>e.style.transform);
  assert.equal(angle,'rotate(225deg)');
  await producer.locator('[data-action="next"]').click();
  await display.waitForFunction(()=>/^00:(?:30|29|28)$/.test(document.querySelector('#screen .timer div')?.textContent||''));
  await display.evaluate(()=>{window.__timer=document.querySelector('#screen .timer')});
  await display.waitForTimeout(2600);
  assert.equal(await display.evaluate(()=>document.querySelector('#screen .timer')===window.__timer),true,'countdown must not replace timer');
  await producer.locator('[data-action="clear"]').click();
  await display.waitForFunction(()=>document.querySelector('#screen .grid')===null);
  assert.deepEqual(errors,[]);
  await context.close();
}finally{await browser.close();server.kill()}
