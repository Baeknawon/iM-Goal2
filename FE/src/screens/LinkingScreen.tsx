import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Pill } from '../components/ui';
import { color } from '../styles/theme';

const steps: { name: string; tag: string; done: boolean }[] = [
  { name: 'iM뱅크 계좌 3건', tag: '조회 완료', done: true },
  { name: '타 은행 계좌 2건', tag: '조회 완료', done: true },
  { name: '카드 내역 12개월', tag: '분석 중', done: false },
  { name: '고정 지출 패턴', tag: '대기', done: false },
];

/** 동의 2/4 — brief auto-advancing "linking your data" loader, then lands on /connect. */
export function LinkingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/connect'), 2400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <Screen>
      <div style={{ padding: '70px 22px 34px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <Pill style={{ alignSelf: 'flex-end' }}>동의 2/4</Pill>
        <div style={{ marginTop: 'var(--space-2-5)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>잠시만요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>
          마이데이터를<br />연결하고 있어요
        </div>
        <div style={{ marginTop: 26, height: 10, borderRadius: 'var(--radius-pill)', background: 'var(--color-30-surface-sub)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: color.mint, borderRadius: 'var(--radius-pill)', animation: 'linkbar 2.4s ease-out forwards' }} />
        </div>
        <div style={{ marginTop: 22, background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
          {steps.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
              <div
                style={{
                  flex: 'none', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', background: s.done ? color.mint : 'rgba(var(--color-ink-rgb),.12)', color: s.done ? color.ink : 'var(--color-60-text-secondary)',
                }}
              >
                {s.done ? '✓' : i + 1}
              </div>
              <span style={{ flex: 1, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.015em' }}>{s.name}</span>
              <span style={{ flex: 'none', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: s.done ? color.mintDark : 'var(--color-60-text-secondary)' }}>{s.tag}</span>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', left: '50%', top: '75%', transform: 'translate(-50%, -50%)', width: 'calc(100% - 44px)', maxWidth: 320, pointerEvents: 'none' }}>
          <img
            src="/assets/pair-map.png" alt="연결을 확인하는 단디와 똑디"
            style={{ width: '100%', height: 'auto', display: 'block', animation: 'unfurl 3.2s ease-in-out infinite' }}
          />
        </div>
      </div>
    </Screen>
  );
}
