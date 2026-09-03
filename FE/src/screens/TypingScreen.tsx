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
      <div style={{ padding: '70px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/input')}>‹ 입력 방식</Pill>
          <Pill>직접 입력</Pill>
        </div>
        <div style={{ marginTop: 20, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>숫자만 넣으면 돼요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>직접 입력할게요</div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map((r) => (
            <div
              key={r.label}
              style={{ background: '#fff', borderRadius: 24, padding: '17px 20px', border: `2px solid ${r.emphasized ? color.mint : 'transparent'}` }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>{r.label}</div>
              <div style={{ marginTop: 5, fontSize: 20, fontWeight: 900, letterSpacing: '-.025em', color: color.ink }}>{r.value}</div>
            </div>
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {KEYS.map((k) => (
            <div
              key={k}
              style={{ height: 52, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, cursor: 'pointer', color: color.ink }}
            >
              {k}
            </div>
          ))}
        </div>
        <div
          onClick={() => navigate('/analyze')}
          style={{ marginTop: 14, height: 60, borderRadius: 9999, background: color.ink, color: '#fff', fontSize: 16.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
        >
          이대로 항로 계산하기
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>›</span>
        </div>
      </div>
    </Screen>
  );
}
