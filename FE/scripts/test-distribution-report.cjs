// 분배 100% · 리포트 0% 회귀 검증 (요구사항 8.3, 8.4)
//  Requirements:
//   8.3 — 급여 분배를 1회 반영(setFueled)하면 목표 저축이 100% 이상이 되어 목표 달성 상태가 된다.
//   8.4 — 목표 리포트에 진입(beginGoalPlan)하면 모아둔 돈이 0원(0%)으로 표시된다.
//  참고: 급여 분배 비율(salarySplit)이 100%로 합산되는 정합은 test-persistence-support.cjs의
//        redistribute 검증에서 다루므로, 여기서는 "분배 1회 → 목표 달성"과 "리포트 진입 → 0%"에 집중한다.
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {useAppStore:store}=require('../src/store/appStore.ts');
const {financePlan,goalSavedLatePhase}=require('../src/viewmodel/finance.ts');
const {validSplit,redistribute}=require('../src/viewmodel/salaryAllocation.ts');
const s=()=>store.getState();

for(const persona of ['A','B','C']){
  // ── 8.4 리포트 진입 → 0% ────────────────────────────────────────────────
  //  발권으로 후반값까지 점프한 뒤에도, 리포트 진입(beginGoalPlan)은 "지금 막 계획을 세우는 시점"으로
  //  되돌려 모아둔 돈을 0원(0%)으로 만들어야 한다.
  s().setPersona(persona);
  s().finishGoal();                                   // 발권: 후반값으로 점프
  assert.ok(s().goal.saved>0,`${persona} 발권 후 모아둔 돈>0`);
  s().beginGoalPlan();                                // 리포트 진입: 0으로 리셋
  assert.equal(s().goal.saved,0,`${persona} 리포트 진입 시 모아둔 돈 0원`);
  assert.equal(financePlan(s()).savedPct,0,`${persona} 리포트 진입 시 진행률 0%`);
  assert.equal(s().fueled,false,`${persona} 리포트 진입 시 아직 분배 전(fueled=false)`);

  // ── 8.3 급여 분배 1회 → 목표 100% 이상 ──────────────────────────────────
  //  데모 흐름: 발권(finishGoal)으로 후반값(goalSavedLatePhase)까지 모은 상태에서
  //  급여 분배 1회(setFueled)로 남은 목표(한 달 저축분 이하)를 넘겨 100% 달성한다.
  s().finishGoal();                                   // 후반값 복원
  const late=financePlan(s());
  assert.equal(s().goal.saved,goalSavedLatePhase[persona],`${persona} 발권으로 후반값 복원`);
  assert.ok(late.left<=late.monthlySaving,`${persona} 남은 목표가 한 달 저축분 이하여야 분배 1회로 달성 가능 (left=${late.left}, monthlySaving=${late.monthlySaving})`);
  assert.ok(late.savedPct<100,`${persona} 분배 전에는 아직 100% 미만`);

  s().setFueled(true);                                // 급여 분배 1회
  const done=financePlan(s());
  assert.ok(s().goal.saved>=s().goal.target,`${persona} 분배 1회로 목표 저축 100% 이상 (saved=${s().goal.saved}, target=${s().goal.target})`);
  assert.equal(done.savedPct,100,`${persona} 분배 1회로 진행률 100% 달성`);
  assert.equal(done.left,0,`${persona} 분배 후 남은 목표 0원`);

  // 분배 멱등: 같은 달 두 번째 분배는 목표 저축을 더 늘리지 않는다.
  const savedAfter=s().goal.saved;
  s().setFueled(true);
  assert.equal(s().goal.saved,savedAfter,`${persona} 같은 달 분배 멱등(중복 반영 없음)`);
}

// ── 분배 비율 자체는 항상 100%로 합산 (요구사항 8.3의 "분배 100%") ──────────
//  redistribute로 임의의 비율을 만들어도 세 몫의 합은 100이고, validSplit도 통과해야 한다.
for(const source of [[100,0,0],[0,100,0],[0,0,100],[33,33,34],[40,10,50]]){
  for(let i=0;i<3;i++)for(const v of [0,25,50,75,100]){
    const r=redistribute(source,i,v);
    assert.equal(r.reduce((a,b)=>a+b,0),100,`분배 비율 합 100 (${source}→i=${i},v=${v})`);
    assert.ok(validSplit(r),`분배 비율이 유효한 100% 분배여야 한다 (${r})`);
  }
}

console.log('Distribution/report regression passed: report entry resets to 0% (8.4), one payroll distribution reaches 100% goal (8.3), split ratios always sum to 100.');
