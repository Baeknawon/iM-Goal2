import { useNavigate } from 'react-router-dom';
import { Screen, Brand, Pill, ScreenBody } from '../components/ui';
import { spendCategories, weekVals } from '../data/staticContent';
import { color } from '../styles/theme';

export function SpendScreen() {
  const navigate = useNavigate();
  return (
    <Screen>
      <div style={{ padding: '60px 22px 0' }}>
        <Brand size={20} style={{ marginBottom: 12 }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill>2026년 7월</Pill>
          <div onClick={() => navigate('/settings')} style={{ width: 38, height: 38, borderRadius: '50%', background: color.mint, cursor: 'pointer' }} />
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>예산을 어디에 썼나요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>소비 분석</div>
      </div>

      <ScreenBody>
        <div style={{ background: '#fff', borderRadius: 30, padding: 24, color: color.ink }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              style={{
                position: 'relative', width: 132, height: 132, borderRadius: '50%', flex: 'none',
                background: 'conic-gradient(#16191C 0turn .32turn,#00C7A9 .32turn .55turn,#7DB5FF .55turn .72turn,#C9A052 .72turn .87turn,#E6EDEA .87turn 1turn)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>이번 달</div>
                <div style={{ fontSize: 21, fontWeight: 900, letterSpacing: '-.03em', marginTop: 2 }}>982,000</div>
                <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>원</div>
              </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
              {spendCategories.map((c) => (
                <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                  <div style={{ width: 13, height: 13, borderRadius: 5, background: c.color }} />
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 900 }}>{c.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: 'rgba(22,25,28,.61)' }}>{c.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 28, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>주차별 비교</div>
          <div style={{ marginTop: 18, display: 'flex', gap: 10, alignItems: 'flex-end', height: 104 }}>
            {weekVals.map((v, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: `${Math.round((v / 245) * 100)}%`, borderRadius: '9px 9px 0 0', background: i === 3 ? '#FF7A5C' : 'rgba(22,25,28,.18)' }} />
                <span style={{ fontSize: 12, fontWeight: 900, color: i === 3 ? '#D0512E' : 'rgba(22,25,28,.58)' }}>{i + 1}주</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(22,25,28,.12)', fontSize: 14, lineHeight: 1.7, fontWeight: 500, color: 'rgba(22,25,28,.62)' }}>
            이번 주가 4주 중 가장 높습니다. 배달 지출이 <b style={{ color: '#D0512E' }}>+34.5%</b> 늘어난 것이 주된 원인입니다.
          </div>
        </div>

        <div
          onClick={() => navigate('/category')}
          style={{ marginTop: 12, background: color.mint, borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', color: color.ink }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.ink, color: color.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>▥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>카테고리별 자세히 보기</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.6, marginTop: 2 }}>이번 주 245,000원 · 5개 항목</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(22,25,28,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>›</div>
        </div>
        <div
          onClick={() => navigate('/calendar')}
          style={{ marginTop: 10, background: 'rgba(22,25,28,.09)', borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.sky, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>▤</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>소비 달력</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 2 }}>날짜별 예산 사용량 한눈에</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(22,25,28,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>›</div>
        </div>
      </ScreenBody>
    </Screen>
  );
}
