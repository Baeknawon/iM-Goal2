import type { AppState, PersonaKey } from '../types';
import { spendEntries, type SpendEntry } from '../data/spendingAnalytics';
import { INITIAL_SPEND_MONTH, monthParts } from '../data/spendPeriod';
export interface GoalInput { name: string; target: number; saved: number; months: number; repayment: number }
export interface Transaction extends SpendEntry { id: string; period: number }
export const FINANCE_DATE = '2026-07-31';
export function initialGoal(p: PersonaKey): GoalInput {
  // 데모 흐름: 목표 리포트(/report)는 "처음부터 시작"이므로 모아둔 돈 0원.
  //   이후 발권(finishGoal)에서 "시간이 흘러 서비스로 후반까지 모은" 상태(goalSavedLatePhase)로 점프한다.
  // 목표 기간(months)은 원래 스토리대로(24/6/15) → 하루 예산·도착일 계산 정상.
  return p === 'A' ? {name:'전세보증금',target:30000000,saved:0,months:24,repayment:0}
    : p === 'B' ? {name:'운영자금',target:12360000,saved:0,months:6,repayment:0}
    : {name:'비상자금',target:6000000,saved:0,months:15,repayment:1330000};
}

/**
 * 페르소나별 "계획 월 저축액". 하루 예산·소비예산은 이 값에서 파생된다.
 *  - A 833,000: iM 목표적금 월 납입 83.3만과 정합(상품 연계, 고정).
 *  - B 1,792,000: 매출 회복 버퍼 월 적립 179.2만 (소비예산 28.8만 스토리와 정합).
 *  - C 400,000: 비상자금 월 40만.
 * 목표 진행률과 무관하게 고정 → 하루 예산이 안정적이고, 상품·챗봇·리포트 표기가 모두 일치한다.
 */
export const plannedMonthlySaving: Record<PersonaKey, number> = {
  A: 833000, B: 1792000, C: 400000,
};

/**
 * 데모 후반 시점(급여 분배 직전)의 목표 저축액.
 * 리포트에서 "이 계획으로 시작하기" → 발권 시 이 값으로 점프해, 홈이 "100% 직전"으로 보인다.
 * 남은 목표(target − 이 값)가 한 달 저축분(plannedMonthlySaving) 이하라, setFueled 1회로 목표를 넘겨 100% 달성.
 *   (정확히 목표−1개월치가 아니어도 남은 목표가 한 달 저축분 이하이기만 하면 된다.)
 */
export const goalSavedLatePhase: Record<PersonaKey, number> = {
  A: 29200000, B: 10600000, C: 5620000,
};
export function initialTransactions(persona?: PersonaKey): Transaction[] {
  const base = [INITIAL_SPEND_MONTH-1,INITIAL_SPEND_MONTH].flatMap(period=>spendEntries(period).map((entry,i)=>({...entry,period,id:period+'-'+i})));
  // A(자립준비청년)는 소비 기준일(31일)에 이미 하루 연료를 일부 쓴 상태로 시작 → 홈의 "오늘 남은 예산"이
  //   0이 아니라 실제 소비분만큼 줄어 보인다. 배달 이탈 트리거(+23,000)가 여기에 더해져 예산을 초과한다.
  //   A 전용이라 B/C의 공유 소비내역에는 영향이 없다.
  if (persona === 'A') {
    base.push({ period: INITIAL_SPEND_MONTH, id: 'a-today-base', day: 31, category: 1, name: '점심 외식', amount: 22600 });
  }
  return base;
}
const won = (n:number)=>n.toLocaleString('ko-KR')+'원';
/** 앱 전체 날짜 표기 통일: 일자까지 YYYY.MM.DD. 유효하지 않으면 대체 문구. */
export function formatDate(value?: string | number | Date | null, fallback = '날짜 미정'): string {
  if (value === null || value === undefined) return fallback;
  const d = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(d.getTime())) return fallback;
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(d).replaceAll('-', '.');
}
/** FINANCE_DATE(출발일 기준)에서 days일 뒤 날짜를 YYYY.MM.DD로. */
function etaFromStart(days: number | null): string {
  if (days === null) return '저축 여력 확인 필요';
  return formatDate(Date.parse(FINANCE_DATE + 'T00:00:00Z') + days * 86400000, '저축 여력 확인 필요');
}
export function financePlan(s: Pick<AppState,'goal'|'incomeMonthly'|'incomeFixed'|'transactions'|'monthlyBudgets'|'salarySplit'|'persona'>) {
  const goal=s.goal;
  const {year,month}=monthParts(INITIAL_SPEND_MONTH);
  const days=new Date(year,month,0).getDate();
  const entries=s.transactions.filter(e=>e.period===INITIAL_SPEND_MONTH);
  const total=entries.reduce((sum,e)=>sum+e.amount,0);
  const today=entries.filter(e=>e.day===days).reduce((sum,e)=>sum+e.amount,0);
  const left=Math.max(0,goal.target-goal.saved);
  const disposable=Math.max(0,s.incomeMonthly-s.incomeFixed-goal.repayment);
  const requiredSaving=Math.ceil(left/goal.months);
  // 하루 예산은 "계획 월 저축액"에서 파생한다: 소비예산 = 가용 − 계획저축, 하루 = 소비예산 ÷ 일수.
  //  계획저축(plannedMonthlySaving)이 상품·챗봇 표기와 정합하는 고정값이라, 저축·하루예산·상품이 서로 어긋나지 않는다.
  //  진행률과 무관하게 고정되므로 홈·알림·소비분석이 모두 같은 하루 예산을 본다.
  const recommendedBudget=Math.max(0,disposable-plannedMonthlySaving[s.persona]);
  const walletReserve=s.salarySplit?Math.floor(disposable*s.salarySplit[1]/100):0;
  const splitBudget=s.salarySplit?disposable-Math.floor(disposable*s.salarySplit[0]/100)-walletReserve:recommendedBudget;
  // 우선순위: 사용자가 직접 설정한 월 예산 > 분배 비율 예산 > 계획 하루예산 기반 기본값.
  const budget=s.monthlyBudgets[INITIAL_SPEND_MONTH] ?? splitBudget;
  const monthlySaving=Math.max(0,disposable-budget-walletReserve);
  const excess=Math.max(0,total-budget);
  // 후반 상태(목표 근접)에서도 초과지출이 도착 예측에 반영되도록 left===0 하드 핀을 제거한다.
  //  effectiveLeft = 남은 목표(max(left,0)) + 일회성 초과지출(excess).
  //  effectiveLeft가 0(목표 달성·초과 없음)이면 도착일은 D-0, 그 외에는 현재 페이스(monthlySaving)로 산출.
  //  left가 0이어도 excess가 있으면 effectiveLeft>0 → 예측 도착일이 지연된다.
  const effectiveLeft=Math.max(left,0)+excess;
  const daysLeft=effectiveLeft===0?0:monthlySaving>0?Math.ceil(effectiveLeft/monthlySaving*30):null;
  const baselineDays=goal.months*30;
  // 출발일(FINANCE_DATE) 기준 도착일 — 계획(고정)과 예측(연동)을 분리한다.
  const startDate=formatDate(FINANCE_DATE);            // 출발일
  const plannedEta=etaFromStart(baselineDays);         // 계획 도착(목표 기간 기준, 고정)
  const predictedEta=etaFromStart(daysLeft);           // 예측 도착(현재 페이스+excess 반영, 연동)
  const eta=predictedEta;                              // 하위 호환 별칭(기존 소비처 유지)
  const aheadDays=daysLeft===null?0:Math.max(0,baselineDays-daysLeft);
  // 가상 현재 시점(virtualNow): 데모 세계관의 "지금"은 소비 기준일(FINANCE_DATE)로 고정한다.
  //  진행률에 따라 현재 시점이 미래로 튀지 않아, 여정 상세의 now·이탈·미션 이벤트 날짜가 항상 같은 시기로 정합된다.
  const virtualNow=startDate;                          // = 2026.07.31 (FINANCE_DATE)
  return {walletReserve,goal,left,days,total,today,disposable,requiredSaving,recommendedBudget,budget,monthlySaving,excess,effectiveLeft,
    dailyBudget:Math.floor(budget/days),daysLeft,eta,predictedEta,baselineDays,startDate,plannedEta,virtualNow,aheadDays,
    // 지연일 = 예측 도착(daysLeft)이 계획 도착(baselineDays)보다 늦은 정도.
    delayDays:daysLeft===null?0:Math.max(0,daysLeft-baselineDays),
    savedPct:Math.min(100,Math.round(goal.saved/goal.target*100)),
    reasons:[won(s.incomeMonthly)+' − 고정비 '+won(s.incomeFixed)+' − 상환액 '+won(goal.repayment)+' = 가용 '+won(disposable),
      '월 소비예산 '+won(budget)+' · '+days+'일 기준 하루 '+won(Math.floor(budget/days)),
      '가용에서 소비예산을 뺀 '+won(monthlySaving)+'을 목표 저축에 넣어요',
      excess>0?'예산 초과 '+won(excess)+'을 일회성 부족액으로 반영했어요.':'예산을 지킨다는 가정으로 예상일을 계산해요.']};
}
