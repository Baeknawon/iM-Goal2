import { useState } from 'react';
import { currentMission, type FailureReason } from '../viewmodel/adaptiveMission';
import { FailureReasonPicker } from '../components/FailureReasonPicker';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, ScreenBody, Card, CtaButton, InfoNote } from '../components/ui';
import { RecoveryPlanCard } from '../components/RecoveryPlanCard';

import { formatMissionDate } from '../data/mileageHistory';

export function VerifyScreen() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const state = useAppStore();
  const result = params.get('result') === 'fail' ? 'fail' : params.get('result') === 'give_up' ? 'give_up' : 'success';
  const criteria = currentMission(state).criteria;
  const [reason,setReason]=useState<FailureReason>('unknown');
  if (!state.missionOn) return <Navigate to={state.missionResult ? '/release' : '/missionDetail'} replace />;
  return <Screen>
    <ScreenHeader onBack={() => navigate('/missionLive')} sub="행동 기록을 확인해요" title="1단계 · 행동 실천 판정" />
    <ScreenBody padBottom={24}><div className="screen-stack">
      <Card>
        <h2 className="fcps-section-title">{result === 'success' ? '완료 기준을 충족했어요' : result === 'fail' ? '이번에는 기준에 미치지 못했어요' : '미션을 중단할까요?'}</h2>
        <p className="fcps-description">시작 {formatMissionDate(state.missionStartedAt)} · 약정 {state.activeRecoveryPlan?.missionDays ?? state.missionDays}일</p>
        <div className="recovery-note"><b>판정 기준</b><p>{criteria.rule}</p><b>확인한 기록</b><p>{result === 'give_up' ? '사용자 중단 요청 · 미완료 상태로 기록됩니다.' : criteria[result]}</p><b>연결 예정 데이터</b><p>{criteria.source}</p></div>
        <InfoNote>기간 종료 시점의 기록을 가정한 판정입니다. 실제 거래를 조회하거나 실제 수행 기간이 지났다고 판단한 결과는 아닙니다.</InfoNote>
      </Card>
      {result === 'success' && state.activeRecoveryPlan && <RecoveryPlanCard plan={state.activeRecoveryPlan} />}
      {result!=='success'&&<Card><FailureReasonPicker value={reason} onChange={setReason}/><p className="fcps-description">이유는 다음 미션을 조정하는 데만 사용해요. 보증금 반환과 이번 점수에는 영향을 주지 않아요.</p></Card>}
      <Card><h2 className="fcps-section-title">확정하면 이렇게 반영돼요</h2><p className="fcps-description">보증금 {state.deposit.toLocaleString()}원 전액 반환 · FCPS {result === 'success' ? '+18' : result === 'fail' ? '−8' : '−5'}점. 결과와 날짜가 미션 이력에 남습니다. 성공하면 재무 변화 확인 단계로 넘어가며, 아직 회복 완료는 아닙니다.</p></Card>
    </div></ScreenBody>
    <div className="screen-action-footer"><CtaButton onClick={() => { state.finishMission(result,reason); navigate('/release', { replace: true }); }}>{result === 'give_up' ? '중단 확정 · 보증금 반환' : '판정 확인 · 결과 반영'}</CtaButton></div>
  </Screen>;
}
