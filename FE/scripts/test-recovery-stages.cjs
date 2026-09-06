const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {useAppStore:store}=require('../src/store/appStore.ts');
const {calculateFcps}=require('../src/viewmodel/fcpsScore.ts');
const s=()=>store.getState(),r=()=>s().fcpsLog[0].recovery;
for(const p of ['A','B','C']){
 for(const stage of ['finance','maintenance']){
  for(const outcome of ['improved','worse','missing']){
   s().setPersona(p);s().startMission(10000);const beforeGoal=JSON.stringify(s().goal);s().finishMission('success');
   assert.equal(s().recovered,false);assert.equal(r().status,'awaiting');const id=r().completedAt;
   const wallet=s().wallet,score=calculateFcps(s().fcpsLog).total;
   s().recordRecoveryCheck(id,'maintenance','improved');assert.equal(r().observations.length,0);
   if(stage==='maintenance'){s().recordRecoveryCheck(id,'finance','improved');assert.equal(r().status,'monitoring');assert.equal(s().recovered,false);}
   s().recordRecoveryCheck(id,stage,outcome);
   assert.equal(r().status,outcome==='missing'?'unverifiable':outcome==='worse'?'reintervene':stage==='finance'?'monitoring':'confirmed');
   assert.equal(s().recovered,stage==='maintenance'&&outcome==='improved');
   const count=r().observations.length;s().recordRecoveryCheck(id,stage,outcome);assert.equal(r().observations.length,count);
   assert.equal(s().wallet,wallet);assert.equal(calculateFcps(s().fcpsLog).total,score);assert.equal(JSON.stringify(s().goal),beforeGoal);
   const last=r().observations.at(-1);assert.equal((Date.parse(last.to)-Date.parse(last.from))/86400000,stage==='finance'?7:28);
   if(outcome==='missing'){s().recordRecoveryCheck(id,stage,'improved');assert.notEqual(r().status,'unverifiable');}
  }
 }
 s().setPersona(p);s().startMission(0);s().finishMission('fail');assert.equal(s().fcpsLog[0].recovery,undefined);
 s().startMission(0);s().completeRecovery();const id=r().completedAt;
 s().recordRecoveryCheck(id,'finance','improved');s().recordRecoveryCheck(id,'maintenance','improved');assert.equal(s().recovered,true);
 s().triggerPersonaAlert(p);assert.equal(s().recovered,false);assert.equal(r().interrupted,true);s().recordRecoveryCheck(id,'maintenance','improved');assert.equal(s().recovered,false);
 const archived=JSON.stringify(r());s().startMission(0);s().recordRecoveryCheck(id,'finance','improved');assert.equal(JSON.stringify(r()),archived);
 s().finishMission('success');s().recordRecoveryCheck('stale-id','finance','improved');assert.equal(r().status,'awaiting');
 s().resetOnboarding();assert.equal(s().recoveryBaseline,null);assert.equal(s().recovered,false);assert.equal(s().fcpsLog.length,0);
}
console.log('Three-stage recovery passed: all personas, missing data, deterioration, four weeks, stage order, stale/duplicate checks, interruption, history and no extra settlement.');
