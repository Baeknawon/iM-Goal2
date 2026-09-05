import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, BackToHome, Pill, ScreenBody, CtaButton } from '../components/ui';
import { missionDefs, missionProfileTags } from '../data/personas';
import { RecoveryPlanCard } from '../components/RecoveryPlanCard';
import { recoveryPlan, recoveryCriteria } from '../viewmodel/recoveryFlow';
import { recommendMissionDuration } from '../viewmodel/missionDuration';
import { color } from '../styles/theme';




export function MissionDetailScreen() {
  const persona = useAppStore((s) => s.persona);
  return <MissionDetailContent key={persona} />;
}

function MissionDetailContent() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const missionDays = useAppStore((s) => s.missionDays);
  const setMissionDays = useAppStore((s) => s.setMissionDays);
  const startMission = useAppStore((s) => s.startMission);
  const missionOn = useAppStore((s) => s.missionOn);
  const spent = useAppStore((s) => s.spent);
  const lastResult = useAppStore((s) => s.fcpsLog[0]?.result);
  const activePlan = useAppStore((s) => s.activeRecoveryPlan);
  const recommendation = recommendMissionDuration(persona, lastResult);
  const [draftDays, setDraftDays] = useState<number | null>(null);
  const shownDays = missionOn ? (activePlan?.missionDays ?? missionDays) : draftDays ?? missionDays;
  const MI = missionDefs[persona];
  const plan = recoveryPlan(persona, shownDays, spent);
  const missionSave = plan.savings.toLocaleString() + '원';

  return (
    <Screen>
      <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill>미션 DB 630건</Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>AI 에이전트가 골라낸,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>회복 미션</div>
      </div>

      <ScreenBody>
        <RecoveryPlanCard plan={plan} />
        <div style={{ position: 'relative' }}>
          <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: '28px 28px 0 0', padding: '22px 24px', color: color.ink }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', color: 'var(--color-60-text-secondary)' }}>{MI.leg}</div>
              <div style={{ padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: color.mintTintLight, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-accent-text)' }}>{MI.difficulty}</div>
            </div>
            <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 1.3 }}>{MI.title1}<br />{MI.title2}</div>
            <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', gap: 'var(--space-2-5)' }}>
              <Stat label="기간" value={`${shownDays}일`} />
              <Stat label="절약 금액" value={missionSave} />
              <Stat label="회복 예상" value={`${plan.recoverDays}일`} accent />
            </div>
            <section className="mission-duration">
              <div className="mission-duration-heading"><span className="deposit-eyebrow">AI 추천 기간 · {recommendation.days}일</span><button type="button" className="deposit-change" disabled={missionOn} aria-expanded={draftDays !== null} aria-controls="mission-duration-adjuster" onClick={() => setDraftDays(missionDays)}>세부 조정</button></div>
              <p className="fcps-description">{recommendation.reason}</p>
              <p className="fcps-description">{missionOn ? '진행 중인 미션의 기간은 변경할 수 없어요.' : draftDays !== null ? '기간을 조정 중이에요. 적용하면 보증금 추천에도 반영돼요.' : missionDays === recommendation.days ? '추천 기간이 적용되어 있어요.' : '직접 선택한 기간이 적용되어 있어요.'}</p>
              {draftDays !== null && !missionOn && <div className="deposit-adjuster" id="mission-duration-adjuster">
                <label htmlFor="mission-duration-range">미션 기간 <strong>{draftDays}일</strong></label>
                <input id="mission-duration-range" type="range" min={7} max={28} step={7} value={draftDays} aria-valuetext={draftDays + '일'} onChange={(event) => setDraftDays(Number(event.target.value))} />
                <div className="deposit-range-labels"><span>7일</span><span>14일</span><span>21일</span><span>28일</span></div>
                <p>주간 실천 기준에 맞춰 7일 단위로 조정해요. 기간이 길어질수록 예상 절약액과 예치 기간도 늘어납니다.</p>
                <button type="button" className="deposit-reset" onClick={() => setDraftDays(recommendation.days)}>AI 추천 {recommendation.days}일로 맞추기</button>
                <div className="deposit-adjust-actions"><CtaButton height={52} bg={color.bgAlt} onClick={() => setDraftDays(null)}>취소</CtaButton><CtaButton height={52} onClick={() => { setMissionDays(draftDays); setDraftDays(null); }}>기간 적용</CtaButton></div>
              </div>}
              <p className="mission-duration-footnote">미션 특성과 최근 결과에 따른 데모 추천입니다.</p>
            </section>
          </div>
          <div style={{ position: 'relative', height: 26, background: 'var(--color-60-bg-surface)', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
            <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
            <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,var(--color-60-border) 0 6px,transparent 6px 12px)' }} />
          </div>
          <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: '0 0 28px 28px', padding: '20px 24px 24px', color: color.ink }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
              <div style={{ background: color.mintTintLight, borderRadius: 'var(--radius-lg)', padding: 15 }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-accent-text)' }}>① 왜 이 구간인가요</div>
                <div style={{ marginTop: 6, fontSize: 'var(--font-size-sm)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)' }}>{MI.why}</div>
              </div>
              <div style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-lg)', padding: 15 }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>② 어떻게 하나요</div>
                <div style={{ marginTop: 6, fontSize: 'var(--font-size-sm)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)' }}>{MI.how}</div>
              </div>
            </div>
            <CtaButton disabled={draftDays !== null} style={{ marginTop: 16 }} onClick={() => navigate(missionOn ? '/missionLive' : '/token')}>{missionOn ? '진행 중인 미션 보기' : '보증금 걸고 탑승하기'}</CtaButton>
            {!missionOn && <CtaButton disabled={draftDays !== null} bg={color.bgAlt} style={{ marginTop: 9 }} onClick={() => { startMission(0); navigate('/missionLive'); }}>보증금 없이 시작하기</CtaButton>}
          </div>
        </div>

        <div className="recovery-note"><b>완료 기준</b><p>{recoveryCriteria[persona].rule}</p><b>보증금은 선택이에요</b><p>소비 가능한 돈을 잠시 분리해 실천을 돕습니다. 보증금 없이 참여해도 판정 기준과 FCPS 점수는 같고, 예치금은 성공·실패·포기 모두 전액 돌아옵니다.</p></div>
        <div style={{ marginTop: 18, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>이 티켓을 만든 근거</div>
        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {missionProfileTags[persona].map((p) => (
              <div key={p} style={{ padding: '9px 14px', borderRadius: 'var(--radius-pill)', background: 'rgba(var(--color-mint-rgb),.22)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-lime-text)' }}>{p}</div>
            ))}
          </div>
        </div>
      </ScreenBody>
    </Screen>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', marginTop: 'var(--space-0-5)', color: accent ? 'var(--color-accent-text)' : color.ink }}>{value}</div>
    </div>
  );
}
