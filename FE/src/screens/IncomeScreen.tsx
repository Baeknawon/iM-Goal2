import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, Pill, InfoNote } from '../components/ui';
import { color } from '../styles/theme';

function won(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`;
}

/** 동의 4/4 — confirm income/assets/fixed-cost estimated from the linked accounts. */
export function IncomeScreen() {
  const navigate = useNavigate();
  const resetOnboarding = useAppStore((s) => s.resetOnboarding);
  const monthly = useAppStore((s) => s.incomeMonthly);
  const assets = useAppStore((s) => s.incomeAssets);
  const fixed = useAppStore((s) => s.incomeFixed);
  const incMonthly = useAppStore((s) => s.incMonthly);
  const incAssets = useAppStore((s) => s.incAssets);
  const incFixed = useAppStore((s) => s.incFixed);

  const fields = [
    { label: '월 소득', desc: '매월 들어오는 금액', value: monthly, step: 100000, set: incMonthly },
    { label: '보유 자산', desc: '예금·적금 등 현재 모인 금액', value: assets, step: 1000000, set: incAssets },
    { label: '월 고정비', desc: '월세·통신·보험 등 매달 나가는 금액', value: fixed, step: 100000, set: incFixed },
  ];

  return (
    <Screen>
      <ScreenHeader
        onBack={() => navigate('/connect')}
        rightChip={<Pill>동의 4/4</Pill>}
        sub="연결된 내역에서 추정했어요,"
        title="맞는지 확인해주세요"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 34px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        {fields.map((f) => (
          <div key={f.label} style={{ background: '#fff', borderRadius: 28, padding: '20px 22px' }}>
            <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>{f.label}</div>
            <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                onClick={() => f.set(f.value - f.step)}
                style={{ flex: 'none', width: 44, height: 44, borderRadius: '50%', background: 'rgba(22,25,28,.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, cursor: 'pointer' }}
              >
                −
              </div>
              <div style={{ flex: 1, textAlign: 'center', fontSize: 24, fontWeight: 900, letterSpacing: '-.03em', whiteSpace: 'nowrap' }}>{won(f.value)}</div>
              <div
                onClick={() => f.set(f.value + f.step)}
                style={{ flex: 'none', width: 44, height: 44, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, cursor: 'pointer' }}
              >
                +
              </div>
            </div>
            <div style={{ marginTop: 11, fontSize: 12.5, lineHeight: 1.6, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{f.desc}</div>
          </div>
        ))}
        <InfoNote>사업자는 월 매출을, 근로자는 월 급여를 입력하세요. 이 값으로 하루 예산과 도착일을 계산합니다.</InfoNote>
        <div
          onClick={() => { resetOnboarding(); navigate('/empty'); }}
          style={{ marginTop: 4, height: 58, borderRadius: 9999, background: color.ink, color: '#fff', fontSize: 16.5, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, cursor: 'pointer' }}
        >
          이대로 시작하기
          <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</span>
        </div>
      </div>
    </Screen>
  );
}
