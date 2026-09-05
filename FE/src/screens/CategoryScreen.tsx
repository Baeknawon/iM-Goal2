import { useNavigate } from 'react-router-dom';
import { Screen, Pill, ScreenBody, CtaButton, InfoNote } from '../components/ui';
import { categoryRows } from '../data/staticContent';
import { color } from '../styles/theme';
import { useSpendPeriod } from '../store/spendPeriodStore';
import { INITIAL_SPEND_MONTH, monthParts } from '../data/spendPeriod';

const categoryColors = ['var(--im-blue)', 'var(--im-lime)', 'var(--im-light-blue)', 'var(--im-purple)', 'var(--im-beige)'];
const categoryAmounts = categoryRows.map((row) => Number(row.amount.replace(/[^0-9]/g, '')));
const categoryTotal = categoryAmounts.reduce((sum, amount) => sum + amount, 0);

export function CategoryScreen() {
  const navigate = useNavigate();
  const period = useSpendPeriod((s) => s.period);
  const { year, month } = monthParts(period);
  const hasData = period === INITIAL_SPEND_MONTH;
  return (
    <Screen>
      <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/spend')}>‹ 소비분석</Pill>
          <Pill>{year}년 {month}월{hasData ? ' 3주' : ''}</Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{hasData ? '이번 주 245,000원' : '선택한 달의 소비 내역'}</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>카테고리별 소비</div>
      </div>

      <ScreenBody>
        {hasData ? <>
          <div className="category-list">
            {categoryRows.map((c, i) => (
              <div key={c.name} className="category-row">
                <span className="category-icon" style={{ background: categoryColors[i] }}><CategoryIcon index={i} /></span>
                <div className="category-name">
                  <strong>{c.name}</strong>
                  <span>{(categoryAmounts[i] / categoryTotal * 100).toFixed(1)}% <span aria-hidden="true">·</span> {c.count}</span>
                </div>
                <div className="category-amount">
                  <strong>{c.amount}</strong>
                  <span style={{ color: c.delta.startsWith('+') ? color.coral : c.delta.startsWith('−') ? color.mintDark : color.textSecondary }}>{c.delta}</span>
                </div>
              </div>
            ))}
            <div className="category-share-note">비중은 표시된 카테고리 금액 합계 기준입니다.</div>
          </div>
        <InfoNote>배달이 이번 주 이탈의 1순위 원인입니다.</InfoNote>
        <CtaButton height={60} style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-md)' }} arrowBg={color.ink} onClick={() => navigate('/cause')}>
          이탈 원인 분석 보기
        </CtaButton>
        </> : <div className="spend-empty">선택한 달의 소비 내역이 없습니다.</div>}
      </ScreenBody>
    </Screen>
  );
}

function CategoryIcon({ index }: { index: number }) {
  const paths = [
    'M4 10h16v3a8 8 0 0 1-16 0v-3Zm2-3h12M12 4v3',
    'M5 3v6m3-6v6M5 6h3M6.5 9v12M17 3v18M17 3c-4 3-4 8 0 8',
    'M5 17V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v11H5Zm0-7h14M7 17v3m10-3v3M8 14h1m6 0h1',
    'M4 10h16v10H4V10Zm-1 0 2-6h14l2 6M9 20v-6h6v6',
    'M5 4h14v16H5V4Zm4 5h6m-6 4h6m-6 4h3',
  ];
  return <svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[index]} /></svg>;
}
