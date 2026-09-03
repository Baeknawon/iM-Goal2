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
    code: 'TRV',
    goalAmountLabel: '3,000만원',
    goalName: '전세보증금',
    dailyBudget: 27400,
    triggerLabel: '배달 23,000원 결제 발생시키기',
    accent: color.mint,
  },
  B: {
    label: 'B · 소상공인',
    code: 'BIZ',
    goalAmountLabel: '사업 안정화',
    goalName: '매출 회복',
    dailyBudget: 9600,
    triggerLabel: '8월 매출 -18% 감지 발생시키기',
    accent: color.mint,
  },
  C: {
    label: 'C · 리볼빙 청년',
    code: 'EMG',
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

/** The "탑승 전후 비교" (before/after) metric row on VerifyScreen — the one figure specific to each persona's own recovery mission. */
export const verifyImpactDefs: Record<PersonaKey, { label: string; value: string }> = {
  A: { label: '주간 배달비', value: '91,000 → 58,000원' },
  B: { label: '월 고정비 점검', value: '4,120,000 → 3,640,000원' },
  C: { label: '카드 소진율', value: '82% → 58%' },
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
      { name: '목표 저축 (TRV)', desc: '전세보증금 3,000만원 · 68% 도달', amount: '20,400,000', delta: '지난달 +833,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '30,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 27,400원 × 남은 45일', amount: '1,233,000', delta: '이번 주 -74,000', dotColor: color.sky },
    ],
    post: [
      { name: '목표 저축 (TRV)', desc: '전세보증금 3,000만원 · 100% 도달', amount: '30,000,000', delta: '+9,600,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '30,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 27,400원 × 남은 45일', amount: '1,233,000', delta: '+1,233,000', dotColor: color.sky },
    ],
    total: '2,066,000', prePct: 68, postPct: 100, left: '8,767,000원',
    now: '2026년 8월', eta: '2028년 8월', etaShort: "'28.08", etaLate: "'28.09",
    dday: 'D-730', ddayLate: 'D-760', span: '24개월',
    target: '30,000,000원', etaFast: '2028년 6월', weekAvg: '208,000원', needPace: '192,000원',
    etaDelayed: '2028년 9월', delayNote: '난기류 30일 지연',
  },
  B: {
    pre: [
      { name: '사업 안정화 (BIZ)', desc: '고정비 3개월 버퍼 · 42% 도달', amount: '5,180,000', delta: '지난달 -320,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '50,000', delta: '변동 없음', dotColor: color.mint },
      { name: '운영비 계좌', desc: '하루 9,600원 × 남은 30일', amount: '288,000', delta: '매출 -18%', dotColor: color.sky },
    ],
    post: [
      { name: '사업 안정화 (BIZ)', desc: '고정비 3개월 버퍼 · 100% 도달', amount: '12,360,000', delta: '+7,180,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '50,000', delta: '변동 없음', dotColor: color.mint },
      { name: '운영비 계좌', desc: '하루 9,600원 × 남은 30일', amount: '288,000', delta: '+288,000', dotColor: color.sky },
    ],
    total: '768,000', prePct: 42, postPct: 100, left: '6,340,000원',
    now: '2026년 8월', eta: '2027년 2월', etaShort: "'27.02", etaLate: "'27.04",
    dday: 'D-180', ddayLate: 'D-240', span: '6개월',
    target: '12,360,000원', etaFast: '2027년 1월', weekAvg: '120,000원', needPace: '166,000원',
    etaDelayed: '2027년 4월', delayNote: '난기류 60일 지연',
  },
  C: {
    pre: [
      { name: '비상자금 (EMG)', desc: '목표 600만원 · 31% 도달', amount: '1,860,000', delta: '지난달 +240,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '20,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 11,200원 × 남은 45일', amount: '504,000', delta: '리볼빙 -326,000', dotColor: color.sky },
    ],
    post: [
      { name: '비상자금 (EMG)', desc: '목표 600만원 · 100% 도달', amount: '6,000,000', delta: '+4,140,000', dotColor: color.navy },
      { name: '보증금 예치', desc: 'iMKRW 스마트계약 · 고정 예치', amount: '20,000', delta: '변동 없음', dotColor: color.mint },
      { name: '생활비 계좌', desc: '하루 11,200원 × 남은 45일', amount: '504,000', delta: '+504,000', dotColor: color.sky },
    ],
    total: '744,000', prePct: 31, postPct: 100, left: '3,900,000원',
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
    { name: '목표 저축 (TRV)', desc: '전세보증금 목표 계좌', amount: '833,000원', pct: '40%', dotColor: color.navy },
    { name: '보증금 예치', desc: 'iMKRW 스마트계약', amount: '30,000원', pct: '2%', dotColor: color.mint },
    { name: '생활비 계좌', desc: '일일 예산 27,400원 기준', amount: '1,203,000원', pct: '58%', dotColor: color.sky },
  ],
  B: [
    { name: '사업 안정화 (BIZ)', desc: '고정비 버퍼 계좌', amount: '480,000원', pct: '62%', dotColor: color.navy },
    { name: '보증금 예치', desc: 'iMKRW 스마트계약', amount: '50,000원', pct: '7%', dotColor: color.mint },
    { name: '운영비 계좌', desc: '일일 예산 9,600원 기준', amount: '238,000원', pct: '31%', dotColor: color.sky },
  ],
  C: [
    { name: '비상자금 (EMG)', desc: '비상자금 목표 계좌', amount: '240,000원', pct: '32%', dotColor: color.navy },
    { name: '보증금 예치', desc: 'iMKRW 스마트계약', amount: '20,000원', pct: '3%', dotColor: color.mint },
    { name: '생활비 계좌', desc: '일일 예산 11,200원 기준', amount: '484,000원', pct: '65%', dotColor: color.sky },
  ],
};
