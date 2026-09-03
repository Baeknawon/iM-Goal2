import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { alertDefs, personaDefs, acctDefs } from '../data/personas';
import { phase1Start } from '../data/ucDefs';
import { CtaButton } from './ui';
import { color } from '../styles/theme';

/**
 * The "항로 이탈" (route-deviation) alert: a dropdown banner plus a bottom
 * sheet with transaction detail and next actions. Shown on Home when
 * `alertOn` is true — ported from the doc's `sc-if value="{{ alertOn }}"` block.
 */
export function AlertOverlay() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const spent = useAppStore((s) => s.spent);
  const dismissAlert = useAppStore((s) => s.dismissAlert);
  const AL = alertDefs[persona];
  const AP = acctDefs[persona];

  const alertHead = persona === 'A'
    ? `오늘 예산을 ${Math.max(0, spent - personaDefs.A.dailyBudget).toLocaleString('en-US')}원 초과했어요`
    : AL.headFallback;

  return (
    <>
      <div style={dropStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#FF7A5C', animation: 'ringPulse 1.8s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: '#D0512E' }}>{AL.tag}</span>
        </div>
        <div style={{ marginTop: 8, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{alertHead}</div>
            <div style={{ marginTop: 4, fontSize: 14, wordBreak: 'keep-all', color: 'rgba(255,255,255,.6)' }}>
              도착 예정일이 {AP.eta} → {AP.etaDelayed}로 지연
            </div>
          </div>
          <img
            src="/assets/dandi-alert.png" alt="단디"
            style={{ flex: 'none', height: 64, width: 'auto', display: 'block', marginBottom: -16, animation: 'fret 1.1s ease-in-out infinite' }}
          />
        </div>
      </div>

      <div style={sheetStyle}>
        <div style={{ width: 44, height: 5, borderRadius: 9999, background: 'rgba(22,25,28,.12)', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: AL.iconBg, color: AL.iconFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>
            {AL.icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 900 }}>{AL.txnName}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(22,25,28,.61)', marginTop: 2 }}>{AL.txnSub}</div>
          </div>
          <div style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 20, fontWeight: 900, letterSpacing: '-.02em' }}>{AL.txnAmt}</div>
        </div>
        <div style={{ marginTop: 16, background: '#FFEFEA', borderRadius: 24, padding: 18 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: '#C4472A' }}>{AL.riskTag}</div>
          <div style={{ marginTop: 8, fontSize: 15, lineHeight: 1.7, fontWeight: 700, color: '#3A1A11' }}>{AL.riskBody}</div>
        </div>
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 9 }}>
          <div
            onClick={() => { dismissAlert(); navigate(`/uc/${phase1Start[persona]}`); }}
            style={{ borderRadius: 30, background: color.ink, color: '#fff', padding: '20px 22px', cursor: 'pointer' }}
          >
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>AI 에이전트 · 원인부터 회복까지</div>
            <div style={{ marginTop: 7, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '-.02em' }}>AI 에이전트가 바로잡는 미션 받기</div>
                <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.62)' }}>지금 상황에 맞는 회복 미션을 만들어드려요</div>
              </div>
              <div style={{ flex: 'none', width: 34, height: 34, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>›</div>
            </div>
          </div>
          <CtaButton height={50} bg="rgba(22,25,28,.06)" fg="rgba(22,25,28,.6)" onClick={dismissAlert}>나중에 확인</CtaButton>
        </div>
      </div>
    </>
  );
}

const dropStyle = {
  position: 'absolute' as const, top: 56, left: 14, right: 14, background: '#16191C', borderRadius: 26,
  padding: '16px 18px', animation: 'dropIn .35s ease both', zIndex: 7, boxShadow: '0 16px 36px rgba(0,0,0,.45)', color: '#fff',
};

const sheetStyle = {
  position: 'absolute' as const, left: 0, right: 0, bottom: 0, background: '#fff', borderRadius: '34px 34px 0 0',
  padding: '26px 24px 40px', boxShadow: '0 -16px 46px rgba(0,0,0,.35)', animation: 'slideUp .4s ease both', zIndex: 8, color: color.ink,
};
