import { currentMission } from '../viewmodel/adaptiveMission';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, ScreenBody, CtaButton, Pill, InfoNote } from '../components/ui';

import { useJourney } from '../viewmodel/useJourney';
import { DEPOSIT_MAX, DEPOSIT_STEP, parseWonLabel, recommendDeposit } from '../viewmodel/depositRecommendation';
import { color } from '../styles/theme';

const won = (value: number) => value.toLocaleString('ko-KR');

export function TokenScreen() {
  const persona = useAppStore((s) => s.persona);
  return <DepositScreen key={persona} />;
}

function DepositScreen() {
  const navigate = useNavigate();
  const { P, AP, saved, savedPct, plan } = useJourney();
  const wallet = useAppStore((s) => s.wallet);
  const income = useAppStore((s) => s.incomeMonthly);
  const fixed = useAppStore((s) => s.incomeFixed);
  const spent = plan.today;
  const missionDays = useAppStore((s) => s.missionDays);
  const history = useAppStore((s) => s.fcpsLog);
  const missionOn = useAppStore((s) => s.missionOn);
  const startMission = useAppStore((s) => s.startMission);

  const mission = currentMission(useAppStore());
  const previousFailed = history.length > 0 && history[0].result !== 'success';
  const recommendation = recommendDeposit({ dailyBudget: P.dailyBudget, missionDays, spent, income, fixed,
    monthlySaving: plan.monthlySaving, wallet,
    remainingGoal: Math.max(0, parseWonLabel(AP.target) - parseWonLabel(saved)), previousFailed });
  const result = mission.allowDeposit ? recommendation : {...recommendation,recommended:0};
  const [custom, setCustom] = useState<number | null>(null);
  const [draft, setDraft] = useState<number | null>(null);
  const deposit = custom ?? result.recommended;
  const shownDeposit = draft ?? deposit;
  const topUp = Math.max(0, shownDeposit - wallet);
  const alreadyLocked = missionOn;

  return (
    <Screen>
      <ScreenHeader onBack={() => navigate('/missionDetail')} rightChip={<Pill>iMKRW 보증금</Pill>}
        sub="목표를 지키는 작은 약속" title="내게 맞는 보증금" />
      <ScreenBody padBottom={24}>
        <div className="screen-stack">
          <div className="deposit-recommendation">
            <span className="deposit-eyebrow">AI 추천 · 현재 상황 기준</span>
            <h2>{!mission.allowDeposit ? '준비 미션은 보증금 없이 시작해요' : result.recommended > 0 ? '생활비 부담까지 생각한 금액이에요' : '지금은 생활비 여유를 먼저 확보해요'}</h2>
            <div className="deposit-value"><strong>{won(shownDeposit)}</strong><span>iMKRW</span></div>
            <div className="deposit-value-meta">
              <span>{draft !== null ? '조정 중인 금액' : custom === null ? 'AI 추천 금액' : '직접 선택한 금액'} · {won(shownDeposit)}원</span>
              <button type="button" className="deposit-change" disabled={result.recommended === 0 || alreadyLocked} aria-expanded={draft !== null} aria-controls="deposit-adjuster" onClick={() => setDraft(deposit)}>바꾸기</button>
            </div>
            {draft !== null && <div id="deposit-adjuster" className="deposit-adjuster">
              <label htmlFor="deposit-range">보증금 조정 <span>1,000원 단위</span></label>
              <input id="deposit-range" type="range" min={DEPOSIT_STEP} max={DEPOSIT_MAX} step={DEPOSIT_STEP} value={draft}
                aria-valuetext={`${won(draft)}원`} onChange={(event) => setDraft(Number(event.target.value))} />
              <div className="deposit-range-labels"><span>1,000원</span><span>50,000원</span></div>
              <p>추천 금액은 {won(result.recommended)}원이에요. {draft > result.recommended ? '더 예치해도 목표 달성이 빨라지는 것은 아니에요.' : '부담이 적은 금액으로 시작해도 괜찮아요.'}</p>
              <button type="button" className="deposit-reset" onClick={() => setDraft(result.recommended)}>추천 금액으로 맞추기</button>
              <div className="deposit-adjust-actions">
                <CtaButton height={52} bg={color.bgAlt} onClick={() => setDraft(null)}>취소</CtaButton>
                <CtaButton height={52} onClick={() => { setCustom(draft === result.recommended ? null : draft); setDraft(null); }}>금액 적용</CtaButton>
              </div>
            </div>}
          </div>
          <section className="deposit-reasons">
            <h2>왜 이 금액을 추천했나요?</h2>
            <p><b>{P.goalName}</b> 목표를 {savedPct}% 달성했어요. <b>{missionDays}일 동안 {mission.title1} {mission.title2}</b>를 실천할 때, 목표 저축과 생활비를 과하게 묶지 않도록 계산했어요.</p>
            <dl>
              <div><dt>하루 예산 × 미션 {missionDays}일</dt><dd>{won(result.periodBudget)}원</dd></div>
              <div><dt>고정비·목표 저축 후 월 여유</dt><dd>{won(result.disposable)}원</dd></div>
              <div><dt>현재 iMKRW 지갑</dt><dd>{won(wallet)}원</dd></div>
            </dl>
            <p>{mission.why}</p>
            {previousFailed && <p>최근 미션이 완료되지 않아, 다시 시작하는 부담을 줄이도록 기본 추천액을 25% 낮췄어요.</p>}
          </section>
          <div className="deposit-wallet"><span>예치 후 지갑 잔액</span><strong>{won(Math.max(0, wallet - shownDeposit))} iMKRW</strong></div>
          {topUp > 0 && <InfoNote>선택 금액이 지갑 잔액보다 {won(topUp)}원 많아요. 아래 예치에 동의하면 부족분 {won(topUp)}원이 자동 충전된 뒤 예치됩니다.</InfoNote>}
          <InfoNote>보증금은 미션 기간 동안만 묶입니다. 현재 기준으로는 성공·실패·포기 모두 전액 반환하고, 수행 결과만 FCPS에 기록해요. 추천 확인이나 금액 조정만으로는 예치되지 않아요.</InfoNote>
        </div>
      </ScreenBody>
      <div className="screen-action-footer">
        {alreadyLocked ? <CtaButton onClick={() => navigate('/missionLive')}>진행 중인 미션 보기</CtaButton>
          : result.recommended === 0 ? <CtaButton onClick={() => navigate('/missionDetail')}>보증금 없는 미션 확인</CtaButton>
          : <CtaButton disabled={draft !== null} onClick={() => { startMission(deposit); navigate('/missionLive'); }}>
            {won(deposit)}원 예치 동의 · 시작
          </CtaButton>}
      </div>
    </Screen>
  );
}
