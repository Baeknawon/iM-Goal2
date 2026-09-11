import { useState, useEffect, type CSSProperties } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 심사위원이 직접 데모를 실행할 때의 안내 오버레이 (모바일·데스크톱 공용).
 * - 평소: 화면 우하단에 작은 반투명 "?" 버튼만 떠 있어 실제 앱 느낌을 해치지 않는다.
 * - 탭: 하단 시트가 올라와 "지금 이 화면에서 할 일 + 전체 체험 순서(현재 위치 강조)"를 보여준다.
 * - 시트 밖(딤) 탭 또는 닫기로 닫으면 다시 앱으로 돌아간다.
 *
 * 폰 화면 위에 얹지만 평소엔 작은 버튼뿐이라 콘텐츠를 거의 가리지 않는다.
 * 기존 화면(tsx)은 건드리지 않으며, /present(발표 프레젠터)에서는 표시하지 않는다.
 */

/** 전체 체험 흐름(순서). */
const FLOW: { key: string; label: string }[] = [
  { key: 'start', label: '① 서비스 시작 — iM뱅크에서 CLiMB 배너 진입' },
  { key: 'mydata', label: '② 마이데이터 연결 — 동의·연결·소득 확인' },
  { key: 'goal', label: '③ 목표 설정 — AI 대화 → 리포트 → 발권' },
  { key: 'journey', label: '④ 여정 지도 — 3D 항로로 목표 진행 보기' },
  { key: 'risk', label: '⑤ 소비 감지 — 위험 트리거 → 알림·원인 분석' },
  { key: 'mission', label: '⑥ 회복 미션 — 추천·보증금·진행·판정' },
  { key: 'recover', label: '⑦ 회복·신용 — 회복 확인 · FCPS 점수' },
  { key: 'arrive', label: '⑧ 목표 도착 — 급여 분배 → 목표 달성' },
];

/** 현재 경로(route) → 한 줄 안내 + 현재 흐름 단계 key. */
function guideFor(path: string): { tip: string; step: string } {
  const p = path.replace(/^\//, '');
  const map: Record<string, { tip: string; step: string }> = {
    'picker': { step: 'start', tip: '체험할 상황(A·B·C)을 고르면 시작해요. 발표 데모는 A(자립준비청년) 기준이에요.' },
    'bank': { step: 'start', tip: 'iM뱅크 홈이에요. 상단/배너의 CLiMB를 눌러 서비스로 들어가세요.' },
    'consent': { step: 'mydata', tip: '마이데이터 동의 화면이에요. 동의하고 다음으로 진행하세요.' },
    'linking': { step: 'mydata', tip: '계좌를 연결하는 중이에요. 잠시 기다리면 다음으로 넘어가요.' },
    'connect': { step: 'mydata', tip: '연결 완료 화면이에요. 계속 진행하세요.' },
    'income': { step: 'mydata', tip: '소득·자산을 확인해요. 이 정보로 목표 계획을 세워요.' },
    'empty': { step: 'goal', tip: '아직 목표가 없는 홈이에요. "목적지 설정하러 가기"를 눌러 목표를 만들어요.' },
    'chat': { step: 'goal', tip: 'AI와 목표를 대화로 정해요. 보내기(↑)로 대화를 이어가고, 끝나면 리포트로 가요.' },
    'report': { step: 'goal', tip: '목표 리포트예요. 월 저축·하루 예산·도착 예정일을 확인하고 "이 계획으로 시작하기".' },
    'issuing': { step: 'goal', tip: '목표 티켓을 발급 중이에요. 곧 홈으로 이동해요.' },
    'home': { step: 'journey', tip: '홈이에요. "여정 상세 보기"로 항로를 보거나, 하단 위험 트리거로 소비 감지를 시연할 수 있어요.' },
    'detail': { step: 'journey', tip: '여정 상세예요. 3D 항로에서 지나온 경로·이탈·회복 지점을 확인하세요.' },
    'cause': { step: 'risk', tip: '이탈 원인 분석이에요. 어떤 소비가 늘었고 도착일에 어떤 영향인지 보고 "맞춤 미션 받기".' },
    'alerts': { step: 'risk', tip: '알림 내역이에요.' },
    'missionDetail': { step: 'mission', tip: '추천 미션이에요. 기간을 조정하고 "보증금 걸고 탑승하기" 또는 "보증금 없이 시작하기".' },
    'token': { step: 'mission', tip: '보증금 화면이에요. 추천 금액을 확인하고 시작하세요.' },
    'missionLive': { step: 'mission', tip: '미션 진행 화면이에요. 하단 "미션 리스트 보러가기"로 이동해 결과를 선택할 수 있어요.' },
    'missions': { step: 'mission', tip: '미션 리스트예요. 진행 중 미션에서 성공/실패/중단을 선택하면 결과가 반영돼요.' },
    'verify': { step: 'mission', tip: '판정 화면이에요. 결과를 확정하면 정산돼요.' },
    'release': { step: 'recover', tip: '결과·정산 화면이에요. 보증금 반환·FCPS 반영을 확인하고 "목표 경로와 다음 행동 보기".' },
    'recovery': { step: 'recover', tip: '회복 확인 상세예요. 행동 성공과 재무 회복(4주 유지)을 구분해 확인해요.' },
    'mileage': { step: 'recover', tip: '리워드·마일리지 기록이에요.' },
    'fcps': { step: 'recover', tip: 'FCPS 점수 상세예요. 어떤 행동으로 점수가 쌓였는지 확인하세요.' },
    'accounts': { step: 'arrive', tip: '계좌 현황이에요. "급여 분배 설정"으로 이동할 수 있어요.' },
    'splitSettings': { step: 'arrive', tip: '급여 분배 비율을 조정하고 저장하세요.' },
    'salary': { step: 'arrive', tip: '급여 분배 확인이에요. "이 분배를 기록에 반영하기"를 누르면 목표가 달성돼요.' },
    'arrived': { step: 'arrive', tip: '목표 도착! 최종 보딩패스를 확인하세요.' },
  };
  return map[p] ?? { step: '', tip: '왼쪽 상황 바꾸기로 처음부터 다시 체험할 수 있어요.' };
}

export function DemoGuide() {
  const location = useLocation();
  const [open, setOpen] = useState(false);   // 하단 시트 열림 여부
  const [seen, setSeen] = useState(false);    // 한 번이라도 열어봤는지(열면 강조 애니메이션 중단)
  // 앱 최초 진입 시 버튼 위에 잠깐 뜨는 안내 말풍선. 열어보거나 일정 시간이 지나면 사라진다.
  const [hint, setHint] = useState(true);

  // 말풍선은 최초 진입 후 잠깐만 노출한다(약 8초).
  useEffect(() => {
    if (!hint) return;
    const t = window.setTimeout(() => setHint(false), 8000);
    return () => window.clearTimeout(t);
  }, [hint]);

  // 프레젠터 화면에서는 가이드를 띄우지 않는다.
  if (location.pathname.startsWith('/present')) return null;

  const { tip, step } = guideFor(location.pathname);
  const openSheet = () => { setOpen(true); setSeen(true); setHint(false); };

  return (
    <>
      {/* 최초 진입 안내 말풍선: 버튼 위에 잠깐 떠서 "이게 가이드"임을 알려준다. */}
      {!open && hint && !seen && (
        <div style={hintBubbleStyle} onClick={openSheet}>
          체험 가이드예요
          <br />
          <span style={hintBubbleSubStyle}>불빛이 들어오면 눌러 확인해보세요</span>
          <span style={hintTailStyle} />
        </div>
      )}

      {/* 평소: 라벨 있는 안내 버튼. 아직 안 열어봤으면 맥박(ringPulse)으로 주목을 끈다. */}
      {!open && (
        <button
          type="button"
          onClick={openSheet}
          style={{ ...fabStyle, ...(seen ? null : fabPulseStyle) }}
          aria-label="체험 가이드 열기"
        >
          <span style={fabDotStyle} />
          체험 가이드
        </button>
      )}

      {/* 탭 시: 딤 배경 + 하단 시트 */}
      {open && (
        <div style={dimStyle} onClick={() => setOpen(false)}>
          <div style={sheetStyle} onClick={(e) => e.stopPropagation()}>
            <div style={grabberStyle} />
            <div style={sheetHeadRowStyle}>
              <span style={sheetEyebrowStyle}>지금 이 화면</span>
              <button type="button" onClick={() => setOpen(false)} style={sheetCloseStyle} aria-label="닫기">×</button>
            </div>
            <div style={tipStyle}>{tip}</div>

            <div style={{ ...sheetEyebrowStyle, marginTop: 20 }}>전체 체험 순서</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
              {FLOW.map((f) => (
                <div key={f.key} style={flowItemStyle(f.key === step)}>{f.label}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── styles ──────────────────────────────────────────────
const fabStyle: CSSProperties = {
  position: 'fixed', right: 14, bottom: 16, zIndex: 120,
  display: 'flex', alignItems: 'center', gap: 7, padding: '10px 16px 10px 13px',
  borderRadius: 9999, border: '2px solid transparent', cursor: 'pointer',
  background: 'var(--color-hero, #0A8873)', color: '#fff', fontSize: 13.5, fontWeight: 700,
  boxShadow: '0 6px 18px rgba(0,0,0,.3)',
};
/** 아직 안 열어봤을 때만 적용하는 맥박 강조(주목 유도). 링(ringPulse) + 테두리(guideBorderBlink)를 함께 깜빡인다. */
const fabPulseStyle: CSSProperties = { animation: 'ringPulse 1.5s infinite, guideBorderBlink 1.5s infinite' };
/** 최초 진입 안내 말풍선. 버튼 바로 위에 뜬다(꼬리는 아래·오른쪽을 향함). */
const hintBubbleStyle: CSSProperties = {
  position: 'fixed', right: 14, bottom: 64, zIndex: 121, cursor: 'pointer',
  maxWidth: 220, padding: '10px 13px', borderRadius: 14,
  background: 'rgba(14,17,19,.92)', color: '#fff', fontSize: 13, fontWeight: 700,
  lineHeight: 1.45, textAlign: 'left', boxShadow: '0 8px 22px rgba(0,0,0,.32)',
  animation: 'fadeUp .4s ease both',
};
const hintBubbleSubStyle: CSSProperties = { fontSize: 11.5, fontWeight: 500, opacity: 0.8 };
/** 말풍선 꼬리(아래를 향하는 삼각형). 버튼 쪽으로 붙도록 오른쪽에 배치. */
const hintTailStyle: CSSProperties = {
  position: 'absolute', right: 20, bottom: -6, width: 12, height: 12,
  background: 'rgba(14,17,19,.92)', transform: 'rotate(45deg)',
};
/** 버튼 앞의 깜빡이는 점(살아있는 안내라는 신호). */
const fabDotStyle: CSSProperties = {
  width: 8, height: 8, borderRadius: '50%', background: 'var(--im-mint, #3FD3B0)',
  animation: 'ringPulse 1.5s infinite',
};
const dimStyle: CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 130, background: 'rgba(0,0,0,.4)',
  display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  fontFamily: 'var(--font-family-sans, sans-serif)',
};
const sheetStyle: CSSProperties = {
  width: '100%', maxWidth: 460, maxHeight: '80vh', overflow: 'auto',
  background: '#fff', color: '#16191C', borderRadius: '20px 20px 0 0',
  padding: '10px 22px 28px', boxShadow: '0 -12px 40px rgba(0,0,0,.35)',
  animation: 'slideUp .28s ease both',
};
const grabberStyle: CSSProperties = { width: 44, height: 5, borderRadius: 9999, background: 'rgba(22,25,28,.18)', margin: '4px auto 14px' };
const sheetHeadRowStyle: CSSProperties = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const sheetEyebrowStyle: CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: '.06em', color: '#0A8873' };
const sheetCloseStyle: CSSProperties = { width: 30, height: 30, borderRadius: '50%', border: 'none', background: 'rgba(22,25,28,.06)', color: '#16191C', fontSize: 17, cursor: 'pointer' };
const tipStyle: CSSProperties = { marginTop: 8, fontSize: 15.5, fontWeight: 600, lineHeight: 1.55 };
const flowItemStyle = (activeItem: boolean): CSSProperties => ({
  padding: '9px 13px', borderRadius: 10, fontSize: 13.5, fontWeight: activeItem ? 700 : 500,
  background: activeItem ? 'rgba(10,136,115,.1)' : 'rgba(22,25,28,.03)',
  color: activeItem ? '#0A8873' : 'rgba(22,25,28,.6)',
  border: activeItem ? '1px solid rgba(10,136,115,.4)' : '1px solid transparent',
});
