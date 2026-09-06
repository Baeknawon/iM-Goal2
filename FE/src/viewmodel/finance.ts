import type { AppState, PersonaKey } from '../types';
import { spendEntries, type SpendEntry } from '../data/spendingAnalytics';
import { INITIAL_SPEND_MONTH, monthParts } from '../data/spendPeriod';
export interface GoalInput { name: string; target: number; saved: number; months: number; repayment: number }
export interface Transaction extends SpendEntry { id: string; period: number }
export const FINANCE_DATE = '2026-07-31';
export function initialGoal(p: PersonaKey): GoalInput {
  return p === 'A' ? {name:'전세보증금',target:30000000,saved:10000000,months:24,repayment:0}
    : p === 'B' ? {name:'운영자금',target:12360000,saved:4500000,months:6,repayment:0}
    : {name:'비상자금',target:6000000,saved:1800000,months:15,repayment:1330000};
}
export function initialTransactions(): Transaction[] {
  return [INITIAL_SPEND_MONTH-1,INITIAL_SPEND_MONTH].flatMap(period=>spendEntries(period).map((entry,i)=>({...entry,period,id:period+'-'+i})));
}
const won = (n:number)=>n.toLocaleString('ko-KR')+'원';
export function financePlan(s: Pick<AppState,'goal'|'incomeMonthly'|'incomeFixed'|'transactions'|'monthlyBudgets'|'salarySplit'>) {
  const goal=s.goal;
  const {year,month}=monthParts(INITIAL_SPEND_MONTH);
  const days=new Date(year,month,0).getDate();
  const entries=s.transactions.filter(e=>e.period===INITIAL_SPEND_MONTH);
  const total=entries.reduce((sum,e)=>sum+e.amount,0);
  const today=entries.filter(e=>e.day===days).reduce((sum,e)=>sum+e.amount,0);
  const left=Math.max(0,goal.target-goal.saved);
  const disposable=Math.max(0,s.incomeMonthly-s.incomeFixed-goal.repayment);
  const requiredSaving=Math.ceil(left/goal.months);
  const recommendedBudget=Math.max(0,disposable-requiredSaving);
  const walletReserve=s.salarySplit?Math.floor(disposable*s.salarySplit[1]/100):0;
  const splitBudget=s.salarySplit?disposable-Math.floor(disposable*s.salarySplit[0]/100)-walletReserve:recommendedBudget;
  const budget=s.monthlyBudgets[INITIAL_SPEND_MONTH] ?? splitBudget;
  const monthlySaving=Math.max(0,disposable-budget-walletReserve);
  const excess=Math.max(0,total-budget);
  // Only spending above the planned allowance adds a one-off funding shortfall.
  const daysLeft=left===0?0:monthlySaving>0?Math.ceil((left+excess)/monthlySaving*30):null;
  const baselineDays=goal.months*30;
  const date=daysLeft===null?null:new Date(Date.parse(FINANCE_DATE+'T00:00:00Z')+daysLeft*86400000);
  const eta=date && Number.isFinite(date.getTime()) ? date.toISOString().slice(0,10).replaceAll('-','.') : '저축 여력 확인 필요';
  return {walletReserve,goal,left,days,total,today,disposable,requiredSaving,recommendedBudget,budget,monthlySaving,excess,
    dailyBudget:Math.floor(budget/days),daysLeft,eta,baselineDays,
    delayDays:daysLeft===null?0:Math.max(0,daysLeft-baselineDays),
    savedPct:Math.min(100,Math.round(goal.saved/goal.target*100)),
    reasons:[won(s.incomeMonthly)+' − 고정비 '+won(s.incomeFixed)+' − 상환액 '+won(goal.repayment),
      '남은 목표 '+won(left)+' ÷ '+goal.months+'개월 = 월 필요 저축 '+won(requiredSaving),
      '월 소비예산 '+won(budget)+' · '+days+'일 기준 하루 '+won(Math.floor(budget/days)),
      excess>0?'예산 초과 '+won(excess)+'을 일회성 부족액으로 반영했어요.':'예산을 지킨다는 가정으로 예상일을 계산해요.']};
}
