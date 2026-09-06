import { initialGoal } from '../viewmodel/finance';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { goalChatDefs, type ChatTurn } from '../data/personas';
import { Screen, Pill, Mascot } from '../components/ui';
import { color } from '../styles/theme';

/**
 * AI 목표설정 챗봇 (대화형).
 * 목표 등록을 시작하면 바로 이 화면으로 들어옵니다. 페르소나별로 미리 짜인 대화가
 * 한 턴씩 나타나고, 사용자는 차례마다 (1) 직접 타이핑하거나 (2) 음성 버튼으로
 * 말하듯 입력할 수 있습니다. 사용자의 말을 분석해 iM뱅크 상품을 추천하는 카드가
 * 중간에 등장하고, 대화가 끝나면 리포트 화면(/report)으로 넘어갑니다.
 */
export function ChatGoalScreen() {
    const persona=useAppStore(s=>s.persona);
    return <ScriptedGoalChat key={persona}/>;
}
function ScriptedGoalChat() {
    const navigate = useNavigate();
    const persona = useAppStore((s) => s.persona);
    const turns = goalChatDefs[persona];

    // 지금까지 화면에 표시된 대화 턴 수
    const [shown, setShown] = useState(1);
    // 사용자가 직접 입력한 텍스트로 덮어쓴 턴들 (index -> text)
    const [userSaid, setUserSaid] = useState<Record<number, string>>({});
    // 현재 입력창 값 / 음성 인식 중 여부
    const [draft, setDraft] = useState('');
    const [listening, setListening] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const micTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const stopMic = () => {
        if (micTimer.current !== null) clearTimeout(micTimer.current);
        micTimer.current = null;
        setListening(false);
    };
    useEffect(() => () => { if (micTimer.current !== null) clearTimeout(micTimer.current); }, []);

    const done = shown >= turns.length;
    const visible = turns.slice(0, shown);

    // 새 말풍선이 나올 때마다 맨 아래로 스크롤
    useEffect(() => {
        const el = scrollRef.current;
        if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, [shown, listening]);

    // AI/상품 말풍선은 자동으로 이어지고, user 차례에서 멈춰 사용자가 입력하게 함
    useEffect(() => {
        if (done) return;
        const upcoming = turns[shown];
        if (upcoming && upcoming.from !== 'user') {
            const t = setTimeout(() => setShown((n) => Math.min(turns.length, n + 1)), 900);
            return () => clearTimeout(t);
        }
    }, [shown, done, turns]);

    const nextIsUser = !done && turns[shown]?.from === 'user';
    const exampleForNext = nextIsUser ? (turns[shown].text ?? '') : '';

    // 사용자 메시지 전송: 입력값이 있으면 그것을, 없으면 시나리오 예시 문장을 사용
    const sendUser = () => {
        if (!nextIsUser) return;
        stopMic();
        const text = draft.trim() || exampleForNext;
        setUserSaid((m) => ({ ...m, [shown]: text }));
        setDraft('');
        setListening(false);
        setShown((n) => Math.min(turns.length, n + 1));
    };

    // Microphone animation only: fills the authored reply without requesting audio access.
    const toggleMic = () => {
        if (!nextIsUser) return;
        if (listening) { stopMic(); return; }
        setListening(true);
        micTimer.current = setTimeout(() => {
            micTimer.current = null;
            setDraft(exampleForNext);
            setListening(false);
        }, 1400);
    };

    return (
        <Screen bg="var(--color-60-bg-base)">
            <div style={{ padding: '58px 18px 0', flex: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pill bg="rgba(var(--color-ink-rgb),.14)" onClick={() => navigate('/home')}>‹ 홈</Pill>
                    <Pill bg={color.mint} fg={color.ink}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-hero)', animation: 'ringPulse 1.6s infinite' }} />
                        AI 상담 중
                    </Pill>
                </div>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '18px 18px 12px', display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                {visible.map((turn, i) => (
                    <Bubble key={i} turn={turn} override={userSaid[i]} />
                ))}
                {!done && turns[shown]?.from !== 'user' && <TypingDots />}
            </div>

            <div style={{ flex: 'none', padding: '10px 14px 26px', background: 'var(--color-30-tab-bg)' }}>
                {nextIsUser ? (
                    <>
                        {listening && (
                            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: color.mintDark }}>
                                <span style={{ width: 9, height: 9, borderRadius: '50%', background: color.mint, animation: 'ringPulse 1.2s infinite' }} />
                                듣고 있어요…
                            </div>
                        )}
                        <div
                            style={{
                                minHeight: 58, borderRadius: 'var(--radius-2xl)', background: 'var(--color-60-bg-surface)', border: '1px solid var(--color-60-border)',
                                display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '6px 8px 6px 16px',
                            }}
                        >
                            <input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); sendUser(); } }}
                                placeholder={exampleForNext}
                                style={{
                                    flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                                    fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: color.ink, fontFamily: 'inherit',
                                }}
                            />
                            {/* 음성 입력 버튼 */}
                            <button
                                onClick={toggleMic}
                                aria-label={listening ? "음성 입력 연출 멈추기" : "음성 입력 연출"} aria-pressed={listening}
                                style={{
                                    flex: 'none', width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-lg)',
                                    background: listening ? color.mint : 'rgba(var(--color-ink-rgb),.08)', color: color.ink,
                                    animation: listening ? 'ringPulse 1.2s infinite' : undefined,
                                }}
                            >
                                <svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg>
                            </button>
                            {/* 보내기 버튼 */}
                            <button
                                onClick={sendUser}
                                aria-label="보내기"
                                style={{
                                    flex: 'none', width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)',
                                    background: 'var(--color-action-bg)', color: 'var(--color-action-text)',
                                }}
                            >
                                ↑
                            </button>
                        </div>
                        <div style={{ marginTop: 'var(--space-1)', textAlign: 'center', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
                            보내기나 마이크를 눌러 대화를 이어가세요
                        </div>
                    </>
                ) : done ? (
                    <div
                        onClick={() => { useAppStore.getState().updateGoal(initialGoal(persona)); navigate('/report'); }}
                        style={{ minHeight: 'var(--btn-height-xl)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',
                            height: 'var(--btn-height-xl)', borderRadius: 'var(--radius-lg)', background: 'var(--color-action-bg)', color: 'var(--color-action-text)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--component-gap)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', cursor: 'pointer',
                        }}
                    >
                        이 계획으로 목표 리포트 보기
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)' }}>›</span>
                    </div>
                ) : (
                    <div style={{ minHeight: 'var(--btn-height-xl)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  height: 'var(--btn-height-xl)', borderRadius: 'var(--radius-lg)', background: 'var(--color-30-surface-sub)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>
                        단디가 입력 중…
                    </div>
                )}
            </div>
        </Screen>
    );
}

function Bubble({ turn, override }: { turn: ChatTurn; override?: string }) {
    if (turn.from === 'product' && turn.product) {
        const p = turn.product;
        return (
            <div style={{ animation: 'fadeUp .35s ease both', alignSelf: 'stretch' }}>
                <div style={{ background: 'var(--color-hero)', borderRadius: '20px 20px 20px 6px', padding: 'var(--space-2)', color: 'var(--im-white)', marginLeft: 40 }}>
                    <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: color.mint }}>{p.tag}</div>
                    <div style={{ marginTop: 6, fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>{p.name}</div>
                    <div style={{ marginTop: 7, fontSize: 'var(--font-size-xs)', lineHeight: 1.6, fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-on-dark-muted)' }}>{p.reason}</div>
                    <div style={{ marginTop: 'var(--space-1-5)', display: 'flex', gap: 'var(--component-gap)' }}>
                        <ProdStat k={p.k1} v={p.v1} />
                        <ProdStat k={p.k2} v={p.v2} />
                    </div>
                </div>
            </div>
        );
    }

    const isUser = turn.from === 'user';
    const text = isUser ? (override ?? turn.text) : turn.text;
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-1)', alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '86%', animation: 'fadeUp .3s ease both' }}>
            {!isUser && (
                <div style={{ flex: 'none', width: 32, height: 32, borderRadius: '50%', background: 'var(--color-60-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Mascot name="dandi" pose="hi" height={30} />
                </div>
            )}
            <div
                style={{
                    borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    padding: '13px 16px', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, fontWeight: isUser ? 700 : 500,
                    background: isUser ? color.mint : 'var(--im-white)', color: color.ink,
                    boxShadow: '0 1px 2px rgba(var(--color-ink-rgb),.06)',
                }}
            >
                {text}
            </div>
        </div>
    );
}

function ProdStat({ k, v }: { k: string; v: string }) {
    return (
        <div style={{ flex: 1, background: 'rgba(var(--color-white-rgb),.1)', borderRadius: 14, padding: '10px 12px' }}>
            <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-text-on-dark-muted)' }}>{k}</div>
            <div style={{ marginTop: 3, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>{v}</div>
        </div>
    );
}

function TypingDots() {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-1)', alignSelf: 'flex-start' }}>
            <div style={{ flex: 'none', width: 32, height: 32, borderRadius: '50%', background: 'var(--color-60-bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Mascot name="dandi" pose="hi" height={30} />
            </div>
            <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: '20px 20px 20px 6px', padding: '14px 16px', display: 'flex', gap: 5 }}>
                {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(var(--color-ink-rgb),.3)', animation: `wave .9s ease-in-out ${i * 0.15}s infinite` }} />
                ))}
            </div>
        </div>
    );
}
