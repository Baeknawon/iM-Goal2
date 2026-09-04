import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { goalPlanDefs } from '../data/personas';
import { Screen, Pill, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

/**
 * AI 목표설정 리포트 (고정).
 * 챗봇 대화로 만들어진 목표 계획을 한 화면에 리포트 형태로 정리해 보여줍니다.
 * "이 계획으로 시작하기"를 누르면 목표가 확정되고(finishGoal) 홈으로 이동합니다.
 */
export function GoalReportScreen() {
    const navigate = useNavigate();
    const persona = useAppStore((s) => s.persona);
    const R = goalPlanDefs[persona];

    return (
        <Screen>
            <div style={{ padding: '58px 22px 0', flex: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pill onClick={() => navigate('/chat')}>‹ 대화</Pill>
                    <Pill bg={color.mint} fg={color.ink}>AI 목표 리포트</Pill>
                </div>
                <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>대화를 바탕으로 정리했어요,</div>
                <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>{R.goalName} 계획</div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 34px' }}>
                {/* 요약 카드 */}
                <div style={{ background: color.ink, borderRadius: 28, padding: 22, color: '#fff' }}>
                    <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>GOAL SUMMARY</div>
                    <div style={{ marginTop: 8, fontSize: 17, fontWeight: 900, lineHeight: 1.5, letterSpacing: '-.02em' }}>{R.summary}</div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                        <SummaryCell k="목표 금액" v={R.goalAmount} />
                        <SummaryCell k="기간" v={R.span} />
                        <SummaryCell k="도착 예정" v={R.eta} />
                    </div>
                </div>

                {/* 핵심 숫자 */}
                <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
                    <NumCard k="매달 저축" v={R.monthly} accent={color.mintDark} />
                    <NumCard k="하루 예산" v={R.dailyBudget} accent={color.ink} />
                </div>

                {/* 이 계획을 세운 근거 */}
                <div style={{ marginTop: 14, background: '#fff', borderRadius: 26, padding: 22, color: color.ink }}>
                    <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.55)' }}>이 계획을 세운 근거</div>
                    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 11 }}>
                        {R.reasons.map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                                <div style={{ flex: 'none', width: 22, height: 22, borderRadius: '50%', background: color.mintTintLight, color: color.mintDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, marginTop: 1 }}>{i + 1}</div>
                                <span style={{ fontSize: 14.5, fontWeight: 700, lineHeight: 1.5 }}>{r}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI가 추천한 상품 */}
                <div style={{ marginTop: 14, fontSize: 13, fontWeight: 900, letterSpacing: '.04em', color: 'rgba(22,25,28,.55)', paddingLeft: 4 }}>대화 중 추천한 iM뱅크 상품</div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {R.products.map((p) => (
                        <div key={p.name} style={{ background: '#fff', border: '1px solid rgba(22,25,28,.1)', borderRadius: 22, padding: 18, color: color.ink }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ padding: '4px 10px', borderRadius: 9999, background: color.mintTintLight, color: color.mintDark, fontSize: 11, fontWeight: 900 }}>{p.tag}</span>
                                <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-.02em' }}>{p.name}</span>
                            </div>
                            <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.6, fontWeight: 500, color: 'rgba(22,25,28,.62)' }}>{p.reason}</div>
                            <div style={{ marginTop: 12, display: 'flex', gap: 9 }}>
                                <MiniStat k={p.k1} v={p.v1} />
                                <MiniStat k={p.k2} v={p.v2} />
                            </div>
                        </div>
                    ))}
                </div>

                <CtaButton height={62} style={{ marginTop: 18 }} onClick={() => navigate('/issuing')}>
                    이 계획으로 시작하기
                </CtaButton>
                <div style={{ marginTop: 12, textAlign: 'center', fontSize: 13, fontWeight: 700, color: 'rgba(22,25,28,.5)' }} onClick={() => navigate('/chat')}>
                    다시 대화하기
                </div>
            </div>
        </Screen>
    );
}

function SummaryCell({ k, v }: { k: string; v: string }) {
    return (
        <div style={{ flex: 1, background: 'rgba(255,255,255,.1)', borderRadius: 16, padding: '12px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,.55)' }}>{k}</div>
            <div style={{ marginTop: 4, fontSize: 15, fontWeight: 900, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{v}</div>
        </div>
    );
}

function NumCard({ k, v, accent }: { k: string; v: string; accent: string }) {
    return (
        <div style={{ flex: 1, background: '#fff', borderRadius: 22, padding: 18, color: color.ink }}>
            <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(22,25,28,.55)' }}>{k}</div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 900, letterSpacing: '-.03em', color: accent, whiteSpace: 'nowrap' }}>{v}</div>
        </div>
    );
}

function MiniStat({ k, v }: { k: string; v: string }) {
    return (
        <div style={{ flex: 1, background: '#F2F5F4', borderRadius: 14, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(22,25,28,.5)' }}>{k}</div>
            <div style={{ marginTop: 3, fontSize: 14.5, fontWeight: 900 }}>{v}</div>
        </div>
    );
}
