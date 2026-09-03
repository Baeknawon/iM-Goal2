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
    <Screen bg="#EDEFF1">
      <div style={{ padding: '70px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill bg="rgba(22,25,28,.14)" onClick={() => navigate('/input')}>‹ 입력 방식</Pill>
          <Pill bg={color.mint} fg={color.ink}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: color.ink, animation: 'ringPulse 1.6s infinite' }} />
            LISTENING
          </Pill>
        </div>
        <div style={{ marginTop: 20, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>편하게 말씀하세요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>듣고 있어요</div>

        <div style={{ marginTop: 28, height: 104, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          {waveHeights.map((h, i) => (
            <div
              key={i}
              style={{
                width: 6, borderRadius: 9999, background: i % 3 === 0 ? color.mint : 'rgba(22,25,28,.58)', height: `${h}%`,
                animation: `wave ${(0.7 + (i % 5) * 0.16).toFixed(2)}s ease-in-out infinite`, animationDelay: `${(i * 0.05).toFixed(2)}s`,
              }}
            />
          ))}
        </div>

        <div style={{ flex: 1 }} />
        <div style={{ background: '#fff', borderRadius: 28, padding: '22px 24px', color: color.ink }}>
          <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>실시간 받아쓰기</div>
          <div style={{ marginTop: 10, overflow: 'hidden' }}>
            <div
              style={{
                whiteSpace: 'nowrap', overflow: 'hidden', animation: 'typein 3.4s steps(30) infinite',
                fontSize: 17, fontWeight: 900, letterSpacing: '-.02em', borderRight: `3px solid ${color.mint}`, paddingRight: 4,
              }}
            >
              {sayFull}
            </div>
          </div>
        </div>
        <div
          onClick={() => navigate('/parsed')}
          style={{ marginTop: 14, height: 62, borderRadius: 9999, background: color.mint, color: color.ink, fontSize: 17, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          말 끝났어요
        </div>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: 'rgba(22,25,28,.58)' }}>다시 말하기</div>
      </div>
    </Screen>
  );
}
