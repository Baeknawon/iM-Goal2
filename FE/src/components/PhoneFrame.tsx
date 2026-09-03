import type { CSSProperties, ReactNode } from 'react';

/**
 * iOS-style device bezel: dynamic island, status bar, home indicator.
 * Ported from the design doc's `ios-frame.jsx` starter, trimmed to what the
 * app screens actually use — each screen renders its own in-content header,
 * so this frame only supplies the outer chrome.
 */
export function PhoneFrame({ children, width = 402, height = 874 }: { children: ReactNode; width?: number; height?: number }) {
  return (
    <div style={{ ...frameStyle, width, height }}>
      <div style={dynamicIslandStyle} />
      <div style={statusBarWrapStyle}>
        <StatusBar />
      </div>
      <div style={contentStyle}>{children}</div>
      <div style={homeIndicatorWrapStyle}>
        <div style={homeIndicatorStyle} />
      </div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={statusBarStyle}>
      <span style={timeStyle}>9:41</span>
      <div style={statusIconsStyle}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="#000" />
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="#000" />
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="#000" />
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="#000" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="#000" />
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="#000" />
          <circle cx="8.5" cy="10.5" r="1.5" fill="#000" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="#000" strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill="#000" />
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="#000" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

const frameStyle: CSSProperties = {
  borderRadius: 48,
  overflow: 'hidden',
  position: 'relative',
  background: '#F2F2F7',
  boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
  fontFamily: "-apple-system, system-ui, sans-serif",
  flex: 'none',
};

const dynamicIslandStyle: CSSProperties = {
  position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
  width: 126, height: 37, borderRadius: 24, background: '#000', zIndex: 50,
};

const statusBarWrapStyle: CSSProperties = { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 };

const statusBarStyle: CSSProperties = {
  display: 'flex', gap: 154, alignItems: 'center', justifyContent: 'center',
  padding: '21px 24px 19px', boxSizing: 'border-box', width: '100%',
};

const timeStyle: CSSProperties = {
  flex: 1, textAlign: 'center', fontFamily: '-apple-system,"SF Pro",system-ui',
  fontWeight: 590, fontSize: 17, color: '#000',
};

const statusIconsStyle: CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 };

const contentStyle: CSSProperties = { height: '100%', position: 'relative' };

const homeIndicatorWrapStyle: CSSProperties = {
  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
  height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
  paddingBottom: 8, pointerEvents: 'none',
};

const homeIndicatorStyle: CSSProperties = { width: 139, height: 5, borderRadius: 100, background: 'rgba(0,0,0,0.25)' };
