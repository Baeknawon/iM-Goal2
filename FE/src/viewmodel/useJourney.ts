import { useAppStore } from '../store/appStore';
import { personaDefs, acctDefs } from '../data/personas';
import { color } from '../styles/theme';

/**
 * Shared derived "journey" numbers — ported from the design doc's
 * `renderVals()` (the `over`, `grade`, `remaining`, `AP.*` computations).
 * Home / Detail / Salary / Token all read from this so the numbers agree.
 */
export function useJourney() {
  const persona = useAppStore((s) => s.persona);
  const spent = useAppStore((s) => s.spent);
  const fueled = useAppStore((s) => s.fueled);
  const alertOn = useAppStore((s) => s.alertOn);
  const deposit = useAppStore((s) => s.deposit); // 실제 예치한 보증금

  const P = personaDefs[persona];
  const AP = acctDefs[persona];

  const remaining = P.dailyBudget - spent;
  const over = remaining < 0;
  const grade = over ? '이탈' : spent > 5000 ? '주의' : '순항';
  const delayed = over || alertOn;

  const saved = fueled ? AP.post[0].amount : AP.pre[0].amount;
  const savedPct = fueled ? AP.postPct : AP.prePct;
  const savedNum = parseInt(saved.replace(/[^0-9]/g, ''), 10) || 0;
  const targetNum = parseInt(AP.target.replace(/[^0-9]/g, ''), 10) || 0;
  const leftLabel = (targetNum - savedNum).toLocaleString('en-US') + '원';

  // 내가 가진 전체 보유 금액 = 3계좌 잔액의 합 (분배 상태에 따라 pre/post)
  // 보증금 계좌(민트)는 하드코딩값 대신 실제 예치 금액(deposit)으로 통일
  const acctRows = fueled ? AP.post : AP.pre;
  const totalBalanceNum = acctRows.reduce((sum, a) => {
    if (a.dotColor === color.mint) return sum + deposit;
    return sum + (parseInt(a.amount.replace(/[^0-9]/g, ''), 10) || 0);
  }, 0);
  const totalBalance = totalBalanceNum.toLocaleString('en-US');

  return {
    persona, P, AP, fueled, spent, remaining, over, grade, delayed,
    saved, savedPct, leftLabel, totalBalance,
    eta: delayed ? AP.etaLate : AP.etaShort,
    etaFull: delayed ? AP.etaDelayed : AP.eta,
    dday: delayed ? AP.ddayLate : AP.dday,
    etaNote: delayed ? AP.delayNote : '정시 도착 예상',
  };
}
