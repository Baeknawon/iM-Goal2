import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { goalPlanDefs, personaDefs } from '../data/personas';
import { useJourney } from '../viewmodel/useJourney';
import { Screen } from '../components/ui';
import { color } from '../styles/theme';

const DURATION_MS = 2600;

/**
 * "티켓을 발급 중입니다" 로딩 화면.
 * 리포트에서 "이 계획으로 시작하기"를 누르면 이 화면으로 와서, 목표를 확정(finishGoal)한 뒤
 * 초반 발권 화면(PlanScreen)과 같은 탑승권 모양의 미니 티켓이 촤라락 넘어가는 애니메이션을
 * 잠시 보여주고 홈으로 자동 이동합니다.
 */
export function TicketIssueScreen() {
    const navigate = useNavigate();
    const persona = useAppStore((s) => s.persona);
    const finishGoal = useAppStore((s) => s.finishGoal);
    const R = goalPlanDefs[persona];
    const P = personaDefs[persona];
    const { AP } = useJourney();

    useEffect(() => {
        finishGoal();
        const t = setTimeout(() => navigate('/home'), DURATION_MS);
        return () => clearTimeout(t);
    }, [finishGoal, navigate]);

    // 촤라락 넘어가는 탑승권 티켓들 (각기 다른 딜레이로 순차 flip)
    const count = 5;

    return (
        <Screen bg="#16191C">
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 30px', color: '#fff' }}>
                {/* 탑승권 스택: 여러 장이 위로 촤라락 넘어감 */}
                <div style={{ position: 'relative', width: 260, height: 168, perspective: 900, marginBottom: 46 }}>
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            style={{
                                position: 'absolute', inset: 0,
                                transformOrigin: 'center bottom', transformStyle: 'preserve-3d',
                                animation: `ticketFlip 1.5s ease-in-out ${i * 0.28}s infinite`,
                            }}
                        >
                            <MiniBoardingPass
                                code={P.code}
                                goalName={R.goalName}
                                monthly={R.monthly}
                                span={R.span}
                                now={AP.now}
                                eta={AP.eta}
                            />
                        </div>
                    ))}
                </div>

                <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '.18em', color: color.mint }}>CLIMB AIRLINES</div>
                <div style={{ marginTop: 12, fontSize: 25, fontWeight: 900, letterSpacing: '-.03em' }}>티켓을 발급 중입니다</div>
                <div style={{ marginTop: 9, fontSize: 14.5, fontWeight: 500, color: 'rgba(255,255,255,.6)', textAlign: 'center', lineHeight: 1.6 }}>
                    {R.goalName} · {R.span} 여정<br />탑승권을 만들고 있어요
                </div>

                {/* 진행 바 */}
                <div style={{ marginTop: 30, width: 220, height: 8, borderRadius: 9999, background: 'rgba(255,255,255,.14)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 9999, background: color.mint, animation: `ticketProgress ${DURATION_MS}ms ease-out forwards` }} />
                </div>

                <div style={{ marginTop: 18, fontSize: 12.5, fontWeight: 700, color: 'rgba(255,255,255,.45)', animation: 'floatUp 2s ease-in-out infinite' }}>
                    ✈ 좌석 배정 · 항로 계산 · 발권
                </div>
            </div>
        </Screen>
    );
}

/**
 * 초반 발권 화면(PlanScreen)의 탑승권을 축소한 미니 버전:
 * 상단 카드(NOW ✈ 목적지 코드) + 절취선(양옆 반원 노치) + 하단 카드(목표 · 월 저축).
 */
function MiniBoardingPass({
                              code, goalName, monthly, span, now, eta,
                          }: { code: string; goalName: string; monthly: string; span: string; now: string; eta: string }) {
    const notch = { position: 'absolute' as const, top: '50%', marginTop: -9, width: 18, height: 18, borderRadius: '50%', background: '#16191C', zIndex: 2 };
    return (
        <div style={{ position: 'relative', filter: 'drop-shadow(0 14px 30px rgba(0,0,0,.4))' }}>
            {/* 상단 */}
            <div style={{ background: '#fff', borderRadius: '16px 16px 0 0', padding: '12px 16px 10px', color: color.ink }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 8.5, fontWeight: 900, letterSpacing: '.12em', color: 'rgba(22,25,28,.55)' }}>CLIMB AIRLINES</span>
                    <span style={{ fontSize: 8.5, fontWeight: 900, color: '#0A8873' }}>GOAL 0725</span>
                </div>
                <div style={{ marginTop: 9, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-.04em' }}>NOW</div>
                        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{now}</div>
                    </div>
                    <div style={{ flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <div style={{ fontSize: 12 }}>✈</div>
                        <div style={{ width: 40, height: 2, background: 'repeating-linear-gradient(90deg,#C9D6D2 0 4px,transparent 4px 8px)' }} />
                        <div style={{ fontSize: 8, fontWeight: 900, color: 'rgba(22,25,28,.55)' }}>{span}</div>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
                        <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-.04em', color: '#0A8873' }}>{code}</div>
                        <div style={{ fontSize: 8, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{eta}</div>
                    </div>
                </div>
            </div>
            {/* 절취선 */}
            <div style={{ position: 'relative', height: 14, background: '#fff', display: 'flex', alignItems: 'center' }}>
                <div style={{ ...notch, left: -9 }} />
                <div style={{ ...notch, right: -9 }} />
                <div style={{ flex: 1, margin: '0 14px', height: 2, background: 'repeating-linear-gradient(90deg,#D8E2DF 0 5px,transparent 5px 10px)' }} />
            </div>
            {/* 하단 */}
            <div style={{ background: '#fff', borderRadius: '0 0 16px 16px', padding: '10px 16px 13px', color: color.ink, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <div style={{ fontSize: 8.5, fontWeight: 900, color: 'rgba(22,25,28,.55)' }}>목표</div>
                    <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '-.02em', marginTop: 2 }}>{goalName}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 8.5, fontWeight: 900, color: 'rgba(22,25,28,.55)' }}>월 저축</div>
                    <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '-.02em', marginTop: 2 }}>{monthly}</div>
                </div>
            </div>
        </div>
    );
}
