import { useNavigate } from 'react-router-dom';
import { Screen, Pill, ScreenBody, CtaButton, InfoNote } from '../components/ui';
import { categoryRows } from '../data/staticContent';
import { color } from '../styles/theme';

export function CategoryScreen() {
  const navigate = useNavigate();
  return (
    <Screen>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/spend')}>‹ 소비분석</Pill>
          <Pill>7월 3주</Pill>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>이번 주 245,000원</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>카테고리별 소비</div>
      </div>

      <ScreenBody>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categoryRows.map((c) => (
            <div key={c.name} style={{ borderRadius: 26, padding: 20, background: c.highlighted ? '#fff' : 'rgba(22,25,28,.08)', color: color.ink }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div
                  style={{
                    width: 42, height: 42, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, fontWeight: 900, background: c.highlighted ? '#FFD9CF' : 'rgba(22,25,28,.12)', color: c.highlighted ? '#C4472A' : 'rgba(22,25,28,.7)',
                  }}
                >
                  {c.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16.5, fontWeight: 900, letterSpacing: '-.02em' }}>{c.name}</div>
                  <div style={{ marginTop: 2, fontSize: 12.5, fontWeight: 700, opacity: 0.55 }}>{c.count}</div>
                </div>
                <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 18, fontWeight: 900 }}>{c.amount}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 900, marginTop: 2, color: c.delta.startsWith('+') ? '#C4472A' : c.highlighted ? '#0A8873' : 'rgba(22,25,28,.61)' }}>{c.delta}</div>
                </div>
              </div>
              <div style={{ marginTop: 14, height: 9, borderRadius: 9999, overflow: 'hidden', background: c.highlighted ? '#F0EAE8' : 'rgba(22,25,28,.14)' }}>
                <div style={{ width: `${c.barPct}%`, height: '100%', borderRadius: 9999, background: c.highlighted ? '#C4472A' : 'rgba(22,25,28,.58)' }} />
              </div>
            </div>
          ))}
        </div>
        <InfoNote>배달 카테고리만 흰 카드로 강조했습니다. 이 항목이 이번 주 이탈의 1순위 원인입니다.</InfoNote>
        <CtaButton height={60} style={{ marginTop: 14, fontSize: 16.5 }} arrowBg={color.ink} onClick={() => navigate('/cause')}>
          이탈 원인 분석 보기
        </CtaButton>
      </ScreenBody>
    </Screen>
  );
}
