import { recommendMission, failureReasons } from '../viewmodel/adaptiveMission';
import { FailureReasonPicker } from '../components/FailureReasonPicker';
import { RecoveryProgressCard } from '../components/RecoveryProgressCard';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { missionDefs } from '../data/personas';
import { Screen, Pill, ScreenBody, CtaButton } from '../components/ui';
import { color } from '../styles/theme';
import { RecoveryPlanCard } from '../components/RecoveryPlanCard';

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
        <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pill onClick={() => navigate('/missions')}>‹ 미션</Pill>
            <Pill bg={V.chipBg} fg={V.chipFg}>{V.chip}</Pill>
          </div>
          <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{legCode} · {V.sub}</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>{V.title}</div>
        </div>

        <ScreenBody>
          {latest?.recovery && <RecoveryProgressCard recovery={latest.recovery} />}
          {result === 'success' && latest?.recoveryPlan && <RecoveryPlanCard plan={latest.recoveryPlan} success />}
          {result !== 'success' && <div className="recovery-note"><h2 className="fcps-section-title">다음 시도는 부담을 줄여볼까요?</h2><p>{result === 'fail' ? latest?.missionSnapshot?.criteria.fail ?? '미션 기준을 충족하지 못한 기록입니다.' : '이번에는 끝까지 수행하지 못했지만, 준비가 되면 다시 시작할 수 있어요.'}</p><p>이번 결과로 목표 회복 효과는 반영하지 않았어요. 어려웠던 이유에 맞춰 다음 행동과 성공 기준을 조정해요.</p><FailureReasonPicker value={latest?.failureReason??'unknown'} onChange={state.setFailureReason}/><p className="fcps-description">선택한 이유: {failureReasons[latest?.failureReason??'unknown']}<br/>다음 미션: {next.title1} {next.title2}<br/>{next.why}</p><CtaButton onClick={() => { setMissionDays(7); navigate('/missionDetail'); }}>조정된 미션 확인하기</CtaButton></div>}
          {/* 지갑 반환 카드 — 세 결과 모두 전액 반환 */}
          <div style={{ background: V.cardBg, borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: V.cardFg }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', opacity: 0.65 }}>iMKRW 지갑으로 반환</div>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>+{depositLabel}</span>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>iMKRW</span>
            </div>
            <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65, fontWeight: 'var(--font-weight-semibold)', opacity: 0.72 }}>{V.moneyNote}</div>
            <div style={{ marginTop: 'var(--space-1-5)', paddingTop: 12, borderTop: '1px solid var(--color-60-border)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>
              지갑 잔액 {wallet.toLocaleString()} iMKRW
            </div>
          </div>

          {/* FCPS 반영 */}
          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-hero)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: 'var(--im-white)' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>FCPS에 기록됨</div>
            <div style={{ marginTop: 'var(--space-1)', display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)' }}>
            <span style={{ fontSize: 32, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.035em', color: V.delta >= 0 ? color.mint : color.coral }}>
              {V.delta >= 0 ? '+' : ''}{V.delta}
            </span>
              <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.65 }}>{V.fcpsLabel}</span>
            </div>
            <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)', lineHeight: 1.6 }}>{V.fcpsNote}</div>
            <CtaButton height={50} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-sm)' }} arrowBg={color.ink} onClick={() => navigate('/fcps')}>점수 반영 내역 보기</CtaButton>
          </div>

          <CtaButton height={62} style={{ marginTop: 'var(--space-1-5)' }} onClick={() => navigate('/home')}>
            목표 경로와 다음 행동 보기
          </CtaButton>
        </ScreenBody>
      </Screen>
  );
}

const resultView: Record<MissionResult, {
  chip: string; chipBg: string; chipFg: string; sub: string; title: string;
  cardBg: string; cardFg: string; moneyNote: string;
  delta: number; fcpsLabel: string; fcpsNote: string;
}> = {
  success: {
    chip: '미션 성공', chipBg: color.mint, chipFg: color.ink, sub: '완주했어요', title: '보증금을 돌려드려요',
    cardBg: color.mint, cardFg: color.ink,
    moneyNote: '기한 내 미션을 완수해 보증금이 iMKRW 지갑으로 전액 반환됐어요.',
    delta: 18, fcpsLabel: '미션 성공 기록', fcpsNote: '행동 미션 성공 기록이에요. 재무 회복과 4주 유지는 별도로 확인합니다.',
  },
  fail: {
    chip: '미션 실패', chipBg: color.coralTint, chipFg: color.coralDark, sub: '이번엔 아쉬웠어요', title: '보증금은 돌려드려요',
    cardBg: color.coralTintLight, cardFg: 'var(--color-60-text-primary)',
    moneyNote: '실패했지만 보증금은 소각 없이 iMKRW 지갑으로 전액 반환됩니다.',
    delta: -8, fcpsLabel: '미션 실패 기록', fcpsNote: '실패 이력도 신용 궤적에 기록돼요. 다음 미션으로 회복할 수 있어요.',
  },
  give_up: {
    chip: '미션 포기', chipBg: 'rgba(var(--color-ink-rgb),.12)', chipFg: color.ink, sub: '미션을 중단했어요', title: '보증금은 돌려드려요',
    cardBg: 'var(--color-60-bg-base)', cardFg: color.ink,
    moneyNote: '포기해도 보증금은 iMKRW 지갑으로 전액 반환됩니다.',
    delta: -5, fcpsLabel: '미션 포기 기록', fcpsNote: '포기 이력이 신용 궤적에 기록돼요. 언제든 다시 시작할 수 있어요.',
  },
};
