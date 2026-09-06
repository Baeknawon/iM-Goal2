const recoveryGrade = {awaiting:'변화 확인 중',monitoring:'유지 관찰 중',confirmed:'4주 유지',reintervene:'재조정 필요',unverifiable:'판단 보류'};
import { financePlan } from './finance';
import { useAppStore } from '../store/appStore';
import { personaDefs, acctDefs } from '../data/personas';
import { color } from '../styles/theme';

/**
 * Shared derived "journey" numbers — ported from the design doc's
 * `renderVals()` (the `over`, `grade`, `remaining`, `AP.*` computations).
 * Home / Detail / Salary / Token all read from this so the numbers agree.
 */
export function useJourney() {
  const state = useAppStore();
  const plan = financePlan(state);
  const persona = state.persona;
  const spent = plan.today;
  const fueled = useAppStore((s) => s.fueled);
  const alertOn = useAppStore((s) => s.alertOn);
  const latest = useAppStore((s) => s.fcpsLog[0]);
  const missionOn = useAppStore((s) => s.missionOn);


  const P = {...personaDefs[persona], dailyBudget:plan.dailyBudget,goalName:plan.goal.name,goalAmountLabel:plan.goal.target.toLocaleString()+'원'};
  const base = acctDefs[persona];
  const pre=base.pre.map((a,i)=>({...a,desc:i===0?'목표에 모아둔 금액':a.dotColor===color.mint?'사용 가능 '+state.wallet.toLocaleString()+'원 · 예치 '+state.locked.toLocaleString()+'원':'보유 자산 중 생활비와 분배 기록',delta:'현재 기록 기준',amount:(i===0?plan.goal.saved:a.dotColor===color.mint?state.wallet+state.locked:Math.max(0,state.incomeAssets-plan.goal.saved+state.salaryLog.reduce((n,r)=>n+r.saving,0))+state.salaryLog.reduce((n,r)=>n+r.living,0)).toLocaleString()}));
  const post=pre.map((a,i)=>i===0?{...a,amount:Math.min(plan.goal.target,plan.goal.saved+(fueled?0:plan.monthlySaving)).toLocaleString()}:a);
  const AP = {...base,pre,post,prePct:plan.savedPct,postPct:Math.min(100,Math.round(Math.min(plan.goal.target,plan.goal.saved+plan.monthlySaving)/plan.goal.target*100)),total:state.incomeMonthly.toLocaleString(),weekAvg:Math.round(plan.monthlySaving*7/30).toLocaleString()+'원',weekNeed:Math.round(plan.requiredSaving*7/30).toLocaleString()+'원',target:plan.goal.target.toLocaleString()+'원',span:plan.goal.months+'개월',eta:plan.eta,etaShort:plan.eta,etaLate:plan.eta,etaDelayed:plan.eta,etaFast:plan.eta};

  const remaining = P.dailyBudget - spent;
  const over = remaining < 0;
  const completedPlan = !missionOn && !alertOn && !fueled ? latest?.recoveryPlan : undefined;
  const grade = !missionOn && latest?.recovery ? recoveryGrade[latest.recovery.status] : over ? '이탈' : spent > P.dailyBudget * .8 ? '주의' : '순항';
  const delayed = plan.delayDays > 0;

  const saved = plan.goal.saved.toLocaleString()+'원';
  const savedPct = plan.savedPct;
  const savedNum = parseInt(saved.replace(/[^0-9]/g, ''), 10) || 0;
  const targetNum = parseInt(AP.target.replace(/[^0-9]/g, ''), 10) || 0;
  const leftLabel = (targetNum - savedNum).toLocaleString('en-US') + '원';

  // 내가 가진 전체 보유 금액 = 3계좌 잔액의 합 (분배 상태에 따라 pre/post)
  // 보증금 계좌(민트)는 하드코딩값 대신 실제 예치 금액(deposit)으로 통일
  const acctRows = fueled ? AP.post : AP.pre;
  const totalBalanceNum = acctRows.reduce((sum, a) => {

    return sum + (parseInt(a.amount.replace(/[^0-9]/g, ''), 10) || 0);
  }, 0);
  const totalBalance = totalBalanceNum.toLocaleString('en-US');

  const recoveredDays = completedPlan && latest?.result === 'success' ? completedPlan.recoverDays : 0;
  return {
    plan, persona, P, AP, fueled, spent, remaining, over, grade, delayed,
    saved, savedPct, leftLabel, totalBalance,
    eta: delayed ? AP.etaLate : AP.etaShort,
    etaFull: delayed ? AP.etaDelayed : AP.eta,
    dday: plan.daysLeft===null ? '계획 조정' : `D-${plan.daysLeft}`,
    etaNote: plan.daysLeft===null ? '소비예산 또는 목표 기간을 조정해주세요' : completedPlan ? `저축 실행 시 ${recoveredDays}일 회복 예상` : delayed ? `${plan.delayDays}일 지연 예상` : '현재 예산 유지 기준',
  };
}
