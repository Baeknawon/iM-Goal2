import { useAppStore } from '../store/appStore';
import { spendingSummary } from '../data/spendingAnalytics';
export function useSpending(period:number) { return spendingSummary(period,useAppStore(s=>s.transactions)); }
