const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {useAppStore:store}=require('../src/store/appStore.ts');
const {currentMission,recommendMission}=require('../src/viewmodel/adaptiveMission.ts');
const s=()=>store.getState();
for(const persona of ['A','B','C'])for(const result of ['fail','give_up'])for(const reason of ['difficulty','time','expense','unknown']){
 s().setPersona(persona);s().resetOnboarding();const original=currentMission(s());s().startMission(10000);s().finishMission(result,reason);
 assert.equal(s().fcpsLog[0].failureReason,reason);assert.equal(s().fcpsLog[0].missionSnapshot.title2,original.title2);
 const next=currentMission(s());assert.notEqual(next.criteria.rule,original.criteria.rule);assert.ok(next.level>0);assert.equal(s().missionDays,7);
 assert.ok(next.weeklySavings<=original.weeklySavings);
 if(reason==='time'||reason==='expense'){assert.equal(next.allowDeposit,false);assert.equal(next.weeklySavings,0);s().startMission(10000);assert.equal(s().missionOn,false);}
 s().startMission(0);const snapshot=JSON.stringify(s().activeMission);s().setFailureReason('time');assert.equal(s().fcpsLog[0].failureReason,reason);assert.equal(JSON.stringify(currentMission(s())),snapshot);
 assert.equal(s().activeRecoveryPlan.savings,next.weeklySavings);s().finishMission('fail','difficulty');
 assert.equal(s().fcpsLog[0].mission,next.title1+' '+next.title2);assert.equal(s().fcpsLog[0].missionSnapshot.criteria.rule,next.criteria.rule);
 assert.equal(recommendMission(s()).level,2);assert.equal(recommendMission(s()).weeklySavings,0);
 s().startMission(0);s().finishMission('success');assert.equal(s().fcpsLog[0].recovery.status,'awaiting');assert.equal(s().recovered,false);
 s().resetOnboarding();assert.equal(s().activeMission,null);assert.equal(currentMission(s()).level,0);
}
s().setPersona('A');s().resetOnboarding();s().startMission(0);s().finishMission('fail','difficulty');assert.equal(currentMission(s()).level,1);s().setFailureReason('time');assert.equal(currentMission(s()).level,2);assert.equal(s().fcpsLog.length,1);assert.equal(s().wallet,50000);
console.log('Adaptive mission checks passed: all personas/reasons/results, progressive simplification, fixed active criteria, saved history, no-deposit preparation and recovery separation.');
