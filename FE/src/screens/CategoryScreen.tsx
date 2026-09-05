import { useNavigate } from 'react-router-dom';
import { Screen, ScreenHeader, ScreenBody } from '../components/ui';
import { SpendingRows } from '../components/SpendingRows';
import { MonthPicker } from '../components/MonthPicker';
import { useSpendPeriod } from '../store/spendPeriodStore';
import { spendingSummary } from '../data/spendingAnalytics';
export function CategoryScreen() {
  const navigate=useNavigate();
  const period=useSpendPeriod(s=>s.period);
  const data=spendingSummary(period);
  return <Screen><ScreenHeader sub={null} onBack={()=>navigate('/spend')} title="카테고리별 소비"/><ScreenBody><div className="insight-stack"><section className="insight-hero"><MonthPicker/><p className="insight-eyebrow">선택한 달의 총소비</p><div className="insight-number">{data.total.toLocaleString()}<span>원</span></div></section>{data.entries.length?<section className="insight-section"><SpendingRows period={period}/><p className="insight-caption">선택 월 전체 · 증감률은 전월 대비 · 목데이터</p><button className="insight-habit" onClick={()=>navigate('/cause')}><span>소비 이탈 원인 살펴보기</span><span>›</span></button></section>:<div className="insight-empty">이 달의 소비 내역이 없습니다.</div>}</div></ScreenBody></Screen>;
}
