import { useNavigate } from 'react-router-dom';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, CtaButton } from '../components/ui';
import { arrivedRecords } from '../data/staticContent';
import { color } from '../styles/theme';

export function ArrivedScreen() {
  const navigate = useNavigate();
  const { P, AP } = useJourney();

  return (
      <Screen>
        <div style={{ padding: '68px var(--screen-padding-x) 0', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BackToHome />
            <Pill bg={color.mint} fg={color.ink}>ARRIVED</Pill>
          </div>
          <div style={{ marginTop: 18, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>도착했습니다,</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>{P.goalName} 완주</div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 34px' }}>
          <div style={{ position: 'relative', marginTop: 60 }}>
            <img
                src="/assets/dandi-pilot.png" alt="기장 단디"
                style={{ position: 'absolute', right: -10, top: -76, width: 88, height: 'auto', display: 'block', zIndex: 5, animation: 'nod 4.4s ease-in-out infinite', filter: 'drop-shadow(0 10px 16px rgba(var(--color-ink-rgb),.18))' }}
            />
            <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: '28px 28px 0 0', padding: 'var(--space-3)', color: color.ink, position: 'relative', overflow: 'hidden' }}>
              <img src="/assets/climb_logo.png" alt="" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 190, height: 'auto', opacity: 0.05, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 16, right: -14, transform: 'rotate(-11deg)', border: '3px solid var(--im-mint)', color: 'var(--color-accent-text)', borderRadius: 14, padding: '7px 16px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', opacity: 0.9 }}>ARRIVED</div>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', color: 'var(--color-60-text-secondary)' }}>BOARDING PASS · 완료</div>
              <div style={{ marginTop: 18, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>최종 도착 금액</div>
              <div style={{ marginTop: 3, fontSize: 38, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', whiteSpace: 'nowrap' }}>{AP.target}</div>
              <div style={{ marginTop: 'var(--space-1-5)', height: 11, borderRadius: 'var(--radius-pill)', background: 'var(--color-30-tab-bg)', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: color.mint }} />
              </div>
              <div style={{ marginTop: 'var(--space-1)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
                <span>100% 비행 완료</span><span>{AP.eta} 도착</span>
              </div>
            </div>
            <div style={{ position: 'relative', height: 26, background: 'var(--color-60-bg-surface)', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,var(--color-60-border) 0 6px,transparent 6px 12px)' }} />
            </div>
            <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: '0 0 28px 28px', padding: '20px 24px 24px', color: color.ink }}>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>여정 기록</div>
              <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 11 }}>
                {arrivedRecords.map((r) => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-1-5)' }}>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{r.label}</span>
                      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap' }}>{r.value}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-hero)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: 'var(--im-white)' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>다음 여정 제안</div>
            <div style={{ marginTop: 10, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', lineHeight: 1.45 }}>이번에 만든 습관이면<br />다음 목표는 더 빠릅니다</div>
            <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-xs)', lineHeight: 1.7, color: 'var(--color-text-on-dark-muted)' }}>완주 기록이 FCPS에 남아, 다음 목표에서는 더 낮은 금리의 iM 상품이 후보로 올라옵니다.</div>
          </div>

          <CtaButton height={56} style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-md)' }} arrowBg={color.ink} onClick={() => navigate('/chat')}>다음 목표 발권하기</CtaButton>
        </div>
      </Screen>
  );
}
