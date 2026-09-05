import { spendMap } from './staticContent';
import { INITIAL_SPEND_MONTH, monthParts } from './spendPeriod';

export const spendingKinds = [
  { name: '배달', icon: '식', color: '#E4F3EF' },
  { name: '외식', icon: '외', color: '#FFF3D9' },
  { name: '교통', icon: '교', color: '#E4F0FF' },
  { name: '편의점', icon: '편', color: '#EEE9FA' },
  { name: '구독', icon: '구', color: '#F0EEE7' },
];
export interface SpendEntry { day: number; category: number; name: string; amount: number }
const july: SpendEntry[] = Object.entries(spendMap).flatMap(([key, amount]) => {
  const day = Number(key);
  if (!amount) return [];
  if (day === 18) return [
    { day, category: 0, name: '배달앱 결제', amount: 23000 },
    { day, category: 3, name: '편의점', amount: 2400 },
    { day, category: 2, name: '버스·지하철', amount: 800 },
  ];
  const category = day % 5;
  return [{ day, category, name: spendingKinds[category].name + ' 결제', amount }];
});
/** Calendar, categories and overview share one demo ledger. June is a comparison fixture. */
export function spendEntries(period: number): SpendEntry[] {
  if (period === INITIAL_SPEND_MONTH) return july;
  if (period === INITIAL_SPEND_MONTH - 1) return july.map((entry) => ({ ...entry, amount: Math.round(entry.amount * (entry.category === 0 ? .74 : .92) / 100) * 100 }));
  return [];
}
export function spendingSummary(period: number) {
  const entries = spendEntries(period);
  const previous = spendEntries(period - 1);
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const previousTotal = previous.reduce((sum, entry) => sum + entry.amount, 0);
  const {year,month} = monthParts(period);
  const days = new Date(year, month, 0).getDate();
  const weeks = Array.from({length: Math.ceil(days / 7)}, (_, i) => ({
    label: `${i + 1}주`, from: i * 7 + 1, to: Math.min(days, (i + 1) * 7),
    amount: entries.filter(e => e.day >= i * 7 + 1 && e.day <= (i + 1) * 7).reduce((sum,e) => sum + e.amount,0),
  }));
  const categories = spendingKinds.map((kind,index) => {
    const rows = entries.filter(e => e.category === index);
    const amount = rows.reduce((sum,e) => sum + e.amount,0);
    const prev = previous.filter(e => e.category === index).reduce((sum,e) => sum + e.amount,0);
    return {...kind, amount, count: rows.length, share: total ? amount / total * 100 : 0, delta: prev ? (amount - prev) / prev * 100 : null};
  }).sort((a,b) => b.amount - a.amount);
  return {entries,total,previousTotal,categories,weeks};
}
