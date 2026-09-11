import type { CSSProperties, ReactNode } from 'react';

/**
 * 앱 컨테이너. 두 가지 모드로 동작한다.
 *
 * 1) 기본(실사용/배포): iOS 디바이스 베젤 없이 뷰포트(100vw × 100dvh)를 꽉 채운다.
 *    실제 사용자의 휴대폰 화면에 그대로 붙도록 크롬을 그리지 않는다.
 *
 * 2) iOS 프레임 모드(발표·녹화용): 다이나믹 아일랜드 + 상태바 + 홈 인디케이터를 그린다.
 *    /present 의 iframe이 `?ios=1`로 앱을 로드하면 이 모드로 켜진다. 한 번 감지되면
 *    sessionStorage에 기억해 iframe 내부 라우팅이 바뀌어도 프레임이 유지된다.
 *
 * width/height props는 호출부 호환을 위해 남겨두되 사용하지 않는다.
 */
function iosFrameEnabled(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('ios') === '1') { sessionStorage.setItem('imgoal-ios-frame', '1'); return true; }
    if (sessionStorage.getItem('imgoal-ios-frame') === '1') return true;
    // /present 가 임베드한 iframe(발표·녹화용) 안이면 아이폰 프레임을 켠다.
    return window.self !== window.top;
  } catch {
    // 크로스오리진 등으로 top 접근이 막히면 iframe 안으로 간주 → 프레임 표시.
    return true;
  }
}

export function PhoneFrame({ children }: { children: ReactNode; width?: number; height?: number }) {
  const ios = iosFrameEnabled();

  if (!ios) {
    return (
      <div className="phone-frame" style={fullscreenStyle}>
        <div style={contentStyle}>{children}</div>
      </div>
    );
  }

  return (
    <div className="phone-frame phone-frame--ios" style={iosFrameStyle}>
      <div style={dynamicIslandStyle} />
      <div style={statusBarWrapStyle}><StatusBar /></div>
      <div style={contentStyle}>{children}</div>
      <div style={homeIndicatorWrapStyle}><div style={homeIndicatorStyle} /></div>
    </div>
  );
}

function StatusBar() {
  return (
    <div style={statusBarStyle}>
      <span style={timeStyle}>9:41</span>
      <div style={statusIconsStyle}>
        <svg width="19" height="12" viewBox="0 0 19 12">
          <rect x="0" y="7.5" width="3.2" height="4.5" rx="0.7" fill="var(--color-60-text-primary)" />
          <rect x="4.8" y="5" width="3.2" height="7" rx="0.7" fill="var(--color-60-text-primary)" />
          <rect x="9.6" y="2.5" width="3.2" height="9.5" rx="0.7" fill="var(--color-60-text-primary)" />
          <rect x="14.4" y="0" width="3.2" height="12" rx="0.7" fill="var(--color-60-text-primary)" />
        </svg>
        <svg width="17" height="12" viewBox="0 0 17 12">
          <path d="M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z" fill="var(--color-60-text-primary)" />
          <path d="M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z" fill="var(--color-60-text-primary)" />
          <circle cx="8.5" cy="10.5" r="1.5" fill="var(--color-60-text-primary)" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 27 13">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="var(--color-60-text-primary)" strokeOpacity="0.35" fill="none" />
          <rect x="2" y="2" width="20" height="9" rx="2" fill="var(--color-60-text-primary)" />
          <path d="M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z" fill="var(--color-60-text-primary)" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/* ── 기본(풀스크린) 모드 ── */
const fullscreenStyle: CSSProperties = {
  width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative',
  background: 'var(--color-60-bg-base)', fontFamily: 'var(--font-family-sans)', boxSizing: 'border-box',
};

/* ── iOS 프레임(발표·녹화) 모드 ── */
const iosFrameStyle: CSSProperties = {
  width: '100vw', height: '100dvh', overflow: 'hidden', position: 'relative',
  background: 'var(--color-60-bg-base)', fontFamily: 'var(--font-family-sans)', boxSizing: 'border-box',
};

const contentStyle: CSSProperties = { height: '100%', position: 'relative' };

const dynamicIslandStyle: CSSProperties = {
  position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
  width: 126, height: 37, borderRadius: 24, background: 'var(--color-60-text-primary)', zIndex: 50,
};

const statusBarWrapStyle: CSSProperties = { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 };

const statusBarStyle: CSSProperties = {
  display: 'flex', gap: 154, alignItems: 'center', justifyContent: 'center',
  padding: '21px 24px 19px', boxSizing: 'border-box', width: '100%',
};

const timeStyle: CSSProperties = {
  flex: 1, textAlign: 'center', fontFamily: '-apple-system,"SF Pro",system-ui',
  fontWeight: 590, fontSize: 17, color: 'var(--color-60-text-primary)',
};

const statusIconsStyle: CSSProperties = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 };

const homeIndicatorWrapStyle: CSSProperties = {
  position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 60,
  height: 34, display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
  paddingBottom: 8, pointerEvents: 'none',
};

const homeIndicatorStyle: CSSProperties = { width: 139, height: 5, borderRadius: 100, background: 'rgba(var(--color-ink-rgb),0.25)' };
