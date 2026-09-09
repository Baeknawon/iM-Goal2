import { currentMission, failureReasons } from '../viewmodel/adaptiveMission';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, Brand } from '../components/ui';

import { color } from '../styles/theme';
import { mockMissionHistory, formatMissionDate } from '../data/mileageHistory';
import type { MissionResult } from '../types';

interface Ticket {
    leg: string;
    date: string;
    name: string;
    days: string;
    amount: number;
    status: string;
    live: boolean;
    go: string;
    /** 회복 확인 상세로 가는 경로 (있으면 "회복보기" 버튼 노출). */
    recoveryGo?: string;
}

/** 미션 tab: every recovery mission (deposit-backed "LEG" tickets) — the current one plus completed history. */
export function MissionsScreen() {
    const navigate = useNavigate();
    const deposit = useAppStore((s) => s.deposit);
    const missionOn = useAppStore((s) => s.missionOn);
    const missionResult = useAppStore((s) => s.missionResult);
    const locked = useAppStore((s) => s.locked);
    const wallet = useAppStore((s) => s.wallet);
    const startedAt = useAppStore((s) => s.missionStartedAt);
    const entries = useAppStore((s) => s.fcpsLog);
    const activePlan = useAppStore((s) => s.activeRecoveryPlan);
    const finishMission = useAppStore((s) => s.finishMission);
    const MI = currentMission(useAppStore());

    const curName = `${MI.title1} ${MI.title2}`;
    const tickets: Ticket[] = [
        // 진행 중(트리거로 생성, 아직 결과 전) — 클릭 가능
        ...(missionOn && missionResult === null
            ? [{
                leg: MI.leg, name: curName, days: `D-${Math.max(0, (activePlan?.missionDays ?? 14) - (startedAt ? Math.floor((Date.now() - new Date(startedAt).getTime()) / 86400000) : 0))}`,
                amount: deposit, status: '예치 중', live: true, go: '/missionLive',
                date: `${formatMissionDate(startedAt)} 시작 · 진행 중`,
            }]
            : []),
        ...entries.map((entry, index) => ({
            leg: `최근 미션 ${entries.length - index} · 완료`, name: entry.mission,
            days: entry.result === 'success' ? '미션 성공' : (entry.result === 'fail' ? '미션 실패' : '미션 포기') + (entry.failureReason ? ' · '+failureReasons[entry.failureReason] : ''),
            amount: entry.deposit, status: '전액 환원', live: false,
            go: entry.recovery ? '/recovery?completedAt='+encodeURIComponent(entry.recovery.completedAt) : '',
            recoveryGo: entry.result === 'success' && entry.recovery ? '/recovery?completedAt='+encodeURIComponent(entry.recovery.completedAt) : undefined,
            date: entry.startedAt
                ? `${formatMissionDate(entry.startedAt)} ~ ${formatMissionDate(entry.completedAt)}`
                : `${formatMissionDate(entry.completedAt)} 완료`,
        })),
        ...mockMissionHistory.map((mission) => ({
            ...mission, status: mission.amount > 0 ? '전액 환원' : '보증금 없음', live: false, go: '',
            date: `${mission.startDate} ~ ${mission.endDate}`,
        })),
    ];

    return (
        <Screen>
            <div style={{ padding: '60px var(--screen-padding-x) 0', flex: 'none' }}>
                <Brand size={20} style={{ marginBottom: 'var(--space-1-5)' }} />
                <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>약속하고, 지키고, 돌려받기</div>
                <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: 'var(--letter-spacing-heading)', lineHeight: 'var(--line-height-snug)', marginTop: 'var(--space-0-5)' }}>회복 미션</div>
            </div>
            <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                {/* 현재 미션에 묶인 보증금 총합 */}
                <div style={{ background: 'var(--color-hero)', borderRadius: 'var(--radius-xl)', padding: '18px 20px', color: 'var(--im-white)', display: 'flex', alignItems: 'center', gap: 'var(--space-1-5)' }}>
                    <div style={{ flex: 'none', width: 42, height: 42, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)' }}>₩</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: color.mint }}>현재 미션에 묶인 돈</div>
                        <div style={{ marginTop: 'var(--space-0-5)', fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>{locked.toLocaleString()} <span style={{ fontSize: 'var(--font-size-sm)' }}>iMKRW</span></div>
                    </div>
                    <div style={{ flex: 'none', textAlign: 'right' }}>
                        <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>머니 잔액</div>
                        <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{wallet.toLocaleString()}</div>
                    </div>
                </div>
                {missionOn && missionResult === null && <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: 'var(--color-60-text-secondary)' }}>진행 중</div>}
                {tickets.map((t) => (
                    <div key={t.leg} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                    <div
                        onClick={() => { if (t.go) navigate(t.go); }}
                        style={{ position: 'relative', display: 'flex', alignItems: 'stretch', borderRadius: 'var(--radius-lg)', cursor: t.go ? 'pointer' : 'default', background: t.live ? color.hero : 'var(--im-white)', color: t.live ? 'var(--im-white)' : color.ink, opacity: t.go || t.live ? 1 : 0.92 }}
                    >
                        <div style={{ flex: 1, minWidth: 0, padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: t.live ? color.mint : 'var(--color-60-text-secondary)' }}>{t.leg}</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.02em', lineHeight: 1.35 }}>{t.name}</div>
                            <div style={{ fontSize: 'var(--font-size-xs)', lineHeight: 1.6, color: t.live ? 'var(--color-text-on-dark-muted)' : 'var(--color-60-text-secondary)', marginTop: 4 }}>{t.date}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--component-gap)', marginTop: 'var(--space-0-5)' }}>
                                <span style={{ flex: 1, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', opacity: 0.6 }}>{t.days}</span>
                                <span style={{ flex: 'none', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: t.live ? color.mint : color.mintDark }}>{t.status}</span>
                            </div>
                        </div>
                        <div style={{ position: 'relative', flex: 'none', width: 2, margin: '12px 0', background: `repeating-linear-gradient(180deg,${t.live ? 'var(--color-text-on-dark-muted)' : 'rgba(var(--color-ink-rgb),.20)'} 0 5px,transparent 5px 10px)` }}>
                            <div style={{ position: 'absolute', left: -8, top: -20, width: 18, height: 18, borderRadius: '50%', background: color.bg }} />
                            <div style={{ position: 'absolute', left: -8, bottom: -20, width: 18, height: 18, borderRadius: '50%', background: color.bg }} />
                        </div>
                        <div style={{ flex: 'none', width: 88, borderRadius: '0 20px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, padding: '16px 0', background: t.live ? color.mint : 'rgba(var(--color-ink-rgb),.06)', color: color.ink }}>
                            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.1em', opacity: 0.6 }}>DEPOSIT</div>
                            <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.02em' }}>{t.amount > 0 ? `${t.amount.toLocaleString()}원` : '—'}</div>
                            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', opacity: 0.55 }}>iMKRW</div>
                        </div>
                    </div>
                    {t.live && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-0-5)' }}>
                            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: 'var(--color-60-text-secondary)' }}>미션 결과를 선택하면 보증금이 전액 환원돼요</div>
                            <div style={{ display: 'flex', gap: 'var(--space-0-5)' }}>
                                {[
                                    { result: 'success' as MissionResult, label: '미션 성공', primary: true },
                                    { result: 'fail' as MissionResult, label: '실패', primary: false },
                                    { result: 'give_up' as MissionResult, label: '중단', primary: false },
                                ].map((opt) => (
                                    <button
                                        key={opt.result}
                                        type="button"
                                        onClick={() => { finishMission(opt.result); navigate('/release'); }}
                                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '13px 12px', borderRadius: 'var(--radius-lg)', border: opt.primary ? 'none' : '1px solid rgba(var(--color-ink-rgb),.12)', background: opt.primary ? color.mint : 'var(--im-white)', color: color.ink, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.01em', cursor: 'pointer' }}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {t.recoveryGo && (
                        <button
                            type="button"
                            onClick={() => navigate(t.recoveryGo!)}
                            style={{ alignSelf: 'stretch', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-0-5)', padding: '13px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(var(--color-ink-rgb),.12)', background: 'var(--im-white)', color: color.ink, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.01em', cursor: 'pointer' }}
                        >
                            회복 확인 경로 보기
                            <span aria-hidden="true" style={{ color: color.mintDark }}>›</span>
                        </button>
                    )}
                    </div>
                ))}
                <div style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2)', fontSize: 'var(--font-size-2xs)', lineHeight: 1.7, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-60-text-secondary)' }}>
                    미션에는 시작일과 완료일이 기록됩니다.<br />보증금은 벌칙이 아닙니다. 성공·실패·포기 어느 경우든 iMKRW 지갑으로 전액 돌려받고, 결과만 FCPS에 기록됩니다.
                </div>
            </div>
        </Screen>
    );
}
