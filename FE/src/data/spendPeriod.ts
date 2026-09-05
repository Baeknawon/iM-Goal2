export const INITIAL_SPEND_MONTH = 2026 * 12 + 6;

export function monthParts(period: number) {
  return { year: Math.floor(period / 12), month: period % 12 + 1 };
}

export function calendarDays(period: number): (number | null)[] {
  const { year, month } = monthParts(period);
  const offset = new Date(year, month - 1, 1).getDay();
  const count = new Date(year, month, 0).getDate();
  return Array.from({ length: Math.ceil((offset + count) / 7) * 7 }, (_, i) => {
    const day = i - offset + 1;
    return day < 1 || day > count ? null : day;
  });
}

export function formatCalendarAmount(amount: number) {
  return amount === 0 ? '0' : (amount / 10000).toFixed(1);
}
