import { useSpendPeriod } from '../store/spendPeriodStore';
import { monthParts } from '../data/spendPeriod';

export function MonthPicker({ compact = false }: { compact?: boolean }) {
  const { period, changeMonth } = useSpendPeriod();
  const { year, month } = monthParts(period);
  return (
    <div className="month-picker">
      <button type="button" aria-label="이전 달" onClick={() => changeMonth(-1)}>‹</button>
      <span aria-live="polite" aria-label={`${year}년 ${month}월`}>
        {compact ? `${month}월` : `${year}년 ${month}월`}
      </span>
      <button type="button" aria-label="다음 달" onClick={() => changeMonth(1)}>›</button>
    </div>
  );
}
