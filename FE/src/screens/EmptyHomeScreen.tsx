import { useNavigate } from 'react-router-dom';
import { Screen, Brand, TicketShell, CtaButton, InfoNote } from '../components/ui';
import { color } from '../styles/theme';

export function EmptyHomeScreen() {
  const navigate = useNavigate();
  return (
      <Screen>
        <div style={{ padding: '68px 22px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Brand size={23} />
            <div
                onClick={() => navigate('/settings')}
                style={{ width: 46, height: 46, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
            >
              <img
                  src="/assets/dandi-hi.png" alt="단디"
                  style={{ height: 52, width: 'auto', display: 'block', animation: 'nod 3.2s ease-in-out infinite', filter: 'drop-shadow(0 5px 10px rgba(22,25,28,.18))' }}
              />
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>김서준님, 반갑습니다</div>
          <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>아직 등록된<br />여정이 없어요</div>
        </div>

        <div style={{ flex: 1, padding: '22px 22px 120px' }}>
          <TicketShell
              top={
                <div style={{ position: 'relative' }}>
                  <img src="/assets/im-mark.png" alt="" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 180, height: 'auto', opacity: 0.06, pointerEvents: 'none' }} />
                  <div style={{ position: 'relative', fontSize: 11.5, fontWeight: 900, letterSpacing: '.1em', color: 'rgba(22,25,28,.58)' }}>BOARDING PASS · 미발권</div>
                  <div style={{ position: 'relative', marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.04em' }}>NOW</div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 1 }}>오늘</div>
                    </div>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                      <div style={{ fontSize: 17, color: '#C9D6D2' }}>✈</div>
                      <div style={{ width: 56, height: 2, background: 'repeating-linear-gradient(90deg,#DDE6E3 0 5px,transparent 5px 10px)' }} />
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                      <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.04em', color: '#C9D6D2' }}>???</div>
                      <div style={{ fontSize: 11.5, fontWeight: 700, color: 'rgba(22,25,28,.58)', marginTop: 1 }}>목적지 미정</div>
                    </div>
                  </div>
                </div>
              }
              bottom={
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 16.5, fontWeight: 900, letterSpacing: '-.02em' }}>목표를 정하면 하루 예산이 계산돼요</div>
                  <div style={{ marginTop: 7, fontSize: 13.5, lineHeight: 1.65, fontWeight: 500, color: 'rgba(22,25,28,.66)' }}>
                    소비 습관을 분석해 가장 무리 없는<br />저축 경로를 찾아드립니다.
                  </div>
                  <CtaButton height={56} bg={color.ink} fg="#fff" arrowBg={color.mint} style={{ marginTop: 18 }} onClick={() => navigate('/chat')}>
                    목적지 설정하러 가기
                  </CtaButton>
                </div>
              }
          />
          <InfoNote>목적지가 없어도 소비분석은 볼 수 있어요. 하단 탭에서 지난 3개월 소비 흐름을 확인해 보세요.</InfoNote>
        </div>
      </Screen>
  );
}
