import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { allocation, suggestedSplit, redistribute } from '../viewmodel/salaryAllocation';
import { Screen, ScreenHeader, ScreenBody, Card, CtaButton, InfoNote } from '../components/ui';
const labels=['목표 저축','iMKRW 머니','생활비·여유금'];
export function SalarySplitSettingsScreen(){
 const navigate=useNavigate(),state=useAppStore();
 const [split,setSplit]=useState(state.salarySplit??suggestedSplit(state));
 const a=allocation(state.incomeMonthly,state.incomeFixed,state.goal.repayment,split,Math.max(0,state.goal.target-state.goal.saved));
 const amounts=[a.saving,a.wallet,a.living];
 return <Screen><ScreenHeader onBack={()=>navigate('/accounts')} sub="고정비와 상환액을 먼저 확보해요" title="급여 분배 설정"/><ScreenBody padBottom={32}><div className="screen-stack">
 <Card><h2 className="fcps-section-title">월소득 {a.income.toLocaleString()}원</h2><p className="fcps-description">고정비·상환 {a.reserved.toLocaleString()}원을 제외한 <b>{a.disposable.toLocaleString()}원</b>을 나눠요.</p><p className="insight-caption">비율 합계 {split.reduce((a,b)=>a+b,0)}% · 원 단위 잔여액과 목표 초과분은 생활비로 배정</p></Card>
 {labels.map((label,i)=><Card key={label}><label htmlFor={'salary-ratio-'+i} className="insight-section-heading"><b>{label}</b><span>{split[i]}% · {amounts[i].toLocaleString()}원</span></label><input style={{width:'100%',marginTop:20,accentColor:'var(--im-mint)'}} id={'salary-ratio-'+i} type="range" min="0" max="100" step="1" value={split[i]} onChange={e=>setSplit(redistribute(split,i,Number(e.target.value)))}/></Card>)}
 <InfoNote>저장하면 현재 월의 직접 입력한 소비예산을 이 비율의 생활비로 바꾸고 목표 예상일도 다시 계산해요. iMKRW 충전은 저축이나 절약액에 포함하지 않아요.</InfoNote>
 <CtaButton onClick={()=>setSplit(suggestedSplit(state))}>추천 비율로 맞추기</CtaButton><CtaButton onClick={()=>{state.setSalarySplit(split);navigate('/salary');}}>이 비율 저장하고 분배 확인</CtaButton><p className="insight-caption">설정과 기록은 이 브라우저에 저장됩니다. 실제 자동이체를 등록하지 않습니다.</p>
 </div></ScreenBody></Screen>;
}
