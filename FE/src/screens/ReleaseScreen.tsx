import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { missionDefs } from '../data/personas';
import { Screen, Pill, ScreenBody, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

export function ReleaseScreen() {
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const deposit = useAppStore((s) => s.deposit);
  const completeRecovery = useAppStore((s) => s.completeRecovery);
  const MI = missionDefs[persona];
  const legCode = MI.leg.split(' · ')[0]; // e.g. "LEG 04"
  const depositLabel = deposit.toLocaleString();

  return (
    <Screen>
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Pill onClick={() => navigate('/token')}>‹ 보증금</Pill>
          <Pill bg={color.mint} fg={color.ink}>구간 완주</Pill>
        </div>
        <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{legCode}를 완주했어요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>보증금을 돌려드려요</div>
      </div>

      <ScreenBody>
        <div style={{ background: color.mint, borderRadius: 30, padding: 24, color: color.ink }}>
          <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', opacity: 0.6 }}>환원 금액</div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 44, fontWeight: 900, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{depositLabel}</span>
            <span style={{ fontSize: 18, fontWeight: 900 }}>원</span>
          </div>
          <div style={{ marginTop: 14, fontSize: 14, lineHeight: 1.65, fontWeight: 700, opacity: 0.7 }}>iMKRW {depositLabel} 소각 → 원화 {depositLabel}원이 목표 계좌로 이체됩니다.</div>
        </div>

        <div style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 28, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>처리 단계</div>
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <StepRow done title="스마트계약 조건 충족 확인" desc="결제 내역 기준 자동 판정" />
            <StepRow done title="iMKRW 소각" desc={`토큰 잔액 ${depositLabel} → 0`} />
            <StepRow done title="원화 이체" desc="iM뱅크 목표 계좌 · 완료" />
          </div>
        </div>

        <div style={{ marginTop: 14, background: color.ink, borderRadius: 28, padding: 22, color: '#fff' }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>함께 적립된 마일리지</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-.035em' }}>+18</span>
            <span style={{ fontSize: 15, fontWeight: 900, opacity: 0.6 }}>FCPS · 실버 612점</span>
          </div>
          <CtaButton height={52} style={{ marginTop: 16, fontSize: 15.5 }} arrowBg={color.ink} onClick={() => navigate('/mileage')}>마일리지 보기</CtaButton>
        </div>

        <CtaButton
          height={62} style={{ marginTop: 14 }}
          onClick={() => { completeRecovery(); navigate('/home'); }}
        >
          탑승권으로 돌아가기
        </CtaButton>
      </ScreenBody>
    </Screen>
  );
}

function StepRow({ done, title, desc }: { done?: boolean; title: string; desc: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
      <div
        style={{
          width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: done ? color.mint : 'rgba(22,25,28,.14)', color: color.ink, fontSize: 14, fontWeight: 900,
        }}
      >
        {done ? '✓' : <div style={{ width: 12, height: 12, borderRadius: '50%', border: `2px solid ${color.mint}`, borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 900 }}>{title}</div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.61)', marginTop: 1 }}>{desc}</div>
      </div>
    </div>
  );
}
