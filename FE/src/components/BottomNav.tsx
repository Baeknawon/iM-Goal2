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

const navItems: { label: EmptyTabKey | '홈'; to: string; icon: string; groupKey: string }[] = [
  { label: '홈', to: 'home', icon: '✈', groupKey: 'home' },
  { label: '소비분석', to: 'spend', icon: '▥', groupKey: 'spend' },
  { label: '알림', to: 'alerts', icon: '◍', groupKey: 'alert' },
  { label: '미션', to: 'missions', icon: '⚿', groupKey: 'missions' },
  { label: '신용', to: 'mileage', icon: '◆', groupKey: 'credit' },
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

  const supportScreen = current === 'support';

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
                      width: 40, height: 28, borderRadius: 'var(--radius-pill)', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: 14, fontWeight: 'var(--font-weight-semibold)', transition: 'all .18s ease',
                      background: on ? color.mintTint : supportScreen ? 'rgba(var(--color-ink-rgb),.10)' : 'transparent',
                      color: on ? color.ink : supportScreen ? 'var(--color-60-text-secondary)' : 'var(--color-60-text-secondary)',
                    }}
                >
                  {nv.icon}
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
