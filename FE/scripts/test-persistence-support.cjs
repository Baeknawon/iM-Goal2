const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const path=require.resolve('../src/store/appStore.ts');
const {useAppStore:store}=require(path),{redistribute,allocation}=require('../src/viewmodel/salaryAllocation.ts');
const {mergeStored}=require('../src/store/localStorage.ts');
const {financePlan}=require('../src/viewmodel/finance.ts');
const {longTermHistory}=require('../src/viewmodel/longTermHistory.ts');
const {supportServices,matchesSupport}=require('../src/data/supportServices.ts');
const s=()=>store.getState();
for(const source of [[100,0,0],[0,100,0],[0,0,100],[33,33,34]])for(let i=0;i<3;i++)for(let v=0;v<=100;v++){
 const r=redistribute(source,i,v);assert.equal(r.reduce((a,b)=>a+b,0),100);assert.equal(r[i],v);assert.ok(r.every(n=>Number.isInteger(n)&&n>=0));
 const a=allocation(2500001,840000,0,r,30000000);assert.equal(a.reserved+a.saving+a.wallet+a.living,a.income);
}
s().setPersona('A');s().setSalarySplit([40,10,50]);
const before=financePlan(s()),balance=s().wallet;s().setFueled(true);
assert.equal(s().wallet,balance+before.walletReserve);assert.equal(s().salaryLog[0].saving,before.monthlySaving);
const saved=s().goal.saved;s().setFueled(false);s().setFueled(true);assert.equal(s().goal.saved,saved);assert.equal(s().salaryLog.length,1);
s().toggleSupportCheck('youth',1);s().markSupportVisit('youth');s().startMission(10000);s().finishMission('fail','time');
const snapshot=JSON.parse(JSON.stringify(s()));delete require.cache[path];const restored=require(path).useAppStore.getState();
for(const key of ['salarySplit','salaryLog','goal','wallet','fcpsLog','supportChecks','supportVisits'])assert.deepEqual(restored[key],snapshot[key]);assert.equal(typeof restored.finishMission,'function');
assert.equal(mergeStored({goal:null},s()),s());assert.equal(mergeStored({...snapshot,salarySplit:[60,60,0]},s()),s());assert.equal(mergeStored({...snapshot,transactions:[null]},s()),s());
const history=longTermHistory(s(),6);assert.equal(history.rows.length,6);assert.equal(history.savingMonths,1);assert.ok(history.rows.some(r=>r.observedDays===0&&r.compliant===null));
for(const p of ['A','B','C'])assert.ok(supportServices.some(service=>matchesSupport(service.id,p)));
for(const service of supportServices){assert.ok(new URL(service.url).protocol==='https:');assert.equal(service.steps.length,3);}
const invalid=s().supportChecks;s().toggleSupportCheck('bad',1);s().toggleSupportCheck('youth',9);assert.equal(s().supportChecks,invalid);
console.log('Persistence/salary/support checks passed: exact rounding, conserved allocation, monthly idempotency, reload, corrupt snapshots, partial history and support routes.');
