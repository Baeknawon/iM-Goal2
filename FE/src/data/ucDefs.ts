// Ported from the design doc's `ucDefs` table: the 18 use-case walkthrough
// screens (u11..u36), 6 per persona chain, driven by a small block DSL
// (quote / mascot bubble / stat card / alert card / bar chart / shift card /
// reasons list / ticket / verify checklist / segmented pills / product-fit card).
import type { UCScreenId } from '../types';
import { color } from '../styles/theme';

const CO = color.coralDarker; // '#D0512E'
const LI = color.limeTintText; // '#6E7A0A'
const BL = color.skyText; // '#2E6BD0'
const M = color.mint;
const MD = color.mintDark;
const INK = color.ink;

export interface StatRow {
  label: string;
  value: string;
  color?: string;
}

export type UCBlock =
    | { type: 'quote'; text: string }
    | { type: 'bubble'; mascot: 'dandi' | 'ddokdi'; bg: string; text: string }
    | {
  type: 'stat';
  label?: string;
  bigVal?: string;
  bigUnit?: string;
  headline?: string;
  barPct?: number;
  rows?: StatRow[];
  note?: string;
}
    | { type: 'alert'; tag: string; headline: string; note?: string; mascot?: 'dandi' | 'ddokdi' }
    | { type: 'bars'; rows: { name: string; tag: string; pct: number; color: string; note?: string }[] }
    | { type: 'shift'; tag: string; from: string; to: string; note?: string }
    | { type: 'reasons'; label: string; items: string[] }
    | { type: 'ticket'; label: string; big?: string; sub: string; rows?: { label: string; value: string }[] }
    | { type: 'verify'; rows: { title: string; desc: string; done: boolean }[] }
    | { type: 'segmented'; options: string[]; activeIndex: number }
    | { type: 'productFit'; chip: string; name: string; desc: string; note: string };

export interface UCDef {
  code: 'UC-01' | 'UC-02' | 'UC-03';
  accent: string;
  sub: string;
  title: string;
  blocks: UCBlock[];
  cta: string;
  footnote: string;
}

/**
 * Two chains per persona, matching climb-demo's `chainsP1`/`chainsP2`:
 * phase 1 walks from the deviation alert to the cause analysis, then hands off
 * to the real MissionDetail/Token screens; phase 2 (reached from Home's
 * "회복 미션 성공 확인" demo trigger) walks the recovery verification and ends
 * back on Home with the mission marked recovered.
 */
export const ucChainsP1: Record<'A' | 'B' | 'C', UCScreenId[]> = {
  A: ['u12'],
  B: ['u21', 'u22', 'u23', 'u24'],
  C: ['u31'],
};

export const ucChainsP2: Record<'A' | 'B' | 'C', UCScreenId[]> = {
  A: ['u16', 'u17'],
  B: ['u26'],
  C: ['u34', 'u35', 'u36'],
};

/** First screen of each persona's phase-1/phase-2 chain — entry points for the two demo triggers. */
export const phase1Start: Record<'A' | 'B' | 'C', UCScreenId> = {
  A: ucChainsP1.A[0], B: ucChainsP1.B[0], C: ucChainsP1.C[0],
};
export const phase2Start: Record<'A' | 'B' | 'C', UCScreenId> = {
  A: ucChainsP2.A[0], B: ucChainsP2.B[0], C: ucChainsP2.C[0],
};

export const ucDefs: Record<UCScreenId, UCDef> = {
  u11: {
    code: 'UC-01', accent: M, sub: '목적지를 말해주세요,', title: '목표 등록',
    blocks: [
      { type: 'quote', text: '"2년 안에 전세보증금 3,000만원 모으고 싶어"' },
      { type: 'bubble', mascot: 'dandi', bg: M, text: '목표금액 3,000만원 · 기간 24개월로 확인했어요' },
      { type: 'stat', label: '준비금 반영 후 하루 여유 예산', bigVal: '26,677', bigUnit: '원', rows: [{ label: '정착금 반영', value: '1,000만원' }] },
      { type: 'stat', rows: [{ label: '목표', value: '3,000만원' }, { label: '기간', value: '24개월' }, { label: '월 필요액', value: '833,000원', color: MD }], note: '신용거래 이력이 없어도 목표부터 시작합니다' },
    ],
    cta: '탑승권 발권하기',
    footnote: '자연어 한 문장을 금액·기간·하루 예산으로 분해합니다. ① 목표설정(AI 페이스메이커).',
  },
  u12: {
    code: 'UC-01', accent: M, sub: '무엇이 가장 컸나요,', title: '감지와 원인 분석',
    blocks: [
      { type: 'alert', tag: '위험징후 감지', headline: '배달앱 결제가 평소보다 잦아지고 있어요', note: '이번 주 배달 4회 · 4주 평균 2.8회', mascot: 'dandi' },
      { type: 'bars', rows: [
          { name: '배달비', tag: '+42%', pct: 86, color: CO, note: '최근 4주 평균 대비 · 기여도 1순위' },
          { name: '카페 지출', tag: '+11%', pct: 34, color: 'var(--im-lime)' },
          { name: '교통', tag: '+3%', pct: 14, color: 'rgba(var(--color-ink-rgb),.28)' },
        ] },
      { type: 'shift', tag: '도착일 영향 환산', from: '2028.07.20', to: '2028.08.19', note: '난기류 30일 지연' },
      { type: 'stat', rows: [{ label: '하루 예산 대비', value: '초과 3일', color: CO }, { label: '월 저축 페이스', value: '-8.4%', color: CO }] },
    ],
    cta: '맞춤 미션 받기',
    footnote: '실시간 감지와 원인 우선순위 분석을 한 화면에서 보여줍니다. ②+③ 감지·원인 분석.',
  },
  u13: {
    code: 'UC-01', accent: M, sub: '무엇이 가장 컸나요,', title: '원인 우선순위',
    blocks: [
      { type: 'bars', rows: [
          { name: '배달비', tag: '+42%', pct: 86, color: CO, note: '최근 4주 평균 대비 · 기여도 1순위' },
          { name: '카페 지출', tag: '+11%', pct: 34, color: 'var(--im-lime)' },
          { name: '교통', tag: '+3%', pct: 14, color: 'rgba(var(--color-ink-rgb),.28)' },
        ] },
      { type: 'shift', tag: '도착일 영향 환산', from: '2028.07.20', to: '2028.08.19', note: '난기류 30일 지연' },
      { type: 'stat', rows: [{ label: '하루 예산 대비', value: '초과 3일', color: CO }, { label: '월 저축 페이스', value: '-8.4%', color: CO }] },
    ],
    cta: '맞춤 미션 받기',
    footnote: '위험 후보 지표를 영향도 순으로 정렬하고, 목표 도착일 지연으로 환산해 보여줍니다. ③ 원인 우선순위 분석.',
  },
  u14: {
    code: 'UC-01', accent: M, sub: '왜 이 미션인가요,', title: '개인화 미션',
    blocks: [
      { type: 'reasons', label: '추천 근거 · 프로파일 7개 항목', items: ['전세보증금 목표 달성률 68%에서 정체', '일일 가용예산 8,000원', '최근 4주 배달 결제 증가 추세'] },
      { type: 'stat', headline: '이번 주 배달 2회를 집밥으로', rows: [{ label: '예상 절감', value: '32,000원', color: MD }, { label: '목표일', value: '6일 단축', color: MD }] },
      { type: 'bubble', mascot: 'ddokdi', bg: color.lime, text: '혼자 참지 말고, 보증금 걸고 같이 해봐요' },
    ],
    cta: '미션 시작하기',
    footnote: '추천 이유(7개 항목)를 먼저 보여준 뒤 미션을 제안합니다. ④ 개인화 미션.',
  },
  u15: {
    code: 'UC-01', accent: M, sub: '약속을 걸어둡니다,', title: 'iMKRW 보증금',
    blocks: [
      { type: 'ticket', label: 'DEPOSIT TICKET', big: '30,000', sub: '스마트계약 예치 · 기한 내 수행 시 전액 반환', rows: [{ label: '기간', value: '7일 (D-7)' }, { label: '실패 시', value: '미션 재설계 · 소각 없음' }] },
      { type: 'stat', rows: [{ label: '동의 방식', value: '명시적 동의' }, { label: '예치 기록', value: '앱에서 상시 확인' }], note: '명시적 동의 후에만 소액이 예치됩니다' },
    ],
    cta: '동의하고 예치',
    footnote: '보증금은 벌칙이 아니라 약속 장치입니다. 명시적 동의 · 소액 · 수행 시 반환. ④-b iMKRW 보증금형.',
  },
  u16: {
    code: 'UC-01', accent: M, sub: '미션을 완료했어요,', title: '회복 완료',
    blocks: [
      { type: 'alert', tag: '판정', headline: '회복 확인 · 미션 완료', note: '보증금 전액 반환 + FCPS 반영', mascot: 'dandi' },
      { type: 'stat', rows: [{ label: '배달 결제', value: '주 1회로 감소', color: MD }, { label: '목표 도착일', value: '6일 단축', color: MD }], note: '미션 완료가 확인되어 보증금이 반환되고 FCPS에 기록됩니다' },
    ],
    cta: '경로 재계산 보기',
    footnote: '미션 완료 시 보증금 반환과 FCPS 반영으로 이어집니다. ⑤ 회복 완료.',
  },
  u17: {
    code: 'UC-01', accent: M, sub: '기록이 쌓입니다,', title: 'FCPS 형성 시작',
    blocks: [
      { type: 'ticket', label: 'FIRST CREDIT RECORD', sub: '신용조회 · 대출 신청 없이 시작된 첫 기록' },
      { type: 'stat', barPct: 18, rows: [{ label: '미션 성공', value: '1건' }, { label: '목표 준수', value: '3주 연속' }, { label: '누적 궤적', value: '3~6개월 축적 시작', color: MD }], note: 'FCPS는 신용점수를 대체하지 않고 행동 궤적을 보완 지표로 축적합니다' },
    ],
    cta: '내 궤적 자세히 보기',
    footnote: '행동 이력이 첫 신용 데이터가 되는 지점. 대출·신용조회 없이 궤적이 시작됩니다. ⑦ FCPS 반영.',
  },
  u21: {
    code: 'UC-02', accent: BL, sub: '가게 흐름을 함께 봅니다,', title: '매출 상시 모니터링',
    blocks: [
      { type: 'bars', rows: [
          { name: '5월', tag: '기준', pct: 92, color: 'rgba(var(--color-ink-rgb),.20)' },
          { name: '7월', tag: '-9%', pct: 66, color: 'var(--im-blue)' },
          { name: '8월', tag: '-18%', pct: 54, color: CO, note: '최근 3개월 지속 감소 · 위험 후보 지표' },
        ] },
      { type: 'stat', rows: [{ label: '카드 매입', value: '연동 중' }, { label: '고정비', value: '월 4,120,000원' }, { label: '연체 이력', value: '없음', color: MD }], note: '연체 전 단계는 기존 정책금융의 사각지대입니다' },
    ],
    cta: '위험 후보 지표로 관찰 중',
    footnote: '마이데이터로 매출·카드 매입을 상시 모니터링합니다. 사업자 진입 지점. ② 실시간 감지.',
  },
  u22: {
    code: 'UC-02', accent: BL, sub: '등급이 바뀌었습니다,', title: '위험 등급 판정',
    blocks: [
      { type: 'segmented', options: ['안정', '주의', '위험'], activeIndex: 2 },
      { type: 'alert', tag: '금융건강 상태 갱신', headline: '회복미션과 함께 지원제도도 같이 볼까요?', note: '위험 등급에서만 동시 발동', mascot: 'ddokdi' },
      { type: 'stat', rows: [{ label: '안정 · 주의', value: '회복미션만' }, { label: '위험', value: '회복미션 + 지원제도매칭', color: BL }] },
    ],
    cta: '지원제도 함께 보기',
    footnote: '안정·주의는 회복미션만, 위험 등급에서만 지원제도매칭이 함께 발동됩니다. ⑥ 등급 분기.',
  },
  u23: {
    code: 'UC-02', accent: BL, sub: '지금 상황에 맞는 것부터,', title: '사업자 유형 판별',
    blocks: [
      { type: 'segmented', options: ['개인사업자', '소상공인'], activeIndex: 0 },
      { type: 'productFit', chip: '적합', name: '소상공인 119Plus', desc: '만기연장 · 장기분할상환 · 금리감면', note: '연체가 발생하기 전 단계라 이 상품이 먼저 매칭됐어요' },
      { type: 'stat', rows: [{ label: '후보 상품', value: 'iM뱅크 실제 취급 5종' }, { label: '제외 기준', value: '자격 미달 · 취급 안 함' }] },
    ],
    cta: '공식 신청 경로로 이동',
    footnote: '사업자 유형과 위험 원인으로 실제 취급 5종 중 후보를 좁힙니다. ⑥-b 지원제도매칭.',
  },
  u24: {
    code: 'UC-02', accent: BL, sub: '다음 계단이 보입니다,', title: '정책과의 연결',
    blocks: [
      { type: 'verify', rows: [
          { title: '119Plus 3개월 성실 이용', desc: '최초 1,000만원', done: true },
          { title: '+6개월 성실상환 · 금융교육', desc: '1,000만원 추가', done: true },
          { title: '햇살론 119', desc: '최대 2,000만원 · 5년 상환', done: false },
        ] },
      { type: 'bubble', mascot: 'ddokdi', bg: color.lime, text: '지금의 성실 상환이 다음 정책 자격으로 이어져요' },
    ],
    cta: '내 자격 조건 확인',
    footnote: '지금 이용하는 상품이 다음 정책 자격으로 이어지는 경로를 미리 보여줍니다.',
  },
  u25: {
    code: 'UC-02', accent: BL, sub: '동시에 진행합니다,', title: '회복미션 병행',
    blocks: [
      { type: 'verify', rows: [
          { title: '고정비 점검', desc: '월 4,120,000원 항목별 재검토', done: true },
          { title: '카드 한도 관리', desc: '사업용 카드 소진율 관리', done: true },
        ] },
      { type: 'stat', headline: '직접 심사하지 않는 영역', note: '개인 대상 정책서민금융은 서비스가 심사하지 않고 공식 경로만 안내합니다', rows: [{ label: '신용회복위원회', value: '채무조정 등' }] },
    ],
    cta: '회복미션 시작',
    footnote: '심사 영역과 안내 영역을 명확히 구분합니다. ④ 회복미션(사업자).',
  },
  u26: {
    code: 'UC-02', accent: BL, sub: '미션을 완료했어요,', title: '회복 완료 · 경로 재계산',
    blocks: [
      { type: 'alert', tag: '판정', headline: '회복 확인 · 미션 완료', note: '보증금 전액 반환 + FCPS 반영', mascot: 'ddokdi' },
      { type: 'shift', tag: '목표 경로 재계산', from: '주의 유지', to: '회복 진행', note: '미션 완료 결과가 FCPS 데이터로' },
    ],
    cta: 'FCPS 변화 보기',
    footnote: '미션 완료 결과가 경로 재계산과 FCPS로 이어집니다. ⑤ + ⑧.',
  },
  u31: {
    code: 'UC-03', accent: LI, sub: '1순위 원인은,', title: '한도 감지와 원인 분석',
    blocks: [
      { type: 'alert', tag: '위험 수준 도달', headline: '카드 한도 소진율 82%', note: '방금 결제 148,000원 · 리볼빙 잔액 3,260,000원' },
      { type: 'bars', rows: [
          { name: '리볼빙 잔액', tag: '1순위', pct: 78, color: CO, note: '이월 수수료가 목표 경로를 밀어냅니다' },
          { name: '고정 구독', tag: '2순위', pct: 29, color: 'var(--im-lime)' },
        ] },
      { type: 'shift', tag: '비상자금 목표에 미치는 영향', from: '2027.10.24', to: '2027.11.23', note: '난기류 30일 지연' },
      { type: 'bubble', mascot: 'dandi', bg: M, text: '한도부터 낮추면 목표가 다시 앞으로 와요' },
    ],
    cta: '미션 받기',
    footnote: '한도 소진율 감지와 원인 분석을 한 화면에서 보여줍니다. ②+③ 감지·원인 분석.',
  },
  u32: {
    code: 'UC-03', accent: LI, sub: '1순위 원인은,', title: '리볼빙 잔액 증가',
    blocks: [
      { type: 'bars', rows: [
          { name: '리볼빙 잔액', tag: '1순위', pct: 78, color: CO, note: '이월 수수료가 목표 경로를 밀어냅니다' },
          { name: '고정 구독', tag: '2순위', pct: 29, color: 'var(--im-lime)' },
        ] },
      { type: 'shift', tag: '비상자금 목표에 미치는 영향', from: '2027.10.24', to: '2027.11.23', note: '난기류 30일 지연' },
      { type: 'bubble', mascot: 'dandi', bg: M, text: '한도부터 낮추면 목표가 다시 앞으로 와요' },
    ],
    cta: '미션 받기',
    footnote: '영향도 1순위를 목표 경로 지연으로 환산해 보여줍니다. ③ 원인 분석.',
  },
  u33: {
    code: 'UC-03', accent: LI, sub: '보증금을 걸고 시작합니다,', title: '한도 낮추기 미션',
    blocks: [
      { type: 'stat', headline: '2주간 카드 소진율 82% → 60% 이하로', rows: [{ label: '보증금', value: '20,000원' }, { label: '기한', value: 'D-14' }], note: '명시적 동의 후 소액 예치, 기한 내 수행 시 전액 반환' },
      { type: 'stat', label: '진행 상황', barPct: 46, rows: [{ label: '현재', value: 'D-9 · 소진율 71%', color: MD }] },
    ],
    cta: '동의하고 시작',
    footnote: '소진율 목표를 iMKRW 보증금형 미션으로 전환합니다. ④ 미션 + iMKRW.',
  },
  u34: {
    code: 'UC-03', accent: LI, sub: '미션을 완료했어요,', title: '회복 완료',
    blocks: [
      { type: 'ticket', label: '판정', sub: '회복 확인 · 미션 완료 · 보증금 전액 반환 + FCPS 반영' },
      { type: 'stat', rows: [{ label: '한도 소진율', value: '82% → 58%', color: MD }, { label: '리볼빙 의존도', value: '326만 → 241만원', color: MD }], note: '미션 완료가 확인되어 보증금이 반환되고 FCPS에 기록됩니다' },
    ],
    cta: '다음 단계 보기',
    footnote: '미션 완료 시 보증금 반환과 FCPS 반영으로 이어집니다. ⑤ 회복 완료.',
  },
  u35: {
    code: 'UC-03', accent: LI, sub: '자격이 맞는 상품만,', title: '정책상품 크로스셀',
    blocks: [
      { type: 'productFit', chip: '적합', name: '청년미래적금', desc: '3년 · 월 50만원 · 기본금리 5% + 우대 2~3%p', note: '비상자금 목표와 자격 조건이 맞아 노출됐어요' },
      { type: 'stat', rows: [{ label: '취급기관', value: 'iM뱅크 참여 중', color: MD }, { label: '연결', value: '별도 상담 없이 공식 경로' }], note: '기취급 정책상품만 노출합니다' },
    ],
    cta: '공식 가입 경로로',
    footnote: 'iM뱅크가 이미 취급 중인 정책상품만, 자격 매칭 근거와 함께 노출합니다. ⑥-d 크로스셀.',
  },
  u36: {
    code: 'UC-03', accent: LI, sub: '궤적에 반영됩니다,', title: 'FCPS 변화 추이',
    blocks: [
      { type: 'bars', rows: [
          { name: '5월', tag: '', pct: 44, color: 'rgba(var(--color-ink-rgb),.20)' },
          { name: '6월', tag: '', pct: 58, color: 'rgba(var(--color-ink-rgb),.28)' },
          { name: '7월', tag: '', pct: 76, color: M },
          { name: '8월', tag: '+34', pct: 100, color: INK, note: '최근 4개월 누적 변화' },
        ] },
      { type: 'stat', rows: [{ label: '리볼빙 의존도', value: '감소', color: MD }, { label: '미션 성공', value: '3건 누적' }, { label: '등급', value: '실버 → 골드까지 88점' }] },
    ],
    cta: '목표 경로 재계산',
    footnote: '행동 데이터가 FCPS 추이에 반영되고 목표 경로가 갱신됩니다. ⑦ + ⑧.',
  },
};
