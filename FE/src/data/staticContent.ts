// Flat, persona-independent content ported from the design doc's renderVals().
import { color } from '../styles/theme';

export const waveHeights = [
  26, 44, 68, 92, 58, 34, 76, 100, 62, 40, 84, 54, 30, 70, 96, 48, 36, 80, 60, 42, 88, 52, 32, 66, 46, 28,
];

/** Detail screen's weekly-pace bar chart (index 7 = "this week", 5 = target pace marker). */
export const paceTargets = [40, 52, 44, 61, 48, 70, 56, 78];

export const spendCategories = [
  { name: '식비 · 배달', pct: '32%', color: color.navy },
  { name: '교통', pct: '23%', color: color.mint },
  { name: '생활', pct: '17%', color: color.sky },
  { name: '문화', pct: '15%', color: '#6E7A0A' },
  { name: '기타', pct: '13%', color: '#DDE2E5' },
];

export const categoryRows = [
  { name: '배달', count: '11건', amount: '91,000원', delta: '+34.5%', barPct: 100, highlighted: true, icon: '배' },
  { name: '외식', count: '6건', amount: '58,000원', delta: '+8%', barPct: 64, highlighted: false, icon: '외' },
  { name: '교통', count: '18건', amount: '42,000원', delta: '−3%', barPct: 46, highlighted: false, icon: '교' },
  { name: '편의점', count: '14건', amount: '31,000원', delta: '+12%', barPct: 34, highlighted: false, icon: '편' },
  { name: '구독', count: '4건', amount: '23,000원', delta: '0%', barPct: 25, highlighted: false, icon: '구' },
];

export const weekVals = [186, 214, 240, 245]; // 245 (index 3) is "this week", highlighted coral

/** Day-of-month → amount spent (₩), used to color the spend calendar. Day 18 = "today". */
export const spendMap: Record<number, number> = {
  3: 4200, 4: 12800, 5: 2100, 6: 9400, 7: 0, 8: 18600, 9: 6300, 10: 3100, 11: 7800, 12: 24500,
  13: 5200, 14: 0, 15: 8100, 16: 11200, 17: 4600, 18: 26200, 19: 7400, 20: 3800, 21: 0,
  22: 9100, 23: 14300, 24: 5900, 25: 2400,
};

export const dayTxns = [
  { name: '배달앱 결제', meta: 'iM 체크카드 · 19:42', amount: '23,000원', icon: '배', iconBg: '#FFD9CF', iconFg: '#C4472A' },
  { name: '편의점', meta: 'iM 체크카드 · 13:10', amount: '2,400원', icon: '편', iconBg: 'rgba(22,25,28,.12)', iconFg: 'rgba(22,25,28,.7)' },
  { name: '버스·지하철', meta: '교통카드 · 08:20', amount: '800원', icon: '교', iconBg: 'rgba(22,25,28,.12)', iconFg: 'rgba(22,25,28,.7)' },
];

export const fcpsFactors = [
  { name: '정시 도착 (예산 준수)', barPct: 78, tag: '좋음', good: true },
  { name: '구간 완주율', barPct: 82, tag: '좋음', good: true },
  { name: '예산 준수 안정성', barPct: 64, tag: '보통', good: true },
  { name: '적립 변화 (저축)', barPct: 41, tag: '개선 필요', good: false },
];

export const connectItems = [
  { name: 'iM뱅크 입출금', desc: '급여통장 · 예금 2건', tag: '연결됨', linked: true },
  { name: 'iM 체크·신용카드', desc: '카드 2매 · 승인 내역', tag: '연결됨', linked: true },
  { name: '타행 계좌 (마이데이터)', desc: '은행 3곳 · 증권 1곳', tag: '연결됨', linked: true },
  { name: '카드 매입·매출 (사업자)', desc: '사업자만 해당', tag: '선택', linked: false },
];

export const arrivedRecords = [
  { label: '미션 성공', value: '9건 / 11건' },
  { label: '절감한 금액', value: '1,284,000원' },
  { label: 'FCPS 상승', value: '+64점 · 실버 → 골드' },
  { label: '보증금 반환', value: '전액 반환' },
];

// ── 비상 착륙 안내 (support) ──────────────────────────────────────────────
export type BizTypeKey = '소상공인' | '개인사업자';

export const supportProductDefs: { name: string; target: string; cta: string; fit: '적합' | '검토' | '참고'; bizTypes: BizTypeKey[] }[] = [
  { name: '소상공인119Plus', target: '매출이 줄어든 소상공인 · 연체 전 단계', cta: '상담 예약', fit: '적합', bizTypes: ['소상공인'] },
  { name: '햇살론119', target: '연체 위험이 감지된 자영업자', cta: '자격 확인', fit: '적합', bizTypes: ['소상공인', '개인사업자'] },
  { name: '개인사업자 채무조정', target: '다중채무 상태인 개인사업자', cta: '상담 예약', fit: '검토', bizTypes: ['개인사업자'] },
  { name: '폐업자 지원', target: '폐업을 검토 중이거나 진행한 경우', cta: '안내 보기', fit: '참고', bizTypes: ['소상공인', '개인사업자'] },
];

export const fitColor: Record<'적합' | '검토' | '참고', { bg: string; fg: string }> = {
  적합: { bg: color.mint, fg: color.ink },
  검토: { bg: color.sky, fg: color.ink },
  참고: { bg: '#DDE2E5', fg: 'rgba(22,25,28,.5)' },
};

// ── iM 상품 라운지 (products) ─────────────────────────────────────────────
export type ProductTabKey = '전체' | '목표' | '신용';
export type ProductTheme = 'mint' | 'sky' | 'white' | 'coral';

export interface ProductDef {
  tag: string;
  name: string;
  icon: string;
  reason: string;
  k1: string; v1: string; k2: string; v2: string;
  cta: string;
  theme: ProductTheme;
  tabs: ProductTabKey[];
}

export const productDefs: ProductDef[] = [
  { tag: '목적지 연계', name: 'iM 목표적금 3개월', icon: '적', reason: '등록한 목적지 도착일과 만기가 같고, 구간 성공분 18,000원이 자동으로 적립됩니다.', k1: '금리', v1: '연 3.6%', k2: '월 납입', v2: '20만원', cta: '자동이체 설정', theme: 'mint', tabs: ['전체', '목표'] },
  { tag: '정책상품', name: '청년미래적금', icon: '청', reason: '자립준비청년 요건을 이미 충족해 별도 서류 없이 신청할 수 있습니다.', k1: '정부 기여', v1: '월 3만원', k2: '가입 기간', v2: '3년', cta: '자격 확인', theme: 'sky', tabs: ['전체', '목표'] },
  { tag: '마일리지 보완', name: 'iM 체크카드', icon: '체', reason: '마일리지 중 신용거래형태 항목이 약합니다. 월 30만원을 6개월 유지하면 +24점이 예상됩니다.', k1: '예상 상승', v1: '+24점', k2: '유지 기간', v2: '6개월', cta: '카드 신청', theme: 'white', tabs: ['전체', '신용'] },
  { tag: '부채 조정', name: '대환대출 · 한도 조정 상담', icon: '대', reason: '카드 한도 소진율이 82%로 높아 이자 부담이 큰 상태로 감지됐습니다.', k1: '월 절감', v1: '4.1만원', k2: '소진율', v2: '82→55%', cta: '상담 예약', theme: 'coral', tabs: ['전체', '신용'] },
];

export const productThemes: Record<ProductTheme, {
  bg: string; fg: string; tagBg: string; tagFg: string; reasonBg: string; ctaBg: string; ctaFg: string; subBg: string; subFg: string;
}> = {
  mint: { bg: color.mint, fg: color.ink, tagBg: color.ink, tagFg: color.mint, reasonBg: 'rgba(10,30,26,.10)', ctaBg: color.ink, ctaFg: '#fff', subBg: 'rgba(10,30,26,.10)', subFg: 'rgba(10,30,26,.6)' },
  sky: { bg: color.sky, fg: color.ink, tagBg: color.navy, tagFg: '#fff', reasonBg: 'rgba(255,255,255,.8)', ctaBg: color.navy, ctaFg: '#fff', subBg: 'rgba(10,30,26,.07)', subFg: 'rgba(10,30,26,.55)' },
  white: { bg: '#fff', fg: color.ink, tagBg: color.mintTintLight, tagFg: color.mintDark, reasonBg: '#F2F5F4', ctaBg: color.navy, ctaFg: '#fff', subBg: '#F2F5F4', subFg: 'rgba(10,30,26,.55)' },
  coral: { bg: '#FFE2DA', fg: '#3A1A11', tagBg: color.coralDark, tagFg: '#fff', reasonBg: 'rgba(255,255,255,.82)', ctaBg: color.navy, ctaFg: '#fff', subBg: 'rgba(58,26,17,.08)', subFg: 'rgba(58,26,17,.55)' },
};
