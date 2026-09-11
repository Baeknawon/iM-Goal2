import { recommendMission, failureReasons } from '../viewmodel/adaptiveMission';
import { FailureReasonPicker } from '../components/FailureReasonPicker';
import { RecoveryProgressCard } from '../components/RecoveryProgressCard';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { missionDefs } from '../data/personas';
import { Screen, Pill, ScreenBody, CtaButton } from '../components/ui';
import { color } from '../styles/theme';
import { RecoveryPlanCard } from '../components/RecoveryPlanCard';
import { goalSavedLatePhase } from '../viewmodel/finance';

import type { MissionResult } from '../types';

/** 판정 화면에서 정산한 결과만 표시한다. 직접 방문해도 정산하지 않는다. */
export function ReleaseScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const deposit = useAppStore((s) => s.deposit);
  const missionResult = useAppStore((s) => s.missionResult);
  const wallet = useAppStore((s) => s.wallet);
  const missionOn = useAppStore((s) => s.missionOn);
  const latest = useAppStore((s) => s.fcpsLog[0]);
  const setMissionDays = useAppStore((s) => s.setMissionDays);
  const goal = useAppStore((s) => s.goal);
  const updateGoal = useAppStore((s) => s.updateGoal);
  const state=useAppStore();
  const next=recommendMission(state);
  const MI = latest?.missionSnapshot ?? missionDefs[persona];
  const legCode = MI.leg.split(' · ')[0];
  const depositLabel = deposit.toLocaleString();

  if (missionResult === null) return <Navigate to={missionOn ? '/verify?result=success' : '/missionDetail'} replace />;

  const result: MissionResult = missionResult;
  const V = resultView[result];

  return (
      <Screen>
        <div style={{ padding: 'var(--screen-pad-top) var(--screen-padding-x) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pill onClick={() => navigate('/missions')}>‹ 미션</Pill>
            <Pill bg={V.chipBg} fg={V.chipFg}>{V.chip}</Pill>
          </div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{legCode} · {V.sub}</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>{V.title}</div>
        </div>

        <ScreenBody>
          {/* ① 보증금이 내 지갑으로 돌아온 것을 가장 먼저·가장 크게 보여준다. */}
          <div style={{ background: V.moneyBg, borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: V.moneyFg, boxShadow: 'var(--shadow-card)', overflow: 'hidden', position: 'relative' }}>
            {V.moneyOnDark && <div aria-hidden="true" style={{ position: 'absolute', right: -34, top: -34, width: 140, height: 140, borderRadius: '50%', background: 'rgba(var(--color-white-rgb),.10)' }} />}
            <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 12px', borderRadius: 'var(--radius-pill)', background: V.moneyOnDark ? 'rgba(var(--color-white-rgb),.16)' : 'var(--color-60-bg-surface)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '.04em' }}>
              <span aria-hidden="true" style={{ width: 18, height: 18, borderRadius: '50%', background: V.moneyOnDark ? color.mint : 'var(--color-30-surface-sub)', color: V.moneyOnDark ? color.ink : color.mintDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>↓</span>
              보증금 전액 반환
            </div>
            <div style={{ position: 'relative', marginTop: 'var(--space-1-5)', display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 46, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.03em', whiteSpace: 'nowrap' }}>+{depositLabel}</span>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>iMKRW</span>
            </div>
            <div style={{ position: 'relative', marginTop: 6, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>내 iMKRW 지갑으로 들어왔어요</div>
            <div style={{ position: 'relative', marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)', lineHeight: 1.6, fontWeight: 'var(--font-weight-medium)', opacity: 0.78 }}>{V.moneyNote}</div>
            <div style={{ position: 'relative', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 'var(--radius-lg)', background: V.moneyOnDark ? 'rgba(var(--color-white-rgb),.12)' : 'var(--color-30-surface-sub)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
              <span style={{ opacity: 0.8 }}>지갑 잔액</span>
              <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{wallet.toLocaleString()} iMKRW</span>
            </div>
          </div>

          {/* ② FCPS 점수 반영 — 흰 카드로 톤다운(딥그린 반환 카드와 위계 구분) */}
          <div style={{ marginTop: 'var(--space-2)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink, boxShadow: 'var(--shadow-subtle)' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>FCPS 신용 궤적에 기록됨</div>
            <div style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)' }}>
              <span style={{ fontSize: 34, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.035em', color: V.delta >= 0 ? color.mintDark : color.coral }}>
                {V.delta >= 0 ? '+' : ''}{V.delta}
              </span>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{V.fcpsLabel}</span>
            </div>
            <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)', lineHeight: 1.6 }}>{V.fcpsNote}</div>
            <CtaButton height={50} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }} bg="var(--color-30-surface-sub)" arrowBg={color.mint} onClick={() => navigate('/fcps')}>점수 반영 내역 보기</CtaButton>
          </div>

          {/* ③ 신용 회복 단계 · 플랜 (성공) 또는 재시도 안내(실패/포기) */}
          {latest?.recovery && <RecoveryProgressCard recovery={latest.recovery} />}
          {result === 'success' && latest?.recoveryPlan && <RecoveryPlanCard plan={latest.recoveryPlan} success />}
          {result !== 'success' && <div className="recovery-note"><h2 className="fcps-section-title">다음 시도는 부담을 줄여볼까요?</h2><p>{result === 'fail' ? latest?.missionSnapshot?.criteria.fail ?? '미션 기준을 충족하지 못한 기록입니다.' : '이번에는 끝까지 수행하지 못했지만, 준비가 되면 다시 시작할 수 있어요.'}</p><p>이번 결과로 목표 회복 효과는 반영하지 않았어요. 어려웠던 이유에 맞춰 다음 행동과 성공 기준을 조정해요.</p><FailureReasonPicker value={latest?.failureReason??'unknown'} onChange={state.setFailureReason}/><p className="fcps-description">선택한 이유: {failureReasons[latest?.failureReason??'unknown']}<br/>다음 미션: {next.title1} {next.title2}<br/>{next.why}</p><CtaButton onClick={() => { setMissionDays(7); navigate('/missionDetail'); }}>조정된 미션 확인하기</CtaButton></div>}

          <CtaButton height={62} style={{ marginTop: 'var(--space-1-5)' }} onClick={() => {
            // 리포트 진입에서 goal.saved=0으로 리셋된 상태가 남아 있으면 여정 상세가 0%로 보인다.
            // 미션 완료(회복) 직후이므로 진행 상태(후반)를 복원한 뒤 여정 상세로 이동한다.
            if (goal.saved === 0) updateGoal({ ...goal, saved: Math.min(goal.target, goalSavedLatePhase[persona]) });
            navigate('/detail');
          }}>
            목표 경로와 다음 행동 보기
          </CtaButton>
        </ScreenBody>
      </Screen>
  );
}

const resultView: Record<MissionResult, {
  chip: string; chipBg: string; chipFg: string; sub: string; title: string;
  moneyBg: string; moneyFg: string; moneyOnDark: boolean; moneyNote: string;
  delta: number; fcpsLabel: string; fcpsNote: string;
}> = {
  success: {
    chip: '미션 성공', chipBg: color.mint, chipFg: color.ink, sub: '완주했어요', title: '보증금을 돌려드려요',
    // 성공: 딥그린 히어로로 "입금됨"을 묵직하게 강조.
    moneyBg: 'var(--color-hero)', moneyFg: 'var(--im-white)', moneyOnDark: true,
    moneyNote: '기한 내 미션을 완수해 보증금이 전액 반환됐어요.',
    delta: 18, fcpsLabel: '미션 성공 기록', fcpsNote: '행동 미션 성공 기록이에요. 재무 회복과 4주 유지는 별도로 확인합니다.',
  },
  fail: {
    chip: '미션 실패', chipBg: color.coralTint, chipFg: color.coralDark, sub: '이번엔 아쉬웠어요', title: '보증금은 돌려드려요',
    // 실패/포기: 흰 카드로 톤다운(반환은 동일하되 축하 톤은 아니게).
    moneyBg: 'var(--color-60-bg-surface)', moneyFg: 'var(--color-60-text-primary)', moneyOnDark: false,
    moneyNote: '실패했지만 보증금은 소각 없이 전액 반환됩니다.',
    delta: -8, fcpsLabel: '미션 실패 기록', fcpsNote: '실패 이력도 신용 궤적에 기록돼요. 다음 미션으로 회복할 수 있어요.',
  },
  give_up: {
    chip: '미션 포기', chipBg: 'rgba(var(--color-ink-rgb),.12)', chipFg: color.ink, sub: '미션을 중단했어요', title: '보증금은 돌려드려요',
    moneyBg: 'var(--color-60-bg-surface)', moneyFg: 'var(--color-60-text-primary)', moneyOnDark: false,
    moneyNote: '포기해도 보증금은 전액 반환됩니다.',
    delta: -5, fcpsLabel: '미션 포기 기록', fcpsNote: '포기 이력이 신용 궤적에 기록돼요. 언제든 다시 시작할 수 있어요.',
  },
};
