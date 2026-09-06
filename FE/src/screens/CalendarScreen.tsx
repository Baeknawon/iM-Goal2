import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, ScreenHeader, ScreenBody } from '../components/ui';
import { MonthPicker } from '../components/MonthPicker';
import { useSpendPeriod } from '../store/spendPeriodStore';
import { spendingSummary } from '../data/spendingAnalytics';
import { INITIAL_SPEND_MONTH, monthParts, calendarDays, formatCalendarAmount } from '../data/spendPeriod';

export function CalendarScreen() {
  const navigate=useNavigate();
  const period=useSpendPeriod(s=>s.period);
  const {year,month}=monthParts(period);
  const data=spendingSummary(period);
  const [selection,setSelection]=useState({period:INITIAL_SPEND_MONTH,day:18});
  const selected=selection.period===period?selection.day:null;
  const rows=data.entries.filter(e=>e.day===selected);
  return <Screen><ScreenHeader sub={null} onBack={()=>navigate('/spend')} title="소비 달력"/><ScreenBody><div className="insight-stack">
    <section className="insight-section"><div className="calendar-month"><div className="calendar-year">{year}년</div><MonthPicker compact/></div><p className="insight-caption">금액 단위: 만원 · 선택 월 {data.total.toLocaleString()}원</p>
    <div className="insight-calendar">{['일','월','화','수','목','금','토'].map(d=><span key={d}>{d}</span>)}{calendarDays(period).map((day,i)=>{
      if(day===null)return <span key={'blank'+i}/>;
      const amount=data.entries.filter(e=>e.day===day).reduce((sum,e)=>sum+e.amount,0);
      return <button key={day} aria-pressed={selected===day} aria-label={`${month}월 ${day}일 ${amount.toLocaleString()}원`} onClick={()=>setSelection({period,day})} data-level={amount>15000?'high':amount>0?'low':'none'}><b>{day}</b><small>{data.entries.length?formatCalendarAmount(amount):'—'}</small></button>;
    })}</div><p className="insight-caption">색이 진할수록 지출이 많은 날이에요</p></section>
    <section className="insight-section"><div className="insight-section-heading"><h2>{selected===null?'날짜를 선택해주세요':`${month}월 ${selected}일`}</h2><b>{rows.reduce((sum,e)=>sum+e.amount,0).toLocaleString()}원</b></div>{rows.length?rows.map((row,i)=><div className="insight-habit" key={i}><span>{row.name}</span><b>{row.amount.toLocaleString()}원</b></div>):<p className="insight-secondary">표시할 소비 내역이 없습니다.</p>}</section>
  </div></ScreenBody></Screen>;
}
