import { spendingKinds, spendingSummary } from '../data/spendingAnalytics';
const iconPaths = [
  'M4 10h16v3a8 8 0 0 1-16 0v-3Zm2-3h12M12 4v3',
  'M5 3v6m3-6v6M5 6h3M6.5 9v12M17 3v18M17 3c-4 3-4 8 0 8',
  'M5 17V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11H5Zm0-7h14M7 17v3m10-3v3M8 14h1m6 0h1',
  'M4 10h16v10H4V10Zm-1 0 2-6h14l2 6M9 20v-6h6v6',
  'M5 4h14v16H5V4Zm4 5h6m-6 4h6m-6 4h3',
];
export function SpendingRows({ period }: {period:number}) {
  return <div className="insight-category-list">{spendingSummary(period).categories.map(row => <div className="insight-category" key={row.name}>
    <span className="insight-category-icon" style={{background:row.color}}><svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={iconPaths[spendingKinds.findIndex(k=>k.name===row.name)]}/></svg></span>
    <div><b>{row.name}</b><small>{row.count}건 · 비중 {row.share.toFixed(1)}%</small></div>
    <div className="insight-category-right"><b>{row.amount.toLocaleString()}원</b><small className={row.delta !== null && row.delta > 0 ? 'insight-negative' : ''}>{row.delta === null ? '비교 내역 없음' : `${row.delta > 0 ? '+' : ''}${row.delta.toFixed(1)}%`}</small></div>
  </div>)}</div>;
}
