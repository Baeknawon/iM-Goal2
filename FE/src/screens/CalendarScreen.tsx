import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Pill, ScreenBody } from '../components/ui';
import { spendMap, dayTxns } from '../data/staticContent';
import { color } from '../styles/theme';
import { MonthPicker } from '../components/MonthPicker';
import { useSpendPeriod } from '../store/spendPeriodStore';
import { INITIAL_SPEND_MONTH, monthParts, calendarDays, formatCalendarAmount } from '../data/spendPeriod';

const TODAY = 18;

export function CalendarScreen() {
  const navigate = useNavigate();
  const period = useSpendPeriod((s) => s.period);
  const { year, month } = monthParts(period);
  const hasData = period === INITIAL_SPEND_MONTH;
  const [selection, setSelection] = useState({ period: INITIAL_SPEND_MONTH, day: TODAY });
  const selectedDay = selection.period === period ? selection.day : null;

  const cells = useMemo(() => {
    return calendarDays(period).map((day) => ({ day, amt: hasData && day !== null ? spendMap[day] : undefined }));
  }, [period, hasData]);

  return (
    <Screen>
      <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/spend')}>‹ 소비분석</Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>예산을 아낀 날은 민트색이에요</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>소비 달력</div>
      </div>

      <ScreenBody>
        <div className="calendar-month"><div className="calendar-year">{year}년</div><MonthPicker compact /></div>
        <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-2-5)', color: color.ink }}>
          <div className="calendar-unit">단위: 만원</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', textAlign: 'center' }}>
            {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div style={{ marginTop: 'var(--space-1)', display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
            {cells.map((c, i) => {
              if (c.day === null) return <div key={i} style={{ height: 46 }} />;
              const has = c.amt !== undefined;
              const kind = !has ? 'none' : c.amt === 0 ? 'save' : c.amt! > 8000 ? 'over' : 'ok';
              const bg = kind === 'save' ? color.mint : kind === 'over' ? 'var(--color-danger)' : kind === 'ok' ? 'var(--color-60-bg-base)' : 'transparent';
              const fg = kind === 'over' ? 'var(--im-white)' : kind === 'save' ? color.ink : 'var(--color-60-text-secondary)';
              const isSelected = c.day === selectedDay;
              return (
                <div
                  key={i}
                  onClick={() => setSelection({ period, day: c.day! })}
                  style={{
                    height: 46, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 1, background: bg, cursor: 'pointer',
                    outline: isSelected ? '2px solid var(--color-60-text-primary)' : undefined, outlineOffset: isSelected ? 1 : undefined,
                  }}
                >
                  <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: fg }}>{c.day}</span>
                  <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: fg }}>
                    {has ? formatCalendarAmount(c.amt!) : ''}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--color-60-border)', display: 'flex', gap: 'var(--space-1-5)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)' }}>
            <Legend color={color.mint} label="예산 절약" />
            <Legend color="var(--color-60-bg-base)" label="보통" />
            <Legend color="var(--color-danger)" label="초과" />
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)' }}>
          <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{month}월 {selectedDay !== null ? `${selectedDay}일 · 주요 내역` : '· 날짜를 선택해주세요'}</div>
          <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
            {(hasData && selectedDay === TODAY ? dayTxns : []).map((t) => (
              <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', background: t.iconBg, color: t.iconFg }}>{t.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{t.name}</div>
                  <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{t.meta}</div>
                </div>
                <div style={{ flex: 'none', whiteSpace: 'nowrap', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{t.amount}</div>
              </div>
            ))}
            {(!hasData || selectedDay !== TODAY) && (
              <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>내역이 없습니다.</div>
            )}
          </div>
        </div>
      </ScreenBody>
    </Screen>
  );
}

function Legend({ color: c, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 12, height: 12, borderRadius: 4, background: c }} />
      <span style={{ color: 'var(--color-60-text-secondary)' }}>{label}</span>
    </div>
  );
}
