import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, Pill, InfoNote } from '../components/ui';
import { color } from '../styles/theme';

const items: { name: string; desc: string; required: boolean }[] = [
  { name: 'iM뱅크 계좌 연결', desc: '입출금·예금 계좌 잔액과 거래내역 조회', required: true },
  { name: '마이데이터 통합조회', desc: '타 금융기관 계좌·카드·대출 정보 통합 조회', required: true },
  { name: '개인정보 수집·이용', desc: '목표 설계와 소비 분석에 필요한 최소 정보', required: true },
  { name: '금융거래정보 제공', desc: 'AI 분석을 위한 거래내역 제공 (조회 전용)', required: true },
  { name: 'FCPS 행동데이터 축적', desc: '미션 수행 기록을 신용 보완 지표로 축적', required: true },
  { name: '마케팅 정보 수신', desc: '상품 추천·이벤트 알림 (선택)', required: false },
];

/** 동의 1/4 — my-data & consent checklist shown right after login, before linking. */
export function ConsentScreen() {
  const navigate = useNavigate();
  const consents = useAppStore((s) => s.consents);
  const toggleConsent = useAppStore((s) => s.toggleConsent);
  const toggleConsentAll = useAppStore((s) => s.toggleConsentAll);

  const allOn = consents.every(Boolean);
  const requiredOk = consents.slice(0, 5).every(Boolean);

  return (
    <Screen>
      <ScreenHeader
        onBack={() => navigate('/login')}
        rightChip={<Pill>동의 1/4</Pill>}
        sub="시작하기 전에,"
        title="동의가 필요해요"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 34px', display: 'flex', flexDirection: 'column', gap: 9 }}>
        <div
          onClick={toggleConsentAll}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '18px 20px', borderRadius: 26, cursor: 'pointer', background: color.ink, color: '#fff' }}
        >
          <div style={{ flex: 'none', width: 28, height: 28, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900, background: allOn ? color.mint : 'rgba(255,255,255,.18)', color: allOn ? color.ink : 'transparent' }}>✓</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.015em' }}>전체 동의</div>
            <div style={{ marginTop: 2, fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>선택 항목까지 한 번에</div>
          </div>
        </div>

        {items.map((c, i) => {
          const on = consents[i];
          return (
            <div
              key={c.name}
              onClick={() => toggleConsent(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '16px 18px', borderRadius: 24, cursor: 'pointer', background: on ? '#fff' : 'rgba(22,25,28,.05)' }}
            >
              <div style={{ flex: 'none', width: 26, height: 26, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, background: on ? color.mint : 'rgba(22,25,28,.10)', color: on ? color.ink : 'transparent' }}>✓</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-.015em' }}>{c.name}</span>
                  <span style={{ flex: 'none', fontSize: 11, fontWeight: 900, color: c.required ? color.mintDark : 'rgba(22,25,28,.5)' }}>{c.required ? '필수' : '선택'}</span>
                </div>
                <div style={{ marginTop: 2, fontSize: 12.5, lineHeight: 1.5, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{c.desc}</div>
              </div>
            </div>
          );
        })}

        <InfoNote>모든 연결은 조회 전용입니다. 신용조회 기록이 남지 않고, 설정에서 언제든 해제할 수 있어요.</InfoNote>

        <div
          onClick={() => { if (requiredOk) navigate('/linking'); }}
          style={{
            marginTop: 4, height: 58, borderRadius: 9999, fontSize: 16.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            cursor: requiredOk ? 'pointer' : 'default',
            background: requiredOk ? color.ink : 'rgba(22,25,28,.14)', color: requiredOk ? '#fff' : 'rgba(22,25,28,.4)',
          }}
        >
          동의하고 계속
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(255,255,255,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</span>
        </div>
      </div>
    </Screen>
  );
}
