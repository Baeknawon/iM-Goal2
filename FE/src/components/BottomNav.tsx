import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { color } from '../styles/theme';
import type { EmptyTabKey } from '../types';

const navGroups: Record<string, string[]> = {
  home: ['home', 'detail', 'salary', 'empty', 'settings', 'arrived'],
  spend: ['spend', 'category', 'calendar'],
  alert: ['alerts', 'quiz', 'cause'],
  missions: ['missions', 'missionDetail', 'token', 'release', 'missionLive'],
  credit: ['mileage', 'products', 'support'],
};

type IconKey = 'home' | 'spend' | 'alert' | 'mission' | 'credit';

/**
 * 하단바 라인 아이콘 (SVG). 이모지/유니코드 심볼을 쓰지 않아 OS·폰트와 무관하게 동일하게 렌더된다.
 * `active`일 때 채움(fill)으로 전환해 색상만이 아니라 형태로도 선택 상태를 전달한다(접근성).
 */
function NavIcon({ name, active }: { name: IconKey; active: boolean }) {
  const stroke = 'currentColor';
  const fill = active ? 'currentColor' : 'none';
  const common = { width: 24, height: 24, viewBox: '0 0 24 24', 'aria-hidden': true as const, fill: 'none', stroke, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'home': // 집
      return (
        <svg {...common}>
          <path d="M4 10.5 12 4l8 6.5" />
          <path d="M6 9.5V20h12V9.5" fill={active ? 'currentColor' : 'none'} stroke={active ? 'none' : stroke} />
          <path d="M10 20v-5h4v5" stroke={active ? 'var(--color-60-bg-surface)' : stroke} fill="none" />
        </svg>
      );
    case 'spend': // 막대 차트
      return (
        <svg {...common}>
          <rect x="4" y="12" width="4" height="7" rx="1" fill={fill} />
          <rect x="10" y="8" width="4" height="11" rx="1" fill={fill} />
          <rect x="16" y="4" width="4" height="15" rx="1" fill={fill} />
        </svg>
      );
    case 'alert': // 종
      return (
        <svg {...common}>
          <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2.5h-15L6 16Z" fill={fill} stroke={active ? 'none' : stroke} />
          <path d="M10 19a2 2 0 0 0 4 0" />
        </svg>
      );
    case 'mission': // 깃발
      return (
        <svg {...common}>
          <path d="M6 3v18" />
          <path d="M6 4h11l-2.5 3.5L17 11H6" fill={fill} stroke={active ? 'none' : stroke} />
        </svg>
      );
    case 'credit': // 상승 그래프
      return (
        <svg {...common}>
          <path d="M4 19h16" />
          <path d="M5 15l4-4 3 3 6-7" />
          <path d="M18 7h-3M18 7v3" />
          {active && <circle cx="9" cy="11" r="1.6" fill="currentColor" stroke="none" />}
        </svg>
      );
  }
}

const navItems: { label: EmptyTabKey | '홈'; to: string; icon: IconKey; groupKey: string }[] = [
  { label: '홈', to: 'home', icon: 'home', groupKey: 'home' },
  { label: '소비분석', to: 'spend', icon: 'spend', groupKey: 'spend' },
  { label: '알림', to: 'alerts', icon: 'alert', groupKey: 'alert' },
  { label: '미션', to: 'missions', icon: 'mission', groupKey: 'missions' },
  { label: '신용', to: 'mileage', icon: 'credit', groupKey: 'credit' },
];

/** Screens where the bottom nav is shown at all (mirrors the doc's `navScreens`). */
export const navScreens = [
  'home', 'empty', 'emptyTab', 'spend', 'alerts', 'missions', 'mileage',
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const current = location.pathname.replace(/^\//, '');
  const hasGoal = useAppStore((s) => s.hasGoal);
  const setEmptyTab = useAppStore((s) => s.setEmptyTab);

  return (
      <div style={navBarStyle}>
        {navItems.map((nv) => {
          const on = navGroups[nv.groupKey].includes(current);
          return (
              <div
                  key={nv.to}
                  onClick={() => {
                    if (!hasGoal) {
                      if (nv.to === 'home') navigate('/empty');
                      else {
                        setEmptyTab(nv.label as EmptyTabKey);
                        navigate('/emptyTab');
                      }
                      return;
                    }
                    navigate('/' + nv.to);
                  }}
                  style={{ flex: 1, minWidth: 0, minHeight: 56, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 4, cursor: 'pointer' }}
              >
                <div
                    style={{
                      width: 44, height: 28, borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', transition: 'all .18s ease',
                      background: on ? color.mintTint : 'transparent',
                      color: on ? 'var(--color-accent-text)' : 'var(--color-60-text-secondary)',
                    }}
                >
                  <NavIcon name={nv.icon} active={on} />
                </div>
                <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', whiteSpace: 'nowrap', color: on ? 'var(--color-accent-text)' : 'var(--color-60-text-secondary)' }}>
              {nv.label}
            </span>
              </div>
          );
        })}
      </div>
  );
}

const navBarStyle: CSSProperties = {
  position: 'absolute', left: 16, right: 16, bottom: 28, height: 72, borderRadius: 'var(--radius-xl)',
  background: 'var(--color-60-bg-surface)', border: '1px solid var(--color-60-border)', boxShadow: 'var(--shadow-card)',
  display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 14px',
  boxSizing: 'border-box', zIndex: 6,
};
