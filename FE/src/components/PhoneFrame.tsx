import type { CSSProperties, ReactNode } from 'react';

/**
 * 배포/실사용 모드용 앱 컨테이너.
 * 예전에는 iOS 디바이스 베젤(다이나믹 아일랜드·상태바·홈 인디케이터)을 그렸지만,
 * 실제 사용자의 휴대폰 화면에 그대로 꽉 차게 띄우기 위해 크롬을 모두 제거하고
 * 뷰포트(100vw × 100dvh)를 채우는 단순 컨테이너로 동작한다.
 * 각 화면은 자체 인앱 헤더를 렌더하므로 이 컨테이너는 배경·safe-area만 담당한다.
 *
 * width/height props는 호출부 호환을 위해 남겨두되 사용하지 않는다(항상 풀스크린).
 */
export function PhoneFrame({ children }: { children: ReactNode; width?: number; height?: number }) {
  return (
    <div className="phone-frame" style={frameStyle}>
      <div style={contentStyle}>{children}</div>
    </div>
  );
}

const frameStyle: CSSProperties = {
  width: '100vw',
  height: '100dvh',
  overflow: 'hidden',
  position: 'relative',
  background: 'var(--color-60-bg-base)',
  fontFamily: 'var(--font-family-sans)',
  // 노치/상태바 영역만큼 아래로 밀어 콘텐츠가 시스템 UI와 겹치지 않게 한다.
  paddingTop: 'env(safe-area-inset-top)',
  boxSizing: 'border-box',
};

const contentStyle: CSSProperties = { height: '100%', position: 'relative' };
