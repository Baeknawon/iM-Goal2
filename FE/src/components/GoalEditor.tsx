import { useState } from 'react';
import { useAppStore } from '../store/appStore';
import { financePlan, type GoalInput } from '../viewmodel/finance';
import { parseGoalSentence, type ParsedGoal } from '../viewmodel/goalNaturalLanguage';
import { color } from '../styles/theme';

/** GoalInput 유효성 — updateGoal(store)과 동일 기준. 폼·자연어 확인 양쪽에서 재사용한다. */
function isValidGoal(g: GoalInput): boolean {
  return Boolean(g.name.trim())
    && [g.target, g.saved, g.months, g.repayment].every(Number.isFinite)
    && g.target > 0 && g.target <= 1e12
    && g.saved >= 0 && g.saved <= g.target
    && Number.isInteger(g.months) && g.months >= 1 && g.months <= 600
    && g.repayment >= 0;
}

/**
 * 목표 수정 진입점 + 수정 모달.
 * 화면에는 작은 "목표 수정" 버튼(칩)만 두고, 누르면 하단 시트로 수정 폼이 열린다.
 * 반영하면 store의 goal이 갱신되고(updateGoal), financePlan을 읽는 모든 화면(홈·리포트·여정상세·소비분석 등)에
 * 자동으로 반영된다.
 *
 * variant:
 *  - 'chip'  : 리포트·여정상세처럼 화면 안에 끼워 넣는 인라인 칩 버튼
 */
export function GoalEditor({ label = '목표 수정' }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-pill)',
          border: '1px solid var(--color-60-border)', background: 'var(--color-60-bg-surface)', color: 'var(--color-60-text-secondary)',
          fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer',
        }}
      >
        <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        {label}
      </button>
      {open && <GoalEditModal onClose={() => setOpen(false)} />}
    </>
  );
}

function GoalEditModal({ onClose }: { onClose: () => void }) {
  const state = useAppStore();
  const [draft, setDraft] = useState(state.goal);
  const [error, setError] = useState('');
  const preview = financePlan({ ...state, goal: draft });

  // 자연어 입력 상태.
  const [nlText, setNlText] = useState('');
  const [parsed, setParsed] = useState<ParsedGoal | null>(null);
  const [nlError, setNlError] = useState('');

  // 파싱 결과를 현재 draft에 병합한 "예정 목표". 추출된 필드만 덮어쓰고 나머지(예: 상환액)는 유지한다.
  const nlDraft: GoalInput | null = parsed
    ? {
        ...draft,
        ...(parsed.name !== undefined ? { name: parsed.name } : {}),
        ...(parsed.target !== undefined ? { target: parsed.target } : {}),
        ...(parsed.months !== undefined ? { months: parsed.months } : {}),
        ...(parsed.saved !== undefined ? { saved: parsed.saved } : {}),
      }
    : null;
  const nlPreview = nlDraft ? financePlan({ ...state, goal: nlDraft }) : null;

  const runParse = () => {
    setNlError('');
    const result = parseGoalSentence(nlText);
    // 필수 항목(금액·기간)을 못 잡으면 확인 카드를 띄우지 않고 재입력을 안내한다(요구사항 7.4).
    if (result.missing.length) {
      setParsed(null);
      const need = result.missing.map((k) => (k === 'target' ? '목표 금액' : '기간')).join('·');
      setNlError(`${need}을(를) 이해하지 못했어요. 예: "2년 안에 3천만원 모으고 싶어"처럼 다시 말해 주세요.`);
      return;
    }
    setParsed(result);
  };

  // 확인 카드에서 "이대로 반영" — 유효성 검증(폼과 동일)을 통과할 때만 적용(요구사항 7.6).
  const confirmParsed = () => {
    if (!nlDraft) return;
    if (!isValidGoal(nlDraft)) {
      setNlError('이해한 값이 유효 범위를 벗어났어요. 모아둔 돈은 목표 금액 이하, 기간은 1~600개월이어야 해요.');
      return;
    }
    setDraft(nlDraft);
    setError('');
    setNlError('');
    setParsed(null);
    state.updateGoal(nlDraft);
    onClose();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // updateGoal의 검증과 동일 기준으로 미리 확인해, 조용히 무시되지 않도록 안내한다.
    if (!isValidGoal(draft)) {
      setError('입력값을 확인해주세요. 모아둔 돈은 목표 금액 이하, 기간은 1~600개월이어야 해요.');
      return;
    }
    state.updateGoal(draft);
    onClose();
  };

  const fields = [
    { key: 'target', label: '목표 금액 (원)', min: 1, max: 1e12 },
    { key: 'saved', label: '모아둔 금액 (원)', min: 0, max: draft.target },
    { key: 'months', label: '남은 목표 기간 (개월)', min: 1, max: 600 },
    { key: 'repayment', label: '월 부채 상환액 (원)', min: 0, max: 1e9 },
  ] as const;

  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'rgba(var(--color-ink-rgb),.42)', display: 'flex', alignItems: 'flex-end' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '100%', maxHeight: '86%', overflow: 'auto', background: 'var(--im-white)', borderRadius: '28px 28px 0 0', padding: '22px 22px 32px', boxShadow: '0 -16px 46px rgba(var(--color-ink-rgb),.35)', animation: 'slideUp .32s ease both', color: color.ink }}
      >
        <div style={{ width: 44, height: 5, borderRadius: 9999, background: 'var(--color-30-surface-sub)', margin: '0 auto 18px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.02em' }}>목표 수정</h2>
          <button type="button" aria-label="닫기" onClick={onClose} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: 'var(--color-30-surface-sub)', color: 'var(--color-60-text-secondary)', fontSize: 18, cursor: 'pointer' }}>×</button>
        </div>
        <p style={{ margin: '0 0 4px', fontSize: 'var(--font-size-2xs)', color: 'var(--color-60-text-secondary)', lineHeight: 1.6 }}>
          여기서 바꾼 목표는 홈·리포트·여정 상세·소비분석 등 모든 화면에 함께 반영돼요.
        </p>

        {/* 자연어 입력 — 문장으로 말하면 파서가 금액·기간을 이해해 확인 카드로 보여준다. */}
        <div style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)', margin: '14px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
            </svg>
            말로 목표 바꾸기
          </div>
          <textarea
            value={nlText}
            onChange={(e) => { setNlText(e.target.value); setNlError(''); }}
            placeholder='예: "2년 안에 3천만원 모으고 싶어"'
            rows={2}
            style={{ width: '100%', boxSizing: 'border-box', resize: 'none', border: '1px solid var(--color-60-border)', borderRadius: 'var(--radius-md)', padding: '10px 12px', fontSize: 'var(--font-size-sm)', color: color.ink, background: 'var(--im-white)', fontFamily: 'inherit' }}
          />
          <button
            type="button"
            onClick={runParse}
            disabled={!nlText.trim()}
            style={{ marginTop: 8, width: '100%', padding: '10px 0', borderRadius: 'var(--radius-pill)', border: 'none', background: nlText.trim() ? 'var(--color-action-bg)' : 'var(--color-30-surface-sub)', color: nlText.trim() ? 'var(--color-action-text)' : 'var(--color-60-text-secondary)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', cursor: nlText.trim() ? 'pointer' : 'default' }}
          >
            AI에게 정리 맡기기
          </button>

          {nlError && (
            <p style={{ margin: '10px 0 0', fontSize: 'var(--font-size-2xs)', color: 'var(--color-danger)', fontWeight: 'var(--font-weight-semibold)', lineHeight: 1.5 }}>{nlError}</p>
          )}

          {parsed && nlDraft && nlPreview && (
            <div style={{ marginTop: 12, background: 'var(--im-white)', border: '1px solid var(--color-60-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)' }}>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-accent-text)', marginBottom: 8 }}>AI가 이렇게 이해했어요</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--font-size-sm)' }}>
                {parsed.name !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-60-text-secondary)' }}>목표 이름</span>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{nlDraft.name}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-60-text-secondary)' }}>금액</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{nlDraft.target.toLocaleString()}원</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-60-text-secondary)' }}>기간</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{nlDraft.months}개월</span>
                </div>
                {parsed.saved !== undefined && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-60-text-secondary)' }}>모아둔 금액</span>
                    <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{nlDraft.saved.toLocaleString()}원</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-60-text-secondary)' }}>예상 도착</span>
                  <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>{nlPreview.eta}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => { setParsed(null); }}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-pill)', border: '1px solid var(--color-60-border)', background: 'var(--im-white)', color: 'var(--color-60-text-secondary)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}
                >
                  다시 말하기
                </button>
                <button
                  type="button"
                  onClick={confirmParsed}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 'var(--radius-pill)', border: 'none', background: 'var(--color-action-bg)', color: 'var(--color-action-text)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', cursor: 'pointer' }}
                >
                  이대로 반영하기
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', margin: '0 0 6px' }}>직접 입력하기</div>
        <form className="goal-editor" onSubmit={submit}>
          <label>목표 이름
            <input required maxLength={40} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          {fields.map((field) => (
            <label key={field.key}>{field.label}
              <input
                type="number" required min={field.min} max={field.max} step="1"
                value={draft[field.key]}
                onChange={(e) => { setError(''); setDraft({ ...draft, [field.key]: e.target.value === '' ? 0 : Number(e.target.value) }); }}
              />
            </label>
          ))}
          <div style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
              <span>이 목표에 {draft.saved.toLocaleString()}원 모음</span>
              <span>{preview.savedPct}%</span>
            </div>
            <div style={{ marginTop: 8, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
              월 저축 {preview.monthlySaving.toLocaleString()}원 · 하루 예산 {preview.dailyBudget.toLocaleString()}원
            </div>
            <div style={{ marginTop: 4, fontSize: 'var(--font-size-2xs)', color: 'var(--color-60-text-secondary)' }}>예상 도착 {preview.eta}</div>
          </div>
          <p className="insight-caption">보유 자산 전체가 아닌 이 목표에 배정한 돈을 입력하세요. 상환액은 고정비와 중복으로 넣지 않아요.</p>
          {error && <p style={{ margin: 0, fontSize: 'var(--font-size-2xs)', color: 'var(--color-danger)', fontWeight: 'var(--font-weight-semibold)' }}>{error}</p>}
          <button className="goal-save" type="submit">목표에 반영하기</button>
        </form>
      </div>
    </div>
  );
}
