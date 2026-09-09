import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { financePlan } from '../viewmodel/finance';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
import { Screen, ScreenHeader, ScreenBody, Card, CtaButton, InfoNote } from '../components/ui';
export function SalaryScreen(){
 const navigate=useNavigate(),s=useAppStore(),plan=financePlan(s);
 // 이번 달 분배 기록이 있어도 목표가 아직 미달성(left>0)이면 "반영" 상태로 보지 않는다(데모 반복 대비).
 const record=plan.left>0?undefined:s.salaryLog.find(r=>r.id===s.persona+'-'+INITIAL_SPEND_MONTH);
 const saving=Math.min(plan.left,plan.monthlySaving),wallet=plan.walletReserve,living=Math.max(0,plan.disposable-saving-wallet);
 const rows=record?[['목표 저축',record.saving],['iMKRW 머니',record.wallet],['생활비·여유금',record.living]]:[['목표 저축',saving],['iMKRW 머니',wallet],['생활비·여유금',living]];
 return <Screen><ScreenHeader onBack={()=>navigate('/home')} sub="7월 월소득 기준" title={record?'분배 기록':'급여 분배 확인'}/><ScreenBody padBottom={32}><div className="screen-stack">
 <Card><h2 className="fcps-section-title">{(record?.income??s.incomeMonthly).toLocaleString()}원</h2><p className="fcps-description">고정비·상환 {(record?.reserved??Math.min(s.incomeMonthly,s.incomeFixed+s.goal.repayment)).toLocaleString()}원 먼저 확보</p>{rows.map(([name,value])=><div className="insight-habit" key={name}><span>{name}</span><b>{Number(value).toLocaleString()}원</b></div>)}</Card>
 <Card><h2 className="fcps-section-title">목표 저축에 {record?'반영했어요':'이렇게 반영돼요'}</h2><p className="fcps-description">현재 {s.goal.saved.toLocaleString()}원{!record&&' → '+(s.goal.saved+saving).toLocaleString()+'원'}<br/>현재 예상 도착 {plan.eta}</p>{record&&<p className="insight-caption">기록일 {new Date(record.date).toLocaleString('ko-KR')}</p>}</Card>
 <InfoNote>이 앱 안의 분배 기록입니다. 은행 입금을 조회하거나 실제 이체를 실행하지 않습니다. 같은 달은 한 번만 반영해요.</InfoNote>
 {!record&&<CtaButton disabled={s.incomeMonthly<=0} onClick={()=>{s.setFueled(true);navigate('/home');}}>이 분배를 기록에 반영하기</CtaButton>}
 {record&&<CtaButton onClick={()=>navigate('/home')}>홈화면으로 가기</CtaButton>}
 <CtaButton onClick={()=>navigate('/splitSettings')}>{record?'다음 분배 비율 설정':'비율 직접 조정하기'}</CtaButton>
 </div></ScreenBody></Screen>;
}
