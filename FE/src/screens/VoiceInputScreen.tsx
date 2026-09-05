import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill } from '../components/ui';
import { waveHeights } from '../data/staticContent';
import { goalSetupDefs } from '../data/personas';
import { color } from '../styles/theme';

export function VoiceInputScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const G = goalSetupDefs[persona];
  const sayFull = `${G.say1} ${G.say2}`.replace(/"/g, '');

  return (
    <Screen bg="var(--color-60-bg-base)">
      <div style={{ padding: '70px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill bg="rgba(var(--color-ink-rgb),.14)" onClick={() => navigate('/input')}>‹ 입력 방식</Pill>
          <Pill bg={color.mint} fg={color.ink}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-hero)', animation: 'ringPulse 1.6s infinite' }} />
            LISTENING
          </Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2-5)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>편하게 말씀하세요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>듣고 있어요</div>

        <div style={{ marginTop: 28, height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          {waveHeights.map((h, i) => (
            <div
              key={i}
              style={{
                width: 6, borderRadius: 'var(--radius-pill)', background: i % 3 === 0 ? color.mint : 'var(--color-60-text-secondary)', height: `${h}%`,
                animation: `wave ${(0.7 + (i % 5) * 0.16).toFixed(2)}s ease-in-out infinite`, animationDelay: `${(i * 0.05).toFixed(2)}s`,
              }}
            />
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: '22px 24px', color: color.ink }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>실시간 받아쓰기</div>
          <div style={{ marginTop: 10, overflow: 'hidden' }}>
            <div
              style={{
                whiteSpace: 'nowrap', overflow: 'hidden', animation: 'typein 3.4s steps(30) infinite',
                fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', borderRight: `3px solid ${color.mint}`, paddingRight: 4,
              }}
            >
              {sayFull}
            </div>
          </div>
        </div>
        <div
          onClick={() => navigate('/parsed')}
          style={{ minHeight: 'var(--btn-height-xl)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 'var(--space-1-5)', height: 'var(--btn-height-xl)', borderRadius: 'var(--radius-lg)', background: color.mint, color: color.ink, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          말 끝났어요
        </div>
        <div style={{ marginTop: 'var(--space-1-5)', textAlign: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>다시 말하기</div>
      </div>
    </Screen>
  );
}
