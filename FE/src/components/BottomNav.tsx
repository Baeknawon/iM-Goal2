import type { CSSProperties } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { color } from '../styles/theme';
import type { EmptyTabKey } from '../types';

const navGroups: Record<string, string[]> = {
  home: ['home', 'detail', 'salary', 'empty', 'settings', 'arrived'],
  spend: ['spend', 'category', 'calendar'],
  alert: ['alerts', 'quiz', 'cause', 'verify'],
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
  'home', 'detail', 'empty', 'emptyTab', 'spend', 'category', 'calendar',
  'missionDetail', 'cause', 'verify', 'token', 'release', 'mileage', 'products', 'salary',
  'alerts', 'quiz', 'missions', 'missionLive',
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
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer' }}
          >
            <div
              style={{
                width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 14, fontWeight: 900, transition: 'all .18s ease',
                background: on ? color.mint : supportScreen ? 'rgba(43,11,3,.10)' : 'rgba(22,25,28,.12)',
                color: on ? color.ink : supportScreen ? 'rgba(43,11,3,.55)' : 'rgba(22,25,28,.6)',
              }}
            >
              {nv.icon}
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 900, whiteSpace: 'nowrap', color: on ? '#077264' : 'rgba(22,25,28,.55)' }}>
              {nv.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const navBarStyle: CSSProperties = {
  position: 'absolute', left: 18, right: 18, bottom: 22, height: 74, borderRadius: 9999,
  background: '#FFFFFF', border: '1px solid rgba(22,25,28,.09)', boxShadow: '0 8px 26px rgba(22,25,28,.13)',
  display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 14px',
  boxSizing: 'border-box', zIndex: 6,
};
