import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { calculateFcps } from '../viewmodel/fcpsScore';
import { behaviorFactors } from '../viewmodel/longTermHistory';
import { Screen, ScreenHeader, ScreenBody, Card, InfoNote } from '../components/ui';
import { color } from '../styles/theme';
import { FCPS_INITIAL_SCORE, mockMileageHistory, formatMissionDate } from '../data/mileageHistory';

export function FcpsDetailScreen() {
  const navigate = useNavigate();
  const state=useAppStore();
  const entries=state.fcpsLog;
  const factors=behaviorFactors(state);
  const score = calculateFcps(entries);
  return <Screen>
    <ScreenHeader onBack={() => navigate('/mileage')} sub="금융 행동의 기록" title="FCPS 점수 상세" />
    <ScreenBody padBottom={40}>
      <div className="screen-stack">
        <Card>
          <div className="credit-score-label">현재 FCPS 점수</div>
          <div className="credit-score"><strong>{score.total}</strong><span>점</span></div>
          <div className="fcps-equation">시작 {FCPS_INITIAL_SCORE}점 + 과거 적립 {score.base - FCPS_INITIAL_SCORE}점 {score.change >= 0 ? '+' : '−'} 새 미션 {Math.abs(score.change)}점</div>
          <p className="fcps-description">예산을 지키고 저축과 미션을 이어오며 쌓인 기록이에요.</p>
        </Card>
        <Card>
          <h2 className="fcps-section-title">마일리지 쌓인 기록</h2>
          <p className="fcps-description">과거 기록 · 최신순</p>
          {[...mockMileageHistory].reverse().map((entry) => <div className="fcps-history-row" key={entry.date}>
            <div><small>{entry.date}</small><p><b>{entry.title}</b></p><small>{entry.description}</small></div>
            <div className="fcps-history-total"><strong>+{entry.delta}점</strong><small>누적 {entry.balance}점</small></div>
          </div>)}
          <div className="fcps-history-row">
            <div><small>2026.02.01</small><p><b>금융 행동 기록 시작</b></p><small>FCPS 시작 기준 점수</small></div>
            <div className="fcps-history-total"><strong>{FCPS_INITIAL_SCORE}점</strong><small>시작 점수</small></div>
          </div>
        </Card>
        <Card>
          <h2 className="fcps-section-title">어떤 행동을 보고 있나요?</h2>
          {factors.map((factor) => <details className="fcps-factor" key={factor.name}>
            <summary><span>{factor.name}</span><strong>{factor.tag}</strong></summary>
            <p className="fcps-description">{factor.description}</p>
          </details>)}
          <p className="fcps-description">위 지표는 저장된 기록을 요약한 값이며 점수 배점이 아닙니다. 적립 점수와 사유는 마일리지 기록에서 확인할 수 있어요.</p>
        </Card>
        <Card>
          <h2 className="fcps-section-title">새로 쌓인 내역</h2>
          {entries.length === 0 ? <p className="fcps-description">아직 완료한 미션이 없어요. 미션을 완료하면 결과와 점수 변화가 여기에 표시됩니다.</p>
            : entries.map((entry, i) => <div className="fcps-history-row" key={i}>
              <div><small>{formatMissionDate(entry.completedAt)} · 완료</small><p><b>{entry.label}</b></p><p>{entry.mission}</p><small>보증금 {entry.deposit.toLocaleString()}원 반환</small></div>
              <div className="fcps-history-total"><strong style={{ color: entry.delta >= 0 ? color.mintDark : color.coral }}>{entry.delta >= 0 ? '+' : ''}{entry.delta}점</strong><small>누적 {score.base + entries.slice(i).reduce((sum, item) => sum + item.delta, 0)}점</small></div>
            </div>)}
        </Card>
        <InfoNote>점수 반영 기준: 미션 성공 +18점, 실패 −8점, 포기 −5점. 성공 점수는 행동 완료에 대한 기록이며 재무 회복이나 4주 유지 확인 점수가 아닙니다. 보증금 액수는 가산점에 영향을 주지 않으며, 반환과 행동 평가는 별개예요. FCPS는 공식 신용점수와 다릅니다.</InfoNote>
      </div>
    </ScreenBody>
  </Screen>;
}
