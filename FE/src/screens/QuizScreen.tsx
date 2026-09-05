import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
import { Screen, ScreenHeader, Pill } from '../components/ui';
import { color } from '../styles/theme';

const options = ['원금이 함께 늘어난다', '이자에 이자가 붙는다', '세금이 줄어든다'];
const correctIndex = 1;

/** Daily one-question finance quiz, reached from the alerts list; correct answer cross-sells a product. */
export function QuizScreen() {
  const navigate = useNavigate();
  const quizPick = useAppStore((s) => s.quizPick);
  const pickQuiz = useAppStore((s) => s.pickQuiz);
  const resetQuiz = useAppStore((s) => s.resetQuiz);

  const done = quizPick != null;

  return (
    <Screen>
      <ScreenHeader
        onBack={() => navigate('/alerts')}
        backLabel="‹ 알림"
        rightChip={<Pill bg={color.purple} fg="var(--im-white)">오늘의 1문제</Pill>}
        sub="30초면 끝나요,"
        title="경제 퀴즈"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ background: 'var(--color-hero)', borderRadius: 'var(--radius-2xl)', padding: 'var(--space-3)', color: 'var(--im-white)' }}>
          <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mint }}>Q. 복리란?</div>
          <div style={{ marginTop: 10, fontSize: 21, fontWeight: 'var(--font-weight-bold)', lineHeight: 1.45, letterSpacing: '-.025em' }}>
            단리와 복리의<br />가장 큰 차이는?
          </div>
        </div>

        {options.map((label, i) => {
          const picked = quizPick === i;
          const correct = i === correctIndex;
          const bg = done ? (correct ? 'var(--color-30-surface-sub)' : picked ? 'var(--color-danger-surface)' : 'rgba(var(--color-ink-rgb),.05)') : 'var(--im-white)';
          const markBg = done && correct ? color.mintDark : picked ? 'var(--color-danger)' : 'rgba(var(--color-ink-rgb),.10)';
          const markFg = done && (correct || picked) ? 'var(--im-white)' : 'var(--color-60-text-secondary)';
          const mark = done && correct ? '✓' : picked ? '✕' : String.fromCharCode(65 + i);
          return (
            <div
              key={label}
              onClick={() => !done && pickQuiz(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '18px 20px', borderRadius: 'var(--radius-xl)', cursor: done ? 'default' : 'pointer', background: bg }}
            >
              <div style={{ flex: 'none', width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', background: markBg, color: markFg }}>{mark}</div>
              <span style={{ flex: 1, fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '-.015em' }}>{label}</span>
            </div>
          );
        })}

        {done && (
          <>
            <div style={{ background: 'var(--color-30-surface-sub)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-2-5)' }}>
              <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: color.mintDark }}>정답 · 마일리지 +5점</div>
              <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-sm)', lineHeight: 1.7, fontWeight: 'var(--font-weight-semibold)' }}>
                복리는 원금에 붙은 이자에 다시 이자가 붙습니다. 기간이 길수록 차이가 커져요.
              </div>
            </div>
            <div style={{ background: 'var(--color-60-bg-surface)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.08em', color: 'var(--color-60-text-secondary)' }}>이 퀴즈와 연결된 iM 상품</div>
                <Pill bg="var(--color-30-surface-sub)" fg={color.mintDark} style={{ fontSize: 'var(--font-size-2xs)' }}>자격 적합</Pill>
              </div>
              <div style={{ marginTop: 9, fontSize: 21, fontWeight: 'var(--font-weight-bold)', letterSpacing: '-.025em' }}>iM 복리적금</div>
              <div style={{ marginTop: 'var(--space-1)', fontSize: 'var(--font-size-xs)', lineHeight: 1.6, fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
                이자에 이자가 붙는 구조 · 3년 만기 · 기본금리 4.2% + 우대 1.5%p
              </div>
              <div
                onClick={() => navigate('/products')}
                style={{ minHeight: 'var(--btn-height-lg)', flexShrink: 0, lineHeight: 'var(--line-height-snug)', textAlign: 'center',  marginTop: 'var(--space-2)', height: 'var(--btn-height-lg)', borderRadius: 'var(--radius-lg)', background: 'var(--color-action-bg)', color: 'var(--color-action-text)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--component-gap)', cursor: 'pointer' }}
              >
                상품 자세히 보기
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-size-xs)' }}>›</span>
              </div>
            </div>
            <div onClick={resetQuiz} style={{ textAlign: 'center', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)', cursor: 'pointer' }}>
              다시 풀기
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
