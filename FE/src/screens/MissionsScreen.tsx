import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand } from '../components/ui';
import { missionDefs } from '../data/personas';
import { color } from '../styles/theme';

interface Ticket {
    leg: string;
    name: string;
    days: string;
    amount: number;
    status: string;
    live: boolean;
    go: string;
}

/** 미션 tab: every recovery mission (deposit-backed "LEG" tickets) — the current one plus completed history. */
export function MissionsScreen() {
    const navigate = useNavigate();
    const persona = useAppStore((s) => s.persona);
    const deposit = useAppStore((s) => s.deposit);
    const missionOn = useAppStore((s) => s.missionOn);
    const missionResult = useAppStore((s) => s.missionResult);
    const locked = useAppStore((s) => s.locked);
    const wallet = useAppStore((s) => s.wallet);
    const MI = missionDefs[persona];

    const curName = `${MI.title1} ${MI.title2}`;
    // 트리거로 생성된 현재 미션의 결과 라벨(회복 완료 후 리스트에 남길 때)
    const resultStatus = missionResult === 'success' ? '성공 · 전액 환원'
        : missionResult === 'fail' ? '실패 · 전액 환원'
            : missionResult === 'give_up' ? '포기 · 전액 환원'
                : '완료';

    const tickets: Ticket[] = [
        // 진행 중(트리거로 생성, 아직 결과 전) — 클릭 가능
        ...(missionOn && missionResult === null
            ? [{
                leg: MI.leg, name: curName, days: `D-${Math.max(1, MI.daysTotal - MI.daysDone)}`,
                amount: deposit, status: '예치 중', live: true, go: '/missionLive',
            }]
            : []),
        // 결과가 나온 현재 미션(성공/실패/포기) → 완료 항목으로 리스트에 남김 (클릭 불가)
        ...(missionResult !== null
            ? [{
                leg: `${MI.leg.split(' · ')[0]} · 완료`, name: curName, days: `${MI.daysTotal}일 수행`,
                amount: deposit, status: resultStatus, live: false, go: '',
            }]
            : []),
        // 기존 완료 미션 (항상 클릭 불가)
        { leg: 'LEG 03 · 완료', name: '카페 지출 주 2회로 줄이기', days: '14일 수행', amount: 20000, status: '전액 환원', live: false, go: '' },
        { leg: 'LEG 02 · 완료', name: '구독 서비스 2건 정리하기', days: '7일 수행', amount: 10000, status: '전액 환원', live: false, go: '' },
        { leg: 'LEG 01 · 완료', name: '주간 예산 기록 습관 만들기', days: '7일 수행', amount: 0, status: '보증금 없음', live: false, go: '' },
    ];

    return (
        <Screen>
            <div style={{ padding: '60px 22px 0', flex: 'none' }}>
                <Brand size={20} style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>약속하고, 지키고, 돌려받기</div>
                <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.14, marginTop: 1 }}>회복 미션</div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* 현재 미션에 묶인 보증금 총합 */}
                <div style={{ background: color.ink, borderRadius: 24, padding: '18px 20px', color: '#fff', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ flex: 'none', width: 42, height: 42, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>₩</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.06em', color: color.mint }}>현재 미션에 묶인 돈</div>
                        <div style={{ marginTop: 2, fontSize: 22, fontWeight: 900, letterSpacing: '-.02em' }}>{locked.toLocaleString()} <span style={{ fontSize: 14 }}>iMKRW</span></div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right' }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.55)' }}>머니 잔액</div>
                        <div style={{ fontSize: 15, fontWeight: 900 }}>{wallet.toLocaleString()}</div>
                    </div>
                </div>
                {missionOn && missionResult === null && <div style={{ fontSize: 12.5, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(22,25,28,.58)' }}>진행 중</div>}
                {tickets.map((t) => (
                    <div
                        key={t.leg}
                        onClick={() => { if (t.go) navigate(t.go); }}
                        style={{ position: 'relative', display: 'flex', alignItems: 'stretch', borderRadius: 20, cursor: t.go ? 'pointer' : 'default', background: t.live ? color.ink : '#fff', color: t.live ? '#fff' : color.ink, opacity: t.go || t.live ? 1 : 0.92 }}
                    >
                        <div style={{ flex: 1, minWidth: 0, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ fontSize: 10.5, fontWeight: 900, letterSpacing: '.06em', color: t.live ? color.mint : 'rgba(22,25,28,.55)' }}>{t.leg}</div>
                            <div style={{ fontSize: 15.5, fontWeight: 900, letterSpacing: '-.02em', lineHeight: 1.35 }}>{t.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 2 }}>
                                <span style={{ flex: 1, fontSize: 12, fontWeight: 700, opacity: 0.6 }}>{t.days}</span>
                                <span style={{ flex: 'none', fontSize: 11.5, fontWeight: 900, color: t.live ? color.mint : color.mintDark }}>{t.status}</span>
                            </div>
                        </div>
                        <div style={{ position: 'relative', flex: 'none', width: 2, margin: '12px 0', background: `repeating-linear-gradient(180deg,${t.live ? 'rgba(255,255,255,.34)' : 'rgba(22,25,28,.20)'} 0 5px,transparent 5px 10px)` }}>
                            <div style={{ position: 'absolute', left: -8, top: -20, width: 18, height: 18, borderRadius: '50%', background: color.bg }} />
                            <div style={{ position: 'absolute', left: -8, bottom: -20, width: 18, height: 18, borderRadius: '50%', background: color.bg }} />
                        </div>
                        <div style={{ flex: 'none', width: 88, borderRadius: '0 20px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '16px 0', background: t.live ? color.mint : 'rgba(22,25,28,.06)', color: color.ink }}>
                            <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: '.1em', opacity: 0.6 }}>DEPOSIT</div>
                            <div style={{ fontSize: 15, fontWeight: 900, letterSpacing: '-.02em' }}>{t.amount > 0 ? `${t.amount.toLocaleString()}원` : '—'}</div>
                            <div style={{ fontSize: 9.5, fontWeight: 900, letterSpacing: '.08em', opacity: 0.55 }}>iMKRW</div>
                        </div>
                    </div>
                ))}
                <div style={{ background: 'rgba(22,25,28,.07)', borderRadius: 24, padding: 18, fontSize: 12.5, lineHeight: 1.7, fontWeight: 500, color: 'rgba(22,25,28,.62)' }}>
                    보증금은 벌칙이 아닙니다. 성공·실패·포기 어느 경우든 iMKRW 지갑으로 전액 돌려받고, 결과만 FCPS에 기록됩니다.
                </div>
            </div>
        </Screen>
    );
}
