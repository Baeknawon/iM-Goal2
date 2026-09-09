// Run with: node scripts/test-goal-editing-connectivity.cjs
// 목표 수정 전반 연동 검증 — 요구사항 7.3.
//   자연어 수정 결과(GoalEditor.confirmParsed의 병합·검증·updateGoal 경로)가
//   홈·리포트·여정 상세·소비분석이 읽는 파생값(financePlan / useJourney의 buildJourneyEvents 입력)에
//   모두 반영되는지 확인한다. 화면은 모두 store.goal → financePlan 단일 소스를 읽으므로,
//   updateGoal 이후 financePlan 결과가 바뀌면 네 화면이 함께 갱신된다는 것을 보인다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);

const { useAppStore: store } = require('../src/store/appStore.ts');
const { financePlan } = require('../src/viewmodel/finance.ts');
const { parseGoalSentence } = require('../src/viewmodel/goalNaturalLanguage.ts');

// GoalEditor.tsx의 병합 규칙을 그대로 재현: 파싱된 필드만 draft에 덮어쓴다.
function mergeParsed(draft, parsed) {
  return {
    ...draft,
    ...(parsed.name !== undefined ? { name: parsed.name } : {}),
    ...(parsed.target !== undefined ? { target: parsed.target } : {}),
    ...(parsed.months !== undefined ? { months: parsed.months } : {}),
    ...(parsed.saved !== undefined ? { saved: parsed.saved } : {}),
  };
}

store.getState().setPersona('A');

// ── 1) 자연어 문장 → 파싱 → 병합 → updateGoal (확인 카드 "이대로 반영" 경로) ──
const sentence = '2년 안에 4천만원 모으고 싶고 이미 500만원 모았어';
const parsed = parseGoalSentence(sentence);
assert.deepEqual(parsed.missing, [], '필수 항목(target/months)이 모두 추출돼야 확인 카드가 뜬다');
assert.equal(parsed.target, 40000000);
assert.equal(parsed.months, 24);
assert.equal(parsed.saved, 5000000);

const before = store.getState().goal;
const beforePlan = financePlan(store.getState());
const nlDraft = mergeParsed(before, parsed);
store.getState().updateGoal(nlDraft);

const goal = store.getState().goal;
// updateGoal이 실제로 store의 goal을 갱신했는지(요구사항 7.3 반영의 원천).
assert.equal(goal.target, 40000000, 'updateGoal이 목표 금액을 반영해야 한다');
assert.equal(goal.months, 24);
assert.equal(goal.saved, 5000000);
assert.equal(goal.name, before.name, '파싱에 이름이 없으면 기존 이름 유지');

// ── 2) financePlan(=홈·리포트·여정상세·소비분석의 단일 소스)에 반영됐는지 ──
const plan = financePlan(store.getState());

// 리포트(GoalReportScreen): goalAmount·span·monthly·savedPct·plannedEta.
assert.equal(plan.goal.target, 40000000, '리포트 금액 표기 소스');
assert.equal(plan.goal.months, 24, '리포트 기간 표기 소스');
assert.notEqual(plan.savedPct, beforePlan.savedPct, '모아둔 금액 변경으로 진행률(홈·리포트·여정상세)이 바뀐다');
assert.equal(plan.savedPct, Math.min(100, Math.round(5000000 / 40000000 * 100)));

// 홈(HomeScreen via useJourney): eta/dday는 plan.predictedEta/daysLeft, saved/target 파생.
assert.notEqual(plan.left, beforePlan.left, '남은 목표액이 바뀌어 홈 GOAL·SEAT가 갱신된다');
assert.equal(plan.left, 40000000 - 5000000);
assert.ok(typeof plan.predictedEta === 'string' && plan.predictedEta.length > 0, '홈 도착일(etaFull) 소스 존재');
assert.ok(plan.daysLeft === null || Number.isFinite(plan.daysLeft), '홈 D-day(dday) 소스');

// 여정 상세(DetailScreen buildJourneyEvents 입력): goalName·goalTarget·saved·savedPct·virtualNow.
assert.equal(plan.goal.name, goal.name);
assert.equal(plan.goal.target, 40000000, '여정 이벤트 목표 금액 소스');
assert.ok(typeof plan.virtualNow === 'string' && plan.virtualNow.length > 0, '여정 가상 현재 시점 소스');

// 소비분석(SpendScreen): monthlySaving·eta·recommendedBudget (goal 파생).
assert.ok(Number.isFinite(plan.monthlySaving), '소비분석 월 저축 가능액 소스');
assert.equal(plan.eta, plan.predictedEta, '소비분석 예상 도착일이 예측 도착일과 동일 소스');
console.log('연동 확인: NL 수정 → updateGoal → financePlan(홈·리포트·여정상세·소비분석) 반영 통과.');

// ── 3) 유효성 검증 회귀(요구사항 7.6): saved>target는 무시되고 목표가 안 바뀐다 ──
{
  const kept = store.getState().goal;
  store.getState().updateGoal({ ...kept, saved: kept.target + 1 });
  assert.deepEqual(store.getState().goal, kept, 'saved>target 무효 입력은 목표를 바꾸지 않는다');
  store.getState().updateGoal({ ...kept, months: 0 });
  assert.deepEqual(store.getState().goal, kept, '기간 0(1~600 밖) 무효 입력은 목표를 바꾸지 않는다');
}

// ── 4) 목표 변경이 트리거·분배와 독립적으로도 계속 반영되는지(재수정) ──
{
  const p2 = parseGoalSentence('3년 안에 6천만원 모을래');
  store.getState().updateGoal(mergeParsed(store.getState().goal, p2));
  const g2 = store.getState().goal;
  assert.equal(g2.target, 60000000);
  assert.equal(g2.months, 36);
  const plan2 = financePlan(store.getState());
  assert.equal(plan2.goal.target, 60000000, '재수정도 financePlan에 반영');
  assert.equal(plan2.baselineDays, 36 * 30, '계획 도착 baseline이 새 기간에 연동');
}
console.log('연동 확인: 유효성 회귀·재수정 반영 통과.');

console.log('Goal editing connectivity checks passed: NL edit propagates to home/report/detail/spending via store.goal → financePlan.');
