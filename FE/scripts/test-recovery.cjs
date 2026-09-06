// Run with: node scripts/test-recovery.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const { useAppStore } = require('../src/store/appStore.ts');
const { recoveryPlan } = require('../src/viewmodel/recoveryFlow.ts');
const { calculateFcps } = require('../src/viewmodel/fcpsScore.ts');
const state = () => useAppStore.getState();
for (const persona of ['A', 'B', 'C']) {
  for (const days of [7, 14, 21, 28]) {
    const plan = recoveryPlan(persona, days, 45600);
    assert.ok(plan.savings > 0);
    assert.ok(plan.recoverDays >= 0 && plan.recoverDays <= plan.delayDays);
    assert.equal(plan.missionDays, days);
  }
  for (const result of ['success', 'fail', 'give_up']) {
    for (const deposit of [0, 30000, 60000]) {
      state().setPersona(persona);
      state().setMissionDays(7);
      state().triggerPersonaAlert(persona);
      const spent = state().spent;
      state().startMission(deposit);
      const started = state().missionStartedAt;
      const expectedWallet = 50000 + Math.max(0, deposit - 50000);
      assert.equal(state().locked, deposit);
      assert.equal(state().wallet, expectedWallet - deposit);
      assert.equal(state().activeRecoveryPlan.missionDays, 7);
      state().startMission(deposit); // Repeated start must not lock again.
      assert.equal(state().locked, deposit);
      state().triggerPersonaAlert(persona); // A new alert must not orphan the active deposit.
      assert.equal(state().missionOn, true);
      state().finishMission(result);
      assert.equal(state().wallet, expectedWallet);
      assert.equal(state().locked, 0);
      assert.equal(state().fcpsLog.length, 1);
      assert.equal(state().fcpsLog[0].startedAt, started);
      assert.ok(state().fcpsLog[0].completedAt);
      assert.equal(state().fcpsLog[0].recoveryPlan.missionDays, 7);
      assert.equal(state().spent, spent); // Completion must not erase overspending.
      assert.equal(state().recovered, result === 'success');
      assert.equal(calculateFcps(state().fcpsLog).total, 612 + ({success:18,fail:-8,give_up:-5}[result]));
      state().finishMission(result);
      state().completeRecovery(); // Reload / alternate completion must be idempotent.
      assert.equal(state().fcpsLog.length, 1);
      assert.equal(state().wallet, expectedWallet);
    }
  }
}
state().resetOnboarding();
state().finishMission('success');
state().completeRecovery();
assert.equal(state().fcpsLog.length, 0);
assert.equal(state().wallet, 50000);
assert.equal(state().activeRecoveryPlan, null);
console.log('Recovery checks passed: 3 personas, 4 durations, 3 outcomes, deposits, duplicate settlement, reset and dates.');

const { recommendMissionDuration } = require('../src/viewmodel/missionDuration.ts');
assert.equal(recommendMissionDuration('A').days, 14);
assert.equal(recommendMissionDuration('B').days, 21);
assert.equal(recommendMissionDuration('C').days, 14);
for (const persona of ['A', 'B', 'C']) {
  assert.equal(recommendMissionDuration(persona, 'fail').days, 7);
  assert.equal(recommendMissionDuration(persona, 'give_up').days, 7);
  state().setPersona(persona);
  assert.equal(state().missionDays, recommendMissionDuration(persona).days);
  state().setMissionDays(28);
  assert.equal(state().missionDays, 28);
  state().setMissionDays(8);
  assert.equal(state().missionDays, 28);
  state().startMission(0);
  state().setMissionDays(7);
  assert.equal(state().activeRecoveryPlan.missionDays, 28);
  assert.equal(state().missionDays, 28);
  state().finishMission('fail');
  assert.equal(state().missionDays, 7);
}
console.log('Duration recommendations, overrides, invalid values and active mission locking passed.');

const {answerAssistant, assistantSuggestions} = require('../src/viewmodel/assistant.ts');
for (const persona of ['A','B','C']) {
  state().setPersona(persona);
  state().setMissionDays(28);
  const before = JSON.stringify(state());
  assert.match(answerAssistant('왜 이 기간을 추천했어?', state()).text, /28일/);
  assert.equal(answerAssistant('보증금 없이 해도 돼?',state()).action.to, '/missionDetail');
  assert.equal(answerAssistant('미션 그만하고 싶어',state()).action.to, '/missions');
  assert.match(answerAssistant('오늘 예산 얼마나 남았어?',state()).text, /하루 예산/);
  assert.match(answerAssistant('날씨 알려줘',state()).text, /아직 연결되지/);
  assert.equal(JSON.stringify(state()), before);
  state().startMission(10000);
  assert.match(answerAssistant('내 보증금은?',state()).text, /10,000원/);
  assert.equal(answerAssistant('미션을 그만하고 싶어',state()).action.to,'/missionLive');
  state().finishMission('success');
  assert.match(answerAssistant('내 점수 알려줘',state()).text, /630점/);
}
for (const route of ['/home','/token','/fcps','/verify','/missions','/spend','/salary','/login']) {
  assert.equal(assistantSuggestions(route).length,3);
  for (const question of assistantSuggestions(route)) {
    const answer = answerAssistant(question,state());
    assert.ok(answer.text.length > 0);
    assert.ok(!answer.action || /^\/[a-zA-Z]+$/.test(answer.action.to));
  }
}
console.log('Assistant context, persona isolation inputs, routing, fallback and read-only checks passed.');
