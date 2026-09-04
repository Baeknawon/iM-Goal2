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
            <div style={{ padding: '68px 22px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pill onClick={() => navigate('/accounts')}>‹ 계좌 현황</Pill>
                    <Pill bg={color.mint} fg={color.ink}>매월 25일 자동</Pill>
                </div>
                <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>급여가 들어오면 이 비율로,</div>
                <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>분배 비율 설정</div>
            </div>

            <ScreenBody>
                {/* 입금액 + 합계 바 */}
                <div style={{ background: '#fff', borderRadius: 26, padding: 22, color: color.ink }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(22,25,28,.55)' }}>월 입금액 기준</span>
                        <span style={{ fontSize: 17, fontWeight: 900 }}>{AP.total}원</span>
                    </div>
                    <div style={{ marginTop: 14, height: 14, borderRadius: 9999, overflow: 'hidden', display: 'flex', background: '#EEF1F2' }}>
                        {splits.map((sp, i) => (
                            <div key={sp.name} style={{ width: `${pcts[i]}%`, background: sp.dotColor, transition: 'width .2s ease' }} />
                        ))}
                    </div>
                    <div style={{ marginTop: 10, textAlign: 'right', fontSize: 12.5, fontWeight: 900, color: valid ? '#077264' : '#D0512E' }}>
                        합계 {sum}% {valid ? '· 딱 맞아요' : '· 100%로 맞춰주세요'}
                    </div>
                </div>

                {/* 계좌별 슬라이더 */}
                <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {splits.map((sp, i) => {
                        const amount = Math.round((totalNum * pcts[i]) / 100);
                        const wallet = isWallet(i);
                        return (
                            <div key={sp.name} style={{ background: '#fff', borderRadius: 22, padding: 18, color: color.ink }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ flex: 'none', width: 12, height: 12, borderRadius: 4, background: sp.dotColor }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-.01em' }}>{wallet ? 'iMKRW 머니 충전' : sp.name}</div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(22,25,28,.55)', marginTop: 1 }}>{wallet ? '미션 보증금으로 쓰이는 머니' : sp.desc}</div>
                                    </div>
                                    <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                        <div style={{ fontSize: 16, fontWeight: 900 }}>{pcts[i]}%</div>
                                        <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(22,25,28,.55)', marginTop: 1 }}>{amount.toLocaleString('en-US')}원</div>
                                    </div>
                                </div>
                                <input
                                    type="range" min={0} max={100} value={pcts[i]}
                                    onChange={(e) => setPct(i, Number(e.target.value))}
                                    style={{ marginTop: 14, width: '100%', accentColor: sp.dotColor as string, cursor: 'pointer' }}
                                />
                            </div>
                        );
                    })}
                </div>

                <div
                    onClick={resetDefault}
                    style={{ marginTop: 14, textAlign: 'center', fontSize: 13.5, fontWeight: 900, color: 'rgba(22,25,28,.55)', cursor: 'pointer' }}
                >
                    추천 비율로 되돌리기
                </div>

                <CtaButton
                    height={62} style={{ marginTop: 14, opacity: valid ? 1 : 0.45, pointerEvents: valid ? 'auto' : 'none' }}
                    onClick={() => navigate('/accounts')}
                >
                    이 비율로 저장하기
                </CtaButton>
            </ScreenBody>
        </Screen>
    );
}
