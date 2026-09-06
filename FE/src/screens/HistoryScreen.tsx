import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { longTermHistory } from '../viewmodel/longTermHistory';
import { Screen, ScreenHeader, ScreenBody, Card, InfoNote } from '../components/ui';
export function HistoryScreen(){
 const navigate=useNavigate(),s=useAppStore(),[months,setMonths]=useState(6),data=longTermHistory(s,months);
 return <Screen><ScreenHeader onBack={()=>navigate('/mileage')} sub="기록이 있는 기간만 계산해요" title="금융 습관 기록"/><ScreenBody padBottom={32}><div className="screen-stack">
 <div className="insight-segment">{[3,6].map(n=><button key={n} aria-pressed={months===n} onClick={()=>setMonths(n)}>최근 {n}개월</button>)}</div>
 <Card><h2 className="fcps-section-title">{data.rows[0].label} ~ {data.rows.at(-1)!.label}</h2><div className="insight-habit"><span>미션 성공</span><b>{data.successes} / {data.missions}건</b></div><div className="insight-habit"><span>목표 저축 기록이 있는 달</span><b>{data.savingMonths}개월</b></div><div className="insight-habit"><span>지출 관찰일</span><b>{data.observedDays}일</b></div><div className="insight-habit"><span>4주 유지 확인 기록</span><b>{data.maintenance}건</b></div></Card>
 <InfoNote>초기 미션 이력은 예시 기록을 포함해요. 지출이 없는 날을 예산 준수로 간주하지 않으며, 기록이 없는 달은 0원 소비·실패로 판단하지 않아요. 유지 확인은 관찰 가정 기록입니다. 이 요약은 FCPS를 추가 적립하지 않아요.</InfoNote>
 {[...data.rows].reverse().map(row=><Card key={row.period}><h2 className="fcps-section-title">{row.label}</h2><p className="fcps-description">{row.observedDays?row.observedDays+'일의 소비 기록 · '+row.spending.toLocaleString()+'원':'소비 자료 없음'}<br/>{row.missions?'미션 성공 '+row.successes+' / '+row.missions+'건':'미션 기록 없음'}<br/>{row.savingRecords?'분배로 기록한 저축 '+row.saving.toLocaleString()+'원':'목표 저축 기록 없음'}</p><p className="insight-caption">{row.compliant===null?'월 예산 기준이 없어 준수율 판단 보류':row.observedDays?'관찰일 중 예산 준수 '+row.compliant+' / '+row.observedDays+'일':'거래 자료가 없어 준수율 판단 보류'}</p></Card>)}
 </div></ScreenBody></Screen>;
}
