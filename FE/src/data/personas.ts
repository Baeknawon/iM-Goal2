import type { PersonaKey } from '../types';
import { color } from '../styles/theme';

export interface PersonaDef {
  label: string;
  code: string; // boarding-pass destination code, e.g. TRV / BIZ / EMG
  goalAmountLabel: string;
  goalName: string;
  dailyBudget: number;
  triggerLabel: string;
  accent: string;
}

export const personaDefs: Record<PersonaKey, PersonaDef> = {
  A: {
    label: 'A · 자립준비청년',
    code: 'GOAL',
    goalAmountLabel: '3,000만원',
    goalName: '전세보증금',
    dailyBudget: 27400,
    triggerLabel: '배달 23,000원 결제 발생시키기',
    accent: color.mint,
  },
  B: {
    label: 'B · 소상공인',
    code: 'GOAL',
    goalAmountLabel: '사업 안정화',
    goalName: '매출 회복',
    dailyBudget: 9600,
    triggerLabel: '8월 매출 -18% 감지 발생시키기',
    accent: color.mint,
  },
  C: {
    label: 'C · 리볼빙 청년',
    code: 'GOAL',
    goalAmountLabel: '600만원',
    goalName: '비상자금',
    dailyBudget: 11200,
    triggerLabel: '카드 148,000원 결제 발생시키기',
    accent: color.mint,
  },
};

export interface GoalSetupDef {
  voiceHint: string; // one-line quoted example shown on the "음성으로 말하기" input-mode card
  say1: string; // recognized-speech line 1 (quoted)
  say2: string; // recognized-speech line 2 (quoted)
  spanLabel: string; // "24개월 · 2028년 8월까지"
  goalType: string; // "주거 · 전세보증금"
  goalAmount: string; // "30,000,000원"
  ticketGoal: string; // "전세보증금 3,000만원" — shown on the finished plan ticket
  monthly: string; // "83.3만원" — monthly savings shown on the plan ticket
  calc1: string; // daily-budget breakdown line 1
  calc2: string; // daily-budget breakdown line 2
}

/** Voice/typing goal-input content + the finished-plan ticket copy, per persona — ported from the doc's pDefs. */
export const goalSetupDefs: Record<PersonaKey, GoalSetupDef> = {
  A: {
    voiceHint: '"2년 안에 전세보증금 3,000만원"',
    say1: '"2년 안에 전세보증금', say2: '3,000만원 모으고 싶어요"',
    spanLabel: '24개월 · 2028년 8월까지', goalType: '주거 · 전세보증금', goalAmount: '30,000,000원',
    ticketGoal: '전세보증금 3,000만원', monthly: '83.3만원',
    calc1: '월소득 250만 − 고정비 84만 − 저축 83.3만', calc2: '= 82.7만원 ÷ 30일 (안전마진 적용)',
  },
  B: {
    voiceHint: '"운영자금 1,200만원을 반년 안에"',
    say1: '"가게 운영자금 1,200만원을', say2: '반년 안에 만들고 싶어요"',
    spanLabel: '6개월 · 2027년 2월까지', goalType: '사업 · 운영 안정화', goalAmount: '12,360,000원',
    ticketGoal: '운영자금 1,236만원', monthly: '206만원',
    calc1: '월매출 620만 − 고정비 412만 − 적립 206만', calc2: '= 28.8만원 ÷ 30일 (매출 변동 반영)',
  },
  C: {
    voiceHint: '"리볼빙 정리하고 비상자금 600만원"',
    say1: '"리볼빙 정리하고 비상자금', say2: '600만원 만들고 싶어요"',
    spanLabel: '15개월 · 2027년 11월까지', goalType: '부채 정리 · 비상자금', goalAmount: '6,000,000원',
    ticketGoal: '비상자금 600만원', monthly: '40만원',
    calc1: '월소득 285만 − 고정비 78만 − 리볼빙 상환 133만', calc2: '= 33.6만원 ÷ 30일 (한도 회복 우선)',
  },
};

// ── AI 목표설정 챗봇 (대화형) ──────────────────────────────────────────────
/** 한 개의 대화 말풍선. from: 'ai' | 'user' | 'product'(상품추천 카드). */
export interface ChatTurn {
  from: 'ai' | 'user' | 'product';
  /** 일반 말풍선 텍스트 (from이 'ai'|'user'일 때). */
  text?: string;
  /** 상품추천 카드 (from === 'product'). */
  product?: {
    tag: string;      // "iM뱅크 추천 · 목표 연계"
    name: string;     // 상품명
    reason: string;   // 왜 추천했는지 (사용자 말 분석 근거)
    k1: string; v1: string; // 지표 1 (예: 금리 / 연 3.6%)
    k2: string; v2: string; // 지표 2 (예: 월 납입 / 20만원)
  };
}

/** 챗봇이 대화 끝에 확정하는 목표 계획 + 리포트에 그대로 쓰이는 값들. */
export interface GoalPlanDef {
  goalName: string;     // "전세보증금"
  goalAmount: string;   // "3,000만원"
  span: string;         // "24개월"
  eta: string;          // "2028년 8월"
  monthly: string;      // "83.3만원"
  dailyBudget: string;  // "27,400원"
  summary: string;      // 리포트 상단 한 줄 요약
  reasons: string[];    // 리포트 "이 계획을 세운 근거"
  products: {           // 리포트에 담기는 추천 상품(대화에서 언급된 것과 동일)
    tag: string; name: string; reason: string; k1: string; v1: string; k2: string; v2: string;
  }[];
}

/**
 * 페르소나별 미리 짜인 목표설정 대화 시나리오.
 * 사용자는 배경지식 없이 "나 뭐 하고 싶어~" 식으로 말하고, AI가 분석해 되묻고,
 * 중간에 사용자의 말을 근거로 iM뱅크 상품을 추천한 뒤, 마지막에 계획을 확정합니다.
 */
export const goalChatDefs: Record<PersonaKey, ChatTurn[]> = {
  A: [
    { from: 'ai', text: '안녕하세요, 단디예요. 요즘 돈 관련해서 가장 하고 싶은 게 뭐예요? 편하게 말해 주세요.' },
    { from: 'user', text: '음… 지금 반지하 사는데 곧 독립해서 제대로 된 전셋집으로 옮기고 싶어요.' },
    { from: 'ai', text: '좋은 목표네요! 혹시 생각해둔 지역이나 예산이 있어요? 몰라도 괜찮아요, 같이 잡아볼게요.' },
    { from: 'user', text: '잘 모르겠어요. 그냥 2년 안에는 옮기고 싶은데 얼마가 필요한지도 감이 안 와요.' },
    { from: 'ai', text: '연결된 소비·소득 내역을 보니 월 250만원 소득에 고정비 84만원이에요. 청년 전세 기준으로 보증금 3,000만원 정도면 현실적인 목표예요.' },
    { from: 'user', text: '3,000만원이요? 2년 안에 그게 돼요?' },
    { from: 'ai', text: '됩니다. 24개월로 나누면 매달 83.3만원씩 모으면 돼요. 지금 소비 습관이면 하루 여윳돈은 27,400원으로 잡혀요.' },
    { from: 'product', product: {
        tag: 'iM뱅크 추천 · 목표 연계',
        name: 'iM 목표적금 (24개월)',
        reason: '"2년 안에 전세" 말씀과 목표 기간이 딱 맞아요. 만기가 도착 예정일과 같아 목표 계좌로 바로 연결돼요.',
        k1: '금리', v1: '연 3.6%', k2: '월 납입', v2: '83만원',
      } },
    { from: 'ai', text: '그리고 자립준비청년 요건을 충족해서 정부가 보태주는 상품도 하나 같이 넣을 수 있어요.' },
    { from: 'product', product: {
        tag: 'iM뱅크 추천 · 정책상품',
        name: '청년미래적금',
        reason: '자립준비청년 자격이 확인돼서 별도 서류 없이 신청 가능해요. 정부 기여금이 매달 얹혀요.',
        k1: '정부 기여', v1: '월 3만원', k2: '가입', v2: '3년',
      } },
    { from: 'ai', text: '이 두 가지로 계획을 만들어봤어요. 전체 리포트로 정리해서 보여드릴게요. 확인해볼까요?' },
  ],
  B: [
    { from: 'ai', text: '사장님, 단디예요. 요즘 가게 운영하면서 돈 쪽으로 제일 고민되는 게 뭐예요?' },
    { from: 'user', text: '요새 매출이 계속 줄어서… 갑자기 돈 막힐까 봐 불안해요.' },
    { from: 'ai', text: '카드 매입 내역을 보니 최근 3개월 매출이 18% 줄었네요. 고정비는 월 412만원 그대로고요. 버퍼가 필요한 상황이에요.' },
    { from: 'user', text: '맞아요. 근데 얼마를 모아둬야 마음이 놓일지 모르겠어요.' },
    { from: 'ai', text: '보통 고정비 3개월치를 비상 버퍼로 잡아요. 사장님은 약 1,236만원이에요. 6개월 안에 만드는 걸 목표로 해볼까요?' },
    { from: 'user', text: '6개월이면 매달 얼마씩이에요?' },
    { from: 'ai', text: '매달 206만원씩이에요. 매출 변동을 반영하면 하루 운영 여윳돈은 9,600원으로 잡혀요.' },
    { from: 'product', product: {
        tag: 'iM뱅크 추천 · 사업자',
        name: '소상공인 119Plus',
        reason: '"매출이 계속 준다"는 말씀이 연체 전 단계 신호예요. 이 단계에서 만기연장·금리감면을 먼저 받을 수 있어요.',
        k1: '지원', v1: '만기연장', k2: '대상', v2: '연체 전',
      } },
    { from: 'ai', text: '이 상품과 버퍼 적립을 묶어서 계획을 짰어요. 리포트로 정리해드릴게요.' },
  ],
  C: [
    { from: 'ai', text: '안녕하세요, 단디예요. 돈 관련해서 요즘 제일 신경 쓰이는 게 있어요?' },
    { from: 'user', text: '카드값이 자꾸 리볼빙으로 넘어가서… 이거 정리하고 비상금도 좀 있었으면 좋겠어요.' },
    { from: 'ai', text: '카드 내역을 보니 한도 소진율이 82%, 리볼빙 잔액이 326만원이에요. 먼저 한도 부담을 줄이면서 비상자금을 모으는 게 좋겠어요.' },
    { from: 'user', text: '비상금은 얼마 정도가 적당해요?' },
    { from: 'ai', text: '생활비 약 3개월치인 600만원을 목표로 잡을게요. 15개월로 나누면 매달 40만원이에요.' },
    { from: 'user', text: '리볼빙부터 어떻게 하는 게 좋아요?' },
    { from: 'ai', text: '한도를 조금 낮추고 신규 리볼빙을 멈추면 이자 부담이 확 줄어요. 하루 여윳돈은 11,200원으로 잡았어요.' },
    { from: 'product', product: {
        tag: 'iM뱅크 추천 · 부채 조정',
        name: '대환대출 · 한도 조정 상담',
        reason: '"리볼빙 정리하고 싶다"는 말씀에 맞춰, 소진율 82%를 낮춰 이자 부담을 줄이는 상담을 연결해요.',
        k1: '월 절감', v1: '4.1만원', k2: '소진율', v2: '82→55%',
      } },
    { from: 'ai', text: '한도 조정과 비상자금 적립을 함께 담은 계획을 만들었어요. 리포트로 보여드릴게요.' },
  ],
};

/** 대화 끝에서 확정되는 목표 계획 + 리포트에 고정 표시되는 값. */
export const goalPlanDefs: Record<PersonaKey, GoalPlanDef> = {
  A: {
    goalName: '전세보증금', goalAmount: '3,000만원', span: '24개월', eta: '2028년 8월',
    monthly: '83.3만원', dailyBudget: '27,400원',
    summary: '2년 안에 전세보증금 3,000만원을 모으는 계획이에요.',
    reasons: [
      '월소득 250만원 · 고정비 84만원 기준으로 계산했어요',
      '자립준비청년 요건을 충족해 정책상품을 함께 넣었어요',
      '하루 27,400원 예산이면 무리 없이 지킬 수 있어요',
    ],
    products: [
      { tag: '목표 연계', name: 'iM 목표적금 (24개월)', reason: '만기가 도착 예정일과 같아 목표 계좌로 자동 연결', k1: '금리', v1: '연 3.6%', k2: '월 납입', v2: '83만원' },
      { tag: '정책상품', name: '청년미래적금', reason: '자립준비청년 자격 충족 · 정부 기여금', k1: '정부 기여', v1: '월 3만원', k2: '가입', v2: '3년' },
    ],
  },
  B: {
    goalName: '매출 회복 버퍼', goalAmount: '1,236만원', span: '6개월', eta: '2027년 2월',
    monthly: '206만원', dailyBudget: '9,600원',
    summary: '반년 안에 고정비 3개월치 버퍼 1,236만원을 만드는 계획이에요.',
    reasons: [
      '최근 3개월 매출 -18% · 고정비 월 412만원을 반영했어요',
      '연체 전 단계라 지원제도를 먼저 연결할 수 있어요',
      '매출 변동을 반영해 하루 9,600원으로 잡았어요',
    ],
    products: [
      { tag: '사업자', name: '소상공인 119Plus', reason: '연체 전 단계 · 만기연장과 금리감면 우선 대상', k1: '지원', v1: '만기연장', k2: '대상', v2: '연체 전' },
    ],
  },
  C: {
    goalName: '비상자금', goalAmount: '600만원', span: '15개월', eta: '2027년 11월',
    monthly: '40만원', dailyBudget: '11,200원',
    summary: '리볼빙을 정리하면서 비상자금 600만원을 모으는 계획이에요.',
    reasons: [
      '한도 소진율 82% · 리볼빙 잔액 326만원을 반영했어요',
      '한도를 낮추면 이자 부담이 줄어 목표가 앞당겨져요',
      '하루 11,200원 예산으로 15개월간 모아요',
    ],
    products: [
      { tag: '부채 조정', name: '대환대출 · 한도 조정 상담', reason: '소진율 82%를 낮춰 이자 부담 완화', k1: '월 절감', v1: '4.1만원', k2: '소진율', v2: '82→55%' },
    ],
  },
};

// ── 여정 히스토리 (3D 지구본 항로에 반영되는 이벤트) ────────────────────────
export type JourneyEventKind = 'start' | 'deviation' | 'boost' | 'recovery' | 'mission' | 'now';

/** 항로 위 한 지점의 이벤트. progress(0~1)는 목표 대비 진행 위치. */
export interface JourneyEvent {
  progress: number;   // 0(출발) ~ 1(목표) 사이 위치
  kind: JourneyEventKind;
  label: string;      // "배달 지출 급증" 등
  date: string;       // "3월"
  detail: string;     // 한 줄 설명
}

/**
 * 페르소나별 여정 히스토리. 지그재그·색상으로 "여러 번의 이탈/가속/회복"을 표현하기 위한 이벤트 시퀀스.
 * deviation=이탈(아래로 처짐/코랄), boost=가속(위로 솟음/라임), recovery=회복(민트), mission=미션 구간.
 */
export const journeyEventsDefs: Record<PersonaKey, JourneyEvent[]> = {
  A: [
    { progress: 0.0, kind: 'start', label: '여정 시작', date: '출발', detail: '전세보증금 3,000만원 항로에 탑승했어요' },
    { progress: 0.18, kind: 'boost', label: '첫 달 초과 저축', date: '1개월차', detail: '예산보다 아껴 페이스를 앞당겼어요' },
    { progress: 0.34, kind: 'deviation', label: '배달 지출 급증', date: '3개월차', detail: '4주 평균 대비 +34.5% 이탈' },
    { progress: 0.46, kind: 'mission', label: '회복 미션 · 배달 줄이기', date: '4개월차', detail: '보증금 걸고 2주 구간 수행' },
    { progress: 0.58, kind: 'recovery', label: '항로 복귀', date: '5개월차', detail: '주간 배달비 91k→58k, 페이스 회복' },
    { progress: 0.72, kind: 'deviation', label: '설 연휴 지출', date: '6개월차', detail: '일시적으로 하루 예산 초과' },
    { progress: 0.84, kind: 'boost', label: '상여금 추가 저축', date: '7개월차', detail: '목표 계좌에 한 번에 크게 적립' },
    { progress: 0.97, kind: 'now', label: '현재 위치', date: '지금', detail: '목표까지 97% 왔어요' },
  ],
  B: [
    { progress: 0.0, kind: 'start', label: '여정 시작', date: '출발', detail: '운영자금 1,236만원 항로에 탑승했어요' },
    { progress: 0.2, kind: 'deviation', label: '매출 3개월 감소', date: '1개월차', detail: '-18% · 위험 등급으로 이탈' },
    { progress: 0.34, kind: 'mission', label: '고정비·한도 관리 미션', date: '2개월차', detail: '보증금 걸고 3주 구간 수행' },
    { progress: 0.5, kind: 'recovery', label: '매출 반등', date: '3개월차', detail: '고정비 480k 절감 · 현금흐름 회복' },
    { progress: 0.66, kind: 'boost', label: '성수기 매출 증가', date: '4개월차', detail: '버퍼를 크게 채웠어요' },
    { progress: 0.8, kind: 'deviation', label: '재료비 상승', date: '5개월차', detail: '잠시 적립 페이스 둔화' },
    { progress: 0.9, kind: 'boost', label: '정책자금 연계', date: '5개월차', detail: '119Plus로 여유 확보' },
    { progress: 0.97, kind: 'now', label: '현재 위치', date: '지금', detail: '목표까지 83% 왔어요' },
  ],
  C: [
    { progress: 0.0, kind: 'start', label: '여정 시작', date: '출발', detail: '비상자금 600만원 항로에 탑승했어요' },
    { progress: 0.22, kind: 'deviation', label: '카드 한도 82%', date: '2개월차', detail: '리볼빙 잔액 증가로 이탈' },
    { progress: 0.36, kind: 'mission', label: '한도 낮추기 미션', date: '3개월차', detail: '보증금 걸고 2주 구간 수행' },
    { progress: 0.5, kind: 'recovery', label: '소진율 회복', date: '4개월차', detail: '82%→58% · 리볼빙 의존도 감소' },
    { progress: 0.64, kind: 'boost', label: '고정 구독 정리', date: '5개월차', detail: '월 19.8k 절감분 저축 전환' },
    { progress: 0.78, kind: 'deviation', label: '병원비 지출', date: '6개월차', detail: '예상치 못한 지출로 잠시 둔화' },
    { progress: 0.9, kind: 'recovery', label: '페이스 재정비', date: '7개월차', detail: '자동 분배로 다시 궤도에' },
    { progress: 0.97, kind: 'now', label: '현재 위치', date: '지금', detail: '목표까지 93% 왔어요' },
  ],
};

export interface MissionDef {
  leg: string;
  difficulty: string;
  title1: string;
  title2: string;
  why: string;
  how: string;
  daysDone: number;
  daysTotal: number;
}

/** The persona's current in-flight recovery mission (LEG 0N), for the missions list + live-tracking screen. */
export const missionDefs: Record<PersonaKey, MissionDef> = {
  A: {
    leg: 'LEG 04 · 회복 구간', difficulty: '난이도 보통', title1: '배달 주문을', title2: '주 1회로 줄이기',
    why: '배달 지출이 4주 평균 대비 34.5% 늘었고, 하루 예산 27,400원을 이번 주 3회 초과했습니다.',
    how: '배달앱 알림을 끄고 주 1회만 허용합니다. 결제 내역으로 자동 확인되니 인증은 필요 없습니다.',
    daysDone: 9, daysTotal: 14,
  },
  B: {
    leg: 'LEG 02 · 사업 회복 구간', difficulty: '난이도 높음', title1: '고정비 4건 재검토와', title2: '카드 한도 관리',
    why: '최근 3개월 매출이 18% 감소했고, 월 고정비 4,120,000원이 그대로 유지되고 있습니다. 연체 이력은 없습니다.',
    how: '구독·보험·통신 4건을 점검하고 사업용 카드 소진율을 70% 이하로 유지합니다. 카드 매입 데이터로 자동 확인됩니다.',
    daysDone: 12, daysTotal: 21,
  },
  C: {
    leg: 'LEG 03 · 한도 회복 구간', difficulty: '난이도 보통', title1: '카드 소진율 82%를', title2: '60% 이하로',
    why: '방금 결제로 한도 소진율이 82%에 도달했고, 리볼빙 잔액이 3,260,000원까지 늘었습니다.',
    how: '카드 한도를 낮추고 리볼빙 신규 이용을 멈춥니다. 소진율은 매일 자동 계산되어 인증이 필요 없습니다.',
    daysDone: 6, daysTotal: 14,
  },
};

/** The "이 티켓을 만든 근거" tag row on MissionDetail — grounded in each persona's own goal/budget/risk data. */
export const missionProfileTags: Record<PersonaKey, string[]> = {
  A: ['목표 전세보증금 3,000만원', '여정 24개월', '진행 68%', '하루 예산 27,400원', '배달 빈도 증가', '구간 3건 · 성공 2', '항로 주의'],
  B: ['목표 매출 회복 · 사업 안정화', '여정 6개월', '진행 42%', '하루 예산 9,600원', '매출 3개월 연속 감소', '구간 4건 · 성공 2', '항로 위험'],
  C: ['목표 비상자금 600만원', '여정 15개월', '진행 31%', '하루 예산 11,200원', '한도 소진율 급등', '구간 3건 · 성공 2', '항로 위험'],
};

export interface CauseRow {
  rank: string;
  name: string;
  type: string;
  delta: string;
  barPct: number;
  weight: string;
  highlighted: boolean;
}

/** The ranked "왜 이탈했나요" cause list on CauseScreen, grounded in each persona's own deviation narrative. */
export const causesByPersona: Record<PersonaKey, CauseRow[]> = {
  A: [
    { rank: '1', name: '배달 지출 증가', type: '반복적인 소비 증가', delta: '+34.5%', barPct: 48, weight: '48%', highlighted: true },
    { rank: '2', name: '주말 외식 집중', type: '일회성 변화', delta: '+18%', barPct: 26, weight: '26%', highlighted: false },
    { rank: '3', name: '구독 서비스 중복', type: '고정비 부담', delta: '월 27,900원', barPct: 17, weight: '17%', highlighted: false },
    { rank: '4', name: '편의점 소액 결제', type: '빈도 증가', delta: '주 14회', barPct: 9, weight: '9%', highlighted: false },
  ],
  B: [
    { rank: '1', name: '매출 3개월 연속 감소', type: '반복적인 하락 추세', delta: '-18%', barPct: 48, weight: '48%', highlighted: true },
    { rank: '2', name: '고정비 부담 지속', type: '매출 대비 비중 증가', delta: '412만원', barPct: 26, weight: '26%', highlighted: false },
    { rank: '3', name: '사업용 카드 소진율 상승', type: '한도 근접', delta: '73%', barPct: 17, weight: '17%', highlighted: false },
    { rank: '4', name: '구독·통신 미정리', type: '고정비 항목 유지', delta: '4건', barPct: 9, weight: '9%', highlighted: false },
  ],
  C: [
    { rank: '1', name: '카드 결제 급증', type: '한도 소진율 급등', delta: '82%', barPct: 48, weight: '48%', highlighted: true },
    { rank: '2', name: '리볼빙 잔액 증가', type: '이월 잔액 누적', delta: '326만원', barPct: 26, weight: '26%', highlighted: false },
    { rank: '3', name: '고정 구독 부담', type: '반복 결제 지속', delta: '월 19,800원', barPct: 17, weight: '17%', highlighted: false },
    { rank: '4', name: '소액 결제 빈도 증가', type: '편의점 · 카페 반복', delta: '주 11회', barPct: 9, weight: '9%', highlighted: false },
  ],
};

/** The "비상 착륙 안내" (support) screen's self-recovery card note, grounded in each persona's own deviation cause + mission length. */
export const supportLegNote: Record<PersonaKey, string> = {
  A: '배달 지출 34.5% 증가 원인을 겨냥한 2주 회복 구간이 준비됐습니다.',
  B: '매출 3개월 연속 감소 원인을 겨냥한 3주 회복 구간이 준비됐습니다.',
  C: '카드 한도 소진율 82% 원인을 겨냥한 2주 회복 구간이 준비됐습니다.',
};

export interface IncomeDef {
  monthly: number;
  assets: number;
  fixed: number;
}

/** Defaults shown on the income-confirmation screen (동의 4/4), per persona. */
export const incomeDefs: Record<PersonaKey, IncomeDef> = {
  A: { monthly: 2500000, assets: 10000000, fixed: 840000 },
  B: { monthly: 6200000, assets: 4500000, fixed: 4120000 },
  C: { monthly: 2850000, assets: 1800000, fixed: 780000 },
};

export interface PushDef {
  title: string;
  body: string;
  time: string;
  action: string;
}

export const pushDefs: Record<PersonaKey, PushDef> = {
  A: {
    title: 'climb · 지출 경고',
    body: '배달 23,000원이 결제됐어요. 오늘 예산을 26,200원 썼습니다 — 지금 확인해볼까요?',
    time: '지금',
    action: '무슨 일인지 보기',
  },
  B: {
    title: 'climb · 매출 알림',
    body: '8월 매출이 3개월째 줄고 있어요 (-18%). 연체 전에 같이 점검해봐요.',
    time: '지금',
    action: '가게 상황 보기',
  },
  C: {
    title: 'climb · 한도 경고',
    body: '카드 148,000원 결제로 한도 소진율이 82%가 됐어요. 리볼빙으로 넘어가기 전에 확인해요.',
    time: '지금',
    action: '한도 확인하기',
  },
};

export interface AlertDef {
  tag: string;
  headFallback: string; // used verbatim for B/C; A computes its own dynamic overage headline
  txnName: string;
  txnSub: string;
  txnAmt: string;
  icon: string;
  iconBg: string;
  iconFg: string;
  riskTag: string;
  riskBody: string;
  causeScreen: string; // UCScreenId
}

export const alertDefs: Record<PersonaKey, AlertDef> = {
  A: {
    tag: '항로 이탈 감지 · 42초 전',
    headFallback: '오늘 예산을 18,200원 초과했어요',
    txnName: '배달앱 결제',
    txnSub: 'iM 체크카드 · 방금',
    txnAmt: '23,000원',
    icon: '배',
    iconBg: '#FFD9CF',
    iconFg: '#C4472A',
    riskTag: '위험 지수 · 순항 68 → 이탈 31',
    riskBody: '하루 예산 27,400원 중 45,600원을 썼습니다. 배달 지출이 4주 평균 대비 +34.5%입니다.',
    causeScreen: 'u13',
  },
  B: {
    tag: '매출 하락 감지 · 3개월 연속',
    headFallback: '8월 매출이 18% 줄었어요',
    txnName: '카드 매입 정산',
    txnSub: 'iM 사업자통장 · 오늘 09:40',
    txnAmt: '-1,240,000원',
    icon: '매',
    iconBg: '#D6E4FF',
    iconFg: '#1E4FA8',
    riskTag: '위험 등급 · 주의 → 위험',
    riskBody: '3개월 연속 매출 감소로 위험 등급이 됐습니다. 고정비 월 4,120,000원은 그대로입니다.',
    causeScreen: 'u22',
  },
  C: {
    tag: '한도 소진율 경고 · 38초 전',
    headFallback: '카드 한도를 82% 썼어요',
    txnName: '카드 결제',
    txnSub: 'iM 체크카드 · 방금',
    txnAmt: '148,000원',
    icon: '카',
    iconBg: '#EEF3C9',
    iconFg: '#5A6608',
    riskTag: '리볼빙 위험 · 소진율 82%',
    riskBody: '이번 달 이월 카드대금이 3,260,000원입니다. 지금 한도를 낮추면 목표가 다시 앞으로 옵니다.',
    causeScreen: 'u32',
  },
};

interface AcctRow {
  name: string;
  desc: string;
  amount: string; // digits only, "원" appended by consumer
  delta: string;
  dotColor: string;
}

export interface AcctDef {
  pre: AcctRow[];
  post: AcctRow[];
  total: string;
  prePct: number;
  postPct: number;
  left: string;
  now: string;
  eta: string;
  etaShort: string;
  etaLate: string;
  dday: string;
  ddayLate: string;
  span: string;
  target: string;
  etaFast: string;
  weekAvg: string;
  needPace: string;
  etaDelayed: string;
  delayNote: string;
}

export const acctDefs: Record<PersonaKey, AcctDef> = {
  A: {
    pre: [
      { name: '목표 저축', desc: '전세보증금 3,000만원 · 97% 도달', amount: '29,167,000', delta: '지난달 +833,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '30,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 27,400원 × 남은 45일', amount: '1,233,000', delta: '이번 주 -74,000', dotColor: color.sky },
    ],
    post: [
      { name: '목표 저축', desc: '전세보증금 3,000만원 · 100% 도달', amount: '30,000,000', delta: '+833,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '30,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 27,400원 × 남은 45일', amount: '1,233,000', delta: '+1,233,000', dotColor: color.sky },
    ],
    total: '2,066,000', prePct: 97, postPct: 100, left: '833,000원',
    now: '2026년 8월', eta: '2028년 8월', etaShort: "'28.08", etaLate: "'28.09",
    dday: 'D-730', ddayLate: 'D-760', span: '24개월',
    target: '30,000,000원', etaFast: '2028년 6월', weekAvg: '208,000원', needPace: '192,000원',
    etaDelayed: '2028년 9월', delayNote: '난기류 30일 지연',
  },
  B: {
    pre: [
      { name: '사업 안정화', desc: '고정비 3개월 버퍼 · 83% 도달', amount: '10,300,000', delta: '지난달 +2,060,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '50,000', delta: '변동 없음', dotColor: color.mint },
      { name: '운영비 계좌', desc: '하루 9,600원 × 남은 30일', amount: '288,000', delta: '매출 -18%', dotColor: color.sky },
    ],
    post: [
      { name: '사업 안정화', desc: '고정비 3개월 버퍼 · 100% 도달', amount: '12,360,000', delta: '+2,060,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '50,000', delta: '변동 없음', dotColor: color.mint },
      { name: '운영비 계좌', desc: '하루 9,600원 × 남은 30일', amount: '288,000', delta: '+288,000', dotColor: color.sky },
    ],
    total: '2,398,000', prePct: 83, postPct: 100, left: '2,060,000원',
    now: '2026년 8월', eta: '2027년 2월', etaShort: "'27.02", etaLate: "'27.04",
    dday: 'D-180', ddayLate: 'D-240', span: '6개월',
    target: '12,360,000원', etaFast: '2027년 1월', weekAvg: '120,000원', needPace: '166,000원',
    etaDelayed: '2027년 4월', delayNote: '난기류 60일 지연',
  },
  C: {
    pre: [
      { name: '비상자금', desc: '목표 600만원 · 93% 도달', amount: '5,600,000', delta: '지난달 +400,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '20,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 11,200원 × 남은 45일', amount: '504,000', delta: '리볼빙 -326,000', dotColor: color.sky },
    ],
    post: [
      { name: '비상자금', desc: '목표 600만원 · 100% 도달', amount: '6,000,000', delta: '+400,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '20,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 11,200원 × 남은 45일', amount: '504,000', delta: '+504,000', dotColor: color.sky },
    ],
    total: '904,000', prePct: 93, postPct: 100, left: '400,000원',
    now: '2026년 8월', eta: '2027년 11월', etaShort: "'27.11", etaLate: "'27.12",
    dday: 'D-450', ddayLate: 'D-480', span: '15개월',
    target: '6,000,000원', etaFast: '2027년 10월', weekAvg: '69,000원', needPace: '64,000원',
    etaDelayed: '2027년 12월', delayNote: '난기류 30일 지연',
  },
};

export interface SalarySplitRow {
  name: string;
  desc: string;
  amount: string;
  pct: string;
  dotColor: string;
}

/** Salary-deposit distribution shown on the "자동으로 나눌까요?" (salary) screen. */
export const salarySplitDefs: Record<PersonaKey, SalarySplitRow[]> = {
  A: [
    { name: '목표 저축', desc: '전세보증금 목표 계좌', amount: '833,000원', pct: '40%', dotColor: color.navy },
    { name: '보증금 예치', desc: 'iMKRW 스마트계약', amount: '30,000원', pct: '2%', dotColor: color.mint },
    { name: '생활비 계좌', desc: '일일 예산 27,400원 기준', amount: '1,203,000원', pct: '58%', dotColor: color.sky },
  ],
  B: [
    { name: '사업 안정화', desc: '고정비 버퍼 계좌', amount: '2,060,000원', pct: '86%', dotColor: color.navy },
    { name: '보증금 예치', desc: 'iMKRW 스마트계약', amount: '50,000원', pct: '2%', dotColor: color.mint },
    { name: '운영비 계좌', desc: '일일 예산 9,600원 기준', amount: '288,000원', pct: '12%', dotColor: color.sky },
  ],
  C: [
    { name: '비상자금', desc: '비상자금 목표 계좌', amount: '400,000원', pct: '44%', dotColor: color.navy },
    { name: '보증금 예치', desc: 'iMKRW 스마트계약', amount: '20,000원', pct: '2%', dotColor: color.mint },
    { name: '생활비 계좌', desc: '일일 예산 11,200원 기준', amount: '484,000원', pct: '54%', dotColor: color.sky },
  ],
};
