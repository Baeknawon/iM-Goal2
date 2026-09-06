const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>module._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,filename);
const {spendingSummary}=require('../src/data/spendingAnalytics.ts');
const {INITIAL_SPEND_MONTH}=require('../src/data/spendPeriod.ts');
const {spendMap}=require('../src/data/staticContent.ts');
const {useAppStore}=require('../src/store/appStore.ts');
const {useSpendPeriod}=require('../src/store/spendPeriodStore.ts');
for(const period of [INITIAL_SPEND_MONTH-1,INITIAL_SPEND_MONTH,INITIAL_SPEND_MONTH+1]) {
 const data=spendingSummary(period);
 assert.equal(data.total,data.weeks.reduce((sum,w)=>sum+w.amount,0));
 assert.equal(data.total,data.categories.reduce((sum,c)=>sum+c.amount,0));
 assert.equal(data.entries.length,data.categories.reduce((sum,c)=>sum+c.count,0));
 if(data.total)assert.ok(Math.abs(data.categories.reduce((sum,c)=>sum+c.share,0)-100)<1e-9);
 assert.equal(data.previousTotal,spendingSummary(period-1).total);
}
const july=spendingSummary(INITIAL_SPEND_MONTH);
assert.equal(july.total,Object.values(spendMap).reduce((a,b)=>a+b,0));
assert.equal(july.entries.filter(e=>e.day===18).reduce((sum,e)=>sum+e.amount,0),26200);
assert.equal(july.weeks.at(-1).to,31);
useAppStore.getState().setMonthlyBudget(INITIAL_SPEND_MONTH,300000);
useSpendPeriod.getState().changeMonth(-1);
assert.equal(useAppStore.getState().monthlyBudgets[INITIAL_SPEND_MONTH],300000);
useAppStore.getState().setMonthlyBudget(INITIAL_SPEND_MONTH,-1);
assert.equal(useAppStore.getState().monthlyBudgets[INITIAL_SPEND_MONTH],300000);
console.log('Spending totals, calendar day details, month comparisons and budget persistence passed. July total:',july.total);
