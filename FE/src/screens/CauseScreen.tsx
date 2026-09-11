import { useNavigate } from 'react-router-dom';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, ScreenBody, CtaButton } from '../components/ui';
import { causesByPersona } from '../data/personas';
import { color } from '../styles/theme';

export function CauseScreen() {
  const navigate = useNavigate();
  const { persona, P, AP, remaining, over } = useJourney();
  const causes = causesByPersona[persona];
  return (
    <Screen bg="var(--color-60-bg-base)">
      <div style={{ padding: 'var(--screen-pad-top) var(--screen-padding-x) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill bg="var(--color-danger)" fg="var(--color-60-text-primary)">✚ 확장 기능</Pill>
        </div>
        <div style={{ marginTop: 18, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>난기류 원인을 분석했어요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>왜 이탈했나요?</div>
      </div>

      <ScreenBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
          {causes.map((c) => (
            <div key={c.rank} style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', background: c.highlighted ? 'var(--im-white)' : 'rgba(var(--color-ink-rgb),.09)', color: color.ink }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div
                  style={{
                    flex: 'none', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', background: c.highlighted ? 'var(--color-danger)' : 'rgba(var(--color-ink-rgb),.14)', color: c.highlighted ? 'var(--im-white)' : color.ink,
                  }}
                >
                  {c.rank}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.015em' }}>{c.name}</div>
                  <div style={{ marginTop: 3, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.55 }}>{c.type} · 기여도 {c.weight}</div>
                </div>
                <div style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger)' }}>{c.delta}</div>
              </div>
              <div style={{ marginTop: 'var(--space-1-5)', height: 9, borderRadius: 'var(--radius-pill)', overflow: 'hidden', background: c.highlighted ? 'var(--color-danger-surface)' : 'rgba(var(--color-ink-rgb),.14)' }}>
                <div style={{ width: `${c.barPct}%`, height: '100%', borderRadius: 'var(--radius-pill)', background: c.highlighted ? 'var(--color-danger)' : 'var(--color-60-text-secondary)' }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)' }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-accent-text)' }}>1순위 원인이 항로에 미친 영향</div>
          <div style={{ marginTop: 'var(--space-2)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>하루 예산</div>
              <div style={{ marginTop: 5, display: 'flex', alignItems: 'baseline', gap: 'var(--component-gap)' }}>
                <span style={{ fontSize: 21, fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{P.dailyBudget.toLocaleString()}원</span>
                <span style={{ color: 'var(--color-60-text-secondary)' }}>→</span>
                <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger)' }}>
                  {over ? '-' + Math.abs(remaining).toLocaleString() : remaining.toLocaleString()}원
                </span>
              </div>
            </div>
            <div style={{ height: 1, background: 'var(--color-30-surface-sub)' }} />
            <div>
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>도착 예정일</div>
              <div style={{ marginTop: 5, display: 'flex', alignItems: 'baseline', gap: 'var(--component-gap)' }}>
                <span style={{ fontSize: 21, fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{AP.eta}</span>
                <span style={{ color: 'var(--color-60-text-secondary)' }}>→</span>
                <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-danger)' }}>{AP.etaDelayed}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-danger)' }}>{AP.delayNote}</div>
            </div>
          </div>
        </div>

        <CtaButton height={62} style={{ marginTop: 'var(--space-2)' }} onClick={() => navigate('/missionDetail')}>항로 복귀 미션 받기</CtaButton>
        <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-2xs)', lineHeight: 1.65, fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
          기여도 차이가 작은 원인은 상위 항목으로 묶어 보여줍니다. 이 수치는 공식 신용점수 산정에 사용되지 않습니다.
        </div>
      </ScreenBody>
    </Screen>
  );
}
