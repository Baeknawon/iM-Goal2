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
    <Screen bg="#FF7A5C" style={{ color: '#2B0B03' }}>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill bg="rgba(255,255,255,.9)" onClick={() => navigate('/products')}>‹ 라운지</Pill>
          <Pill bg="#2B0B03" fg="#FFD9CF">✚ 확장 기능</Pill>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, opacity: 0.6 }}>혼자 두지 않아요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>비상 착륙 안내</div>
      </div>

      <ScreenBody padBottom={34}>
        <div style={{ background: color.ink, borderRadius: 32, padding: 24, color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>A</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>항로 A · 스스로 복귀</div>
              <div style={{ marginTop: 3, fontSize: 20, fontWeight: 900, letterSpacing: '-.025em' }}>회복 구간 미션</div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.65, color: 'rgba(255,255,255,.7)' }}>{supportLegNote[persona]}</div>
          <CtaButton height={54} style={{ marginTop: 16, fontSize: 16 }} onClick={() => navigate('/missionDetail')}>회복 구간 보기</CtaButton>
        </div>

        <div style={{ marginTop: 12, background: '#fff', borderRadius: 32, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#FF7A5C', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>B</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: '#C4472A' }}>항로 B · 외부 지원</div>
              <div style={{ marginTop: 3, fontSize: 20, fontWeight: 900, letterSpacing: '-.025em', color: color.ink }}>지원제도 매칭</div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 14.5, lineHeight: 1.65, fontWeight: 500, color: 'rgba(22,25,28,.6)' }}>신청하지 않아도 서비스가 먼저 찾아 안내합니다. iM뱅크가 실제 취급하는 상품으로만 좁힙니다.</div>

          <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
            {BIZ_TYPES.map((b) => {
              const on = biz === b;
              return (
                <div
                  key={b}
                  onClick={() => setBiz(b)}
                  style={{
                    flex: 1, height: 48, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14.5, fontWeight: 900, cursor: 'pointer',
                    background: on ? color.navy : '#F2F5F4', color: on ? '#fff' : 'rgba(10,30,26,.5)',
                  }}
                >
                  {b}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {matched.map((p) => {
              const fc = fitColor[p.fit];
              return (
                <div key={p.name} style={{ background: '#F5F8F7', borderRadius: 22, padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ flex: 1, fontSize: 16.5, fontWeight: 900, letterSpacing: '-.02em', color: color.ink }}>{p.name}</div>
                    <div style={{ padding: '6px 12px', borderRadius: 9999, fontSize: 11.5, fontWeight: 900, background: fc.bg, color: fc.fg }}>{p.fit}</div>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, fontWeight: 500, color: 'rgba(22,25,28,.66)' }}>{p.target}</div>
                  <div style={{ marginTop: 12, height: 46, borderRadius: 9999, background: color.ink, color: '#fff', fontSize: 14.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>{p.cta}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: 14, background: 'rgba(255,255,255,.85)', borderRadius: 26, padding: 20, fontSize: 12.5, lineHeight: 1.7, fontWeight: 700 }}>
          신용회복위원회 채무조정과 정부 정책서민금융은 공식 경로 안내로만 제공되며, 서비스가 직접 심사·연결하지 않습니다.
        </div>
      </ScreenBody>
    </Screen>
  );
}
