import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, ScreenBody, Card, CtaButton, InfoNote } from '../components/ui';
import { supportServices, matchesSupport } from '../data/supportServices';
export function SupportScreen(){
 const navigate=useNavigate(),s=useAppStore();
 const [all,setAll]=useState(false);
 const [selected,setSelected]=useState<string|null>(null);
 const services=all?supportServices:supportServices.filter(service=>matchesSupport(service.id,s.persona));
 return <Screen><ScreenHeader onBack={()=>navigate('/products')} sub="실천과 함께 필요한 지원도 찾아요" title="지원·상담 안내"/><ScreenBody padBottom={32}><div className="screen-stack">
 <InfoNote>현재 상황과 관련된 상담 경로예요. 지원 대상 확정이나 신청 접수를 대신하지 않아요. 실제 조건·구비서류는 공식 공고와 상담에서 확인해주세요.</InfoNote>
 <div className="insight-segment"><button aria-pressed={!all} onClick={()=>setAll(false)}>내 상황</button><button aria-pressed={all} onClick={()=>setAll(true)}>전체 경로</button></div>
 {services.map(service=><Card key={service.id}><p className="insight-eyebrow">{service.group}</p><h2 className="fcps-section-title">{service.name}</h2><p className="fcps-description">{service.why}</p><p className="insight-caption">확인할 대상: {service.target}</p><CtaButton onClick={()=>setSelected(selected===service.id?null:service.id)}>{selected===service.id?'준비 내용 접기':'대상·준비·신청 경로 확인'}</CtaButton>
 {selected===service.id&&<div style={{marginTop:16}}><fieldset className="recovery-options"><legend>상담 전 준비 목록</legend>{service.steps.map((step,i)=><label key={step}><input type="checkbox" checked={s.supportChecks[service.id]?.[i]??false} onChange={()=>s.toggleSupportCheck(service.id,i)}/>{step}</label>)}</fieldset><p className="insight-caption">준비 목록은 신청 필수서류 목록이 아니에요. 체크 여부는 이 기기에 저장됩니다.</p>
 <a className="goal-save service-link" target="_blank" rel="noopener noreferrer" href={service.url} onClick={()=>s.markSupportVisit(service.id)}>공식 안내·신청 경로 열기 ↗</a>{'phone' in service&&<a className="goal-save service-link secondary-link" href={'tel:'+service.phone}>상담 전화 {service.phone}</a>}
 {s.supportVisits[service.id]&&<p className="insight-caption">공식 경로 열기 선택: {new Date(s.supportVisits[service.id]).toLocaleDateString('ko-KR')} · 신청 완료 여부는 기관에서 확인</p>}<p className="insight-caption">안내 확인일 2026.09.06 · 외부 사이트에서 이어집니다.</p></div>}</Card>)}
 <CtaButton onClick={()=>navigate('/missionDetail')}>실천할 미션도 살펴보기</CtaButton>
 </div></ScreenBody></Screen>;
}
