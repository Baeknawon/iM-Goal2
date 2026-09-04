import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { useJourney } from '../viewmodel/useJourney';
import { acctDefs } from '../data/personas';
import { Screen, BackToHome, Pill, ScreenBody } from '../components/ui';
import { color } from '../styles/theme';

/**
 * 내 계좌 현황 상세.
 * 홈의 "내 계좌 현황" 카드에서 "자세히 보기"를 누르면 이 화면으로 옵니다.
 * 홈에는 요약(총 모인 금액 · 3계좌)만 두고, 계좌별 상세는 여기서 전부 보여줍니다.
 */
export function AccountsScreen() {
    const navigate = useNavigate();
    const { persona, fueled } = useJourney();
    const deposit = useAppStore((s) => s.deposit); // 실제 예치한 보증금
    const AP = acctDefs[persona];
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
            <div style={{ padding: '68px 22px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <BackToHome />
                    <Pill bg={fueled ? color.mintTintLight : 'rgba(125,181,255,.22)'} fg={fueled ? '#077264' : '#2E6BD0'}>
                        {fueled ? '방금 변동' : '분배 대기'}
                    </Pill>
                </div>
                <div style={{ marginTop: 16, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>{fueled ? '오늘 07:12 · 3계좌 자동 분배' : `어제 23:50 기준 · 페르소나 ${persona}`}</div>
                <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>내 계좌 현황</div>
            </div>

            <ScreenBody>
                {/* 총액 요약 = 전체 보유 금액 (3계좌 합산) */}
                <div style={{ background: color.ink, borderRadius: 28, padding: 22, color: '#fff' }}>
                    <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>전체 보유 금액</div>
                    <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 38, fontWeight: 900, letterSpacing: '-.03em' }}>{totalBalance}</span>
                        <span style={{ fontSize: 16, fontWeight: 900 }}>원</span>
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.6)' }}>3계좌 잔액을 모두 합한 금액이에요</div>
                </div>

                {/* 계좌별 상세 */}
                <div style={{ marginTop: 14, background: '#fff', borderRadius: 26, padding: 22, color: color.ink }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {rows.map((a) => (
                            <div key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ flex: 'none', width: 14, height: 14, borderRadius: 5, background: a.dotColor }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 15.5, fontWeight: 900, letterSpacing: '-.01em' }}>{a.name}</div>
                                    <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.58)', marginTop: 2 }}>{a.desc}</div>
                                </div>
                                <div style={{ flex: 'none', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <div style={{ fontSize: 16, fontWeight: 900 }}>{a.amount}원</div>
                                    <div style={{ fontSize: 12, fontWeight: 900, marginTop: 2, color: a.delta.includes('+') ? '#077264' : a.delta.includes('-') ? '#D0512E' : 'rgba(22,25,28,.62)' }}>{a.delta}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 급여 분배 설정으로 이동 */}
                <div
                    onClick={() => navigate('/splitSettings')}
                    style={{ marginTop: 14, background: 'rgba(22,25,28,.08)', borderRadius: 26, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                >
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: color.sky, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>급</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 900 }}>급여 분배 설정</div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'rgba(22,25,28,.63)', marginTop: 2 }}>분배 비율 변경하기</div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(22,25,28,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 900 }}>›</div>
                </div>
            </ScreenBody>
        </Screen>
    );
}
