// finance 계산 회귀 검증 (도착일 반응성 · 후반+excess 지연 · 상품/하루예산 정합)
//  Requirements: 2.1, 2.3, 8.1, 8.2
//  - 이탈 트리거 전후로 predictedEta/daysLeft/delayDays가 변동하는지 (2.1)
//  - 후반 상태(목표 근접, left 작음)에서도 초과지출(excess)이 예측 도착을 지연시키는지 (2.3, left===0 핀 제거)
//  - 계획 월저축(A 83.3만 / B 179.2만 / C 40만)·하루예산(26,677 / 9,290 / 10,967) 정합 유지 (8.1, 8.2)
const assert=require('node:assert/strict');
const fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,f);
const {useAppStore:store}=require('../src/store/appStore.ts');
const {financePlan,plannedMonthlySaving,goalSavedLatePhase}=require('../src/viewmodel/finance.ts');
const {INITIAL_SPEND_MONTH:period}=require('../src/data/spendPeriod.ts');

// 예측 도착일 문자열(YYYY.MM.DD)을 비교 가능한 timestamp로. 도착 예측이 없으면 null.
const etaMs=(eta)=>/^\d{4}\.\d{2}\.\d{2}$/.test(eta)?Date.parse(eta.replaceAll('.','-')+'T00:00:00Z'):null;

// ---------------------------------------------------------------------------
// 8.1 / 8.2 상품·하루예산 정합 (기본 분배 기준, 세 페르소나)
// ---------------------------------------------------------------------------
const expectedMonthlySaving={A:833000,B:1792000,C:400000};
const expectedDailyBudget={A:26677,B:9290,C:10967};
for(const persona of ['A','B','C']){
  store.getState().setPersona(persona);
  const base=financePlan(store.getState());
  assert.equal(plannedMonthlySaving[persona],expectedMonthlySaving[persona],`${persona} plannedMonthlySaving`);
  assert.equal(base.dailyBudget,expectedDailyBudget[persona],`${persona} dailyBudget`);
  // 도착일 분리: 계획(고정)과 예측(연동)은 서로 구분되는 반환값이어야 한다.
  assert.ok('plannedEta' in base && 'predictedEta' in base && 'virtualNow' in base,`${persona} plan exposes planned/predicted/virtualNow`);
}

// ---------------------------------------------------------------------------
// 2.1 이탈 트리거 전후 predictedEta/daysLeft/delayDays 변동
//   B(매출 감소)는 소득이 줄어 저축 페이스가 느려지므로 트리거만으로 예측이 명확히 지연된다.
// ---------------------------------------------------------------------------
store.getState().setPersona('B');
const bBase=financePlan(store.getState());
store.getState().triggerPersonaAlert('B');
const bAfter=financePlan(store.getState());
assert.ok(bAfter.daysLeft>bBase.daysLeft,`B daysLeft should grow after trigger (${bBase.daysLeft}→${bAfter.daysLeft})`);
assert.ok(bAfter.delayDays>bBase.delayDays,`B delayDays should grow after trigger (${bBase.delayDays}→${bAfter.delayDays})`);
const bBaseMs=etaMs(bBase.predictedEta),bAfterMs=etaMs(bAfter.predictedEta);
assert.ok(bBaseMs!==null&&bAfterMs!==null&&bAfterMs>bBaseMs,`B predictedEta should move later after trigger`);
// 계획 도착(plannedEta)은 고정이라 트리거로 변하지 않는다.
assert.equal(bAfter.plannedEta,bBase.plannedEta,'B plannedEta stays fixed');
// 트리거 재적용은 멱등(정합 유지).
store.getState().triggerPersonaAlert('B');
assert.equal(financePlan(store.getState()).daysLeft,bAfter.daysLeft,'B trigger idempotent');

// ---------------------------------------------------------------------------
// 2.3 후반 상태(목표 근접, left 작음) + excess → 예측 도착 지연 (left===0 핀 제거)
//   목표에 근접(goalSavedLatePhase)해 left가 한 달 저축분 이하인 상태에서,
//   예산을 트리거 직전 지출로 맞춰 이탈 트리거가 곧바로 excess가 되게 한다.
//   핀이 있었다면 후반에는 D-0로 고정돼 변동이 없어야 하지만, 핀 제거로 excess가 반영돼 도착이 늦어져야 한다.
// ---------------------------------------------------------------------------
for(const persona of ['A','B','C']){
  store.getState().setPersona(persona);
  store.getState().updateGoal({...store.getState().goal,saved:goalSavedLatePhase[persona]});
  const late=financePlan(store.getState());
  assert.ok(late.left<=plannedMonthlySaving[persona],`${persona} late-phase left within one month of saving`);
  // 예산을 트리거 직전 지출로 설정 → 이후 추가 결제가 excess로 잡힌다.
  store.getState().setMonthlyBudget(period,late.total);
  const tight=financePlan(store.getState());

  store.getState().triggerPersonaAlert(persona);
  const after=financePlan(store.getState());
  // effectiveLeft(= max(left,0)+excess)와 daysLeft가 후반에도 커져야 한다(핀 제거 증명).
  assert.ok(after.effectiveLeft>=tight.effectiveLeft,`${persona} late-phase effectiveLeft should grow`);
  assert.ok(after.daysLeft>tight.daysLeft,`${persona} late-phase daysLeft should grow after trigger (${tight.daysLeft}→${after.daysLeft})`);
  const tightMs=etaMs(tight.predictedEta),afterMs=etaMs(after.predictedEta);
  assert.ok(tightMs!==null&&afterMs!==null&&afterMs>tightMs,`${persona} late-phase predictedEta should move later after trigger`);
  // A/C는 초과지출로, B는 소득 감소로 예측이 지연된다.
  if(persona!=='B')assert.ok(after.excess>0,`${persona} trigger should create excess in late phase`);
}

// ---------------------------------------------------------------------------
// 핀 제거의 최종 증명: 목표 100% 달성(left=0)이라도 excess가 있으면 daysLeft가 0을 벗어난다.
// ---------------------------------------------------------------------------
store.getState().setPersona('A');
store.getState().updateGoal({...store.getState().goal,saved:store.getState().goal.target});
const doneNoExcess=financePlan(store.getState());
assert.equal(doneNoExcess.daysLeft,0,'goal reached without excess → D-0');
assert.equal(doneNoExcess.delayDays,0,'goal reached without excess → no delay');
// 예산을 현재 지출로 맞춘 뒤 트리거 → excess 발생.
store.getState().setMonthlyBudget(period,doneNoExcess.total);
store.getState().triggerPersonaAlert('A');
const doneWithExcess=financePlan(store.getState());
assert.ok(doneWithExcess.excess>0,'trigger creates excess even at 100%');
assert.ok(doneWithExcess.daysLeft>0,'left===0 pin removed: excess pushes daysLeft above 0');

console.log('Finance ETA regression passed: trigger shifts predictedEta/daysLeft/delayDays, late-phase+excess delays arrival (pin removed), product/daily-budget consistency held.');
