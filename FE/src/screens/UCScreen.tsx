import { useNavigate, useParams } from 'react-router-dom';
import { ucDefs, ucChainsP1, ucChainsP2 } from '../data/ucDefs';
import type { UCScreenId } from '../types';
import { Screen, BackToHome, ScreenBody } from '../components/ui';
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
          <div style={{ padding: 24 }}>알 수 없는 화면입니다.</div>
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
    if (phase === 2) { navigate('/release'); return; }
    navigate('/home');
  };

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0', flex: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <div style={{ padding: '9px 15px', borderRadius: 9999, fontSize: 12.5, fontWeight: 900, color: color.ink, background: uc.accent }}>{uc.code}</div>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{uc.sub}</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>{uc.title}</div>
        {chain.length > 0 && (
          <div style={{ marginTop: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, display: 'flex', gap: 4 }}>
              {chain.map((k, i) => (
                <div key={k} style={{ flex: 1, height: 4, borderRadius: 9999, background: i <= chainIdx ? color.mint : 'rgba(22,25,28,.14)' }} />
              ))}
            </div>
            <span style={{ flex: 'none', fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>{step}</span>
          </div>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 34px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {uc.blocks.map((b, i) => (
          <UCBlockView key={i} block={b} accent={uc.accent} />
        ))}
        <div
          onClick={handleNext}
          style={{ marginTop: 6, height: 56, borderRadius: 9999, background: color.ink, color: '#fff', fontSize: 16, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
        >
          {uc.cta}
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</span>
        </div>
      </div>
    </Screen>
  );
}
