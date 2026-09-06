import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';

import { color } from '../styles/theme';

/**
 * The "목표 금액을 모두 모았어요" celebration modal — shown on Home once salary
 * distribution brings a persona's goal to 100%. Ported from the doc's `sc-if
 * value="{{ goalComplete }}"` popup; "도착 티켓 보기" leads into ArrivedScreen.
 */
export function GoalCompleteOverlay() {
  const navigate = useNavigate();

  const dismissGoalComplete = useAppStore((s) => s.dismissGoalComplete);
  const { AP, plan } = useJourney();
  const G = {ticketGoal:plan.goal.name+' '+plan.goal.target.toLocaleString()+'원'};

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 60, background: 'rgba(var(--color-ink-rgb),.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 26, boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%', background: 'var(--im-white)', borderRadius: 34, padding: '30px 26px', textAlign: 'center',
          animation: 'popIn .34s cubic-bezier(.2,.9,.3,1.2) both', position: 'relative', overflow: 'hidden',
        }}
      >
        <img
          src="/assets/climb_logo.png" alt=""
          style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 230, height: 'auto', opacity: 0.09, pointerEvents: 'none' }}
        />
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-block', padding: '7px 15px', borderRadius: 9999, background: color.mint, color: color.ink, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em' }}>
            ARRIVED · 100%
          </div>
          <div style={{ margin: '14px auto 0', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 6 }}>
            <img src="/assets/dandi-cheer.png" alt="축하하는 단디" style={{ height: 112, width: 'auto', display: 'block', animation: 'hop 3.4s ease-in-out infinite', transformOrigin: 'bottom center' }} />
            <img src="/assets/ddokdi-cheer.png" alt="축하하는 똑디" style={{ height: 100, width: 'auto', display: 'block', animation: 'hop 3.4s ease-in-out .35s infinite', transformOrigin: 'bottom center' }} />
          </div>
          <div style={{ marginTop: 14, fontSize: 26, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.035em', lineHeight: 1.3 }}>목표 금액을<br />모두 모았어요</div>
          <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.65, fontWeight: 700, color: 'var(--color-60-text-secondary)' }}>{G.ticketGoal} · {AP.eta} 완주</div>
          <div
            onClick={() => { dismissGoalComplete(); navigate('/arrived'); }}
            style={{ minHeight: 'var(--btn-height-xl)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 20, height: 'var(--btn-height-xl)', borderRadius: 'var(--radius-lg)', background: 'var(--color-action-bg)', color: 'var(--color-action-text)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--component-gap)', cursor: 'pointer' }}
          >
            도착 티켓 보기
            <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</span>
          </div>
          <div onClick={dismissGoalComplete} style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: 'var(--color-60-text-secondary)', cursor: 'pointer' }}>
            나중에 보기
          </div>
        </div>
      </div>
    </div>
  );
}
