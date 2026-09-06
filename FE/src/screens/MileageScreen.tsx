import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, ScreenBody } from '../components/ui';
import { useAppStore } from '../store/appStore';
import { calculateFcps } from '../viewmodel/fcpsScore';
import { mockMileageHistory, FCPS_INITIAL_SCORE, formatMissionDate } from '../data/mileageHistory';
import { fcpsFactors } from '../data/staticContent';

export function MileageScreen() {
  const navigate=useNavigate();
  const entries=useAppStore(s=>s.fcpsLog);
  const score=calculateFcps(entries);
  const [recent,setRecent]=useState(false);
  const [selection,setSelection]=useState<number|null>(null);
  const points=[{date:'2026.02.01',title:'금융 행동 기록 시작',balance:FCPS_INITIAL_SCORE,delta:0},...mockMileageHistory,...[...entries].reverse().map((entry,i,all)=>({date:formatMissionDate(entry.completedAt),title:entry.mission,balance:score.base+all.slice(0,i+1).reduce((s,e)=>s+e.delta,0),delta:entry.delta}))];
  const visible=recent?points.slice(-4):points;
  const index=Math.min(selection??visible.length-1,visible.length-1);
  const selected=visible[index];
  const min=Math.floor((Math.min(...visible.map(p=>p.balance))-20)/20)*20;
  const max=Math.ceil((Math.max(...visible.map(p=>p.balance))+20)/20)*20;
  const x=(i:number)=>12+i/Math.max(visible.length-1,1)*276;
  const y=(v:number)=>140-(v-min)/(max-min)*112;
  const path=visible.map((p,i)=>`${x(i)},${y(p.balance)}`).join(' ');
  const change=visible.at(-1)!.balance-visible[0].balance;
  return <Screen><header className="insight-header"><h1>금융 행동 점수</h1><button onClick={()=>navigate('/fcps')}>FCPS란?</button></header>
    <ScreenBody><div className="insight-stack">
      <section className="insight-hero credit-boarding-pass">
        <div className="credit-pass-heading"><span>MY GROWTH PASS</span><span aria-hidden="true">✈</span></div>
        <div className="credit-pass-route"><span>작은 실천</span><span className="credit-pass-route-line" aria-hidden="true"/><span>더 나은 금융 습관</span></div><p className="insight-eyebrow">꾸준한 실천이 쌓인 나의 FCPS</p><div className="insight-number">{score.total}<span>점</span></div><p className="insight-positive">기록 시작 이후 {score.total>=FCPS_INITIAL_SCORE?'+':''}{score.total-FCPS_INITIAL_SCORE}점</p><p className="insight-caption">공식 신용점수와 다른 금융 행동 지표</p>
        <div className="credit-pass-stub"><div><span>기록 시작</span><b>2026.02.01</b></div><button type="button" onClick={()=>navigate('/fcps')}><span>함께 쌓은 기록</span><b>{points.length-1}건 <span aria-hidden="true">›</span></b></button><div className="credit-pass-barcode" aria-hidden="true"/></div>
      </section>
      <section className="insight-section"><div className="insight-section-heading"><h2>점수의 변화</h2><div className="insight-segment"><button aria-pressed={!recent} onClick={()=>{setRecent(false);setSelection(null);}}>전체</button><button aria-pressed={recent} onClick={()=>{setRecent(true);setSelection(null);}}>최근 3건</button></div></div>
        <div className="insight-trend-summary"><b>{change>=0?'+':''}{change}점</b><span>선택 구간 변화</span></div>
        <svg className="insight-trend" viewBox="0 0 320 166" role="img" aria-label={`FCPS ${visible[0].balance}점에서 ${visible.at(-1)!.balance}점으로 변화`}>
          {[min,(min+max)/2,max].map(v=><g key={v}><line x1="12" x2="288" y1={y(v)} y2={y(v)} stroke="#E8ECEB"/><text x="292" y={y(v)+4} fontSize="12" fill="#666">{v}</text></g>)}
          <polygon points={`12,140 ${path} 288,140`} fill="#F0F7F6"/>
          <polyline points={path} fill="none" stroke="#008F7A" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
          <circle cx={x(index)} cy={y(selected.balance)} r="5" fill="#008F7A" stroke="white" strokeWidth="2"/>
        </svg>
        <div className="insight-chart-dates"><span>{visible[0].date}</span><span>{visible.at(-1)!.date}</span></div>
        <label className="insight-point-label" htmlFor="fcps-point">{selected.date} · {selected.title}<b>{selected.balance}점</b></label>
        <input id="fcps-point" className="insight-point-range" type="range" min={0} max={visible.length-1} value={index} aria-valuetext={`${selected.date}, ${selected.balance}점`} onChange={e=>setSelection(Number(e.target.value))}/>
        <p className="insight-caption">기록별 누적 점수 · 간격은 적립 순서 기준 · 세로축 {min}~{max}점</p>
      </section>
      <section className="insight-section"><div className="insight-section-heading"><h2>최근 쌓인 기록</h2><button onClick={()=>navigate('/fcps')}>전체 기록 ›</button></div>
        {points.slice(1).reverse().slice(0,3).map((p,i)=><button className="insight-history" key={`${p.date}-${i}`} onClick={()=>navigate('/fcps')}><span className="insight-history-mark">{p.delta<0?'−':'+'}</span><span><b>{p.title}</b><small>{p.date}</small></span><strong className={p.delta<0?'insight-negative':'insight-positive'}>{p.delta>0?'+':''}{p.delta}점</strong></button>)}
      </section>
      <section className="insight-section"><div className="insight-section-heading"><h2>나의 금융 습관</h2><span>행동 지표 예시</span></div>{fcpsFactors.map(f=><button className="insight-habit" key={f.name} onClick={()=>navigate('/fcps')}><span>{f.name}</span><b>{f.tag}</b><span aria-hidden="true">›</span></button>)}</section>
      <section className="insight-coach"><img src="/assets/ddokdi-credit.png" alt=""/><div><h2>다음 기록도 함께 만들어봐요</h2><p>내 상황에 맞는 미션을 실천하고 변화를 확인하세요.</p><button onClick={()=>navigate('/missionDetail')}>실천할 미션 보기 ›</button></div></section>
      <button className="insight-habit" onClick={()=>navigate('/products')}><span>나에게 맞는 iM 상품</span><span aria-hidden="true">›</span></button>
    </div></ScreenBody></Screen>;
}
