import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { answerAssistant, assistantSuggestions, type AssistantReply } from '../viewmodel/assistant';
import type { PersonaKey } from '../types';

interface Message extends AssistantReply { role: 'user' | 'assistant' }
const greeting: Message = { role: 'assistant', text: '안녕하세요, 똑디예요! 지금 보고 있는 화면에서 궁금한 점을 물어보세요. 목표와 미션을 함께 살펴볼게요.' };

export function GlobalAssistant() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const persona = useAppStore((s) => s.persona);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [history, setHistory] = useState<Record<PersonaKey, Message[]>>({ A: [], B: [], C: [] });
  const host = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLElement>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const messages = history[persona];

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { setDraft(''); }, [persona]);
  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    // Keep keyboard navigation and screen readers inside the sheet while it is open.
    const siblings = Array.from(host.current?.parentElement?.children ?? [])
      .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== host.current);
    const previous = siblings.map((node) => node.inert);
    siblings.forEach((node) => { node.inert = true; });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
      if (event.key !== 'Tab') return;
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]') ?? []);
      const first = items[0]; const last = items.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      siblings.forEach((node, i) => { node.inert = previous[i]; });
      document.removeEventListener('keydown', onKey);
      launcher.current?.focus();
    };
  }, [open]);
  useEffect(() => { if (open) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, open]);

  const send = (value: string) => {
    const question = value.trim().slice(0, 1000);
    if (!question) return;
    const response = answerAssistant(question, useAppStore.getState());
    setHistory((old) => ({ ...old, [persona]: [...old[persona], { role: 'user' as const, text: question }, { role: 'assistant' as const, ...response }].slice(-80) }));
    setDraft('');
  };

  return <div ref={host} className="assistant-host">
    <button ref={launcher} type="button" className="assistant-launcher" aria-label="똑디에게 물어보기" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)} hidden={open}>
      <img src="/assets/ddokdi-credit.png" alt="" /><span>똑디</span>
    </button>
    {open && <div className="assistant-overlay">
      <div className="assistant-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <section ref={panel} className="assistant-sheet" role="dialog" aria-modal="true" aria-labelledby="assistant-title" aria-describedby="assistant-description">
        <header className="assistant-header">
          <img src="/assets/ddokdi-credit.png" alt="" />
          <div><h2 id="assistant-title">똑디에게 물어보기</h2><p id="assistant-description">화면 맞춤 도우미 · 데모</p></div>
          <button type="button" aria-label="챗봇 닫기" onClick={() => setOpen(false)}>×</button>
        </header>
        <div className="assistant-meta"><span>화면을 옮겨도 대화가 이어져요</span><button type="button" disabled={messages.length === 0} onClick={() => setHistory((old) => ({ ...old, [persona]: [] }))}>대화 지우기</button></div>
        <div className="assistant-messages" role="log" aria-live="polite" aria-relevant="additions" tabIndex={0} aria-label="똑디와의 대화">
          {[greeting, ...messages].map((message, index) => <div key={index} className={`assistant-message ${message.role}`}>
            <span className="assistant-speaker">{message.role === 'user' ? '나' : '똑디'}</span>
            <p>{message.text}</p>
            {message.action && <button type="button" className="assistant-action" onClick={() => { setOpen(false); navigate(message.action!.to); }}>{message.action.label}<span aria-hidden="true">›</span></button>}
          </div>)}
          <div ref={end} />
        </div>
        <div className="assistant-suggestions" aria-label="현재 화면 추천 질문">{assistantSuggestions(pathname).map((question) => <button type="button" key={question} onClick={() => send(question)}>{question}</button>)}</div>
        <form className="assistant-compose" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
          <label className="assistant-sr-only" htmlFor="assistant-input">똑디에게 보낼 질문</label>
          <input ref={input} id="assistant-input" value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && event.nativeEvent.isComposing) event.preventDefault(); }} maxLength={1000} placeholder="궁금한 점을 물어보세요" autoComplete="off" />
          <button type="submit" disabled={!draft.trim()} aria-label="질문 보내기">↑</button>
        </form>
        <p className="assistant-footnote">앱 데이터 기반 데모 답변 · 거래는 직접 실행하지 않아요</p>
      </section>
    </div>}
  </div>;
}
