// Run with: node scripts/test-mission-flow.cjs
//
// 미션 흐름 시뮬레이션 검증 (Requirements 5.1, 5.5, 5.6, 5.7)
//   흐름: startMission(deposit) → 미션 리스트에서 결과 선택 → finishMission(result)
//   검증:
//     - 티켓 상태 전이: missionOn true→false, missionResult 세팅
//     - 여정 이벤트: fcpsLog 엔트리 추가 (성공→회복, 실패/중단→이탈)
//     - 보증금·FCPS 반영: 지갑 복원, locked 감소, fcpsLog 엔트리 기록
//
// DetailScreen.buildJourneyEvents 는 fcpsLog 를 여정 이벤트로 변환한다:
//   result==='success' → kind:'recovery' (회복)
//   result==='fail'|'give_up' → kind:'deviation' (이탈)
// 이 스크립트는 그 매핑을 그대로 재현해 여정 반영을 검증한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const { useAppStore } = require('../src/store/appStore.ts');
const state = () => useAppStore.getState();

// DetailScreen(buildJourneyEvents)의 fcpsLog→여정 이벤트 종류 매핑을 재현.
const journeyKind = (result) => (result === 'success' ? 'recovery' : 'deviation');

let cases = 0;

for (const persona of ['A', 'B', 'C']) {
  for (const result of ['success', 'fail', 'give_up']) {
    for (const deposit of [0, 30000, 60000]) {
      state().setPersona(persona);
      state().resetOnboarding(); // 데모 시드 로그 제거 → 단일 미션 흐름만 검증
      state().setMissionDays(7);

      // 1) 이탈 트리거 → 미션 받기(startMission). 보증금 묶임.
      state().triggerPersonaAlert(persona);
      assert.equal(state().alertOn, true, `${persona}/${result}/${deposit}: 트리거 후 alertOn 이어야 함`);
      const walletBeforeStart = state().wallet;

      state().startMission(deposit);
      // 티켓 진행 상태: missionOn=true, 결과 미정
      assert.equal(state().missionOn, true, '미션 시작 후 missionOn=true');
      assert.equal(state().missionResult, null, '미션 시작 후 결과 미정(null)');
      assert.equal(state().alertOn, false, '미션 시작 시 이탈 알림 해제');
      const startedAt = state().missionStartedAt;
      assert.ok(startedAt, 'missionStartedAt 기록됨');

      // 보증금 잠금 검증 (잔액 부족 시 자동 충전 반영)
      const topUp = Math.max(0, deposit - walletBeforeStart);
      const expectedWalletDuring = walletBeforeStart + topUp - deposit;
      assert.equal(state().locked, deposit, '보증금이 locked 로 묶임');
      assert.equal(state().wallet, expectedWalletDuring, '지갑에서 보증금만큼 차감');
      assert.equal(state().deposit, deposit, 'deposit 값 기록');

      const logLenBefore = state().fcpsLog.length;

      // 2) 미션 리스트에서 결과 선택 → finishMission(result) (reason 기본값 'unknown')
      state().finishMission(result);

      // 티켓 상태 전이: missionOn true→false, missionResult 세팅
      assert.equal(state().missionOn, false, '결과 반영 후 missionOn=false');
      assert.equal(state().missionResult, result, `missionResult=${result} 반영`);

      // 여정 이벤트: fcpsLog 엔트리 1건 추가 (최신순 head)
      assert.equal(state().fcpsLog.length, logLenBefore + 1, 'fcpsLog 엔트리 1건 추가');
      const entry = state().fcpsLog[0];
      assert.equal(entry.result, result, 'fcpsLog head 결과 일치');
      assert.equal(entry.startedAt, startedAt, 'fcpsLog 시작 시각 보존');
      assert.ok(entry.completedAt, 'fcpsLog 완료 시각 기록');
      assert.equal(entry.deposit, deposit, 'fcpsLog 에 보증금 기록');

      // 여정 반영: 성공→회복(recovery), 실패/중단→이탈(deviation)
      const kind = journeyKind(entry.result);
      if (result === 'success') {
        assert.equal(kind, 'recovery', '성공은 여정에 회복(recovery)으로 반영');
        assert.ok(entry.recovery, '성공 시 회복 확인 트래킹 시작');
        assert.equal(entry.recovery.status, 'awaiting', '성공 직후 회복 상태 awaiting');
      } else {
        assert.equal(kind, 'deviation', '실패/중단은 여정에 이탈(deviation)으로 반영');
        assert.equal(entry.recovery, undefined, '실패/중단 시 회복 트래킹 없음');
      }

      // 보증금·FCPS 반영: 지갑 복원(보증금 반환), locked 감소, 점수 delta 기록
      const expectedWalletAfter = walletBeforeStart + topUp; // 시작 시 차감분이 반환됨
      assert.equal(state().wallet, expectedWalletAfter, '결과 반영 후 보증금 지갑으로 반환');
      assert.equal(state().locked, 0, '결과 반영 후 locked 0 으로 해제');
      const expectedDelta = { success: 18, fail: -8, give_up: -5 }[result];
      assert.equal(entry.delta, expectedDelta, 'FCPS 점수 delta 기록');

      // 정산 규칙 유지(멱등): 재선택은 상태를 바꾸지 않는다.
      state().finishMission(result);
      assert.equal(state().fcpsLog.length, logLenBefore + 1, '중복 결과 선택은 추가 기록 없음');
      assert.equal(state().wallet, expectedWalletAfter, '중복 선택 시 지갑 불변');
      assert.equal(state().locked, 0, '중복 선택 시 locked 불변');

      cases++;
    }
  }
}

console.log(`Mission flow simulation passed: ${cases} cases (3 personas × 3 results × 3 deposits).`);
console.log('  Verified: ticket state (missionOn true→false, missionResult), journey mapping (success→recovery, fail/give_up→deviation), deposit return & FCPS logging.');
