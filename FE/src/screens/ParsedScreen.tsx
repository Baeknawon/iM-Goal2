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
        <div style={{ marginTop: 'var(--space-2-5)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>이렇게 이해했어요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>맞으면 계산할게요</div>

        <div style={{ marginTop: 'var(--space-3)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-3)', color: color.ink }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>인식된 문장</div>
          <div style={{ marginTop: 9, fontSize: 21, fontWeight: 'var(--font-weight-bold)', lineHeight: 1.5, letterSpacing: '-.025em' }}>
            {G.say1}<br />{G.say2}
          </div>
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--color-60-border)', display: 'flex', flexDirection: 'column', gap: 11 }}>
            <ParsedChip label="기간" value={G.spanLabel} />
            <ParsedChip label="목표 유형" value={G.goalType} />
            <ParsedChip label="금액" value={G.goalAmount} />
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <CtaButton height={62} bg="var(--color-action-bg)" fg="var(--color-action-text)" arrowBg="var(--color-action-text)" onClick={() => navigate('/analyze')}>
          이대로 항로 계산하기
        </CtaButton>
      </div>
    </Screen>
  );
}

function ParsedChip({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--component-gap)' }}>
      <div style={{ padding: '5px 11px', borderRadius: 'var(--radius-pill)', background: color.mintTintLight, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-accent-text)' }}>{label}</div>
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{value}</span>
    </div>
  );
}
