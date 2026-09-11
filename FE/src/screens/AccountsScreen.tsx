import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';

import { Screen, BackToHome, Pill, ScreenBody } from '../components/ui';
import { color } from '../styles/theme';

/**
 * 내 계좌 현황 상세.
 * 홈의 "내 계좌 현황" 카드에서 "자세히 보기"를 누르면 이 화면으로 옵니다.
 * 홈에는 요약(총 모인 금액 · 3계좌)만 두고, 계좌별 상세는 여기서 전부 보여줍니다.
 */
export function AccountsScreen() {
    const navigate = useNavigate();
    const { persona, AP, fueled } = useJourney();
    const deposit = useAppStore((s) => s.wallet+s.locked); // 실제 예치한 보증금

    const baseRows = fueled ? AP.post : AP.pre;

    // 보증금 계좌(민트)는 실제 예치 금액(deposit)으로 표시 통일
    const rows = baseRows.map((a) =>
        a.dotColor === color.mint ? { ...a, amount: deposit.toLocaleString('en-US') } : a,
    );
    // 전체 보유 금액 = 표시되는 3계좌 금액의 합 (보증금 deposit 반영)
    const totalBalance = rows
        .reduce((sum, a) => sum + (parseInt(a.amount.replace(/[^0-9]/g, ''), 10) || 0), 0)
        .toLocaleString('en-US');

    return (
        <Screen>
            <div style={{ padding: 'var(--screen-pad-top) var(--screen-padding-x) 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <BackToHome />
                    <Pill bg={fueled ? color.mintTintLight : 'rgba(var(--color-blue-rgb),.22)'} fg={fueled ? 'var(--color-accent-text)' : 'var(--color-info-text)'}>
                        {fueled ? '방금 변동' : '분배 대기'}
                    </Pill>
                </div>
                <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>{fueled ? '분배 기록 반영 후 잔액' : `어제 23:50 기준 · 페르소나 ${persona}`}</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>내 계좌 현황</div>
            </div>

            <ScreenBody>
                {/* 총액 요약 = 전체 보유 금액 (3계좌 합산) */}
                <div style={{ background: 'var(--color-hero)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: 'var(--im-white)' }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>전체 보유 금액</div>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 38, fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)' }}>{totalBalance}</span>
                        <span style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>원</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>3계좌 잔액을 모두 합한 금액이에요</div>
                </div>

                {/* 계좌별 상세 */}
                <div style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)', color: color.ink }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {rows.map((a) => (
                            <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                                <div style={{ flex: 'none', width: 14, height: 14, borderRadius: 5, background: a.dotColor }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.01em' }}>{a.name}</div>
                                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>{a.desc}</div>
                                </div>
                                <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>{a.amount}원</div>
                                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', marginTop: 'var(--space-0-5)', color: a.delta.includes('+') ? 'var(--color-accent-text)' : a.delta.includes('-') ? 'var(--color-danger)' : 'var(--color-60-text-secondary)' }}>{a.delta}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 급여 분배 설정으로 이동 */}
                <div
                    onClick={() => navigate('/splitSettings')}
                    style={{ marginTop: 'var(--space-1-5)', background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)', cursor: 'pointer' }}
                >
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.sky, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>급</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>급여 분배 설정</div>
                        <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', marginTop: 'var(--space-0-5)' }}>분배 비율 변경하기</div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-30-surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>›</div>
                </div>
            </ScreenBody>
        </Screen>
    );
}
