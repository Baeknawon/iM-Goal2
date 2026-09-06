import { create } from 'zustand';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
interface SpendPeriodState { period: number; budgets: Record<number,number>; changeMonth:(offset:number)=>void; setBudget:(period:number,value:number)=>void }
export const useSpendPeriod = create<SpendPeriodState>((set) => ({
  period: INITIAL_SPEND_MONTH, budgets: {},
  changeMonth: offset => set(({period})=>({period:Math.max(12,period+offset)})),
  setBudget: (period,value)=>set(s=>Number.isFinite(value)&&value>0&&value<=1000000000?{budgets:{...s.budgets,[period]:value}}:{}),
}));
