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
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>대화를 바탕으로 정리했어요,</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>{R.goalName} 계획</div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 34px' }}>
                {/* 요약 카드 */}
                <div style={{ background: 'var(--color-hero)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: 'var(--im-white)' }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>GOAL SUMMARY</div>
                    <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', lineHeight: 1.5, letterSpacing: '-.02em' }}>{R.summary}</div>
                    <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--component-gap)' }}>
                        <SummaryCell k="목표 금액" v={R.goalAmount} />
                        <SummaryCell k="기간" v={R.span} />
                        <SummaryCell k="도착 예정" v={R.eta} />
                    </div>
                </div>

                {/* 핵심 숫자 */}
                <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', gap: 'var(--component-gap)' }}>
                    <NumCard k="매달 저축" v={R.monthly} accent={color.mintDark} />
                    <NumCard k="하루 예산" v={R.dailyBudget} accent={color.ink} />
                </div>

                {/* 이 계획을 세운 근거 */}
                <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>이 계획을 세운 근거</div>
                    <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 11 }}>
                        {R.reasons.map((r, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                                <div style={{ flex: 'none', width: 22, height: 22, borderRadius: '50%', background: color.mintTintLight, color: color.mintDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', marginTop: 'var(--space-0-5)' }}>{i + 1}</div>
                                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 1.5 }}>{r}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI가 추천한 상품 */}
                <div style={{ marginTop: 'var(--space-1-5)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.04em', color: 'var(--color-60-text-secondary)', paddingLeft: 4 }}>대화 중 추천한 iM뱅크 상품</div>
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 'var(--component-gap)' }}>
                    {R.products.map((p) => (
                        <div key={p.name} style={{ background: 'var(--color-60-bg-surface)', border: '1px solid var(--color-60-border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)', color: color.ink }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                                <span style={{ padding: '4px 10px', borderRadius: 'var(--radius-pill)', background: color.mintTintLight, color: color.mintDark, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)' }}>{p.tag}</span>
                                <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>{p.name}</span>
                            </div>
                            <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)', lineHeight: 1.6, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>{p.reason}</div>
                            <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', gap: 'var(--component-gap)' }}>
                                <MiniStat k={p.k1} v={p.v1} />
                                <MiniStat k={p.k2} v={p.v2} />
                            </div>
                        </div>
                    ))}
                </div>

                <CtaButton height={62} style={{ marginTop: 18 }} onClick={() => navigate('/issuing')}>
                    이 계획으로 시작하기
                </CtaButton>
                <div style={{ marginTop: 'var(--space-1-5)', textAlign: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }} onClick={() => navigate('/chat')}>
                    다시 대화하기
                </div>
            </div>
        </Screen>
    );
}

function SummaryCell({ k, v }: { k: string; v: string }) {
    return (
        <div style={{ flex: 1, background: 'rgba(var(--color-white-rgb),.1)', borderRadius: 'var(--radius-lg)', padding: '12px 12px' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>{k}</div>
            <div style={{ marginTop: 4, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{v}</div>
        </div>
    );
}

function NumCard({ k, v, accent }: { k: string; v: string; accent: string }) {
    return (
        <div style={{ flex: 1, background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)', color: color.ink }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: 'var(--color-60-text-secondary)' }}>{k}</div>
            <div style={{ marginTop: 6, fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: accent, whiteSpace: 'nowrap' }}>{v}</div>
        </div>
    );
}

function MiniStat({ k, v }: { k: string; v: string }) {
    return (
        <div style={{ flex: 1, background: 'var(--color-30-surface-sub)', borderRadius: 14, padding: '10px 12px' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>{k}</div>
            <div style={{ marginTop: 3, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{v}</div>
        </div>
    );
}
