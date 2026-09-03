import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenBody, CtaButton, BarcodeStrip, InfoNote } from '../components/ui';
import { color } from '../styles/theme';

const DEPOSIT_OPTIONS = [10000, 30000, 50000];

export function TokenScreen() {
  const navigate = useNavigate();
  const deposit = useAppStore((s) => s.deposit);
  const setDeposit = useAppStore((s) => s.setDeposit);
  const setMissionOn = useAppStore((s) => s.setMissionOn);

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ padding: '9px 15px', borderRadius: 9999, background: 'rgba(22,25,28,.12)', fontSize: 13, fontWeight: 900 }}>iMKRW 스마트계약</div>
          <div onClick={() => navigate('/settings')} style={{ width: 38, height: 38, borderRadius: '50%', background: color.sky, cursor: 'pointer' }} />
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>동의 없이는 예치되지 않아요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>보증금 티켓</div>
      </div>

      <ScreenBody>
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#fff', borderRadius: '28px 28px 0 0', padding: '22px 24px', color: color.ink }}>
            <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.1em', color: 'rgba(22,25,28,.58)' }}>DEPOSIT · LEG 04</div>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{deposit.toLocaleString()}</span>
              <span style={{ fontSize: 17, fontWeight: 900 }}>iMKRW</span>
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
              {DEPOSIT_OPTIONS.map((v) => (
                <div
                  key={v}
                  onClick={() => setDeposit(v)}
                  style={{
                    flex: 1, height: 48, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 15, fontWeight: 900, cursor: 'pointer',
                    background: deposit === v ? color.navy : '#F2F5F4', color: deposit === v ? '#fff' : 'rgba(10,30,26,.5)',
                  }}
                >
                  {v / 10000}만
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative', height: 26, background: '#fff', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
            <div style={{ position: 'absolute', right: -13, width: 26, height: 26, borderRadius: '50%', background: color.bg }} />
            <div style={{ flex: 1, margin: '0 20px', height: 2, background: 'repeating-linear-gradient(90deg,#D8E2DF 0 6px,transparent 6px 12px)' }} />
          </div>
          <div style={{ background: '#fff', borderRadius: '0 0 28px 28px', padding: '20px 24px 24px', color: color.ink }}>
            <div style={{ display: 'flex', gap: 9 }}>
              <div style={{ flex: 1, background: color.mintTintLight, borderRadius: 20, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.06em', color: '#0A8873' }}>도착하면</div>
                <div style={{ marginTop: 7, fontSize: 14.5, lineHeight: 1.55, fontWeight: 900 }}>전액 반환<br />+ 우대금리 0.3%</div>
              </div>
              <div style={{ flex: 1, background: '#FFEFEA', borderRadius: 20, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.06em', color: '#C4472A' }}>이탈하면</div>
                <div style={{ marginTop: 7, fontSize: 14.5, lineHeight: 1.55, fontWeight: 900, color: '#3A1A11' }}>내 목표 계좌로<br />자동 이동</div>
              </div>
            </div>
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13.5, fontWeight: 900, color: 'rgba(22,25,28,.63)' }}>진행 중인 예치</span>
              <span style={{ fontSize: 13.5, fontWeight: 900, color: '#0A8873' }}>9 / 14일</span>
            </div>
            <div style={{ marginTop: 10, height: 12, borderRadius: 9999, background: '#E9ECEE', overflow: 'hidden' }}>
              <div style={{ width: '64%', height: '100%', background: color.mint }} />
            </div>
            <BarcodeStrip height={40} />
          </div>
        </div>

        <InfoNote>예치·반환 처리에 오류가 생기면 상태를 표시하고 재처리를 도와드립니다. 금액과 반환 기준은 금융·법무 검토 후 확정됩니다.</InfoNote>
        <CtaButton height={62} bg={color.ink} fg="#fff" arrowBg={color.mint} style={{ marginTop: 14 }} onClick={() => { setMissionOn(true); navigate('/home'); }}>
          동의하고 예치
        </CtaButton>
        <div
          onClick={() => navigate('/release')}
          style={{ marginTop: 10, height: 52, borderRadius: 9999, background: 'rgba(22,25,28,.08)', color: 'rgba(22,25,28,.72)', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          해제 · 환원 화면 보기
        </div>
      </ScreenBody>
    </Screen>
  );
}
