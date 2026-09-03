import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';
import { salarySplitDefs } from '../data/personas';
import { Screen, BackToHome, Pill, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

export function SalaryScreen() {
  const navigate = useNavigate();
  const { persona, P, AP } = useJourney();
  const setFueled = useAppStore((s) => s.setFueled);
  const splits = salarySplitDefs[persona];

  return (
    <Screen bg="#EDEFF1">
      <div style={{ padding: '68px 22px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <BackToHome />
          <Pill bg={color.mint} fg={color.ink}>정기 입금 감지</Pill>
        </div>
        <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>7월 급여가 들어왔어요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>자동으로 나눌까요?</div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 34px' }}>
        <div style={{ background: '#fff', borderRadius: 30, padding: 24, color: color.ink }}>
          <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>입금액</div>
          <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 42, fontWeight: 900, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{AP.total}</span>
            <span style={{ fontSize: 18, fontWeight: 900 }}>원</span>
          </div>
          <div style={{ marginTop: 4, fontSize: 13, fontWeight: 700, color: 'rgba(22,25,28,.63)' }}>iM뱅크 급여통장 · 7월 25일 09:12</div>

          <div style={{ marginTop: 20, height: 14, borderRadius: 9999, overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '56%', background: color.navy }} />
            <div style={{ width: '9%', background: color.mint }} />
            <div style={{ width: '35%', background: color.sky }} />
          </div>

          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
            {splits.map((sp) => (
              <div key={sp.name} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                <div style={{ width: 14, height: 14, borderRadius: 5, background: sp.dotColor }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15.5, fontWeight: 900 }}>{sp.name}</div>
                  <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.61)', marginTop: 1 }}>{sp.desc}</div>
                </div>
                <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ fontSize: 17, fontWeight: 900 }}>{sp.amount}</div>
                  <div style={{ fontSize: 12, fontWeight: 900, color: 'rgba(22,25,28,.58)', marginTop: 1 }}>{sp.pct}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14, background: 'rgba(22,25,28,.1)', borderRadius: 28, padding: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: '#077264' }}>이 분배가 여정에 주는 영향</div>
          <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ImpactRow label="모인 금액" value={`${AP.pre[0].amount} → ${AP.post[0].amount}원`} />
            <ImpactRow label="진행률" value={`${AP.prePct}% → ${AP.postPct}%`} strong />
            <ImpactRow label="하루 예산" value={`${P.dailyBudget.toLocaleString()} → ${(P.dailyBudget + 600).toLocaleString()}원`} />
          </div>
        </div>

        <CtaButton height={62} style={{ marginTop: 16 }} onClick={() => { setFueled(true); navigate('/home'); }}>
          이대로 자동 분배하기
        </CtaButton>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: 'rgba(22,25,28,.61)' }}>비율 직접 조정하기</div>
      </div>
    </Screen>
  );
}

function ImpactRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <span style={{ fontSize: 14.5, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 900, color: strong ? '#077264' : color.ink }}>{value}</span>
    </div>
  );
}
