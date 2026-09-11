import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { useAppStore } from '../store/appStore';
import type { PersonaKey } from '../types';

/**
 * 발표용 프레젠테이션 셸 (/present).
 *
 * - 왼쪽: 기능 플로우 메뉴(그룹 제목 + 세부 화면). 화면 항목을 누르면 그 화면 하나로 정확히 이동하고,
 *   필요한 상태 셋업(페르소나·트리거·미션 등)을 실행한다. 자동 재생 없이 진행자가 직접 넘긴다.
 * - 오른쪽(가운데): 실제 앱을 iframe으로 임베드한 휴대폰 화면(데모와 같은 사이즈) + 위/아래 스크롤 버튼.
 * - 트리거·상황 스위처·미션 판정 버튼 등 데모용 UI는 iframe에 JS/CSS를 주입해 숨겨, 실제 서비스처럼 보이게 한다.
 *
 * 기존 화면 컴포넌트(screens/*.tsx)는 수정하지 않는다. 제어는 main.tsx가 노출한
 * window.__imGoalStore(zustand store)와 iframe URL로만 이뤄진다.
 */

type StoreApi = typeof useAppStore;
const PERSONA: PersonaKey = 'A';

interface Sub {
  label: string;
  route: string;
  setup?: (store: StoreApi) => void;
}
interface Group {
  title: string;
  subs: Sub[];
}

/** 후반 상태 목표 저축(여정 상세 진행률 복원용). finance.goalSavedLatePhase와 동일. */
const GOAL_LATE: Record<PersonaKey, number> = { A: 29200000, B: 10600000, C: 5620000 };
/** 첫 홈·첫 여정 상세의 진행률(경로 길이). 목표를 막 세운 초반이라 낮게 잡아 경로가 짧게 보인다. */
const GOAL_EARLY: Record<PersonaKey, number> = {
  A: Math.round(30000000 * 0.34),
  B: Math.round(12360000 * 0.34),
  C: Math.round(6000000 * 0.34),
};

/**
 * "미션·이탈 이력이 아직 없는 깨끗한 상태"로 만든다.
 * 진행률을 초반(낮게)으로 → 첫 홈/첫 여정 상세의 경로가 짧고, 미션 성공 스팟이 보이지 않는다.
 */
const clearJourney = (s: StoreApi) => {
  const st = s.getState();
  s.setState({
    fcpsLog: [], missionOn: false, missionResult: null, alertOn: false, recovered: false, fueled: false,
    goal: { ...st.goal, saved: GOAL_EARLY[PERSONA] },
  });
};

/**
 * "미션 이후" 여정 이력을 데모용으로 채운다 — 첫 여정 상세(스팟 0·짧은 경로)와 확실히 대비되도록
 * 이탈 → 미션 실패 → 회복 미션 성공 이력을 쌓고 진행률을 후반(높게)으로 만들어 경로가 길고 스팟이 늘어난다.
 */
const seedPostMissionJourney = (s: StoreApi) => {
  const st = s.getState();
  st.finishGoal();
  const at = (d: string) => `2026-07-${d}T00:00:00.000Z`;
  const mk = (o: Record<string, unknown>) => ({
    missionSnapshot: undefined, recoveryPlan: undefined, startedAt: null, deposit: 30000, ...o,
  });
  const log = [
    mk({ result: 'success', label: '회복 미션 성공', mission: '배달 주문을 주 1회로 줄이기', completedAt: at('28'), delta: 18,
      recovery: { baseline: { persona: 'A', label: '주당 배달 지출', value: 91000, unit: '원', lowerBetter: true, source: '데모' }, completedAt: at('28'), status: 'confirmed', observations: [] } }),
    mk({ result: 'fail', failureReason: 'difficulty', label: '회복 미션 실패', mission: '배달 주문을 주 2회로 줄이기', completedAt: at('20'), delta: -8 }),
  ];
  s.setState({ fcpsLog: log as never, missionOn: false, missionResult: 'success', alertOn: false, recovered: true,
    goal: { ...st.goal, saved: Math.min(st.goal.target, GOAL_LATE[PERSONA]) } });
};

const GROUPS: Group[] = [
  {
    title: '서비스 시작',
    subs: [
      { label: 'iM뱅크 · CLiMB 배너', route: '/bank', setup: (s) => { s.getState().setPersona(PERSONA); } },
      { label: '마이데이터 동의', route: '/consent' },
    ],
  },
  {
    title: '마이데이터 연결',
    subs: [
      { label: '연결 중', route: '/linking' },
      { label: '연결 완료', route: '/connect' },
      { label: '소득 확인', route: '/income' },
    ],
  },
  {
    title: '나만의 목표 설정',
    subs: [
      { label: '빈 홈', route: '/empty' },
      { label: 'AI 목표 대화', route: '/chat' },
      { label: '목표 리포트', route: '/report', setup: (s) => { s.getState().beginGoalPlan(); } },
      { label: '티켓 발급', route: '/issuing' },
      { label: '첫 홈 화면', route: '/home', setup: clearJourney },
    ],
  },
  {
    title: '여정 상세',
    subs: [
      { label: '3D 여정 지도 (초기)', route: '/detail', setup: clearJourney },
    ],
  },
  {
    title: '소비 감지',
    subs: [
      { label: '정상 홈', route: '/home', setup: (s) => { s.getState().finishGoal(); s.getState().dismissAlert(); } },
      { label: '위험 감지 (알림)', route: '/home', setup: (s) => { s.getState().finishGoal(); s.getState().triggerPersonaAlert(PERSONA); } },
    ],
  },
  {
    title: '미션과 보증금',
    subs: [
      { label: '감지·원인 분석', route: '/cause', setup: (s) => { s.getState().finishGoal(); s.getState().triggerPersonaAlert(PERSONA); } },
      { label: '미션 상세', route: '/missionDetail', setup: (s) => { s.getState().finishGoal(); } },
      { label: '보증금 결정', route: '/token' },
      { label: '미션 진행', route: '/missionLive', setup: (s) => { if (!s.getState().missionOn) s.getState().startMission(s.getState().deposit); } },
      { label: '미션 리스트', route: '/missions' },
    ],
  },
  {
    title: '미션 성공',
    subs: [
      { label: '성공 · 보증금 반환', route: '/release', setup: (s) => { const st = s.getState(); if (st.missionResult === null) { if (!st.missionOn) st.startMission(st.deposit); st.finishMission('success'); } } },
      { label: '반환 후 여정 상세', route: '/detail', setup: seedPostMissionJourney },
    ],
  },
  {
    title: '회복 경과',
    subs: [
      { label: '회복 확인 상세', route: '/recovery' },
    ],
  },
  {
    title: '신용 점수',
    subs: [
      { label: '마일리지', route: '/mileage' },
      { label: 'FCPS 상세', route: '/fcps' },
    ],
  },
  {
    title: '급여 분배',
    subs: [
      { label: '홈 · 급여 알림', route: '/home', setup: (s) => { const st = s.getState(); st.setFueled(false); st.dismissAlert(); } },
      { label: '계좌 현황', route: '/accounts' },
      { label: '분배 설정', route: '/splitSettings' },
    ],
  },
  {
    title: '목표 도착',
    subs: [
      { label: '급여 분배 확인', route: '/salary' },
      { label: '분배 반영 · 목표 달성', route: '/home', setup: (s) => { s.getState().setFueled(true); } },
      { label: '달성 보딩패스', route: '/arrived' },
    ],
  },
];

/** 평탄화된 전체 서브스텝(그룹 인덱스 포함). */
const FLAT: { g: number; s: number; sub: Sub }[] = GROUPS.flatMap((g, gi) => g.subs.map((sub, si) => ({ g: gi, s: si, sub })));

/** iframe 데모용 UI 숨김 CSS(구조 기반: 상황 스위처). */
const HIDE_DEMO_UI_CSS = `
[class*="app-stage"] > div > div[style*="translateX(-50%)"][style*="bottom"] { display: none !important; }
`;

/** 텍스트로 식별해 숨길 데모용 요소 문구(tsx 무수정). */
const HIDE_TEXTS = [
  '발생시키기',
  '실제 상황처럼',
  '회복 미션 성공 확인',
  '미션 성공',
  '미션 결과를 선택',
  '상황 바꾸기',
];

export function PresenterScreen() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [flat, setFlat] = useState(0);
  const [ready, setReady] = useState(false);
  const [chatHint, setChatHint] = useState('');   // AI 목표 대화에서 "지금 쳐야 할 문구"
  const hideTimerRef = useRef<number | null>(null);
  const chatTimerRef = useRef<number | null>(null);

  const goto = (index: number) => {
    const clamped = Math.max(0, Math.min(FLAT.length - 1, index));
    setFlat(clamped);
    applySub(clamped);
  };

  const applySub = (index: number) => {
    const { sub } = FLAT[index];
    const win = iframeRef.current?.contentWindow as (Window & { __imGoalStore?: StoreApi }) | undefined;
    if (!win) return;
    try {
      const store = win.__imGoalStore;
      if (store && sub.setup) sub.setup(store);
      win.history.pushState({}, '', sub.route);
      win.dispatchEvent(new PopStateEvent('popstate'));
      hideDemoUi(win);
      scheduleHide(win);
    } catch {
      if (iframeRef.current) iframeRef.current.src = sub.route;
    }
  };

  const hideDemoUi = (win: Window) => {
    try {
      const doc = win.document;
      let el = doc.getElementById('present-hide-style') as HTMLStyleElement | null;
      if (!el) { el = doc.createElement('style'); el.id = 'present-hide-style'; doc.head.appendChild(el); }
      el.textContent = HIDE_DEMO_UI_CSS;
      const all = Array.from(doc.querySelectorAll('div,button,span,p')) as HTMLElement[];
      for (const node of all) {
        const txt = (node.textContent || '').trim();
        if (!txt) continue;
        if (HIDE_TEXTS.some((t) => txt.includes(t)) && txt.length < 40) {
          node.style.setProperty('display', 'none', 'important');
        }
      }
    } catch { /* noop */ }
  };

  const scheduleHide = (win: Window) => {
    if (hideTimerRef.current) window.clearInterval(hideTimerRef.current);
    let n = 0;
    hideTimerRef.current = window.setInterval(() => {
      hideDemoUi(win);
      if (++n >= 8) { if (hideTimerRef.current) window.clearInterval(hideTimerRef.current); }
    }, 300);
  };

  const handleLoad = () => { setReady(true); applySub(flat); };

  // AI 목표 대화: 사용자 차례 "보내기"를 눌러 한 턴씩 진행(끝나면 CTA).
  const advanceChat = () => {
    const win = iframeRef.current?.contentWindow;
    try {
      const send = win?.document.querySelector('[aria-label="보내기"]') as HTMLElement | null;
      if (send) { send.click(); return; }
      const cta = win?.document.querySelector('.app-screen div[style*="action-bg"]') as HTMLElement | null;
      if (cta) cta.click();
    } catch { /* noop */ }
  };

  // 모든 화면 공용: 스크롤되는 컨테이너를 찾아 위/아래로 이동.
  const scrollPhone = (dir: 1 | -1) => {
    const win = iframeRef.current?.contentWindow;
    try {
      const doc = win?.document;
      if (!doc) return;
      const candidates = Array.from(doc.querySelectorAll('div')) as HTMLElement[];
      let target: HTMLElement | null = null;
      let best = 0;
      for (const el of candidates) {
        const style = win!.getComputedStyle(el);
        const scrollable = /(auto|scroll)/.test(style.overflowY);
        const overflow = el.scrollHeight - el.clientHeight;
        if (scrollable && overflow > 8 && el.clientHeight > best) { best = el.clientHeight; target = el; }
      }
      const el = target ?? (doc.scrollingElement as HTMLElement | null);
      if (el) el.scrollBy({ top: dir * Math.max(200, el.clientHeight * 0.6), behavior: 'smooth' });
    } catch { /* noop */ }
  };

  const isChat = FLAT[flat].sub.route === '/chat';

  // AI 목표 대화 화면에서:
  //  1) 입력창에 미리 채워진 placeholder(예시문)를 지워 진짜 빈 입력창으로 만든다.
  //  2) 그 예시문을 오른쪽 가이드(chatHint)로 옮겨 "지금 이렇게 입력하세요"를 안내한다.
  useEffect(() => {
    if (chatTimerRef.current) window.clearInterval(chatTimerRef.current);
    if (!isChat) { setChatHint(''); return; }
    chatTimerRef.current = window.setInterval(() => {
      const win = iframeRef.current?.contentWindow;
      try {
        const input = win?.document.querySelector('.app-screen input') as HTMLInputElement | null;
        // 입력창 자체가 없으면(= AI 발화 중, 사용자 차례 아님) 가이드 비움.
        if (!input) { setChatHint(''); return; }
        // 예시 placeholder가 남아 있으면: 가이드로 기억해두고 입력창에서는 지운다(빈 입력창).
        const ph = input.getAttribute('placeholder') || '';
        if (ph) { setChatHint(ph); input.setAttribute('placeholder', ''); }
        // placeholder를 이미 지운 뒤에도 입력창이 살아 있는 동안엔 가이드를 유지한다(비우지 않음).
      } catch { /* noop */ }
    }, 300);
    return () => { if (chatTimerRef.current) window.clearInterval(chatTimerRef.current); };
  }, [isChat, flat]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goto(flat + 1);
      if (e.key === 'ArrowLeft') goto(flat - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [flat]);

  return (
    <div style={stageStyle}>
      {/* 왼쪽: 브랜드 + 기능 플로우 메뉴 (그룹 + 세부 화면) */}
      <div style={leftStyle}>
        <div style={brandRowStyle}>
          <span style={brandStyle}>CLiMB</span>
          <span style={brandDivStyle}>|</span>
          <span style={brandSubStyle}>시연영상</span>
        </div>
        <nav style={navListStyle}>
          {GROUPS.map((g, gi) => (
            <div key={g.title} style={{ marginBottom: 14 }}>
              <div style={groupTitleStyle}>{g.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6 }}>
                {g.subs.map((sub, si) => {
                  const idx = FLAT.findIndex((f) => f.g === gi && f.s === si);
                  const activeItem = idx === flat;
                  return (
                    <button key={sub.route + si} type="button" onClick={() => goto(idx)} style={subItemStyle(activeItem)}>
                      {sub.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        {isChat && (
          <button type="button" style={chatAdvanceStyle} onClick={advanceChat}>▷ 대화 이어가기</button>
        )}
        <div style={controlRowStyle}>
          <button type="button" style={ctrlBtnStyle} onClick={() => goto(flat - 1)} disabled={flat === 0}>← 이전</button>
          <button type="button" style={ctrlBtnStyle} onClick={() => goto(flat + 1)} disabled={flat === FLAT.length - 1}>다음 →</button>
        </div>
      </div>

      {/* 오른쪽: 휴대폰 + 스크롤 버튼 */}
      <div style={centerStyle}>
        {/* 폰은 항상 중앙 고정. 오른쪽 컬럼은 폰 기준 absolute라 가이드가 떠도 폰이 밀리지 않는다. */}
        <div style={phoneAnchorStyle}>
          <div style={phoneWrapStyle}>
            <iframe ref={iframeRef} title="iM-Goal 데모" src="/bank" onLoad={handleLoad} style={iframeStyle} />
            {!ready && <div style={loadingStyle}>화면을 불러오는 중…</div>}
          </div>
          <div style={rightColStyle}>
            <div style={scrollColStyle}>
              <button type="button" style={scrollBtnStyle} onClick={() => scrollPhone(-1)} aria-label="위로 스크롤">▲</button>
              <button type="button" style={scrollBtnStyle} onClick={() => scrollPhone(1)} aria-label="아래로 스크롤">▼</button>
            </div>
            {isChat && chatHint && (
              <div style={hintCardStyle}>
                <div style={hintLabelStyle}>이렇게 입력하세요</div>
                <div style={hintTextStyle}>{chatHint}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── styles ──────────────────────────────────────────────
const PHONE_W = 402;
const PHONE_H = 874;

const stageStyle: CSSProperties = { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', background: '#000', color: '#fff', fontFamily: 'var(--font-family-sans, sans-serif)' };

const leftStyle: CSSProperties = { width: 340, flex: 'none', padding: '40px 40px', display: 'flex', flexDirection: 'column', gap: 24, height: '100%', boxSizing: 'border-box' };
const brandRowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flex: 'none' };
const brandStyle: CSSProperties = { fontSize: 20, fontWeight: 800, letterSpacing: '-.01em', color: '#fff' };
const brandDivStyle: CSSProperties = { fontSize: 16, color: 'rgba(255,255,255,.4)' };
const brandSubStyle: CSSProperties = { fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,.85)' };
const navListStyle: CSSProperties = { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'auto', minHeight: 0 };
const groupTitleStyle: CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: '.08em', color: '#3FD3B0' };
const subItemStyle = (activeItem: boolean): CSSProperties => ({
  textAlign: 'left', width: '100%', padding: '7px 12px', borderRadius: 9, cursor: 'pointer',
  border: '1px solid transparent',
  background: activeItem ? 'rgba(63,211,176,.16)' : 'transparent',
  borderColor: activeItem ? 'rgba(63,211,176,.5)' : 'transparent',
  color: activeItem ? '#fff' : 'rgba(255,255,255,.55)',
  fontSize: 14, fontWeight: 600, letterSpacing: '-.01em', transition: 'all .15s ease',
});
const controlRowStyle: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, flex: 'none' };
const ctrlBtnStyle: CSSProperties = { flex: 1, height: 42, borderRadius: 10, border: '1px solid rgba(255,255,255,.2)', background: 'transparent', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' };
const chatAdvanceStyle: CSSProperties = { flex: 'none', height: 44, borderRadius: 10, border: 'none', background: '#3FD3B0', color: '#04201A', fontSize: 14, fontWeight: 800, cursor: 'pointer', marginBottom: 4 };

const centerStyle: CSSProperties = { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' };
// 폰 크기만큼의 앵커. 오른쪽 컬럼을 이 앵커 기준 absolute로 붙여 폰 위치가 고정되게 한다.
const phoneAnchorStyle: CSSProperties = { position: 'relative', height: 'min(96vh, 874px)', aspectRatio: `${PHONE_W} / ${PHONE_H}` };
// 폰 오른쪽 바깥에 절대 배치 → 가이드 카드가 생겨도 폰 위치에 영향 없음.
const rightColStyle: CSSProperties = { position: 'absolute', left: '100%', top: 0, marginLeft: 20, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, width: 240 };
const scrollColStyle: CSSProperties = { display: 'flex', flexDirection: 'column', gap: 12 };
const hintCardStyle: CSSProperties = { background: 'rgba(63,211,176,.12)', border: '1px solid rgba(63,211,176,.4)', borderRadius: 14, padding: '14px 16px', maxWidth: 240 };
const hintLabelStyle: CSSProperties = { fontSize: 12, fontWeight: 800, letterSpacing: '.04em', color: '#3FD3B0' };
const hintTextStyle: CSSProperties = { marginTop: 8, fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: '#fff' };
const scrollBtnStyle: CSSProperties = { width: 48, height: 48, borderRadius: '50%', border: '1px solid rgba(255,255,255,.22)', background: 'rgba(255,255,255,.06)', color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const phoneWrapStyle: CSSProperties = { position: 'absolute', inset: 0, borderRadius: 46, overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,.6)', background: '#000' };
const iframeStyle: CSSProperties = { width: '100%', height: '100%', border: 'none', background: '#fff', display: 'block' };
const loadingStyle: CSSProperties = { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#888', fontSize: 14, background: '#fff' };
