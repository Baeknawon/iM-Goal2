import { create } from 'zustand';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
export const useSpendPeriod = create<{period:number;changeMonth:(offset:number)=>void}>((set)=>({period:INITIAL_SPEND_MONTH,changeMonth:offset=>set(({period})=>({period:Math.max(12,period+offset)}))}));
