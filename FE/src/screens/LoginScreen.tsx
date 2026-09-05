import { useNavigate } from 'react-router-dom';
import { Screen, CtaButton, Brand } from '../components/ui';
import { color } from '../styles/theme';

export function LoginScreen() {
  const navigate = useNavigate();
  return (
    <Screen>
      <div style={{ position: 'absolute', top: -70, right: -90, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%,var(--im-light-blue),var(--im-mint) 72%)', opacity: 0.35 }} />
      <img
        src="/assets/dandi-pilot.png" alt="기장 단디"
        style={{ position: 'absolute', top: 58, right: -14, height: 226, width: 'auto', animation: 'nod 3.8s ease-in-out infinite', filter: 'drop-shadow(0 12px 24px rgba(var(--color-ink-rgb),.18))' }}
      />

      <div style={{ position: 'relative', padding: '78px 26px 34px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <Brand size={26} accent="var(--im-mint)" />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-60-text-secondary)' }}>정상까지, 한 걸음씩 같이 올라요</div>
        <div style={{ marginTop: 4, fontSize: 38, fontWeight: 'var(--font-weight-bold)', lineHeight: 'var(--line-height-snug)', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>
          오늘부터<br />등반 시작
        </div>

        <Field label="이메일 주소" placeholder="example@email.com" />
        <Field label="비밀번호" placeholder="••••••••" />

        <div style={{ marginTop: 'var(--space-2)', display: 'flex', justifyContent: 'center', gap: 'var(--space-1-5)', fontSize: 'var(--font-size-xs)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
          <span>비밀번호 찾기</span><span style={{ opacity: 0.3 }}>|</span><span>회원가입</span>
        </div>

        <div style={{ marginTop: 22, display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
          <div style={{ padding: '9px 15px', borderRadius: 'var(--radius-pill)', background: 'var(--color-30-surface-sub)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)' }}>신용조회 기록 없음</div>
          <div style={{ padding: '9px 15px', borderRadius: 'var(--radius-pill)', background: color.mint, color: color.ink, fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)' }}>가입 3분</div>
        </div>

        <CtaButton height={64} style={{ marginTop: 'var(--space-2-5)' }} arrowBg={color.bg} onClick={() => navigate('/consent')}>
          시작하기
        </CtaButton>
      </div>
    </Screen>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <>
      <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--font-size-2xs)', fontWeight: 'var(--font-weight-semibold)', letterSpacing: '.06em', color: 'var(--color-60-text-secondary)' }}>{label}</div>
      <div style={{ marginTop: 'var(--space-1)', height: 58, borderRadius: 'var(--radius-lg)', background: 'var(--color-30-surface-sub)', border: '1px solid var(--color-60-border)', display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-60-text-secondary)' }}>
        {placeholder}
      </div>
    </>
  );
}
