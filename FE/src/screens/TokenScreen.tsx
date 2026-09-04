import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenBody, CtaButton, BarcodeStrip, InfoNote } from '../components/ui';
import { color } from '../styles/theme';

const DEPOSIT_OPTIONS = [10000, 30000, 50000];

export function TokenScreen() {
  const navigate = useNavigate();
  const deposit = useAppStore((s) => s.deposit);
  const setDeposit = useAppStore((s) => s.setDeposit);
  const startMission = useAppStore((s) => s.startMission);
  const wallet = useAppStore((s) => s.wallet);

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
          {/* iMKRW 머니 잔액 + 예치 후 잔액 미리보기 (부족 시 자동충전) */}
          <div style={{ background: color.ink, borderRadius: 24, padding: '18px 20px', color: '#fff', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 'none', width: 42, height: 42, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>₩</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.06em', color: color.mint }}>iMKRW 머니</div>
              <div style={{ marginTop: 2, fontSize: 20, fontWeight: 900, letterSpacing: '-.02em' }}>{wallet.toLocaleString()} iMKRW</div>
            </div>
            <div style={{ flex: 'none', textAlign: 'right' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.55)' }}>예치 후</div>
              <div style={{ fontSize: 15, fontWeight: 900 }}>{Math.max(0, wallet - deposit).toLocaleString()}</div>
            </div>
          </div>
          {wallet < deposit && (
              <div style={{ marginBottom: 14, background: color.mintTintLight, borderRadius: 18, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 15 }}>🤖</span>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: '#077264', lineHeight: 1.5 }}>
              머니가 <b>{(deposit - wallet).toLocaleString()}원</b> 부족해요. 에이전트가 자동으로 채워서 미션을 시작할게요.
            </span>
              </div>
          )}
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
                  <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.06em', color: '#0A8873' }}>성공하면</div>
                  <div style={{ marginTop: 7, fontSize: 14.5, lineHeight: 1.55, fontWeight: 900 }}>지갑으로 반환<br />+ FCPS 성공 기록</div>
                </div>
                <div style={{ flex: 1, background: '#FFEFEA', borderRadius: 20, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.06em', color: '#C4472A' }}>실패·포기해도</div>
                  <div style={{ marginTop: 7, fontSize: 14.5, lineHeight: 1.55, fontWeight: 900, color: '#3A1A11' }}>지갑으로 반환<br />결과만 FCPS 기록</div>
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

          <InfoNote>동의하면 iMKRW 머니에서 보증금 {deposit.toLocaleString()}원이 미션에 묶입니다{wallet < deposit ? ' (부족분은 에이전트가 자동 충전)' : ''}. 미션을 달성하면 묶인 돈이 iMKRW 머니로 다시 돌아옵니다.</InfoNote>
          <CtaButton height={62} bg={color.ink} fg="#fff" arrowBg={color.mint} style={{ marginTop: 14 }} onClick={() => { startMission(deposit); navigate('/missionLive'); }}>
            동의하고 예치 · 미션 시작
          </CtaButton>
        </ScreenBody>
      </Screen>
  );
}
