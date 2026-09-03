import { useNavigate } from 'react-router-dom';
import { Screen, ScreenHeader, Pill, CtaButton, InfoNote } from '../components/ui';
import { connectItems } from '../data/staticContent';
import { color } from '../styles/theme';

export function ConnectScreen() {
  const navigate = useNavigate();

  return (
    <Screen>
      <ScreenHeader
        onBack={() => navigate('/home')}
        backLabel="‹ 뒤로"
        rightChip={<Pill bg={color.mint} fg={color.ink}>동의 3/4 · 완료</Pill>}
        sub="연결이 끝났어요,"
        title="이 자산을 봅니다"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '20px 22px 34px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {connectItems.map((c) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 14, background: '#fff', borderRadius: 26, padding: '18px 20px' }}>
            <div
              style={{
                flex: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 900, background: c.linked ? color.mint : 'rgba(22,25,28,.10)', color: c.linked ? color.ink : 'rgba(22,25,28,.5)',
              }}
            >
              {c.linked ? '✓' : '+'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15.5, fontWeight: 900, letterSpacing: '-.015em' }}>{c.name}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.6)', marginTop: 2 }}>{c.desc}</div>
            </div>
            <div style={{ flex: 'none', fontSize: 12, fontWeight: 900, color: c.linked ? color.mintDark : 'rgba(22,25,28,.5)' }}>{c.tag}</div>
          </div>
        ))}
        <InfoNote>연결은 조회 전용입니다. 신용조회 기록이 남지 않고, 언제든 설정에서 해제할 수 있어요.</InfoNote>
        <CtaButton
          height={56} bg={color.ink} fg="#fff" arrowBg={color.mint}
          style={{ marginTop: 4 }}
          onClick={() => navigate('/income')}
        >
          소득·재산 확인하기
        </CtaButton>
      </div>
    </Screen>
  );
}
