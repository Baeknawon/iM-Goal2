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
        const text = draft.trim() || exampleForNext;
        setUserSaid((m) => ({ ...m, [shown]: text }));
        setDraft('');
        setListening(false);
        setShown((n) => Math.min(turns.length, n + 1));
    };

    // 음성 버튼(데모): 듣는 척하다가 예시 문장을 입력창에 채워 넣음
    const toggleMic = () => {
        if (listening) { setListening(false); return; }
        setListening(true);
        setTimeout(() => {
            setDraft(exampleForNext);
            setListening(false);
        }, 1400);
    };

    return (
        <Screen bg="#EDEFF1">
            <div style={{ padding: '58px 18px 0', flex: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Pill bg="rgba(22,25,28,.14)" onClick={() => navigate('/home')}>‹ 홈</Pill>
                    <Pill bg={color.mint} fg={color.ink}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: color.ink, animation: 'ringPulse 1.6s infinite' }} />
                        AI 상담 중
                    </Pill>
                </div>
            </div>

            <div ref={scrollRef} style={{ flex: 1, overflow: 'auto', padding: '18px 18px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {visible.map((turn, i) => (
                    <Bubble key={i} turn={turn} override={userSaid[i]} />
                ))}
                {!done && turns[shown]?.from !== 'user' && <TypingDots />}
            </div>

            <div style={{ flex: 'none', padding: '10px 14px 26px', background: '#EDEFF1' }}>
                {nextIsUser ? (
                    <>
                        {listening && (
                            <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 900, color: color.mintDark }}>
                                <span style={{ width: 9, height: 9, borderRadius: '50%', background: color.mint, animation: 'ringPulse 1.2s infinite' }} />
                                듣고 있어요…
                            </div>
                        )}
                        <div
                            style={{
                                minHeight: 58, borderRadius: 30, background: '#fff', border: '1px solid rgba(22,25,28,.12)',
                                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px 6px 16px',
                            }}
                        >
                            <input
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') sendUser(); }}
                                placeholder={exampleForNext}
                                style={{
                                    flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent',
                                    fontSize: 15, fontWeight: 600, color: color.ink, fontFamily: 'inherit',
                                }}
                            />
                            {/* 음성 입력 버튼 */}
                            <button
                                onClick={toggleMic}
                                aria-label="음성으로 말하기"
                                style={{
                                    flex: 'none', width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                                    background: listening ? color.mint : 'rgba(22,25,28,.08)', color: color.ink,
                                    animation: listening ? 'ringPulse 1.2s infinite' : undefined,
                                }}
                            >
                                🎙
                            </button>
                            {/* 보내기 버튼 */}
                            <button
                                onClick={sendUser}
                                aria-label="보내기"
                                style={{
                                    flex: 'none', width: 44, height: 44, borderRadius: '50%', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900,
                                    background: color.ink, color: '#fff',
                                }}
                            >
                                ↑
                            </button>
                        </div>
                        <div style={{ marginTop: 8, textAlign: 'center', fontSize: 12, fontWeight: 700, color: 'rgba(22,25,28,.45)' }}>
                            직접 입력하거나 🎙 눌러 말해도 돼요
                        </div>
                    </>
                ) : done ? (
                    <div
                        onClick={() => navigate('/report')}
                        style={{
                            height: 62, borderRadius: 9999, background: color.ink, color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 17, fontWeight: 900, cursor: 'pointer',
                        }}
                    >
                        이 계획으로 목표 리포트 보기
                        <span style={{ width: 26, height: 26, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>›</span>
                    </div>
                ) : (
                    <div style={{ height: 58, borderRadius: 9999, background: 'rgba(22,25,28,.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'rgba(22,25,28,.4)' }}>
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
                <div style={{ background: color.ink, borderRadius: '20px 20px 20px 6px', padding: 18, color: '#fff', marginLeft: 40 }}>
                    <div style={{ fontSize: 11, fontWeight: 900, letterSpacing: '.06em', color: color.mint }}>{p.tag}</div>
                    <div style={{ marginTop: 6, fontSize: 17, fontWeight: 900, letterSpacing: '-.02em' }}>{p.name}</div>
                    <div style={{ marginTop: 7, fontSize: 13, lineHeight: 1.6, fontWeight: 500, color: 'rgba(255,255,255,.72)' }}>{p.reason}</div>
                    <div style={{ marginTop: 14, display: 'flex', gap: 9 }}>
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
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '86%', animation: 'fadeUp .3s ease both' }}>
            {!isUser && (
                <div style={{ flex: 'none', width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <Mascot name="dandi" pose="hi" height={30} />
                </div>
            )}
            <div
                style={{
                    borderRadius: isUser ? '20px 20px 6px 20px' : '20px 20px 20px 6px',
                    padding: '13px 16px', fontSize: 15, lineHeight: 1.6, fontWeight: isUser ? 700 : 500,
                    background: isUser ? color.mint : '#fff', color: color.ink,
                    boxShadow: '0 1px 2px rgba(22,25,28,.06)',
                }}
            >
                {text}
            </div>
        </div>
    );
}

function ProdStat({ k, v }: { k: string; v: string }) {
    return (
        <div style={{ flex: 1, background: 'rgba(255,255,255,.1)', borderRadius: 14, padding: '10px 12px' }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,.55)' }}>{k}</div>
            <div style={{ marginTop: 3, fontSize: 15, fontWeight: 900 }}>{v}</div>
        </div>
    );
}

function TypingDots() {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, alignSelf: 'flex-start' }}>
            <div style={{ flex: 'none', width: 32, height: 32, borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                <Mascot name="dandi" pose="hi" height={30} />
            </div>
            <div style={{ background: '#fff', borderRadius: '20px 20px 20px 6px', padding: '14px 16px', display: 'flex', gap: 5 }}>
                {[0, 1, 2].map((i) => (
                    <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(22,25,28,.3)', animation: `wave .9s ease-in-out ${i * 0.15}s infinite` }} />
                ))}
            </div>
        </div>
    );
}
