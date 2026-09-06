import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { salarySplitDefs, acctDefs } from '../data/personas';
import { Screen, Pill, ScreenBody, CtaButton } from '../components/ui';
import { color } from '../styles/theme';

/**
 * 급여 분배 비율 설정.
 * 계좌 상세(/accounts)의 "급여 분배 설정"에서 진입합니다.
 * 3계좌(목표저축 · iMKRW 머니 충전 · 생활비)의 분배 비율을 슬라이더로 조정합니다.
 * 보증금(iMKRW 머니) 비율도 직접 조정할 수 있습니다. (데모: 저장은 로컬 상태로만 반영)
 */
export function SalarySplitSettingsScreen() {
    const navigate = useNavigate();
    const persona = useAppStore((s) => s.persona);
    const splits = salarySplitDefs[persona];
    const AP = acctDefs[persona];

    // 입금액(월급) 총액 숫자
    const totalNum = parseInt(AP.total.replace(/[^0-9]/g, ''), 10) || 0;
    // iMKRW 머니 충전 계좌(민트)인지 — 라벨만 살짝 다르게
    const isWallet = (i: number) => splits[i].dotColor === color.mint;

    // 초기 비율(정수 %)을 salarySplitDefs에서 파싱
    const initial = splits.map((s) => parseInt(s.pct.replace(/[^0-9]/g, ''), 10) || 0);
    const [pcts, setPcts] = useState<number[]>(initial);

    const sum = pcts.reduce((a, b) => a + b, 0);
    const valid = sum === 100;

    // 한 계좌 비율을 바꾸면 나머지 두 계좌로 차이를 비례 배분해 합계 100 유지
    const setPct = (idx: number, next: number) => {
        const clamped = Math.max(0, Math.min(100, next));
        const otherIdx = splits.map((_, i) => i).filter((i) => i !== idx);
        const othersSum = otherIdx.reduce((a, i) => a + pcts[i], 0);
        const remain = 100 - clamped;
        setPcts((prev) =>
            prev.map((p, i) => {
                if (i === idx) return clamped;
                if (othersSum === 0) return Math.round(remain / otherIdx.length);
                return Math.round((p / othersSum) * remain);
            }),
        );
    };

    const resetDefault = () => setPcts(initial);

    return (
        <Screen>
            <div style={{ padding: '68px var(--screen-padding-x) 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pill onClick={() => navigate('/accounts')}>‹ 계좌 현황</Pill>
                    <Pill bg={color.mint} fg={color.ink}>매월 25일 자동</Pill>
                </div>
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>급여가 들어오면 이 비율로,</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>분배 비율 설정</div>
            </div>

            <ScreenBody>
                {/* 입금액 + 합계 바 */}
                <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: 'var(--color-60-text-secondary)' }}>월 입금액 기준</span>
                        <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{AP.total}원</span>
                    </div>
                    <div style={{ marginTop: 'var(--space-1-5)', height: 14, borderRadius: 'var(--radius-pill)', overflow: 'hidden', display: 'flex', background: 'var(--color-30-tab-bg)' }}>
                        {splits.map((sp, i) => (
                            <div key={sp.name} style={{ width: `${pcts[i]}%`, background: sp.dotColor, transition: 'width .2s ease' }} />
                        ))}
                    </div>
                    <div style={{ marginTop: 10, textAlign: 'right', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: valid ? 'var(--color-accent-text)' : 'var(--color-danger)' }}>
                        합계 {sum}% {valid ? '· 딱 맞아요' : '· 100%로 맞춰주세요'}
                    </div>
                </div>

                {/* 계좌별 슬라이더 */}
                <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                    {splits.map((sp, i) => {
                        const amount = Math.round((totalNum * pcts[i]) / 100);
                        const wallet = isWallet(i);
                        return (
                            <div key={sp.name} style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)', color: color.ink }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--component-gap)' }}>
                                    <div style={{ flex: 'none', width: 12, height: 12, borderRadius: 4, background: sp.dotColor }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.01em' }}>{wallet ? 'iMKRW 머니 충전' : sp.name}</div>
                                        <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{wallet ? '미션 보증금으로 쓰이는 머니' : sp.desc}</div>
                                    </div>
                                    <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{pcts[i]}%</div>
                                        <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{amount.toLocaleString('en-US')}원</div>
                                    </div>
                                </div>
                                <input
                                    type="range" min={0} max={100} value={pcts[i]}
                                    onChange={(e) => setPct(i, Number(e.target.value))}
                                    style={{ marginTop: 'var(--space-1-5)', width: '100%', accentColor: sp.dotColor as string, cursor: 'pointer' }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div
                    onClick={resetDefault}
                    style={{ marginTop: 'var(--space-1-5)', textAlign: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', cursor: 'pointer' }}
                >
                    추천 비율로 되돌리기
                </div>

                <CtaButton
                    height={62} style={{ marginTop: 'var(--space-1-5)', opacity: valid ? 1 : 0.45, pointerEvents: valid ? 'auto' : 'none' }}
                    onClick={() => navigate('/accounts')}
                >
                    이 비율로 저장하기
                </CtaButton>
            </ScreenBody>
        </Screen>
    );
}
