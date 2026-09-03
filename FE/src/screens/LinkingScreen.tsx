import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Screen, Pill } from '../components/ui';
import { color } from '../styles/theme';

const steps: { name: string; tag: string; done: boolean }[] = [
  { name: 'iM뱅크 계좌 3건', tag: '조회 완료', done: true },
  { name: '타 은행 계좌 2건', tag: '조회 완료', done: true },
  { name: '카드 내역 12개월', tag: '분석 중', done: false },
  { name: '고정 지출 패턴', tag: '대기', done: false },
];

/** 동의 2/4 — brief auto-advancing "linking your data" loader, then lands on /connect. */
export function LinkingScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => navigate('/connect'), 2400);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <Screen>
      <div style={{ padding: '70px 22px 34px', height: '100%', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        <Pill style={{ alignSelf: 'flex-end' }}>동의 2/4</Pill>
        <div style={{ marginTop: 20, fontSize: 17, fontWeight: 700, color: 'rgba(22,25,28,.6)' }}>잠시만요,</div>
        <div style={{ fontSize: 31, fontWeight: 900, letterSpacing: '-.04em', lineHeight: 1.16, marginTop: 1 }}>
          마이데이터를<br />연결하고 있어요
        </div>
        <div style={{ marginTop: 26, height: 10, borderRadius: 9999, background: 'rgba(22,25,28,.10)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: color.mint, borderRadius: 9999, animation: 'linkbar 2.4s ease-out forwards' }} />
        </div>
        <div style={{ marginTop: 22, background: '#fff', borderRadius: 28, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {steps.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  flex: 'none', width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 900, background: s.done ? color.mint : 'rgba(22,25,28,.12)', color: s.done ? color.ink : 'rgba(22,25,28,.5)',
                }}
              >
                {s.done ? '✓' : i + 1}
              </div>
              <span style={{ flex: 1, fontSize: 14.5, fontWeight: 900, letterSpacing: '-.015em' }}>{s.name}</span>
              <span style={{ flex: 'none', fontSize: 12, fontWeight: 900, color: s.done ? color.mintDark : 'rgba(22,25,28,.5)' }}>{s.tag}</span>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <img
          src="/assets/pair-map.png" alt="연결을 확인하는 단디와 똑디"
          style={{ width: '100%', maxWidth: 320, alignSelf: 'center', height: 'auto', display: 'block', animation: 'unfurl 3.2s ease-in-out infinite' }}
        />
      </div>
    </Screen>
  );
}
