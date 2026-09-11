import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill } from '../components/ui';
import { goalSetupDefs } from '../data/personas';
import { color } from '../styles/theme';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', '⌫'];

/** "직접 타이핑" — manual goal/amount/period entry, reached from the input-mode picker. */
export function TypingScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const G = goalSetupDefs[persona];
  const rows = [
    { label: '목표 이름', value: G.goalType, emphasized: false },
    { label: '목표 금액', value: G.goalAmount, emphasized: true },
    { label: '기간', value: G.spanLabel, emphasized: false },
  ];

  return (
    <Screen>
      <div style={{ padding: 'var(--screen-pad-top) 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/input')}>‹ 입력 방식</Pill>
          <Pill>직접 입력</Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2-5)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>숫자만 넣으면 돼요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>직접 입력할게요</div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: '17px 20px', border: `2px solid ${r.emphasized ? color.mint : 'transparent'}` }}
            >
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>{r.label}</div>
              <div style={{ marginTop: 5, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em', color: color.ink }}>{r.value}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--space-1)' }}>
          {KEYS.map((k) => (
            <div
              key={k}
              style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--color-60-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer', color: color.ink }}
            >
              {k}
            </div>
          ))}
        </div>
        <div
          onClick={() => navigate('/analyze')}
          style={{ minHeight: 'var(--btn-height-xl)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 'var(--space-1-5)', height: 'var(--btn-height-xl)', borderRadius: 'var(--radius-lg)', background: 'var(--color-action-bg)', color: 'var(--color-action-text)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--component-gap)', cursor: 'pointer' }}
        >
          이대로 항로 계산하기
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>›</span>
        </div>
      </div>
    </Screen>
  );
}
