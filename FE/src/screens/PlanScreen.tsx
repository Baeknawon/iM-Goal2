import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';
import { goalSetupDefs } from '../data/personas';
import { Screen, Pill, TicketShell, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

export function PlanScreen() {
  const navigate = useNavigate();
  const finishGoal = useAppStore((s) => s.finishGoal);
  const { persona, P, AP } = useJourney();
  const G = goalSetupDefs[persona];

  return (
    <Screen style={{ animation: 'slideUp .4s ease both' }}>
      <div style={{ padding: '70px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
          <Pill bg={color.mint} fg={color.ink}>발권 완료 · 3/3</Pill>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: color.mint }} />
        </div>
        <div style={{ marginTop: 18, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)', flex: 'none' }}>티켓이 나왔어요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)', flex: 'none' }}>{AP.span} 여정</div>

        <div style={{ marginTop: 'var(--space-2-5)', flex: 'none' }}>
          <TicketShell
            top={
              <div style={{ position: 'relative' }}>
                <img
                  src="/assets/dandi-pilot.png" alt="기장 단디"
                  style={{ position: 'absolute', right: -10, top: -76, width: 88, height: 'auto', display: 'block', zIndex: 5, animation: 'nod 4.4s ease-in-out infinite', filter: 'drop-shadow(0 10px 16px rgba(var(--color-ink-rgb),.18))' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', color: 'var(--color-60-text-secondary)' }}>CLIMB AIRLINES</div>
                  <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-accent-text)' }}>GOAL 0725</div>
                </div>
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 32, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>NOW</div>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{AP.now}</div>
                  </div>
                  <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 'var(--font-size-md)', animation: 'fly 3s ease-in-out infinite' }}>✈</div>
                    <div style={{ width: 58, height: 2, background: 'repeating-linear-gradient(90deg,var(--color-60-border) 0 5px,transparent 5px 10px)' }} />
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{AP.span}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontSize: 32, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: 'var(--color-accent-text)' }}>{P.code}</div>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{AP.eta}</div>
                  </div>
                </div>
              </div>
            }
            bottom={
              <>
                <div style={{ display: 'flex', gap: 'var(--space-2-5)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>목표</div>
                    <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{G.ticketGoal}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>월 저축</div>
                    <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', marginTop: 3 }}>{G.monthly}</div>
                  </div>
                </div>
                <div style={{ marginTop: 18, background: 'var(--color-hero)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)', color: 'var(--im-white)' }}>
                  <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>하루 예산 · DAILY BUDGET</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>{P.dailyBudget.toLocaleString()}</span><span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>원</span>
                  </div>
                  <div style={{ marginTop: 'var(--space-1-5)', paddingTop: 12, borderTop: '1px solid rgba(var(--color-white-rgb),.14)', fontSize: 'var(--font-size-xs)', lineHeight: 1.75, color: 'var(--color-text-on-dark-muted)' }}>
                    {G.calc1}<br />{G.calc2}
                  </div>
                </div>
              </>
            }
          />
        </div>

        <div style={{ marginTop: 'var(--space-2)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', flex: 'none' }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>함께 설정할까요?</div>
          <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 11 }}>
            <ConfirmedRow label="급여일 자동 분배 (매월 25일)" />
            <ConfirmedRow label="항로 이탈 시 즉시 알림" />
          </div>
        </div>

        <CtaButton
          height={62} style={{ marginTop: 'var(--space-2)', flex: 'none' }}
          onClick={() => { finishGoal(); navigate('/home'); }}
        >
          이 티켓으로 탑승하기
        </CtaButton>
      </div>
    </Screen>
  );
}

function ConfirmedRow({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>✓</div>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{label}</span>
    </div>
  );
}
