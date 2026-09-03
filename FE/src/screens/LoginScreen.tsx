import { useNavigate } from 'react-router-dom';
import { Screen, CtaButton, Brand } from '../components/ui';
import { color } from '../styles/theme';

export function LoginScreen() {
  const navigate = useNavigate();
  return (
    <Screen>
      <div style={{ position: 'absolute', top: -70, right: -90, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle at 34% 30%,#53E1E5,#00A88F 72%)', opacity: 0.35 }} />
      <img
        src="/assets/dandi-pilot.png" alt="기장 단디"
        style={{ position: 'absolute', top: 58, right: -14, height: 226, width: 'auto', animation: 'nod 3.8s ease-in-out infinite', filter: 'drop-shadow(0 12px 24px rgba(22,25,28,.18))' }}
      />

      <div style={{ position: 'relative', padding: '78px 26px 34px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
        <Brand size={26} accent="#00A88F" />
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>정상까지, 한 걸음씩 같이 올라요</div>
        <div style={{ marginTop: 4, fontSize: 38, fontWeight: 900, lineHeight: 1.14, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>
          오늘부터<br />등반 시작
        </div>

        <Field label="이메일 주소" placeholder="example@email.com" />
        <Field label="비밀번호" placeholder="••••••••" />

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 14, fontSize: 13.5, fontWeight: 700, color: 'rgba(22,25,28,.58)' }}>
          <span>비밀번호 찾기</span><span style={{ opacity: 0.3 }}>|</span><span>회원가입</span>
        </div>

        <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ padding: '9px 15px', borderRadius: 9999, background: 'rgba(22,25,28,.12)', fontSize: 12.5, fontWeight: 900 }}>신용조회 기록 없음</div>
          <div style={{ padding: '9px 15px', borderRadius: 9999, background: color.mint, color: color.ink, fontSize: 12.5, fontWeight: 900 }}>가입 3분</div>
        </div>

        <CtaButton height={64} style={{ marginTop: 20 }} arrowBg={color.bg} onClick={() => navigate('/consent')}>
          시작하기
        </CtaButton>
      </div>
    </Screen>
  );
}

function Field({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <>
      <div style={{ marginTop: 16, fontSize: 12.5, fontWeight: 900, letterSpacing: '.06em', color: 'rgba(22,25,28,.61)' }}>{label}</div>
      <div style={{ marginTop: 8, height: 58, borderRadius: 18, background: 'rgba(22,25,28,.09)', border: '1px solid rgba(22,25,28,.14)', display: 'flex', alignItems: 'center', padding: '0 18px', fontSize: 15, fontWeight: 700, color: 'rgba(22,25,28,.58)' }}>
        {placeholder}
      </div>
    </>
  );
}
