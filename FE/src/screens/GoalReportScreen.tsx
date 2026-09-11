import { GoalEditor } from '../components/GoalEditor';
import { financePlan, FINANCE_DATE } from '../viewmodel/finance';
import { useEffect } from 'react';
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
    const beginGoalPlan = useAppStore((s) => s.beginGoalPlan);
    // 리포트는 항상 "지금 계획을 세우는 시점" → 모아둔 돈 0부터 시작. 저장된 후반 상태가 있어도 되돌린다.
    useEffect(() => { beginGoalPlan(); }, [beginGoalPlan]);
    const state=useAppStore();
    const plan=financePlan(state);
    // 리포트는 목표설정 직후 "이 계획대로면 언제 도착"을 보여주므로 계획 기간 기준 도착일(plannedEta)을 쓴다.
    const R = {...goalPlanDefs[persona],goalName:plan.goal.name,goalAmount:plan.goal.target.toLocaleString()+'원',span:plan.goal.months+'개월',eta:plan.plannedEta,monthly:plan.monthlySaving.toLocaleString()+'원',dailyBudget:plan.dailyBudget.toLocaleString()+'원',summary:plan.goal.name+' 목표에 모아둔 돈 '+plan.goal.saved.toLocaleString()+'원 · 남은 '+plan.left.toLocaleString()+'원을 모으는 계획이에요.',reasons:plan.reasons};

    return (
        <Screen>
            <div style={{ padding: 'var(--screen-pad-top) 22px 0', flex: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pill onClick={() => navigate('/chat')}>‹ 대화</Pill>
                    <Pill bg={color.mint} fg={color.ink}>AI 목표 리포트</Pill>
                </div>
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>입력한 목표와 수입을 바탕으로 계산했어요,</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>{R.goalName} 계획</div>
            </div>

            <div style={{ flex: 1, overflow: 'auto', padding: '16px 22px 34px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-1)', marginBottom: 'var(--space-1-5)' }}>
                    <p className="insight-caption" style={{ margin: 0 }}>{FINANCE_DATE} 기준 · 이자·세금 제외 · 월 30일 환산</p>
                    <GoalEditor />
                </div>
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
            <div style={{ marginTop: 6, fontSize: 22, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', color: accent, overflowWrap: 'anywhere' }}>{v}</div>
        </div>
    );
}
