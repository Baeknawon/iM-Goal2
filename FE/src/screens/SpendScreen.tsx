import { useNavigate } from 'react-router-dom';
import { Screen, Brand, ScreenBody } from '../components/ui';
import { MonthPicker } from '../components/MonthPicker';
import { useSpendPeriod } from '../store/spendPeriodStore';
import { INITIAL_SPEND_MONTH } from '../data/spendPeriod';
import { spendCategories, weekVals } from '../data/staticContent';
import { color } from '../styles/theme';

export function SpendScreen() {
  const navigate = useNavigate();
  const period = useSpendPeriod((s) => s.period);
  const hasData = period === INITIAL_SPEND_MONTH;
  return (
    <Screen>
      <div style={{ padding: '60px var(--screen-padding-x) 0' }}>
        <Brand size={20} style={{ marginBottom: 'var(--space-1-5)' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <MonthPicker />
          <div onClick={() => navigate('/settings')} style={{ width: 38, height: 38, borderRadius: '50%', background: color.mint, cursor: 'pointer' }} />
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>예산을 어디에 썼나요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>소비 분석</div>
      </div>

      <ScreenBody>
        {hasData ? <>
        <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: color.ink, border: '1px solid var(--color-60-border)', boxShadow: 'var(--shadow-card)' }}>
          <div className="spend-summary">
            <div
              style={{
                position: 'relative', width: 132, height: 132, borderRadius: '50%', flex: 'none',
                background: 'conic-gradient(var(--im-mint) 0turn .32turn,var(--im-blue) .32turn .55turn,var(--im-purple) .55turn .72turn,var(--im-beige) .72turn .87turn,var(--im-light-blue) .87turn 1turn)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'var(--color-60-bg-surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>이번 달</div>
                <div style={{ fontSize: 21, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', marginTop: 'var(--space-0-5)' }}>982,000</div>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>원</div>
              </div>
            </div>
            <div className="spend-legend">
              {spendCategories.map((c) => (
                <div key={c.name} className="spend-legend-row">
                  <div style={{ flex: 'none', width: 10, height: 10, borderRadius: 3, background: c.color }} />
                  <span style={{ flex: 1, fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)' }}>{c.name}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{c.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', border: '1px solid var(--color-60-border)' }}>
          <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: color.ink }}>주차별 비교</div>
          <div className="weekly-chart" aria-label="주차별 소비 금액 비교, 0원 기준">
            {weekVals.map((v, i) => (
              <div key={i} className="weekly-chart-column">
                <strong>{(v * 1000).toLocaleString()}원</strong>
                <div className="weekly-chart-track"><div style={{ height: v / Math.max(...weekVals, 1) * 100 + '%', background: i === weekVals.length - 1 ? color.mint : 'var(--color-chart-muted)' }} /></div>
                <span>{i + 1}주</span>
              </div>
            ))}
          </div>
          <div className="weekly-chart-change">전주보다 {((weekVals[3] - weekVals[2]) * 1000).toLocaleString()}원 증가 · +{((weekVals[3] / weekVals[2] - 1) * 100).toFixed(1)}%</div>
          <div style={{ marginTop: 'var(--space-2)', paddingTop: 14, borderTop: '1px solid var(--color-60-border)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>
            이번 주가 4주 중 가장 높습니다. 배달 지출이 <b style={{ color: 'var(--color-danger)' }}>+34.5%</b> 늘어난 것이 주된 원인입니다.
          </div>
        </div>

        </> : <div className="spend-empty">선택한 달의 소비 내역이 없습니다.</div>}
        <div
          onClick={() => navigate('/category')}
          style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', border: '1px solid rgba(var(--color-mint-rgb),.28)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', cursor: 'pointer', color: color.ink }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-hero)', color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>▥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>카테고리별 자세히 보기</div>
            <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-medium)', color: color.textSecondary, marginTop: 'var(--space-0-5)' }}>{hasData ? '이번 주 245,000원 · 5개 항목' : '선택한 달의 카테고리 보기'}</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-30-surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>›</div>
        </div>
        <div
          onClick={() => navigate('/calendar')}
          style={{ marginTop: 'var(--space-1-5)', background: color.white, border: '1px solid var(--color-60-border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.sky, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>▤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>소비 달력</div>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>날짜별 예산 사용량 한눈에</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-30-surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>›</div>
        </div>
      </ScreenBody>
    </Screen>
  );
}
