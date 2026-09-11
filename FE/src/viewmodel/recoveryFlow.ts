import type { financePlan } from './finance';
import { acctDefs, personaDefs } from '../data/personas';
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

/**
 * 시나리오별 회복 효과(데모 고정값). 실제 계산 스케일이 목표(수백만~수천만) 대비 미미해
 * "며칠 지연 → 며칠 회복"이 0으로 뭉개지므로, 페르소나별로 그럴듯한 지연/회복 일수를 고정한다.
 *  delay: 이탈로 목표 도착이 밀리는 일수(기준 14일 미션 가정), recover: 이 미션으로 되돌리는 일수.
 * 미션 기간(missionDays)에 비례해 스케일한다(길수록 더 회복).
 */
const recoveryScenario: Record<PersonaKey, { delay: number; recover: number }> = {
  A: { delay: 8, recover: 5 },
  B: { delay: 12, recover: 7 },
  C: { delay: 9, recover: 6 },
};

/** 시연 가정: 절약액을 전액 목표 저축에 이어갈 때의 환산 효과. 실제 이체가 아님. */
export function recoveryPlan(persona: PersonaKey, missionDays: number, spent: number, finance?: ReturnType<typeof financePlan>, savingPerWeek = weeklySavings[persona]): RecoveryPlan {
  const account = acctDefs[persona];
  const delayedDday = finance ? (finance.daysLeft ?? 0) : Number(account.ddayLate.replace(/\D/g, ''));
  const savings = Math.round(savingPerWeek * missionDays / 7);
  // 지연/회복은 시나리오 고정값을 미션 기간(기준 14일)에 비례해 스케일. 회복은 지연을 넘지 않는다.
  const sc = recoveryScenario[persona];
  const scale = missionDays / 14;
  const delayDays = Math.max(1, Math.round(sc.delay * scale));
  const recoverDays = Math.min(delayDays, Math.max(1, Math.round(sc.recover * scale)));
  return { missionDays, savings, delayDays, delayedDday, recoverDays,
    overspend: Math.max(0, spent - (finance ? finance.dailyBudget : personaDefs[persona].dailyBudget)),
  };
}

export const recoveryCriteria = {
  A: { rule: '각 주의 배달 결제가 1회 이하', success: '주별 배달 결제 각 1회 · 모든 주 기준 충족', fail: '첫 주 배달 결제 3회 · 주 1회 기준 초과', source: '배달 업종 카드 결제 내역' },
  B: { rule: '고정비 4건 점검 완료 + 카드 소진율 70% 이하', success: '고정비 4건 점검 완료 · 카드 소진율 68%', fail: '고정비 2건만 점검 · 카드 소진율 76%', source: '고정비 점검 기록 · 사업용 카드 매입 내역' },
  C: { rule: '카드 소진율 60% 이하 + 신규 리볼빙 이용 0건', success: '카드 소진율 58% · 신규 리볼빙 0건', fail: '카드 소진율 74% · 신규 리볼빙 1건', source: '카드 잔액·한도 · 리볼빙 이용 내역' },
};
