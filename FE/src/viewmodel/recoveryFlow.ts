import type { financePlan } from './finance';
import { acctDefs, goalPlanDefs, personaDefs } from '../data/personas';
import { parseWonLabel } from './depositRecommendation';
import type { PersonaKey } from '../types';

export interface RecoveryPlan {
  missionDays: number;
  savings: number;
  recoverDays: number;
  delayDays: number;
  delayedDday: number;
  overspend: number;
}
const weeklySavings = { A: 16000, B: 42000, C: 22000 };

/** 시연 가정: 절약액을 전액 목표 저축에 이어갈 때의 환산 효과. 실제 이체가 아님. */
export function recoveryPlan(persona: PersonaKey, missionDays: number, spent: number, finance?: ReturnType<typeof financePlan>, savingPerWeek = weeklySavings[persona]): RecoveryPlan {
  const account = acctDefs[persona];
  const delayedDday = finance ? (finance.daysLeft ?? 0) : Number(account.ddayLate.replace(/\D/g, ''));
  const delayDays = finance ? finance.delayDays : delayedDday - Number(account.dday.replace(/\D/g, ''));
  const savings = Math.round(savingPerWeek * missionDays / 7);
  const dailySaving = (finance ? finance.monthlySaving : parseWonLabel(goalPlanDefs[persona].monthly)) / 30;
  return { missionDays, savings, delayDays, delayedDday,
    recoverDays: dailySaving > 0 ? Math.min(delayDays, Math.floor(savings / dailySaving)) : 0,
    overspend: Math.max(0, spent - (finance ? finance.dailyBudget : personaDefs[persona].dailyBudget)),
  };
}

export const recoveryCriteria = {
  A: { rule: '각 주의 배달 결제가 1회 이하', success: '주별 배달 결제 각 1회 · 모든 주 기준 충족', fail: '첫 주 배달 결제 3회 · 주 1회 기준 초과', source: '배달 업종 카드 결제 내역' },
  B: { rule: '고정비 4건 점검 완료 + 카드 소진율 70% 이하', success: '고정비 4건 점검 완료 · 카드 소진율 68%', fail: '고정비 2건만 점검 · 카드 소진율 76%', source: '고정비 점검 기록 · 사업용 카드 매입 내역' },
  C: { rule: '카드 소진율 60% 이하 + 신규 리볼빙 이용 0건', success: '카드 소진율 58% · 신규 리볼빙 0건', fail: '카드 소진율 74% · 신규 리볼빙 1건', source: '카드 잔액·한도 · 리볼빙 이용 내역' },
};
