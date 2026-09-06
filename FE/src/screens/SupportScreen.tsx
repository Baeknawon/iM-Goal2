import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Pill, ScreenBody, CtaButton } from '../components/ui';
import { supportProductDefs, fitColor } from '../data/staticContent';
import type { BizTypeKey } from '../data/staticContent';
import { supportLegNote } from '../data/personas';
import { color } from '../styles/theme';

const BIZ_TYPES: BizTypeKey[] = ['소상공인', '개인사업자'];

export function SupportScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const biz = useAppStore((s) => s.biz);
  const setBiz = useAppStore((s) => s.setBiz);
  const matched = supportProductDefs.filter((p) => p.bizTypes.includes(biz));

  return (
    <Screen bg={color.bg} style={{ color: color.ink }}>
      <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill bg="rgba(var(--color-white-rgb),.9)" onClick={() => navigate('/products')}>‹ 라운지</Pill>
          <Pill bg="var(--color-60-text-primary)" fg="var(--color-danger-surface)">✚ 확장 기능</Pill>
        </div>
        <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', opacity: 0.6 }}>혼자 두지 않아요,</div>
        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>비상 착륙 안내</div>
      </div>

      <ScreenBody padBottom={34}>
        <div style={{ background: 'var(--color-hero)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: 'var(--im-white)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>항로 A · 스스로 복귀</div>
              <div style={{ marginTop: 3, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em' }}>회복 구간 미션</div>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65, color: 'var(--color-text-on-dark-muted)' }}>{supportLegNote[persona]}</div>
          <CtaButton height={54} style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)' }} onClick={() => navigate('/missionDetail')}>회복 구간 보기</CtaButton>
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--color-danger)', color: 'var(--im-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>B</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-danger)' }}>항로 B · 외부 지원</div>
              <div style={{ marginTop: 3, fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em', color: color.ink }}>지원제도 매칭</div>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>신청하지 않아도 서비스가 먼저 찾아 안내합니다. iM뱅크가 실제 취급하는 상품으로만 좁힙니다.</div>

          <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-1)' }}>
            {BIZ_TYPES.map((b) => {
              const on = biz === b;
              return (
                <div
                  key={b}
                  onClick={() => setBiz(b)}
                  style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',
                    flex: 1, height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
                    background: on ? color.selected : 'var(--color-30-surface-sub)', color: on ? color.selectedText : 'var(--color-60-text-secondary)',
                  }}
                >
                  {b}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
            {matched.map((p) => {
              const fc = fitColor[p.fit];
              return (
                <div key={p.name} style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ flex: 1, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', color: color.ink }}>{p.name}</div>
                    <div style={{ padding: '6px 12px', borderRadius: 'var(--radius-pill)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', background: fc.bg, color: fc.fg }}>{p.fit}</div>
                  </div>
                  <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)', lineHeight: 1.6, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>{p.target}</div>
                  <div style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 'var(--space-1-5)', height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--color-hero)', color: 'var(--im-white)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{p.cta}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-text-on-dark-muted)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', fontSize: 'var(--font-size-2xs)', lineHeight: 1.7, fontWeight: 'var(--font-weight-semibold)' }}>
          신용회복위원회 채무조정과 정부 정책서민금융은 공식 경로 안내로만 제공되며, 서비스가 직접 심사·연결하지 않습니다.
        </div>
      </ScreenBody>
    </Screen>
  );
}
