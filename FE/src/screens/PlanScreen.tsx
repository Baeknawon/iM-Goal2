import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';
import { goalSetupDefs } from '../data/personas';
import { Screen, Pill, TicketShell, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

export function PlanScreen() {
  const navigate = useNavigate();
  const finishGoal = useAppStore((s) => s.finishGoal);
  const { persona, P, AP } = useJourney();
  const G = goalSetupDefs[persona];

  return (
    <Screen style={{ animation: 'slideUp .4s ease both' }}>
      <div style={{ padding: '70px 22px 34px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 'none' }}>
          <Pill bg={color.mint} fg={color.ink}>발권 완료 · 3/3</Pill>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: color.mint }} />
        </div>
        <div style={{ marginTop: 18, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)', flex: 'none' }}>티켓이 나왔어요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1, flex: 'none' }}>{AP.span} 여정</div>

        <div style={{ marginTop: 20, flex: 'none' }}>
          <TicketShell
            top={
              <div style={{ position: 'relative' }}>
                <img
                  src="/assets/dandi-pilot.png" alt="기장 단디"
                  style={{ position: 'absolute', right: -10, top: -76, width: 88, height: 'auto', display: 'block', zIndex: 5, animation: 'nod 4.4s ease-in-out infinite', filter: 'drop-shadow(0 10px 16px rgba(22,25,28,.18))' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.1em', color: 'rgba(22,25,28,.58)' }}>CLIMB AIRLINES</div>
                  <div style={{ fontSize: 11.5, fontWeight: 900, color: '#0A8873' }}>GOAL 0725</div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-.04em' }}>NOW</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 1 }}>{AP.now}</div>
                  </div>
                  <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ fontSize: 17, animation: 'fly 3s ease-in-out infinite' }}>✈</div>
                    <div style={{ width: 58, height: 2, background: 'repeating-linear-gradient(90deg,#C9D6D2 0 5px,transparent 5px 10px)' }} />
                    <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>{AP.span}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'right' }}>
                    <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-.04em', color: '#0A8873' }}>{P.code}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 1 }}>{AP.eta}</div>
                  </div>
                </div>
              </div>
            }
            bottom={
              <>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>목표</div>
                    <div style={{ fontSize: 16.5, fontWeight: 900, marginTop: 3 }}>{G.ticketGoal}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11.5, fontWeight: 900, color: 'rgba(22,25,28,.58)' }}>월 저축</div>
                    <div style={{ fontSize: 16.5, fontWeight: 900, marginTop: 3 }}>{G.monthly}</div>
                  </div>
                </div>
                <div style={{ marginTop: 18, background: color.ink, borderRadius: 22, padding: 18, color: '#fff' }}>
                  <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>하루 예산 · DAILY BUDGET</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-.04em' }}>{P.dailyBudget.toLocaleString()}</span><span style={{ fontSize: 17, fontWeight: 900 }}>원</span>
                  </div>
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,.14)', fontSize: 13.5, lineHeight: 1.75, color: 'rgba(255,255,255,.65)' }}>
                    {G.calc1}<br />{G.calc2}
                  </div>
                </div>
              </>
            }
          />
        </div>

        <div style={{ marginTop: 16, background: 'rgba(22,25,28,.08)', borderRadius: 24, padding: 20, flex: 'none' }}>
          <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.63)' }}>함께 설정할까요?</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 11 }}>
            <ConfirmedRow label="급여일 자동 분배 (매월 25일)" />
            <ConfirmedRow label="항로 이탈 시 즉시 알림" />
          </div>
        </div>

        <CtaButton
          height={62} style={{ marginTop: 16, flex: 'none' }}
          onClick={() => { finishGoal(); navigate('/home'); }}
        >
          이 티켓으로 탑승하기
        </CtaButton>
      </div>
    </Screen>
  );
}

function ConfirmedRow({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 34, height: 34, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>✓</div>
      <span style={{ fontSize: 14.5, fontWeight: 900 }}>{label}</span>
    </div>
  );
}
