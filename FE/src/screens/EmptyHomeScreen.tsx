import { useNavigate } from 'react-router-dom';
import { Screen, Brand, TicketShell, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

export function EmptyHomeScreen() {
  const navigate = useNavigate();
  return (
      <Screen>
        <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Brand size={23} />
            <div
                onClick={() => navigate('/settings')}
                style={{ width: 46, height: 46, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            >
              <img
                  src="/assets/dandi-hi.png" alt="단디"
                  style={{ height: 52, width: 'auto', display: 'block', animation: 'nod 3.2s ease-in-out infinite', filter: 'drop-shadow(0 5px 10px rgba(var(--color-ink-rgb),.18))' }}
              />
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>김서준님, 반갑습니다</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>아직 등록된<br />여정이 없어요</div>
        </div>

        <div style={{ flex: 1, padding: '22px 22px 120px' }}>
          <TicketShell
              top={
                <div style={{ position: 'relative' }}>
                  <img src="/assets/climb_logo.png" alt="" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 180, height: 'auto', opacity: 0.045, pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', color: 'var(--color-60-text-secondary)' }}>BOARDING PASS · 미발권</div>
                  <div style={{ position: 'relative', marginTop: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>NOW</div>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>오늘</div>
                    </div>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-60-border)' }}>✈</div>
                      <div style={{ width: 56, height: 2, background: 'repeating-linear-gradient(90deg,var(--color-60-border) 0 5px,transparent 5px 10px)' }} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: 'var(--color-60-border)' }}>???</div>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>목적지 미정</div>
                    </div>
                  </div>
                </div>
              }
              bottom={
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>목표를 정하면 하루 예산이 계산돼요</div>
                  <div style={{ marginTop: 7, fontSize: 'var(--font-size-xs)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>
                    소비 습관을 분석해 가장 무리 없는<br />저축 경로를 찾아드립니다.
                  </div>
                  <CtaButton height={56} bg={color.action} fg="var(--color-action-text)" arrowBg="var(--color-action-text)" style={{ marginTop: 18 }} onClick={() => navigate('/chat')}>
                    목적지 설정하러 가기
                  </CtaButton>
                </div>
              }
          />
        </div>
      </Screen>
  );
}
