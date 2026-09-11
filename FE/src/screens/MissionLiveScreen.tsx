import { currentMission } from '../viewmodel/adaptiveMission';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill, CtaButton } from '../components/ui';
import { personaDefs } from '../data/personas';

import { formatMissionDate } from '../data/mileageHistory';
import { color } from '../styles/theme';

/** Live progress tracker for the persona's current recovery mission, opened from the missions list. */
export function MissionLiveScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const deposit = useAppStore((s) => s.deposit);
  const missionOn = useAppStore((s) => s.missionOn);
  const missionResult = useAppStore((s) => s.missionResult);
  const startedAt = useAppStore((s) => s.missionStartedAt);
  const plan = useAppStore((s) => s.activeRecoveryPlan);
  const selectedDays = useAppStore((s) => s.missionDays);
  const MI = currentMission(useAppStore());
  const P = personaDefs[persona];

  const totalDays = plan?.missionDays ?? selectedDays;
  const daysDone = startedAt ? Math.min(totalDays, Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 86400000))) : 0;
  const daysLeft = Math.max(0, totalDays - daysDone);
  const pct = Math.round(daysDone / totalDays * 100);

  const checks = [
    { label: '보증금', value: `${deposit.toLocaleString()}원` },
    { label: '시작일', value: formatMissionDate(startedAt) },
    { label: '기간', value: `${totalDays}일` },
    { label: '난이도', value: MI.difficulty },
    { label: '목표', value: P.goalName },
  ];

  if (!missionOn) return <Navigate to={missionResult ? '/release' : '/missionDetail'} replace />;
  return (
      <Screen>
        <div style={{ padding: 'var(--screen-pad-top) var(--screen-padding-x) 0', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Pill bg={color.mint} fg={color.ink}>진행 중</Pill>
          </div>
          <div style={{ marginTop: 18, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{MI.leg}</div>
          <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.035em', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>
            {MI.title1}<br />{MI.title2}
          </div>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          <div style={{ background: 'var(--color-hero)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: 'var(--im-white)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>남은 기간</div>
                <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 5 }}>
                  <span style={{ fontSize: 40, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>{daysLeft}</span>
                  <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>일</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>{daysDone} / {totalDays}일 수행</div>
            </div>
            <div style={{ marginTop: 'var(--space-2)', height: 11, borderRadius: 'var(--radius-pill)', background: 'rgba(var(--color-white-rgb),.16)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: color.mint, transition: 'width .5s ease' }} />
            </div>
          </div>
          <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 13 }}>
            {checks.map((c) => (
                <div key={c.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-1-5)' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{c.label}</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.015em' }}>{c.value}</span>
                </div>
            ))}
          </div>
          <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>지금 해야 하는 것</div>
            <div style={{ marginTop: 9, fontSize: 'var(--font-size-sm)', lineHeight: 1.7, fontWeight: 'var(--font-weight-semibold)' }}>{MI.how}</div>
          </div>
          <div style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)', fontSize: 'var(--font-size-2xs)', lineHeight: 1.7, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>
            완료 기준: {MI.criteria.rule}. 미션 결과(성공·실패·중단)는 미션 리스트에서 선택합니다. 어느 경우든 보증금 {deposit.toLocaleString()}원은 지갑으로 돌아오고, 결과만 FCPS에 기록됩니다.
          </div>
          <CtaButton height={54} style={{ marginTop: 'var(--space-0-5)' }} onClick={() => navigate('/missions')}>
            미션 리스트 보러가기
          </CtaButton>
        </div>
      </Screen>
  );
}
