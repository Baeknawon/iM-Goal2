import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill, CtaButton } from '../components/ui';
import { goalSetupDefs } from '../data/personas';
import { color } from '../styles/theme';

/** Shown after the voice-input screen's "말 끝났어요" — confirms what was recognized before calculating the route. */
export function ParsedScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const G = goalSetupDefs[persona];

  return (
    <Screen>
      <div style={{ padding: '70px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/voice')}>‹ 다시 말하기</Pill>
          <Pill bg={color.mint} fg={color.ink}>인식 완료</Pill>
        </div>
        <div style={{ marginTop: 20, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>이렇게 이해했어요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>맞으면 계산할게요</div>

        <div style={{ marginTop: 24, background: '#fff', borderRadius: 28, padding: 24, color: color.ink }}>
          <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>인식된 문장</div>
          <div style={{ marginTop: 9, fontSize: 21, fontWeight: 900, lineHeight: 1.5, letterSpacing: '-.025em' }}>
            {G.say1}<br />{G.say2}
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid rgba(22,25,28,.08)', display: 'flex', flexDirection: 'column', gap: 11 }}>
            <ParsedChip label="기간" value={G.spanLabel} />
            <ParsedChip label="목표 유형" value={G.goalType} />
            <ParsedChip label="금액" value={G.goalAmount} />
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <CtaButton height={62} bg={color.ink} fg="#fff" arrowBg={color.mint} onClick={() => navigate('/analyze')}>
          이대로 항로 계산하기
        </CtaButton>
      </div>
    </Screen>
  );
}

function ParsedChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ padding: '5px 11px', borderRadius: 9999, background: color.mintTintLight, fontSize: 11.5, fontWeight: 900, color: '#0A8873' }}>{label}</div>
      <span style={{ fontSize: 15.5, fontWeight: 900 }}>{value}</span>
    </div>
  );
}
