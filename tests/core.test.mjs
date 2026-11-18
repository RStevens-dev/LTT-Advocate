import test from 'node:test';
import assert from 'node:assert/strict';
import {remainingMs,assignment,nextLabel,layoutFor,expired} from '../core.mjs';
test('deadline and pause preserve milliseconds',()=>{assert.equal(remainingMs(2000,0,1234),766);assert.equal(remainingMs(0,766,9000),766);assert.equal(remainingMs(2000,0,3000),0)});
test('coin rules',()=>{assert.equal(assignment('Tails','Tails','landed'),'Tails');assert.equal(assignment('Tails','Tails','call-wins'),'Heads');assert.equal(assignment('Heads','Tails','call-wins'),'Tails')});
test('contextual cues',()=>{assert.equal(nextLabel({stage:2,first:'Luke'}),'Cue Luke');assert.equal(nextLabel({stage:3,first:'Luke'}),'Cue Linus')});
test('independent layouts',()=>{let s={layout:'split',outputs:{wide:{layout:'full'}}};assert.equal(layoutFor(s,'wide').layout,'full');assert.equal(layoutFor(s,'luke').layout,'split')});
test('fail safe',()=>{assert.equal(expired(0,16000,15),true);assert.equal(expired(0,16000,0),false)});
