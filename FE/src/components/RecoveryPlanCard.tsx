import { Card } from './ui';
import type { RecoveryPlan } from '../viewmodel/recoveryFlow';

export function RecoveryPlanCard({ plan, success = false }: { plan: RecoveryPlan; success?: boolean }) {
  return <Card style={{ marginBottom: 16 }}>
    <h2 className="fcps-section-title">{success ? '이번 행동이 목표에 준 변화' : '이 미션이 목표에 도움이 되는 이유'}</h2>
    <p className="fcps-description">{plan.overspend > 0 ? `하루 예산보다 ${plan.overspend.toLocaleString()}원 초과했어요. ` : ''}최근 소비·재무 상황을 반영한 데모 경로는 {plan.delayDays}일 지연 상태예요.</p>
    <div className="recovery-metrics">
      <div><span>{plan.missionDays}일 실천 시 절약 예상</span><strong>{plan.savings.toLocaleString()}원</strong></div>
      <div><span>목표 도착까지 · 예상</span><strong>D-{plan.delayedDday} → D-{plan.delayedDday - plan.recoverDays}</strong></div>
      <div><span>회복 가능한 기간</span><strong>{plan.recoverDays}일</strong></div>
    </div>
    <p className="fcps-description">절약 예상액을 월 목표 저축액의 하루분으로 나누어 계산했어요. 절약액 전액을 저축한다는 시연 가정이며, 보증금 반환은 절약액에 포함하지 않아요.</p>
  </Card>;
}
