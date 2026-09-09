import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { alertDefs } from '../data/personas';
import { useJourney } from '../viewmodel/useJourney';
import { phase1Start } from '../data/ucDefs';
import { CtaButton } from './ui';
import { color } from '../styles/theme';

/**
 * A compact push banner that opens transaction details and next actions.
 * Shown on Home when
 * `alertOn` is true — ported from the doc's `sc-if value="{{ alertOn }}"` block.
 */
export function AlertOverlay() {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const dismissAlert = useAppStore((s) => s.dismissAlert);
  const AL = alertDefs[persona];
  const { AP, plan } = useJourney();

  // 하루 예산·오늘 지출은 financePlan 단일 소스를 사용 (홈 화면과 동일 기준).
  const alertHead = persona === 'A'
      ? `오늘 예산을 ${Math.max(0, plan.today - plan.dailyBudget).toLocaleString('en-US')}원 초과했어요`
      : AL.headFallback;

  return (
      <>
        <div className="trigger-notification">
          <button type="button" className="trigger-notification-content" onClick={() => setExpanded(true)} aria-expanded={expanded} aria-controls="trigger-alert-details">
            <span className="trigger-notification-meta">
              <span className="trigger-notification-app-icon"><img src="/assets/climb_logo.png" alt="" /></span>
              <span>climb</span>
              <span className="trigger-notification-time">지금</span>
            </span>
            <span role="status" className="trigger-notification-message">
              <strong>{alertHead}</strong>
              <span>{plan.delayDays > 0 ? `도착 예정일이 ${AP.eta} → ${AP.etaDelayed}로 지연` : `현재 예측 도착일 ${AP.etaFast}`}</span>
            </span>
          </button>
          <button type="button" className="trigger-notification-close" aria-label="알림 닫기" onClick={dismissAlert}>×</button>
        </div>

        {expanded && <div id="trigger-alert-details" style={sheetStyle}>
          <div style={{ width: 44, height: 5, borderRadius: 9999, background: 'var(--color-30-surface-sub)', margin: '0 auto 20px' }} />
          <div style={{ marginBottom: 12, fontSize: 13, fontWeight: 600, color: color.coral }}>{AL.tag}</div>
          {/* 핵심만: 거래 한 줄 + 미션 받기 버튼 (상세는 다음 화면에서) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: AL.iconBg, color: AL.iconFg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'var(--font-weight-bold)' }}>
              {AL.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 17, fontWeight: 'var(--font-weight-bold)' }}>{AL.txnName}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{AL.txnSub}</div>
            </div>
            <div style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 20, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>{AL.txnAmt}</div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
            <div
                onClick={() => { dismissAlert(); navigate(`/uc/${phase1Start[persona]}`); }}
                style={{ borderRadius: 30, background: 'var(--color-hero)', color: 'var(--im-white)', padding: '18px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 17, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>원인 보고 미션 받기</div>
                <div style={{ marginTop: 3, fontSize: 12.5, fontWeight: 700, color: 'var(--color-text-on-dark-muted)' }}>AI가 원인을 분석해 회복 미션을 만들어드려요</div>
              </div>
              <div style={{ flex: 'none', width: 34, height: 34, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 'var(--font-weight-bold)' }}>›</div>
            </div>
            <CtaButton height={50} bg="rgba(var(--color-ink-rgb),.06)" fg="var(--color-60-text-secondary)" onClick={dismissAlert}>나중에 확인</CtaButton>
          </div>
        </div>}
      </>
  );
}

const sheetStyle = {
  position: 'absolute' as const, left: 0, right: 0, bottom: 0, background: 'var(--im-white)', borderRadius: '34px 34px 0 0',
  padding: '26px 24px 40px', boxShadow: '0 -16px 46px rgba(var(--color-ink-rgb),.35)', animation: 'slideUp .4s ease both', zIndex: 8, color: color.ink,
};
