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
      <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/mileage')}>‹ 마일리지</Pill>
          <Pill bg={color.mint} fg={color.ink}>✚ SILVER 라운지</Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>추천 이유부터 말씀드려요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>지금 맞는 iM 상품</div>
      </div>

      <ScreenBody>
        <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
          {TABS.map((t) => {
            const on = prodTab === t.key;
            return (
              <div
                key={t.key}
                onClick={() => setProdTab(t.key)}
                style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',
                  flex: 1, height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
                  background: on ? color.mint : 'rgba(var(--color-ink-rgb),.08)', color: on ? color.ink : 'var(--color-60-text-secondary)',
                }}
              >
                {t.label}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {products.map((p) => {
            const t = productThemes[p.theme];
            return (
              <div key={p.name} style={{ borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', background: t.bg, color: t.fg }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                  <div style={{ flex: 'none', width: 46, height: 46, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', background: t.tagBg, color: t.tagFg }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'inline-block', padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', background: t.tagBg, color: t.tagFg }}>{p.tag}</div>
                    <div style={{ marginTop: 5, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em', lineHeight: 1.3 }}>{p.name}</div>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-1-5)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', background: t.reasonBg }}>
                  <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', opacity: 0.55 }}>왜 추천됐나요</div>
                  <div style={{ marginTop: 6, fontSize: 'var(--font-size-sm)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)' }}>{p.reason}</div>
                </div>
                <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', gap: 22 }}>
                  <div><div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.55 }}>{p.k1}</div><div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 'var(--space-0-5)' }}>{p.v1}</div></div>
                  <div><div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.55 }}>{p.k2}</div><div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', marginTop: 'var(--space-0-5)' }}>{p.v2}</div></div>
                </div>
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-1)' }}>
                  <div style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  flex: 1, height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', background: t.ctaBg, color: t.ctaFg, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{p.cta}</div>
                  <div style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  flex: 'none', whiteSpace: 'nowrap', padding: '0 18px', height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', background: t.subBg, color: t.subFg, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>근거 전문</div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          onClick={() => navigate('/support')}
          style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-danger-surface)', border: '1px solid var(--color-danger-border)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', cursor: 'pointer' }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-danger)', color: 'var(--color-60-text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>!</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>상환이 부담되시나요?</div>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>비상 착륙 안내 · 지원제도 매칭</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-30-surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>›</div>
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', fontSize: 'var(--font-size-2xs)', lineHeight: 1.7, fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
          금리·한도·정부 기여금은 심사와 정책 결과에 따라 달라집니다. 추천은 마이데이터 항목과 FCPS 행동 데이터를 근거로 하며, 가입을 강요하지 않습니다.
        </div>
      </ScreenBody>
    </Screen>
  );
}
