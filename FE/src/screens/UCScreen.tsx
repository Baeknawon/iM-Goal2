import { useNavigate, useParams } from 'react-router-dom';
import { ucDefs, ucChainsP1, ucChainsP2 } from '../data/ucDefs';
import type { UCScreenId } from '../types';
import { Screen, BackToHome, ScreenBody, CtaButton } from '../components/ui';
import { UCBlockView } from '../components/UCBlockView';
import { color } from '../styles/theme';

const chainKeyFor = (id: string): 'A' | 'B' | 'C' | null => {
  const c = id.charAt(1);
  return c === '1' ? 'A' : c === '2' ? 'B' : c === '3' ? 'C' : null;
};

/**
 * Renders one of the 18 use-case walkthrough screens (u11..u36), block by block.
 * Screens double as two guided chains per persona: phase 1 (deviation → cause,
 * reached from the Home alert) hands off to the real MissionDetail/Token screens;
 * phase 2 (reached from Home's "회복 미션 성공 확인" trigger) walks the recovery
 * verification and hands off to ReleaseScreen, which returns the deposit and
 * marks the mission recovered.
 */
export function UCScreen() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const screenId = id as UCScreenId;
  const uc = ucDefs[screenId];

  if (!uc) {
    return (
      <Screen>
        <ScreenBody>
          <div style={{ padding: 'var(--space-3)' }}>알 수 없는 화면입니다.</div>
        </ScreenBody>
      </Screen>
    );
  }

  const chainKey = chainKeyFor(screenId);
  const chainP1 = chainKey ? ucChainsP1[chainKey] : [];
  const chainP2 = chainKey ? ucChainsP2[chainKey] : [];
  const inP1 = chainP1.includes(screenId);
  const phase: 1 | 2 | null = inP1 ? 1 : chainP2.includes(screenId) ? 2 : null;
  const chain = phase === 1 ? chainP1 : phase === 2 ? chainP2 : [];
  const chainIdx = chain.indexOf(screenId);
  const isLast = chainIdx >= 0 && chainIdx === chain.length - 1;
  const step = chainIdx >= 0 ? `${chainIdx + 1} / ${chain.length}` : '';

  const handleNext = () => {
    if (!isLast) { navigate(`/uc/${chain[chainIdx + 1]}`); return; }
    if (phase === 1) { navigate('/missionDetail'); return; }
    if (phase === 2) { navigate('/verify?result=success'); return; }
    navigate('/home');
  };

  return (
    <Screen>
      <div style={{ padding: 'var(--screen-pad-top) var(--screen-padding-x) 0', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          {screenId !== 'u12' && <div style={{ padding: '9px 15px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: color.ink, background: uc.accent }}>{uc.code}</div>}
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{uc.sub}</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>{uc.title}</div>
        {chain.length > 1 && screenId !== 'u12' && (
          <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', gap: 'var(--component-gap)' }}>
            <div style={{ flex: 1, display: 'flex', gap: 4 }}>
              {chain.map((k, i) => (
                <div key={k} style={{ flex: 1, height: 4, borderRadius: 'var(--radius-pill)', background: i <= chainIdx ? color.mint : 'rgba(var(--color-ink-rgb),.14)' }} />
              ))}
            </div>
            <span style={{ flex: 'none', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{step}</span>
          </div>
        )}
      </div>

      <ScreenBody padBottom={24}>
        <div className="screen-stack">
        {uc.blocks.map((b, i) => (
          <UCBlockView key={i} block={b} accent={uc.accent} />
        ))}
        </div>
      </ScreenBody>
      <div className="screen-action-footer">
        <CtaButton onClick={handleNext}>{uc.cta}</CtaButton>
      </div>
    </Screen>
  );
}
