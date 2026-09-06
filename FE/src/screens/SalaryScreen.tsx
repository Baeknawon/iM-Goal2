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
      <Screen bg="var(--color-60-bg-base)">
        <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <BackToHome />
            <Pill bg={color.mint} fg={color.ink}>정기 입금 감지</Pill>
          </div>
          <div style={{ marginTop: 18, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>7월 급여가 들어왔어요,</div>
          <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>자동으로 나눌까요?</div>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 34px' }}>
          <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: color.ink }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>입금액</div>
            <div style={{ marginTop: 4, display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 42, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{AP.total}</span>
              <span style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>원</span>
            </div>
            <div style={{ marginTop: 4, fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>iM뱅크 급여통장 · 7월 25일 09:12</div>

            <div style={{ marginTop: 'var(--space-2-5)', height: 14, borderRadius: 'var(--radius-pill)', overflow: 'hidden', display: 'flex' }}>
              {splits.map((sp) => (
                  <div key={sp.name} style={{ width: sp.pct, background: sp.dotColor }} />
              ))}
            </div>

            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 13 }}>
              {splits.map((sp) => (
                  <div key={sp.name} style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
                    <div style={{ width: 14, height: 14, borderRadius: 5, background: sp.dotColor }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{sp.name}</div>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{sp.desc}</div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{sp.amount}</div>
                      <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{sp.pct}</div>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-accent-text)' }}>이 분배가 여정에 주는 영향</div>
            <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
              <ImpactRow label="모인 금액" value={`${AP.pre[0].amount} → ${AP.post[0].amount}원`} />
              <ImpactRow label="진행률" value={`${AP.prePct}% → ${AP.postPct}%`} strong />
              <ImpactRow label="하루 예산" value={`${P.dailyBudget.toLocaleString()} → ${(P.dailyBudget + 600).toLocaleString()}원`} />
            </div>
          </div>

          <CtaButton height={62} style={{ marginTop: 'var(--space-2)' }} onClick={() => { setFueled(true); navigate('/home'); }}>
            이대로 자동 분배하기
          </CtaButton>
          <div style={{ marginTop: 'var(--space-1-5)', textAlign: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>비율 직접 조정하기</div>
        </div>
      </Screen>
  );
}

function ImpactRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: strong ? 'var(--color-accent-text)' : color.ink }}>{value}</span>
      </div>
  );
}
