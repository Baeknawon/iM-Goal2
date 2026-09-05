import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, ScreenBody } from '../components/ui';
import { MonthPicker } from '../components/MonthPicker';
import { SpendingRows } from '../components/SpendingRows';
import { useSpendPeriod } from '../store/spendPeriodStore';
import { spendingSummary } from '../data/spendingAnalytics';
import { monthParts } from '../data/spendPeriod';

export function SpendScreen() {
  const period=useSpendPeriod(s=>s.period);
  return <SpendContent key={period}/>;
}
function SpendContent() {
  const navigate=useNavigate();
  const period=useSpendPeriod(s=>s.period);
  const {month}=monthParts(period);
  const data=spendingSummary(period);
  const budgets=useSpendPeriod(s=>s.budgets);
  const setBudget=useSpendPeriod(s=>s.setBudget);
  const [editing,setEditing]=useState(false);
  const [draft,setDraft]=useState('');
  const [selection,setSelection]=useState({period,week:2});
  const budget=budgets[period];
  const week=selection.period===period?selection.week:0;
  const selected=data.weeks[week];
  const difference=week>0?selected.amount-data.weeks[week-1].amount:null;
  return <Screen><header className="insight-header"><h1>소비분석</h1><button onClick={()=>navigate('/calendar')}>소비 달력 <span aria-hidden="true">↗</span></button></header>
    <ScreenBody><div className="insight-stack">
      <section className="insight-hero"><MonthPicker />
        <p className="insight-eyebrow">{month}월 총소비</p><div className="insight-number">{data.total.toLocaleString()}<span>원</span></div>
        <p className="insight-secondary">{data.previousTotal?`지난달보다 ${Math.abs(data.total-data.previousTotal).toLocaleString()}원 ${data.total>=data.previousTotal?'더 썼어요':'덜 썼어요'}`:'지난달 비교 내역이 없어요'}</p>
        <span className="insight-caption">월 전체 기준 · {data.entries.length}건</span>
      </section>
      {data.entries.length>0?<>
        <section className="insight-budget"><div className="insight-section-heading"><h2>{budget?'설정한 예산':'이번 달 예산을 정해보세요'}</h2><button onClick={()=>{setDraft(budget?String(budget):'');setEditing(!editing);}}>{budget?'변경':'설정하기'}</button></div>
          {budget?<><div className="insight-budget-values"><b>{Math.abs(budget-data.total).toLocaleString()}원 {budget>=data.total?'남았어요':'초과했어요'}</b><span>예산 {budget.toLocaleString()}원</span></div><div className="insight-budget-track"><div style={{width:`${Math.min(100,data.total/budget*100)}%`}} /></div></>:<p className="insight-secondary">사용할 수 있는 금액을 정하면 소비 속도를 비교하기 쉬워요.</p>}
          {editing&&<form className="insight-budget-form" onSubmit={e=>{e.preventDefault();const value=Number(draft);if(Number.isFinite(value)&&value>0){setBudget(period,value);setEditing(false);}}}><label htmlFor="monthly-budget">월 예산 (원)</label><input id="monthly-budget" type="number" min="1" max="1000000000" required value={draft} onChange={e=>setDraft(e.target.value)} placeholder="예: 300000"/><div><button type="button" onClick={()=>setEditing(false)}>취소</button><button type="submit">예산 저장</button></div></form>}
        </section>
        <section className="insight-section"><div className="insight-section-heading"><h2>주차별 소비</h2><span>단위: 원</span></div>
          <div className="insight-week-value"><b>{selected.amount.toLocaleString()}원</b><span>{month}월 {selected.from}~{selected.to}일</span></div>
          <div className="insight-weeks">{data.weeks.map((w,i)=><button key={w.label} aria-pressed={i===week} aria-label={`${w.label}, ${w.amount.toLocaleString()}원`} onClick={()=>setSelection({period,week:i})}><span className="insight-week-track"><span style={{height:`${w.amount/Math.max(...data.weeks.map(w=>w.amount),1)*100}%`}} /></span><span>{w.label}</span></button>)}</div>
          <p className="insight-secondary">{difference===null?'주를 선택하면 소비 금액을 확인할 수 있어요.':`앞 주보다 ${Math.abs(difference).toLocaleString()}원 ${difference>=0?'늘었어요':'줄었어요'}.`}</p><p className="insight-caption">1~7일을 1주로 집계 · 마지막 주는 남은 날짜만 포함</p>
        </section>
        <section className="insight-section"><div className="insight-section-heading"><h2>어디에 많이 썼나요?</h2><button onClick={()=>navigate('/category')}>전체 보기 ›</button></div><SpendingRows period={period}/><p className="insight-caption">금액·건수·비중은 선택 월 기준 / 증감률은 전월 대비</p></section>
        <section className="insight-coach"><img src="/assets/ddokdi-credit.png" alt=""/><div><h2>지출을 줄일 방법도 살펴볼까요?</h2><p>내 상황에 맞는 회복 미션과 예상 효과를 확인해요.</p><button onClick={()=>navigate('/missionDetail')}>추천 미션 확인 ›</button></div></section>
      </>:<div className="insight-empty">이 달에는 기록된 소비가 없어요.<br/>다른 달을 선택해 확인해보세요.</div>}
    </div></ScreenBody></Screen>;
}
