import { useNavigate } from 'react-router-dom';
import { Card, CtaButton } from './ui';
import { recoveryLabels, type RecoveryTracking } from '../viewmodel/recoveryTracking';
export function RecoveryProgressCard({recovery,detail=false}:{recovery:RecoveryTracking;detail?:boolean}) {
 const navigate=useNavigate();
 const financial=recovery.observations.some(o=>o.stage==='finance'&&o.status==='monitoring');
 return <Card style={{marginTop:16,marginBottom:16}}><p className="insight-eyebrow">미션 이후 회복 확인</p><h2 className="fcps-section-title">{recoveryLabels[recovery.status]}</h2>
 <ol className="recovery-stages">{[{name:'행동 실천',text:'미션 기준 충족',done:true},{name:'재무 변화',text:financial?'전후 지표 개선 확인':'지출·현금흐름 변화 확인',done:financial},{name:'4주 유지',text:recovery.status==='confirmed'?'연속 4주 기준 충족':'개선 상태의 지속 여부 확인',done:recovery.status==='confirmed'}].map((step,i)=><li key={step.name} data-done={step.done}><span aria-hidden="true">{step.done?'✓':i+1}</span><div><b>{step.name}</b><p>{step.text}</p></div></li>)}</ol>
 <p className="insight-caption">기간 경과를 가정한 관찰 흐름 · 실제 금융 판정 아님</p>
 <p className="fcps-description">미션 성공은 행동 기록이에요. 재무 변화와 유지 기록을 확인한 뒤 회복 여부를 판단해요.</p>
 {!detail&&<CtaButton onClick={()=>navigate('/recovery?completedAt='+encodeURIComponent(recovery.completedAt))}>회복 단계와 근거 보기</CtaButton>}</Card>;
}
