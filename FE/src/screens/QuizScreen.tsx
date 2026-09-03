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
        rightChip={<Pill bg={color.purple} fg="#fff">오늘의 1문제</Pill>}
        sub="30초면 끝나요,"
        title="경제 퀴즈"
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '18px 22px 120px', display: 'flex', flexDirection: 'column', gap: 11 }}>
        <div style={{ background: color.ink, borderRadius: 30, padding: 24, color: '#fff' }}>
          <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: color.mint }}>Q. 복리란?</div>
          <div style={{ marginTop: 10, fontSize: 21, fontWeight: 900, lineHeight: 1.45, letterSpacing: '-.025em' }}>
            단리와 복리의<br />가장 큰 차이는?
          </div>
        </div>

        {options.map((label, i) => {
          const picked = quizPick === i;
          const correct = i === correctIndex;
          const bg = done ? (correct ? '#E0F7F3' : picked ? '#FFE2DA' : 'rgba(22,25,28,.05)') : '#fff';
          const markBg = done && correct ? color.mintDark : picked ? '#C4472A' : 'rgba(22,25,28,.10)';
          const markFg = done && (correct || picked) ? '#fff' : 'rgba(22,25,28,.6)';
          const mark = done && correct ? '✓' : picked ? '✕' : String.fromCharCode(65 + i);
          return (
            <div
              key={label}
              onClick={() => !done && pickQuiz(i)}
              style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '18px 20px', borderRadius: 24, cursor: done ? 'default' : 'pointer', background: bg }}
            >
              <div style={{ flex: 'none', width: 30, height: 30, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, background: markBg, color: markFg }}>{mark}</div>
              <span style={{ flex: 1, fontSize: 15, fontWeight: 900, letterSpacing: '-.015em' }}>{label}</span>
            </div>
          );
        })}

        {done && (
          <>
            <div style={{ background: '#E0F7F3', borderRadius: 28, padding: 22 }}>
              <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: color.mintDark }}>정답 · 마일리지 +5점</div>
              <div style={{ marginTop: 8, fontSize: 14.5, lineHeight: 1.7, fontWeight: 700 }}>
                복리는 원금에 붙은 이자에 다시 이자가 붙습니다. 기간이 길수록 차이가 커져요.
              </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 28, padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: '.08em', color: 'rgba(22,25,28,.58)' }}>이 퀴즈와 연결된 iM 상품</div>
                <Pill bg="#E0F7F3" fg={color.mintDark} style={{ fontSize: 11 }}>자격 적합</Pill>
              </div>
              <div style={{ marginTop: 9, fontSize: 21, fontWeight: 900, letterSpacing: '-.025em' }}>iM 복리적금</div>
              <div style={{ marginTop: 8, fontSize: 13.5, lineHeight: 1.6, fontWeight: 700, color: 'rgba(22,25,28,.66)' }}>
                이자에 이자가 붙는 구조 · 3년 만기 · 기본금리 4.2% + 우대 1.5%p
              </div>
              <div
                onClick={() => navigate('/products')}
                style={{ marginTop: 16, height: 52, borderRadius: 9999, background: color.ink, color: '#fff', fontSize: 15, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, cursor: 'pointer' }}
              >
                상품 자세히 보기
                <span style={{ width: 24, height: 24, borderRadius: '50%', background: color.mint, color: color.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 }}>›</span>
              </div>
            </div>
            <div onClick={resetQuiz} style={{ textAlign: 'center', fontSize: 13.5, fontWeight: 700, color: 'rgba(22,25,28,.58)', cursor: 'pointer' }}>
              다시 풀기
            </div>
          </>
        )}
      </div>
    </Screen>
  );
}
