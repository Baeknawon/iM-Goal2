import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { storageWarning } from '../store/localStorage';
import { Screen, ScreenHeader, ScreenBody, Card, CtaButton, InfoNote } from '../components/ui';
export function DataSettingsScreen(){
 const s=useAppStore(),navigate=useNavigate(),[confirm,setConfirm]=useState(false);
 return <Screen><ScreenHeader sub={null} onBack={()=>navigate('/settings')} title="기기 기록 관리"/><ScreenBody><div className="screen-stack"><Card><h2 className="fcps-section-title">이 브라우저에 저장하고 있어요</h2><p className="fcps-description">목표·예산·거래·분배 설정·미션 결과·회복 확인·지원 준비 목록을 새로고침 후에도 이어볼 수 있어요. 다른 기기와 동기화하지 않아요.</p><p className="fcps-description">미션 {s.fcpsLog.length}건 · 분배 {s.salaryLog.length}건 저장</p></Card>{storageWarning()&&<InfoNote>{storageWarning()}</InfoNote>}<Card><h2 className="fcps-section-title">현재 상황의 기록 초기화</h2><p className="fcps-description">앱에서 만든 기록과 설정을 지우고 시작 상태로 돌아가요. 은행 계좌나 기관에 저장된 자료에는 영향을 주지 않아요.</p>{confirm?<><InfoNote>목표·미션·분배·지원 준비 기록을 초기화할까요? 이전 기록은 복구할 수 없어요.</InfoNote><CtaButton onClick={()=>{s.setPersona(s.persona);s.resetOnboarding();navigate('/picker',{replace:true});}}>기록 초기화하기</CtaButton><CtaButton style={{marginTop:12}} onClick={()=>setConfirm(false)}>취소</CtaButton></>:<CtaButton onClick={()=>setConfirm(true)}>초기화 내용 확인</CtaButton>}</Card></div></ScreenBody></Screen>;
}
