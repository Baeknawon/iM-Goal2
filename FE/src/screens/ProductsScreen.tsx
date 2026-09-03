import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill, ScreenBody } from '../components/ui';
import { productDefs, productThemes } from '../data/staticContent';
import type { ProductTabKey } from '../data/staticContent';
import { color } from '../styles/theme';

const TABS: { key: ProductTabKey; label: string }[] = [
  { key: '전체', label: '전체 4' },
  { key: '목표', label: '목적지 연계' },
  { key: '신용', label: '마일리지' },
];

export function ProductsScreen() {
  const navigate = useNavigate();
  const prodTab = useAppStore((s) => s.prodTab);
  const setProdTab = useAppStore((s) => s.setProdTab);
  const products = productDefs.filter((p) => p.tabs.includes(prodTab));

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/mileage')}>‹ 마일리지</Pill>
          <Pill bg={color.mint} fg={color.ink}>✚ SILVER 라운지</Pill>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>추천 이유부터 말씀드려요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>지금 맞는 iM 상품</div>
      </div>

      <ScreenBody>
        <div style={{ display: 'flex', gap: 8 }}>
          {TABS.map((t) => {
            const on = prodTab === t.key;
            return (
              <div
                key={t.key}
                onClick={() => setProdTab(t.key)}
                style={{
                  flex: 1, height: 50, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14.5, fontWeight: 900, cursor: 'pointer',
                  background: on ? color.mint : 'rgba(22,25,28,.08)', color: on ? color.ink : 'rgba(22,25,28,.6)',
                }}
              >
                {t.label}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 11 }}>
          {products.map((p) => {
            const t = productThemes[p.theme];
            return (
              <div key={p.name} style={{ borderRadius: 28, padding: 22, background: t.bg, color: t.fg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div style={{ flex: 'none', width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900, background: t.tagBg, color: t.tagFg }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 9999, fontSize: 11.5, fontWeight: 900, letterSpacing: '.06em', background: t.tagBg, color: t.tagFg }}>{p.tag}</div>
                    <div style={{ marginTop: 5, fontSize: 18.5, fontWeight: 900, letterSpacing: '-.025em', lineHeight: 1.3 }}>{p.name}</div>
                  </div>
                </div>
                <div style={{ marginTop: 14, borderRadius: 20, padding: 16, background: t.reasonBg }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', opacity: 0.55 }}>왜 추천됐나요</div>
                  <div style={{ marginTop: 6, fontSize: 14.5, lineHeight: 1.65, fontWeight: 500 }}>{p.reason}</div>
                </div>
                <div style={{ marginTop: 14, display: 'flex', gap: 22 }}>
                  <div><div style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.55 }}>{p.k1}</div><div style={{ fontSize: 18, fontWeight: 900, marginTop: 2 }}>{p.v1}</div></div>
                  <div><div style={{ fontSize: 11.5, fontWeight: 700, opacity: 0.55 }}>{p.k2}</div><div style={{ fontSize: 18, fontWeight: 900, marginTop: 2 }}>{p.v2}</div></div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, height: 52, borderRadius: 9999, background: t.ctaBg, color: t.ctaFg, fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{p.cta}</div>
                  <div style={{ flex: 'none', whiteSpace: 'nowrap', padding: '0 18px', height: 52, borderRadius: 9999, background: t.subBg, color: t.subFg, fontSize: 14, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>근거 전문</div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          onClick={() => navigate('/support')}
          style={{ marginTop: 12, background: 'rgba(255,122,92,.16)', border: '1px solid rgba(255,122,92,.4)', borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FF7A5C', color: '#2B0B03', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>!</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>상환이 부담되시나요?</div>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.66)', marginTop: 2 }}>비상 착륙 안내 · 지원제도 매칭</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(22,25,28,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>›</div>
        </div>

        <div style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 26, padding: 20, fontSize: 12.5, lineHeight: 1.7, fontWeight: 700, color: 'rgba(22,25,28,.63)' }}>
          금리·한도·정부 기여금은 심사와 정책 결과에 따라 달라집니다. 추천은 마이데이터 항목과 FCPS 행동 데이터를 근거로 하며, 가입을 강요하지 않습니다.
        </div>
      </ScreenBody>
    </Screen>
  );
}
