import { useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, ScreenBody, Card, CtaButton, InfoNote } from '../components/ui';
import { RecoveryProgressCard } from '../components/RecoveryProgressCard';
import { addDays, nextCheckStage, observationScenario, recoveryLabels, type CheckScenario } from '../viewmodel/recoveryTracking';
const date=(iso:string)=>iso.slice(0,10).replaceAll('-','.');
export function RecoveryScreen(){
 const navigate=useNavigate(),state=useAppStore();
 const [params]=useSearchParams();
 const [scenario,setScenario]=useState<CheckScenario>('improved');
 const requested=params.get('completedAt');
 const entry=requested?state.fcpsLog.find(e=>e.completedAt===requested):state.fcpsLog[0];
 const r=entry?.recovery;
 if(!r)return <Navigate to="/missions" replace/>;
 const stage=nextCheckStage(r),preview=observationScenario(r,scenario);
 const editable=entry===state.fcpsLog[0]&&!state.missionOn&&r.status!=='confirmed'&&!r.interrupted;
 const financial=r.observations.find(o=>o.stage==='finance'&&o.status==='monitoring');
 const reference=stage==='finance'?r.baseline.value:financial!.values[0]!;
 return <Screen><ScreenHeader onBack={()=>navigate('/missions')} sub="미션 이후에도 확인해요" title="회복 확인 상세"/><ScreenBody padBottom={32}>
 <RecoveryProgressCard recovery={r} detail/>
 <InfoNote>후속 금융 조회가 연결되기 전의 체험 흐름입니다. 아래 날짜와 수치는 기간이 지났다고 가정한 관찰 기록이며, 실제 회복 판정이나 계좌 반영 결과가 아닙니다.</InfoNote>
 <Card><h2 className="fcps-section-title">시작 기준과 확인 계획</h2><p className="fcps-description">{r.baseline.label}: {r.baseline.value.toLocaleString()}{r.baseline.unit}<br/>{r.baseline.source}</p><p className="fcps-description">행동 판정 {date(r.completedAt)}<br/>재무 변화 확인 예정 {date(addDays(r.completedAt,7))}<br/>유지 확인 예정 {date(addDays(r.completedAt,35))}</p><p className="fcps-description">{r.baseline.lowerBetter?'시작보다 지표가 감소':'시작보다 여유금이 늘고 0원을 초과'}하면 재무 개선으로 봐요. 이후 4주 모두 개선된 수준을 유지해야 회복을 확인해요.</p></Card>
 {r.observations.map((o,i)=><Card key={i} style={{marginTop:16}}><h2 className="fcps-section-title">{o.stage==='finance'?'2단계 · 재무 변화':'3단계 · 유지 확인'} · {recoveryLabels[o.status]}</h2><p className="fcps-description">{date(o.from)} ~ {date(o.to)}</p><ul className="recovery-values">{o.values.map((v,j)=><li key={j}><span>{o.stage==='finance'?'관찰 결과':(j+1)+'주차'}</span><b>{v===null?'자료 없음':v.toLocaleString()+r.baseline.unit}</b></li>)}</ul><p className="insight-caption">{o.source}</p></Card>)}
 {editable&&<Card style={{marginTop:16}}><h2 className="fcps-section-title">{stage==='finance'?'재무 변화':'4주 유지'} 관찰 결과 확인</h2><p className="fcps-description">비교 기준 {reference.toLocaleString()}{r.baseline.unit} · {date(preview.to)} 확인 가정</p><fieldset className="recovery-options"><legend>확인할 상황</legend>{([{id:'improved',label:stage==='finance'?'개선된 기록':'4주 유지된 기록'},{id:'worse',label:stage==='finance'?'개선이 부족한 기록':'중간에 다시 악화된 기록'},{id:'missing',label:'자료가 부족한 기록'}] as const).map(option=><label key={option.id}><input type="radio" name="recovery-scenario" checked={scenario===option.id} onChange={()=>setScenario(option.id)}/>{option.label}</label>)}</fieldset><p className="fcps-description">{preview.values.map((v,i)=>(stage==='maintenance'?(i+1)+'주 ':'')+(v===null?'자료 없음':v.toLocaleString()+r.baseline.unit)).join(' · ')}</p><CtaButton onClick={()=>state.recordRecoveryCheck(r.completedAt,stage,scenario)}>이 관찰 기록으로 확인하기</CtaButton></Card>}
 <Card style={{marginTop:16}}><h2 className="fcps-section-title">다음 행동</h2><p className="fcps-description">{r.interrupted?'새로운 위험 신호가 들어와 기존 회복 판단을 보류했어요. 새로운 상황에 맞게 미션을 다시 계획해주세요.':r.status==='confirmed'?'4주 동안 개선을 유지했어요. 이후에도 소비·현금흐름을 확인해요.':r.status==='unverifiable'?'자료가 없는 기간은 성공이나 실패로 계산하지 않아요. 관찰 기록이 확보되면 다시 확인해요.':r.status==='reintervene'?'행동은 완료했지만 재무 상태가 충분히 좋아지지 않았어요. 미션을 조정하거나 지원 제도를 살펴보세요.':r.status==='monitoring'?'개선된 지표가 연속 4주 유지되는지 확인해요.':'행동 이후 지출·여유금이 실제로 달라졌는지 확인할 차례예요.'}</p>{(r.status==='reintervene'||r.interrupted)&&<><CtaButton onClick={()=>navigate('/missionDetail')}>미션 다시 계획하기</CtaButton><CtaButton style={{marginTop:12}} onClick={()=>navigate('/support')}>지원 제도 살펴보기</CtaButton></>}<p className="insight-caption">후속 확인은 FCPS를 추가 적립하거나 보증금을 다시 반환하지 않아요. 미션 성공 +18점은 행동 실천 기록입니다.</p></Card>
 </ScreenBody></Screen>;
}
