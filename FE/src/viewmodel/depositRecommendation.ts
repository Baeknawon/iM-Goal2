/** Explainable demo policy, not a trained model or a guaranteed optimum. */
export const DEPOSIT_STEP = 1000;
export const DEPOSIT_MAX = 50000;
export interface DepositInputs {
  dailyBudget: number; missionDays: number; spent: number; income: number;
  fixed: number; monthlySaving: number; wallet: number; remainingGoal: number; previousFailed: boolean;
}
export function recommendDeposit(input: DepositInputs) {
  const safe = (v: number) => Number.isFinite(v) ? Math.max(0, v) : 0;
  const dailyBudget = safe(input.dailyBudget);
  const days = Math.max(1, safe(input.missionDays));
  const disposable = Math.max(0, safe(input.income) - safe(input.fixed) - safe(input.monthlySaving));
  const overage = Math.max(0, safe(input.spent) - dailyBudget);
  const periodBudget = dailyBudget * days;
  const base = periodBudget * .1;
  const adjustment = Math.min(overage, dailyBudget) * .25;
  const historyFactor = input.previousFailed ? .75 : 1;
  const candidate = (base + adjustment) * historyFactor;
  const cashCap = disposable * .1;
  const walletCap = safe(input.wallet) * .6;
  const cap = Math.min(DEPOSIT_MAX, cashCap, walletCap, safe(input.remainingGoal));
  const recommended = Math.floor(Math.min(candidate, cap) / DEPOSIT_STEP) * DEPOSIT_STEP;
  return { recommended, disposable, overage, periodBudget, base, adjustment, historyFactor, candidate, cashCap, walletCap, cap };
}
export function parseWonLabel(label: string): number {
  const amount = Number(label.replace(/[^0-9.]/g, ''));
  return Number.isFinite(amount) ? Math.round(amount * (label.includes('만') ? 10000 : 1)) : 0;
}
