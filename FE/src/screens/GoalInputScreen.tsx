import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill, InfoNote } from '../components/ui';
import { inputModes } from '../data/staticContent';
import { goalSetupDefs } from '../data/personas';
import { color } from '../styles/theme';

export function GoalInputScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const modes = inputModes.map((m) => (m.to === '/voice' ? { ...m, desc: goalSetupDefs[persona].voiceHint } : m));
  return (
    <Screen>
      <div style={{ padding: '70px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/empty')}>‹ 홈</Pill>
          <Pill>CHECK-IN · 1/3</Pill>
        </div>
        <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>말해도, 직접 입력해도 됩니다</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>어떤 금융 목표를<br />세울까요?</div>

        <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {modes.map((m) => (
            <div
              key={m.title}
              onClick={() => navigate(m.to)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, borderRadius: 22, padding: '17px 18px', cursor: 'pointer',
                background: m.emphasized ? color.mint : '#fff', border: `1px solid ${m.emphasized ? color.mint : 'rgba(22,25,28,.10)'}`,
                color: color.ink, boxShadow: '0 1px 2px rgba(22,25,28,.05)',
              }}
            >
              <div style={{ flex: 'none', width: 44, height: 44, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, background: m.emphasized ? 'rgba(10,30,26,.14)' : 'rgba(22,25,28,.12)' }}>
                {m.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16.5, fontWeight: 900, letterSpacing: '-.015em' }}>{m.title}</div>
                <div style={{ marginTop: 2, fontSize: 12.5, fontWeight: 700, opacity: 0.55 }}>{m.desc}</div>
              </div>
              <div style={{ width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, background: m.emphasized ? 'rgba(10,30,26,.14)' : 'rgba(22,25,28,.12)' }}>
                ›
              </div>
            </div>
          ))}
        </div>

        <InfoNote bg="rgba(22,25,28,.07)">어떤 방식이든 결과는 같은 티켓 한 장입니다. 금액·기간을 모르면 AI가 소비 내역에서 추정합니다.</InfoNote>
        <div style={{ flex: 1 }} />
        <div
          onClick={() => navigate('/typing')}
          style={{ height: 58, borderRadius: 9999, border: '1.5px dashed rgba(22,25,28,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, color: 'rgba(22,25,28,.6)', cursor: 'pointer' }}
        >
          숫자를 직접 입력하기
        </div>
      </div>
    </Screen>
  );
}
