import { useNavigate } from 'react-router-dom';
import { useJourney } from '../viewmodel/useJourney';
import { Screen, BackToHome, Pill, CtaButton } from '../components/ui';
import { arrivedRecords } from '../data/staticContent';
import { color } from '../styles/theme';

export function ArrivedScreen() {
  const navigate = useNavigate();
  const { P, AP } = useJourney();

  return (
      <Screen>
        <div style={{ padding: '68px 22px 0', flex: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BackToHome />
            <Pill bg={color.mint} fg={color.ink}>ARRIVED</Pill>
          </div>
          <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>도착했습니다,</div>
          <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>{P.goalName} 완주</div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 34px' }}>
          <div style={{ position: 'relative', marginTop: 60 }}>
            <img
                src="/assets/dandi-pilot.png" alt="기장 단디"
                style={{ position: 'absolute', right: -10, top: -76, width: 88, height: 'auto', display: 'block', zIndex: 5, animation: 'nod 4.4s ease-in-out infinite', filter: 'drop-shadow(0 10px 16px rgba(22,25,28,.18))' }}
            />
            <div style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: 24, color: color.ink, position: 'relative', overflow: 'hidden' }}>
              <img src="/assets/im-mark.png" alt="" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 190, height: 'auto', opacity: 0.07, pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', top: 16, right: -14, transform: 'rotate(-11deg)', border: '3px solid #00C7A9', color: '#0A8873', borderRadius: 14, padding: '7px 16px', fontSize: 15, fontWeight: 900, letterSpacing: '.1em', opacity: 0.9 }}>ARRIVED</div>
              <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.1em', color: 'rgba(22,25,28,.58)' }}>BOARDING PASS · 완료</div>
              <div style={{ marginTop: 18, fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>최종 도착 금액</div>
              <div style={{ marginTop: 3, fontSize: 38, fontWeight: 900, letterSpacing: '-.03em', whiteSpace: 'nowrap' }}>{AP.target}</div>
              <div style={{ marginTop: 14, height: 11, borderRadius: 9999, background: '#E9ECEE', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', background: color.mint }} />
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 900, color: 'rgba(22,25,28,.63)' }}>
                <span>100% 비행 완료</span><span>{AP.eta} 도착</span>
              </div>
            </div>
            <div style={{ position: 'relative', height: 26, background: '#fff', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
              <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,#D8E2DF 0 6px,transparent 6px 12px)' }} />
            </div>
            <div style={{ background: '#fff', borderRadius: '0 0 28px 28px', padding: '20px 24px 24px', color: color.ink }}>
              <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>여정 기록</div>
              <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {arrivedRecords.map((r) => (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(22,25,28,.62)' }}>{r.label}</span>
                      <span style={{ fontSize: 14.5, fontWeight: 900, whiteSpace: 'nowrap' }}>{r.value}</span>
                    </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14, background: color.ink, borderRadius: 30, padding: 24, color: '#fff' }}>
            <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>다음 여정 제안</div>
            <div style={{ marginTop: 10, fontSize: 19, fontWeight: 900, lineHeight: 1.45 }}>이번에 만든 습관이면<br />다음 목표는 더 빠릅니다</div>
            <div style={{ marginTop: 14, fontSize: 13.5, lineHeight: 1.7, color: 'rgba(255,255,255,.66)' }}>완주 기록이 FCPS에 남아, 다음 목표에서는 더 낮은 금리의 iM 상품이 후보로 올라옵니다.</div>
          </div>

          <CtaButton height={56} style={{ marginTop: 14, fontSize: 16 }} arrowBg={color.ink} onClick={() => navigate('/chat')}>다음 목표 발권하기</CtaButton>
        </div>
      </Screen>
  );
}
