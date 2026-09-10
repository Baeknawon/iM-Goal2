const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {useAppStore:store}=require('../src/store/appStore.ts');
const {financePlan}=require('../src/viewmodel/finance.ts');
const {spendingSummary}=require('../src/data/spendingAnalytics.ts');
const {INITIAL_SPEND_MONTH:period}=require('../src/data/spendPeriod.ts');
const {parseGoalNumber}=require('../src/viewmodel/goalInput.ts');
assert.equal(parseGoalNumber('3,000만원'),30000000);assert.equal(parseGoalNumber('2년',true),24);assert.ok(Number.isNaN(parseGoalNumber('아무거나')));
for(const persona of ['A','B','C']){
 store.getState().setPersona(persona);
 const base=financePlan(store.getState());
 store.getState().setMonthlyBudget(period,base.recommendedBudget+100000);
 const changed=financePlan(store.getState());
 assert.ok(changed.monthlySaving<base.monthlySaving);assert.ok(changed.daysLeft>base.daysLeft);
 const old=store.getState();store.getState().triggerPersonaAlert(persona);
 const after=store.getState();const p=financePlan(after);const summary=spendingSummary(period,after.transactions);
 assert.equal(p.total,summary.total);assert.equal(p.today,summary.entries.filter(e=>e.day===31).reduce((a,e)=>a+e.amount,0));
 if(persona==='B'){assert.equal(after.incomeMonthly,old.incomeMonthly*.82);assert.equal(after.transactions.length,old.transactions.length);}else{assert.ok(p.total>changed.total);}
 store.getState().triggerPersonaAlert(persona);assert.deepEqual(store.getState().transactions,after.transactions);assert.equal(store.getState().incomeMonthly,after.incomeMonthly);
 store.getState().setMonthlyBudget(period,1e9);assert.equal(financePlan(store.getState()).daysLeft,null);
 store.getState().updateGoal({...store.getState().goal,saved:store.getState().goal.target});assert.equal(financePlan(store.getState()).daysLeft,0);
}
store.getState().setPersona('A');
const before=store.getState().goal;store.getState().updateGoal({...before,target:-1});assert.deepEqual(store.getState().goal,before);
// 계획 저축은 상품 연계 고정값이라 소득이 늘어도 그대로, 대신 남는 소득이 소비예산으로 가 하루 예산이 커진다.
const initial=financePlan(store.getState());store.getState().incMonthly(store.getState().incomeMonthly+100000);const afterInc=financePlan(store.getState());assert.ok(afterInc.dailyBudget>initial.dailyBudget);assert.equal(afterInc.monthlySaving,initial.monthlySaving);
store.getState().setFueled(true);const saved=store.getState().goal.saved;assert.ok(saved>before.saved);store.getState().setFueled(true);assert.equal(store.getState().goal.saved,saved);
console.log('Finance checks passed: goal input, budgets, ETA, shared ledger, three persona triggers, idempotency, no capacity, completion and saving.');
